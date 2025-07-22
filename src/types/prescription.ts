// Tipos para el sistema de recetas médicas
export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  prescriptionNumber: string
  prescriptionDate: Date
  diagnosis: string
  medications: PrescribedMedication[]
  instructions?: string
  duration: number // en días
  followUpDate?: Date
  status: PrescriptionStatus
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // Datos relacionados
  patient?: {
    id: string
    firstName: string
    lastName: string
    dateOfBirth: Date
    phone: string
    allergies?: string
  }
  doctor?: {
    id: string
    firstName: string
    lastName: string
    specialty: string
    license: string
  }
}

export interface PrescribedMedication {
  id: string
  medicationId: string
  dosage: string
  frequency: string
  duration: number // en días
  quantity: number
  instructions: string
  startDate: Date
  endDate: Date
  isActive: boolean
  // Datos del medicamento
  medication?: Medication
}

export interface Medication {
  id: string
  name: string
  genericName: string
  brand: string
  category: MedicationCategory
  form: MedicationForm
  strength: string
  unit: string
  description?: string
  indications: string[]
  contraindications: string[]
  sideEffects: string[]
  interactions: string[]
  pregnancy: PregnancyCategory
  price: number
  isControlled: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type PrescriptionStatus =
  | 'ACTIVE' // Activa
  | 'COMPLETED' // Completada
  | 'SUSPENDED' // Suspendida
  | 'CANCELLED' // Cancelada

export type MedicationCategory =
  | 'ANALGESIC' // Analgésicos
  | 'ANTIBIOTIC' // Antibióticos
  | 'ANTIHISTAMINE' // Antihistamínicos
  | 'ANTIHYPERTENSIVE' // Antihipertensivos
  | 'ANTIDIABETIC' // Antidiabéticos
  | 'CARDIOVASCULAR' // Cardiovasculares
  | 'GASTROINTESTINAL' // Gastrointestinales
  | 'RESPIRATORY' // Respiratorios
  | 'NEUROLOGICAL' // Neurológicos
  | 'DERMATOLOGICAL' // Dermatológicos
  | 'HORMONAL' // Hormonales
  | 'VITAMIN' // Vitaminas
  | 'OTHER' // Otros

export type MedicationForm =
  | 'TABLET' // Tableta
  | 'CAPSULE' // Cápsula
  | 'SYRUP' // Jarabe
  | 'INJECTION' // Inyección
  | 'CREAM' // Crema
  | 'DROPS' // Gotas
  | 'INHALER' // Inhalador
  | 'PATCH' // Parche
  | 'SUPPOSITORY' // Supositorio
  | 'OTHER' // Otros

export type PregnancyCategory = 'A' | 'B' | 'C' | 'D' | 'X'

export interface PrescriptionFormData {
  patientId: string
  doctorId: string
  diagnosis: string
  medications: PrescriptionMedicationData[]
  instructions: string
  duration: number
  followUpDate: string
}

export interface PrescriptionMedicationData {
  medicationId: string
  dosage: string
  frequency: string
  duration: number
  quantity: number
  instructions: string
}

// Opciones para formularios
export const PRESCRIPTION_STATUS_OPTIONS: Array<{
  value: PrescriptionStatus
  label: string
  color: string
}> = [
  { value: 'ACTIVE', label: 'Activa', color: 'green' },
  { value: 'COMPLETED', label: 'Completada', color: 'blue' },
  { value: 'SUSPENDED', label: 'Suspendida', color: 'yellow' },
  { value: 'CANCELLED', label: 'Cancelada', color: 'red' },
]

export const MEDICATION_CATEGORIES: Array<{
  value: MedicationCategory
  label: string
  icon: string
  color: string
}> = [
  { value: 'ANALGESIC', label: 'Analgésicos', icon: '💊', color: 'red' },
  { value: 'ANTIBIOTIC', label: 'Antibióticos', icon: '🦠', color: 'blue' },
  { value: 'ANTIHISTAMINE', label: 'Antihistamínicos', icon: '🤧', color: 'green' },
  { value: 'ANTIHYPERTENSIVE', label: 'Antihipertensivos', icon: '❤️', color: 'pink' },
  { value: 'ANTIDIABETIC', label: 'Antidiabéticos', icon: '🩸', color: 'purple' },
  { value: 'CARDIOVASCULAR', label: 'Cardiovasculares', icon: '💗', color: 'red' },
  { value: 'GASTROINTESTINAL', label: 'Gastrointestinales', icon: '🫃', color: 'orange' },
  { value: 'RESPIRATORY', label: 'Respiratorios', icon: '🫁', color: 'cyan' },
  { value: 'NEUROLOGICAL', label: 'Neurológicos', icon: '🧠', color: 'indigo' },
  { value: 'DERMATOLOGICAL', label: 'Dermatológicos', icon: '🧴', color: 'pink' },
  { value: 'HORMONAL', label: 'Hormonales', icon: '⚡', color: 'yellow' },
  { value: 'VITAMIN', label: 'Vitaminas', icon: '🍎', color: 'green' },
  { value: 'OTHER', label: 'Otros', icon: '💉', color: 'gray' },
]

export const MEDICATION_FORMS: Array<{ value: MedicationForm; label: string }> = [
  { value: 'TABLET', label: 'Tableta' },
  { value: 'CAPSULE', label: 'Cápsula' },
  { value: 'SYRUP', label: 'Jarabe' },
  { value: 'INJECTION', label: 'Inyección' },
  { value: 'CREAM', label: 'Crema' },
  { value: 'DROPS', label: 'Gotas' },
  { value: 'INHALER', label: 'Inhalador' },
  { value: 'PATCH', label: 'Parche' },
  { value: 'SUPPOSITORY', label: 'Supositorio' },
  { value: 'OTHER', label: 'Otros' },
]

export const FREQUENCY_OPTIONS = [
  { value: 'QD', label: 'Una vez al día (QD)' },
  { value: 'BID', label: 'Dos veces al día (BID)' },
  { value: 'TID', label: 'Tres veces al día (TID)' },
  { value: 'QID', label: 'Cuatro veces al día (QID)' },
  { value: 'Q4H', label: 'Cada 4 horas' },
  { value: 'Q6H', label: 'Cada 6 horas' },
  { value: 'Q8H', label: 'Cada 8 horas' },
  { value: 'Q12H', label: 'Cada 12 horas' },
  { value: 'PRN', label: 'Según necesidad (PRN)' },
  { value: 'QHS', label: 'Al acostarse (QHS)' },
  { value: 'QAM', label: 'En la mañana (QAM)' },
  { value: 'AC', label: 'Antes de comer (AC)' },
  { value: 'PC', label: 'Después de comer (PC)' },
]

export const DURATION_OPTIONS = [
  { value: 3, label: '3 días' },
  { value: 5, label: '5 días' },
  { value: 7, label: '7 días (1 semana)' },
  { value: 10, label: '10 días' },
  { value: 14, label: '14 días (2 semanas)' },
  { value: 21, label: '21 días (3 semanas)' },
  { value: 30, label: '30 días (1 mes)' },
  { value: 60, label: '60 días (2 meses)' },
  { value: 90, label: '90 días (3 meses)' },
]

// Utilidades
export function generatePrescriptionNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')

  return `RX${year}${month}${day}${random}`
}

export function getPrescriptionStatusLabel(status: PrescriptionStatus): string {
  const option = PRESCRIPTION_STATUS_OPTIONS.find((opt) => opt.value === status)
  return option?.label || status
}

export function getMedicationCategoryLabel(category: MedicationCategory): string {
  const option = MEDICATION_CATEGORIES.find((opt) => opt.value === category)
  return option?.label || category
}

export function getMedicationCategoryIcon(category: MedicationCategory): string {
  const option = MEDICATION_CATEGORIES.find((opt) => opt.value === category)
  return option?.icon || '💊'
}

export function getMedicationFormLabel(form: MedicationForm): string {
  const option = MEDICATION_FORMS.find((opt) => opt.value === form)
  return option?.label || form
}

export function getFrequencyLabel(frequency: string): string {
  const option = FREQUENCY_OPTIONS.find((opt) => opt.value === frequency)
  return option?.label || frequency
}

export function calculateEndDate(startDate: Date, duration: number): Date {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + duration)
  return endDate
}

export function calculateQuantity(frequency: string, duration: number): number {
  const frequencyMap: Record<string, number> = {
    QD: 1,
    BID: 2,
    TID: 3,
    QID: 4,
    Q4H: 6,
    Q6H: 4,
    Q8H: 3,
    Q12H: 2,
    PRN: 1,
    QHS: 1,
    QAM: 1,
    AC: 3,
    PC: 3,
  }

  const dailyDoses = frequencyMap[frequency] || 1
  return dailyDoses * duration
}

export function checkDrugInteractions(medications: Medication[]): string[] {
  const interactions: string[] = []

  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const med1 = medications[i]
      const med2 = medications[j]

      // Verificar si med1 tiene interacciones con med2
      if (
        med1.interactions.some(
          (interaction) =>
            interaction.toLowerCase().includes(med2.name.toLowerCase()) ||
            interaction.toLowerCase().includes(med2.genericName.toLowerCase())
        )
      ) {
        interactions.push(`${med1.name} puede interactuar con ${med2.name}`)
      }
    }
  }

  return interactions
}

export function checkAllergies(medications: Medication[], allergies: string): string[] {
  if (!allergies) return []

  const allergyList = allergies
    .toLowerCase()
    .split(',')
    .map((a) => a.trim())
  const warnings: string[] = []

  medications.forEach((med) => {
    allergyList.forEach((allergy) => {
      if (
        med.name.toLowerCase().includes(allergy) ||
        med.genericName.toLowerCase().includes(allergy)
      ) {
        warnings.push(`ALERTA: El paciente es alérgico a ${med.name}`)
      }
    })
  })

  return warnings
}
