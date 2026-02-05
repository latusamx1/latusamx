import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  queryBuilders,
} from '../firebase/firestore'
import type { CodigoDescuento } from '@/types'

export type EstadoCodigo = 'activo' | 'programado' | 'expirado' | 'agotado'

export interface CodigoDescuentoWithStats extends CodigoDescuento {
  estado: EstadoCodigo
  ahorroTotal: number
}

export interface ValidacionDescuento {
  valido: boolean
  mensaje: string
  descuento?: number
  tipo?: 'porcentaje' | 'monto'
  codigo?: CodigoDescuento
}

/**
 * Servicio para gestión de códigos de descuento
 */
export class DescuentosService {
  private collectionName = 'codigosDescuento'

  /**
   * Obtener código por ID
   */
  async getById(id: string): Promise<CodigoDescuento | null> {
    return getDocument<CodigoDescuento>(this.collectionName, id)
  }

  /**
   * Obtener código por su valor (el código en sí)
   */
  async getByCodigo(codigo: string): Promise<CodigoDescuento | null> {
    const constraints = [
      queryBuilders.where('codigo', '==', codigo.toUpperCase()),
      queryBuilders.limit(1),
    ]
    const results = await getDocuments<CodigoDescuento>(this.collectionName, constraints)
    return results[0] || null
  }

  /**
   * Obtener todos los códigos
   */
  async getAll(filters?: {
    activo?: boolean
    limit?: number
  }): Promise<CodigoDescuento[]> {
    const constraints = []

    if (filters?.activo !== undefined) {
      constraints.push(queryBuilders.where('activo', '==', filters.activo))
    }

    constraints.push(queryBuilders.orderBy('createdAt', 'desc'))

    if (filters?.limit) {
      constraints.push(queryBuilders.limit(filters.limit))
    }

    return getDocuments<CodigoDescuento>(this.collectionName, constraints)
  }

  /**
   * Obtener códigos con estado calculado
   */
  async getAllWithStats(): Promise<CodigoDescuentoWithStats[]> {
    const codigos = await this.getAll()
    const now = new Date()

    return codigos.map((codigo) => {
      const fechaInicio = codigo.fechaInicio instanceof Date
        ? codigo.fechaInicio
        : (codigo.fechaInicio as any)?.toDate?.() || new Date(codigo.fechaInicio)
      const fechaFin = codigo.fechaFin instanceof Date
        ? codigo.fechaFin
        : (codigo.fechaFin as any)?.toDate?.() || new Date(codigo.fechaFin)

      let estado: EstadoCodigo = 'activo'

      if (!codigo.activo) {
        estado = 'expirado'
      } else if (codigo.usosMaximos && codigo.usos >= codigo.usosMaximos) {
        estado = 'agotado'
      } else if (fechaFin < now) {
        estado = 'expirado'
      } else if (fechaInicio > now) {
        estado = 'programado'
      }

      // Calcular ahorro total (aproximado basado en usos y valor)
      const ahorroTotal = codigo.tipo === 'monto'
        ? codigo.usos * codigo.valor
        : codigo.usos * (codigo.valor * 10) // Estimado para porcentajes

      return {
        ...codigo,
        estado,
        ahorroTotal,
      }
    })
  }

  /**
   * Crear nuevo código
   */
  async create(codigo: Omit<CodigoDescuento, 'id' | 'usos' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return createDocument(this.collectionName, {
      ...codigo,
      codigo: codigo.codigo.toUpperCase(),
      usos: 0,
    })
  }

  /**
   * Actualizar código
   */
  async update(
    id: string,
    codigo: Partial<Omit<CodigoDescuento, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    const updateData = { ...codigo }
    if (updateData.codigo) {
      updateData.codigo = updateData.codigo.toUpperCase()
    }
    return updateDocument(this.collectionName, id, updateData)
  }

  /**
   * Eliminar código
   */
  async delete(id: string): Promise<void> {
    return deleteDocument(this.collectionName, id)
  }

  /**
   * Activar/Desactivar código
   */
  async toggleActivo(id: string, activo: boolean): Promise<void> {
    return updateDocument(this.collectionName, id, { activo })
  }

  /**
   * Incrementar uso del código
   */
  async incrementarUso(id: string): Promise<void> {
    const codigo = await this.getById(id)
    if (codigo) {
      return updateDocument(this.collectionName, id, { usos: codigo.usos + 1 })
    }
  }

  /**
   * Validar código de descuento
   */
  async validarCodigo(
    codigoStr: string,
    eventoId?: string,
    subtotal?: number
  ): Promise<ValidacionDescuento> {
    const codigo = await this.getByCodigo(codigoStr)

    if (!codigo) {
      return {
        valido: false,
        mensaje: 'Código no encontrado',
      }
    }

    const now = new Date()
    const fechaInicio = codigo.fechaInicio instanceof Date
      ? codigo.fechaInicio
      : (codigo.fechaInicio as any)?.toDate?.() || new Date(codigo.fechaInicio)
    const fechaFin = codigo.fechaFin instanceof Date
      ? codigo.fechaFin
      : (codigo.fechaFin as any)?.toDate?.() || new Date(codigo.fechaFin)

    // Verificar si está activo
    if (!codigo.activo) {
      return {
        valido: false,
        mensaje: 'Este código no está activo',
      }
    }

    // Verificar fechas
    if (now < fechaInicio) {
      return {
        valido: false,
        mensaje: 'Este código aún no está vigente',
      }
    }

    if (now > fechaFin) {
      return {
        valido: false,
        mensaje: 'Este código ha expirado',
      }
    }

    // Verificar usos máximos
    if (codigo.usosMaximos && codigo.usos >= codigo.usosMaximos) {
      return {
        valido: false,
        mensaje: 'Este código ha alcanzado el límite de usos',
      }
    }

    // Verificar si aplica al evento
    if (eventoId && codigo.eventosAplicables && codigo.eventosAplicables.length > 0) {
      if (!codigo.eventosAplicables.includes(eventoId)) {
        return {
          valido: false,
          mensaje: 'Este código no aplica para este evento',
        }
      }
    }

    // Calcular descuento
    let descuento = 0
    if (subtotal) {
      if (codigo.tipo === 'porcentaje') {
        descuento = subtotal * (codigo.valor / 100)
      } else {
        descuento = Math.min(codigo.valor, subtotal)
      }
    }

    return {
      valido: true,
      mensaje: codigo.tipo === 'porcentaje'
        ? `${codigo.valor}% de descuento aplicado`
        : `$${codigo.valor} de descuento aplicado`,
      descuento,
      tipo: codigo.tipo,
      codigo,
    }
  }

  /**
   * Obtener estadísticas de códigos
   */
  async getEstadisticas(): Promise<{
    codigosActivos: number
    usosEsteMes: number
    descuentoTotal: number
  }> {
    const codigos = await this.getAllWithStats()
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const codigosActivos = codigos.filter((c) => c.estado === 'activo').length
    const usosEsteMes = codigos.reduce((sum, c) => sum + c.usos, 0) // Simplificado
    const descuentoTotal = codigos.reduce((sum, c) => sum + c.ahorroTotal, 0)

    return {
      codigosActivos,
      usosEsteMes,
      descuentoTotal,
    }
  }
}

// Exportar instancia singleton
export const descuentosService = new DescuentosService()
