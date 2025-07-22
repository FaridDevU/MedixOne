import { Patient } from './patient'

// Tipos locales para laboratorio
export type LabCategory =
  | 'HEMATOLOGY' // Hematología
  | 'BIOCHEMISTRY' // Bioquímica
  | 'IMMUNOLOGY' // Inmunología
  | 'MICROBIOLOGY' // Microbiología
  | 'CARDIOLOGY' // Cardiología
  | 'ENDOCRINOLOGY' // Endocrinología
  | 'URINANALYSIS' // Análisis de orina
  | 'TOXICOLOGY' // Toxicología
  | 'GENETICS' // Genética
  | 'PATHOLOGY' // Patología

// Tipos para el Portal del Paciente
export interface PatientPortalUser {
  id: string
  patientId: string
  email: string
  password?: string // Solo para creación/actualización
  isActive: boolean
  isEmailVerified: boolean
  lastLogin?: Date
  preferences: PatientPreferences
  createdAt: Date
  updatedAt: Date
  // Datos relacionados
  patient?: Patient
}

export interface PatientPreferences {
  language: 'es' | 'en'
  notifications: {
    email: boolean
    sms: boolean
    appointmentReminders: boolean
    resultNotifications: boolean
    billReminders: boolean
    promotions: boolean
  }
  privacy: {
    shareDataForResearch: boolean
    allowMarketing: boolean
  }
  accessibility: {
    fontSize: 'small' | 'medium' | 'large'
    highContrast: boolean
    screenReader: boolean
  }
}

export interface PatientDashboardData {
  upcomingAppointments: PatientAppointment[]
  recentResults: PatientLabResult[]
  activePrescriptions: PatientPrescription[]
  pendingBills: PatientBill[]
  healthMetrics: HealthMetric[]
  recentMessages: PatientMessage[]
  appointmentHistory: PatientAppointment[]
}

export interface PatientAppointment {
  id: string
  appointmentId: string
  date: Date
  time: string
  type: AppointmentType
  status: PatientAppointmentStatus
  doctor: {
    id: string
    name: string
    specialty: string
    photo?: string
  }
  location: {
    room?: string
    address?: string
    isVirtual: boolean
    virtualLink?: string
  }
  reason: string
  notes?: string
  canReschedule: boolean
  canCancel: boolean
  rescheduleDeadline?: Date
  cancelDeadline?: Date
  instructions?: string
  documents?: PatientDocument[]
}

export interface PatientLabResult {
  id: string
  labOrderId: string
  testName: string
  category: LabCategory
  status: PatientResultStatus
  orderDate: Date
  collectionDate?: Date
  resultDate?: Date
  doctor: {
    name: string
    specialty: string
  }
  results?: {
    summary: string
    details: LabResultDetail[]
    interpretation?: string
    recommendations?: string[]
  }
  documents: PatientDocument[]
  isRead: boolean
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
}

export interface LabResultDetail {
  parameter: string
  value: string | number
  unit?: string
  referenceRange: string
  status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL'
  flag?: 'H' | 'L' | 'HH' | 'LL'
}

export interface PatientPrescription {
  id: string
  prescriptionId: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  startDate: Date
  endDate?: Date
  status: PatientPrescriptionStatus
  refillsRemaining: number
  totalRefills: number
  doctor: {
    name: string
    specialty: string
  }
  pharmacy?: {
    name: string
    phone: string
    address: string
  }
  sideEffects?: string[]
  interactions?: string[]
  isRead: boolean
  canRequestRefill: boolean
}

export interface PatientBill {
  id: string
  invoiceId: string
  invoiceNumber: string
  date: Date
  dueDate: Date
  amount: number
  paidAmount: number
  balance: number
  status: PatientBillStatus
  services: {
    description: string
    amount: number
    date: Date
  }[]
  paymentMethods: PaymentMethodOption[]
  canPay: boolean
  isRead: boolean
  downloadUrl?: string
}

export interface HealthMetric {
  id: string
  type: HealthMetricType
  value: number
  unit: string
  date: Date
  source: 'PATIENT' | 'DOCTOR' | 'DEVICE'
  notes?: string
  targetRange?: {
    min: number
    max: number
  }
  status?: 'GOOD' | 'WARNING' | 'CRITICAL'
}

export interface PatientMessage {
  id: string
  subject: string
  content: string
  from: {
    type: 'DOCTOR' | 'NURSE' | 'ADMIN' | 'SYSTEM'
    name: string
    title?: string
  }
  to: string // Patient ID
  date: Date
  isRead: boolean
  priority: MessagePriority
  category: MessageCategory
  attachments?: PatientDocument[]
  replyTo?: string
  thread?: PatientMessage[]
}

export interface PatientDocument {
  id: string
  name: string
  type: DocumentType
  category: DocumentCategory
  url: string
  uploadDate: Date
  size: number
  mimeType: string
  description?: string
  isConfidential: boolean
}

export interface AppointmentRequest {
  doctorId: string
  appointmentType: AppointmentType
  preferredDates: Date[]
  preferredTimes: string[]
  reason: string
  isUrgent: boolean
  notes?: string
  isVirtual?: boolean
}

export interface PaymentMethodOption {
  id: string
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_ACCOUNT' | 'PAYPAL' | 'INSURANCE'
  name: string
  last4?: string
  expiryDate?: string
  isDefault: boolean
  fees?: {
    percentage: number
    fixed: number
  }
}

export interface MedicalHistoryEntry {
  id: string
  date: Date
  type: 'VISIT' | 'PROCEDURE' | 'DIAGNOSIS' | 'TREATMENT' | 'PRESCRIPTION' | 'LAB_RESULT'
  title: string
  description: string
  doctor: {
    name: string
    specialty: string
  }
  documents: PatientDocument[]
  isImportant: boolean
}

export type AppointmentType =
  | 'CONSULTATION' // Consulta
  | 'FOLLOW_UP' // Seguimiento
  | 'EMERGENCY' // Emergencia
  | 'PROCEDURE' // Procedimiento
  | 'VIRTUAL' // Telemedicina
  | 'LAB' // Laboratorio
  | 'IMAGING' // Imagenología

export type PatientAppointmentStatus =
  | 'SCHEDULED' // Programada
  | 'CONFIRMED' // Confirmada
  | 'CHECKED_IN' // Registrado
  | 'IN_PROGRESS' // En progreso
  | 'COMPLETED' // Completada
  | 'CANCELLED' // Cancelada
  | 'NO_SHOW' // No se presentó
  | 'RESCHEDULED' // Reprogramada

export type PatientResultStatus =
  | 'PENDING' // Pendiente
  | 'IN_PROGRESS' // En proceso
  | 'READY' // Listo
  | 'REVIEWED' // Revisado
  | 'ABNORMAL' // Anormal
  | 'CRITICAL' // Crítico

export type PatientPrescriptionStatus =
  | 'ACTIVE' // Activa
  | 'COMPLETED' // Completada
  | 'DISCONTINUED' // Descontinuada
  | 'EXPIRED' // Expirada
  | 'ON_HOLD' // En pausa

export type PatientBillStatus =
  | 'PENDING' // Pendiente
  | 'OVERDUE' // Vencida
  | 'PAID' // Pagada
  | 'PAYMENT_PLAN' // Plan de pagos
  | 'DISPUTED' // Disputada

export type HealthMetricType =
  | 'WEIGHT' // Peso
  | 'HEIGHT' // Altura
  | 'BLOOD_PRESSURE' // Presión arterial
  | 'HEART_RATE' // Frecuencia cardíaca
  | 'TEMPERATURE' // Temperatura
  | 'GLUCOSE' // Glucosa
  | 'CHOLESTEROL' // Colesterol
  | 'BMI' // Índice de masa corporal

export type MessagePriority =
  | 'LOW' // Baja
  | 'NORMAL' // Normal
  | 'HIGH' // Alta
  | 'URGENT' // Urgente

export type MessageCategory =
  | 'APPOINTMENT' // Citas
  | 'RESULTS' // Resultados
  | 'PRESCRIPTION' // Recetas
  | 'BILLING' // Facturación
  | 'GENERAL' // General
  | 'URGENT' // Urgente

export type DocumentType =
  | 'LAB_RESULT' // Resultado de laboratorio
  | 'IMAGING' // Imagenología
  | 'PRESCRIPTION' // Receta
  | 'INVOICE' // Factura
  | 'CONSENT' // Consentimiento
  | 'INSURANCE' // Seguro
  | 'IDENTIFICATION' // Identificación
  | 'OTHER' // Otros

export type DocumentCategory =
  | 'MEDICAL' // Médico
  | 'ADMINISTRATIVE' // Administrativo
  | 'INSURANCE' // Seguros
  | 'LEGAL' // Legal

// Opciones para formularios
export const APPOINTMENT_TYPES: Array<{
  value: AppointmentType
  label: string
  icon: string
  color: string
}> = [
  { value: 'CONSULTATION', label: 'Consulta Médica', icon: '🩺', color: 'blue' },
  { value: 'FOLLOW_UP', label: 'Seguimiento', icon: '📋', color: 'green' },
  { value: 'EMERGENCY', label: 'Emergencia', icon: '🚨', color: 'red' },
  { value: 'PROCEDURE', label: 'Procedimiento', icon: '⚕️', color: 'purple' },
  { value: 'VIRTUAL', label: 'Telemedicina', icon: '💻', color: 'indigo' },
  { value: 'LAB', label: 'Laboratorio', icon: '🧪', color: 'yellow' },
  { value: 'IMAGING', label: 'Imagenología', icon: '📷', color: 'pink' },
]

export const HEALTH_METRICS: Array<{
  value: HealthMetricType
  label: string
  unit: string
  icon: string
}> = [
  { value: 'WEIGHT', label: 'Peso', unit: 'kg', icon: '⚖️' },
  { value: 'HEIGHT', label: 'Altura', unit: 'cm', icon: '📏' },
  { value: 'BLOOD_PRESSURE', label: 'Presión Arterial', unit: 'mmHg', icon: '🩸' },
  { value: 'HEART_RATE', label: 'Frecuencia Cardíaca', unit: 'bpm', icon: '💓' },
  { value: 'TEMPERATURE', label: 'Temperatura', unit: '°C', icon: '🌡️' },
  { value: 'GLUCOSE', label: 'Glucosa', unit: 'mg/dL', icon: '🍭' },
  { value: 'CHOLESTEROL', label: 'Colesterol', unit: 'mg/dL', icon: '🧈' },
  { value: 'BMI', label: 'IMC', unit: 'kg/m²', icon: '📊' },
]

// Utilidades
export function getAppointmentStatusColor(status: PatientAppointmentStatus): string {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800'
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800'
    case 'CHECKED_IN':
      return 'bg-indigo-100 text-indigo-800'
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800'
    case 'NO_SHOW':
      return 'bg-red-100 text-red-800'
    case 'RESCHEDULED':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getResultStatusColor(status: PatientResultStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'READY':
      return 'bg-green-100 text-green-800'
    case 'REVIEWED':
      return 'bg-indigo-100 text-indigo-800'
    case 'ABNORMAL':
      return 'bg-orange-100 text-orange-800'
    case 'CRITICAL':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getHealthMetricStatus(
  value: number,
  targetRange?: { min: number; max: number }
): 'GOOD' | 'WARNING' | 'CRITICAL' {
  if (!targetRange) return 'GOOD'

  if (value < targetRange.min * 0.8 || value > targetRange.max * 1.2) {
    return 'CRITICAL'
  } else if (value < targetRange.min || value > targetRange.max) {
    return 'WARNING'
  } else {
    return 'GOOD'
  }
}

export function formatHealthMetricValue(type: HealthMetricType, value: number): string {
  const metric = HEALTH_METRICS.find((m) => m.value === type)
  if (!metric) return value.toString()

  switch (type) {
    case 'BLOOD_PRESSURE':
      // Asumiendo que el valor incluye sistólica y diastólica
      return `${Math.floor(value)}/${Math.floor((value % 1) * 100)}`
    case 'TEMPERATURE':
      return value.toFixed(1)
    case 'BMI':
      return value.toFixed(1)
    default:
      return Math.round(value).toString()
  }
}

export function calculateAge(birthDate: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export function getTimeUntilAppointment(appointmentDate: Date): string {
  const now = new Date()
  const diff = appointmentDate.getTime() - now.getTime()

  if (diff < 0) return 'Pasada'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) {
    return `En ${days} día${days > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `En ${hours} hora${hours > 1 ? 's' : ''}`
  } else if (minutes > 0) {
    return `En ${minutes} minuto${minutes > 1 ? 's' : ''}`
  } else {
    return 'Ahora'
  }
}

export function isAppointmentUpcoming(appointmentDate: Date): boolean {
  const now = new Date()
  const diff = appointmentDate.getTime() - now.getTime()
  return diff > 0 && diff <= 24 * 60 * 60 * 1000 // Próximas 24 horas
}

export function canCancelAppointment(appointment: PatientAppointment): boolean {
  if (!appointment.canCancel || !appointment.cancelDeadline) return false
  return new Date() < appointment.cancelDeadline
}

export function canRescheduleAppointment(appointment: PatientAppointment): boolean {
  if (!appointment.canReschedule || !appointment.rescheduleDeadline) return false
  return new Date() < appointment.rescheduleDeadline
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getDocumentIcon(type: DocumentType): string {
  switch (type) {
    case 'LAB_RESULT':
      return '🧪'
    case 'IMAGING':
      return '📷'
    case 'PRESCRIPTION':
      return '💊'
    case 'INVOICE':
      return '📄'
    case 'CONSENT':
      return '✍️'
    case 'INSURANCE':
      return '🛡️'
    case 'IDENTIFICATION':
      return '🆔'
    default:
      return '📋'
  }
}
