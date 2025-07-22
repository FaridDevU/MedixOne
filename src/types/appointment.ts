// Tipos para el sistema de citas médicas
export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: Date
  duration: number // en minutos
  status: AppointmentStatus
  type: string
  reason?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateAppointmentData {
  patientId: string
  doctorId: string
  date: Date
  duration: number
  type: string
  reason?: string
  notes?: string
}
