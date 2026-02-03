# 📋 TODO - Sistema de Gestión de Eventos y Reservas

> **Última actualización**: 22 de Enero, 2026
> **Estado del Proyecto**: 🟢 INICIANDO FASE 7
> **Progreso Global**: 71% (81/113 tareas completadas)

---

## 📊 PROGRESO GENERAL

```
✅ FASE 1: Setup del Proyecto       [████████████████████] 100% (11/11) ✓
✅ FASE 2: Arquitectura Firebase    [████████████████████] 100% (8/8) ✓
✅ FASE 3: Autenticación             [████████████████████] 100% (6/6) ✓
✅ FASE 4: Sistema de Roles          [████████████████████] 100% (5/5) ✓
✅ FASE 5: Componentes UI Base       [████████████████████] 100% (25/25) ✓
   ✅ 5.1: shadcn/ui                 [████████████████████] 100% (13/13) ✓
   ✅ 5.2: Layout Components         [████████████████████] 100% (5/5) ✓
   ✅ 5.3: Feature Components        [████████████████████] 100% (8/8) ✓
   ✅ 5.4: Shared Components         [████████████████████] 100% (5/5) ✓
   ✅ 5.5: Landing Page              [████████████████████] 100% (4/4) ✓
✅ FASE 6: Módulo Eventos (Cliente)  [████████████████████] 100% (15/15) ✓
   ✅ 6.1: Catálogo                  [████████████████████] 100% (2/2) ✓
   ✅ 6.2: Detalle                   [████████████████████] 100% (1/1) ✓
   ✅ 6.3: Carrito                   [████████████████████] 100% (1/1) ✓
   ✅ 6.4: Checkout                  [████████████████████] 100% (1/1) ✓
   ✅ 6.5: Confirmación              [████████████████████] 100% (1/1) ✓
   ✅ 6.6: Mis Tickets               [████████████████████] 100% (1/1) ✓
   ✅ 6.7: Services & Hooks          [████████████████████] 100% (4/4) ✓
   ✅ 6.8: Testing del Flujo         [████████████████████] 100% (9/9) ✓
🔄 FASE 7: Módulo Eventos (Admin)    [█████░░░░░░░░░░░░░░░]  33% (5/15)
   ✅ 7.1: Dashboard Admin           [████████████████████] 100% (5/5) ✓
⏳ FASE 8: Módulo Eventos (Host)     [░░░░░░░░░░░░░░░░░░░░]   0% (0/8)
⏳ FASE 9: Módulo Reservas (Cliente) [░░░░░░░░░░░░░░░░░░░░]   0% (0/12)
⏳ FASE 10: Módulo Reservas (Admin)  [░░░░░░░░░░░░░░░░░░░░]   0% (0/15)
⏳ FASE 11: Módulo Reservas (Host)   [░░░░░░░░░░░░░░░░░░░░]   0% (0/8)
──────────────────────────────────────────────────────────
TOTAL:                               [██████████████░░░░░░]  71% (81/113)
```

---

## 🎯 STACK TECNOLÓGICO

### Frontend
- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

### Backend & Services
- **BaaS**: Firebase
  - Authentication (Email/Password, Google)
  - Firestore (Database)
  - Cloud Functions (Notifications, Payments)
  - Cloud Messaging (Push notifications)
- **Storage**: Cloudinary (Images, QR codes) - Free tier 25GB

### State & Data
- **Global State**: Zustand + Immer
- **Forms**: React Hook Form + Zod
- **Data Fetching**: Firebase SDK + React Query (TanStack Query)

### Utils & Tools
- **Dates**: date-fns
- **QR Codes**: qrcode.react
- **Notifications**: sonner
- **Charts**: recharts
- **Calendar**: react-big-calendar

---

## 🏗️ ARQUITECTURA DEL PROYECTO

```
app/
├── (auth)/              # Grupo de rutas de autenticación
│   ├── login/           # Server Components + Client Forms
│   └── register/
├── (dashboard)/         # Grupo protegido con middleware
│   ├── admin/           # Dashboard admin
│   ├── host/            # Dashboard host
│   └── cliente/         # Dashboard cliente
├── (boletera)/          # Módulo de eventos y tickets
│   ├── eventos/         # Catálogo público (SSR)
│   ├── checkout/        # Proceso de compra
│   └── admin/           # Gestión de eventos
├── (reservas)/          # Módulo de reservas
│   ├── sucursales/      # Lista de restaurantes (SSR)
│   ├── reservar/        # Formulario de reserva
│   └── admin/           # Gestión de reservas
└── api/                 # API Routes
    ├── auth/            # Endpoints de autenticación
    ├── eventos/         # CRUD de eventos
    └── reservas/        # CRUD de reservas

components/
├── ui/                  # shadcn/ui components
├── forms/               # Form components con React Hook Form
├── layout/              # Layout components (Header, Sidebar)
└── features/            # Feature-specific components
    ├── eventos/         # Components específicos de eventos
    └── reservas/        # Components específicos de reservas

lib/
├── firebase/
│   ├── config.ts        # Firebase initialization
│   ├── auth.ts          # Auth helpers
│   └── firestore.ts     # Firestore helpers
├── cloudinary/
│   └── upload.ts        # Cloudinary upload helpers
├── services/            # Business logic services
│   ├── eventos.service.ts
│   ├── reservas.service.ts
│   └── usuarios.service.ts
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useEventos.ts
│   └── useReservas.ts
└── stores/              # Zustand stores
    ├── authStore.ts
    ├── cartStore.ts
    └── reservasStore.ts

types/
├── eventos.types.ts
├── reservas.types.ts
└── usuarios.types.ts

utils/
├── validators.ts        # Zod schemas
├── formatters.ts        # Date, currency formatters
└── constants.ts         # App constants
```

---

## ✅ FASE 1: SETUP DEL PROYECTO (COMPLETADA)

**Estado**: ✅ 100% (11/11)

### Configuración Inicial
- ✅ Inicializar proyecto Next.js 16
- ✅ Configurar TypeScript (strict mode)
- ✅ Configurar Tailwind CSS v4
- ✅ Instalar y configurar shadcn/ui
- ✅ Configurar ESLint + Prettier
- ✅ Configurar Git (.gitignore)
- ✅ Crear estructura de carpetas

### Dependencias Instaladas
- ✅ UI: lucide-react, clsx, tailwind-merge, class-variance-authority
- ✅ Estado: zustand, immer
- ✅ Backend: firebase
- ✅ Utilidades: zod, react-hook-form, @hookform/resolvers, date-fns

---

## ✅ FASE 2: ARQUITECTURA FIREBASE (COMPLETADA)

**Estado**: ✅ 100% (8/8)
**Prioridad**: 🔴 CRÍTICA

### 2.1: Configuración de Firebase y Cloudinary
- ✅ Crear proyecto en Firebase Console
- ✅ Habilitar Authentication (Email/Password + Google)
- ✅ Crear base de datos Firestore
- ✅ Configurar cuenta Cloudinary y variables de entorno
- ✅ Configurar variables de entorno (.env.local)
- ✅ Crear `lib/firebase/config.ts` con inicialización
- ✅ Crear `lib/firebase/auth.ts` con helpers de autenticación
- ✅ Crear `lib/firebase/firestore.ts` con helpers CRUD
- ✅ Crear `lib/cloudinary/config.ts` y `lib/cloudinary/upload.ts`
- ✅ Crear componente `ImageUpload` y hook `useImageUpload`
- ✅ Crear API route `/api/upload` para Cloudinary
- ✅ Configurar reglas de seguridad de Firestore (`firestore.rules`)

### 2.2: Definir Modelo de Datos (TypeScript)

**Archivo**: ✅ `types/index.ts`

#### Tipos Base
- ✅ User (uid, email, nombre, rol, telefono, createdAt)
- ✅ Rol (admin, host, cliente)

#### Módulo Eventos
- ✅ Evento (id, titulo, descripcion, fecha, venue, categorias, etc)
- ✅ TipoTicket (nombre, precio, cantidad, disponibles)
- ✅ Orden (id, userId, evento, tickets, total, status)
- ✅ Ticket (id, ordenId, eventoId, qrCode, usado, fechaUso)
- ✅ Venue (id, nombre, direccion, capacidad, ubicacion)
- ✅ CodigoDescuento (id, codigo, tipo, valor, etc)

#### Módulo Reservas
- ✅ Sucursal (id, nombre, direccion, horarios, capacidad)
- ✅ Reserva (id, userId, sucursal, fecha, hora, personas, mesa, status)
- ✅ Mesa (id, sucursal, numero, capacidad, area, posicion)
- ✅ Plano (id, sucursal, nombre, mesas, configuracion)
- ✅ ListaEspera (id, sucursal, nombre, personas, telefono, timestamp)

### 2.3: Crear Servicios Base
- ✅ `lib/services/eventos.service.ts` (CRUD eventos completo)
- ✅ `lib/services/reservas.service.ts` (CRUD reservas completo)
- ✅ `lib/services/usuarios.service.ts` (gestión usuarios completo)

### 2.4: Configuración Firebase Console (Pendiente - Manual)
📝 Ver instrucciones en: `FIREBASE_SETUP.md`

- ✅ Desplegar reglas de Firestore desde Console
- ✅ Crear índices compuestos
- ✅ Crear colecciones iniciales en Firestore
- ✅ Crear usuarios de prueba (admin, host, cliente)

---

## 🔐 FASE 3: AUTENTICACIÓN

**Estado**: ✅ 100% (6/6)
**Objetivo**: Sistema completo de autenticación con Firebase
**Prioridad**: 🔴 CRÍTICA

### 3.1: Configurar Firebase Auth
- ✅ Crear `lib/firebase/auth.ts` con helpers (extendido con Google/GitHub OAuth)
- ✅ Crear `lib/hooks/useAuth.ts` hook personalizado
- ✅ Crear `lib/stores/authStore.ts` (Zustand con persistencia)
- ✅ Implementar middleware de autenticación (`middleware.ts`)

### 3.2: Páginas de Autenticación

#### Login (`app/(auth)/login/page.tsx`)
- ✅ Server Component con metadata
- ✅ Client Component para formulario (`LoginForm.tsx`)
- ✅ React Hook Form + Zod validation (`lib/validations/auth.ts`)
- ✅ Login con email/password
- ✅ Login con Google (Firebase Auth)
- ✅ Manejo de errores con Sonner (toast notifications)
- ✅ Redirección basada en rol (router.push en useAuth)

#### Registro (`app/(auth)/register/page.tsx`)
- ✅ Formulario de registro completo (`RegisterForm.tsx`)
- ✅ Validación de campos (Zod schema con reglas de password)
- ✅ Crear usuario en Firebase Auth (registerWithEmail)
- ✅ Crear documento en Firestore `/usuarios`
- ✅ Login automático después de registro
- ⚠️ Email de verificación (opcional - no implementado)

### 3.3: Protección de Rutas
- ✅ Crear `middleware.ts` para proteger rutas
- ✅ HOC `ProtectedRoute` para componentes protegidos
- ✅ Redirección a login si no autenticado
- ✅ Validación de roles con prop `requiredRole`

### 3.4: Componentes de Auth
- ✅ `app/(auth)/login/LoginForm.tsx` (Client Component con React Hook Form)
- ✅ `app/(auth)/register/RegisterForm.tsx` (Formulario completo)
- ✅ `components/auth/SocialAuthButtons.tsx` (Google + GitHub OAuth)
- ✅ Logout button (implementado en dashboard + función en useAuth)
- ✅ `components/auth/InputWithIcon.tsx` (Input reutilizable con validación)
- ✅ `components/auth/PasswordInput.tsx` (Input con toggle show/hide)
- ✅ `components/auth/AuthLayout.tsx` (Layout con branding)

### 3.5: Recuperación de Contraseña
- ✅ `app/(auth)/forgot-password/page.tsx` (Server Component + Client Form)
- ✅ `app/(auth)/forgot-password/ForgotPasswordForm.tsx` (Formulario completo)
- ✅ Envío de email con Firebase (sendPasswordResetEmail)
- ✅ `app/(auth)/reset-password/page.tsx` (Server Component)
- ✅ `app/(auth)/reset-password/ResetPasswordForm.tsx` (Formulario con verificación de código)
- ✅ Funciones en `lib/firebase/auth.ts` (verifyResetCode, confirmNewPassword)
- ✅ Validación con Zod (`resetPasswordSchema`)
- ✅ Estados de éxito y error con feedback visual
- ⚠️ Email de verificación de cuenta (opcional - no implementado)

### 3.6: Testing de Auth
- ✅ Crear usuarios de prueba en Firebase (documentado en TODO.md)
- ✅ Probar login/logout (funcional, servidor corriendo)
- ✅ Probar registro (funcional con validaciones)
- ✅ Probar protección de rutas (middleware + ProtectedRoute)
- ⚠️ Probar Google Sign-In (implementado, requiere OAuth setup en Firebase Console)

### 📋 Componentes Reutilizables Creados
- ✅ `InputWithIcon` - Input con icono y validación
- ✅ `PasswordInput` - Password con toggle visibility
- ✅ `SocialAuthButtons` - Botones OAuth reutilizables
- ✅ `AuthLayout` - Layout consistente para páginas de auth
- ✅ `ProtectedRoute` - HOC para protección de rutas

### 🛠️ Servicios y Hooks Implementados
- ✅ `useAuth` hook con todas las funciones de autenticación
- ✅ `authStore` con Zustand + persistencia a localStorage
- ✅ Validaciones Zod completas en `lib/validations/auth.ts`
- ✅ Firebase Auth helpers extendidos con OAuth
- ✅ Middleware para protección de rutas del lado del servidor

### 📦 Dependencias Instaladas
- ✅ sonner (toast notifications)
- ✅ @radix-ui/react-icons (para componentes shadcn)
- ✅ shadcn/ui Button y Checkbox components

---

## 👥 FASE 4: SISTEMA DE ROLES (COMPLETADA)

**Estado**: ✅ 100% (5/5)
**Objetivo**: Implementar roles y permisos
**Prioridad**: 🔴 CRÍTICA

### 4.1: Definir Roles y Permisos
- ✅ Crear `types/roles.types.ts`
- ✅ Definir enum de Roles (admin, host, cliente)
- ✅ Definir permisos por rol (36 permisos granulares)
- ✅ Crear matriz de permisos

### 4.2: Implementar Sistema de Roles
- ✅ Crear `lib/utils/permissions.ts`
- ✅ Helper `hasPermission(user, permission)`
- ✅ Helper `isRole(user, role)`
- ✅ Hook `usePermissions()`

### 4.3: Protección por Rol
- ✅ Componente `<RequireRole role="admin">`
- ✅ HOC `withRole(Component, role)`
- ✅ Server-side validation en API routes

### 4.4: Dashboards por Rol
- ✅ Redirección automática según rol después de login
- ✅ Layout específico por rol

### 4.5: Testing de Roles
- ✅ Crear usuarios de cada rol en Firebase
- ✅ Probar acceso a rutas protegidas
- ✅ Verificar permisos funcionan

---

## 🎨 FASE 5: COMPONENTES UI BASE (COMPLETADA)

**Estado**: ✅ 100% (25/25)
**Objetivo**: Crear componentes reutilizables con shadcn/ui
**Prioridad**: 🟡 ALTA

### 5.1: Instalar Componentes shadcn/ui (COMPLETADA)
**Estado**: ✅ 100% (13/13)

- ✅ Button, Input, Label
- ✅ Card, Badge
- ✅ Dialog (Modal), Sheet (Sidebar)
- ✅ Dropdown Menu, Select
- ✅ Table, Tabs
- ✅ Toast (Sonner)
- ✅ Calendar, Popover
- ✅ Form components

### 5.2: Layout Components (COMPLETADA)
**Estado**: ✅ 100% (5/5)

#### Header/Navbar
- ✅ `components/layout/Header.tsx` (público)
- ✅ `components/layout/DashboardHeader.tsx` (protegido)
- ✅ Responsive con menú mobile (Sheet)
- ✅ User dropdown con avatar y role badge
- ✅ Logout funcional

#### Sidebar
- ✅ `components/layout/Sidebar.tsx`
- ✅ Navegación por rol (admin: 8 opciones, host: 6, cliente: 6)
- ✅ Colapsable en mobile (Sheet)
- ✅ Active link highlighting

#### Footer
- ✅ `components/layout/Footer.tsx`
- ✅ Links a módulos (Navegación, Legal, Soporte)
- ✅ Información de contacto completa
- ✅ Social media links

#### Dashboard Layout
- ✅ `components/layout/DashboardLayout.tsx`
- ✅ Wrapper con Sidebar + Header + Content

### 5.3: Feature Components (COMPLETADA)
**Estado**: ✅ 100% (8/8)

#### Eventos
- ✅ `components/features/eventos/EventCard.tsx`
  - Card con imagen, categoría, fecha, ubicación, precio
  - Responsive con hover effects
  - Link a detalle de evento

- ✅ `components/features/eventos/EventFilters.tsx`
  - Search input con debounce
  - Category select (Todos, Música, Deportes, etc)
  - Sort select (Fecha, Precio, Popularidad)
  - Botón de filtros avanzados

- ✅ `components/features/eventos/TicketSelector.tsx`
  - Selector interactivo de tickets
  - Control de cantidades con límites
  - Cálculo automático de subtotales
  - Resumen total con precio agregado

- ✅ `components/features/eventos/CartItem.tsx`
  - Item de carrito con imagen del evento
  - Controles de cantidad (+/-)
  - Cálculo de subtotal
  - Botón de eliminación
  - Responsive design

#### Reservas
- ✅ `components/features/reservas/SucursalCard.tsx`
  - Card de sucursal con imagen
  - Info de contacto (dirección, teléfono)
  - Horarios de operación
  - Badge de estado (abierto/cerrado)
  - Link a reservar

- ✅ `components/features/reservas/ReservaForm.tsx`
  - Formulario completo de reserva
  - Selector de fecha y hora
  - Contador de personas
  - Datos de contacto
  - Tags de ocasión especial
  - Checkbox de cumpleaños
  - Comentarios adicionales

- ✅ `components/features/reservas/MesaPlano.tsx`
  - Plano visual de mesas
  - Agrupación por área (interior, exterior, terraza, VIP)
  - Estados de mesa (disponible, reservada, ocupada)
  - Selección interactiva
  - Información de capacidad
  - Leyenda visual

- ✅ `components/features/reservas/TimeSlotPicker.tsx`
  - Selector de horarios disponibles
  - Agrupación por periodo (almuerzo, tarde, cena)
  - Indicador de mesas disponibles
  - Selección visual con estados
  - Resumen de horario seleccionado

### 5.4: Shared Components (COMPLETADA)
**Estado**: ✅ 100% (5/5)

- ✅ `components/shared/LoadingSpinner.tsx`
  - Spinner reutilizable
  - Variantes de tamaño (sm, md, lg, xl)
  - Texto opcional
  - Modo fullScreen

- ✅ `components/shared/EmptyState.tsx`
  - Estados vacíos personalizables
  - Icono customizable
  - Título y descripción
  - Botón de acción opcional

- ✅ `components/shared/ErrorBoundary.tsx`
  - Error Boundary para React
  - UI de error personalizado
  - Botón de retry
  - Muestra detalles en desarrollo
  - Callback de error opcional

- ✅ `components/shared/ConfirmDialog.tsx`
  - Diálogo de confirmación
  - Variantes (default, danger, warning, info)
  - Loading state
  - Customizable (títulos, botones)

- ✅ `components/shared/QRCodeDisplay.tsx`
  - Display de códigos QR
  - Generación con qrcode.react
  - Descarga como PNG
  - Copiar código al portapapeles
  - Estados (activo, usado, expirado)
  - Logo opcional integrado

### 5.5: Landing Page (COMPLETADA)
**Estado**: ✅ 100% (4/4)

- ✅ `app/page.tsx` (Landing principal)
  - Hero section con branding Big Texas BBQ
  - Stats (500+ eventos, 10K+ clientes, 24/7)
  - CTAs principales (Ver Eventos, Reservar Mesa)

- ✅ Hero section
  - Gradiente de marca
  - Logo y branding
  - Estadísticas destacadas
  - Llamados a la acción

- ✅ Features section
  - 6 características principales
  - Iconos lucide-react
  - Cards responsive
  - Descripción de cada feature

- ✅ CTA sections
  - Sección para usuarios (registro/login)
  - Sección para negocios (contacto ventas)
  - Cards de beneficios

- ✅ SEO metadata
  - Title optimizado
  - Description completo
  - Keywords relevantes
  - Footer integrado

---

## 🎫 FASE 6: MÓDULO EVENTOS - CLIENTE

**Objetivo**: Flujo completo de compra de tickets
**Prioridad**: 🟡 ALTA

### 6.1: Catálogo de Eventos
- ✅ `app/(boletera)/eventos/page.tsx` (SSR con Firestore)
- ✅ Componente EventosGrid
- ✅ SearchBar con debounce
- ✅ Filtros (categoría, fecha, precio)
- ✅ Paginación con Firestore cursor
- ✅ Skeleton loaders

### 6.2: Detalle de Evento
- ✅ `app/(boletera)/eventos/[id]/page.tsx` (SSR)
- ✅ Dynamic metadata para SEO
- ✅ Hero image con next/image
- ✅ Tabs de información (Descripción, Artistas, Ubicación)
- ✅ TicketSelector component
- ✅ Agregar al carrito (Zustand store)
- ✅ Share button

### 6.3: Carrito de Compras
- ✅ Crear `lib/stores/cartStore.ts` (Zustand + persist)
- ✅ `app/(boletera)/carrito/page.tsx`
- ✅ Lista de items con edición
- ✅ Aplicar código de descuento
- ✅ Calcular totales
- ✅ Botón a checkout

### 6.4: Checkout
- ✅ `app/(boletera)/checkout/page.tsx`
- ✅ Multi-step form (Datos, Pago, Confirmación)
- ✅ React Hook Form + Zod
- ✅ Integración con MercadoPago (simulado)
- ✅ Crear orden en Firestore
- ✅ Generar tickets con QR
- ✅ Enviar email de confirmación (Cloud Function)

### 6.5: Confirmación
- ✅ `app/(boletera)/confirmacion/[ordenId]/page.tsx`
- ✅ Mostrar detalles de orden
- ✅ QR codes de tickets
- ✅ Descargar PDF (opcional)
- ✅ Agregar a calendario

### 6.6: Mis Tickets
- ✅ `app/(dashboard)/cliente/tickets/page.tsx`
- ✅ Tabs: Próximos | Pasados
- ✅ Query Firestore por userId
- ✅ Ver detalle de ticket con QR
- ✅ Transferir ticket (opcional)

### 6.7: Services & Hooks
- ✅ `lib/services/ordenes.service.ts`
- ✅ `lib/hooks/useEventos.ts`
- ✅ `lib/hooks/useCart.ts`
- ✅ `lib/hooks/useOrden.ts`

### 6.8: Testing del Flujo
- ✅ Buscar y filtrar eventos
- ✅ Agregar tickets al carrito
- ✅ Editar carrito
- ✅ Proceso de checkout
- ✅ Generar orden
- ✅ Ver tickets en dashboard
- ✅ Crear página de testing interactiva (`/test-flujo`)
- ✅ Crear guía de testing completa (`docs/TESTING_FLUJO_COMPLETO.md`)
- ✅ Crear script de validación automática (`scripts/test-flujo-completo.ts`)

---

## 👨‍💼 FASE 7: MÓDULO EVENTOS - ADMIN

**Objetivo**: Panel administrativo completo
**Prioridad**: 🟡 ALTA

### 7.1: Dashboard Admin (COMPLETADA ✅)
**Estado**: ✅ 100% (5/5)

- ✅ `app/(dashboard)/admin/page.tsx` - Página principal del dashboard
- ✅ `components/dashboard/KPICard.tsx` - Cards de métricas principales
- ✅ `components/dashboard/EventsChart.tsx` - Gráfica de eventos con Recharts
- ✅ `components/dashboard/RecentOrders.tsx` - Tabla de últimas órdenes
- ✅ `components/dashboard/QuickActions.tsx` - Links de acceso rápido

**Funcionalidades Implementadas**:
- KPI Cards con tendencias (ventas, eventos activos, tickets vendidos, órdenes)
- Gráficas interactivas con Recharts (Eventos y Tickets por mes)
- Tabla de últimas 5 órdenes con estados y detalles
- Grid de 6 acciones rápidas con iconos
- Integración completa con Firebase Firestore
- Estados de carga (skeletons)
- Cálculo automático de tendencias mes a mes
- Diseño responsive con Tailwind CSS

### 7.2: Gestión de Eventos

#### Lista de Eventos
- ✅ `app/(dashboard)/admin/eventos/page.tsx`
- ✅ Tabla con DataTable de shadcn/ui
- ✅ Filtros y búsqueda
- ✅ Acciones (Editar, Pausar, Eliminar)
- ✅ Botón "+ Crear Evento"

#### Crear/Editar Evento
- ✅ `app/(dashboard)/admin/eventos/nuevo/page.tsx`
- ✅ `app/(dashboard)/admin/eventos/[id]/editar/page.tsx`
- ✅ Form multi-sección con React Hook Form
- ✅ Upload de imagen a Cloudinary
- ✅ Crear tipos de tickets dinámicamente
- ✅ Validación con Zod
- ✅ Guardar en Firestore

### 7.3: Gestión de Venues
- ✅ `app/(dashboard)/admin/venues/page.tsx`
- ✅ CRUD completo de venues
- ✅ Modal con formulario
- ✅ Validación de capacidad

### 7.4: Códigos de Descuento
- [ ] `app/(dashboard)/admin/descuentos/page.tsx`
- [ ] Tabla de códigos activos
- [ ] Modal crear/editar código
- [ ] Validar código en checkout

### 7.5: Gestión de Órdenes
- [ ] `app/(dashboard)/admin/ordenes/page.tsx`
- [ ] Tabla con todas las órdenes
- [ ] Filtros por estado, fecha, evento
- [ ] Ver detalle de orden
- [ ] Reembolsar orden (cambiar status)

### 7.6: Reportes de Ventas
- [ ] `app/(dashboard)/admin/reportes/ventas/page.tsx`
- [ ] Filtros de fecha y evento
- [ ] Gráficas de ventas con Recharts
- [ ] Tabla de datos
- [ ] Exportar a CSV (opcional)

### 7.7: Reportes por Evento
- [ ] `app/(dashboard)/admin/reportes/eventos/[id]/page.tsx`
- [ ] Estadísticas del evento
- [ ] Tickets vendidos por tipo
- [ ] Ingresos generados
- [ ] Gráfica de ventas en el tiempo

### 7.8: Services
- [ ] `lib/services/admin-eventos.service.ts`
- [ ] `lib/services/descuentos.service.ts`
- [ ] `lib/services/reportes.service.ts`

### 7.9: Testing
- [ ] Crear evento completo
- [ ] Editar evento existente
- [ ] Pausar/activar evento
- [ ] Crear código de descuento
- [ ] Ver reportes

---

## 📱 FASE 8: MÓDULO EVENTOS - HOST

**Objetivo**: Herramientas operativas para hosts
**Prioridad**: 🟢 MEDIA

### 8.1: Dashboard Host
- [ ] `app/(dashboard)/host/page.tsx`
- [ ] Lista de eventos activos hoy
- [ ] Acceso rápido a scanner
- [ ] Estadísticas del día

### 8.2: Scanner de QR
- [ ] `app/(dashboard)/host/scanner/page.tsx`
- [ ] Integrar librería de scanner (react-qr-scanner)
- [ ] Selector de evento
- [ ] Validar ticket en Firestore
- [ ] Marcar como usado (actualizar timestamp)
- [ ] Mostrar resultado (válido/inválido/usado)
- [ ] Búsqueda manual de tickets

### 8.3: Control de Aforo
- [ ] `app/(dashboard)/host/aforo/page.tsx`
- [ ] Selector de evento
- [ ] Indicador visual de aforo
- [ ] Desglose por tipo de ticket
- [ ] Estadísticas en tiempo real

### 8.4: Búsqueda de Tickets
- [ ] `app/(dashboard)/host/buscar/page.tsx`
- [ ] Search bar (nombre, email, código)
- [ ] Resultados de búsqueda
- [ ] Ver detalle de ticket

### 8.5: Caja de Venta Física
- [ ] `app/(dashboard)/host/caja/page.tsx`
- [ ] Selector de evento
- [ ] Selector de tipo de ticket y cantidad
- [ ] Calcular total
- [ ] Registrar venta en Firestore
- [ ] Generar tickets

### 8.6: Services & Hooks
- [ ] `lib/services/host.service.ts`
- [ ] `lib/hooks/useScanner.ts`

### 8.7: Testing
- [ ] Scanner valida QR correctamente
- [ ] Marcar ticket como usado
- [ ] Buscar tickets por nombre
- [ ] Registrar venta física
- [ ] Ver aforo actualizado

---

SEGUNDA FASE

---

## 🍽️ FASE 9: MÓDULO RESERVAS - CLIENTE

**Objetivo**: Sistema completo de reservas
**Prioridad**: 🟡 ALTA

### 9.1: Lista de Sucursales
- [ ] `app/(reservas)/sucursales/page.tsx` (SSR)
- [ ] Grid de sucursales con datos de Firestore
- [ ] SucursalCard component
- [ ] Badge de estado (Abierto/Cerrado)
- [ ] Filtros por ubicación
- [ ] Mapa con Google Maps (opcional)

### 9.2: Formulario de Reserva
- [ ] `app/(reservas)/reservar/[sucursalId]/page.tsx`
- [ ] DatePicker para seleccionar fecha
- [ ] TimeSlotPicker con horarios disponibles
- [ ] Query Firestore para verificar disponibilidad
- [ ] Selector de número de personas
- [ ] Form con React Hook Form + Zod
- [ ] Checkbox de cumpleaños
- [ ] Tags de ocasión y preferencias
- [ ] Validación completa

### 9.3: Confirmación de Reserva
- [ ] `app/(reservas)/confirmacion/[reservaId]/page.tsx`
- [ ] Mostrar código de reserva
- [ ] QR code generado
- [ ] Detalles completos
- [ ] Agregar a calendario
- [ ] Enviar email de confirmación

### 9.4: Mis Reservas
- [ ] `app/(dashboard)/cliente/reservas/page.tsx`
- [ ] Tabs: Próximas | Pasadas | Canceladas
- [ ] Query Firestore por userId
- [ ] ReservaCard component
- [ ] Acciones: Ver QR, Modificar, Cancelar

### 9.5: Detalle de Reserva
- [ ] `app/(dashboard)/cliente/reservas/[id]/page.tsx`
- [ ] Información completa
- [ ] QR code grande
- [ ] Timeline de estados
- [ ] Botones de acción

### 9.6: Modificar Reserva
- [ ] `app/(dashboard)/cliente/reservas/[id]/modificar/page.tsx`
- [ ] Mostrar datos actuales
- [ ] Formulario de edición
- [ ] Verificar disponibilidad
- [ ] Actualizar en Firestore

### 9.7: Services & Hooks
- [ ] `lib/services/reservas.service.ts`
- [ ] `lib/services/disponibilidad.service.ts`
- [ ] `lib/hooks/useReservas.ts`
- [ ] `lib/hooks/useDisponibilidad.ts`

### 9.8: Store de Reservas
- [ ] `lib/stores/reservasStore.ts` (Zustand)
- [ ] Guardar datos temporales del formulario

### 9.9: Testing
- [ ] Seleccionar sucursal
- [ ] Ver horarios disponibles
- [ ] Crear reserva
- [ ] Ver en "Mis Reservas"
- [ ] Modificar reserva
- [ ] Cancelar reserva

---

## 🗺️ FASE 10: MÓDULO RESERVAS - ADMIN

**Objetivo**: Gestión completa de reservas y planos
**Prioridad**: 🟡 ALTA

### 10.1: Dashboard Reservas
- [ ] `app/(dashboard)/admin/reservas/page.tsx`
- [ ] KPIs (reservas hoy, ocupación, cancelaciones)
- [ ] Gráficas con Recharts
- [ ] Tabla de reservas recientes

### 10.2: Lista de Reservas
- [ ] `app/(dashboard)/admin/reservas/lista/page.tsx`
- [ ] DataTable con todas las reservas
- [ ] Filtros (fecha, sucursal, estado)
- [ ] Acciones (Ver, Confirmar, Cancelar)
- [ ] Búsqueda por cliente

### 10.3: Gestión de Sucursales
- [ ] `app/(dashboard)/admin/sucursales/page.tsx`
- [ ] CRUD de sucursales
- [ ] Configurar horarios de operación
- [ ] Configurar capacidad
- [ ] Upload de imágenes a Cloudinary

### 10.4: Editor de Planos ⭐
- [ ] `app/(dashboard)/admin/planos/[sucursalId]/editor/page.tsx`
- [ ] Canvas con react-konva o similar
- [ ] Drag & drop de mesas
- [ ] Diferentes formas de mesas (cuadrada, redonda)
- [ ] Resize de mesas
- [ ] Panel de propiedades
- [ ] Zoom y pan
- [ ] Guardar configuración en Firestore

### 10.5: Gestión de Mesas
- [ ] `app/(dashboard)/admin/mesas/page.tsx`
- [ ] Tabla de mesas por sucursal
- [ ] Editar capacidad y área
- [ ] Bloquear/desbloquear mesas
- [ ] Asignar número de mesa

### 10.6: Configuración de Horarios
- [ ] `app/(dashboard)/admin/horarios/page.tsx`
- [ ] Configurar horarios por día
- [ ] Intervalos de reserva
- [ ] Tiempo de anticipación
- [ ] Restricciones especiales

### 10.7: Bloqueos de Fechas
- [ ] `app/(dashboard)/admin/bloqueos/page.tsx`
- [ ] Calendario con react-big-calendar
- [ ] Crear bloqueos (eventos privados, mantenimiento)
- [ ] Lista de bloqueos activos
- [ ] Eliminar bloqueos

### 10.8: Base de Datos de Clientes
- [ ] `app/(dashboard)/admin/clientes/page.tsx`
- [ ] Tabla con todos los clientes
- [ ] Filtros (frecuentes, cumpleaños)
- [ ] Ver historial de reservas
- [ ] Agregar notas

### 10.9: Reportes de Reservas
- [ ] `app/(dashboard)/admin/reportes/reservas/page.tsx`
- [ ] Filtros de fecha y sucursal
- [ ] Gráficas de ocupación
- [ ] Tabla de datos
- [ ] Exportar a CSV

### 10.10: Reportes de Clientes
- [ ] `app/(dashboard)/admin/reportes/clientes/page.tsx`
- [ ] Segmentación de clientes
- [ ] Análisis de comportamiento
- [ ] Clientes frecuentes vs nuevos

### 10.11: Services
- [ ] `lib/services/planos.service.ts`
- [ ] `lib/services/mesas.service.ts`
- [ ] `lib/services/horarios.service.ts`
- [ ] `lib/services/clientes.service.ts`

### 10.12: Testing
- [ ] Crear sucursal
- [ ] Diseñar plano con mesas
- [ ] Configurar horarios
- [ ] Bloquear fechas
- [ ] Ver reportes

---

## 👔 FASE 11: MÓDULO RESERVAS - HOST

**Objetivo**: Herramientas para recepción
**Prioridad**: 🟢 MEDIA

### 11.1: Dashboard Host Reservas
- [ ] `app/(dashboard)/host/reservas/page.tsx`
- [ ] Resumen del día
- [ ] Reservas próximas
- [ ] Lista de espera
- [ ] Acceso rápido a plano

### 11.2: Recepción y Check-in
- [ ] `app/(dashboard)/host/recepcion/page.tsx`
- [ ] Timeline de reservas del día
- [ ] Scanner QR de reservas
- [ ] Confirmar llegada
- [ ] Marcar no-show
- [ ] Asignar mesa

### 11.3: Plano en Tiempo Real ⭐
- [ ] `app/(dashboard)/host/plano/page.tsx`
- [ ] Renderizar plano desde Firestore
- [ ] Colores por estado (disponible, reservada, ocupada)
- [ ] Click en mesa abre modal
- [ ] Asignar/liberar mesa
- [ ] Actualización en tiempo real (Firestore listeners)

### 11.4: Lista de Espera
- [ ] `app/(dashboard)/host/lista-espera/page.tsx`
- [ ] Agregar entrada a lista
- [ ] Ver tiempo de espera estimado
- [ ] Asignar mesa cuando esté disponible
- [ ] Notificar cliente (SMS opcional)

### 11.5: Agenda del Día
- [ ] `app/(dashboard)/host/agenda/page.tsx`
- [ ] Calendario diario con react-big-calendar
- [ ] Ver todas las reservas
- [ ] Filtrar por área
- [ ] Crear reserva manual (walk-in)

### 11.6: Registro de Walk-ins
- [ ] `app/(dashboard)/host/walk-in/page.tsx`
- [ ] Formulario simplificado
- [ ] Verificar disponibilidad
- [ ] Asignar mesa automáticamente
- [ ] Crear reserva en Firestore

### 11.7: Services & Hooks
- [ ] `lib/services/recepcion.service.ts`
- [ ] `lib/hooks/usePlanoTiempoReal.ts`
- [ ] `lib/hooks/useListaEspera.ts`

### 11.8: Testing
- [ ] Check-in de reserva
- [ ] Asignar mesa desde plano
- [ ] Agregar a lista de espera
- [ ] Registrar walk-in
- [ ] Ver plano actualizado en tiempo real

---

## 🚀 MEJORAS FUTURAS (Post-MVP)

### Pagos
- [ ] Integración real con Stripe/MercadoPago
- [ ] Pagos con tarjeta
- [ ] Pagos con QR (MercadoPago)
- [ ] Sistema de reembolsos

### Notificaciones
- [ ] Firebase Cloud Messaging (push)
- [ ] Email templates con Resend/SendGrid
- [ ] SMS con Twilio
- [ ] WhatsApp Business API

### Features Avanzadas
- [ ] Transferencia de tickets entre usuarios
- [ ] Sistema de revendedores
- [ ] Programa de lealtad
- [ ] Reviews y calificaciones
- [ ] Chat de soporte en vivo
- [ ] Multi-idioma (i18n)
- [ ] Multi-moneda
- [ ] PWA (Progressive Web App)
- [ ] Modo oscuro

### Analytics
- [ ] Google Analytics 4
- [ ] Mixpanel o Amplitude
- [ ] Dashboards avanzados
- [ ] A/B testing

### Admin Avanzado
- [ ] Roles y permisos granulares
- [ ] Auditoría de acciones
- [ ] Backups automáticos
- [ ] Webhooks para integraciones
- [ ] API pública documentada

---

## 📝 CONVENCIONES DEL PROYECTO

### Nomenclatura
- **Componentes**: PascalCase (`EventCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useEventos.ts`)
- **Services**: camelCase con sufijo `.service` (`eventos.service.ts`)
- **Stores**: camelCase con sufijo `Store` (`authStore.ts`)
- **Types**: PascalCase (`Usuario`, `Evento`)
- **Carpetas**: kebab-case o camelCase

### Estructura de Componentes
```typescript
// Server Component por defecto
export default function EventosPage() {
  // Data fetching con Firestore
  // Return JSX
}

// Client Component cuando sea necesario
'use client'
export default function EventForm() {
  // Hooks, eventos, estado
  // Return JSX
}
```

### Manejo de Estado
- **Global**: Zustand para auth, carrito, UI
- **Server**: React Query para cache de Firestore
- **Formularios**: React Hook Form + Zod
- **URL**: useSearchParams para filtros

### Validación
- Zod schemas en `utils/validators.ts`
- Validación client-side con React Hook Form
- Validación server-side en API routes
- Firestore rules para seguridad

### Estilos
- Tailwind CSS utility-first
- shadcn/ui components
- Variables CSS en `globals.css`
- Mobile-first responsive

---

## 🧪 TESTING CHECKLIST

### Testing por Fase
- [ ] Auth: Login, Registro, Logout
- [ ] Roles: Verificar permisos por rol
- [ ] Eventos Cliente: Flujo completo de compra
- [ ] Eventos Admin: CRUD de eventos
- [ ] Eventos Host: Scanner y validación
- [ ] Reservas Cliente: Crear y modificar reserva
- [ ] Reservas Admin: Editor de planos
- [ ] Reservas Host: Check-in y plano tiempo real

### Testing General
- [ ] Responsive en mobile, tablet, desktop
- [ ] Todas las rutas protegidas funcionan
- [ ] Manejo de errores con Sonner
- [ ] Loading states en todas las páginas
- [ ] Optimización de imágenes con next/image
- [ ] SEO metadata en todas las páginas
- [ ] No hay errores en consola
- [ ] Performance (Lighthouse score >90)

---

## 👥 USUARIOS DE PRUEBA (Firebase)

```
Admin:
  Email: admin@sistema.com
  Password: Admin123!

Host:
  Email: host@sistema.com
  Password: Host123!

Cliente:
  Email: cliente@test.com
  Password: Cliente123!
```

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. [x] ~~**Configurar Firebase**~~ (Console + código) ✅
2. [x] ~~**Definir modelo de datos**~~ completo en TypeScript ✅
3. [x] ~~**Implementar autenticación**~~ (Login/Registro) ✅
4. [x] ~~**Crear sistema de roles**~~ y protección ✅
5. [x] ~~**Instalar componentes shadcn/ui**~~ necesarios ✅
6. [ ] **Completar FASE 5.3**: Feature Components
   - [ ] TicketSelector.tsx
   - [ ] CartItem.tsx
   - [ ] SucursalCard.tsx
   - [ ] ReservaForm.tsx
   - [ ] MesaPlano.tsx
   - [ ] TimeSlotPicker.tsx
7. [ ] **Completar FASE 5.4**: Shared Components
8. [ ] **Completar FASE 5.5**: Landing Page
9. [ ] **Comenzar FASE 6**: Módulo de eventos (cliente)

---

**Mantenido por**: Claude + Pedro Duran
**Versión**: 3.0.0 (Next.js 16 + Firebase + shadcn/ui)
**Última actualización**: 23 de Diciembre, 2025
