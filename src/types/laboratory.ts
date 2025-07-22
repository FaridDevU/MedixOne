// Tipos para el sistema de laboratorio médico
export interface LabOrder {
  id: string
  patientId: string
  doctorId: string
  tests: string[]
  status: LabOrderStatus
  orderDate: Date
  dueDate?: Date
  notes?: string
  results?: LabResult[]
  createdAt: Date
  updatedAt: Date
}

export interface LabResult {
  testName: string
  value: string
  normalRange: string
  unit: string
  isNormal: boolean
  notes?: string
}

export interface CreateLabOrderData {
  patientId: string
  doctorId: string
  tests: string[]
  dueDate?: Date
  notes?: string
}

export type LabOrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

// Opciones para formularios
export const LAB_ORDER_STATUS_OPTIONS: Array<{
  value: LabOrderStatus
  label: string
  color: string
}> = [
  { value: 'PENDING', label: 'Pendiente', color: 'yellow' },
  { value: 'IN_PROGRESS', label: 'En Progreso', color: 'blue' },
  { value: 'COMPLETED', label: 'Completado', color: 'green' },
  { value: 'CANCELLED', label: 'Cancelado', color: 'red' },
]

// Utilidades
export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')

  return `LAB${year}${month}${day}${random}`
}

export function getLabOrderStatusLabel(status: LabOrderStatus): string {
  const option = LAB_ORDER_STATUS_OPTIONS.find((opt) => opt.value === status)
  return option?.label || status
}
