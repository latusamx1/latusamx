import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { getDocument, updateDocument } from '../firebase/firestore'
import type { Usuario, Rol } from '@/types'

/**
 * Servicio para gestión de usuarios
 */
export class UsuariosService {
  private collectionName = 'usuarios'

  /**
   * Obtener usuario por ID
   */
  async getById(uid: string): Promise<Usuario | null> {
    return getDocument<Usuario>(this.collectionName, uid)
  }

  /**
   * Obtener usuario por email
   */
  async getByEmail(email: string): Promise<Usuario | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('email', '==', email)
      )
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const doc = querySnapshot.docs[0]
      return {
        uid: doc.id,
        ...doc.data(),
      } as Usuario
    } catch (error) {
      console.error('Error al obtener usuario por email:', error)
      throw error
    }
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(
    uid: string,
    data: Partial<Omit<Usuario, 'uid' | 'email' | 'createdAt'>>
  ): Promise<void> {
    return updateDocument(this.collectionName, uid, data)
  }

  /**
   * Cambiar rol de usuario (solo admin)
   */
  async updateRole(uid: string, rol: Rol): Promise<void> {
    return updateDocument(this.collectionName, uid, { rol })
  }

  /**
   * Obtener todos los usuarios por rol
   */
  async getByRole(rol: Rol): Promise<Usuario[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('rol', '==', rol)
      )
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as Usuario[]
    } catch (error) {
      console.error('Error al obtener usuarios por rol:', error)
      throw error
    }
  }

  /**
   * Obtener todos los usuarios
   */
  async getAll(): Promise<Usuario[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName))

      return querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as Usuario[]
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error)
      throw error
    }
  }

  /**
   * Verificar si un usuario tiene un rol específico
   */
  async hasRole(uid: string, rol: Rol): Promise<boolean> {
    const user = await this.getById(uid)
    return user?.rol === rol
  }

  /**
   * Verificar si un usuario es admin
   */
  async isAdmin(uid: string): Promise<boolean> {
    return this.hasRole(uid, 'admin')
  }

  /**
   * Verificar si un usuario es host
   */
  async isHost(uid: string): Promise<boolean> {
    return this.hasRole(uid, 'host')
  }
}

// Exportar instancia singleton
export const usuariosService = new UsuariosService()
