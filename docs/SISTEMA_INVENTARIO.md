# 📦 Sistema de Control de Inventario de Tickets

## 🎯 Objetivo

Implementar un sistema robusto que previene el **overselling** (vender más tickets de los disponibles) utilizando transacciones atómicas de Firebase Firestore.

---

## 🚨 Problema a Resolver

### Sin Control de Inventario:
```
Usuario A: Ve 5 tickets disponibles
Usuario B: Ve 5 tickets disponibles (mismo tiempo)

Usuario A: Compra 5 tickets ✅
Usuario B: Compra 5 tickets ✅

Resultado: 10 tickets vendidos con solo 5 disponibles ❌ OVERSELLING
```

### Con Control de Inventario:
```
Usuario A: Ve 5 tickets disponibles
Usuario B: Ve 5 tickets disponibles

Usuario A: Inicia compra
  → Transacción verifica stock: 5 disponibles ✅
  → Decrementa a 0
  → Confirma compra ✅

Usuario B: Inicia compra
  → Transacción verifica stock: 0 disponibles ❌
  → Rechaza compra
  → Muestra error: "Stock agotado"

Resultado: Solo se vendieron 5 tickets ✅ CORRECTO
```

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────────────────────────────────────────────┐
│                  FLUJO DE COMPRA                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. [Usuario ve evento]                                 │
│      ↓                                                  │
│  2. [Verifica stock en tiempo real]                     │
│      ↓                                                  │
│  3. [Agrega al carrito]                                 │
│      ↓                                                  │
│  4. [Inicia checkout]                                   │
│      ↓                                                  │
│  5. [Verifica stock nuevamente]  ← CRÍTICO             │
│      ↓                                                  │
│  6. [Transacción atómica]                               │
│      • Verifica stock                                   │
│      • Decrementa disponibles                           │
│      • Crea orden                                       │
│      • Genera tickets                                   │
│      ↓                                                  │
│  7. [Confirmación exitosa]                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

### Servicios
```
lib/services/
├── inventario.service.ts    # Control de stock atómico
└── ordenes.service.ts        # Gestión de órdenes
```

### Hooks
```
lib/hooks/
├── useStockValidation.ts     # Hook para validar stock
└── useOrden.ts               # Hook para órdenes
```

### Componentes
```
components/features/eventos/
└── StockIndicator.tsx        # Indicadores visuales de stock
```

---

## 🔧 API del Servicio de Inventario

### `inventarioService.verificarDisponibilidad()`

Verifica stock sin hacer cambios. Útil para mostrar disponibilidad en tiempo real.

```typescript
const resultado = await inventarioService.verificarDisponibilidad(
  'evento-123',
  'tipoTicket-vip',
  5
)

// Resultado:
{
  disponible: true,
  cantidadDisponible: 10,
  mensaje: undefined  // undefined si está disponible
}
```

### `inventarioService.confirmarCompra()` ⚛️ ATÓMICA

Confirma compra y decrementa stock en una transacción atómica.

```typescript
const resultado = await inventarioService.confirmarCompra(
  'evento-123',
  'tipoTicket-vip',
  5
)

// Resultado exitoso:
{
  success: true,
  eventoActualizado: true
}

// Resultado fallido:
{
  success: false,
  error: "Stock insuficiente. Disponibles: 3, Solicitados: 5",
  eventoActualizado: false
}
```

### `inventarioService.revertirCompra()`

Revierte una compra (reembolso/cancelación) devolviendo stock.

```typescript
await inventarioService.revertirCompra(
  'evento-123',
  'tipoTicket-vip',
  5
)
```

### Sistema de Reservas Temporales (Opcional)

```typescript
// Reservar tickets por 10 minutos durante el checkout
const reserva = await inventarioService.crearReservaTemporal(
  'evento-123',
  'tipoTicket-vip',
  5,
  'user-456',
  'session-789'
)

// Liberar reserva si el usuario cancela
await inventarioService.liberarReserva(reserva.reservaId!)
```

---

## 🔐 Transacciones Atómicas: Cómo Funcionan

### Sin Transacciones (❌ VULNERABLE)
```typescript
// INCORRECTO - Race condition posible
const evento = await getDoc(eventoRef)
const disponibles = evento.data().tiposTickets[0].disponibles

if (disponibles >= cantidad) {
  // ⚠️ Otro usuario puede comprar aquí antes de que actualicemos
  await updateDoc(eventoRef, {
    'tiposTickets.0.disponibles': disponibles - cantidad
  })
}
```

### Con Transacciones (✅ SEGURO)
```typescript
// CORRECTO - Operación atómica
await runTransaction(db, async (transaction) => {
  // 1. Leer
  const eventoSnap = await transaction.get(eventoRef)
  const disponibles = eventoSnap.data().tiposTickets[0].disponibles

  // 2. Validar
  if (disponibles < cantidad) {
    throw new Error('Stock insuficiente')
  }

  // 3. Escribir (atómico)
  transaction.update(eventoRef, {
    'tiposTickets.0.disponibles': disponibles - cantidad
  })

  // ✅ Firebase garantiza que estas 3 operaciones son atómicas
  // Si otro usuario intenta comprar al mismo tiempo, una transacción fallará
  // y se reintentará automáticamente
})
```

---

## 🎨 Uso en Componentes

### Validación en Tiempo Real

```typescript
import { useStockValidation } from '@/lib/hooks/useStockValidation'

function EventoDetalle() {
  const [cantidad, setCantidad] = useState(1)

  const { disponible, cantidadDisponible, mensaje, loading } = useStockValidation({
    eventoId: evento.id,
    tipoTicketId: tipoTicket.id,
    cantidadSolicitada: cantidad
  })

  return (
    <div>
      {loading ? (
        <p>Verificando disponibilidad...</p>
      ) : disponible ? (
        <button onClick={agregarAlCarrito}>
          Agregar al Carrito
        </button>
      ) : (
        <p className="text-red-600">{mensaje}</p>
      )}
    </div>
  )
}
```

### Indicador Visual

```typescript
import { StockIndicator, StockBadge } from '@/components/features/eventos/StockIndicator'

function TicketCard({ tipoTicket }) {
  return (
    <div>
      <h3>{tipoTicket.nombre}</h3>

      {/* Indicador completo con barra de progreso */}
      <StockIndicator
        disponibles={tipoTicket.disponibles}
        total={tipoTicket.cantidad}
      />

      {/* O badge simple */}
      <StockBadge
        disponibles={tipoTicket.disponibles}
        total={tipoTicket.cantidad}
      />
    </div>
  )
}
```

---

## 🔄 Flujo Completo de Checkout

### Checkout Actualizado

```typescript
const onSubmit = async (data) => {
  // 1. VERIFICAR stock antes de proceder
  for (const item of items) {
    const verificacion = await inventarioService.verificarDisponibilidad(
      item.eventoId,
      item.tipoTicketId,
      item.cantidad
    )

    if (!verificacion.disponible) {
      toast.error(verificacion.mensaje)
      return  // ❌ Detener si no hay stock
    }
  }

  // 2. CONFIRMAR compra y decrementar stock (ATÓMICO)
  const resultados = await Promise.all(
    items.map(item =>
      inventarioService.confirmarCompra(
        item.eventoId,
        item.tipoTicketId,
        item.cantidad
      )
    )
  )

  // 3. VERIFICAR que todas las actualizaciones fueron exitosas
  const fallo = resultados.find(r => !r.success)
  if (fallo) {
    // ROLLBACK: Revertir compras exitosas
    await revertirCompras(resultados, items)
    toast.error(fallo.error)
    return
  }

  // 4. CREAR orden y tickets
  const orden = await crearOrden(data, items)
  await crearTickets(orden.id, items)

  // 5. ÉXITO
  router.push(`/confirmacion/${orden.id}`)
}
```

---

## 🧪 Testing de Race Conditions

### Test Manual
```bash
# Terminal 1
curl -X POST /api/comprar \
  -d '{"eventoId": "123", "cantidad": 5}'

# Terminal 2 (al mismo tiempo)
curl -X POST /api/comprar \
  -d '{"eventoId": "123", "cantidad": 5}'

# Resultado esperado:
# Terminal 1: ✅ Compra exitosa
# Terminal 2: ❌ Error: Stock insuficiente
```

### Test Automatizado
```typescript
test('previene overselling con múltiples compras simultáneas', async () => {
  // Setup: 5 tickets disponibles
  await setupEvento({ disponibles: 5 })

  // Simular 2 usuarios comprando 5 tickets cada uno
  const compra1 = inventarioService.confirmarCompra('evento-1', 'tipo-1', 5)
  const compra2 = inventarioService.confirmarCompra('evento-1', 'tipo-1', 5)

  const resultados = await Promise.all([compra1, compra2])

  // Verificar que solo 1 compra fue exitosa
  const exitosas = resultados.filter(r => r.success)
  expect(exitosas).toHaveLength(1)

  // Verificar stock final
  const evento = await getEvento('evento-1')
  expect(evento.tiposTickets[0].disponibles).toBe(0)
})
```

---

## 📊 Monitoreo y Logs

### Logs del Sistema

```typescript
console.log('🔍 Verificando disponibilidad...')
console.log('✅ Stock disponible para todos los tickets')
console.log('✅ Stock actualizado correctamente')
console.log('✅ Orden creada con ID:', ordenRef.id)
console.log('🎫 Ticket creado:', ticketRef.id)
console.log('❌ Error al actualizar stock:', error)
```

### Métricas a Monitorear

1. **Intentos de compra rechazados** (stock agotado)
2. **Transacciones fallidas** (errores de concurrencia)
3. **Tiempo de respuesta** de transacciones
4. **Stock negativo** (nunca debería ocurrir)

---

## 🚀 Mejoras Futuras

### 1. Sistema de Cola
```typescript
// Para eventos de alta demanda
await agregarACola({
  eventoId,
  userId,
  cantidad
})
```

### 2. Notificaciones de Stock
```typescript
// Notificar cuando vuelva a haber stock
await suscribirseAStock(eventoId, tipoTicketId, email)
```

### 3. Priorización de Compras
```typescript
// Usuarios VIP tienen prioridad
await confirmarCompra(eventoId, tipoTicketId, cantidad, {
  prioridad: user.isVIP ? 'alta' : 'normal'
})
```

### 4. Analytics
```typescript
// Registrar intentos fallidos para ajustar stock
await registrarIntentoFallido({
  eventoId,
  tipoTicketId,
  cantidadSolicitada,
  cantidadDisponible
})
```

---

## ⚠️ Consideraciones Importantes

### 1. Límites de Firestore
- **Máximo 500 writes/segundo** por documento
- Para eventos virales, considerar sharding

### 2. Costo
- Cada transacción cuenta como múltiples operaciones
- Optimizar verificando stock antes de transacción

### 3. Experiencia de Usuario
- Mostrar stock en tiempo real
- Indicar cuando quedan pocos tickets
- Timeout de reservas (10 minutos)

### 4. Seguridad
- Validar en servidor, no solo en cliente
- Rate limiting por usuario
- Prevenir bots con CAPTCHA

---

## 📚 Referencias

- [Firestore Transactions](https://firebase.google.com/docs/firestore/manage-data/transactions)
- [Distributed Counters](https://firebase.google.com/docs/firestore/solutions/counters)
- [Best Practices for Cloud Firestore](https://firebase.google.com/docs/firestore/best-practices)

---

**Creado**: 20 de Enero, 2026
**Versión**: 1.0.0
**Autor**: Claude Sonnet 4.5 + Pedro Durán
