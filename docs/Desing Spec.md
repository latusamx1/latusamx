# Sistema Integrado de Gestión de Eventos y Reservas
## Especificaciones de Diseño para Prototipo HTML

---

## 📋 Descripción del Proyecto

Sistema web modular que integra dos funcionalidades principales:
1. **Módulo de Boletera**: Venta y gestión de tickets para eventos
2. **Módulo de Reservas**: Sistema de reservas para restaurantes y establecimientos

El diseño debe ser **moderno, limpio, profesional y responsive** (mobile-first).

---

## 🎨 Stack de Diseño

- **HTML5 semántico**
- **Tailwind CSS** (via CDN)
- **Componentes shadcn/ui** (adaptados a HTML puro)
- **Lucide Icons** (via CDN)
- **Google Fonts**: Inter o similar
- **JavaScript Vanilla** para interactividad básica

---

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
/* Colores Principales */
--primary: #3B82F6 (blue-500)
--primary-dark: #2563EB (blue-600)
--primary-light: #60A5FA (blue-400)

/* Colores Secundarios */
--secondary: #8B5CF6 (purple-500)
--accent: #10B981 (green-500)

/* Neutrales */
--background: #FFFFFF
--surface: #F9FAFB (gray-50)
--border: #E5E7EB (gray-200)
--text-primary: #111827 (gray-900)
--text-secondary: #6B7280 (gray-500)

/* Estados */
--success: #10B981 (green-500)
--warning: #F59E0B (amber-500)
--error: #EF4444 (red-500)
--info: #3B82F6 (blue-500)
```

### Tipografía

```css
/* Familia */
font-family: 'Inter', system-ui, sans-serif

/* Escalas */
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 1.875rem (30px)
--text-4xl: 2.25rem (36px)
```

### Espaciado

Usar el sistema de Tailwind (4px base):
- `p-2`: 0.5rem (8px)
- `p-4`: 1rem (16px)
- `p-6`: 1.5rem (24px)
- `p-8`: 2rem (32px)

### Bordes y Sombras

```css
/* Bordes redondeados */
--radius-sm: 0.25rem (4px)
--radius-md: 0.375rem (6px)
--radius-lg: 0.5rem (8px)
--radius-xl: 0.75rem (12px)

/* Sombras */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
```

---

## 📁 Estructura de Archivos Requerida

```
proyecto/
├── index.html                 # Landing principal
├── assets/
│   ├── css/
│   │   └── custom.css        # Estilos personalizados
│   └── js/
│       └── main.js           # JavaScript principal
│
├── auth/
│   ├── login.html            # Página de login
│   └── register.html         # Página de registro
│
├── dashboard/
│   ├── admin.html            # Dashboard administrativo
│   ├── host.html             # Dashboard para hosts
│   └── cliente.html          # Dashboard para clientes
│
├── boletera/
│   ├── eventos.html          # Lista de eventos
│   ├── evento-detalle.html   # Detalle de evento (landing page)
│   ├── carrito.html          # Carrito de compras
│   ├── checkout.html         # Proceso de pago
│   ├── confirmacion.html     # Confirmación de compra
│   ├── admin/
│   │   ├── eventos-admin.html     # Gestión de eventos
│   │   ├── crear-evento.html      # Crear/editar evento
│   │   ├── venues.html            # Gestión de venues
│   │   ├── codigos.html           # Códigos de descuento
│   │   └── reportes.html          # Reportes de ventas
│   └── host/
│       ├── scanner.html           # Scanner QR
│       ├── caja.html              # Caja de cobro
│       └── buscar-boletos.html    # Búsqueda de boletos
│
└── reservas/
    ├── sucursales.html       # Selección de sucursal
    ├── reservar.html         # Formulario de reserva
    ├── confirmacion.html     # Confirmación de reserva
    ├── mis-reservas.html     # Mis reservas (cliente)
    ├── admin/
    │   ├── planos.html            # Diseñador de planos
    │   ├── configuracion.html     # Configuración de reservas
    │   ├── horarios.html          # Gestión de horarios
    │   └── reportes.html          # Reportes de reservas
    └── host/
        ├── recepcion.html         # Recepción y check-in
        ├── plano-tiempo-real.html # Plano con estado actual
        ├── lista-espera.html      # Lista de espera
        └── agenda.html            # Agenda del día
```

---

## 🧩 Componentes Base de shadcn/ui a Implementar

### 1. Button
```html
<!-- Variantes: default, outline, ghost, destructive -->
<button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2">
  Botón Principal
</button>
```

### 2. Card
```html
<div class="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm">
  <div class="p-6">
    <h3 class="text-2xl font-semibold">Card Title</h3>
    <p class="text-sm text-gray-500">Card Description</p>
  </div>
  <div class="p-6 pt-0">
    <!-- Card content -->
  </div>
</div>
```

### 3. Input
```html
<input 
  type="text" 
  class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
  placeholder="Ingrese texto..."
/>
```

### 4. Badge
```html
<!-- Variantes: default, success, warning, error -->
<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
  Badge
</span>
```

### 5. Alert
```html
<div class="relative w-full rounded-lg border border-gray-200 p-4 bg-white">
  <h5 class="mb-1 font-medium leading-none tracking-tight">Alert Title</h5>
  <div class="text-sm text-gray-600">Alert description</div>
</div>
```

### 6. Dialog/Modal
```html
<div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
    <h2 class="text-lg font-semibold mb-4">Modal Title</h2>
    <p class="text-sm text-gray-600 mb-4">Modal content</p>
    <div class="flex justify-end gap-2">
      <button class="px-4 py-2 text-sm border rounded-md">Cancelar</button>
      <button class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md">Confirmar</button>
    </div>
  </div>
</div>
```

### 7. Table
```html
<div class="w-full overflow-auto">
  <table class="w-full caption-bottom text-sm">
    <thead class="border-b border-gray-200">
      <tr class="border-b transition-colors hover:bg-gray-50">
        <th class="h-12 px-4 text-left align-middle font-medium text-gray-500">Header</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b transition-colors hover:bg-gray-50">
        <td class="p-4 align-middle">Cell</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 8. Select/Dropdown
```html
<select class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
  <option>Seleccione una opción</option>
  <option>Opción 1</option>
  <option>Opción 2</option>
</select>
```

### 9. Tabs
```html
<div class="w-full">
  <div class="border-b border-gray-200">
    <nav class="flex gap-4" aria-label="Tabs">
      <button class="border-b-2 border-blue-600 py-2 px-1 text-sm font-medium text-blue-600">
        Tab 1
      </button>
      <button class="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
        Tab 2
      </button>
    </nav>
  </div>
  <div class="mt-4">Tab content</div>
</div>
```

### 10. Avatar
```html
<span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
  <span class="flex h-full w-full items-center justify-center bg-gray-100 text-gray-600 font-medium">
    JD
  </span>
</span>
```

---

## 📱 Páginas Principales a Diseñar

### 1. Landing Principal (`index.html`)

**Objetivo**: Página de entrada que presenta ambos módulos

**Secciones**:
- **Hero Section**: 
  - Título principal del sistema
  - Descripción breve
  - CTA para cada módulo (Eventos | Reservas)
  - Imagen/ilustración de fondo

- **Características**:
  - Grid 2x2 con iconos
  - Boletera: Venta de tickets, QR, Reportes, Multi-evento
  - Reservas: Gestión de mesas, Planos, Horarios, Clientes

- **CTA Section**:
  - Botones grandes para "Comenzar con Eventos" y "Comenzar con Reservas"
  - Link a login/registro

**Componentes a usar**: Hero, Card, Button, Icons

---

### 2. Login (`auth/login.html`)

**Diseño**: Pantalla dividida o centrada

**Elementos**:
- Logo del sistema
- Formulario de login:
  - Email input
  - Password input
  - Checkbox "Recordarme"
  - Botón "Iniciar Sesión"
- Links: "¿Olvidaste tu contraseña?" | "Registrarse"
- Opcional: Login con Google/OAuth

**Componentes**: Card, Input, Button, Checkbox

---

### 3. Dashboard Admin (`dashboard/admin.html`)

**Layout**: Sidebar + Área de contenido

**Sidebar**:
- Logo
- Navegación:
  - 📊 Dashboard
  - 🎫 Eventos (con submenu)
  - 🍽️ Reservas (con submenu)
  - 👥 Usuarios
  - ⚙️ Configuración
- Footer: Usuario actual, Cerrar sesión

**Área principal**:
- Header con breadcrumb, notificaciones, perfil
- Cards con estadísticas (KPIs):
  - Total ventas del mes
  - Eventos activos
  - Reservas hoy
  - Ingresos
- Gráficas (placeholder con divs):
  - Ventas por día (línea)
  - Top eventos (barras)
  - Reservas por horario (heat map)
- Tabla de actividad reciente

**Componentes**: Sidebar, Card, Badge, Table, Avatar

---

### 4. Evento Detalle - Landing Page (`boletera/evento-detalle.html`)

**Objetivo**: Página pública para comprar tickets

**Secciones**:
- **Hero**:
  - Imagen destacada del evento (full-width)
  - Overlay con: Nombre, Fecha, Venue, Precio desde

- **Detalles del Evento**:
  - Grid 2 columnas (desktop):
    - Izquierda: Descripción, lineup, mapa del venue
    - Derecha: Selector de tickets (sticky card)

- **Selector de Tickets** (Card sticky):
  - Lista de tipos de ticket con:
    - Nombre (ej: General, VIP)
    - Precio
    - Disponibilidad
    - Selector de cantidad
  - Input para código de descuento
  - Total parcial
  - Botón "Agregar al carrito"

- **Información adicional**:
  - Tabs: Descripción | Artistas | Ubicación | Políticas

**Componentes**: Hero, Card, Badge, Button, Tabs, Input

---

### 5. Carrito de Compras (`boletera/carrito.html`)

**Layout**: Centrado con max-width

**Elementos**:
- Breadcrumb: Evento > Carrito > Checkout
- Lista de tickets en carrito:
  - Card por cada tipo de ticket
  - Miniatura del evento
  - Cantidad (editable)
  - Precio unitario y subtotal
  - Botón eliminar
- Resumen lateral (desktop) o inferior (mobile):
  - Subtotal
  - Descuentos aplicados
  - Total
  - Botón "Continuar al pago"
- Link "Seguir comprando"

**Componentes**: Card, Button, Badge, Input

---

### 6. Checkout (`boletera/checkout.html`)

**Layout**: Multi-step form o single page

**Pasos**:
1. **Datos del comprador**:
   - Nombre completo
   - Email
   - WhatsApp
   - (Los tickets se envían a este email)

2. **Método de pago** (opcional si está activado):
   - Radio buttons: MercadoPago | PayPal
   - Nota: Integración posterior

3. **Resumen del pedido**:
   - Lista de tickets
   - Total a pagar

4. **Botón de confirmación**

**Componentes**: Card, Input, Button, Radio, Alert

---

### 7. Confirmación de Compra (`boletera/confirmacion.html`)

**Diseño**: Centrado, celebratorio

**Elementos**:
- Icono de éxito (✓) grande
- Mensaje: "¡Compra confirmada!"
- Número de orden
- Resumen de la compra
- Instrucciones:
  - "Hemos enviado tus tickets a [email]"
  - "Puedes descargar tus tickets aquí"
- Botones:
  - Descargar tickets (PDF con QR)
  - Ver mis tickets
  - Volver al inicio

**Componentes**: Card, Button, Badge, Alert (success)

---

### 8. Gestión de Eventos Admin (`boletera/admin/eventos-admin.html`)

**Layout**: Dashboard admin

**Elementos**:
- Header:
  - Título "Gestión de Eventos"
  - Botón "+ Crear Evento"
  - Filtros: Estado (Todos, Activos, Finalizados), Búsqueda

- Lista/Grid de eventos:
  - Cards con:
    - Imagen del evento
    - Nombre, fecha
    - Venue
    - Badge de estado (Activo, Pausado, Finalizado)
    - Estadísticas rápidas: Vendidos / Disponibles
    - Botones: Ver | Editar | Reportes | Pausar

- Tabs opcionales:
  - Activos
  - Próximos
  - Finalizados

**Componentes**: Card, Button, Badge, Input (search), Table/Grid

---

### 9. Crear/Editar Evento (`boletera/admin/crear-evento.html`)

**Layout**: Formulario largo con secciones

**Secciones**:

1. **Información básica**:
   - Nombre del evento
   - Descripción
   - Imagen destacada (upload)
   - Categoría (Concierto, Festival, Deportivo, etc.)

2. **Fecha y ubicación**:
   - Fecha y hora de inicio
   - Fecha y hora de fin
   - Venue (selector)
   - Dirección (si es nuevo venue)

3. **Tipos de tickets**:
   - Tabla editable:
     - Nombre del ticket (ej: General, VIP)
     - Precio
     - Cantidad disponible
     - Descripción
     - Botón + Agregar tipo
   
4. **Configuración adicional**:
   - Fecha límite de venta
   - Boletos máximos por compra
   - Estado (Activo/Inactivo)

5. **Botones**:
   - Guardar como borrador
   - Publicar evento
   - Cancelar

**Componentes**: Card, Input, Textarea, Select, Button, Table, File upload

---

### 10. Scanner QR Host (`boletera/host/scanner.html`)

**Objetivo**: App para validar tickets en la puerta

**Layout**: Mobile-first, simple

**Elementos**:
- Header:
  - Evento actual (selector si hay múltiples)
  - Contador de aforo: X/Y personas

- Área principal:
  - Simulación de cámara para QR (div con borde)
  - Instrucciones: "Apunta el código QR del ticket"
  - Botón: "Activar cámara" (simulado)

- Sección de resultados (se muestra al "escanear"):
  - Alert (success/error)
  - Datos del ticket:
    - Nombre del titular
    - Tipo de ticket
    - Estado (Válido, Ya usado, Inválido)
  - Botón "Permitir entrada" (si es válido)

- Búsqueda manual:
  - Input: "Buscar por nombre o número de ticket"
  - Lista de resultados

**Componentes**: Card, Button, Badge, Alert, Input

---

### 11. Selección de Sucursal (`reservas/sucursales.html`)

**Objetivo**: Elegir sucursal para reservar

**Elementos**:
- Header: "¿Dónde quieres reservar?"
- Grid/Lista de sucursales:
  - Cards con:
    - Imagen de la sucursal
    - Nombre
    - Dirección
    - Horario de atención
    - Teléfono
    - Badge: "Disponible ahora" o "Cerrado"
    - Botón "Reservar aquí"

- Mapa (opcional, placeholder):
  - Div con "Mapa de sucursales"

**Componentes**: Card, Button, Badge, Icons (mapa, teléfono)

---

### 12. Formulario de Reserva (`reservas/reservar.html`)

**Layout**: Wizard o single form

**Pasos/Secciones**:

1. **Fecha y hora**:
   - Date picker
   - Time picker (horarios disponibles)
   - Número de personas (selector)

2. **Datos del cliente**:
   - Nombre
   - Apellido
   - Email
   - WhatsApp
   - ¿Es tu cumpleaños? (checkbox + date)

3. **Preferencias** (opcional):
   - Tipo de ocasión (etiquetas): Cumpleaños, Aniversario, Negocios, Casual
   - Área preferida (si hay): Terraza, Interior, Bar

4. **Confirmación**:
   - Resumen de la reserva
   - Checkbox: "Acepto política de cancelación"
   - Botón "Confirmar reserva"

**Componentes**: Card, Input, Select, Button, Checkbox, Badge

---

### 13. Confirmación de Reserva (`reservas/confirmacion.html`)

**Diseño**: Centrado, limpio

**Elementos**:
- Icono de éxito
- Mensaje: "¡Reserva confirmada!"
- Código de reserva
- Detalles:
  - Sucursal
  - Fecha y hora
  - Número de personas
  - Nombre del titular
- QR Code (simulado o generado)
- Instrucciones:
  - "Presenta este código al llegar"
  - "Llegada recomendada: 15 min antes"
- Opciones:
  - Agregar al calendario (botón)
  - Descargar confirmación (PDF)
- Botones:
  - Modificar reserva
  - Cancelar reserva
  - Volver al inicio

**Componentes**: Card, Button, QR display, Alert (info)

---

### 14. Mis Reservas Cliente (`reservas/mis-reservas.html`)

**Layout**: Lista de reservas

**Elementos**:
- Header: "Mis Reservas"
- Tabs: Próximas | Pasadas | Canceladas
- Lista de reservas:
  - Cards con:
    - Fecha y hora
    - Sucursal
    - Número de personas
    - Badge de estado (Confirmada, Pendiente, Cancelada)
    - Botones: Ver QR | Modificar | Cancelar

- Filtros: Por fecha, por sucursal

**Componentes**: Card, Badge, Button, Tabs

---

### 15. Diseñador de Planos (`reservas/admin/planos.html`)

**Objetivo**: Crear y editar layout de mesas

**Layout**: Canvas + Toolbar

**Elementos**:
- Toolbar lateral:
  - Área actual (selector)
  - Herramientas:
    - + Agregar mesa
    - Tipos de mesa: 2 personas, 4 personas, 6 personas, 8+ personas
    - Combinar mesas (toggle)
  - Propiedades de mesa seleccionada:
    - Número de mesa
    - Capacidad
    - Estado actual
    - Notas

- Canvas principal:
  - Grid de fondo (simular plano)
  - Mesas representadas como divs drag-and-drop:
    - Forma: Círculo (redonda) o Rectángulo (rectangular)
    - Número de mesa
    - Capacidad (personas)
    - Color según estado:
      - Verde: Disponible
      - Amarillo: Reservada
      - Rojo: Ocupada
      - Gris: Bloqueada

- Controles:
  - Zoom in/out
  - Guardar plano
  - Vista previa

**Componentes**: Button, Input, Select, Canvas (div simulado), Cards (mesas)

---

### 16. Recepción Host (`reservas/host/recepcion.html`)

**Objetivo**: Check-in de clientes

**Layout**: Dashboard operativo

**Elementos**:
- Header:
  - Sucursal actual
  - Fecha y hora actual
  - Resumen: X reservas hoy, Y en lista de espera

- Tabs:
  - Reservas del día
  - Walk-ins
  - Lista de espera

- Lista de reservas:
  - Cards timeline:
    - Hora de reserva
    - Nombre del cliente
    - Número de personas
    - Mesa asignada (editable)
    - Badge de estado: Pendiente, Confirmada, Sentada, No-show
    - Botones:
      - Scanner QR (para check-in)
      - Confirmar llegada
      - Asignar mesa
      - No-show

- Sección lateral (opcional):
  - Vista mini del plano con disponibilidad

- Botón flotante: "+ Agregar walk-in"

**Componentes**: Card, Badge, Button, Table, Timeline

---

### 17. Plano en Tiempo Real (`reservas/host/plano-tiempo-real.html`)

**Objetivo**: Ver estado actual de todas las mesas

**Layout**: Similar al diseñador, pero read-only

**Elementos**:
- Header:
  - Sucursal y fecha
  - Filtros rápidos: Ver solo disponibles, Ver solo ocupadas

- Canvas/Grid de mesas:
  - Cada mesa muestra:
    - Número
    - Estado (color coded)
    - Nombre del cliente (si está ocupada/reservada)
    - Hora de llegada o reserva
  - Al hacer click en una mesa:
    - Modal con detalles:
      - Cliente
      - Hora de llegada/reserva
      - Número de personas
      - Tiempo transcurrido (si está ocupada)
      - Acciones: Cambiar estado, Ver pedido, Liberar mesa

- Leyenda de colores:
  - 🟢 Disponible
  - 🟡 Reservada
  - 🔴 Ocupada
  - ⚫ Bloqueada

**Componentes**: Canvas (grid), Card, Badge, Modal, Button

---

### 18. Agenda del Día (`reservas/host/agenda.html`)

**Objetivo**: Vista cronológica de reservas

**Layout**: Timeline vertical

**Elementos**:
- Header:
  - Fecha (selector)
  - Sucursal
  - Filtros: Por área, Por estado

- Timeline:
  - Hora en el eje Y
  - Cards de reservas en cada horario:
    - Hora
    - Nombre del cliente
    - Número de personas
    - Mesa asignada
    - Estado
    - Contacto (teléfono/WhatsApp)
    - Notas especiales (si hay)
  - Bloques de tiempo sin reservas (vacíos)

- Botón flotante: "+ Nueva reserva"

**Componentes**: Timeline, Card, Badge, Button

---

## 🎯 Componentes Especiales a Crear

### 1. Stat Card (KPI Card)
```html
<div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm text-gray-500">Total Ventas</p>
      <p class="text-2xl font-bold text-gray-900">$45,250</p>
      <p class="text-sm text-green-600 mt-1">
        <span>↑ 12%</span> vs mes anterior
      </p>
    </div>
    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
      <!-- Icon -->
      <svg class="w-6 h-6 text-blue-600">...</svg>
    </div>
  </div>
</div>
```

### 2. Table Status Badge
```html
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
  <span class="w-2 h-2 bg-green-600 rounded-full"></span>
  Disponible
</div>
```

### 3. Timeline Item
```html
<div class="flex gap-4">
  <div class="flex flex-col items-center">
    <div class="w-3 h-3 bg-blue-600 rounded-full"></div>
    <div class="w-0.5 h-full bg-gray-200"></div>
  </div>
  <div class="flex-1 pb-8">
    <p class="text-sm text-gray-500">14:00</p>
    <div class="mt-1 p-3 bg-white border border-gray-200 rounded-lg">
      <p class="font-medium">María González</p>
      <p class="text-sm text-gray-600">4 personas - Mesa 12</p>
    </div>
  </div>
</div>
```

### 4. Ticket Card (en carrito)
```html
<div class="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg">
  <img src="..." alt="Evento" class="w-20 h-20 object-cover rounded">
  <div class="flex-1">
    <h4 class="font-medium">Festival de Música 2024</h4>
    <p class="text-sm text-gray-600">Ticket VIP</p>
    <div class="flex items-center gap-4 mt-2">
      <div class="flex items-center border border-gray-300 rounded">
        <button class="px-2 py-1 hover:bg-gray-100">-</button>
        <span class="px-3 py-1 border-x border-gray-300">2</span>
        <button class="px-2 py-1 hover:bg-gray-100">+</button>
      </div>
      <span class="text-lg font-semibold">$500.00</span>
    </div>
  </div>
  <button class="text-red-600 hover:text-red-700">
    <svg class="w-5 h-5"><!-- Trash icon --></svg>
  </button>
</div>
```

### 5. QR Display
```html
<div class="flex flex-col items-center justify-center p-6 bg-white border-2 border-dashed border-gray-300 rounded-lg">
  <div class="w-48 h-48 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
    <!-- QR placeholder -->
    <svg class="w-32 h-32 text-gray-400">...</svg>
  </div>
  <p class="mt-4 text-sm text-gray-600">Código: <span class="font-mono font-bold">RSV-2024-001234</span></p>
</div>
```

---

## 📱 Responsive Design Guidelines

### Breakpoints
```css
/* Mobile first approach */
sm: 640px   /* Tablet */
md: 768px   /* Tablet landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Patrones Responsive

**Sidebar en Dashboard**:
- Mobile: Oculto, toggle con hamburger menu
- Desktop: Fijo en el lateral

**Grid de Cards**:
- Mobile: 1 columna
- Tablet: 2 columnas
- Desktop: 3-4 columnas

**Formularios**:
- Mobile: 1 columna, campos full-width
- Desktop: 2 columnas donde tenga sentido

---

## 🔧 JavaScript Interactividad Básica

### Funcionalidades a Implementar

1. **Mobile Menu Toggle**
```javascript
// Toggle sidebar/menu en mobile
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});
```

2. **Tabs Switching**
```javascript
// Cambiar entre tabs
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });
  document.getElementById(tabId).classList.remove('hidden');
}
```

3. **Modal Open/Close**
```javascript
// Abrir/cerrar modales
function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}
function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}
```

4. **Quantity Selector**
```javascript
// Incrementar/decrementar cantidad
function updateQuantity(action, inputId) {
  const input = document.getElementById(inputId);
  let value = parseInt(input.value);
  if (action === 'increment') value++;
  if (action === 'decrement' && value > 1) value--;
  input.value = value;
  updateTotal(); // Actualizar precio total
}
```

5. **Search/Filter**
```javascript
// Filtrar lista en tiempo real
document.getElementById('search').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.searchable-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? '' : 'none';
  });
});
```

6. **Drag and Drop (Planos)**
```javascript
// Mover mesas en el plano (básico)
let draggedElement = null;

function makeDraggable(element) {
  element.draggable = true;
  element.addEventListener('dragstart', (e) => {
    draggedElement = element;
    e.dataTransfer.effectAllowed = 'move';
  });
}

canvas.addEventListener('dragover', (e) => {
  e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
  e.preventDefault();
  if (draggedElement) {
    draggedElement.style.left = e.offsetX + 'px';
    draggedElement.style.top = e.offsetY + 'px';
  }
});
```

---

## 🎨 Iconos (Lucide Icons via CDN)

### Setup
```html
<script src="https://unpkg.com/lucide@latest"></script>
<script>
  lucide.createIcons();
</script>
```

### Iconos Comunes a Usar

**Boletera/Eventos**:
- `ticket` - Tickets
- `calendar` - Fecha
- `map-pin` - Ubicación
- `users` - Asistentes
- `credit-card` - Pagos
- `download` - Descargar
- `qr-code` - Código QR
- `bar-chart` - Reportes
- `search` - Búsqueda

**Reservas**:
- `calendar-check` - Reservas
- `clock` - Horarios
- `utensils` - Restaurante
- `layout` - Planos
- `user-check` - Check-in
- `list` - Lista
- `bell` - Notificaciones

**General UI**:
- `menu` - Hamburger menu
- `x` - Cerrar
- `chevron-down` - Dropdown
- `chevron-right` - Siguiente
- `check` - Éxito
- `alert-circle` - Alerta
- `info` - Información
- `settings` - Configuración
- `log-out` - Cerrar sesión
- `plus` - Agregar
- `edit` - Editar
- `trash` - Eliminar
- `filter` - Filtros

Uso:
```html
<i data-lucide="ticket" class="w-5 h-5"></i>
```

---

## 📝 Notas de Implementación

### 1. CDN Links Necesarios

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### 2. Configuración de Tailwind Custom

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        }
      }
    }
  }
</script>
```

### 3. Meta Tags Esenciales

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Sistema de gestión de eventos y reservas">
<title>Sistema de Gestión | Eventos y Reservas</title>
```

### 4. Estructura HTML Base

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Título de la Página</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50">
  <!-- Contenido aquí -->
  
  <script>
    lucide.createIcons();
  </script>
</body>
</html>
```

---

## 🎯 Prioridades de Desarrollo

### Fase 1 (Esencial)
1. ✅ Landing principal (`index.html`)
2. ✅ Login/Register
3. ✅ Dashboard admin base
4. ✅ Evento detalle (landing page pública)
5. ✅ Carrito y checkout
6. ✅ Confirmación de compra

### Fase 2 (Admin)
7. ✅ Gestión de eventos
8. ✅ Crear/editar evento
9. ✅ Dashboard admin completo

### Fase 3 (Host/Operativo)
10. ✅ Scanner QR
11. ✅ Recepción (reservas)
12. ✅ Plano en tiempo real

### Fase 4 (Reservas)
13. ✅ Selección de sucursal
14. ✅ Formulario de reserva
15. ✅ Confirmación de reserva
16. ✅ Diseñador de planos

---

## ✅ Checklist por Página

Al crear cada página, verificar:

- [ ] HTML semántico
- [ ] Responsive (mobile-first)
- [ ] Tailwind classes consistentes
- [ ] Iconos de Lucide implementados
- [ ] Componentes de shadcn/ui adaptados
- [ ] Estados hover/focus en elementos interactivos
- [ ] Accesibilidad básica (alt texts, labels)
- [ ] JavaScript de interactividad (si aplica)
- [ ] Colores del sistema de diseño
- [ ] Consistencia con otras páginas

---

## 🚀 Comando para Comenzar

```bash
# Crear estructura base
mkdir -p assets/{css,js} auth dashboard boletera/{admin,host} reservas/{admin,host}

# Crear archivo principal
touch index.html

# Ready to code!
```

---

## 📞 Consideraciones Finales

- **Datos de prueba**: Usar datos realistas pero ficticios
- **Imágenes**: Placeholders de unsplash.com o placeholder.com
- **Links**: Usar # en hrefs cuando no haya página destino
- **Forms**: No necesitan backend, solo validación visual
- **Consistencia**: Mantener el mismo estilo en todas las páginas
- **Performance**: Código limpio, evitar CSS/JS innecesario
- **Comentarios**: Agregar comentarios en secciones complejas

---

## 🎨 Ejemplos de Color en Contexto

**Success/Confirmación**:
```html
<div class="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
  ✓ Reserva confirmada exitosamente
</div>
```

**Warning/Atención**:
```html
<div class="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg">
  ⚠ Solo quedan 5 tickets disponibles
</div>
```

**Error**:
```html
<div class="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
  ✗ El código QR no es válido
</div>
```

**Info**:
```html
<div class="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
  ℹ Recuerda llegar 15 minutos antes
</div>
```

---

¡Este documento debe servir como guía completa para implementar el diseño del sistema!