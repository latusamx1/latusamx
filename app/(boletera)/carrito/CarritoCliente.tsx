'use client'

import { useCartStore } from '@/lib/stores/cartStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function CarritoCliente() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, getSubtotal, getDescuento, getTotal, descuentoAplicado, aplicarDescuento, removerDescuento } = useCartStore()
  const [codigoInput, setCodigoInput] = useState('')
  const [validandoCodigo, setValidandoCodigo] = useState(false)

  const handleValidarCodigo = async () => {
    if (!codigoInput.trim()) {
      toast.error('Ingresa un código de descuento')
      return
    }

    setValidandoCodigo(true)

    // Simulación de validación (aquí deberías llamar a tu servicio real)
    setTimeout(() => {
      // Códigos de prueba
      const codigosValidos: Record<string, { tipo: 'porcentaje' | 'monto', valor: number }> = {
        'BIENVENIDO10': { tipo: 'porcentaje', valor: 10 },
        'DESCUENTO50': { tipo: 'monto', valor: 50 },
        'VIP20': { tipo: 'porcentaje', valor: 20 },
      }

      const codigo = codigoInput.toUpperCase()
      const descuento = codigosValidos[codigo]

      if (descuento) {
        aplicarDescuento(codigo, descuento.tipo, descuento.valor)
        toast.success('Código de descuento aplicado')
        setCodigoInput('')
      } else {
        toast.error('Código de descuento inválido')
      }

      setValidandoCodigo(false)
    }, 1000)
  }

  const handleRemoverDescuento = () => {
    removerDescuento()
    toast.success('Descuento removido')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-8">
            Explora nuestros eventos y encuentra el perfecto para ti
          </p>
          <Button asChild size="lg">
            <Link href="/eventos">
              Ver Eventos
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const descuento = getDescuento()
  const total = getTotal()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/eventos">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Seguir comprando
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Carrito de Compras</h1>
        <p className="text-muted-foreground">
          {items.length} {items.length === 1 ? 'ticket' : 'tickets'} en tu carrito
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.eventoId}-${item.tipoTicketId}`}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Imagen */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    {item.eventoImagen ? (
                      <Image
                        src={item.eventoImagen}
                        alt={item.eventoTitulo}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Detalles */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {item.eventoTitulo}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.eventoFecha && format(new Date(item.eventoFecha.seconds * 1000), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                    </p>
                    <Badge variant="secondary" className="mb-3">
                      {item.tipoTicketNombre}
                    </Badge>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.eventoId, item.tipoTicketId, item.cantidad - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.cantidad}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.eventoId, item.tipoTicketId, item.cantidad + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Precio */}
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {formatPrice(item.precio)} x {item.cantidad}
                        </div>
                        <div className="text-lg font-bold">
                          {formatPrice(item.precio * item.cantidad)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón eliminar */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => {
                      removeItem(item.eventoId, item.tipoTicketId)
                      toast.success('Ticket eliminado del carrito')
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumen de Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Código de descuento */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Código de descuento
                </label>
                {descuentoAplicado ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {descuentoAplicado.codigo}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoverDescuento}
                      className="text-green-600 hover:text-green-700 dark:text-green-400"
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código"
                      value={codigoInput}
                      onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleValidarCodigo()
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={handleValidarCodigo}
                      disabled={validandoCodigo}
                    >
                      {validandoCodigo ? 'Validando...' : 'Aplicar'}
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Totales */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Descuento</span>
                    <span>-{formatPrice(descuento)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => router.push('/checkout')}
              >
                Continuar al Pago
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Info adicional */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Compra segura</p>
                <p>✓ Tickets digitales instantáneos</p>
                <p>✓ Soporte 24/7</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
