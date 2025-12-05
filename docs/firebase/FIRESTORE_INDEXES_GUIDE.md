# 🔥 Guía de Índices Compuestos de Firestore

## 📋 Índices Creados

Se han definido **21 índices compuestos** para optimizar las queries del sistema.

---

## 🚀 Opción 1: Desplegar con Firebase CLI (Recomendado)

### 1️⃣ Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2️⃣ Login a Firebase

```bash
firebase login
```

### 3️⃣ Inicializar el proyecto (si no está inicializado)

```bash
firebase init firestore
```

Cuando te pregunte:
- **"What file should be used for Firestore Rules?"** → `firestore.rules`
- **"What file should be used for Firestore indexes?"** → `firestore.indexes.json`

### 4️⃣ Desplegar los índices

```bash
firebase deploy --only firestore:indexes
```

**Esto desplegará automáticamente todos los 21 índices definidos en `firestore.indexes.json`**

---

## 🖱️ Opción 2: Crear Manualmente desde Firebase Console

Si prefieres crear los índices manualmente:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **crm-bt-josue**
3. Ve a **Firestore Database** → **Indexes** (pestaña)
4. Click en **Create index**

### 📊 Índices a Crear

#### 1. Eventos - Por Estado y Fecha
- **Colección**: `eventos`
- **Campos**:
  - `estado` (Ascendente)
  - `fecha` (Ascendente)

#### 2. Eventos - Por Categoría, Estado y Fecha
- **Colección**: `eventos`
- **Campos**:
  - `categoria` (Ascendente)
  - `estado` (Ascendente)
  - `fecha` (Ascendente)

#### 3. Eventos - Destacados
- **Colección**: `eventos`
- **Campos**:
  - `estado` (Ascendente)
  - `destacado` (Ascendente)
  - `fecha` (Ascendente)

#### 4. Eventos - Por Estado (Descendente)
- **Colección**: `eventos`
- **Campos**:
  - `estado` (Ascendente)
  - `fecha` (Descendente)

#### 5. Órdenes - Por Usuario
- **Colección**: `ordenes`
- **Campos**:
  - `userId` (Ascendente)
  - `createdAt` (Descendente)

#### 6. Órdenes - Por Estado
- **Colección**: `ordenes`
- **Campos**:
  - `estado` (Ascendente)
  - `createdAt` (Descendente)

#### 7. Órdenes - Por Evento y Estado
- **Colección**: `ordenes`
- **Campos**:
  - `eventoId` (Ascendente)
  - `estado` (Ascendente)
  - `createdAt` (Descendente)

#### 8. Tickets - Por Orden
- **Colección**: `tickets`
- **Campos**:
  - `ordenId` (Ascendente)
  - `createdAt` (Ascendente)

#### 9. Tickets - Por Evento y Usado
- **Colección**: `tickets`
- **Campos**:
  - `eventoId` (Ascendente)
  - `usado` (Ascendente)

#### 10. Reservas - Por Usuario
- **Colección**: `reservas`
- **Campos**:
  - `userId` (Ascendente)
  - `fecha` (Descendente)

#### 11. Reservas - Por Usuario y Estado
- **Colección**: `reservas`
- **Campos**:
  - `userId` (Ascendente)
  - `estado` (Ascendente)
  - `fecha` (Descendente)

#### 12. Reservas - Por Sucursal y Fecha (Asc)
- **Colección**: `reservas`
- **Campos**:
  - `sucursalId` (Ascendente)
  - `fecha` (Ascendente)

#### 13. Reservas - Por Sucursal y Fecha (Desc)
- **Colección**: `reservas`
- **Campos**:
  - `sucursalId` (Ascendente)
  - `fecha` (Descendente)

#### 14. Reservas - Por Sucursal, Estado y Fecha
- **Colección**: `reservas`
- **Campos**:
  - `sucursalId` (Ascendente)
  - `estado` (Ascendente)
  - `fecha` (Ascendente)

#### 15. Reservas - Próximas por Usuario (Array Contains)
- **Colección**: `reservas`
- **Campos**:
  - `userId` (Ascendente)
  - `fecha` (Ascendente)
  - `estado` (Array contains)

#### 16. Reservas - Por Estado y Fecha
- **Colección**: `reservas`
- **Campos**:
  - `estado` (Ascendente)
  - `fecha` (Ascendente)

#### 17. Mesas - Por Sucursal y Estado
- **Colección**: `mesas`
- **Campos**:
  - `sucursalId` (Ascendente)
  - `estado` (Ascendente)

#### 18. Mesas - Por Sucursal y Activa
- **Colección**: `mesas`
- **Campos**:
  - `sucursalId` (Ascendente)
  - `activa` (Ascendente)

#### 19. Lista de Espera - Por Sucursal
- **Colección**: `lista-espera`
- **Campos**:
  - `sucursalId` (Ascendente)
  - `completado` (Ascendente)
  - `timestamp` (Ascendente)

#### 20. Usuarios - Por Rol
- **Colección**: `usuarios`
- **Campos**:
  - `rol` (Ascendente)
  - `createdAt` (Descendente)

---

## 📝 Índices Simples (Se crean automáticamente)

Firestore crea automáticamente índices simples para:
- Cada campo individual
- Queries de igualdad (`==`)
- Queries de rango (`<`, `<=`, `>`, `>=`) en un solo campo

**No necesitas crear estos manualmente.**

---

## ⚡ ¿Cuándo Necesitas Estos Índices?

Estos índices son necesarios cuando:

1. **Múltiples campos en la query**
   ```typescript
   // Requiere índice: estado + fecha
   query(eventosRef,
     where('estado', '==', 'publicado'),
     orderBy('fecha', 'asc')
   )
   ```

2. **Ordenamiento con filtros**
   ```typescript
   // Requiere índice: userId + fecha
   query(reservasRef,
     where('userId', '==', uid),
     orderBy('fecha', 'desc')
   )
   ```

3. **Queries complejas**
   ```typescript
   // Requiere índice: categoria + estado + fecha
   query(eventosRef,
     where('categoria', '==', 'concierto'),
     where('estado', '==', 'publicado'),
     orderBy('fecha', 'asc')
   )
   ```

---

## 🔍 Verificar Índices Desplegados

### Desde Firebase Console:
1. Ve a **Firestore Database** → **Indexes**
2. Verás todos los índices con su estado:
   - ✅ **Enabled** - Índice listo para usar
   - 🟡 **Building** - Se está construyendo (puede tardar)
   - ❌ **Error** - Hubo un error

### Desde Firebase CLI:
```bash
firebase firestore:indexes
```

---

## 🚨 Troubleshooting

### Error: "The query requires an index"

Si ves este error en la consola, significa que falta un índice.

**Solución rápida:**
1. El error te dará un **link directo** para crear el índice
2. Click en el link
3. Firebase te llevará al formulario pre-llenado
4. Click en **Create index**

**O usa el CLI:**
```bash
firebase deploy --only firestore:indexes
```

### Los índices tardan mucho en construirse

Para colecciones grandes, los índices pueden tardar:
- Pequeñas (<1000 docs): 1-5 minutos
- Medianas (1000-10000 docs): 5-30 minutos
- Grandes (>10000 docs): 30 minutos - horas

**Estado "Building"** es normal, ten paciencia.

---

## 📊 Monitoreo de Uso de Índices

### Ver qué índices se usan más:
1. Ve a **Firestore** → **Usage**
2. Selecciona **Indexes**
3. Verás estadísticas de uso

### Eliminar índices no utilizados:

Si un índice no se usa en 30+ días:
```bash
firebase firestore:indexes:delete <INDEX_ID>
```

O desde la consola: Click en los 3 puntos → **Delete**

---

## 🎯 Próximos Pasos

1. ✅ Desplegar índices (CLI o manual)
2. ⏳ Esperar a que todos estén "Enabled"
3. ✅ Probar queries en tu app
4. 📊 Monitorear uso y performance

---

## 📚 Recursos Útiles

- [Firestore Indexes Docs](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Query Limitations](https://firebase.google.com/docs/firestore/query-data/queries#query_limitations)

---

## ✅ Checklist

- [ ] Firebase CLI instalado
- [ ] Login a Firebase exitoso
- [ ] Proyecto inicializado con `firebase init firestore`
- [ ] Archivo `firestore.indexes.json` verificado
- [ ] Índices desplegados con `firebase deploy --only firestore:indexes`
- [ ] Todos los índices en estado "Enabled"
- [ ] Queries probadas en la app
- [ ] Sin errores de "requires an index"

---

**Una vez completados estos pasos, tu Firestore estará optimizado para producción** 🚀
