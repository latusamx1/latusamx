'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle, ShoppingCart, Trash2 } from 'lucide-react'

type ActionType = 'add' | 'remove' | 'update' | 'clear' | 'error'

interface CartActionsModalProps {
  isOpen: boolean
  onClose: () => void
  action: ActionType
  itemName?: string
  onConfirm?: () => void
}

const actionConfig = {
  add: {
    icon: CheckCircle2,
    iconColor: 'text-green-600',
    title: 'Agregado al carrito',
    description: 'El ticket se agregó correctamente a tu carrito',
  },
  remove: {
    icon: Trash2,
    iconColor: 'text-red-600',
    title: '¿Eliminar del carrito?',
    description: '¿Estás seguro de que quieres eliminar este ticket del carrito?',
  },
  update: {
    icon: ShoppingCart,
    iconColor: 'text-blue-600',
    title: 'Cantidad actualizada',
    description: 'La cantidad de tickets se actualizó correctamente',
  },
  clear: {
    icon: AlertCircle,
    iconColor: 'text-orange-600',
    title: '¿Vaciar carrito?',
    description: '¿Estás seguro de que quieres eliminar todos los tickets del carrito?',
  },
  error: {
    icon: XCircle,
    iconColor: 'text-red-600',
    title: 'Error',
    description: 'Ocurrió un error al procesar tu solicitud',
  },
}

export default function CartActionsModal({
  isOpen,
  onClose,
  action,
  itemName,
  onConfirm,
}: CartActionsModalProps) {
  const config = actionConfig[action]
  const Icon = config.icon
  const needsConfirmation = action === 'remove' || action === 'clear'

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center ${config.iconColor}`}>
              <Icon className="w-8 h-8" />
            </div>
          </div>
          <DialogTitle className="text-center">{config.title}</DialogTitle>
          <DialogDescription className="text-center">
            {itemName && action !== 'clear' ? (
              <>
                {config.description}
                <span className="block font-medium text-gray-900 mt-2">{itemName}</span>
              </>
            ) : (
              config.description
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center gap-2">
          {needsConfirmation ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                variant={action === 'remove' || action === 'clear' ? 'destructive' : 'default'}
                onClick={handleConfirm}
              >
                {action === 'remove' && 'Eliminar'}
                {action === 'clear' && 'Vaciar carrito'}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} className="w-full sm:w-auto">
              Continuar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
