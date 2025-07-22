import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Patient } from '@/types/patient'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  Input,
  Select,
  Textarea,
} from '@/components/ui'

// Tipos locales para el componente
interface InvoiceItem {
  serviceId: string
  quantity: number
  unitPrice?: number
  discount: number
  notes: string
}

interface Discount {
  type: 'PERCENTAGE' | 'FIXED'
  value: number
  reason: string
}

interface InvoiceFormData {
  patientId: string
  doctorId: string
  appointmentId?: string
  dueDate: string
  items: InvoiceItem[]
  notes: string
  terms: string
  applyInsurance: boolean
  insuranceInfo?: any
  discounts: Discount[]
  isRecurring: boolean
  recurringConfig?: any
}

interface MedicalService {
  id: string
  name: string
  category: string
  basePrice: number
  duration: number
}

interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
}

// Constantes locales
const DISCOUNT_TYPES = [
  { value: 'PERCENTAGE', label: 'Porcentaje (%)' },
  { value: 'FIXED', label: 'Cantidad Fija' },
]

// Funciones utilitarias
const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `INV-${timestamp}-${random}`
}

const calculateItemTotal = (quantity: number, unitPrice: number, discount: number) => {
  const subtotal = quantity * unitPrice
  return subtotal - discount
}

const calculateDiscountAmount = (subtotal: number, type: string, value: number) => {
  if (type === 'PERCENTAGE') {
    return (subtotal * value) / 100
  }
  return value
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

interface InvoiceFormProps {
  initialData?: Partial<InvoiceFormData>
  onSubmit?: (data: InvoiceFormData) => Promise<void>
  onCancel?: () => void
  patients?: Patient[]
  doctors?: Doctor[]
  services?: MedicalService[]
}

export function InvoiceForm({
  initialData,
  onSubmit,
  onCancel,
  patients = [],
  doctors = [],
  services = [],
}: InvoiceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<InvoiceFormData>({
    patientId: initialData?.patientId || '',
    doctorId: initialData?.doctorId || '',
    appointmentId: initialData?.appointmentId || '',
    dueDate:
      initialData?.dueDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    items: initialData?.items || [],
    notes: initialData?.notes || '',
    terms: initialData?.terms || 'Pago a 30 días desde la fecha de facturación.',
    applyInsurance: initialData?.applyInsurance || false,
    insuranceInfo: initialData?.insuranceInfo,
    discounts: initialData?.discounts || [],
    isRecurring: initialData?.isRecurring || false,
    recurringConfig: initialData?.recurringConfig,
  })

  // Calcular totales
  const [totals, setTotals] = useState({
    subtotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    total: 0,
  })

  useEffect(() => {
    calculateTotals()
  }, [formData.items, formData.discounts])

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      const service = services.find((s) => s.id === item.serviceId)
      return (
        sum +
        calculateItemTotal(item.quantity, item.unitPrice || service?.basePrice || 0, item.discount)
      )
    }, 0)

    const totalDiscount = formData.discounts.reduce((sum, discount) => {
      return sum + calculateDiscountAmount(subtotal, discount.type, discount.value)
    }, 0)

    // Impuesto simplificado del 12%
    const totalTax = (subtotal - totalDiscount) * 0.12
    const total = subtotal - totalDiscount + totalTax

    setTotals({
      subtotal,
      totalDiscount,
      totalTax,
      total,
    })
  }

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value =
        e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value

      if (field.includes('.')) {
        const [parent, child] = field.split('.') as [string, string]
        setFormData((prev) => ({
          ...prev,
          [parent as string]: {
            ...(prev as any)[parent as string],
            [child as string]: value,
          },
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }))
      }

      // Limpiar error del campo cuando se modifica
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          serviceId: '',
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          notes: '',
        },
      ],
    }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const updateItem = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value }

          // Actualizar precio automáticamente si se selecciona un servicio
          if (field === 'serviceId') {
            const service = services.find((s) => s.id === value)
            if (service) {
              updatedItem.unitPrice = service.basePrice
            }
          }

          return updatedItem
        }
        return item
      }),
    }))
  }

  const addDiscount = () => {
    setFormData((prev) => ({
      ...prev,
      discounts: [
        ...prev.discounts,
        {
          type: 'PERCENTAGE',
          value: 0,
          reason: '',
        },
      ],
    }))
  }

  const removeDiscount = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index),
    }))
  }

  const updateDiscount = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      discounts: prev.discounts.map((discount, i) =>
        i === index ? { ...discount, [field]: value } : discount
      ),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) {
      newErrors.patientId = 'Seleccione un paciente'
    }
    if (!formData.doctorId) {
      newErrors.doctorId = 'Seleccione un doctor'
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Fecha de vencimiento es requerida'
    }
    if (formData.items.length === 0) {
      newErrors.items = 'Agregue al menos un servicio'
    }

    // Validar items
    formData.items.forEach((item, index) => {
      if (!item.serviceId) {
        newErrors[`item_${index}_service`] = 'Seleccione un servicio'
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Cantidad debe ser mayor a 0'
      }
      if ((item.unitPrice || 0) <= 0) {
        newErrors[`item_${index}_price`] = 'Precio debe ser mayor a 0'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Simulación de creación
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log('Factura creada:', {
          ...formData,
          invoiceNumber: generateInvoiceNumber(),
          totals,
        })
        router.push('/billing/invoices')
      }
    } catch (error) {
      console.error('Error al crear factura:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  // Opciones para los selects
  const patientOptions = patients.map((patient) => ({
    value: patient.id,
    label: `${patient.firstName} ${patient.lastName}`,
  }))

  const doctorOptions = doctors.map((doctor) => ({
    value: doctor.id,
    label: `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialty}`,
  }))

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: `${service.name} - ${formatCurrency(service.basePrice)}`,
  }))

  const selectedPatient = patients.find((p) => p.id === formData.patientId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Nueva Factura Médica</h2>
              <p className="text-sm text-gray-500">
                Crea una nueva factura para servicios médicos prestados
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Paciente"
                value={formData.patientId}
                onChange={handleChange('patientId')}
                options={[{ value: '', label: 'Seleccionar paciente' }, ...patientOptions]}
                error={errors.patientId}
                required
              />
              <Select
                label="Doctor"
                value={formData.doctorId}
                onChange={handleChange('doctorId')}
                options={[{ value: '', label: 'Seleccionar doctor' }, ...doctorOptions]}
                error={errors.doctorId}
                required
              />
              <Input
                label="Fecha de Vencimiento"
                type="date"
                value={formData.dueDate}
                onChange={handleChange('dueDate')}
                error={errors.dueDate}
                required
              />
            </div>

            {/* Información del paciente seleccionado */}
            {selectedPatient && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Información del Paciente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <strong>Email:</strong> {selectedPatient.email}
                  </div>
                  <div>
                    <strong>Teléfono:</strong> {selectedPatient.phone}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Servicios */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                Servicios y Procedimientos
              </h3>
              <Button type="button" variant="outline" onClick={addItem}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar Servicio
              </Button>
            </div>

            {errors.items && <p className="text-sm text-red-600 mb-4">{errors.items}</p>}

            <div className="space-y-4">
              {formData.items.map((item, index) => {
                const service = services.find((s) => s.id === item.serviceId)
                const itemTotal = calculateItemTotal(
                  item.quantity,
                  item.unitPrice || service?.basePrice || 0,
                  item.discount
                )

                return (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                      <div className="md:col-span-2">
                        <Select
                          label="Servicio"
                          value={item.serviceId}
                          onChange={(e) => updateItem(index, 'serviceId', e.target.value)}
                          options={[
                            { value: '', label: 'Seleccionar servicio' },
                            ...serviceOptions,
                          ]}
                          error={errors[`item_${index}_service`]}
                          required
                        />
                        {service && (
                          <p className="text-sm text-gray-500 mt-1">
                            Categoría: {service.category} | Duración: {service.duration} min
                          </p>
                        )}
                      </div>

                      <Input
                        label="Cantidad"
                        type="number"
                        value={item.quantity.toString()}
                        onChange={(e) =>
                          updateItem(index, 'quantity', parseInt(e.target.value) || 1)
                        }
                        min="1"
                        error={errors[`item_${index}_quantity`]}
                        required
                      />

                      <Input
                        label="Precio Unitario"
                        type="number"
                        value={(item.unitPrice || service?.basePrice || 0).toString()}
                        onChange={(e) =>
                          updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        step="0.01"
                        error={errors[`item_${index}_price`]}
                        required
                      />

                      <Input
                        label="Descuento"
                        type="number"
                        value={item.discount.toString()}
                        onChange={(e) =>
                          updateItem(index, 'discount', parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        step="0.01"
                      />

                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <label className="block text-sm font-medium text-gray-700">Total</label>
                          <div className="text-lg font-semibold text-gray-900">
                            {formatCurrency(itemTotal)}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Textarea
                        label="Notas del Servicio"
                        value={item.notes}
                        onChange={(e) => updateItem(index, 'notes', e.target.value)}
                        placeholder="Notas adicionales sobre este servicio..."
                        rows={2}
                      />
                    </div>
                  </Card>
                )
              })}
            </div>

            {formData.items.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay servicios</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Agrega servicios médicos para incluir en la factura.
                </p>
                <div className="mt-6">
                  <Button type="button" onClick={addItem}>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Agregar Primer Servicio
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Descuentos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Descuentos
              </h3>
              <Button type="button" variant="outline" onClick={addDiscount}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar Descuento
              </Button>
            </div>

            {formData.discounts.map((discount, index) => (
              <Card key={index} className="p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <Select
                    label="Tipo de Descuento"
                    value={discount.type}
                    onChange={(e) => updateDiscount(index, 'type', e.target.value)}
                    options={DISCOUNT_TYPES.map((type) => ({
                      value: type.value,
                      label: type.label,
                    }))}
                    required
                  />

                  <Input
                    label={discount.type === 'PERCENTAGE' ? 'Porcentaje (%)' : 'Cantidad'}
                    type="number"
                    value={discount.value.toString()}
                    onChange={(e) =>
                      updateDiscount(index, 'value', parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    step={discount.type === 'PERCENTAGE' ? '1' : '0.01'}
                    max={discount.type === 'PERCENTAGE' ? '100' : undefined}
                    required
                  />

                  <Input
                    label="Motivo"
                    value={discount.reason}
                    onChange={(e) => updateDiscount(index, 'reason', e.target.value)}
                    placeholder="Motivo del descuento"
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <label className="block text-sm font-medium text-gray-700">Descuento</label>
                      <div className="text-lg font-semibold text-green-600">
                        -
                        {formatCurrency(
                          calculateDiscountAmount(totals.subtotal, discount.type, discount.value)
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDiscount(index)}
                      className="text-red-600 hover:text-red-700 ml-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Totales */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Facturación</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Descuentos:</span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(totals.totalDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impuestos (12%):</span>
                  <span className="font-medium">{formatCurrency(totals.totalTax)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-green-600">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notas y términos */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.586a1 1 0 00-.707.293z"
                />
              </svg>
              Notas y Términos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Notas Adicionales"
                value={formData.notes}
                onChange={handleChange('notes')}
                placeholder="Notas adicionales para el paciente..."
                rows={4}
              />
              <Textarea
                label="Términos y Condiciones"
                value={formData.terms}
                onChange={handleChange('terms')}
                placeholder="Términos de pago y condiciones..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex justify-end space-x-4 w-full">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading ? 'Creando...' : 'Crear Factura'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
