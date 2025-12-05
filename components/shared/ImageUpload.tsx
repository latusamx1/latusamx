'use client'

import { useState, useRef, ChangeEvent } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadImage, deleteImage, validateFile } from '@/lib/cloudinary/upload'
import type { UploadOptions } from '@/lib/cloudinary/upload'

interface ImageUploadProps {
  value?: string // URL de la imagen actual
  onChange: (url: string, publicId: string) => void
  onRemove?: () => void
  folder?: UploadOptions['folder']
  className?: string
  preview?: {
    width?: number
    height?: number
    aspectRatio?: string
  }
  disabled?: boolean
  placeholder?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder,
  className = '',
  preview = { width: 300, height: 200, aspectRatio: '3/2' },
  disabled = false,
  placeholder = 'Haz clic o arrastra una imagen aquí',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setError(null)

    // Validar archivo
    const validation = validateFile(file)
    if (!validation.valid) {
      setError(validation.error!)
      return
    }

    setIsUploading(true)

    try {
      // Subir imagen
      const result = await uploadImage(file, { folder })
      onChange(result.secureUrl, result.publicId)
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = async () => {
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Preview o Upload Area */}
      <div
        className={`
          relative rounded-lg border-2 border-dashed overflow-hidden
          transition-all duration-200
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}
        `}
        style={{
          aspectRatio: preview.aspectRatio,
          width: preview.width ? `${preview.width}px` : '100%',
          maxHeight: preview.height ? `${preview.height}px` : 'auto',
        }}
        onClick={() => !disabled && !value && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          // Loading state
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-gray-600">Subiendo imagen...</p>
            </div>
          </div>
        ) : value ? (
          // Preview de imagen
          <div className="relative w-full h-full group">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove()
                  }}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          // Empty state
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4">
            <Upload className="h-12 w-12 mb-3" />
            <p className="text-sm text-center">{placeholder}</p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG o WebP (máx. 10MB)</p>
          </div>
        )}
      </div>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}
    </div>
  )
}
