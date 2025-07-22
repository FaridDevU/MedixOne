export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Patient {
  id: string
  userId?: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  dateOfBirth: Date
  gender: Gender
  address?: string
  emergencyContact?: string
  bloodType?: BloodType
  allergies?: string
  chronicDiseases?: string
  insurance?: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Doctor {
  id: string
  userId: string
  specialization: string
  licenseNumber: string
  phone?: string
  biography?: string
  user: User
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  userId: string
  date: Date
  duration: number
  type: AppointmentType
  status: AppointmentStatus
  reason: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  patient: Patient
  doctor: Doctor
  user: User
}

export interface MedicalRecord {
  id: string
  patientId: string
  date: Date
  symptoms: string
  diagnosis: string
  treatment: string
  notes?: string
  followUp?: Date
  createdAt: Date
  updatedAt: Date
  patient: Patient
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  userId: string
  date: Date
  medications: Medication[]
  instructions?: string
  validUntil?: Date
  signed: boolean
  pdfPath?: string
  createdAt: Date
  updatedAt: Date
  patient: Patient
  doctor: Doctor
  user: User
}

export interface LabSample {
  id: string
  patientId: string
  sampleType: LabSampleType
  collectedAt: Date
  status: LabSampleStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
  patient: Patient
  labResults: LabResult[]
}

export interface LabResult {
  id: string
  patientId: string
  sampleId?: string
  userId: string
  testName: string
  testType: LabTestType
  value: string
  unit?: string
  referenceMin?: number
  referenceMax?: number
  status: LabResultStatus
  isAbnormal: boolean
  notes?: string
  testedAt: Date
  reportedAt?: Date
  createdAt: Date
  updatedAt: Date
  patient: Patient
  sample?: LabSample
  user: User
}

export interface Document {
  id: string
  patientId: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  category: DocumentType
  description?: string
  uploadedAt: Date
  createdAt: Date
  patient: Patient
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  entity: string
  entityId: string
  oldValues?: any
  newValues?: any
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  user: User
}

// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  RECEPTIONIST = 'RECEPTIONIST',
  PATIENT = 'PATIENT',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum BloodType {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE',
}

export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  FOLLOW_UP = 'FOLLOW_UP',
  EMERGENCY = 'EMERGENCY',
  SURGERY = 'SURGERY',
  CHECKUP = 'CHECKUP',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum LabSampleType {
  BLOOD = 'BLOOD',
  URINE = 'URINE',
  STOOL = 'STOOL',
  SALIVA = 'SALIVA',
  TISSUE = 'TISSUE',
  OTHER = 'OTHER',
}

export enum LabSampleStatus {
  COLLECTED = 'COLLECTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum LabTestType {
  BLOOD_COUNT = 'BLOOD_COUNT',
  CHEMISTRY = 'CHEMISTRY',
  IMMUNOLOGY = 'IMMUNOLOGY',
  MICROBIOLOGY = 'MICROBIOLOGY',
  PATHOLOGY = 'PATHOLOGY',
  RADIOLOGY = 'RADIOLOGY',
  OTHER = 'OTHER',
}

export enum LabResultStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REVIEWED = 'REVIEWED',
  CORRECTED = 'CORRECTED',
}

export enum DocumentType {
  ANALYSIS = 'ANALYSIS',
  STUDY = 'STUDY',
  REPORT = 'REPORT',
  IMAGE = 'IMAGE',
  OTHER = 'OTHER',
}

// Tipos de API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T = any> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Tipos de formularios
export interface LoginForm {
  email: string
  password: string
}

export interface PatientForm {
  firstName: string
  lastName: string
  email?: string
  phone: string
  dateOfBirth: Date
  gender: Gender
  address?: string
  emergencyContact?: string
  bloodType?: BloodType
  allergies?: string
  chronicDiseases?: string
  insurance?: string
}

export interface AppointmentForm {
  patientId: string
  doctorId: string
  date: Date
  duration: number
  type: AppointmentType
  reason: string
  notes?: string
}

// Tipos de Dashboard
export interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  pendingResults: number
  abnormalResults: number
  recentActivity: AuditLog[]
}

// Tipos de filtros
export interface PatientFilter {
  search?: string
  gender?: Gender
  ageRange?: {
    min: number
    max: number
  }
  bloodType?: BloodType
}

export interface AppointmentFilter {
  search?: string
  doctorId?: string
  status?: AppointmentStatus
  type?: AppointmentType
  dateRange?: {
    from: Date
    to: Date
  }
}
