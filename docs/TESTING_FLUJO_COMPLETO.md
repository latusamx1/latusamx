# 🧪 Testing del Flujo Completo - Sistema de Eventos

## 📋 Objetivo

Validar el flujo end-to-end desde que un usuario busca eventos hasta que ve sus tickets en el dashboard.

## 🎯 Flujo a Probar

```
1. Buscar/Filtrar Eventos
   ↓
2. Ver Detalles del Evento
   ↓
3. Agregar Tickets al Carrito
   ↓
4. Editar Carrito (cantidad, eliminar)
   ↓
5. Proceso de Checkout
   ↓
6. Generar Orden + Tickets
   ↓
7. Ver Confirmación con QR
   ↓
8. Ver Tickets en Dashboard
```

---

## ✅ Test Case 1: Búsqueda y Filtrado de Eventos

### Precondiciones
- Usuario debe estar en la página principal o de eventos
- Debe haber al menos 5 eventos en Firestore

### Pasos
1. Abrir `/eventos`
2. Verificar que se muestren todos los eventos
3. Usar el filtro de categoría
4. Usar el filtro de fecha
5. Usar la barra de búsqueda

### Criterios de Éxito
- [ ] Eventos se cargan correctamente
- [ ] Filtros funcionan independientemente
- [ ] Búsqueda filtra por título/descripción
- [ ] Resultados se actualizan en tiempo real
- [ ] Sin errores en consola

### Resultado
**Estado**: ⬜ No probado | ✅ Exitoso | ❌ Fallido

**Notas**:
_[Agregar observaciones aquí]_

---

## ✅ Test Case 2: Agregar Tickets al Carrito

### Precondiciones
- Usuario autenticado
- Al menos 1 evento disponible
- Carrito vacío

### Pasos
1. Click en un evento
2. Ver página de detalle `/eventos/[id]`
3. Seleccionar cantidad de tickets (ej: 2)
4. Click en "Agregar al Carrito"
5. Verificar toast de confirmación
6. Abrir el carrito

### Criterios de Éxito
- [ ] Modal/página de detalle se abre correctamente
- [ ] Selector de cantidad funciona (min: 1, max: disponibles)
- [ ] Toast muestra "Tickets agregados al carrito"
- [ ] Badge del carrito se actualiza
- [ ] Items aparecen en el carrito
- [ ] Precio total se calcula correctamente

### Resultado
**Estado**: ⬜ No probado | ✅ Exitoso | ❌ Fallido

**Notas**:
_[Agregar observaciones aquí]_

---

## ✅ Test Case 3: Editar Carrito

### Precondiciones
- Carrito con al menos 2 items diferentes
- Usuario autenticado

### Pasos
1. Abrir carrito (`/carrito` o modal)
2. Cambiar cantidad de un item (aumentar)
3. Cambiar cantidad de un item (disminuir)
4. Eliminar un item completamente
5. Verificar cálculos de subtotal/total

### Criterios de Éxito
- [ ] Cantidad se actualiza correctamente
- [ ] Subtotal por item se recalcula
- [ ] Total general se actualiza
- [ ] Eliminar item funciona con confirmación
- [ ] Carrito vacío muestra estado apropiado
- [ ] Cambios persisten al recargar página

### Resultado
**Estado**: ⬜ No probado | ✅ Exitoso | ❌ Fallido

**Notas**:
_[Agregar observaciones aquí]_

---

## ✅ Test Case 4: Proceso de Checkout

### Precondiciones
- Carrito con 2+ items
- Usuario autenticado con email válido
- Método de pago configurado (simulación)

### Pasos
1. Click en "Proceder al Checkout"
2. Navegar a `/checkout`
3. Verificar resumen de orden
4. Completar información de contacto (si aplica)
5. Seleccionar método de pago
6. Click en "Confirmar Compra"

### Criterios de Éxito
- [ ] Página de checkout se carga con datos correctos
- [ ] Resumen muestra todos los items
- [ ] Total coincide con el carrito
- [ ] Validación de campos funciona
- [ ] Botón se deshabilita durante procesamiento
- [ ] Indicador de carga se muestra

### Resultado
**Estado**: ⬜ No probado | ✅ Exitoso | ❌ Fallido

**Notas**:
_[Agregar observaciones aquí]_

---

## ✅ Test Case 5: Generación de Orden y Tickets

### Precondiciones
- Checkout completado exitosamente
- Firebase Firestore funcionando

### Pasos
1. Después del checkout, verificar redirección
2. Abrir Firestore Console
3. Buscar la orden creada en colección `ordenes`
4. Verificar tickets en colección `tickets`
5. Validar estructura de datos

### Criterios de Éxito
- [ ] Orden se crea en Firestore con ID único
- [ ] Orden contiene: userId, items, total, fecha, estado
- [ ] Se crean N tickets (1 por cada cantidad)
- [ ] Cada ticket tiene QR único
- [ ] QR sigue formato: `TICKET-{ordenId}-{timestamp}-{index}-{random}`
- [ ] Relaciones ordenId/eventoId son correctas
- [ ] Campo `usado: false` por defecto

### Verificación en Firestore
```typescript
// Estructura esperada en ordenes
{
  id: "orden-abc123",
  userId: "user-xyz",
  items: [{eventoId, cantidad, precio, tipoTicket}],
  total: 1500,
  fecha: Timestamp,
  estado: "completada",
  createdAt: Timestamp
}

// Estructura esperada en tickets
{
  id: "ticket-def456",
  ordenId: "orden-abc123",
  eventoId: "evento-789",
  qrCode: "TICKET-orden-abc123-1737753600-0-x9k2p",
  precio: 500,
  tipoTicket: "VIP",
  usado: false,
  userId: "user-xyz",
  createdAt: Timestamp
}
```

### Resultado
**Estado**: ⬜ No probado | ✅ Exitoso | ❌ Fallido

**Notas**:
_[Agregar observaciones aquí]_

---

## ✅ Test Case 6: Ver Confirmación con QR

### Precondiciones
- Orden y tickets creados en Firestore
- Usuario redirigido a `/confirmacion/[ordenId]`

### Pasos
1. Verificar carga de página de confirmación
2. Revisar que se muestre:
   - Mensaje de éxito
   - Detalles de la orden
   - Lista de tickets con QR
3. Probar botón "Descargar Calendario"
4. Probar botón "Compartir"
5. Verificar efecto de confetti

### Criterios de Éxito
- [ ] Página carga sin errores
- [ ] Datos de orden se muestran correctamente
- [ ] QR codes se generan visualmente
- [ ] Cada ticket tiene su QR único
- [ ] Botón calendario genera archivo .ics
- [ ] Compartir abre Web Share API
- [ ] Confetti se anima al cargar
- [ ] Enlaces a "Mis Tickets" y "Ver Eventos" funcionan

### Resultado
**Estado**: ⬜ No probado | ✅ Exitoso | ❌ Fallido

**Notas**:
_[Agregar observaciones aquí]_

---

## ✅ Test Case 7: Ver Tickets en Dashboard

### Precondiciones
- Usuario con al menos 3 tickets (próximos, pasados, usados)
- Usuario autenticado

### Pasos
1. Navegar a `/cliente/tickets`
2. Verificar que se muestren stats cards
3. Probar cada filtro (Todos/Próximos/Pasados/Usados)
4. Click en "Ver QR" de un ticket
5. En el modal:
   - Verificar QR grande
   - Probar "Descargar QR"
   - Probar "Compartir"
6. Cerrar modal

### Criterios de Éxito
- [ ] Página carga con tickets del usuario
- [ ] Stats cards muestran contadores correctos
- [ ] Filtros funcionan correctamente
- [ ] Estados visuales (Próximo/Pasado/Usado) son correctos
- [ ] Modal se abre con datos correctos
- [ ] QR es legible y escaneable
- [ ] Descargar QR genera PNG
- [ ] Compartir funciona (Web Share o clipboard)
- [ ] Tickets usados muestran fecha de uso

### Resultado
**Estado**: ⬜ No probado | ✅ Exitoso | ❌ Fallido

**Notas**:
_[Agregar observaciones aquí]_

---

## 🔍 Test Case 8: Validaciones y Edge Cases

### Sub-test A: Carrito Vacío
- [ ] Intentar ir a checkout con carrito vacío
- [ ] Debe mostrar mensaje o redirigir

### Sub-test B: Stock Insuficiente
- [ ] Intentar agregar más tickets de los disponibles
- [ ] Debe mostrar error y limitar cantidad

### Sub-test C: Evento Agotado
- [ ] Intentar agregar tickets a evento con stock 0
- [ ] Botón debe estar deshabilitado

### Sub-test D: Usuario No Autenticado
- [ ] Intentar agregar al carrito sin login
- [ ] Debe redirigir a login o mostrar modal

### Sub-test E: Pago Fallido
- [ ] Simular fallo en el pago
- [ ] No debe crear orden ni tickets
- [ ] Usuario debe poder reintentar

### Sub-test F: Orden Inexistente
- [ ] Navegar a `/confirmacion/orden-no-existe`
- [ ] Debe mostrar página de error 404

### Resultado
**Estado**: ⬜ No probado | ✅ Exitoso | ❌ Fallido

**Notas**:
_[Agregar observaciones aquí]_

---

## 📱 Test Case 9: Responsive y Mobile

### Dispositivos a Probar
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Áreas Críticas
1. **Lista de Eventos**
   - [ ] Grid responsive
   - [ ] Cards legibles

2. **Carrito**
   - [ ] Modal/drawer adaptable
   - [ ] Botones accesibles

3. **Checkout**
   - [ ] Form legible en mobile
   - [ ] Botones no se solapan

4. **Confirmación**
   - [ ] QR codes se ven bien
   - [ ] Botones accesibles

5. **Mis Tickets**
   - [ ] Stats cards en grid
   - [ ] Tabs con scroll horizontal
   - [ ] Modal adaptable

### Resultado
**Estado**: ⬜ No probado | ✅ Exitoso | ❌ Fallido

**Notas**:
_[Agregar observaciones aquí]_

---

## ⚡ Test Case 10: Performance

### Métricas a Medir
1. **Tiempo de Carga Inicial**
   - [ ] `/eventos` < 2s
   - [ ] `/checkout` < 1.5s
   - [ ] `/cliente/tickets` < 2s

2. **Operaciones de Carrito**
   - [ ] Agregar item < 500ms
   - [ ] Actualizar cantidad < 300ms
   - [ ] Eliminar item < 300ms

3. **Proceso de Checkout**
   - [ ] Crear orden + tickets < 3s
   - [ ] Generar QR codes < 1s

4. **Consultas a Firestore**
   - [ ] Usar índices adecuados
   - [ ] Evitar múltiples queries anidadas
   - [ ] Implementar paginación si hay +50 items

### Resultado
**Estado**: ⬜ No probado | ✅ Exitoso | ❌ Fallido

**Notas**:
_[Agregar observaciones aquí]_

---

## 🛠️ Herramientas de Testing

### Manual Testing
```bash
# 1. Iniciar servidor de desarrollo
npm run dev

# 2. Abrir en navegador
http://localhost:3000

# 3. Abrir DevTools
# - Console: Ver errores
# - Network: Ver llamadas a Firebase
# - Application: Ver localStorage/cookies
```

### Firebase Console
```
https://console.firebase.google.com/
→ Ir a tu proyecto
→ Firestore Database
→ Ver colecciones: eventos, ordenes, tickets
```

### Testing con Múltiples Usuarios
```bash
# Usar modo incógnito o diferentes navegadores
# Crear 2-3 usuarios de prueba
# Verificar que cada uno ve solo sus tickets
```

---

## 📊 Checklist Resumen

### Funcionalidad Core
- [ ] Búsqueda de eventos funciona
- [ ] Filtros de eventos funcionan
- [ ] Agregar al carrito funciona
- [ ] Editar carrito funciona
- [ ] Checkout completo funciona
- [ ] Orden se crea en Firestore
- [ ] Tickets se generan correctamente
- [ ] QR codes son únicos
- [ ] Confirmación muestra datos correctos
- [ ] Dashboard de tickets funciona
- [ ] Filtros de tickets funcionan
- [ ] Modal de detalle funciona

### Validaciones
- [ ] Stock se valida
- [ ] Usuario autenticado requerido
- [ ] Errores se manejan correctamente
- [ ] Loading states funcionan

### UX/UI
- [ ] Diseño responsive
- [ ] Animaciones suaves
- [ ] Toast notifications claras
- [ ] Estados vacíos bien diseñados

### Performance
- [ ] Tiempos de carga aceptables
- [ ] No hay memory leaks
- [ ] Consultas optimizadas

---

## 🐛 Registro de Bugs Encontrados

### Bug #1
**Descripción**:
**Severidad**: 🔴 Alta | 🟡 Media | 🟢 Baja
**Pasos para reproducir**:
**Solución propuesta**:

### Bug #2
**Descripción**:
**Severidad**: 🔴 Alta | 🟡 Media | 🟢 Baja
**Pasos para reproducir**:
**Solución propuesta**:

---

## ✅ Criterios de Aceptación Final

Para marcar la sección 6.8 como completa:

1. ✅ Todos los test cases principales (1-7) exitosos
2. ✅ Al menos 80% de edge cases (8) cubiertos
3. ✅ Responsive funciona en 3 tamaños
4. ✅ Performance aceptable (<3s operaciones críticas)
5. ✅ Cero errores críticos en consola
6. ✅ Documentación de bugs encontrados

---

## 📝 Notas Adicionales

### Datos de Prueba Recomendados
```typescript
// Crear al menos estos eventos:
1. Evento próximo (fecha futura) - Stock: 50
2. Evento pasado (fecha antigua) - Stock: 0
3. Evento hoy - Stock: 10
4. Evento VIP - Precio alto
5. Evento gratuito - Precio: 0
```

### Usuarios de Prueba
```
Usuario 1: test@example.com (con tickets)
Usuario 2: test2@example.com (sin tickets)
Usuario 3: admin@example.com (rol admin)
```

---

**Documento Creado**: 20 de Enero, 2026
**Última Actualización**: 20 de Enero, 2026
**Responsable**: Claude Sonnet 4.5 + Pedro Durán
**Versión**: 1.0.0
