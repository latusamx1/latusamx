// ============================================
// TIPOS BASE
// ============================================

export type Rol = 'admin' | 'host' | 'cliente'

export interface Usuario {
  uid: string
  email: string
  nombre: string
  rol: Rol
  telefono?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// ============================================
// MÓDULO DE EVENTOS
// ============================================

export type EstadoEvento = 'borrador' | 'publicado' | 'pausado' | 'cancelado' | 'finalizado'
export type CategoriaEvento = 'concierto' | 'deportes' | 'teatro' | 'festival' | 'otro'

export interface Venue {
  id: string
  nombre: string
  direccion: string
  ciudad: string
  estado: string
  codigoPostal: string
  capacidad: number
  ubicacion?: {
    lat: number
    lng: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface TipoTicket {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  cantidad: number
  disponibles: number
  ventaMinima?: number
  ventaMaxima?: number
  orden: number
}

export interface Evento {
  id: string
  titulo: string
  descripcion: string
  categoria: CategoriaEvento
  fecha: Date
  fechaFin?: Date
  horaInicio: string
  horaFin?: string
  venueId: string
  venue?: Venue
  imagen?: string
  imagenPublicId?: string
  tiposTickets: TipoTicket[]
  estado: EstadoEvento
  destacado: boolean
  tags?: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export type EstadoOrden = 'pendiente' | 'pagada' | 'cancelada' | 'reembolsada'
export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'mercadopago'

export interface ItemOrden {
  tipoTicketId: string
  nombre: string
  precio: number
  cantidad: number
  subtotal: number
}

export interface Orden {
  id: string
  userId: string
  eventoId: string
  evento?: Evento
  items: ItemOrden[]
  subtotal: number
  descuento: number
  total: number
  codigoDescuento?: string
  metodoPago: MetodoPago
  estado: EstadoOrden
  datosComprador: {
    nombre: string
    email: string
    telefono: string
  }
  createdAt: Date
  updatedAt: Date
  pagadoAt?: Date
  canceladoAt?: Date
}

export interface Ticket {
  id: string
  ordenId: string
  eventoId: string
  evento?: Evento
  tipoTicketId: string
  tipoTicket: string
  precio: number
  qrCode: string
  usado: boolean
  fechaUso?: Date
  usadoPor?: string
  createdAt: Date
}

export interface CodigoDescuento {
  id: string
  codigo: string
  tipo: 'porcentaje' | 'monto'
  valor: number
  usos: number
  usosMaximos?: number
  fechaInicio: Date
  fechaFin: Date
  activo: boolean
  eventosAplicables?: string[]
  createdAt: Date
  updatedAt: Date
}

// ============================================
// MÓDULO DE RESERVAS
// ============================================

export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo'

export interface HorarioOperacion {
  dia: DiaSemana
  abierto: boolean
  horaApertura: string
  horaCierre: string
}

export interface Sucursal {
  id: string
  nombre: string
  direccion: string
  ciudad: string
  estado: string
  telefono: string
  email: string
  capacidad: number
  horarios: HorarioOperacion[]
  imagen?: string
  imagenPublicId?: string
  ubicacion?: {
    lat: number
    lng: number
  }
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export type EstadoReserva = 'pendiente' | 'confirmada' | 'sentado' | 'completada' | 'cancelada' | 'no-show'
export type Ocasion = 'cumpleanos' | 'aniversario' | 'cita' | 'negocios' | 'casual' | 'otro'

export interface Reserva {
  id: string
  codigoReserva: string
  userId: string
  sucursalId: string
  sucursal?: Sucursal
  fecha: Date
  hora: string
  personas: number
  mesaId?: string
  mesa?: Mesa
  estado: EstadoReserva
  datosCliente: {
    nombre: string
    telefono: string
    email: string
  }
  ocasion?: Ocasion
  esCumpleanos: boolean
  notas?: string
  preferencias?: string[]
  qrCode: string
  createdAt: Date
  updatedAt: Date
  confirmadaAt?: Date
  sentadoAt?: Date
  completadaAt?: Date
  canceladaAt?: Date
}

export type AreaMesa = 'terraza' | 'interior' | 'barra' | 'privado'
export type FormaMesa = 'cuadrada' | 'redonda' | 'rectangular'
export type EstadoMesa = 'disponible' | 'reservada' | 'ocupada' | 'bloqueada'

export interface Mesa {
  id: string
  sucursalId: string
  numero: string
  capacidad: number
  area: AreaMesa
  forma: FormaMesa
  estado: EstadoMesa
  posicion?: {
    x: number
    y: number
  }
  ancho?: number
  alto?: number
  activa: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Plano {
  id: string
  sucursalId: string
  nombre: string
  descripcion?: string
  mesas: Mesa[]
  configuracion?: any
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ListaEspera {
  id: string
  sucursalId: string
  nombre: string
  telefono: string
  personas: number
  timestamp: Date
  notificado: boolean
  mesaAsignada?: string
  completado: boolean
  completadoAt?: Date
}

// ============================================
// HELPERS Y UTILIDADES
// ============================================

export interface PaginationResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface QueryFilter {
  field: string
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'array-contains'
  value: any
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}
