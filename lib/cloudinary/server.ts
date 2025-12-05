import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_FOLDERS } from './config'

/**
 * Configurar Cloudinary (solo servidor)
 */
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

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
 * Upload de imagen al servidor (solo servidor)
 */
export const uploadImageServer = async (
  file: string,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  try {
    const uploadOptions: any = {
      folder: options.folder ? CLOUDINARY_FOLDERS[options.folder] : undefined,
      transformation: options.transformation,
      public_id: options.publicId,
      overwrite: options.overwrite ?? false,
      tags: options.tags,
      resource_type: 'image',
    }

    const result = await cloudinary.uploader.upload(file, uploadOptions)

    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type,
      bytes: result.bytes,
    }
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error(error.message || 'Error al subir imagen a Cloudinary')
  }
}

/**
 * Eliminar imagen de Cloudinary (solo servidor)
 */
export const deleteImageServer = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error: any) {
    console.error('Error deleting from Cloudinary:', error)
    throw new Error('Error al eliminar imagen de Cloudinary')
  }
}

/**
 * Obtener información de una imagen
 */
export const getImageInfo = async (publicId: string) => {
  try {
    const result = await cloudinary.api.resource(publicId)
    return result
  } catch (error: any) {
    console.error('Error getting image info:', error)
    throw new Error('Error al obtener información de la imagen')
  }
}
