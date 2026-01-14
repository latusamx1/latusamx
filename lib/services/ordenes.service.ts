/**
 * Servicio para gestión de órdenes de tickets
 */

import { db } from '@/lib/firebase/config'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
} from 'firebase/firestore'
import { Orden, EstadoOrden, ItemOrden, MetodoPago } from '@/types'

export interface CreateOrdenData {
  userId: string
  eventoId: string
  items: ItemOrden[]
  subtotal: number
  descuento: number
  total: number
  codigoDescuento?: string
  metodoPago: MetodoPago
  datosComprador: {
    nombre: string
    email: string
    telefono: string
  }
}

class OrdenesService {
  private collectionName = 'ordenes'

  /**
   * Crear una nueva orden
   */
  async crear(data: CreateOrdenData): Promise<string> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      const ordenData = {
        ...data,
        estado: 'pendiente' as EstadoOrden,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      const docRef = await addDoc(collection(db, this.collectionName), ordenData)
      return docRef.id
    } catch (error) {
      console.error('Error al crear orden:', error)
      throw new Error('Error al crear la orden')
    }
  }

  /**
   * Obtener una orden por ID
   */
  async obtenerPorId(ordenId: string): Promise<Orden | null> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      const docRef = doc(db, this.collectionName, ordenId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return null
      }

      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
        pagadoAt: docSnap.data().pagadoAt?.toDate(),
        canceladoAt: docSnap.data().canceladoAt?.toDate(),
      } as Orden
    } catch (error) {
      console.error('Error al obtener orden:', error)
      throw new Error('Error al obtener la orden')
    }
  }

  /**
   * Obtener órdenes de un usuario
   */
  async obtenerPorUsuario(userId: string): Promise<Orden[]> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        pagadoAt: doc.data().pagadoAt?.toDate(),
        canceladoAt: doc.data().canceladoAt?.toDate(),
      })) as Orden[]
    } catch (error) {
      console.error('Error al obtener órdenes del usuario:', error)
      throw new Error('Error al obtener las órdenes')
    }
  }

  /**
   * Actualizar estado de orden
   */
  async actualizarEstado(ordenId: string, estado: EstadoOrden): Promise<void> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      const docRef = doc(db, this.collectionName, ordenId)
      const updateData: DocumentData = {
        estado,
        updatedAt: Timestamp.now(),
      }

      if (estado === 'pagada') {
        updateData.pagadoAt = Timestamp.now()
      } else if (estado === 'cancelada') {
        updateData.canceladoAt = Timestamp.now()
      }

      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error)
      throw new Error('Error al actualizar el estado de la orden')
    }
  }

  /**
   * Obtener órdenes por evento
   */
  async obtenerPorEvento(eventoId: string): Promise<Orden[]> {
    if (!db) throw new Error('Firebase no inicializado')

    try {
      const q = query(
        collection(db, this.collectionName),
        where('eventoId', '==', eventoId),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        pagadoAt: doc.data().pagadoAt?.toDate(),
        canceladoAt: doc.data().canceladoAt?.toDate(),
      })) as Orden[]
    } catch (error) {
      console.error('Error al obtener órdenes del evento:', error)
      throw new Error('Error al obtener las órdenes del evento')
    }
  }
}

export const ordenesService = new OrdenesService()
export { OrdenesService }
