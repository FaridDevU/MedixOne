import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { LabOrder, CreateLabOrderData } from '@/types/laboratory'
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

interface LabTest {
  id: string
  name: string
  code: string
  category: string
  description?: string
  price: number
  estimatedTime: number
  normalRange?: string
  preparationInstructions?: string
  isActive: boolean
}

interface LabOrderFormData {
  patientId: string
  doctorId: string
  tests: string[]
  notes?: string
  dueDate?: Date
}

interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty?: string
}

interface LabOrderFormProps {
  initialData?: Partial<LabOrderFormData>
  isEditing?: boolean
  onSubmit?: (data: LabOrderFormData) => Promise<void>
  onCancel?: () => void
  patients?: Patient[]
  doctors?: Doctor[]
  availableTests?: LabTest[]
}

export function LabOrderForm({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  patients = [],
  doctors = [],
  availableTests = [],
}: LabOrderFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTest, setSearchTest] = useState('')

  const [formData, setFormData] = useState<LabOrderFormData>({
    patientId: initialData?.patientId || '',
    doctorId: initialData?.doctorId || '',
    tests: initialData?.tests || [],
    notes: initialData?.notes || '',
    dueDate: initialData?.dueDate,
  })

  // Categorías y prioridades disponibles
  const LAB_CATEGORIES = [
    { value: 'BLOOD', label: 'Sangre', icon: '🩸' },
    { value: 'URINE', label: 'Orina', icon: '💧' },
    { value: 'BIOCHEMISTRY', label: 'Bioquímica', icon: '🧪' },
    { value: 'MICROBIOLOGY', label: 'Microbiología', icon: '🦠' },
  ]

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `LAB-${timestamp}-${random}`
  }

  // Filtrar tests por categoría y búsqueda
  const filteredTests = availableTests.filter((test) => {
    const matchesCategory = !selectedCategory || test.category === selectedCategory
    const matchesSearch =
      !searchTest ||
      test.name.toLowerCase().includes(searchTest.toLowerCase()) ||
      test.code.toLowerCase().includes(searchTest.toLowerCase())
    return matchesCategory && matchesSearch && test.isActive
  })

  const selectedTests = availableTests.filter((test) => formData.tests.includes(test.id))

  const handleChange =
    (field: keyof LabOrderFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))

      // Limpiar error del campo cuando se modifica
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }

  const handleTestToggle = (testId: string) => {
    setFormData((prev) => ({
      ...prev,
      tests: prev.tests.includes(testId)
        ? prev.tests.filter((id: string) => id !== testId)
        : [...prev.tests, testId],
    }))
  }

  const handleSelectAllCategoryTests = () => {
    const categoryTests = filteredTests.map((test) => test.id)
    setFormData((prev) => ({
      ...prev,
      tests: Array.from(new Set([...prev.tests, ...categoryTests])),
    }))
  }

  const calculateTotalCost = () => {
    return selectedTests.reduce((total, test) => total + test.price, 0)
  }

  const calculateEstimatedTime = () => {
    if (selectedTests.length === 0) return 0
    return Math.max(...selectedTests.map((test) => test.estimatedTime))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) {
      newErrors.patientId = 'Seleccione un paciente'
    }
    if (!formData.doctorId) {
      newErrors.doctorId = 'Seleccione un doctor'
    }
    if (formData.tests.length === 0) {
      newErrors.tests = 'Seleccione al menos una prueba'
    }

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
        // Simulación de guardado
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log('Orden de laboratorio guardada:', {
          ...formData,
          orderNumber: generateOrderNumber(),
          estimatedHours: calculateEstimatedTime(),
          totalCost: calculateTotalCost(),
        })
        router.push('/laboratory')
      }
    } catch (error) {
      console.error('Error al guardar orden:', error)
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

  const categoryOptions = LAB_CATEGORIES.map((category) => ({
    value: category.value,
    label: `${category.icon} ${category.label}`,
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Editar Orden de Laboratorio' : 'Nueva Orden de Laboratorio'}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing
                  ? 'Modifica los detalles de la orden'
                  : 'Crea una nueva orden para análisis de laboratorio'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información del Paciente y Doctor */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              Información Médica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Paciente"
                value={formData.patientId}
                onChange={handleChange('patientId')}
                options={[{ value: '', label: 'Seleccionar paciente' }, ...patientOptions]}
                error={errors.patientId}
                required
              />
              <Select
                label="Doctor Solicitante"
                value={formData.doctorId}
                onChange={handleChange('doctorId')}
                options={[{ value: '', label: 'Seleccionar doctor' }, ...doctorOptions]}
                error={errors.doctorId}
                required
              />
            </div>
          </div>

          {/* Selección de Pruebas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Selección de Pruebas
              {formData.tests.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {formData.tests.length} seleccionada{formData.tests.length !== 1 ? 's' : ''}
                </span>
              )}
            </h3>

            {/* Filtros de pruebas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select
                label="Categoría"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[{ value: '', label: 'Todas las categorías' }, ...categoryOptions]}
              />
              <Input
                label="Buscar Prueba"
                value={searchTest}
                onChange={(e) => setSearchTest(e.target.value)}
                placeholder="Buscar por nombre o código..."
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>

            {selectedCategory && (
              <div className="mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllCategoryTests}
                >
                  Seleccionar todos de esta categoría
                </Button>
              </div>
            )}

            {/* Lista de pruebas disponibles */}
            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {filteredTests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="mt-2">No se encontraron pruebas</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredTests.map((test) => (
                    <div
                      key={test.id}
                      className="p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={formData.tests.includes(test.id)}
                            onChange={() => handleTestToggle(test.id)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-gray-900">{test.name}</h4>
                              <span className="text-xs text-gray-500">({test.code})</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                {LAB_CATEGORIES.find((cat) => cat.value === test.category)?.label}
                              </span>
                            </div>
                            {test.description && (
                              <p className="text-sm text-gray-500 mt-1">{test.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                              {test.normalRange && <span>Rango: {test.normalRange}</span>}
                              <span>Tiempo: ~{test.estimatedTime}h</span>
                              {test.preparationInstructions && (
                                <span className="text-orange-600">Preparación requerida</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${test.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errors.tests && <p className="text-sm text-red-600 mt-2">{errors.tests}</p>}
          </div>

          {/* Pruebas seleccionadas */}
          {selectedTests.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-3">Resumen de Pruebas Seleccionadas</h4>
              <div className="space-y-2">
                {selectedTests.map((test) => (
                  <div key={test.id} className="flex justify-between items-center text-sm">
                    <span className="text-purple-700">
                      {test.name} ({test.code})
                    </span>
                    <span className="font-medium">${test.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-purple-200 mt-3 pt-3 flex justify-between items-center">
                <div className="text-sm text-purple-700">
                  Tiempo estimado: ~{calculateEstimatedTime()} horas
                </div>
                <div className="font-bold text-purple-900">
                  Total: ${calculateTotalCost().toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Notas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Notas Adicionales
            </h3>
            <Textarea
              label="Notas"
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Información adicional relevante para el laboratorio"
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex justify-end space-x-4 w-full">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading
                ? isEditing
                  ? 'Actualizando...'
                  : 'Creando...'
                : isEditing
                  ? 'Actualizar Orden'
                  : 'Crear Orden'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
