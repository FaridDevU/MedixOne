import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// import AppointmentFormData from the correct module or define it here if missing
// Remove APPOINTMENT_TYPES from this import
// If PRIORITY_OPTIONS is not exported from '@/types/appointment', define it here:
export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Baja' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'HIGH', label: 'Alta' },
]

// Define DURATION_OPTIONS locally if not exported from '@/types/appointment'
export const DURATION_OPTIONS = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '60 minutos' },
]
// Define generateTimeSlots locally
function generateTimeSlots(startHour: number, endHour: number, intervalMinutes: number): string[] {
  const slots: string[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      const h = hour.toString().padStart(2, '0')
      const m = min.toString().padStart(2, '0')
      slots.push(`${h}:${m}`)
    }
  }
  return slots
}

// Define isTimeSlotAvailable locally
function isTimeSlotAvailable(
  time: string,
  date: Date,
  existingAppointments: any[],
  doctorId: string
): boolean {
  // Check if the time slot is already taken for the doctor on the given date
  return !existingAppointments.some(
    (app) =>
      app.doctorId === doctorId &&
      app.date === date.toISOString().split('T')[0] &&
      app.startTime === time
  )
}
// Import APPOINTMENT_TYPES from its correct module, or define it here if missing
// Define APPOINTMENT_TYPES locally since the import is missing
export const APPOINTMENT_TYPES = [
  { value: 'CONSULTATION', label: 'Consulta' },
  { value: 'FOLLOW_UP', label: 'Seguimiento' },
  { value: 'EMERGENCY', label: 'Emergencia' },
]
// Update the path below to the correct location of AppointmentFormData
// If AppointmentFormData is not exported from '@/types/appointment', define it here:
export interface AppointmentFormData {
  patientId: string
  doctorId: string
  date: string
  startTime: string
  type: string
  reason: string
  notes: string
  priority: string
  duration: number
}
// Or import from the correct module, e.g.:
// import type { AppointmentFormData } from '@/types/appointmentFormData'
import { Patient } from '@/types/patient'
// If you have a Doctor type, import from the correct module, e.g.:
// import { Doctor } from '@/types/doctor'
// Or define it locally if missing:
export interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
}
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

interface AppointmentFormProps {
  initialData?: Partial<AppointmentFormData>
  isEditing?: boolean
  onSubmit?: (data: AppointmentFormData) => Promise<void>
  onCancel?: () => void
  patients?: Patient[]
  doctors?: Doctor[]
  existingAppointments?: any[]
}

export function AppointmentForm({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  patients = [],
  doctors = [],
  existingAppointments = [],
}: AppointmentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<AppointmentFormData>>({})
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])

  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: initialData?.patientId || '',
    doctorId: initialData?.doctorId || '',
    date: initialData?.date || '',
    startTime: initialData?.startTime || '',
    type: initialData?.type || 'CONSULTATION',
    reason: initialData?.reason || '',
    notes: initialData?.notes || '',
    priority: initialData?.priority || 'MEDIUM',
    duration: initialData?.duration || 30,
  })

  // Calcular horarios disponibles cuando cambia la fecha o doctor
  useEffect(() => {
    if (formData.date && formData.doctorId) {
      const selectedDate = new Date(formData.date)
      const timeSlots = generateTimeSlots(8, 18, 30) // 8 AM a 6 PM, cada 30 min

      const available = timeSlots.filter((time) =>
        isTimeSlotAvailable(time, selectedDate, existingAppointments, formData.doctorId)
      )

      setAvailableTimeSlots(available)

      // Si el horario seleccionado ya no está disponible, limpiarlo
      if (formData.startTime && !available.includes(formData.startTime)) {
        setFormData((prev) => ({ ...prev, startTime: '' }))
      }
    }
  }, [formData.date, formData.doctorId, existingAppointments])

  const handleChange =
    (field: keyof AppointmentFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = field === 'duration' ? parseInt(e.target.value) : e.target.value

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))

      // Limpiar error del campo cuando se modifica
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }))
      }
    }

  const validateForm = (): boolean => {
    const newErrors: Partial<AppointmentFormData> = {}

    if (!formData.patientId) {
      newErrors.patientId = 'Seleccione un paciente'
    }
    if (!formData.doctorId) {
      newErrors.doctorId = 'Seleccione un doctor'
    }
    if (!formData.date) {
      newErrors.date = 'Seleccione una fecha'
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Seleccione un horario'
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Ingrese el motivo de la cita'
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
        console.log('Cita guardada:', formData)
        router.push('/appointments')
      }
    } catch (error) {
      console.error('Error al guardar cita:', error)
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

  const timeSlotOptions = availableTimeSlots.map((time) => ({
    value: time,
    label: time,
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-medical-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-medical-600"
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
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Editar Cita' : 'Nueva Cita Médica'}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing
                  ? 'Modifica los detalles de la cita'
                  : 'Programa una nueva cita en el sistema'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información del Paciente y Doctor */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-medical-600"
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
              Participantes
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
                label="Doctor"
                value={formData.doctorId}
                onChange={handleChange('doctorId')}
                options={[{ value: '', label: 'Seleccionar doctor' }, ...doctorOptions]}
                error={errors.doctorId}
                required
              />
            </div>
          </div>

          {/* Fecha y Hora */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-medical-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Programación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Fecha"
                type="date"
                value={formData.date}
                onChange={handleChange('date')}
                error={errors.date}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <Select
                label="Hora de Inicio"
                value={formData.startTime}
                onChange={handleChange('startTime')}
                options={[
                  {
                    value: '',
                    label:
                      availableTimeSlots.length > 0
                        ? 'Seleccionar horario'
                        : 'No hay horarios disponibles',
                  },
                  ...timeSlotOptions,
                ]}
                error={errors.startTime}
                disabled={!formData.date || !formData.doctorId || availableTimeSlots.length === 0}
                required
              />
              <Select
                label="Duración"
                value={formData.duration.toString()}
                onChange={handleChange('duration')}
                options={DURATION_OPTIONS.map((option) => ({
                  value: option.value.toString(),
                  label: option.label,
                }))}
                required
              />
            </div>
          </div>

          {/* Detalles de la Cita */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-medical-600"
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
              Detalles de la Cita
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo de Cita"
                value={formData.type}
                onChange={handleChange('type')}
                options={APPOINTMENT_TYPES.map((type) => ({
                  value: type.value,
                  label: type.label,
                }))}
                required
              />
              <Select
                label="Prioridad"
                value={formData.priority}
                onChange={handleChange('priority')}
                options={PRIORITY_OPTIONS.map((priority) => ({
                  value: priority.value,
                  label: priority.label,
                }))}
                required
              />
              <div className="md:col-span-2">
                <Input
                  label="Motivo de la Cita"
                  value={formData.reason}
                  onChange={handleChange('reason')}
                  error={errors.reason}
                  placeholder="Descripción breve del motivo de la consulta"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  label="Notas Adicionales"
                  value={formData.notes}
                  onChange={handleChange('notes')}
                  placeholder="Información adicional relevante para la cita"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Información de Disponibilidad */}
          {formData.date && formData.doctorId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Disponibilidad del {formData.date}</h4>
              <p className="text-sm text-blue-700">
                {availableTimeSlots.length > 0
                  ? `Hay ${availableTimeSlots.length} horarios disponibles`
                  : 'No hay horarios disponibles para esta fecha y doctor'}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <div className="flex justify-end space-x-4 w-full">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="min-w-[120px]" disabled={loading}>
              {loading
                ? isEditing
                  ? 'Actualizando...'
                  : 'Programando...'
                : isEditing
                  ? 'Actualizar Cita'
                  : 'Programar Cita'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
