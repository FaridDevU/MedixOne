// Validaciones básicas para desarrollo
// En producción, reemplazar con esquemas Zod completos

export interface UserInput {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT'
}

export interface LoginInput {
  email: string
  password: string
}

export interface PatientInput {
  firstName: string
  lastName: string
  email?: string
  phone: string
  dateOfBirth: Date
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  address?: string
  emergencyContact?: string
  bloodType?:
    | 'A_POSITIVE'
    | 'A_NEGATIVE'
    | 'B_POSITIVE'
    | 'B_NEGATIVE'
    | 'AB_POSITIVE'
    | 'AB_NEGATIVE'
    | 'O_POSITIVE'
    | 'O_NEGATIVE'
  allergies?: string
  chronicDiseases?: string
  insurance?: string
}

export interface AppointmentInput {
  patientId: string
  doctorId: string
  date: Date
  duration: number
  type: 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'SURGERY' | 'CHECKUP'
  reason: string
  notes?: string
}

// Funciones de validación básicas
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function validatePassword(password: string): boolean {
  return password.length >= 8
}

export function validateRequired(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

// Validación de tipos para evitar errores en TypeScript estricto
export type UserRole = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type BloodType =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE'
export type AppointmentType = 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'SURGERY' | 'CHECKUP'

// Inicialización de valores por defecto para evitar errores de undefined
export const defaultUser: UserInput = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'PATIENT',
}

export const defaultPatient: PatientInput = {
  firstName: '',
  lastName: '',
  phone: '',
  dateOfBirth: new Date(),
  gender: 'OTHER',
}

export const defaultAppointment: AppointmentInput = {
  patientId: '',
  doctorId: '',
  date: new Date(),
  duration: 30,
  type: 'CONSULTATION',
  reason: '',
}
