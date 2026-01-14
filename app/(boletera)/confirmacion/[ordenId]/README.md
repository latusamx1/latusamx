# 📄 Página de Confirmación de Orden

Página de confirmación modular y bien organizada para mostrar los detalles de una orden completada.

## 📁 Estructura del Proyecto

```
app/(boletera)/confirmacion/[ordenId]/
│
├── page.tsx                          # Server Component (maneja params async)
├── ConfirmacionOrdenPage.tsx         # Client Component principal (orquestador)
├── TicketCard.tsx                    # Componente de ticket individual
│
├── components/                       # Componentes UI modulares
│   ├── index.ts                      # Barrel export
│   ├── LoadingState.tsx              # Estado de carga
│   ├── EmptyState.tsx                # Estado vacío
│   ├── SuccessHeader.tsx             # Header con icono de éxito
│   ├── OrderSummary.tsx              # Resumen de orden (ID, fecha)
│   ├── TicketsList.tsx               # Lista de tickets
│   ├── PaymentSummary.tsx            # Resumen de pago
│   ├── ImportantInfo.tsx             # Información importante
│   ├── ActionButtons.tsx             # Botones (PDF, Calendar, Share)
│   ├── NavigationLinks.tsx           # Enlaces de navegación
│   └── SupportSection.tsx            # Sección de soporte
│
├── hooks/                            # Custom hooks
│   └── useConfirmacionData.ts        # Hook para cargar datos de Firestore
│
└── utils/                            # Utilidades
    └── confetti.ts                   # Efecto de confetti
```

## 🎯 Componentes

### 1. **LoadingState**
Muestra spinner mientras se cargan los datos.

```tsx
<LoadingState />
```

### 2. **EmptyState**
Muestra cuando no se encuentra la orden.

```tsx
<EmptyState />
```

### 3. **SuccessHeader**
Header con icono de checkmark y mensaje de éxito.

```tsx
<SuccessHeader />
```

### 4. **OrderSummary**
Muestra número de orden y fecha de compra.

```tsx
<OrderSummary orden={orden} />
```

**Props:**
- `orden: Orden` - Datos de la orden

### 5. **TicketsList**
Lista de todos los tickets con QR codes.

```tsx
<TicketsList tickets={tickets} evento={evento} />
```

**Props:**
- `tickets: Ticket[]` - Array de tickets
- `evento: Evento` - Datos del evento

### 6. **PaymentSummary**
Resumen del pago (subtotal, descuento, total).

```tsx
<PaymentSummary orden={orden} tickets={tickets} />
```

**Props:**
- `orden: Orden` - Datos de la orden
- `tickets: Ticket[]` - Array de tickets

### 7. **ImportantInfo**
Información importante para el usuario.

```tsx
<ImportantInfo orden={orden} />
```

**Props:**
- `orden: Orden` - Datos de la orden

### 8. **ActionButtons**
Botones para descargar PDF, agregar al calendario y compartir.

```tsx
<ActionButtons ordenId={ordenId} evento={evento} />
```

**Props:**
- `ordenId: string` - ID de la orden
- `evento: Evento` - Datos del evento

**Funcionalidades:**
- ✅ Descargar PDF (preparado para implementar librería)
- ✅ Agregar al calendario (.ics)
- ✅ Compartir (Web Share API o copiar enlace)

### 9. **NavigationLinks**
Enlaces para navegar a otras páginas.

```tsx
<NavigationLinks />
```

### 10. **SupportSection**
Información de contacto de soporte.

```tsx
<SupportSection />
```

## 🪝 Custom Hook

### `useConfirmacionData(ordenId: string)`

Hook personalizado que encapsula toda la lógica de carga de datos.

**Retorna:**
```tsx
{
  loading: boolean
  orden: Orden | null
  tickets: Ticket[]
  evento: Evento | null
}
```

**Uso:**
```tsx
const { loading, orden, tickets, evento } = useConfirmacionData(ordenId)
```

**Funcionalidades:**
- ✅ Carga orden desde Firestore
- ✅ Carga tickets relacionados
- ✅ Carga datos del evento
- ✅ Maneja estados de error
- ✅ Verifica que Firebase esté inicializado
- ✅ Retry automático si Firebase no está listo

## 🎨 Utilidades

### `confetti.ts`

Efecto visual de confetti para celebrar la compra.

```tsx
import { crearConfetti, confettiStyles } from './utils/confetti'

// Crear efecto
crearConfetti()

// Estilos (agregar en component)
<style jsx global>{confettiStyles}</style>
```

## 🔄 Flujo de Datos

```
1. Usuario completa checkout
   ↓
2. Se crea orden en Firestore
   ↓
3. Redirección a /confirmacion/[ordenId]
   ↓
4. page.tsx recibe params (async)
   ↓
5. ConfirmacionOrdenPage recibe ordenId
   ↓
6. useConfirmacionData carga datos
   ↓
7. Componentes renderizados con datos
   ↓
8. Efecto de confetti
```

## 🎯 Ventajas de esta Estructura

### ✅ **Modularidad**
Cada componente tiene una responsabilidad única y clara.

### ✅ **Reutilizabilidad**
Los componentes pueden usarse en otras páginas fácilmente.

### ✅ **Mantenibilidad**
Fácil de encontrar y modificar código específico.

### ✅ **Testabilidad**
Cada componente puede testearse de forma aislada.

### ✅ **Legibilidad**
El componente principal es muy limpio y fácil de leer.

### ✅ **Separación de Concerns**
- UI separada de lógica de negocio
- Datos en custom hook
- Utilidades en carpeta utils

## 📝 Cómo Agregar Nuevos Componentes

1. **Crear el componente:**
```tsx
// components/NewComponent.tsx
export function NewComponent({ prop }: NewComponentProps) {
  return <div>...</div>
}
```

2. **Exportarlo en index.ts:**
```tsx
export { NewComponent } from './NewComponent'
```

3. **Usarlo en ConfirmacionOrdenPage:**
```tsx
import { NewComponent } from './components'

<NewComponent prop={value} />
```

## 🔧 Cómo Modificar Funcionalidad

### Cambiar el efecto de confetti:
Edita `utils/confetti.ts`

### Agregar más botones de acción:
Edita `components/ActionButtons.tsx`

### Cambiar lógica de carga de datos:
Edita `hooks/useConfirmacionData.ts`

### Modificar diseño de tickets:
Edita `TicketCard.tsx`

## 🚀 Próximas Mejoras

- [ ] Implementar generación real de PDF con `jspdf`
- [ ] Agregar animaciones con `framer-motion`
- [ ] Implementar sistema de calificación
- [ ] Agregar botón para transferir tickets
- [ ] Implementar notificaciones push
- [ ] Agregar más opciones de compartir (WhatsApp, Twitter, etc.)

## 📚 Recursos

- [Next.js 15 Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [React Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)

---

**Desarrollado por**: Claude + Pedro Durán
**Última actualización**: 13 de Enero, 2026
