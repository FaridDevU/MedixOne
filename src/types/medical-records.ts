// Tipos de eventos médicos
export type MedicalEventType =
  | 'CONSULTATION'
  | 'DIAGNOSIS'
  | 'TREATMENT'
  | 'MEDICATION'
  | 'ALLERGY'
  | 'SURGERY'
  | 'HOSPITALIZATION'
  | 'EMERGENCY'
  | 'LAB_RESULT'
  | 'IMAGING'
  | 'VACCINATION'
  | 'VITAL_SIGNS'
  | 'REFERRAL'
  | 'FOLLOW_UP'
  | 'NOTE'

// Nivel de criticidad
export type CriticalityLevel = 'NORMAL' | 'HIGH' | 'CRITICAL' | 'EMERGENCY'

// Especialidades médicas
export type MedicalSpecialty =
  | 'GENERAL_MEDICINE'
  | 'CARDIOLOGY'
  | 'ENDOCRINOLOGY'
  | 'NEUROLOGY'
  | 'PEDIATRICS'
  | 'GYNECOLOGY'
  | 'DERMATOLOGY'
  | 'PSYCHIATRY'
  | 'OPHTHALMOLOGY'
  | 'TRAUMATOLOGY'
  | 'ONCOLOGY'
  | 'RADIOLOGY'

// Tipos de notas médicas
export type MedicalNoteType =
  | 'EVOLUTION'
  | 'DIAGNOSIS'
  | 'TREATMENT'
  | 'PROCEDURE'
  | 'CONSULTATION'
  | 'INTERCONSULTATION'
  | 'DISCHARGE'
  | 'FOLLOW_UP'

// Estado de aprobación
export type ApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'

// Signos vitales
export interface VitalSigns {
  id: string
  patientId: string
  recordedAt: Date
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  heartRate?: number
  temperature?: number
  oxygenSaturation?: number
  respiratoryRate?: number
  weight?: number
  height?: number
  bmi?: number
  notes?: string
  recordedBy: string
}

// Evento médico en el timeline
export interface MedicalEvent {
  id: string
  patientId: string
  type: MedicalEventType
  title: string
  description: string
  date: Date
  doctorId: string
  doctorName: string
  specialty: MedicalSpecialty
  criticality: CriticalityLevel
  location?: string
  duration?: number
  outcome?: string
  followUpRequired: boolean
  followUpDate?: Date
  relatedEvents: string[]
  attachments: string[]
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// Nota médica
export interface MedicalNote {
  id: string
  patientId: string
  type: MedicalNoteType
  title: string
  content: string
  specialty: MedicalSpecialty
  authorId: string
  authorName: string
  createdAt: Date
  updatedAt: Date
  approvalStatus: ApprovalStatus
  approvedBy?: string
  approvedAt?: Date
  tags: string[]
  isConfidential: boolean
  relatedEventId?: string
  templateId?: string
  version: number
}

// Evolución médica
export interface MedicalEvolution {
  id: string
  patientId: string
  date: Date
  subjective: string
  objective: string
  assessment: string
  plan: string
  doctorId: string
  doctorName: string
  vitalSigns?: VitalSigns
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    startDate: Date
    endDate?: Date
    notes?: string
  }>
  nextAppointment?: Date
  followUpInstructions: string
  createdAt: Date
  updatedAt: Date
}

// Historia clínica completa del paciente
export interface MedicalRecord {
  id: string
  patientId: string
  patient: {
    id: string
    firstName: string
    lastName: string
    dateOfBirth: Date
    gender: string
    bloodType?: string
    allergies: string[]
    photo?: string
  }
  criticalInfo: {
    allergies: Array<{
      substance: string
      severity: 'MILD' | 'MODERATE' | 'SEVERE'
      reaction: string
      verifiedDate: Date
    }>
    chronicDiseases: Array<{
      condition: string
      diagnosedDate: Date
      status: 'ACTIVE' | 'CONTROLLED' | 'REMISSION'
      managingDoctor: string
    }>
    currentMedications: Array<{
      medication: string
      dosage: string
      frequency: string
      prescribedBy: string
      startDate: Date
      endDate?: Date
    }>
  }
  timeline: MedicalEvent[]
  notes: MedicalNote[]
  evolutions: MedicalEvolution[]
  recentVitalSigns: VitalSigns[]
  statistics: {
    totalConsultations: number
    totalHospitalizations: number
    lastConsultationDate?: Date
    averageTimeBetweenVisits: number
    riskScore: number
    complianceScore: number
  }
  createdAt: Date
  updatedAt: Date
  lastAccessedAt: Date
  accessHistory: Array<{
    userId: string
    userName: string
    accessDate: Date
    action: string
  }>
}

// Plantillas de notas por especialidad
export interface NoteTemplate {
  id: string
  name: string
  specialty: MedicalSpecialty
  type: MedicalNoteType
  template: string
  fields: Array<{
    name: string
    type: 'text' | 'number' | 'date' | 'select' | 'multiselect'
    required: boolean
    options?: string[]
    defaultValue?: any
  }>
  isActive: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// Filtros para el timeline médico
export interface TimelineFilters {
  dateFrom?: Date
  dateTo?: Date
  eventTypes?: MedicalEventType[]
  specialties?: MedicalSpecialty[]
  doctors?: string[]
  criticality?: CriticalityLevel[]
  searchTerm?: string
}

// Configuración de vista de historia clínica
export interface MedicalRecordViewConfig {
  showTimeline: boolean
  showNotes: boolean
  showEvolutions: boolean
  showVitalSigns: boolean
  showCriticalInfo: boolean
  timelineGroupBy: 'DATE' | 'TYPE' | 'SPECIALTY'
  defaultTimeRange: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' | 'ALL'
}

// Data mock para desarrollo
export const mockMedicalRecord: MedicalRecord = {
  id: 'record-001',
  patientId: 'pat-001',
  patient: {
    id: 'pat-001',
    firstName: 'María',
    lastName: 'González López',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'FEMALE',
    bloodType: 'O+',
    allergies: ['Penicilina', 'Mariscos'],
    photo: '/patients/maria-gonzalez.jpg',
  },
  criticalInfo: {
    allergies: [
      {
        substance: 'Penicilina',
        severity: 'SEVERE',
        reaction: 'Anafilaxia',
        verifiedDate: new Date('2020-05-15'),
      },
      {
        substance: 'Mariscos',
        severity: 'MODERATE',
        reaction: 'Urticaria, dificultad respiratoria',
        verifiedDate: new Date('2018-08-22'),
      },
    ],
    chronicDiseases: [
      {
        condition: 'Diabetes Mellitus Tipo 2',
        diagnosedDate: new Date('2019-03-10'),
        status: 'CONTROLLED',
        managingDoctor: 'Dr. José Martínez',
      },
      {
        condition: 'Hipertensión Arterial',
        diagnosedDate: new Date('2020-01-15'),
        status: 'CONTROLLED',
        managingDoctor: 'Dr. Ana López',
      },
    ],
    currentMedications: [
      {
        medication: 'Metformina 850mg',
        dosage: '850mg',
        frequency: 'BID',
        prescribedBy: 'Dr. José Martínez',
        startDate: new Date('2019-03-10'),
      },
      {
        medication: 'Losartán 50mg',
        dosage: '50mg',
        frequency: 'QD',
        prescribedBy: 'Dr. Ana López',
        startDate: new Date('2020-01-15'),
      },
    ],
  },
  timeline: [
    {
      id: 'event-001',
      patientId: 'pat-001',
      type: 'CONSULTATION',
      title: 'Control rutinario de diabetes',
      description: 'Consulta de seguimiento para control glucémico y ajuste de tratamiento',
      date: new Date('2024-01-15'),
      doctorId: 'doc-001',
      doctorName: 'Dr. José Martínez',
      specialty: 'ENDOCRINOLOGY',
      criticality: 'NORMAL',
      location: 'Consultorio 3',
      duration: 30,
      outcome: 'Paciente estable, control glucémico adecuado',
      followUpRequired: true,
      followUpDate: new Date('2024-04-15'),
      relatedEvents: [],
      attachments: [],
      metadata: {},
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ],
  notes: [],
  evolutions: [],
  recentVitalSigns: [
    {
      id: 'vital-001',
      patientId: 'pat-001',
      recordedAt: new Date('2024-01-15'),
      bloodPressureSystolic: 130,
      bloodPressureDiastolic: 80,
      heartRate: 72,
      temperature: 36.5,
      oxygenSaturation: 98,
      respiratoryRate: 16,
      weight: 65,
      height: 165,
      bmi: 23.9,
      notes: 'Signos vitales dentro de parámetros normales',
      recordedBy: 'Enf. Carmen López',
    },
  ],
  statistics: {
    totalConsultations: 12,
    totalHospitalizations: 0,
    lastConsultationDate: new Date('2024-01-15'),
    averageTimeBetweenVisits: 90,
    riskScore: 4,
    complianceScore: 85,
  },
  createdAt: new Date('2019-03-10'),
  updatedAt: new Date('2024-01-15'),
  lastAccessedAt: new Date('2024-01-15'),
  accessHistory: [
    {
      userId: 'doc-001',
      userName: 'Dr. José Martínez',
      accessDate: new Date('2024-01-15'),
      action: 'VIEW_RECORD',
    },
  ],
}

// Función helper para obtener el color por tipo de evento
export const getEventTypeColor = (type: MedicalEventType): string => {
  const colors: Record<MedicalEventType, string> = {
    CONSULTATION: 'bg-blue-100 text-blue-800 border-blue-200',
    DIAGNOSIS: 'bg-purple-100 text-purple-800 border-purple-200',
    TREATMENT: 'bg-green-100 text-green-800 border-green-200',
    MEDICATION: 'bg-orange-100 text-orange-800 border-orange-200',
    ALLERGY: 'bg-red-100 text-red-800 border-red-200',
    SURGERY: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    HOSPITALIZATION: 'bg-gray-100 text-gray-800 border-gray-200',
    EMERGENCY: 'bg-red-100 text-red-800 border-red-200',
    LAB_RESULT: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    IMAGING: 'bg-teal-100 text-teal-800 border-teal-200',
    VACCINATION: 'bg-lime-100 text-lime-800 border-lime-200',
    VITAL_SIGNS: 'bg-pink-100 text-pink-800 border-pink-200',
    REFERRAL: 'bg-amber-100 text-amber-800 border-amber-200',
    FOLLOW_UP: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    NOTE: 'bg-slate-100 text-slate-800 border-slate-200',
  }
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// Función helper para obtener el icono por tipo de evento
export const getEventTypeIcon = (type: MedicalEventType): string => {
  const icons: Record<MedicalEventType, string> = {
    CONSULTATION: 'stethoscope',
    DIAGNOSIS: 'clipboard',
    TREATMENT: 'activity',
    MEDICATION: 'pill',
    ALLERGY: 'alert-triangle',
    SURGERY: 'scissors',
    HOSPITALIZATION: 'bed',
    EMERGENCY: 'zap',
    LAB_RESULT: 'test-tube',
    IMAGING: 'scan',
    VACCINATION: 'syringe',
    VITAL_SIGNS: 'heart',
    REFERRAL: 'arrow-right',
    FOLLOW_UP: 'clock',
    NOTE: 'file-text',
  }
  return icons[type] || 'file'
}

// Función helper para obtener el color por nivel de criticidad
export const getCriticalityColor = (criticality: CriticalityLevel): string => {
  const colors: Record<CriticalityLevel, string> = {
    NORMAL: 'text-green-600 bg-green-100',
    HIGH: 'text-yellow-600 bg-yellow-100',
    CRITICAL: 'text-red-600 bg-red-100',
    EMERGENCY: 'text-red-800 bg-red-200',
  }
  return colors[criticality]
}
