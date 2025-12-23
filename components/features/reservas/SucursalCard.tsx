/**
 * Tarjeta de sucursal para catálogo de reservas
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Users, Phone } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface SucursalCardProps {
  id: string
  nombre: string
  direccion: string
  telefono: string
  imagen?: string
  capacidad: number
  horarios: {
    apertura: string
    cierre: string
  }
  abierto: boolean
}

export function SucursalCard({
  id,
  nombre,
  direccion,
  telefono,
  imagen,
  capacidad,
  horarios,
  abierto,
}: SucursalCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-red-600 to-red-700">
        {imagen ? (
          <Image src={imagen} alt={nombre} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <MapPin className="w-16 h-16 text-white/50" />
          </div>
        )}
        {/* Badge de estado */}
        <div className="absolute top-3 right-3">
          <Badge className={abierto ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}>
            {abierto ? 'Abierto' : 'Cerrado'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Nombre */}
        <h3 className="font-bold text-lg text-gray-900 mb-3">{nombre}</h3>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{direccion}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-red-600" />
            <span>{telefono}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-red-600" />
            <span>
              {horarios.apertura} - {horarios.cierre}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-red-600" />
            <span>Capacidad: {capacidad} personas</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/reservas/${id}`} className="w-full">
          <Button className="w-full" disabled={!abierto}>
            {abierto ? 'Reservar Mesa' : 'No Disponible'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
