'use client'

import { Button } from '@/components/ui/button'
import { Download, Share2, Calendar } from 'lucide-react'
import { Evento } from '@/types'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface ActionButtonsProps {
  ordenId: string
  evento: Evento
}

export function ActionButtons({ ordenId, evento }: ActionButtonsProps) {
  const descargarPDF = async () => {
    toast.info('Preparando descarga...')
    // Aquí implementarías la lógica de generación de PDF
    // Por ahora simulamos la descarga
    setTimeout(() => {
      toast.success('¡PDF descargado exitosamente!')
    }, 1000)
  }

  const agregarAlCalendario = () => {
    const eventoFecha = evento.fecha?.toDate ? evento.fecha.toDate() : new Date(evento.fecha)
    const fechaInicio = format(eventoFecha, "yyyyMMdd'T'HHmmss")

    // Crear archivo .ics
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${fechaInicio}
SUMMARY:${evento.titulo}
DESCRIPTION:${evento.descripcion || ''}
LOCATION:${evento.venue?.nombre || ''} - ${evento.venue?.direccion || ''}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${evento.titulo.replace(/\s+/g, '-')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('¡Evento agregado al calendario!')
  }

  const compartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '¡Acabo de comprar mis tickets!',
          text: `Tickets para ${evento.titulo}`,
          url: window.location.href,
        })
        toast.success('Compartido exitosamente')
      } catch (error) {
        // Usuario canceló
      }
    } else {
      // Copiar enlace
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Enlace copiado al portapapeles')
    }
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Button onClick={descargarPDF} className="h-12">
        <Download className="mr-2 h-5 w-5" />
        Descargar PDF
      </Button>

      <Button onClick={compartir} variant="outline" className="h-12">
        <Share2 className="mr-2 h-5 w-5" />
        Compartir
      </Button>

      <Button onClick={agregarAlCalendario} variant="outline" className="h-12">
        <Calendar className="mr-2 h-5 w-5" />
        Agregar al Calendario
      </Button>
    </div>
  )
}
