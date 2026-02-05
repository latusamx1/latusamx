'use client'

import { useState, useEffect, useMemo } from 'react'
import { RequireAdmin } from '@/components/auth/RequireRole'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import StatsCard from '@/components/dashboard/StatsCard'
import DescuentoForm from '@/components/admin/descuentos/DescuentoForm'
import DescuentoCard from '@/components/admin/descuentos/DescuentoCard'
import { type DescuentoFormData } from '@/lib/validations/descuento.schema'
import { type EstadoCodigo } from '@/lib/services/descuentos.service'
import {
  Tag,
  TrendingUp,
  DollarSign,
  Percent,
  Plus,
  ArrowLeft,
} from 'lucide-react'
import { db } from '@/lib/firebase/config'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { CodigoDescuento } from '@/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'

type FiltroEstado = 'todos' | 'activo' | 'programado' | 'expirado'

interface CodigoWithStats extends CodigoDescuento {
  estado: EstadoCodigo
  ahorroTotal: number
}

export default function DescuentosAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Estados
  const [codigos, setCodigos] = useState<CodigoDescuento[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<FiltroEstado>('todos')

  // Modal states
  const [formOpen, setFormOpen] = useState(false)
  const [selectedCodigo, setSelectedCodigo] = useState<CodigoDescuento | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [codigoToDelete, setCodigoToDelete] = useState<CodigoDescuento | null>(null)

  // Listener en tiempo real para códigos de descuento
  useEffect(() => {
    if (!db) return

    const codigosRef = collection(db, 'codigosDescuento')
    const q = query(codigosRef, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const codigosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CodigoDescuento[]
        setCodigos(codigosData)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching codigos:', error)
        toast.error('Error al cargar códigos de descuento')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Calcular estado de cada código
  const codigosConStats: CodigoWithStats[] = useMemo(() => {
    const now = new Date()

    return codigos.map((codigo) => {
      const fechaInicio = codigo.fechaInicio instanceof Date
        ? codigo.fechaInicio
        : (codigo.fechaInicio as any)?.toDate?.() || new Date(codigo.fechaInicio)
      const fechaFin = codigo.fechaFin instanceof Date
        ? codigo.fechaFin
        : (codigo.fechaFin as any)?.toDate?.() || new Date(codigo.fechaFin)

      let estado: EstadoCodigo = 'activo'

      if (!codigo.activo) {
        estado = 'expirado'
      } else if (codigo.usosMaximos && codigo.usos >= codigo.usosMaximos) {
        estado = 'agotado'
      } else if (fechaFin < now) {
        estado = 'expirado'
      } else if (fechaInicio > now) {
        estado = 'programado'
      }

      const ahorroTotal = codigo.tipo === 'monto'
        ? codigo.usos * codigo.valor
        : codigo.usos * (codigo.valor * 10)

      return { ...codigo, estado, ahorroTotal }
    })
  }, [codigos])

  // Filtrar códigos
  const codigosFiltrados = useMemo(() => {
    if (filtro === 'todos') return codigosConStats
    if (filtro === 'expirado') {
      return codigosConStats.filter((c) => c.estado === 'expirado' || c.estado === 'agotado')
    }
    return codigosConStats.filter((c) => c.estado === filtro)
  }, [codigosConStats, filtro])

  // Calcular estadísticas
  const stats = useMemo(() => {
    const codigosActivos = codigosConStats.filter((c) => c.estado === 'activo').length
    const usosTotal = codigosConStats.reduce((sum, c) => sum + c.usos, 0)
    const descuentoTotal = codigosConStats.reduce((sum, c) => sum + c.ahorroTotal, 0)
    const tasaConversion = codigosActivos > 0
      ? Math.round((usosTotal / (codigosActivos * 100)) * 100)
      : 0

    return { codigosActivos, usosTotal, descuentoTotal, tasaConversion }
  }, [codigosConStats])

  // Handlers
  const handleOpenCreate = () => {
    setSelectedCodigo(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (codigo: CodigoDescuento) => {
    setSelectedCodigo(codigo)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedCodigo(null)
  }

  const handleSubmit = async (data: DescuentoFormData) => {
    if (!db) return

    setIsSubmitting(true)

    try {
      if (selectedCodigo) {
        // Actualizar
        await updateDoc(doc(db, 'codigosDescuento', selectedCodigo.id), {
          descripcion: data.descripcion,
          tipo: data.tipo,
          valor: data.valor,
          usosMaximos: data.usosMaximos,
          fechaInicio: Timestamp.fromDate(data.fechaInicio),
          fechaFin: Timestamp.fromDate(data.fechaFin),
          activo: data.activo,
          eventosAplicables: data.eventosAplicables || [],
          updatedAt: Timestamp.now(),
        })
        toast.success('Código actualizado correctamente')
      } else {
        // Verificar que el código no exista
        const codigoExistente = codigos.find(
          (c) => c.codigo.toUpperCase() === data.codigo.toUpperCase()
        )
        if (codigoExistente) {
          toast.error('Ya existe un código con ese nombre')
          setIsSubmitting(false)
          return
        }

        // Crear
        await addDoc(collection(db, 'codigosDescuento'), {
          codigo: data.codigo.toUpperCase(),
          descripcion: data.descripcion,
          tipo: data.tipo,
          valor: data.valor,
          usos: 0,
          usosMaximos: data.usosMaximos,
          fechaInicio: Timestamp.fromDate(data.fechaInicio),
          fechaFin: Timestamp.fromDate(data.fechaFin),
          activo: data.activo,
          eventosAplicables: data.eventosAplicables || [],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        })
        toast.success('Código creado correctamente')
      }

      handleCloseForm()
    } catch (error) {
      console.error('Error saving codigo:', error)
      toast.error('Error al guardar el código')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (codigo: CodigoDescuento) => {
    setCodigoToDelete(codigo)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!db || !codigoToDelete) return

    try {
      await deleteDoc(doc(db, 'codigosDescuento', codigoToDelete.id))
      toast.success('Código eliminado correctamente')
    } catch (error) {
      console.error('Error deleting codigo:', error)
      toast.error('Error al eliminar el código')
    } finally {
      setDeleteDialogOpen(false)
      setCodigoToDelete(null)
    }
  }

  const filtros: { key: FiltroEstado; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'activo', label: 'Activos' },
    { key: 'programado', label: 'Programados' },
    { key: 'expirado', label: 'Expirados' },
  ]

  return (
    <RequireAdmin>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <Link
                href="/admin"
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Códigos de Descuento</h1>
                <p className="text-sm text-gray-500">Gestiona cupones y promociones</p>
              </div>
            </div>

            <Button onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Código
            </Button>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="Códigos Activos"
                value={loading ? '...' : stats.codigosActivos}
                icon={Tag}
                iconColor="blue"
              />
              <StatsCard
                title="Usos Totales"
                value={loading ? '...' : stats.usosTotal.toLocaleString('es-MX')}
                icon={TrendingUp}
                iconColor="green"
              />
              <StatsCard
                title="Descuento Total"
                value={loading ? '...' : `$${stats.descuentoTotal.toLocaleString('es-MX')}`}
                icon={DollarSign}
                iconColor="purple"
              />
              <StatsCard
                title="Tasa de Conversión"
                value={loading ? '...' : `${stats.tasaConversion}%`}
                icon={Percent}
                iconColor="amber"
              />
            </div>

            {/* Códigos List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Filtros */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex gap-2 flex-wrap">
                  {filtros.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFiltro(f.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filtro === f.key
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Cargando códigos...</p>
                </div>
              ) : codigosFiltrados.length === 0 ? (
                <div className="p-8 text-center">
                  <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">
                    {filtro !== 'todos'
                      ? 'No hay códigos con ese estado'
                      : 'No hay códigos de descuento'}
                  </p>
                  {filtro === 'todos' && (
                    <Button onClick={handleOpenCreate}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear primer código
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {codigosFiltrados.map((codigo) => (
                    <DescuentoCard
                      key={codigo.id}
                      descuento={codigo}
                      onEdit={handleOpenEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Descuento Form Modal */}
      <DescuentoForm
        descuento={selectedCodigo}
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar código?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el código{' '}
              <strong>{codigoToDelete?.codigo}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RequireAdmin>
  )
}
