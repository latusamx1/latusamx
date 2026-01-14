# 🧪 Guía de Prueba: Página de Confirmación

## ✅ Cambios Implementados

### 1. Flujo de Checkout Mejorado
El checkout ahora:
- ✅ Crea la orden en Firestore con todos los detalles
- ✅ Genera tickets individuales con QR codes únicos
- ✅ Redirige automáticamente a `/confirmacion/[ordenId]`
- ✅ Muestra logs en consola para debugging

### 2. Página de Confirmación Dinámica
Ubicación: `app/(boletera)/confirmacion/[ordenId]/`

**Características:**
- ✅ Carga datos reales desde Firestore (orden, tickets, evento)
- ✅ Muestra QR codes funcionales para cada ticket
- ✅ Efecto de confetti animado al cargar
- ✅ Botón para descargar calendario (.ics)
- ✅ Botón para compartir
- ✅ Botón para descargar PDF (preparado)
- ✅ Diseño responsive siguiendo `designs/confirmacion.html`

## 🚀 Cómo Probar

### Opción A: Flujo Completo (Recomendado)

1. **Agregar eventos al carrito**
   ```
   http://localhost:3000/eventos
   ```
   - Busca eventos disponibles
   - Haz clic en "Ver evento"
   - Selecciona cantidad de tickets
   - Agrega al carrito

2. **Ir al carrito**
   ```
   http://localhost:3000/carrito
   ```
   - Verifica los items
   - Haz clic en "Proceder al pago"

3. **Completar checkout**
   ```
   http://localhost:3000/checkout
   ```
   - **Paso 1**: Información de contacto
     - Nombre
     - Email
     - Teléfono

   - **Paso 2**: Método de pago
     - Número de tarjeta (cualquier número de prueba)
     - Fecha de expiración
     - CVV
     - Nombre en la tarjeta

   - **Paso 3**: Facturación (opcional)
     - Puedes saltarlo

   - Acepta términos y condiciones
   - Haz clic en "Pagar"

4. **Ver confirmación**
   - Automáticamente serás redirigido a:
   ```
   http://localhost:3000/confirmacion/[ID-GENERADO]
   ```
   - Verás todos tus tickets con QR codes
   - Prueba los botones:
     - 📥 Descargar PDF
     - 📅 Agregar al Calendario
     - 🔗 Compartir

### Opción B: Prueba Rápida con Datos de Ejemplo

1. **Ir a la página de prueba**
   ```
   http://localhost:3000/test-orden
   ```

2. **Crear orden de prueba**
   - Haz clic en "Crear Orden de Prueba"
   - Espera a que se cree la orden
   - Se generarán 5 tickets automáticamente:
     - 2 tickets VIP ($500 c/u)
     - 3 tickets General ($200 c/u)

3. **Ver confirmación**
   - Haz clic en "Ir a Página de Confirmación"
   - Verás la página con todos los detalles

## 🔍 Verificar en la Consola

Durante el proceso, verás logs útiles:

```javascript
// Al crear la orden
Orden creada con ID: abc123xyz

// Al crear cada ticket
Ticket creado: ticket-id-1
Ticket creado: ticket-id-2
...

// Al redirigir
Todos los tickets creados exitosamente
Redirigiendo a confirmación con orden ID: abc123xyz
```

## 📊 Verificar en Firestore

1. Abre Firebase Console
2. Ve a Firestore Database
3. Busca las colecciones:
   - `ordenes/` - Debe tener tu nueva orden
   - `tickets/` - Debe tener N tickets (según cantidad comprada)
   - `eventos/` - Debe tener el evento relacionado

## ⚠️ Troubleshooting

### Problema: No redirige a confirmación

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca el log: `Redirigiendo a confirmación con orden ID: ...`
3. Si no aparece, revisa errores en consola
4. Verifica que Firebase esté configurado correctamente

### Problema: Página de confirmación muestra "Cargando..."

**Solución:**
1. Verifica que la orden existe en Firestore
2. Verifica que los tickets existen en Firestore
3. Revisa la consola del navegador para errores
4. Verifica la URL: debe ser `/confirmacion/[ID-REAL]`

### Problema: No se muestran los QR codes

**Solución:**
1. Verifica que los tickets tienen el campo `qrCode`
2. Revisa la consola para errores de `qrcode.react`
3. Asegúrate de que la librería esté instalada:
   ```bash
   npm install qrcode.react
   ```

### Problema: "Orden no encontrada"

**Solución:**
1. El ID en la URL debe ser válido
2. La orden debe existir en Firestore
3. Usa la página de prueba para crear una orden válida

## 🧹 Limpiar Datos de Prueba

Para eliminar órdenes de prueba:

1. Ve a Firebase Console
2. Firestore Database
3. Elimina documentos de las colecciones:
   - `ordenes/test-*`
   - `tickets/` (con ordenId de prueba)
   - `eventos/test-evento-123`

## 📝 Estructura de Datos

### Colección `ordenes`
```typescript
{
  id: "orden-123",
  userId: "user-uid",
  eventoId: "evento-id",
  items: [
    {
      tipoTicketId: "vip-001",
      nombre: "VIP",
      precio: 500,
      cantidad: 2,
      subtotal: 1000
    }
  ],
  subtotal: 1000,
  descuento: 0,
  total: 1000,
  metodoPago: "card",
  estado: "pagada",
  datosComprador: {
    nombre: "Juan Pérez",
    email: "juan@ejemplo.com",
    telefono: "+52 123 456 7890"
  },
  createdAt: Timestamp,
  pagadoAt: Timestamp
}
```

### Colección `tickets`
```typescript
{
  id: "ticket-123",
  ordenId: "orden-123",
  eventoId: "evento-id",
  tipoTicketId: "vip-001",
  tipoTicket: "VIP",
  precio: 500,
  qrCode: "TICKET-orden-123-1234567890-0-abc123",
  usado: false,
  createdAt: Timestamp
}
```

## 🎯 Siguiente Paso

Después de probar, puedes:
1. ✅ Implementar generación real de PDF con `jspdf`
2. ✅ Configurar envío de emails con Cloud Functions
3. ✅ Agregar notificaciones push
4. ✅ Implementar transferencia de tickets

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en consola
2. Verifica Firebase Console
3. Usa la página `/test-orden` para debugging
4. Consulta este documento

---

**Última actualización**: 13 de Enero, 2026
**Desarrollado por**: Claude + Pedro Durán
