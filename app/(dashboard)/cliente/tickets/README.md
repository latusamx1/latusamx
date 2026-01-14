# 🎫 Página de Mis Tickets

Página modular para que los clientes vean y gestionen todos sus tickets de eventos.

## 🌐 URL de Acceso

```
http://localhost:3000/cliente/tickets
```

⚠️ **Importante**: La carpeta `(dashboard)` es un **grupo de rutas** en Next.js, por lo que NO aparece en la URL final. La ruta es `/cliente/tickets`, no `/dashboard/cliente/tickets`.

## 📁 Estructura del Proyecto

```
app/(dashboard)/cliente/tickets/
│
├── page.tsx                          # Página principal (orquestador)
├── README.md                         # Esta documentación
│
├── components/                       # Componentes UI modulares
│   ├── index.ts                      # Barrel export
│   ├── TicketTabs.tsx                # Tabs de filtrado
│   ├── TicketItemCard.tsx            # Tarjeta de ticket individual
│   ├── EmptyTickets.tsx              # Estado vacío
│   └── TicketDetailModal.tsx         # Modal con QR y detalles
│
└── hooks/                            # Custom hooks
    └── useTickets.ts                 # Hook para cargar y filtrar tickets
```

## 🎯 Componentes

### 1. **TicketTabs**
Sistema de tabs para filtrar tickets por categoría.

```tsx
<TicketTabs
  activeFilter={filter}
  onFilterChange={setFilter}
  counts={counts}
/>
```

**Props:**
- `activeFilter: TicketFilter` - Filtro activo actual
- `onFilterChange: (filter: TicketFilter) => void` - Callback al cambiar filtro
- `counts: { todos, proximos, pasados, usados }` - Contadores por categoría

**Filtros disponibles:**
- 🎫 **Todos**: Muestra todos los tickets
- 📅 **Próximos**: Solo eventos futuros no usados
- 📝 **Pasados**: Eventos que ya ocurrieron
- ✓ **Usados**: Tickets que ya fueron escaneados

### 2. **TicketItemCard**
Tarjeta individual para mostrar un ticket.

```tsx
<TicketItemCard
  ticket={ticket}
  evento={evento}
  onViewDetails={setSelectedTicket}
/>
```

**Props:**
- `ticket: Ticket` - Datos del ticket
- `evento?: Evento` - Información del evento
- `onViewDetails: (ticket: Ticket) => void` - Callback para ver detalles

**Características:**
- ✅ Imagen del evento
- ✅ Badge de estado (Próximo/Pasado/Usado)
- ✅ Fecha, hora y ubicación
- ✅ Botón "Ver QR" (deshabilitado si está usado)
- ✅ Precio pagado
- ✅ Info de cuándo fue usado
- ✅ Diseño responsive

**Estados visuales:**
- 🔵 Próximo: Fondo azul claro, borde azul
- ⚪ Pasado: Fondo blanco, borde gris
- ⚫ Usado: Fondo gris claro, borde gris

### 3. **EmptyTickets**
Estado vacío personalizado por filtro.

```tsx
<EmptyTickets filter={filter} />
```

**Props:**
- `filter: string` - Filtro activo para mostrar mensaje apropiado

**Mensajes por filtro:**
- **todos**: "No tienes tickets todavía"
- **proximos**: "No tienes eventos próximos"
- **pasados**: "No tienes eventos pasados"
- **usados**: "No tienes tickets usados"

### 4. **TicketDetailModal**
Modal con todos los detalles del ticket y QR code.

```tsx
<TicketDetailModal
  ticket={selectedTicket}
  evento={evento}
  isOpen={!!selectedTicket}
  onClose={() => setSelectedTicket(null)}
/>
```

**Props:**
- `ticket: Ticket | null` - Ticket seleccionado
- `evento: Evento | null` - Evento relacionado
- `isOpen: boolean` - Estado del modal
- `onClose: () => void` - Callback para cerrar

**Características:**
- ✅ QR code grande (200x200px)
- ✅ Código del ticket legible
- ✅ Badge de estado (Válido/Usado)
- ✅ Detalles completos del evento
- ✅ Precio pagado destacado
- ✅ Botón "Descargar QR" (genera PNG)
- ✅ Botón "Compartir" (Web Share API)
- ✅ Advertencia de seguridad
- ✅ Deshabilita acciones si está usado

## 🪝 Custom Hook

### `useTickets(userId: string | null)`

Hook personalizado que encapsula toda la lógica de tickets.

**Retorna:**
```tsx
{
  tickets: TicketConEvento[]        // Tickets filtrados
  loading: boolean                   // Estado de carga
  filter: TicketFilter               // Filtro activo
  setFilter: (filter) => void        // Cambiar filtro
  counts: {                          // Contadores
    todos: number
    proximos: number
    pasados: number
    usados: number
  }
}
```

**Funcionalidades:**
- ✅ Carga tickets del usuario desde Firestore
- ✅ Carga información de eventos relacionados
- ✅ Filtra tickets según categoría activa
- ✅ Calcula contadores automáticamente
- ✅ Maneja estados de carga y errores
- ✅ Memoiza resultados para performance

**Lógica de filtrado:**
```typescript
- próximos: fecha > hoy && !usado
- pasados: fecha < hoy
- usados: usado === true
- todos: sin filtro
```

## 🔄 Flujo de Datos

```
1. Usuario navega a /dashboard/cliente/tickets
   ↓
2. useTickets carga órdenes del usuario
   ↓
3. Obtiene tickets de esas órdenes
   ↓
4. Carga información de eventos
   ↓
5. Renderiza tarjetas de tickets
   ↓
6. Usuario hace clic en "Ver QR"
   ↓
7. Se abre modal con detalles y QR
   ↓
8. Usuario puede descargar o compartir
```

## 📊 Servicios y Hooks Creados

### 1. **lib/services/ordenes.service.ts**
Servicio completo para gestión de órdenes:
- `crear(data)` - Crear nueva orden
- `obtenerPorId(ordenId)` - Obtener orden específica
- `obtenerPorUsuario(userId)` - Todas las órdenes del usuario
- `actualizarEstado(ordenId, estado)` - Cambiar estado
- `obtenerPorEvento(eventoId)` - Órdenes de un evento

### 2. **lib/hooks/useOrden.ts**
Hooks para gestionar órdenes:
- `useOrden(ordenId)` - Hook para una orden específica
- `useOrdenes(userId)` - Hook para órdenes del usuario

## 🎨 Características de Diseño

### Responsive
- ✅ Mobile-first design
- ✅ Grid adaptativo para stats
- ✅ Tabs con scroll horizontal en mobile
- ✅ Modal adaptable

### Estados Visuales
- 🔵 Próximo: Azul
- ⚪ Pasado: Gris claro
- ⚫ Usado: Gris oscuro
- 🟢 Válido: Verde en modal

### Animaciones
- ✅ Hover effects en tarjetas
- ✅ Transiciones suaves
- ✅ Skeleton loaders (spinner)

## 🚀 Cómo Extender

### Agregar nuevo filtro:

1. **Actualizar tipo:**
```tsx
// hooks/useTickets.ts
export type TicketFilter = 'todos' | 'proximos' | 'pasados' | 'usados' | 'favoritos'
```

2. **Agregar lógica de filtrado:**
```tsx
case 'favoritos':
  return tickets.filter((t) => t.esFavorito)
```

3. **Agregar tab:**
```tsx
// components/TicketTabs.tsx
{ id: 'favoritos', label: 'Favoritos', icon: '⭐' }
```

### Agregar funcionalidad de transferencia:

1. **Crear servicio:**
```tsx
// lib/services/tickets.service.ts
async transferir(ticketId: string, nuevoUserId: string)
```

2. **Agregar botón en TicketItemCard:**
```tsx
<Button onClick={() => transferir(ticket.id)}>
  Transferir
</Button>
```

### Agregar descarga de PDF:

1. **Instalar librería:**
```bash
npm install jspdf
```

2. **Crear función:**
```tsx
const generarPDF = async (ticket: Ticket, evento: Evento) => {
  // Lógica de generación
}
```

3. **Agregar botón en modal**

## 📱 Screenshots de Estados

### Con Tickets
```
┌─────────────────────────────────────┐
│ 🎫 Mis Tickets                      │
│ Administra todos tus tickets...     │
├─────────────────────────────────────┤
│ [Stats Cards: 12 | 3 | 8 | 1]     │
├─────────────────────────────────────┤
│ 🎫 Todos(12) 📅 Próximos(3) ...    │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [IMG] Festival 2024             │ │
│ │       VIP × 2        [Próximo]  │ │
│ │       📅 Sábado 15 Dic          │ │
│ │       [Ver QR] [Detalles]       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Sin Tickets
```
┌─────────────────────────────────────┐
│     🎫                              │
│  No tienes tickets todavía          │
│  ¡Comienza tu aventura!             │
│  [Explorar Eventos]                 │
└─────────────────────────────────────┘
```

### Modal de Detalle
```
┌─────────────────────────────────────┐
│ Festival de Música 2024         [X] │
│ VIP Access                          │
├─────────────────────────────────────┤
│         ┌─────────────┐             │
│         │   QR CODE   │             │
│         │   [IMAGE]   │             │
│         └─────────────┘             │
│                                     │
│    Código: TICKET-ABC123            │
│    [✓ Ticket Válido]                │
│                                     │
│  📅 Sábado, 15 de diciembre         │
│  🕐 20:00                           │
│  📍 EventPro Polanco                │
│                                     │
│  Precio: $500.00 MXN                │
│                                     │
│  [📥 Descargar] [🔗 Compartir]      │
│                                     │
│  ⚠️ No compartas este código        │
└─────────────────────────────────────┘
```

## ✅ Testing Checklist

- [ ] Carga de tickets desde Firestore
- [ ] Filtrado por categoría funciona
- [ ] Contadores se actualizan correctamente
- [ ] Modal se abre y cierra
- [ ] QR se genera correctamente
- [ ] Descarga de QR funciona
- [ ] Compartir funciona (Web Share API)
- [ ] Estados vacíos se muestran
- [ ] Responsive en todos los tamaños
- [ ] Loading states funcionan
- [ ] Tickets usados están deshabilitados

## 🔧 Variables de Entorno

No requiere variables adicionales, usa la configuración de Firebase existente:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

## 🎯 Próximas Mejoras

- [ ] Agregar filtro por evento específico
- [ ] Implementar búsqueda por nombre de evento
- [ ] Agregar favoritos
- [ ] Implementar transferencia de tickets
- [ ] Agregar recordatorios de eventos
- [ ] Generar PDF con todos los tickets
- [ ] Compartir múltiples tickets
- [ ] Agregar a Apple Wallet / Google Pay

---

**Desarrollado por**: Claude + Pedro Durán
**Última actualización**: 14 de Enero, 2026
**Versión**: 1.0.0
