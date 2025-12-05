/**
 * Constantes de Cloudinary (duplicadas para evitar importar el SDK server-side)
 */
export const CLOUDINARY_FOLDERS = {
  EVENTOS: 'eventos',
  SUCURSALES: 'sucursales',
  USUARIOS: 'usuarios',
  QR_CODES: 'qr-codes',
} as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

/**
 * Resultado del upload
 */
export interface UploadResult {
  publicId: string
  url: string
  secureUrl: string
  width: number
  height: number
  format: string
  resourceType: string
  bytes: number
}

/**
 * Opciones de upload
 */
export interface UploadOptions {
  folder?: keyof typeof CLOUDINARY_FOLDERS
  transformation?: any
  publicId?: string
  overwrite?: boolean
  tags?: string[]
}

/**
 * Validar archivo antes de subir
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Validar tamaño
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }

  // Validar tipo
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG y WebP',
    }
  }

  return { valid: true }
}

/**
 * Convertir File a Base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Upload de imagen desde el cliente (usando API Route)
 */
export const uploadImage = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  // Validar archivo
  const validation = validateFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  try {
    // Convertir a base64
    const base64 = await fileToBase64(file)

    // Enviar al API route
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64,
        folder: options.folder,
        transformation: options.transformation,
        publicId: options.publicId,
        overwrite: options.overwrite,
        tags: options.tags,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al subir la imagen')
    }

    const result = await response.json()
    return result
  } catch (error: any) {
    console.error('Error uploading image:', error)
    throw new Error(error.message || 'Error al subir la imagen')
  }
}

/**
 * Eliminar imagen de Cloudinary
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await fetch('/api/upload', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    })
  } catch (error: any) {
    console.error('Error deleting image:', error)
    throw new Error('Error al eliminar la imagen')
  }
}

/**
 * Obtener URL optimizada de Cloudinary
 */
export const getOptimizedUrl = (
  publicId: string,
  options?: {
    width?: number
    height?: number
    crop?: string
    quality?: string
    format?: string
  }
): string => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    console.warn('Cloudinary cloud name not configured')
    return ''
  }

  const transformations = []

  if (options?.width) transformations.push(`w_${options.width}`)
  if (options?.height) transformations.push(`h_${options.height}`)
  if (options?.crop) transformations.push(`c_${options.crop}`)
  if (options?.quality) transformations.push(`q_${options.quality}`)
  if (options?.format) transformations.push(`f_${options.format}`)

  const transformStr = transformations.length > 0 ? `${transformations.join(',')}/` : ''

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}${publicId}`
}

/**
 * Generar URL con transformaciones automáticas
 */
export const getImageUrl = {
  evento: (publicId: string) =>
    getOptimizedUrl(publicId, {
      width: 1200,
      height: 630,
      crop: 'fill',
      quality: 'auto',
      format: 'webp',
    }),

  sucursal: (publicId: string) =>
    getOptimizedUrl(publicId, {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      format: 'webp',
    }),

  avatar: (publicId: string) =>
    getOptimizedUrl(publicId, {
      width: 200,
      height: 200,
      crop: 'fill',
      quality: 'auto',
      format: 'webp',
    }),

  thumbnail: (publicId: string) =>
    getOptimizedUrl(publicId, {
      width: 300,
      height: 200,
      crop: 'fill',
      quality: 'auto',
      format: 'webp',
    }),
}
