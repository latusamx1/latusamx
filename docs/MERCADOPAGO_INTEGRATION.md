# 💳 Guía de Integración de Mercado Pago

> **Documentación completa para implementar el sistema de pagos con Mercado Pago**
>
> **Versión**: 1.0.0
> **Última actualización**: Enero 2026
> **Estado**: Pendiente de implementación

---

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Arquitectura del Flujo](#arquitectura-del-flujo)
3. [Implementación por Fases](#implementación-por-fases)
4. [Estructura de Archivos](#estructura-de-archivos)
5. [Flujo Detallado del Usuario](#flujo-detallado-del-usuario)
6. [Consideraciones Importantes](#consideraciones-importantes)
7. [Testing](#testing)
8. [Recursos Útiles](#recursos-útiles)

---

## 🔧 Configuración Inicial

### 1.1 Crear Cuenta en Mercado Pago

1. Ir a [developers.mercadopago.com](https://developers.mercadopago.com)
2. Crear una aplicación
3. Obtener credenciales:
   - **Public Key** (para frontend) - Cliente público
   - **Access Token** (para backend) - Servidor privado
   - Modo TEST y PRODUCTION

### 1.2 Instalar Dependencias

```bash
# SDK de Mercado Pago para Node.js
npm install mercadopago

# Componentes de React (opcional, para Checkout Bricks)
npm install @mercadopago/sdk-react
```

### 1.3 Variables de Entorno

Agregar a `.env.local`:

```env
# Mercado Pago - TEST
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Mercado Pago - PRODUCTION (cuando estés listo)
# NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxxxx
# MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxx

# URL de tu aplicación (para webhooks y redirects)
NEXT_PUBLIC_URL=http://localhost:3000
```

---

## 🏗️ Arquitectura del Flujo

```
┌─────────────────────┐
│  Usuario en Carrito │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Página de Checkout │
│  (Formulario datos) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│ API: Create Preference (Backend)│
│ - Valida items                  │
│ - Crea preferencia en MP        │
│ - Devuelve preferenceId         │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Mercado Pago Checkout          │
│  - Usuario ingresa tarjeta      │
│  - O paga con cuenta MP         │
│  - MP procesa el pago           │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Webhook (Backend)              │
│  - Recibe notificación de MP   │
│  - Valida payment_id           │
│  - Verifica status = approved  │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Procesar Orden                 │
│  - Crear orden en Firestore    │
│  - Generar tickets con QR      │
│  - Enviar email confirmación   │
│  - Limpiar carrito             │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Página de Confirmación         │
│  - Mostrar tickets con QR      │
│  - Detalles de la orden        │
│  - Opción de descargar PDF     │
└─────────────────────────────────┘
```

---

## 📦 Implementación por Fases

### FASE 1: API Route para Crear Preferencia

**Archivo**: `app/api/mercadopago/create-preference/route.ts`

**Responsabilidad**:
- Recibir datos del carrito desde el frontend
- Validar items y cantidades
- Crear preferencia de pago en Mercado Pago
- Devolver `preferenceId` al frontend

**Estructura de datos que recibe**:

```typescript
{
  items: CartItem[],           // Items del carrito
  payer: {                     // Datos del comprador
    name: string,
    email: string,
    phone: { area_code: string, number: string },
    identification: { type: string, number: string }
  },
  external_reference: string,  // ID interno (ej: "orden-user123-1234567890")
  metadata: {                  // Datos adicionales
    userId: string,
    eventoIds: string[],
    codigoDescuento?: string
  }
}
```

**Datos que envía a Mercado Pago**:

```typescript
{
  items: [
    {
      id: string,              // tipoTicketId
      title: string,           // "Ticket VIP - Concierto Rock"
      description: string,     // Descripción del evento
      quantity: number,        // Cantidad de tickets
      unit_price: number,      // Precio unitario
      currency_id: "USD"       // o "VES" para Venezuela
    }
  ],
  payer: {
    name: string,
    surname: string,
    email: string,
    phone: { area_code: string, number: string },
    identification: { type: "DNI" | "CI" | "PASSPORT", number: string }
  },
  back_urls: {
    success: "https://tuapp.com/checkout/success",
    failure: "https://tuapp.com/checkout/failure",
    pending: "https://tuapp.com/checkout/pending"
  },
  notification_url: "https://tuapp.com/api/mercadopago/webhook",
  auto_return: "approved",     // Redirige automáticamente si aprobado
  external_reference: string,   // Tu ID interno
  statement_descriptor: string, // Aparece en estado de cuenta (máx 22 chars)
  metadata: object,            // Datos extra que necesites guardar
  expires: boolean,            // Si la preferencia expira
  expiration_date_from: Date,  // Fecha desde cuando es válida
  expiration_date_to: Date     // Fecha de expiración
}
```

**Ejemplo de implementación**:

```typescript
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Configurar cliente de Mercado Pago
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
      options: { timeout: 5000 }
    })

    const preference = new Preference(client)

    // Crear preferencia
    const result = await preference.create({
      body: {
        items: body.items.map(item => ({
          id: item.tipoTicketId,
          title: `${item.tipoTicketNombre} - ${item.eventoTitulo}`,
          quantity: item.cantidad,
          unit_price: item.precio,
          currency_id: 'USD'
        })),
        payer: {
          name: body.payer.name,
          email: body.payer.email,
          phone: body.payer.phone,
          identification: body.payer.identification
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_URL}/checkout/pending`
        },
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/mercadopago/webhook`,
        external_reference: body.external_reference,
        statement_descriptor: 'BIG TEXAS BBQ',
        metadata: body.metadata,
        auto_return: 'approved'
      }
    })

    return NextResponse.json({
      preferenceId: result.id,
      init_point: result.init_point // URL para redirigir
    })

  } catch (error) {
    console.error('Error creating preference:', error)
    return NextResponse.json(
      { error: 'Failed to create payment preference' },
      { status: 500 }
    )
  }
}
```

---

### FASE 2: Componente Checkout en Frontend

**Archivo**: `app/(boletera)/checkout/CheckoutForm.tsx`

#### Opción A: Checkout Pro (Recomendado - Más Simple)

**Ventajas**:
- ✅ Implementación rápida
- ✅ PCI compliant automáticamente
- ✅ Mercado Pago maneja toda la UI de pago
- ✅ Soporta todos los métodos de pago
- ✅ Optimizado para conversión

**Desventajas**:
- ❌ Menos control sobre el diseño
- ❌ Usuario sale de tu sitio (o modal)

**Implementación**:

```typescript
'use client'

import { useCartStore } from '@/lib/stores/cartStore'
import { useState } from 'react'
import { toast } from 'sonner'

export default function CheckoutForm() {
  const { items, getTotal } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Crear preferencia en backend
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items,
          payer: {
            name: formData.name,
            email: formData.email,
            phone: { area_code: '58', number: formData.phone },
            identification: { type: 'DNI', number: formData.document }
          },
          external_reference: `orden-${userId}-${Date.now()}`,
          metadata: {
            userId: userId,
            eventoIds: items.map(i => i.eventoId)
          }
        })
      })

      const { preferenceId, init_point } = await response.json()

      // 2. Redirigir a Mercado Pago
      window.location.href = init_point

    } catch (error) {
      toast.error('Error al procesar el pago')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario de datos */}
      <Button type="submit" disabled={loading}>
        {loading ? 'Procesando...' : 'Continuar al Pago'}
      </Button>
    </form>
  )
}
```

#### Opción B: Checkout Bricks (Más Personalizable)

**Ventajas**:
- ✅ Mayor control del diseño
- ✅ Usuario no sale de tu sitio
- ✅ Mejor experiencia de marca
- ✅ Componentes React nativos

**Desventajas**:
- ❌ Más complejo de implementar
- ❌ Requiere más configuración

**Tipos de Bricks disponibles**:
- **Card Payment Brick**: Solo formulario de tarjeta
- **Wallet Brick**: Botón de Mercado Pago (pago con cuenta)
- **Payment Brick**: Todo en uno (recomendado)

---

### FASE 3: Webhook para Notificaciones

**Archivo**: `app/api/mercadopago/webhook/route.ts`

**¿Qué es un Webhook?**
- URL en tu backend que Mercado Pago llama automáticamente
- Te notifica cuando cambia el estado de un pago
- **CRÍTICO**: Es la única forma segura de confirmar pagos

**¿Por qué es importante?**
- ✅ Usuario puede cerrar el navegador después de pagar
- ✅ El redirect puede fallar
- ✅ Evita fraude (validación server-side)
- ✅ Procesa pagos asincrónicos (transferencias, efectivo)

**Tipos de notificaciones**:

| Tipo | Cuándo se envía |
|------|----------------|
| `payment` | Pago creado o actualizado |
| `merchant_order` | Orden actualizada |
| `plan` | Plan de suscripción |
| `subscription` | Suscripción |
| `point_integration_wh` | Integración de punto de venta |

**Estados de pago**:

| Estado | Descripción | Acción |
|--------|-------------|--------|
| `approved` | ✅ Pago aprobado | Crear orden, generar tickets |
| `pending` | ⏳ Pendiente | Esperar confirmación |
| `in_process` | 🔄 En proceso | Esperar |
| `rejected` | ❌ Rechazado | Mostrar error |
| `refunded` | 💸 Reembolsado | Cancelar orden |
| `cancelled` | 🚫 Cancelado | No procesar |
| `charged_back` | ⚠️ Contracargo | Investigar |

**Implementación del Webhook**:

```typescript
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Webhook received:', body)

    // Mercado Pago envía diferentes tipos de notificaciones
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true })
    }

    const paymentId = body.data.id

    // Configurar cliente
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
    })

    const payment = new Payment(client)

    // Consultar detalles del pago
    const paymentInfo = await payment.get({ id: paymentId })

    console.log('Payment info:', paymentInfo)

    // Verificar que no hayamos procesado este pago antes (idempotencia)
    const paymentRef = doc(db, 'payments', paymentId.toString())
    const paymentDoc = await getDoc(paymentRef)

    if (paymentDoc.exists()) {
      console.log('Payment already processed')
      return NextResponse.json({ ok: true })
    }

    // Guardar registro del pago
    await setDoc(paymentRef, {
      paymentId: paymentId,
      status: paymentInfo.status,
      statusDetail: paymentInfo.status_detail,
      externalReference: paymentInfo.external_reference,
      amount: paymentInfo.transaction_amount,
      payerEmail: paymentInfo.payer?.email,
      processedAt: new Date(),
      metadata: paymentInfo.metadata
    })

    // Procesar según el estado
    if (paymentInfo.status === 'approved') {
      console.log('Payment approved, creating order...')

      // Extraer datos
      const externalRef = paymentInfo.external_reference
      const metadata = paymentInfo.metadata

      // Crear orden en Firestore
      const ordenId = `orden-${Date.now()}`
      await setDoc(doc(db, 'ordenes', ordenId), {
        id: ordenId,
        paymentId: paymentId,
        externalReference: externalRef,
        userId: metadata.user_id,
        eventoIds: metadata.evento_ids,
        total: paymentInfo.transaction_amount,
        estado: 'pagada',
        metodoPago: 'mercadopago',
        payerEmail: paymentInfo.payer?.email,
        createdAt: new Date(),
        pagadoAt: new Date()
      })

      // Generar tickets con QR
      // await generarTickets(ordenId, metadata)

      // Enviar email de confirmación
      // await enviarEmailConfirmacion(paymentInfo.payer?.email, ordenId)

      console.log('Order created successfully:', ordenId)
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
```

**Configurar Webhook en Mercado Pago**:
1. Ir a tu aplicación en [developers.mercadopago.com](https://developers.mercadopago.com)
2. Sección "Webhooks"
3. Agregar URL: `https://tudominio.com/api/mercadopago/webhook`
4. Seleccionar eventos: `payment`

---

### FASE 4: Páginas de Resultado

#### Success Page (`app/(boletera)/checkout/success/page.tsx`)

```typescript
import { Suspense } from 'react'
import SuccessClient from './SuccessClient'

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SuccessClient />
    </Suspense>
  )
}
```

```typescript
// SuccessClient.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function SuccessClient() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')

  useEffect(() => {
    // Limpiar carrito
    // Mostrar confetti
  }, [])

  return (
    <div>
      <h1>¡Pago Exitoso!</h1>
      <p>ID de pago: {paymentId}</p>
      <p>Recibirás tus tickets por email</p>
    </div>
  )
}
```

#### Failure Page (`app/(boletera)/checkout/failure/page.tsx`)

Similar estructura, pero mostrando error y opción de reintentar.

#### Pending Page (`app/(boletera)/checkout/pending/page.tsx`)

Para pagos que requieren confirmación (transferencias, efectivo).

---

## 📁 Estructura de Archivos Completa

```
app/
├── api/
│   └── mercadopago/
│       ├── create-preference/
│       │   └── route.ts              # Crear preferencia de pago
│       ├── webhook/
│       │   └── route.ts              # Recibir notificaciones de MP
│       ├── verify-payment/
│       │   └── route.ts              # Consultar estado de un pago
│       └── refund/
│           └── route.ts              # Procesar reembolsos
│
├── (boletera)/
│   └── checkout/
│       ├── page.tsx                  # Server Component
│       ├── CheckoutForm.tsx          # Client Component (formulario)
│       ├── CheckoutSteps.tsx         # Wizard multi-step
│       ├── PaymentSummary.tsx        # Resumen de compra
│       ├── success/
│       │   ├── page.tsx              # Pago exitoso
│       │   └── SuccessClient.tsx     # Client Component
│       ├── failure/
│       │   ├── page.tsx              # Pago fallido
│       │   └── FailureClient.tsx     # Client Component
│       └── pending/
│           ├── page.tsx              # Pago pendiente
│           └── PendingClient.tsx     # Client Component
│
lib/
├── mercadopago/
│   ├── config.ts                     # Configuración del SDK
│   ├── create-preference.ts          # Helper para crear preferencias
│   ├── verify-payment.ts             # Helper para validar pagos
│   └── process-payment.ts            # Lógica de procesamiento
│
├── services/
│   ├── ordenes.service.ts            # CRUD de órdenes
│   ├── tickets.service.ts            # Generar y gestionar tickets
│   └── emails.service.ts             # Envío de emails
│
└── validations/
    └── checkout.schema.ts            # Zod schemas para checkout
```

---

## 🔒 Consideraciones de Seguridad

### 1. Validación Server-Side

**❌ NUNCA confíes solo en el frontend**:
```typescript
// MAL - Solo validar en frontend
const handlePagar = () => {
  if (total > 0) {
    // Crear preferencia...
  }
}
```

**✅ SIEMPRE valida en el backend**:
```typescript
// BIEN - Validar en webhook
export async function POST(request: NextRequest) {
  const payment = await mp.payment.get({ id: paymentId })

  // Verificar que el monto sea correcto
  const expectedAmount = calculateExpectedAmount(payment.metadata)
  if (payment.transaction_amount !== expectedAmount) {
    throw new Error('Amount mismatch')
  }

  // Verificar que el external_reference sea tuyo
  if (!payment.external_reference?.startsWith('orden-')) {
    throw new Error('Invalid reference')
  }

  // Procesar...
}
```

### 2. Idempotencia

El webhook puede llamarse múltiples veces. Debes manejar esto:

```typescript
// Verificar si ya procesamos este pago
const existingPayment = await db.collection('payments').doc(paymentId).get()

if (existingPayment.exists()) {
  console.log('Payment already processed')
  return Response.json({ ok: true })
}

// Marcar como procesado
await db.collection('payments').doc(paymentId).set({
  processed: true,
  processedAt: new Date()
})

// Procesar orden...
```

### 3. HTTPS Obligatorio

- ⚠️ Mercado Pago requiere HTTPS para webhooks
- 🔧 En desarrollo local, usar ngrok o similar:
  ```bash
  ngrok http 3000
  # URL: https://abc123.ngrok.io
  # Webhook: https://abc123.ngrok.io/api/mercadopago/webhook
  ```

### 4. Validar Firma (Avanzado)

Mercado Pago puede firmar las notificaciones:

```typescript
import crypto from 'crypto'

function validateSignature(request: NextRequest) {
  const xSignature = request.headers.get('x-signature')
  const xRequestId = request.headers.get('x-request-id')

  // Validar firma según documentación de MP
  // https://www.mercadopago.com/developers/es/docs/your-integrations/notifications/webhooks
}
```

---

## 🧪 Testing

### Tarjetas de Prueba

Mercado Pago provee tarjetas de prueba:

| Tarjeta | CVV | Fecha | Nombre | Resultado |
|---------|-----|-------|--------|-----------|
| 5031 7557 3453 0604 | 123 | 11/25 | APRO | ✅ Aprobada |
| 5031 4332 1540 6351 | 123 | 11/25 | OTHE | ❌ Rechazada |
| 5031 4926 4096 9480 | 123 | 11/25 | CALL | ⏳ Pendiente |

### Usuarios de Prueba

Crear usuarios de prueba en [developers.mercadopago.com](https://developers.mercadopago.com):
- Test Buyer (comprador)
- Test Seller (vendedor)

### Probar Webhook Localmente

```bash
# Terminal 1: Iniciar Next.js
npm run dev

# Terminal 2: Iniciar ngrok
ngrok http 3000

# Terminal 3: Simular webhook
curl -X POST http://localhost:3000/api/mercadopago/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": { "id": "123456789" }
  }'
```

---

## 💰 Costos de Mercado Pago

### Comisiones por Transacción (Venezuela)

| Método de Pago | Comisión |
|----------------|----------|
| Tarjetas de crédito | ~4-5% + comisión fija |
| Tarjetas de débito | ~3-4% |
| Cuenta Mercado Pago | ~3% |
| Efectivo (PagoMóvil) | Varía |

**Importante**:
- Las comisiones las asume el **vendedor** (tú)
- Puedes trasladar el costo al comprador agregando un "cargo por servicio"
- Los precios varían por país

### Plazos de Acreditación

- Tarjeta de crédito: 14 días
- Tarjeta de débito: 14 días
- Cuenta MP: Inmediato
- Efectivo: Cuando se paga

Puedes activar "Mercado Pago Point" para recibir más rápido (costo adicional).

---

## 📚 Recursos Útiles

### Documentación Oficial

- [Documentación General](https://www.mercadopago.com/developers/es/docs)
- [Checkout Pro](https://www.mercadopago.com/developers/es/docs/checkout-pro/landing)
- [Checkout Bricks](https://www.mercadopago.com/developers/es/docs/checkout-bricks/landing)
- [Webhooks](https://www.mercadopago.com/developers/es/docs/your-integrations/notifications/webhooks)
- [SDK Node.js](https://github.com/mercadopago/sdk-nodejs)
- [Tarjetas de Prueba](https://www.mercadopago.com/developers/es/docs/checkout-pro/additional-content/test-cards)

### Comunidad

- [GitHub Issues](https://github.com/mercadopago/sdk-nodejs/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/mercadopago)
- [Foro de Desarrolladores](https://www.mercadopago.com/developers/es/community)

---

## 🎯 Recomendaciones para Este Proyecto

### Para Big Texas BBQ - Sistema de Tickets

1. **Usar Checkout Pro**
   - ✅ Más rápido de implementar
   - ✅ PCI compliant out-of-the-box
   - ✅ Mejor conversión (UX optimizada por MP)

2. **Implementación Priorizada**:
   - ✅ **FASE 1**: API create-preference
   - ✅ **FASE 2**: Webhook (CRÍTICO)
   - ✅ **FASE 3**: Páginas de resultado
   - 🔄 **FASE 4**: Checkout Bricks (opcional, si necesitas más personalización)

3. **Flujo Simplificado**:
   ```
   Carrito → Checkout (datos) → Mercado Pago → Webhook → Tickets
   ```

4. **Guardar en Firestore**:
   ```
   /ordenes/{ordenId}
     - paymentId
     - userId
     - eventoIds
     - items[]
     - total
     - estado: 'pagada' | 'pendiente' | 'cancelada'
     - createdAt
     - pagadoAt

   /tickets/{ticketId}
     - ordenId
     - eventoId
     - qrCode
     - usado: false
     - createdAt

   /payments/{paymentId}  # Para idempotencia
     - processed: true
     - processedAt
   ```

5. **Notificaciones**:
   - Email con tickets (Cloud Functions + Resend)
   - PDF adjunto con QR codes
   - Link a "Ver mis tickets" en el dashboard

---

## ⚠️ Errores Comunes y Soluciones

### Error 1: Webhook no recibe notificaciones

**Causa**: URL no es HTTPS o no está accesible públicamente

**Solución**:
- Usar ngrok en desarrollo: `ngrok http 3000`
- Verificar que la URL esté correcta en MP dashboard
- Ver logs en MP dashboard > Webhooks > Logs

### Error 2: Payment ID not found

**Causa**: Consultar el pago inmediatamente después de recibirlo

**Solución**:
```typescript
// Agregar retry con delay
async function getPaymentWithRetry(paymentId: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await payment.get({ id: paymentId })
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}
```

### Error 3: Órdenes duplicadas

**Causa**: No implementar idempotencia

**Solución**: Ver sección de Idempotencia arriba

### Error 4: Monto incorrecto

**Causa**: No validar el monto en webhook

**Solución**: Siempre recalcular el monto esperado en el backend

---

## 📝 Checklist de Implementación

- [ ] Crear cuenta en Mercado Pago Developers
- [ ] Obtener credenciales TEST
- [ ] Instalar SDK: `npm install mercadopago`
- [ ] Agregar variables de entorno
- [ ] Crear API route `create-preference`
- [ ] Crear API route `webhook`
- [ ] Configurar webhook URL en MP dashboard
- [ ] Crear página de checkout con formulario
- [ ] Crear páginas success/failure/pending
- [ ] Implementar lógica de crear orden en Firestore
- [ ] Implementar generación de tickets con QR
- [ ] Implementar envío de emails
- [ ] Probar con tarjetas de prueba
- [ ] Probar webhook con ngrok
- [ ] Implementar manejo de errores
- [ ] Implementar idempotencia
- [ ] Agregar logs para debugging
- [ ] Documentar para el equipo
- [ ] Pasar a credenciales PRODUCTION
- [ ] Testing en producción con pago real
- [ ] Monitorear primeros pagos

---

## 🚀 Próximos Pasos

Una vez implementado Mercado Pago:

1. **Fase 6.5: Confirmación**
   - Página de confirmación con tickets
   - QR codes grandes
   - Descargar PDF

2. **Fase 6.6: Mis Tickets**
   - Dashboard del cliente
   - Lista de tickets comprados
   - Filtros: Próximos | Pasados

3. **Mejoras Futuras**:
   - Suscripciones (eventos mensuales)
   - Split payments (comisión para el venue)
   - Pagos recurrentes
   - Link de pago (sin checkout)

---

**Documentado por**: Claude + Pedro Duran
**Versión del SDK**: mercadopago@2.0.15
**Última revisión**: Enero 2026
