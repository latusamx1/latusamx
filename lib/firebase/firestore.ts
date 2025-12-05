import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryConstraint,
  DocumentSnapshot,
  Timestamp,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from './config'

/**
 * Obtener un documento por ID
 */
export const getDocument = async <T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as T
    }

    return null
  } catch (error) {
    console.error(`Error al obtener documento de ${collectionName}:`, error)
    throw error
  }
}

/**
 * Obtener todos los documentos de una colección
 */
export const getDocuments = async <T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, ...constraints)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[]
  } catch (error) {
    console.error(`Error al obtener documentos de ${collectionName}:`, error)
    throw error
  }
}

/**
 * Crear un nuevo documento
 */
export const createDocument = async <T = DocumentData>(
  collectionName: string,
  data: Partial<T>
): Promise<string> => {
  try {
    const collectionRef = collection(db, collectionName)
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    const docRef = await addDoc(collectionRef, docData)
    return docRef.id
  } catch (error) {
    console.error(`Error al crear documento en ${collectionName}:`, error)
    throw error
  }
}

/**
 * Crear documento con ID personalizado
 */
export const setDocument = async <T = DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>,
  merge = true
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId)
    const docData = {
      ...data,
      updatedAt: serverTimestamp(),
    }

    if (!merge) {
      docData.createdAt = serverTimestamp()
    }

    await setDoc(docRef, docData, { merge })
  } catch (error) {
    console.error(`Error al establecer documento en ${collectionName}:`, error)
    throw error
  }
}

/**
 * Actualizar un documento
 */
export const updateDocument = async <T = DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error(`Error al actualizar documento en ${collectionName}:`, error)
    throw error
  }
}

/**
 * Eliminar un documento
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error al eliminar documento de ${collectionName}:`, error)
    throw error
  }
}

/**
 * Batch operations - Escribir múltiples documentos a la vez
 */
export const batchWrite = async (
  operations: Array<{
    type: 'create' | 'update' | 'delete'
    collection: string
    id?: string
    data?: any
  }>
): Promise<void> => {
  try {
    const batch = writeBatch(db)

    operations.forEach((operation) => {
      if (operation.type === 'delete' && operation.id) {
        const docRef = doc(db, operation.collection, operation.id)
        batch.delete(docRef)
      } else if (operation.type === 'update' && operation.id) {
        const docRef = doc(db, operation.collection, operation.id)
        batch.update(docRef, {
          ...operation.data,
          updatedAt: serverTimestamp(),
        })
      } else if (operation.type === 'create') {
        if (operation.id) {
          const docRef = doc(db, operation.collection, operation.id)
          batch.set(docRef, {
            ...operation.data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        } else {
          const collectionRef = collection(db, operation.collection)
          const docRef = doc(collectionRef)
          batch.set(docRef, {
            ...operation.data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }
      }
    })

    await batch.commit()
  } catch (error) {
    console.error('Error en batch write:', error)
    throw error
  }
}

/**
 * Convertir Timestamp de Firestore a Date
 */
export const timestampToDate = (timestamp: Timestamp | any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  if (timestamp?.toDate) {
    return timestamp.toDate()
  }
  return new Date(timestamp)
}

/**
 * Query builders - Helpers para construir queries
 */
export const queryBuilders = {
  where,
  orderBy,
  limit,
  startAfter,
}

export type { DocumentSnapshot, QueryConstraint }
