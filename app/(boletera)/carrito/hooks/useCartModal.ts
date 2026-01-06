'use client'

import { useState } from 'react'

type ActionType = 'add' | 'remove' | 'update' | 'clear' | 'error'

interface UseCartModalReturn {
  isOpen: boolean
  action: ActionType
  itemName: string
  openModal: (action: ActionType, itemName?: string) => void
  closeModal: () => void
  setConfirmCallback: (callback: () => void) => void
  confirmCallback: (() => void) | null
}

export function useCartModal(): UseCartModalReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<ActionType>('add')
  const [itemName, setItemName] = useState('')
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null)

  const openModal = (newAction: ActionType, name: string = '') => {
    setAction(newAction)
    setItemName(name)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setConfirmCallback(null)
  }

  const setConfirm = (callback: () => void) => {
    setConfirmCallback(() => callback)
  }

  return {
    isOpen,
    action,
    itemName,
    openModal,
    closeModal,
    setConfirmCallback: setConfirm,
    confirmCallback,
  }
}
