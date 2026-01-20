/**
 * Servicio de Control de Inventario de Tickets
 *
 * Implementa control atómico de stock para prevenir overselling
 * Utiliza transacciones de Firestore para garantizar consistencia
 */

import { db } from '@/lib/firebase/config'
import {
  doc,
  runTransaction,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  getDoc
} from 'firebase/firestore'
import { Evento, TipoTicket } from '@/types'

// ============================================
// TIPOS
// ============================================

export interface ReservaTicket {
  id?: string
  eventoId: string
  tipoTicketId: string
  cantidad: number
  userId: string
  sessionId: string
  expiresAt: Timestamp
  createdAt: Timestamp
}

export interface ResultadoReserva {
  success: boolean
  reservaId?: string
  error?: string
  disponibles?: number
}

export interface ResultadoCompra {
  success: boolean
  error?: string
  eventoActualizado?: boolean
}

// ============================================
// CONSTANTES
// ============================================

const TIEMPO_RESERVA_MINUTOS = 10 // Tiempo de reserva temporal
const COLECCION_RESERVAS = 'reservas_tickets'

// ============================================
// SERVICIO DE INVENTARIO
// ============================================

class InventarioService {
  /**
   * Verifica disponibilidad de tickets SIN hacer cambios
   * Útil para mostrar stock en tiempo real
   */
  async verificarDisponibilidad(
    eventoId: string,
    tipoTicketId: string,
    cantidadSolicitada: number
  ): Promise<{ disponible: boolean; cantidadDisponible: number; mensaje?: string }> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      const eventoRef = doc(db, 'eventos', eventoId)
      const eventoSnap = await getDoc(eventoRef)

      if (!eventoSnap.exists()) {
        return {
          disponible: false,
          cantidadDisponible: 0,
          mensaje: 'Evento no encontrado'
        }
      }

      const evento = eventoSnap.data() as Evento
      const tipoTicket = evento.tiposTickets?.find(t => t.id === tipoTicketId)

      if (!tipoTicket) {
        return {
          disponible: false,
          cantidadDisponible: 0,
          mensaje: 'Tipo de ticket no encontrado'
        }
      }

      // Considerar reservas activas
      const reservasActivas = await this.obtenerReservasActivas(eventoId, tipoTicketId)
      const cantidadReservada = reservasActivas.reduce((sum, r) => sum + r.cantidad, 0)
      const disponiblesReales = tipoTicket.disponibles - cantidadReservada

      const disponible = disponiblesReales >= cantidadSolicitada

      return {
        disponible,
        cantidadDisponible: Math.max(0, disponiblesReales),
        mensaje: disponible ? undefined : `Solo quedan ${disponiblesReales} tickets disponibles`
      }
    } catch (error) {
      console.error('Error verificando disponibilidad:', error)
      return {
        disponible: false,
        cantidadDisponible: 0,
        mensaje: 'Error al verificar disponibilidad'
      }
    }
  }

  /**
   * Crea una reserva temporal de tickets
   * Útil para el proceso de checkout (usuario tiene 10 minutos para completar)
   */
  async crearReservaTemporal(
    eventoId: string,
    tipoTicketId: string,
    cantidad: number,
    userId: string,
    sessionId: string
  ): Promise<ResultadoReserva> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      // Limpiar reservas expiradas primero
      await this.limpiarReservasExpiradas(eventoId, tipoTicketId)

      // Verificar disponibilidad
      const verificacion = await this.verificarDisponibilidad(eventoId, tipoTicketId, cantidad)

      if (!verificacion.disponible) {
        return {
          success: false,
          error: verificacion.mensaje || 'No hay suficiente stock',
          disponibles: verificacion.cantidadDisponible
        }
      }

      // Crear reserva temporal
      const reservasRef = collection(db, COLECCION_RESERVAS)
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + TIEMPO_RESERVA_MINUTOS)

      const reservaData: ReservaTicket = {
        eventoId,
        tipoTicketId,
        cantidad,
        userId,
        sessionId,
        expiresAt: Timestamp.fromDate(expiresAt),
        createdAt: Timestamp.now()
      }

      const reservaDoc = await addDoc(reservasRef, reservaData)

      return {
        success: true,
        reservaId: reservaDoc.id,
        disponibles: verificacion.cantidadDisponible - cantidad
      }
    } catch (error) {
      console.error('Error creando reserva:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Libera una reserva temporal (usuario canceló o expiró el tiempo)
   */
  async liberarReserva(reservaId: string): Promise<void> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      const reservaRef = doc(db, COLECCION_RESERVAS, reservaId)
      await deleteDoc(reservaRef)
    } catch (error) {
      console.error('Error liberando reserva:', error)
      throw error
    }
  }

  /**
   * Confirma una compra y actualiza el stock ATÓMICAMENTE
   * Esta es la función crítica que previene overselling
   */
  async confirmarCompra(
    eventoId: string,
    tipoTicketId: string,
    cantidad: number,
    reservaId?: string
  ): Promise<ResultadoCompra> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      const result = await runTransaction(db, async transaction => {
        // 1. Leer el evento
        const eventoRef = doc(db, 'eventos', eventoId)
        const eventoSnap = await transaction.get(eventoRef)

        if (!eventoSnap.exists()) {
          throw new Error('Evento no encontrado')
        }

        const evento = eventoSnap.data() as Evento
        const tiposTickets = evento.tiposTickets || []

        // 2. Encontrar el tipo de ticket
        const tipoTicketIndex = tiposTickets.findIndex(t => t.id === tipoTicketId)

        if (tipoTicketIndex === -1) {
          throw new Error('Tipo de ticket no encontrado')
        }

        const tipoTicket = tiposTickets[tipoTicketIndex]

        // 3. VERIFICACIÓN CRÍTICA: ¿Hay suficiente stock?
        if (tipoTicket.disponibles < cantidad) {
          throw new Error(
            `Stock insuficiente. Disponibles: ${tipoTicket.disponibles}, Solicitados: ${cantidad}`
          )
        }

        // 4. Decrementar stock ATÓMICAMENTE
        tiposTickets[tipoTicketIndex] = {
          ...tipoTicket,
          disponibles: tipoTicket.disponibles - cantidad
        }

        // 5. Actualizar el documento
        transaction.update(eventoRef, {
          tiposTickets: tiposTickets,
          updatedAt: Timestamp.now()
        })

        // 6. Si hay reserva, eliminarla dentro de la transacción
        if (reservaId) {
          const reservaRef = doc(db, COLECCION_RESERVAS, reservaId)
          transaction.delete(reservaRef)
        }

        return { success: true, eventoActualizado: true }
      })

      return result
    } catch (error) {
      console.error('Error confirmando compra:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en la transacción',
        eventoActualizado: false
      }
    }
  }

  /**
   * Revierte una compra (reembolso, cancelación)
   * Devuelve el stock al inventario
   */
  async revertirCompra(
    eventoId: string,
    tipoTicketId: string,
    cantidad: number
  ): Promise<ResultadoCompra> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      const result = await runTransaction(db, async transaction => {
        const eventoRef = doc(db, 'eventos', eventoId)
        const eventoSnap = await transaction.get(eventoRef)

        if (!eventoSnap.exists()) {
          throw new Error('Evento no encontrado')
        }

        const evento = eventoSnap.data() as Evento
        const tiposTickets = evento.tiposTickets || []

        const tipoTicketIndex = tiposTickets.findIndex(t => t.id === tipoTicketId)

        if (tipoTicketIndex === -1) {
          throw new Error('Tipo de ticket no encontrado')
        }

        const tipoTicket = tiposTickets[tipoTicketIndex]

        // Incrementar stock (no puede superar la cantidad total)
        const nuevoDisponible = Math.min(
          tipoTicket.disponibles + cantidad,
          tipoTicket.cantidad
        )

        tiposTickets[tipoTicketIndex] = {
          ...tipoTicket,
          disponibles: nuevoDisponible
        }

        transaction.update(eventoRef, {
          tiposTickets: tiposTickets,
          updatedAt: Timestamp.now()
        })

        return { success: true, eventoActualizado: true }
      })

      return result
    } catch (error) {
      console.error('Error revirtiendo compra:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en la transacción',
        eventoActualizado: false
      }
    }
  }

  /**
   * Obtiene todas las reservas activas (no expiradas)
   */
  private async obtenerReservasActivas(
    eventoId: string,
    tipoTicketId: string
  ): Promise<ReservaTicket[]> {
    if (!db) throw new Error('Firebase no inicializado')

    const ahora = Timestamp.now()
    const reservasRef = collection(db, COLECCION_RESERVAS)
    const q = query(
      reservasRef,
      where('eventoId', '==', eventoId),
      where('tipoTicketId', '==', tipoTicketId),
      where('expiresAt', '>', ahora)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReservaTicket))
  }

  /**
   * Limpia reservas expiradas de un tipo de ticket
   */
  async limpiarReservasExpiradas(eventoId: string, tipoTicketId: string): Promise<number> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      const ahora = Timestamp.now()
      const reservasRef = collection(db, COLECCION_RESERVAS)
      const q = query(
        reservasRef,
        where('eventoId', '==', eventoId),
        where('tipoTicketId', '==', tipoTicketId),
        where('expiresAt', '<', ahora)
      )

      const snapshot = await getDocs(q)
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)

      return snapshot.size
    } catch (error) {
      console.error('Error limpiando reservas:', error)
      return 0
    }
  }

  /**
   * Obtiene reservas de un usuario específico
   */
  async obtenerReservasUsuario(userId: string): Promise<ReservaTicket[]> {
    if (!db) throw new Error('Firebase no inicializado')

    const ahora = Timestamp.now()
    const reservasRef = collection(db, COLECCION_RESERVAS)
    const q = query(
      reservasRef,
      where('userId', '==', userId),
      where('expiresAt', '>', ahora)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReservaTicket))
  }

  /**
   * Job de limpieza global (ejecutar periódicamente)
   */
  async limpiezaGlobal(): Promise<{ eliminadas: number }> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      const ahora = Timestamp.now()
      const reservasRef = collection(db, COLECCION_RESERVAS)
      const q = query(reservasRef, where('expiresAt', '<', ahora))

      const snapshot = await getDocs(q)
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)

      return { eliminadas: snapshot.size }
    } catch (error) {
      console.error('Error en limpieza global:', error)
      return { eliminadas: 0 }
    }
  }
}

// ============================================
// EXPORTAR INSTANCIA ÚNICA
// ============================================

export const inventarioService = new InventarioService()
