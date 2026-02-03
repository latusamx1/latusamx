import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  queryBuilders,
} from '../firebase/firestore'
import type { Venue, EstadoVenue } from '@/types'

export interface VenueWithStats extends Venue {
  eventosEsteMes?: number
}

/**
 * Servicio para gestión de venues
 */
export class VenuesService {
  private collectionName = 'venues'

  /**
   * Obtener venue por ID
   */
  async getById(id: string): Promise<Venue | null> {
    return getDocument<Venue>(this.collectionName, id)
  }

  /**
   * Obtener todos los venues
   */
  async getAll(filters?: {
    estadoVenue?: EstadoVenue
    limit?: number
  }): Promise<Venue[]> {
    const constraints = []

    if (filters?.estadoVenue) {
      constraints.push(queryBuilders.where('estadoVenue', '==', filters.estadoVenue))
    }

    constraints.push(queryBuilders.orderBy('nombre', 'asc'))

    if (filters?.limit) {
      constraints.push(queryBuilders.limit(filters.limit))
    }

    return getDocuments<Venue>(this.collectionName, constraints)
  }

  /**
   * Obtener venues activos (para selects en formularios)
   */
  async getActivos(): Promise<Venue[]> {
    const constraints = [
      queryBuilders.where('estadoVenue', '==', 'activo'),
      queryBuilders.orderBy('nombre', 'asc'),
    ]

    return getDocuments<Venue>(this.collectionName, constraints)
  }

  /**
   * Crear nuevo venue
   */
  async create(venue: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return createDocument(this.collectionName, {
      ...venue,
      estadoVenue: venue.estadoVenue || 'activo',
    })
  }

  /**
   * Actualizar venue
   */
  async update(
    id: string,
    venue: Partial<Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    return updateDocument(this.collectionName, id, venue)
  }

  /**
   * Eliminar venue
   */
  async delete(id: string): Promise<void> {
    return deleteDocument(this.collectionName, id)
  }

  /**
   * Cambiar estado de venue
   */
  async changeEstado(id: string, estadoVenue: EstadoVenue): Promise<void> {
    return updateDocument(this.collectionName, id, { estadoVenue })
  }

  /**
   * Buscar venues por término
   */
  async search(searchTerm: string): Promise<Venue[]> {
    const venues = await this.getAll()
    const term = searchTerm.toLowerCase()

    return venues.filter(
      (venue) =>
        venue.nombre.toLowerCase().includes(term) ||
        venue.direccion.toLowerCase().includes(term) ||
        venue.ciudad.toLowerCase().includes(term)
    )
  }

  /**
   * Obtener capacidad total de todos los venues activos
   */
  async getCapacidadTotal(): Promise<number> {
    const venues = await this.getActivos()
    return venues.reduce((total, venue) => total + venue.capacidad, 0)
  }
}

// Exportar instancia singleton
export const venuesService = new VenuesService()
