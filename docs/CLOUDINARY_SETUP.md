# 🌥️ Configuración de Cloudinary

## ✅ Configuración Completada

### 1. Variables de Entorno
- ✅ `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` configurada
- ✅ `CLOUDINARY_API_KEY` configurada
- ✅ `CLOUDINARY_API_SECRET` configurada

### 2. Archivos Creados
- ✅ `lib/cloudinary/config.ts` - Configuración y constantes
- ✅ `lib/cloudinary/upload.ts` - Helpers de upload/delete/optimización
- ✅ `app/api/upload/route.ts` - API route para uploads
- ✅ `components/shared/ImageUpload.tsx` - Componente reutilizable
- ✅ `lib/hooks/useImageUpload.ts` - Hook personalizado

### 3. Dependencias Instaladas
- ✅ `cloudinary` - SDK oficial de Cloudinary
- ✅ `next-cloudinary` - Componentes optimizados para Next.js

---

## 📚 Guía de Uso

### 1️⃣ Usar el Componente ImageUpload

```tsx
'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/shared/ImageUpload'

export default function EventForm() {
  const [imageUrl, setImageUrl] = useState('')
  const [imagePublicId, setImagePublicId] = useState('')

  const handleImageChange = (url: string, publicId: string) => {
    setImageUrl(url)
    setImagePublicId(publicId)
  }

  const handleImageRemove = () => {
    setImageUrl('')
    setImagePublicId('')
  }

  return (
    <form>
      <ImageUpload
        value={imageUrl}
        onChange={handleImageChange}
        onRemove={handleImageRemove}
        folder="EVENTOS"
        preview={{
          width: 600,
          height: 400,
          aspectRatio: '3/2'
        }}
        placeholder="Sube una imagen del evento"
      />
    </form>
  )
}
```

### 2️⃣ Usar el Hook useImageUpload

```tsx
'use client'

import { useImageUpload } from '@/lib/hooks/useImageUpload'

export default function CustomUpload() {
  const { upload, remove, isUploading, error } = useImageUpload()

  const handleFileSelect = async (file: File) => {
    try {
      const result = await upload(file, {
        folder: 'EVENTOS',
        tags: ['evento', 'featured']
      })
      console.log('Imagen subida:', result.secureUrl)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
        disabled={isUploading}
      />
      {isUploading && <p>Subiendo...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
```

### 3️⃣ Subir desde el Servidor (Server Actions / API Routes)

```typescript
import { uploadImageServer } from '@/lib/cloudinary/upload'

export async function uploadEventImage(formData: FormData) {
  'use server'

  const file = formData.get('image') as File
  const buffer = Buffer.from(await file.arrayBuffer())

  const result = await uploadImageServer(buffer, {
    folder: 'EVENTOS',
    transformation: {
      width: 1200,
      height: 630,
      crop: 'fill',
      quality: 'auto',
      format: 'webp'
    }
  })

  return result.secureUrl
}
```

### 4️⃣ Obtener URLs Optimizadas

```typescript
import { getImageUrl } from '@/lib/cloudinary/upload'

// Para eventos (1200x630)
const eventoUrl = getImageUrl.evento('eventos/mi-evento-123')

// Para sucursales (800x600)
const sucursalUrl = getImageUrl.sucursal('sucursales/sucursal-456')

// Para avatares (200x200)
const avatarUrl = getImageUrl.avatar('usuarios/user-789')

// Para thumbnails (300x200)
const thumbUrl = getImageUrl.thumbnail('eventos/evento-abc')
```

### 5️⃣ Usar con next-cloudinary (Componente Optimizado)

```tsx
import { CldImage } from 'next-cloudinary'

export function EventCard({ publicId }: { publicId: string }) {
  return (
    <CldImage
      src={publicId}
      width={600}
      height={400}
      crop="fill"
      alt="Evento"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )
}
```

---

## 📁 Carpetas de Cloudinary

Usa estas carpetas predefinidas para organizar tus imágenes:

```typescript
import { CLOUDINARY_FOLDERS } from '@/lib/cloudinary/config'

// EVENTOS: 'eventos'
// SUCURSALES: 'sucursales'
// USUARIOS: 'usuarios'
// QR_CODES: 'qr-codes'
```

---

## 🎨 Transformaciones Predefinidas

```typescript
import { CLOUDINARY_PRESETS } from '@/lib/cloudinary/config'

// EVENTO_IMAGE: 1200x630, webp, auto quality
// SUCURSAL_IMAGE: 800x600, webp, auto quality
// AVATAR_IMAGE: 200x200, webp, gravity face
// THUMBNAIL: 300x200, webp, auto quality
```

---

## 🔒 Validaciones

El sistema valida automáticamente:

- ✅ **Tamaño máximo**: 10MB
- ✅ **Tipos permitidos**: JPEG, PNG, WebP
- ✅ **Formato de salida**: WebP (optimizado)
- ✅ **Calidad**: Auto (Cloudinary optimiza automáticamente)

---

## 🌐 Configurar Upload Presets en Cloudinary (Opcional)

Para uploads desde el cliente sin API route:

1. Ve a [Cloudinary Settings](https://cloudinary.com/console/settings/upload)
2. En **Upload presets** → Click **Add upload preset**
3. Configura:
   - **Preset name**: `eventos_unsigned`
   - **Signing mode**: Unsigned
   - **Folder**: `eventos`
   - **Transformations**: Width 1200, Height 630, Crop fill
4. Guarda

Luego puedes usar:

```typescript
import { CldUploadWidget } from 'next-cloudinary'

<CldUploadWidget uploadPreset="eventos_unsigned">
  {({ open }) => <button onClick={() => open()}>Upload</button>}
</CldUploadWidget>
```

---

## 🧪 Probar la Configuración

Crea una página de prueba:

```tsx
// app/test-upload/page.tsx
'use client'

import { ImageUpload } from '@/components/shared/ImageUpload'
import { useState } from 'react'

export default function TestUploadPage() {
  const [url, setUrl] = useState('')
  const [publicId, setPublicId] = useState('')

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Cloudinary Upload</h1>

      <ImageUpload
        value={url}
        onChange={(newUrl, newPublicId) => {
          setUrl(newUrl)
          setPublicId(newPublicId)
        }}
        onRemove={() => {
          setUrl('')
          setPublicId('')
        }}
        folder="EVENTOS"
      />

      {url && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm"><strong>URL:</strong> {url}</p>
          <p className="text-sm"><strong>Public ID:</strong> {publicId}</p>
        </div>
      )}
    </div>
  )
}
```

Visita: `http://localhost:3000/test-upload`

---

## 📊 Dashboard de Cloudinary

Accede a tu dashboard para:
- Ver todas las imágenes subidas
- Administrar carpetas
- Ver estadísticas de uso
- Configurar transformaciones

👉 [Cloudinary Console](https://cloudinary.com/console)

---

## 🎯 Próximos Pasos

1. ✅ Cloudinary configurado y listo para usar
2. 📝 Integrar ImageUpload en formularios de eventos
3. 📝 Integrar ImageUpload en formularios de sucursales
4. 📝 Agregar upload de avatar en perfil de usuario

---

## 💡 Tips de Optimización

### 1. Lazy Loading
```tsx
<CldImage
  src={publicId}
  loading="lazy"
  {...props}
/>
```

### 2. Responsive Images
```tsx
<CldImage
  src={publicId}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  {...props}
/>
```

### 3. Placeholder Blur
```tsx
<CldImage
  src={publicId}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  {...props}
/>
```

---

**Cloudinary está listo para usar en tu proyecto** ✨
