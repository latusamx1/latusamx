# 🔥 Desplegar Reglas de Firestore - URGENTE

## ⚠️ Error Actual
```
FirebaseError: Missing or insufficient permissions
```

## 🎯 Solución: Actualizar Reglas en Firebase Console

### Paso 1: Abrir Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. En el menú lateral, ve a **Firestore Database**
4. Click en la pestaña **Reglas** (Rules)

### Paso 2: Copiar las Reglas
Las reglas correctas están en el archivo: `docs/firebase/firestore.rules`

**O copia directamente estas reglas:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function getUserData() {
      return get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data;
    }

    function hasRole(role) {
      return isAuthenticated() && getUserData().rol == role;
    }

    function isAdmin() {
      return hasRole('admin');
    }

    function isHost() {
      return hasRole('host');
    }

    function isAdminOrHost() {
      return isAdmin() || isHost();
    }

    // ============================================
    // COLECCIÓN: USUARIOS
    // ============================================

    match /usuarios/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: EVENTOS
    // ============================================

    match /eventos/{eventoId} {
      // IMPORTANTE: Lectura pública temporal para desarrollo
      allow read: if true;
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: VENUES
    // ============================================

    match /venues/{venueId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: ORDENES
    // ============================================

    match /ordenes/{ordenId} {
      allow read: if isOwner(resource.data.userId) || isAdminOrHost();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAdminOrHost();
      allow delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: TICKETS
    // ============================================

    match /tickets/{ticketId} {
      allow read: if isAuthenticated() || isAdminOrHost();
      allow create: if isAuthenticated();
      allow update: if isAdminOrHost();
      allow delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: CÓDIGOS DE DESCUENTO
    // ============================================

    match /codigos-descuento/{codigoId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: SUCURSALES
    // ============================================

    match /sucursales/{sucursalId} {
      allow read: if resource.data.activo == true || isAdminOrHost();
      allow create, update, delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: RESERVAS
    // ============================================

    match /reservas/{reservaId} {
      allow read: if isOwner(resource.data.userId) || isAdminOrHost();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isOwner(resource.data.userId) || isAdminOrHost();
      allow delete: if isOwner(resource.data.userId) || isAdmin();
    }

    // ============================================
    // COLECCIÓN: MESAS
    // ============================================

    match /mesas/{mesaId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: PLANOS
    // ============================================

    match /planos/{planoId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }

    // ============================================
    // COLECCIÓN: LISTA DE ESPERA
    // ============================================

    match /lista-espera/{entradaId} {
      allow read: if isAdminOrHost();
      allow create: if isAdminOrHost();
      allow update: if isAdminOrHost();
      allow delete: if isAdminOrHost();
    }

    // ============================================
    // COLECCIÓN: RESERVAS TICKETS (Sistema de Inventario)
    // ============================================

    match /reservas_tickets/{reservaId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if isAuthenticated();
    }

    // ============================================
    // DENEGAR TODO LO DEMÁS
    // ============================================

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Paso 3: Publicar las Reglas
1. Pega las reglas en el editor de Firebase Console
2. Click en **Publicar** (Publish)
3. Espera la confirmación

### Paso 4: Verificar
1. Recarga tu aplicación
2. El error debería desaparecer
3. Los eventos deberían cargarse correctamente

## 📝 Notas Importantes

### Para Desarrollo (Ahora)
```javascript
match /eventos/{eventoId} {
  allow read: if true;  // ✅ Lectura pública
  allow create, update, delete: if isAdmin();
}
```

### Para Producción (Antes de Deploy)
Cambiar a:
```javascript
match /eventos/{eventoId} {
  allow read: if resource.data.estado == 'publicado' || isAdmin();
  allow create, update, delete: if isAdmin();
}
```

## 🚀 Alternativa: Firebase CLI (Si tienes permisos)

Si tienes Firebase CLI configurado:

```bash
# Navegar al proyecto
cd /Users/pedroduran/Desktop/Proyectos/crm-bt-josue

# Desplegar solo las reglas
firebase deploy --only firestore:rules
```

## ✅ Verificación Exitosa

Después de desplegar, deberías ver:
- ✅ Dashboard de eventos carga sin errores
- ✅ Lista de eventos visible
- ✅ Stats cards con datos reales
- ✅ Sin errores en consola

---

**Tiempo estimado:** 2-3 minutos
**Prioridad:** 🔴 ALTA - Bloquea toda la funcionalidad de eventos
