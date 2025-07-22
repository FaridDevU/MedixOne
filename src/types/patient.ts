// Tipos para el sistema de pacientes
export interface Patient {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  dateOfBirth: Date
  gender: 'M' | 'F' | 'OTHER'
  address?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  insuranceInfo?: {
    provider: string
    policyNumber: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface CreatePatientData {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  dateOfBirth: Date
  gender: 'M' | 'F' | 'OTHER'
  address?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  insuranceInfo?: {
    provider: string
    policyNumber: string
  }
}

// Opciones para formularios
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Masculino' },
  { value: 'FEMALE', label: 'Femenino' },
  { value: 'OTHER', label: 'Otro' },
]

// Utilidades
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export function getGenderLabel(gender: string): string {
  const option = GENDER_OPTIONS.find((opt) => opt.value === gender)
  return option?.label || gender
}
