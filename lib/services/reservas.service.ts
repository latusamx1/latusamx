import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  queryBuilders,
} from '../firebase/firestore'
import type { Reserva, EstadoReserva, Sucursal } from '@/types'

/**
 * Servicio para gestión de reservas
 */
export class ReservasService {
  private collectionName = 'reservas'
  private sucursalesCollection = 'sucursales'

  /**
   * Generar código único de reserva
   */
  private generateCodigoReserva(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `RES-${timestamp}-${random}`
  }

  /**
   * Obtener reserva por ID
   */
  async getById(id: string): Promise<Reserva | null> {
    const reserva = await getDocument<Reserva>(this.collectionName, id)

    if (reserva && reserva.sucursalId) {
      const sucursal = await getDocument<Sucursal>(
        this.sucursalesCollection,
        reserva.sucursalId
      )
      if (sucursal) {
        reserva.sucursal = sucursal
      }
    }

    return reserva
  }

  /**
   * Obtener reserva por código
   */
  async getByCodigo(codigo: string): Promise<Reserva | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('codigoReserva', '==', codigo)
      )
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
      } as Reserva
    } catch (error) {
      console.error('Error al obtener reserva por código:', error)
      throw error
    }
  }

  /**
   * Obtener todas las reservas
   */
  async getAll(filters?: {
    sucursalId?: string
    estado?: EstadoReserva
    fecha?: Date
    userId?: string
  }): Promise<Reserva[]> {
    const constraints = []

    if (filters?.sucursalId) {
      constraints.push(queryBuilders.where('sucursalId', '==', filters.sucursalId))
    }

    if (filters?.estado) {
      constraints.push(queryBuilders.where('estado', '==', filters.estado))
    }

    if (filters?.userId) {
      constraints.push(queryBuilders.where('userId', '==', filters.userId))
    }

    if (filters?.fecha) {
      const startOfDay = new Date(filters.fecha)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(filters.fecha)
      endOfDay.setHours(23, 59, 59, 999)

      constraints.push(
        queryBuilders.where('fecha', '>=', Timestamp.fromDate(startOfDay)),
        queryBuilders.where('fecha', '<=', Timestamp.fromDate(endOfDay))
      )
    }

    constraints.push(queryBuilders.orderBy('fecha', 'desc'))

    return getDocuments<Reserva>(this.collectionName, constraints)
  }

  /**
   * Obtener reservas de un usuario
   */
  async getByUser(
    userId: string,
    estado?: EstadoReserva
  ): Promise<Reserva[]> {
    const constraints = [queryBuilders.where('userId', '==', userId)]

    if (estado) {
      constraints.push(queryBuilders.where('estado', '==', estado))
    }

    constraints.push(queryBuilders.orderBy('fecha', 'desc'))

    return getDocuments<Reserva>(this.collectionName, constraints)
  }

  /**
   * Obtener reservas próximas de un usuario
   */
  async getProximasByUser(userId: string): Promise<Reserva[]> {
    const ahora = new Date()
    const constraints = [
      queryBuilders.where('userId', '==', userId),
      queryBuilders.where('fecha', '>=', Timestamp.fromDate(ahora)),
      queryBuilders.where('estado', 'in', ['pendiente', 'confirmada']),
      queryBuilders.orderBy('fecha', 'asc'),
    ]

    return getDocuments<Reserva>(this.collectionName, constraints)
  }

  /**
   * Obtener reservas de una sucursal en una fecha
   */
  async getBySucursalAndFecha(
    sucursalId: string,
    fecha: Date
  ): Promise<Reserva[]> {
    const startOfDay = new Date(fecha)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(fecha)
    endOfDay.setHours(23, 59, 59, 999)

    const constraints = [
      queryBuilders.where('sucursalId', '==', sucursalId),
      queryBuilders.where('fecha', '>=', Timestamp.fromDate(startOfDay)),
      queryBuilders.where('fecha', '<=', Timestamp.fromDate(endOfDay)),
      queryBuilders.orderBy('fecha', 'asc'),
    ]

    return getDocuments<Reserva>(this.collectionName, constraints)
  }

  /**
   * Crear nueva reserva
   */
  async create(
    reserva: Omit<Reserva, 'id' | 'codigoReserva' | 'qrCode' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const codigoReserva = this.generateCodigoReserva()

    return createDocument(this.collectionName, {
      ...reserva,
      codigoReserva,
      qrCode: codigoReserva,
      fecha: Timestamp.fromDate(reserva.fecha),
    })
  }

  /**
   * Actualizar reserva
   */
  async update(
    id: string,
    reserva: Partial<Omit<Reserva, 'id' | 'codigoReserva' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    const updateData: any = { ...reserva }

    if (reserva.fecha) {
      updateData.fecha = Timestamp.fromDate(reserva.fecha)
    }

    return updateDocument(this.collectionName, id, updateData)
  }

  /**
   * Cancelar reserva
   */
  async cancelar(id: string, motivo?: string): Promise<void> {
    return updateDocument(this.collectionName, id, {
      estado: 'cancelada',
      canceladaAt: Timestamp.now(),
      notasCancelacion: motivo,
    })
  }

  /**
   * Confirmar reserva
   */
  async confirmar(id: string): Promise<void> {
    return updateDocument(this.collectionName, id, {
      estado: 'confirmada',
      confirmadaAt: Timestamp.now(),
    })
  }

  /**
   * Marcar como sentado
   */
  async marcarSentado(id: string, mesaId: string): Promise<void> {
    return updateDocument(this.collectionName, id, {
      estado: 'sentado',
      mesaId,
      sentadoAt: Timestamp.now(),
    })
  }

  /**
   * Marcar como completada
   */
  async completar(id: string): Promise<void> {
    return updateDocument(this.collectionName, id, {
      estado: 'completada',
      completadaAt: Timestamp.now(),
    })
  }

  /**
   * Marcar como no-show
   */
  async marcarNoShow(id: string): Promise<void> {
    return updateDocument(this.collectionName, id, {
      estado: 'no-show',
    })
  }

  /**
   * Eliminar reserva
   */
  async delete(id: string): Promise<void> {
    return deleteDocument(this.collectionName, id)
  }

  /**
   * Verificar disponibilidad de horario
   */
  async verificarDisponibilidad(
    sucursalId: string,
    fecha: Date,
    hora: string,
    personas: number
  ): Promise<boolean> {
    const reservas = await this.getBySucursalAndFecha(sucursalId, fecha)

    // Filtrar reservas en el mismo horario (±30 minutos)
    const reservasEnHorario = reservas.filter((reserva) => {
      if (reserva.estado === 'cancelada' || reserva.estado === 'no-show') {
        return false
      }

      const horaReserva = parseInt(reserva.hora.split(':')[0])
      const minutosReserva = parseInt(reserva.hora.split(':')[1])
      const [horaConsulta, minutosConsulta] = hora.split(':').map(Number)

      const diffMinutos =
        Math.abs((horaReserva * 60 + minutosReserva) - (horaConsulta * 60 + minutosConsulta))

      return diffMinutos <= 30
    })

    // Calcular capacidad total usada
    const capacidadUsada = reservasEnHorario.reduce(
      (total, reserva) => total + reserva.personas,
      0
    )

    // Obtener capacidad de la sucursal
    const sucursal = await getDocument<Sucursal>(
      this.sucursalesCollection,
      sucursalId
    )

    if (!sucursal) return false

    return capacidadUsada + personas <= sucursal.capacidad
  }
}

// Exportar instancia singleton
export const reservasService = new ReservasService()
