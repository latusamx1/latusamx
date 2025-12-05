'use client'

import { useState } from 'react'
import { uploadImage, deleteImage } from '@/lib/cloudinary/client'
import type { UploadOptions, UploadResult } from '@/lib/cloudinary/client'

interface UseImageUploadReturn {
  upload: (file: File, options?: UploadOptions) => Promise<UploadResult>
  remove: (publicId: string) => Promise<void>
  isUploading: boolean
  isDeleting: boolean
  error: string | null
  clearError: () => void
}

/**
 * Hook para manejar uploads de imágenes a Cloudinary
 */
export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File, options?: UploadOptions): Promise<UploadResult> => {
    setIsUploading(true)
    setError(null)

    try {
      const result = await uploadImage(file, options)
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Error al subir la imagen'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const remove = async (publicId: string): Promise<void> => {
    setIsDeleting(true)
    setError(null)

    try {
      await deleteImage(publicId)
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar la imagen'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    upload,
    remove,
    isUploading,
    isDeleting,
    error,
    clearError,
  }
}
