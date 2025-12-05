import { NextRequest, NextResponse } from 'next/server'
import { uploadImageServer, deleteImageServer } from '@/lib/cloudinary/server'

/**
 * POST /api/upload
 * Subir imagen a Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { file, folder, transformation, publicId, overwrite, tags } = body

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 })
    }

    // Subir a Cloudinary
    const result = await uploadImageServer(file, {
      folder,
      transformation,
      publicId,
      overwrite,
      tags,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('Error en API upload:', error)
    return NextResponse.json(
      { error: error.message || 'Error al subir la imagen' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/upload
 * Eliminar imagen de Cloudinary
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { publicId } = body

    if (!publicId) {
      return NextResponse.json(
        { error: 'Se requiere el publicId de la imagen' },
        { status: 400 }
      )
    }

    await deleteImageServer(publicId)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error en API delete:', error)
    return NextResponse.json(
      { error: error.message || 'Error al eliminar la imagen' },
      { status: 500 }
    )
  }
}
