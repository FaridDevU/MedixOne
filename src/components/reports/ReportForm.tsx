import React, { useState } from 'react'
import { useRouter } from 'next/router'
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
interface ReportFormData {
  title: string
  type: string
  description: string
  dateRange: {
    startDate: string
    endDate: string
  }
  filters: {
    patientIds: string[]
    doctorIds: string[]
    departments: string[]
    gender: string
    ageRange: {
      min: number
      max: number
    }
  }
  format: string
  includeCharts: boolean
  includeTables: boolean
  includeMetrics: boolean
}

interface Patient {
  id: string
  firstName: string
  lastName: string
}

interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
}

// Datos de configuración locales
const REPORT_TYPES = [
  {
    value: 'PATIENT_DEMOGRAPHICS',
    label: 'Demografía de Pacientes',
    icon: '👥',
    description: 'Análisis demográfico de la población de pacientes',
  },
  {
    value: 'APPOINTMENTS_SUMMARY',
    label: 'Resumen de Citas',
    icon: '📅',
    description: 'Estadísticas y tendencias de citas médicas',
  },
  {
    value: 'REVENUE_ANALYSIS',
    label: 'Análisis de Ingresos',
    icon: '💰',
    description: 'Reporte financiero de ingresos y facturación',
  },
  {
    value: 'DOCTOR_PERFORMANCE',
    label: 'Desempeño Médico',
    icon: '👨‍⚕️',
    description: 'Métricas de productividad y satisfacción médica',
  },
  {
    value: 'MEDICATION_USAGE',
    label: 'Uso de Medicamentos',
    icon: '💊',
    description: 'Análisis de prescripciones y medicamentos',
  },
]

const REPORT_FORMATS = [
  { value: 'PDF', label: 'PDF', icon: '📄' },
  { value: 'EXCEL', label: 'Excel', icon: '📊' },
  { value: 'CSV', label: 'CSV', icon: '📋' },
]

// Funciones utilitarias locales
const generateReportId = (): string => {
  return `RPT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}

const calculateDateRange = (period: 'today' | 'week' | 'month' | 'quarter' | 'year') => {
  const endDate = new Date()
  const startDate = new Date()

  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0)
      break
    case 'week':
      startDate.setDate(endDate.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1)
      break
    case 'quarter':
      startDate.setMonth(endDate.getMonth() - 3)
      break
    case 'year':
      startDate.setFullYear(endDate.getFullYear() - 1)
      break
  }

  return { startDate, endDate }
}

interface ReportFormProps {
  initialData?: Partial<ReportFormData>
  onSubmit?: (data: ReportFormData) => Promise<void>
  onCancel?: () => void
  patients?: Patient[]
  doctors?: Doctor[]
}

export function ReportForm({
  initialData,
  onSubmit,
  onCancel,
  patients = [],
  doctors = [],
}: ReportFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewData, setPreviewData] = useState<any>(null)

  const [formData, setFormData] = useState<ReportFormData>({
    title: initialData?.title || '',
    type: initialData?.type || 'PATIENT_DEMOGRAPHICS',
    description: initialData?.description || '',
    dateRange: {
      startDate:
        initialData?.dateRange?.startDate ||
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: initialData?.dateRange?.endDate || new Date().toISOString().split('T')[0],
    },
    filters: {
      patientIds: initialData?.filters?.patientIds || [],
      doctorIds: initialData?.filters?.doctorIds || [],
      departments: initialData?.filters?.departments || [],
      gender: initialData?.filters?.gender || 'ALL',
      ageRange: {
        min: initialData?.filters?.ageRange?.min || 0,
        max: initialData?.filters?.ageRange?.max || 120,
      },
    },
    format: initialData?.format || 'PDF',
    includeCharts: initialData?.includeCharts ?? true,
    includeTables: initialData?.includeTables ?? true,
    includeMetrics: initialData?.includeMetrics ?? true,
  })

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value =
        e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value

      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...(prev as any)[parent],
            [child]: value,
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

  const handleQuickDateRange = (period: 'today' | 'week' | 'month' | 'quarter' | 'year') => {
    const range = calculateDateRange(period)
    setFormData((prev) => ({
      ...prev,
      dateRange: {
        startDate: range.startDate.toISOString().split('T')[0],
        endDate: range.endDate.toISOString().split('T')[0],
      },
    }))
  }

  const handlePatientSelection = (patientId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        patientIds: checked
          ? [...prev.filters.patientIds, patientId]
          : prev.filters.patientIds.filter((id) => id !== patientId),
      },
    }))
  }

  const handleDoctorSelection = (doctorId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        doctorIds: checked
          ? [...prev.filters.doctorIds, doctorId]
          : prev.filters.doctorIds.filter((id) => id !== doctorId),
      },
    }))
  }

  const generatePreview = () => {
    // Simular datos de preview basados en el tipo de reporte
    const mockData = {
      totalRecords: Math.floor(Math.random() * 1000) + 100,
      charts: formData.includeCharts ? Math.floor(Math.random() * 5) + 2 : 0,
      tables: formData.includeTables ? Math.floor(Math.random() * 3) + 1 : 0,
      metrics: formData.includeMetrics ? Math.floor(Math.random() * 8) + 4 : 0,
      estimatedSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      estimatedTime: `${Math.floor(Math.random() * 30) + 10} segundos`,
    }

    setPreviewData(mockData)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    }
    if (!formData.type) {
      newErrors.type = 'Seleccione el tipo de reporte'
    }
    if (!formData.dateRange.startDate) {
      newErrors['dateRange.startDate'] = 'Fecha de inicio es requerida'
    }
    if (!formData.dateRange.endDate) {
      newErrors['dateRange.endDate'] = 'Fecha de fin es requerida'
    }
    if (new Date(formData.dateRange.startDate) >= new Date(formData.dateRange.endDate)) {
      newErrors['dateRange.endDate'] = 'La fecha de fin debe ser posterior a la de inicio'
    }
    if (!formData.includeCharts && !formData.includeTables && !formData.includeMetrics) {
      newErrors.includeCharts = 'Debe incluir al menos un tipo de contenido'
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
        // Simulación de generación
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log('Reporte generado:', {
          ...formData,
          id: generateReportId(),
        })
        router.push('/reports')
      }
    } catch (error) {
      console.error('Error al generar reporte:', error)
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
  const reportTypeOptions = REPORT_TYPES.map((type) => ({
    value: type.value,
    label: `${type.icon} ${type.label}`,
  }))

  const formatOptions = REPORT_FORMATS.map((format) => ({
    value: format.value,
    label: `${format.icon} ${format.label}`,
  }))

  const patientOptions = patients.map((patient) => ({
    value: patient.id,
    label: `${patient.firstName} ${patient.lastName}`,
  }))

  const doctorOptions = doctors.map((doctor) => ({
    value: doctor.id,
    label: `Dr. ${doctor.firstName} ${doctor.lastName}`,
  }))

  const selectedReportType = REPORT_TYPES.find((type) => type.value === formData.type)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Generar Nuevo Reporte</h2>
              <p className="text-sm text-gray-500">
                Configura los parámetros para generar un reporte médico personalizado
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
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
              Información del Reporte
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Título del Reporte"
                value={formData.title}
                onChange={handleChange('title')}
                error={errors.title}
                placeholder="ej: Análisis Mensual de Pacientes"
                required
              />
              <Select
                label="Tipo de Reporte"
                value={formData.type}
                onChange={handleChange('type')}
                options={[{ value: '', label: 'Seleccionar tipo' }, ...reportTypeOptions]}
                error={errors.type}
                required
              />
            </div>
            <div className="mt-4">
              <Textarea
                label="Descripción"
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Describe el propósito y alcance del reporte"
                rows={3}
              />
            </div>

            {/* Información del tipo seleccionado */}
            {selectedReportType && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <span className="mr-2">{selectedReportType.icon}</span>
                  {selectedReportType.label}
                </h4>
                <p className="text-sm text-blue-700">{selectedReportType.description}</p>
              </div>
            )}
          </div>

          {/* Rango de fechas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Período de Análisis
            </h3>

            {/* Botones de rango rápido */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { period: 'today' as const, label: 'Hoy' },
                { period: 'week' as const, label: 'Última semana' },
                { period: 'month' as const, label: 'Último mes' },
                { period: 'quarter' as const, label: 'Último trimestre' },
                { period: 'year' as const, label: 'Último año' },
              ].map(({ period, label }) => (
                <Button
                  key={period}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDateRange(period)}
                >
                  {label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fecha de Inicio"
                type="date"
                value={formData.dateRange.startDate}
                onChange={handleChange('dateRange.startDate')}
                error={errors['dateRange.startDate']}
                required
              />
              <Input
                label="Fecha de Fin"
                type="date"
                value={formData.dateRange.endDate}
                onChange={handleChange('dateRange.endDate')}
                error={errors['dateRange.endDate']}
                required
              />
            </div>
          </div>

          {/* Filtros */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                />
              </svg>
              Filtros de Datos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Género"
                value={formData.filters.gender}
                onChange={handleChange('filters.gender')}
                options={[
                  { value: 'ALL', label: 'Todos' },
                  { value: 'MALE', label: 'Masculino' },
                  { value: 'FEMALE', label: 'Femenino' },
                ]}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Edad Mínima"
                  type="number"
                  value={formData.filters.ageRange.min.toString()}
                  onChange={handleChange('filters.ageRange.min')}
                  min="0"
                  max="120"
                />
                <Input
                  label="Edad Máxima"
                  type="number"
                  value={formData.filters.ageRange.max.toString()}
                  onChange={handleChange('filters.ageRange.max')}
                  min="0"
                  max="120"
                />
              </div>
            </div>

            {/* Selección de pacientes específicos */}
            {patients.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pacientes Específicos (opcional)
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {patients.slice(0, 10).map((patient) => (
                    <label
                      key={patient.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.filters.patientIds.includes(patient.id)}
                        onChange={(e) => handlePatientSelection(patient.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {patient.firstName} {patient.lastName}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Selección de doctores específicos */}
            {doctors.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctores Específicos (opcional)
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {doctors.slice(0, 10).map((doctor) => (
                    <label
                      key={doctor.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.filters.doctorIds.includes(doctor.id)}
                        onChange={(e) => handleDoctorSelection(doctor.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Configuración de salida */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Configuración de Salida
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Formato de Salida"
                value={formData.format}
                onChange={handleChange('format')}
                options={formatOptions}
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Contenido a Incluir
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeCharts}
                    onChange={handleChange('includeCharts')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Incluir gráficos y visualizaciones
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeTables}
                    onChange={handleChange('includeTables')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Incluir tablas de datos</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeMetrics}
                    onChange={handleChange('includeMetrics')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Incluir métricas y KPIs</span>
                </label>
              </div>
              {errors.includeCharts && (
                <p className="text-sm text-red-600 mt-2">{errors.includeCharts}</p>
              )}
            </div>
          </div>

          {/* Preview del reporte */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Preview del Reporte
              </h3>
              <Button type="button" variant="outline" onClick={generatePreview}>
                Generar Preview
              </Button>
            </div>

            {previewData && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Estimación del Reporte</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Registros:</span>
                    <div className="font-medium">{previewData.totalRecords.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Gráficos:</span>
                    <div className="font-medium">{previewData.charts}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Tablas:</span>
                    <div className="font-medium">{previewData.tables}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Métricas:</span>
                    <div className="font-medium">{previewData.metrics}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Tamaño estimado:</span>
                    <div className="font-medium">{previewData.estimatedSize}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Tiempo estimado:</span>
                    <div className="font-medium">{previewData.estimatedTime}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex justify-end space-x-4 w-full">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
