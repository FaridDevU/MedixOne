import React, { useState, useEffect } from 'react'
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
interface PrescriptionMedicationData {
  medicationId: string
  dosage: string
  frequency: string
  duration: number
  quantity: number
  instructions: string
}

interface PrescriptionFormData {
  patientId: string
  doctorId: string
  diagnosis: string
  medications: PrescriptionMedicationData[]
  instructions: string
  duration: number
  followUpDate: string
}

interface Medication {
  id: string
  name: string
  genericName: string
  brand: string
  strength: string
  isActive: boolean
}

interface Patient {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  allergies?: string
}

interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
}

// Opciones para los selects
const FREQUENCY_OPTIONS = [
  { value: 'QD', label: 'Una vez al día (QD)' },
  { value: 'BID', label: 'Dos veces al día (BID)' },
  { value: 'TID', label: 'Tres veces al día (TID)' },
  { value: 'QID', label: 'Cuatro veces al día (QID)' },
  { value: 'PRN', label: 'Según necesidad (PRN)' },
]

// Funciones utilitarias locales
const generatePrescriptionNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `RX-${timestamp}-${random}`
}

const calculateQuantity = (frequency: string, duration: number): number => {
  const dailyDoses = {
    QD: 1,
    BID: 2,
    TID: 3,
    QID: 4,
    PRN: 2, // promedio para PRN
  }
  return (dailyDoses[frequency as keyof typeof dailyDoses] || 1) * duration
}

const checkDrugInteractions = (medications: Medication[]): string[] => {
  // Simulación de verificación de interacciones
  const interactions: string[] = []
  if (medications.length > 1) {
    interactions.push('Revisar posibles interacciones entre medicamentos')
  }
  return interactions
}

const checkAllergies = (medications: Medication[], allergies: string): string[] => {
  // Simulación de verificación de alergias
  const warnings: string[] = []
  medications.forEach((med) => {
    if (allergies.toLowerCase().includes(med.name.toLowerCase())) {
      warnings.push(`Posible alergia a ${med.name}`)
    }
  })
  return warnings
}

interface PrescriptionFormProps {
  initialData?: Partial<PrescriptionFormData>
  isEditing?: boolean
  onSubmit?: (data: PrescriptionFormData) => Promise<void>
  onCancel?: () => void
  patients?: Patient[]
  doctors?: Doctor[]
  medications?: Medication[]
}

export function PrescriptionForm({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  patients = [],
  doctors = [],
  medications = [],
}: PrescriptionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchMedication, setSearchMedication] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [drugInteractions, setDrugInteractions] = useState<string[]>([])
  const [allergyWarnings, setAllergyWarnings] = useState<string[]>([])

  const [formData, setFormData] = useState<PrescriptionFormData>({
    patientId: initialData?.patientId || '',
    doctorId: initialData?.doctorId || '',
    diagnosis: initialData?.diagnosis || '',
    medications: initialData?.medications || [],
    instructions: initialData?.instructions || '',
    duration: initialData?.duration || 7,
    followUpDate: initialData?.followUpDate || '',
  })

  // Obtener datos del paciente seleccionado
  useEffect(() => {
    if (formData.patientId) {
      const patient = patients.find((p) => p.id === formData.patientId)
      setSelectedPatient(patient || null)
    } else {
      setSelectedPatient(null)
    }
  }, [formData.patientId, patients])

  // Verificar interacciones y alergias cuando cambian los medicamentos
  useEffect(() => {
    if (formData.medications.length > 0) {
      const selectedMeds = formData.medications
        .map((medData) => medications.find((m) => m.id === medData.medicationId))
        .filter(Boolean) as Medication[]

      // Verificar interacciones
      const interactions = checkDrugInteractions(selectedMeds)
      setDrugInteractions(interactions)

      // Verificar alergias
      if (selectedPatient?.allergies) {
        const allergies = checkAllergies(selectedMeds, selectedPatient.allergies)
        setAllergyWarnings(allergies)
      }
    } else {
      setDrugInteractions([])
      setAllergyWarnings([])
    }
  }, [formData.medications, medications, selectedPatient])

  const handleChange =
    (field: keyof PrescriptionFormData) =>
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

  const addMedication = () => {
    const newMedication: PrescriptionMedicationData = {
      medicationId: '',
      dosage: '',
      frequency: 'BID',
      duration: formData.duration,
      quantity: 0,
      instructions: '',
    }

    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, newMedication],
    }))
  }

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }))
  }

  const updateMedication = (
    index: number,
    field: keyof PrescriptionMedicationData,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updatedMedications = [...prev.medications]
      const medication = { ...updatedMedications[index] }

      if (field === 'quantity' || field === 'duration') {
        ;(medication as any)[field] = value as number
      } else {
        ;(medication as any)[field] = value as string
      }

      // Recalcular cantidad automáticamente si cambia frecuencia o duración
      if (field === 'frequency' || field === 'duration') {
        if (medication.frequency && medication.duration) {
          medication.quantity = calculateQuantity(medication.frequency, medication.duration)
        }
      }

      updatedMedications[index] = medication as PrescriptionMedicationData
      return { ...prev, medications: updatedMedications }
    })
  }

  const filteredMedications = medications.filter(
    (med) =>
      med.isActive &&
      (med.name.toLowerCase().includes(searchMedication.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchMedication.toLowerCase()) ||
        med.brand.toLowerCase().includes(searchMedication.toLowerCase()))
  )

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) {
      newErrors.patientId = 'Seleccione un paciente'
    }
    if (!formData.doctorId) {
      newErrors.doctorId = 'Seleccione un doctor'
    }
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Ingrese el diagnóstico'
    }
    if (formData.medications.length === 0) {
      newErrors.medications = 'Agregue al menos un medicamento'
    }

    // Validar cada medicamento
    formData.medications.forEach((med, index) => {
      if (!med.medicationId) {
        newErrors[`medication-${index}`] = 'Seleccione un medicamento'
      }
      if (!med.dosage.trim()) {
        newErrors[`dosage-${index}`] = 'Ingrese la dosis'
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
        // Simulación de guardado
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log('Receta guardada:', {
          ...formData,
          prescriptionNumber: generatePrescriptionNumber(),
        })
        router.push('/prescriptions')
      }
    } catch (error) {
      console.error('Error al guardar receta:', error)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-emerald-600"
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
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Editar Receta Médica' : 'Nueva Receta Médica'}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing
                  ? 'Modifica los detalles de la receta'
                  : 'Prescribe medicamentos para el paciente'}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información del Paciente y Doctor */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-emerald-600"
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
                label="Doctor"
                value={formData.doctorId}
                onChange={handleChange('doctorId')}
                options={[{ value: '', label: 'Seleccionar doctor' }, ...doctorOptions]}
                error={errors.doctorId}
                required
              />
            </div>

            {/* Información del paciente seleccionado */}
            {selectedPatient && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Información del Paciente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                  <div>Teléfono: {selectedPatient.phone}</div>
                  <div>Email: {selectedPatient.email || 'No registrado'}</div>
                  {selectedPatient.allergies && (
                    <div className="md:col-span-2">
                      <strong className="text-red-700">Alergias:</strong>{' '}
                      {selectedPatient.allergies}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Diagnóstico */}
          <div>
            <Input
              label="Diagnóstico"
              value={formData.diagnosis}
              onChange={handleChange('diagnosis')}
              error={errors.diagnosis}
              placeholder="Diagnóstico principal del paciente"
              required
            />
          </div>

          {/* Medicamentos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                Medicamentos Prescritos
                {formData.medications.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                    {formData.medications.length}
                  </span>
                )}
              </h3>
              <Button type="button" variant="outline" onClick={addMedication}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar Medicamento
              </Button>
            </div>

            {errors.medications && (
              <p className="text-sm text-red-600 mb-4">{errors.medications}</p>
            )}

            {/* Lista de medicamentos */}
            <div className="space-y-4">
              {formData.medications.map((medication, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Medicamento #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedication(index)}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Selector de medicamento */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medicamento *
                        </label>
                        <Input
                          placeholder="Buscar medicamento..."
                          value={searchMedication}
                          onChange={(e) => setSearchMedication(e.target.value)}
                          icon={
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          }
                        />
                        <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md">
                          {filteredMedications.slice(0, 5).map((med) => (
                            <button
                              key={med.id}
                              type="button"
                              className={`w-full text-left p-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0 ${
                                medication.medicationId === med.id ? 'bg-emerald-50' : ''
                              }`}
                              onClick={() => {
                                updateMedication(index, 'medicationId', med.id)
                                setSearchMedication('')
                              }}
                            >
                              <div className="font-medium">{med.name}</div>
                              <div className="text-gray-500">
                                {med.genericName} - {med.strength}
                              </div>
                            </button>
                          ))}
                        </div>
                        {errors[`medication-${index}`] && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors[`medication-${index}`]}
                          </p>
                        )}
                      </div>

                      <Input
                        label="Dosis"
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        placeholder="ej: 500mg, 1 tableta"
                        error={errors[`dosage-${index}`]}
                        required
                      />

                      <Select
                        label="Frecuencia"
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        options={FREQUENCY_OPTIONS}
                        required
                      />

                      <Input
                        label="Duración (días)"
                        type="number"
                        value={medication.duration.toString()}
                        onChange={(e) =>
                          updateMedication(index, 'duration', parseInt(e.target.value) || 0)
                        }
                        min="1"
                        required
                      />

                      <Input
                        label="Cantidad Total"
                        type="number"
                        value={medication.quantity.toString()}
                        onChange={(e) =>
                          updateMedication(index, 'quantity', parseInt(e.target.value) || 0)
                        }
                        min="1"
                        required
                      />

                      <div className="md:col-span-2">
                        <Textarea
                          label="Instrucciones Específicas"
                          value={medication.instructions}
                          onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                          placeholder="Instrucciones adicionales para este medicamento"
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {formData.medications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
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
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <p className="mt-2">No hay medicamentos agregados</p>
                <Button type="button" variant="outline" onClick={addMedication} className="mt-4">
                  Agregar Primer Medicamento
                </Button>
              </div>
            )}
          </div>

          {/* Alertas de interacciones y alergias */}
          {(drugInteractions.length > 0 || allergyWarnings.length > 0) && (
            <div className="space-y-3">
              {allergyWarnings.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    Alertas de Alergias
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {allergyWarnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {drugInteractions.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    Posibles Interacciones
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {drugInteractions.map((interaction, index) => (
                      <li key={index}>• {interaction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Instrucciones generales y seguimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Textarea
                label="Instrucciones Generales"
                value={formData.instructions}
                onChange={handleChange('instructions')}
                placeholder="Instrucciones adicionales para el paciente"
                rows={3}
              />
            </div>
            <div>
              <Input
                label="Duración del Tratamiento (días)"
                type="number"
                value={formData.duration.toString()}
                onChange={handleChange('duration')}
                min="1"
                required
              />
              <Input
                label="Fecha de Seguimiento"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange('followUpDate')}
                className="mt-4"
                min={new Date().toISOString().split('T')[0]}
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
              {loading
                ? isEditing
                  ? 'Actualizando...'
                  : 'Creando...'
                : isEditing
                  ? 'Actualizar Receta'
                  : 'Crear Receta'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
