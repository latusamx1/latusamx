# 🧪 Página de Testing del Flujo Completo

## 🌐 URL de Acceso

```
http://localhost:3000/test-flujo
```

## 🎯 Propósito

Esta página interactiva te permite validar el flujo end-to-end del sistema de eventos paso a paso, desde la búsqueda de eventos hasta la visualización de tickets en el dashboard.

## 📋 Funcionalidades

### 1. Tests Automáticos

Algunos pasos incluyen **tests automáticos** que verifican la integridad de los datos en Firestore:

- ✅ Verificar que existan eventos
- ✅ Verificar que se creó la orden
- ✅ Verificar que se generaron los tickets
- ✅ Validar unicidad de QR codes

### 2. Tests Manuales

Otros pasos requieren **intervención manual** para probar la UI y la experiencia del usuario:

- Agregar tickets al carrito
- Editar cantidades en el carrito
- Completar el proceso de checkout
- Verificar la página de confirmación
- Usar filtros en el dashboard

### 3. Navegación Rápida

Botones de navegación directa a cada sección del flujo:
- `/eventos` - Catálogo de eventos
- `/carrito` - Carrito de compras
- `/checkout` - Proceso de pago
- `/cliente/tickets` - Dashboard de tickets

### 4. Progress Tracking

Barra de progreso visual que muestra:
- Pasos completados vs total
- Porcentaje de avance
- Estado de cada paso (idle/running/success/error)

## 🚀 Cómo Usar

### Paso 1: Preparación
```bash
# Asegúrate de tener datos de prueba en Firestore
npm run dev

# Abre en el navegador
http://localhost:3000/test-flujo
```

### Paso 2: Ejecutar Tests Automáticos
1. Click en "Ejecutar Tests Automáticos" para validar datos en Firestore
2. Los tests automáticos se ejecutarán en secuencia
3. Verifica que todos pasen (badge verde)

### Paso 3: Tests Manuales
Para cada paso manual:
1. Lee la **acción manual** descrita
2. Click en "Ir a [ruta]" si aplica
3. Realiza la acción indicada
4. Si todo funciona, click en "Marcar como Completado"

### Paso 4: Verificar Progreso
- La barra de progreso se actualiza automáticamente
- Cuando llegues a 100%, verás un mensaje de éxito

## 📊 Estados de los Pasos

| Estado | Significado |
|--------|------------|
| ⬜ Idle | No iniciado |
| 🔵 Running | Ejecutando test automático |
| ✅ Success | Completado exitosamente |
| ❌ Error | Falló (ver mensaje de error) |

## 🐛 Solución de Problemas

### Error: "Firebase no inicializado"
**Causa**: Firebase no se inicializó correctamente
**Solución**: Recarga la página o verifica las variables de entorno

### Error: "No hay eventos en la base de datos"
**Causa**: Firestore está vacío
**Solución**: Crea al menos 1 evento usando la página de administración

### Error: "No se encontró ninguna orden"
**Causa**: No has completado ningún checkout todavía
**Solución**: Completa el flujo manualmente primero (pasos 1-7)

### Error: "Hay QR codes duplicados"
**Causa**: Bug en la generación de QR codes
**Solución**: Revisa el código en `CheckoutCliente.tsx` línea donde se generan los QR

## 📝 Checklist Rápido

Usa este checklist para validar manualmente:

### Eventos
- [ ] `/eventos` carga correctamente
- [ ] Filtros de categoría funcionan
- [ ] Búsqueda funciona
- [ ] Click en evento abre detalle

### Carrito
- [ ] Agregar ticket muestra toast
- [ ] Badge de carrito se actualiza
- [ ] `/carrito` muestra items correctos
- [ ] Cambiar cantidad recalcula total
- [ ] Eliminar item funciona

### Checkout
- [ ] `/checkout` muestra resumen correcto
- [ ] Validación de campos funciona
- [ ] Botón se deshabilita durante procesamiento
- [ ] Redirección a confirmación funciona

### Confirmación
- [ ] `/confirmacion/[ordenId]` carga
- [ ] QR codes se muestran
- [ ] Efecto confetti se ejecuta
- [ ] Botones de calendario/compartir funcionan

### Dashboard
- [ ] `/cliente/tickets` carga tickets del usuario
- [ ] Stats cards muestran contadores correctos
- [ ] Filtros funcionan
- [ ] Modal de QR se abre
- [ ] Descargar QR funciona

## 🔗 Recursos Relacionados

- **Documentación Completa**: `docs/TESTING_FLUJO_COMPLETO.md`
- **Script Automático**: `scripts/test-flujo-completo.ts`
- **README Confirmación**: `app/(boletera)/confirmacion/[ordenId]/README.md`
- **README Mis Tickets**: `app/(dashboard)/cliente/tickets/README.md`

## 🎨 Características de la Página

### UI/UX
- ✅ Cards con colores según estado
- ✅ Badges visuales (idle/running/success/error)
- ✅ Barra de progreso animada
- ✅ Botones de navegación rápida
- ✅ Mensaje de éxito al 100%

### Responsive
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

## 💡 Tips

1. **Usa modo incógnito** para probar con diferentes usuarios
2. **Abre DevTools** para ver errores en consola
3. **Verifica Firestore** para validar que se crearon los documentos
4. **Toma screenshots** de cada paso si encuentras bugs

## 🚨 Reportar Bugs

Si encuentras algún bug durante el testing:

1. Anótalo en `docs/TESTING_FLUJO_COMPLETO.md` sección "Registro de Bugs"
2. Incluye:
   - Descripción del bug
   - Pasos para reproducir
   - Error en consola (si aplica)
   - Screenshot (si aplica)

---

**Creado**: 20 de Enero, 2026
**Última Actualización**: 20 de Enero, 2026
**Versión**: 1.0.0
