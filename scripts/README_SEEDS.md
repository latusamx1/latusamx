# 🌱 Scripts de Seed y Testing

## 📋 Listado de Scripts

### 1. Seed de Eventos 2026
```bash
npx ts-node scripts/seed-eventos-2026.ts
```

Crea 3 eventos de prueba para Enero-Febrero 2026 con stock variado:

| Evento | Fecha | Stock | Propósito |
|--------|-------|-------|-----------|
| **Festival Electrónico** | 14 Feb 2026 | 🟢 100% disponible | Testing de compra normal |
| **Los Ángeles Azules** | 8 Feb 2026 | 🟡 15-85% disponible | Testing con stock limitado |
| **Franco Escamilla** | 31 Ene 2026 | 🔴 0-0.8% disponible | Testing de límites y agotado |

### 2. Limpieza de Eventos Antiguos
```bash
npx ts-node scripts/cleanup-eventos-old.ts
```

Elimina eventos con fechas pasadas automáticamente.

### 3. Tests de Race Conditions
```bash
npx ts-node scripts/test-race-conditions.ts
```

Ejecuta 7 tests automatizados que verifican integridad del sistema bajo condiciones de concurrencia.

### 4. Tests de Flujo Completo
```bash
npx ts-node scripts/test-flujo-completo.ts
```

Valida integridad de datos en Firestore (órdenes, tickets, eventos).

---

## 🚀 Uso Completo

### Primer Uso (Setup Inicial)

```bash
# 1. Limpiar eventos viejos (si existen)
npx ts-node scripts/cleanup-eventos-old.ts

# 2. Crear eventos de prueba
npx ts-node scripts/seed-eventos-2026.ts

# 3. Abrir navegador
# http://localhost:3000/eventos

# 4. Verificar que todo funcione
npx ts-node scripts/test-flujo-completo.ts
```

### Testing de Sistema de Inventario

```bash
# Ejecutar tests de race conditions
npx ts-node scripts/test-race-conditions.ts

# Resultado esperado:
# ✅ Test 1: Compra Sencilla - PASSED
# ✅ Test 2: Compras Simultáneas (2 usuarios) - PASSED
# ✅ Test 3: Overselling (5 usuarios) - PASSED
# ✅ Test 4: Compra Exacta (agotar stock) - PASSED
# ✅ Test 5: Compra Rechazada (cantidad excesiva) - PASSED
# ✅ Test 6: Revertir Compra (reembolso) - PASSED
# ✅ Test 7: Verificar Disponibilidad - PASSED
#
# 📊 RESUMEN: 7/7 tests exitosos (100%)
```

### Testing Manual Interactivo

```bash
# 1. Iniciar servidor
npm run dev

# 2. Abrir página de testing
# http://localhost:3000/test-flujo

# 3. Seguir los pasos en pantalla
```

---

## 🎯 Escenarios de Prueba Recomendados

### Escenario 1: Compra Normal
```
Evento: Festival Electrónico
Tickets: General (40,000 disponibles)
Acción: Comprar 5 tickets
Resultado esperado: ✅ Compra exitosa
```

### Escenario 2: Últimas Entradas
```
Evento: Franco Escamilla
Tickets: General (solo 12 disponibles)
Acción: Comprar 10 tickets
Resultado esperado: ✅ Compra exitosa, quedan 2
```

### Escenario 3: Stock Insuficiente
```
Evento: Franco Escamilla
Tickets: Preferente (solo 5 disponibles)
Acción: Comprar 8 tickets
Resultado esperado: ❌ Error "Stock insuficiente"
```

### Escenario 4: Tickets Agotados
```
Evento: Franco Escamilla
Tickets: VIP (0 disponibles)
Acción: Intentar comprar 1 ticket
Resultado esperado: ❌ Botón deshabilitado, mensaje "Agotado"
```

### Escenario 5: Race Condition
```
Evento: Los Ángeles Azules
Tickets: VIP Meet & Greet (solo 8 disponibles)
Acción: 2 usuarios compran 5 tickets cada uno SIMULTÁNEAMENTE
Resultado esperado:
  - Usuario A: ✅ Compra exitosa (5 tickets)
  - Usuario B: ❌ Error "Stock insuficiente. Disponibles: 3"
```

---

## 🔧 Personalizar Seed

### Agregar Más Eventos

Edita `scripts/seed-eventos-2026.ts` y agrega un nuevo objeto al array `eventos`:

```typescript
{
  titulo: 'Tu Evento Aquí',
  descripcion: 'Descripción del evento',
  categoria: 'concierto', // o 'festival', 'deportes', 'teatro', 'otro'
  fecha: Timestamp.fromDate(new Date('2026-03-15T20:00:00')),
  horaInicio: '20:00',
  horaFin: '23:00',
  venueId: 'venue-004',
  venue: {
    id: 'venue-004',
    nombre: 'Nombre del Venue',
    direccion: 'Dirección completa',
    ciudad: 'Ciudad',
    estado: 'Estado',
    codigoPostal: '12345',
    capacidad: 5000,
    // ... resto de campos
  },
  imagenPortada: 'https://images.unsplash.com/photo-...', // URL de imagen
  tiposTickets: [
    {
      id: 'ticket-tu-evento-general',
      nombre: 'General',
      descripcion: 'Acceso general',
      precio: 500,
      cantidad: 1000,
      disponibles: 1000, // Ajusta según necesites
      ventaMinima: 1,
      ventaMaxima: 10,
      orden: 1
    }
  ],
  // ... resto de campos
}
```

### Ajustar Stock de Evento Existente

Para simular ventas en progreso, modifica el campo `disponibles`:

```typescript
{
  nombre: 'VIP',
  precio: 3500,
  cantidad: 5000,
  disponibles: 250, // 5% disponible (95% vendido)
}
```

---

## 📊 Entender el Output

### Seed Eventos
```
✅ Festival Electrónico Winter 2026
   ID: abc123xyz
   Fecha: viernes, 14 de febrero de 2026
   Venue: Foro Sol
   Stock: 45500/45500 (100.0% disponible)
   Tipos de Tickets:
      🟢 General: 40000/40000 (100%)    ← Verde = Disponible
      🟢 VIP: 5000/5000 (100%)
      🟢 Platinum: 500/500 (100%)
```

### Tests de Race Conditions
```
🧪 Test 2: Compras Simultáneas (2 usuarios)...
   📦 Evento configurado: 5 tickets disponibles
   👥 Simulando 2 usuarios comprando 3 tickets cada uno...
   ✓ Solo 1 compra fue exitosa (correcto)
   ✓ Stock final correcto: 5 → 2
   ✓ Error esperado: "Stock insuficiente..."
✅ Test 2: Compras Simultáneas (2 usuarios) - PASSED
```

---

## ⚠️ Notas Importantes

1. **Firebase debe estar inicializado**: Verifica que `.env.local` tenga las credenciales correctas

2. **Los scripts son idempotentes**: Puedes ejecutarlos múltiples veces sin problemas

3. **Limpieza automática**: `cleanup-eventos-old.ts` solo elimina eventos con fechas pasadas

4. **IDs únicos**: Cada ejecución del seed crea eventos con IDs nuevos

5. **Testing en producción**: NO ejecutes estos scripts en producción, solo en desarrollo

---

## 🐛 Troubleshooting

### Error: "Firebase no inicializado"
```bash
# Verifica que exista .env.local con:
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

### Error: "Cannot find module"
```bash
# Instala dependencias
npm install

# O específicamente:
npm install firebase date-fns
```

### Los eventos no aparecen en la web
```bash
# 1. Verifica que se crearon en Firestore Console
# https://console.firebase.google.com/

# 2. Revisa las reglas de Firestore
# Deben permitir lectura pública de eventos

# 3. Recarga la página con Ctrl+Shift+R
```

---

**Creado**: 20 de Enero, 2026
**Última actualización**: 20 de Enero, 2026
**Versión**: 1.0.0
