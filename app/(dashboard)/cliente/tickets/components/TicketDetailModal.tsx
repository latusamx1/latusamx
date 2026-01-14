'use client'

import { Ticket, Evento } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { QRCodeSVG } from 'qrcode.react'
import { Calendar, MapPin, Clock, Download, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface TicketDetailModalProps {
  ticket: Ticket | null
  evento: Evento | null
  isOpen: boolean
  onClose: () => void
}

export function TicketDetailModal({ ticket, evento, isOpen, onClose }: TicketDetailModalProps) {
  if (!ticket || !evento) return null

  const fechaEvento = evento.fecha?.toDate ? evento.fecha.toDate() : new Date(evento.fecha)

  const handleDownloadQR = () => {
    const svg = document.getElementById('ticket-qr-code')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    canvas.width = 512
    canvas.height = 512

    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')

      const downloadLink = document.createElement('a')
      downloadLink.download = `ticket-${ticket.id}.png`
      downloadLink.href = pngFile
      downloadLink.click()

      toast.success('QR descargado exitosamente')
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: evento.titulo,
          text: `Mi ticket para ${evento.titulo}`,
        })
      } catch (error) {
        // Usuario canceló
      }
    } else {
      await navigator.clipboard.writeText(ticket.qrCode)
      toast.success('Código copiado al portapapeles')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">{evento.titulo}</DialogTitle>
          <DialogDescription>{ticket.tipoTicket}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="rounded-lg border-4 border-blue-600 bg-white p-4">
              <QRCodeSVG
                id="ticket-qr-code"
                value={ticket.qrCode}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          {/* Código */}
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Código del Ticket</p>
            <code className="text-sm font-mono text-gray-900 break-all">{ticket.id}</code>
          </div>

          {/* Estado */}
          <div className="flex justify-center">
            {ticket.usado ? (
              <Badge className="bg-gray-500 text-white">
                <span className="mr-1">✓</span>
                Ticket Usado
              </Badge>
            ) : (
              <Badge className="bg-green-500 text-white">
                <span className="mr-1">✓</span>
                Ticket Válido
              </Badge>
            )}
          </div>

          {/* Detalles del evento */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fecha</p>
                <p className="text-sm text-gray-600">
                  {format(fechaEvento, "EEEE, dd 'de' MMMM yyyy", { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Hora</p>
                <p className="text-sm text-gray-600">{evento.horaInicio}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Lugar</p>
                <p className="text-sm text-gray-600">{evento.venue?.nombre}</p>
                <p className="text-xs text-gray-500">{evento.venue?.direccion}</p>
              </div>
            </div>
          </div>

          {/* Precio */}
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-gray-600">Precio pagado</p>
            <p className="text-2xl font-bold text-blue-600">
              ${ticket.precio.toFixed(2)} <span className="text-sm font-normal">MXN</span>
            </p>
          </div>

          {/* Acciones */}
          {!ticket.usado && (
            <div className="flex gap-2">
              <Button onClick={handleDownloadQR} className="flex-1" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Descargar QR
              </Button>
              <Button onClick={handleShare} className="flex-1" variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
            </div>
          )}

          {/* Advertencia */}
          {!ticket.usado && (
            <div className="rounded-lg bg-yellow-50 p-3 text-center">
              <p className="text-xs text-yellow-800">
                ⚠️ Presenta este código QR en la entrada del evento. No lo compartas con nadie.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
