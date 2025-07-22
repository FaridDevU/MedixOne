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
interface PatientFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'M' | 'F' | 'OTHER'
  address: string
  emergencyContact: string
  bloodType: string
  allergies: string
  chronicDiseases: string
  insurance: string
}

// Opciones para los selects
const GENDER_OPTIONS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'OTHER', label: 'Otro' },
]

const BLOOD_TYPE_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
]

interface PatientFormProps {
  initialData?: Partial<PatientFormData>
  isEditing?: boolean
  onSubmit?: (data: PatientFormData) => Promise<void>
  onCancel?: () => void
}

export function PatientForm({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
}: PatientFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<PatientFormData>>({})

  const [formData, setFormData] = useState<PatientFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    gender: initialData?.gender || 'M',
    address: initialData?.address || '',
    emergencyContact: initialData?.emergencyContact || '',
    bloodType: initialData?.bloodType || '',
    allergies: initialData?.allergies || '',
    chronicDiseases: initialData?.chronicDiseases || '',
    insurance: initialData?.insurance || '',
  })

  const handleChange =
    (field: keyof PatientFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
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
    const newErrors: Partial<PatientFormData> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio'
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La fecha de nacimiento es obligatoria'
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
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
        console.log('Paciente guardado:', formData)
        router.push('/patients')
      }
    } catch (error) {
      console.error('Error al guardar paciente:', error)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card variant="elevated">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing
                  ? 'Modifica la información del paciente'
                  : 'Registra un nuevo paciente en el sistema'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información Personal */}
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
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                error={errors.firstName}
                placeholder="Ingrese el nombre"
                required
              />
              <Input
                label="Apellido"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                error={errors.lastName}
                placeholder="Ingrese el apellido"
                required
              />
              <Input
                label="Fecha de Nacimiento"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
                error={errors.dateOfBirth}
                required
              />
              <Select
                label="Género"
                value={formData.gender}
                onChange={handleChange('gender')}
                options={GENDER_OPTIONS}
                required
              />
            </div>
          </div>

          {/* Información de Contacto */}
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Teléfono"
                value={formData.phone}
                onChange={handleChange('phone')}
                error={errors.phone}
                placeholder="+1 (555) 123-4567"
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                error={errors.email}
                placeholder="paciente@ejemplo.com"
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Dirección"
                  value={formData.address}
                  onChange={handleChange('address')}
                  placeholder="Dirección completa del paciente"
                  rows={2}
                />
              </div>
              <Input
                label="Contacto de Emergencia"
                value={formData.emergencyContact}
                onChange={handleChange('emergencyContact')}
                placeholder="Nombre y teléfono del contacto de emergencia"
              />
            </div>
          </div>

          {/* Información Médica */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Información Médica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo de Sangre"
                value={formData.bloodType}
                onChange={handleChange('bloodType')}
                options={[
                  { value: '', label: 'Seleccionar tipo de sangre' },
                  ...BLOOD_TYPE_OPTIONS,
                ]}
                placeholder="Seleccionar tipo de sangre"
              />
              <Input
                label="Seguro Médico"
                value={formData.insurance}
                onChange={handleChange('insurance')}
                placeholder="Nombre del seguro médico"
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Alergias"
                  value={formData.allergies}
                  onChange={handleChange('allergies')}
                  placeholder="Describir alergias conocidas (medicamentos, alimentos, etc.)"
                  rows={2}
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  label="Enfermedades Crónicas"
                  value={formData.chronicDiseases}
                  onChange={handleChange('chronicDiseases')}
                  placeholder="Describir enfermedades crónicas o condiciones médicas"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex justify-end space-x-4 w-full">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading
                ? isEditing
                  ? 'Actualizando...'
                  : 'Guardando...'
                : isEditing
                  ? 'Actualizar'
                  : 'Guardar Paciente'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
