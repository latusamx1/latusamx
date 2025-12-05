import { v2 as cloudinary } from 'cloudinary'

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Validar configuración
if (
  !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn(
    '⚠️ Cloudinary no está completamente configurado. Verifica tu archivo .env.local'
  )
}

export { cloudinary }

// Constantes útiles
export const CLOUDINARY_FOLDERS = {
  EVENTOS: 'eventos',
  SUCURSALES: 'sucursales',
  USUARIOS: 'usuarios',
  QR_CODES: 'qr-codes',
} as const

export const CLOUDINARY_PRESETS = {
  EVENTO_IMAGE: {
    width: 1200,
    height: 630,
    crop: 'fill',
    quality: 'auto',
    format: 'webp',
  },
  SUCURSAL_IMAGE: {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    format: 'webp',
  },
  AVATAR_IMAGE: {
    width: 200,
    height: 200,
    crop: 'fill',
    quality: 'auto',
    format: 'webp',
    gravity: 'face',
  },
  THUMBNAIL: {
    width: 300,
    height: 200,
    crop: 'fill',
    quality: 'auto',
    format: 'webp',
  },
} as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
