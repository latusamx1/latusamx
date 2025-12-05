# 🔥 Configuración de Firebase

## 📋 Pasos Completados

### ✅ 1. Configuración Local

- ✅ Variables de entorno configuradas en `.env.local`
- ✅ Firebase SDK inicializado en `lib/firebase/config.ts`
- ✅ Helpers de autenticación creados en `lib/firebase/auth.ts`
- ✅ Helpers de Firestore creados en `lib/firebase/firestore.ts`

### ✅ 2. Modelo de Datos

- ✅ Tipos TypeScript completos en `types/index.ts`
- ✅ Servicios base creados:
  - `lib/services/usuarios.service.ts`
  - `lib/services/eventos.service.ts`
  - `lib/services/reservas.service.ts`

### ✅ 3. Reglas de Seguridad

- ✅ Reglas de Firestore creadas en `firestore.rules`

---

## 🚀 Próximos Pasos - Configurar Firebase Console

### 1️⃣ Desplegar Reglas de Seguridad

Hay dos formas de hacerlo:

#### Opción A: Desde Firebase Console (Recomendado para empezar)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **crm-bt-josue**
3. Ve a **Firestore Database** en el menú lateral
4. Click en la pestaña **Reglas**
5. Copia y pega el contenido de `firestore.rules`
6. Click en **Publicar**

#### Opción B: Con Firebase CLI

```bash
# Instalar Firebase CLI (si no está instalado)
npm install -g firebase-tools

# Login a Firebase
firebase login

# Inicializar proyecto
firebase init firestore

# Desplegar reglas
firebase deploy --only firestore:rules
```

### 2️⃣ Crear Índices Compuestos en Firestore

Los índices se crearán automáticamente cuando ejecutes las queries por primera vez. Firebase te dará un link para crearlos.

También puedes crearlos manualmente:

1. Ve a **Firestore Database** → **Índices**
2. Crea los siguientes índices compuestos:

#### Índice para Eventos
- Colección: `eventos`
- Campos:
  - `estado` (Ascendente)
  - `fecha` (Ascendente)

#### Índice para Eventos por Categoría
- Colección: `eventos`
- Campos:
  - `categoria` (Ascendente)
  - `estado` (Ascendente)
  - `fecha` (Ascendente)

#### Índice para Reservas por Usuario
- Colección: `reservas`
- Campos:
  - `userId` (Ascendente)
  - `fecha` (Descendente)

#### Índice para Reservas por Sucursal y Fecha
- Colección: `reservas`
- Campos:
  - `sucursalId` (Ascendente)
  - `fecha` (Ascendente)

#### Índice para Reservas Próximas
- Colección: `reservas`
- Campos:
  - `userId` (Ascendente)
  - `estado` (Ascendente)
  - `fecha` (Ascendente)

### 3️⃣ Crear Colecciones Iniciales

Crea estas colecciones en Firestore (vacías, solo para que existan):

```
/usuarios
/eventos
/venues
/ordenes
/tickets
/codigos-descuento
/sucursales
/reservas
/mesas
/planos
/lista-espera
```

### 4️⃣ Crear Usuario Admin de Prueba

1. Ve a **Authentication** → **Users**
2. Click en **Add user**
3. Crea el usuario admin:
   - Email: `admin@sistema.com`
   - Password: `Admin123!`
4. Copia el UID del usuario
5. Ve a **Firestore Database**
6. Crea un documento en la colección `usuarios` con el UID como ID:

```json
{
  "email": "admin@sistema.com",
  "nombre": "Administrador",
  "rol": "admin",
  "createdAt": [Timestamp actual],
  "updatedAt": [Timestamp actual]
}
```

### 5️⃣ Crear Usuarios de Prueba Adicionales

#### Host
```json
{
  "email": "host@sistema.com",
  "nombre": "Host de Prueba",
  "rol": "host",
  "telefono": "+52 123 456 7890",
  "createdAt": [Timestamp actual],
  "updatedAt": [Timestamp actual]
}
```

#### Cliente
```json
{
  "email": "cliente@test.com",
  "nombre": "Cliente de Prueba",
  "rol": "cliente",
  "telefono": "+52 098 765 4321",
  "createdAt": [Timestamp actual],
  "updatedAt": [Timestamp actual]
}
```

---

## 🧪 Probar Conexión

Puedes probar la conexión a Firebase ejecutando:

```bash
npm run dev
```

Y en la consola del navegador ejecuta:

```javascript
import { db } from '@/lib/firebase/config'
console.log('Firebase conectado:', db)
```

---

## 🔐 Seguridad

### Variables de Entorno

✅ El archivo `.env.local` está en `.gitignore` - NUNCA lo subas a Git

### Reglas de Firestore

Las reglas actuales implementan:

- ✅ Autenticación requerida para la mayoría de operaciones
- ✅ Validación de roles (admin, host, cliente)
- ✅ Los usuarios solo pueden ver/editar sus propios datos
- ✅ Admin tiene acceso completo
- ✅ Host puede gestionar eventos y reservas
- ✅ Clientes solo ven datos públicos y sus propias órdenes/reservas

---

## 📚 Documentación Útil

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Indexes](https://firebase.google.com/docs/firestore/query-data/indexing)

---

## ✅ Checklist de Configuración

- [ ] Reglas de Firestore desplegadas
- [ ] Índices compuestos creados
- [ ] Colecciones iniciales creadas
- [ ] Usuario admin creado
- [ ] Usuarios de prueba creados (host, cliente)
- [ ] Conexión a Firebase probada

---

**Una vez completado este checklist, estaremos listos para la FASE 3: Autenticación** 🚀
