import {
  collection,
  query,
  where,
  orderBy,
  limit,
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
import type { Evento, EstadoEvento, CategoriaEvento, Venue } from '@/types'

/**
 * Servicio para gestión de eventos
 */
export class EventosService {
  private collectionName = 'eventos'
  private venuesCollection = 'venues'

  /**
   * Obtener evento por ID
   */
  async getById(id: string): Promise<Evento | null> {
    const evento = await getDocument<Evento>(this.collectionName, id)

    if (evento && evento.venueId) {
      const venue = await getDocument<Venue>(this.venuesCollection, evento.venueId)
      if (venue) {
        evento.venue = venue
      }
    }

    return evento
  }

  /**
   * Obtener todos los eventos
   */
  async getAll(filters?: {
    estado?: EstadoEvento
    categoria?: CategoriaEvento
    limit?: number
  }): Promise<Evento[]> {
    const constraints = []

    if (filters?.estado) {
      constraints.push(queryBuilders.where('estado', '==', filters.estado))
    }

    if (filters?.categoria) {
      constraints.push(queryBuilders.where('categoria', '==', filters.categoria))
    }

    constraints.push(queryBuilders.orderBy('fecha', 'asc'))

    if (filters?.limit) {
      constraints.push(queryBuilders.limit(filters.limit))
    }

    return getDocuments<Evento>(this.collectionName, constraints)
  }

  /**
   * Obtener eventos publicados (para clientes)
   */
  async getPublicados(filters?: {
    categoria?: CategoriaEvento
    fechaDesde?: Date
    limit?: number
  }): Promise<Evento[]> {
    const constraints = [queryBuilders.where('estado', '==', 'publicado')]

    if (filters?.categoria) {
      constraints.push(queryBuilders.where('categoria', '==', filters.categoria))
    }

    if (filters?.fechaDesde) {
      constraints.push(
        queryBuilders.where('fecha', '>=', Timestamp.fromDate(filters.fechaDesde))
      )
    }

    constraints.push(queryBuilders.orderBy('fecha', 'asc'))

    if (filters?.limit) {
      constraints.push(queryBuilders.limit(filters.limit))
    }

    return getDocuments<Evento>(this.collectionName, constraints)
  }

  /**
   * Obtener eventos destacados
   */
  async getDestacados(limit: number = 6): Promise<Evento[]> {
    const constraints = [
      queryBuilders.where('estado', '==', 'publicado'),
      queryBuilders.where('destacado', '==', true),
      queryBuilders.orderBy('fecha', 'asc'),
      queryBuilders.limit(limit),
    ]

    return getDocuments<Evento>(this.collectionName, constraints)
  }

  /**
   * Crear nuevo evento
   */
  async create(evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return createDocument(this.collectionName, {
      ...evento,
      fecha: Timestamp.fromDate(evento.fecha),
      fechaFin: evento.fechaFin ? Timestamp.fromDate(evento.fechaFin) : null,
    })
  }

  /**
   * Actualizar evento
   */
  async update(
    id: string,
    evento: Partial<Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    const updateData: any = { ...evento }

    if (evento.fecha) {
      updateData.fecha = Timestamp.fromDate(evento.fecha)
    }

    if (evento.fechaFin) {
      updateData.fechaFin = Timestamp.fromDate(evento.fechaFin)
    }

    return updateDocument(this.collectionName, id, updateData)
  }

  /**
   * Eliminar evento
   */
  async delete(id: string): Promise<void> {
    return deleteDocument(this.collectionName, id)
  }

  /**
   * Cambiar estado de evento
   */
  async changeEstado(id: string, estado: EstadoEvento): Promise<void> {
    return updateDocument(this.collectionName, id, { estado })
  }

  /**
   * Marcar/desmarcar evento como destacado
   */
  async toggleDestacado(id: string, destacado: boolean): Promise<void> {
    return updateDocument(this.collectionName, id, { destacado })
  }

  /**
   * Buscar eventos por término
   */
  async search(searchTerm: string): Promise<Evento[]> {
    // Firebase no soporta búsqueda full-text nativa
    // Esta es una implementación básica
    // Para producción, considera usar Algolia o ElasticSearch
    const eventos = await this.getAll()

    const term = searchTerm.toLowerCase()
    return eventos.filter(
      (evento) =>
        evento.titulo.toLowerCase().includes(term) ||
        evento.descripcion.toLowerCase().includes(term)
    )
  }

  /**
   * Actualizar disponibilidad de tickets
   */
  async updateTicketsDisponibles(
    eventoId: string,
    tipoTicketId: string,
    cantidad: number
  ): Promise<void> {
    const evento = await this.getById(eventoId)
    if (!evento) throw new Error('Evento no encontrado')

    const tiposTickets = evento.tiposTickets.map((tipo) => {
      if (tipo.id === tipoTicketId) {
        return {
          ...tipo,
          disponibles: Math.max(0, tipo.disponibles - cantidad),
        }
      }
      return tipo
    })

    await this.update(eventoId, { tiposTickets })
  }
}

// Exportar instancia singleton
export const eventosService = new EventosService()
