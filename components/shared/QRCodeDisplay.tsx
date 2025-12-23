/**
 * Componente para mostrar códigos QR
 */

'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface QRCodeDisplayProps {
  value: string
  title?: string
  description?: string
  size?: number
  logo?: string
  showDownload?: boolean
  showCopy?: boolean
  status?: 'active' | 'used' | 'expired'
}

const STATUS_CONFIG = {
  active: {
    label: 'Activo',
    color: 'bg-green-500',
  },
  used: {
    label: 'Usado',
    color: 'bg-gray-500',
  },
  expired: {
    label: 'Expirado',
    color: 'bg-red-500',
  },
}

export function QRCodeDisplay({
  value,
  title = 'Código QR',
  description,
  size = 256,
  logo,
  showDownload = true,
  showCopy = true,
  status,
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    canvas.width = size
    canvas.height = size

    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')

      const downloadLink = document.createElement('a')
      downloadLink.download = `qr-code-${Date.now()}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {status && (
            <Badge className={STATUS_CONFIG[status].color}>{STATUS_CONFIG[status].label}</Badge>
          )}
        </div>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
            <QRCodeSVG
              id="qr-code-svg"
              value={value}
              size={size}
              level="H"
              includeMargin={true}
              imageSettings={
                logo
                  ? {
                      src: logo,
                      x: undefined,
                      y: undefined,
                      height: size * 0.2,
                      width: size * 0.2,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </div>
        </div>

        {/* Código en texto */}
        <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
          <code className="text-sm font-mono text-gray-700 break-all">{value}</code>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          {showCopy && (
            <Button variant="outline" onClick={handleCopy} className="flex-1" disabled={copied}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar código
                </>
              )}
            </Button>
          )}
          {showDownload && (
            <Button variant="outline" onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
