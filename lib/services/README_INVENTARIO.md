# 📦 Sistema de Control de Inventario - Quick Start

## 🚀 Uso Rápido

### 1. Verificar Stock Disponible

```typescript
import { inventarioService } from '@/lib/services/inventario.service'

const { disponible, cantidadDisponible, mensaje } =
  await inventarioService.verificarDisponibilidad(
    'evento-123',
    'tipoTicket-vip',
    5  // cantidad solicitada
  )

if (!disponible) {
  console.error(mensaje)  // "Solo quedan 3 tickets disponibles"
}
```

### 2. Confirmar Compra (Decrementar Stock)

```typescript
const resultado = await inventarioService.confirmarCompra(
  'evento-123',
  'tipoTicket-vip',
  5
)

if (resultado.success) {
  // ✅ Stock decrementado, crear orden
} else {
  // ❌ Stock insuficiente
  console.error(resultado.error)
}
```

### 3. Revertir Compra (Reembolso)

```typescript
await inventarioService.revertirCompra(
  'evento-123',
  'tipoTicket-vip',
  5
)
// Stock devuelto al inventario
```

---

## 🎨 Uso en Componentes React

### Hook de Validación

```typescript
import { useStockValidation } from '@/lib/hooks/useStockValidation'

function ComprarTickets() {
  const [cantidad, setCantidad] = useState(1)

  const { disponible, loading, mensaje } = useStockValidation({
    eventoId: 'evento-123',
    tipoTicketId: 'tipo-vip',
    cantidadSolicitada: cantidad
  })

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : disponible ? (
        <Button>Agregar al Carrito</Button>
      ) : (
        <p className="text-red-600">{mensaje}</p>
      )}
    </div>
  )
}
```

### Indicador Visual

```typescript
import { StockIndicator } from '@/components/features/eventos/StockIndicator'

<StockIndicator
  disponibles={tipoTicket.disponibles}
  total={tipoTicket.cantidad}
/>
```

---

## 🔐 Flujo de Checkout Seguro

```typescript
// CheckoutCliente.tsx
const onSubmit = async (data) => {
  // 1. Verificar stock
  for (const item of items) {
    const { disponible } = await inventarioService.verificarDisponibilidad(
      item.eventoId,
      item.tipoTicketId,
      item.cantidad
    )

    if (!disponible) {
      toast.error('Stock insuficiente')
      return
    }
  }

  // 2. Confirmar compra (ATÓMICO)
  const resultados = await Promise.all(
    items.map(item =>
      inventarioService.confirmarCompra(
        item.eventoId,
        item.tipoTicketId,
        item.cantidad
      )
    )
  )

  // 3. Verificar que todo fue exitoso
  if (resultados.some(r => !r.success)) {
    // Rollback...
    return
  }

  // 4. Crear orden y tickets
  await crearOrden(data)
}
```

---

## 🧪 Testing

```bash
# Ejecutar tests de race conditions
npm run test:race-conditions

# O directamente con ts-node
npx ts-node scripts/test-race-conditions.ts
```

---

## 📚 Documentación Completa

Ver [`docs/SISTEMA_INVENTARIO.md`](/docs/SISTEMA_INVENTARIO.md) para:
- Arquitectura completa
- Explicación de transacciones atómicas
- Prevención de race conditions
- Tests y monitoreo

---

## ⚠️ Puntos Críticos

1. **SIEMPRE** usar `confirmarCompra()` para decrementar stock
2. **NUNCA** actualizar `disponibles` manualmente con `updateDoc()`
3. **VERIFICAR** stock antes de proceder al checkout
4. **IMPLEMENTAR** rollback si alguna compra falla

---

## 🎯 Archivos del Sistema

```
lib/
├── services/
│   └── inventario.service.ts    ← Servicio principal
├── hooks/
│   └── useStockValidation.ts    ← Hook para React
components/features/eventos/
└── StockIndicator.tsx            ← Componentes visuales
scripts/
└── test-race-conditions.ts       ← Tests
docs/
└── SISTEMA_INVENTARIO.md         ← Documentación completa
```

---

**Versión**: 1.0.0
**Última actualización**: 20 de Enero, 2026
