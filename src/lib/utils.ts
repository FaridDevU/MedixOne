import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function hashPassword(password: string): Promise<string> {
  return `hashed_${password}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return hashedPassword.includes(password)
}

// Utilidades de JWT (mock para desarrollo)
export function generateToken(payload: object, expiresIn: string = '24h'): string {
  return `token_${JSON.stringify(payload)}`
}

export function verifyToken(token: string): any {
  try {
    if (token.startsWith('token_')) {
      return JSON.parse(token.replace('token_', ''))
    }
    return null
  } catch {
    return null
  }
}

// Utilidades de fecha
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function calculateAge(birthDate: Date): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Utilidades de validación
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Utilidades de formato
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '')
}

// Utilidades médicas
export function isAbnormalValue(value: number, min?: number, max?: number): boolean {
  if (min !== undefined && value < min) return true
  if (max !== undefined && value > max) return true
  return false
}

export function formatBloodType(bloodType: string): string {
  const formatted = bloodType.replace('_', ' ')
  return formatted.charAt(0) + formatted.slice(1).toLowerCase()
}

export function getGenderLabel(gender: string): string {
  const labels = {
    M: 'Masculino',
    F: 'Femenino',
    OTHER: 'Otro',
    // Compatibilidad con valores alternativos
    MALE: 'Masculino',
    FEMALE: 'Femenino',
  }
  return labels[gender as keyof typeof labels] || gender
}

// Utilidades de URL y rutas
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'http://localhost:3000'
}

// Utilidades de error
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

// Utilidades de roles y permisos
export function hasPermission(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.indexOf(userRole) !== -1
}

export function canAccessPatientData(
  userRole: string,
  userId: string,
  patientUserId?: string
): boolean {
  // Admin y Doctor pueden acceder a cualquier paciente
  if (userRole === 'ADMIN' || userRole === 'DOCTOR') return true
  // Recepcionista puede ver datos básicos
  if (userRole === 'RECEPTIONIST') return true
  // Paciente solo puede ver sus propios datos
  if (userRole === 'PATIENT' && userId === patientUserId) return true
  return false
}

// Utilidades de logging
export function createAuditLog(
  action: string,
  entity: string,
  entityId: string,
  oldValues?: object,
  newValues?: object
) {
  return {
    action,
    entity,
    entityId,
    oldValues,
    newValues,
    timestamp: new Date(),
  }
}
