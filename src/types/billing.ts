// Tipos para el sistema de facturación médica
export interface Invoice {
  id: string
  invoiceNumber: string
  patientId: string
  doctorId: string
  appointmentId?: string
  invoiceDate: Date
  dueDate: Date
  status: InvoiceStatus
  paymentStatus: PaymentStatus
  items: InvoiceItem[]
  subtotal: number
  taxes: InvoiceTax[]
  totalTax: number
  discounts: InvoiceDiscount[]
  totalDiscount: number
  total: number
  paidAmount: number
  balance: number
  currency: string
  paymentMethod?: PaymentMethod
  paymentDate?: Date
  notes?: string
  terms?: string
  isRecurring: boolean
  recurringConfig?: RecurringConfig
  insuranceInfo?: InsuranceInfo
  createdAt: Date
  updatedAt: Date
  // Datos relacionados
  patient?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address?: string
    insuranceId?: string
  }
  doctor?: {
    id: string
    firstName: string
    lastName: string
    specialty: string
    license: string
  }
}

export interface InvoiceItem {
  id: string
  serviceId: string
  description: string
  category: ServiceCategory
  quantity: number
  unitPrice: number
  discount: number
  total: number
  isTaxable: boolean
  notes?: string
  // Datos del servicio
  service?: MedicalService
}

export interface MedicalService {
  id: string
  name: string
  code: string
  category: ServiceCategory
  description?: string
  basePrice: number
  duration: number // en minutos
  isActive: boolean
  isTaxable: boolean
  insuranceCoverage: InsuranceCoverage[]
  requirements?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface InsuranceCoverage {
  insuranceId: string
  coveragePercentage: number
  maxAmount?: number
  deductible?: number
  copay?: number
  requiresPreAuth: boolean
}

export interface InvoiceTax {
  id: string
  name: string
  rate: number
  amount: number
  isInclusive: boolean
}

export interface InvoiceDiscount {
  id: string
  name: string
  type: DiscountType
  value: number
  amount: number
  reason?: string
}

export interface RecurringConfig {
  frequency: RecurringFrequency
  interval: number
  endDate?: Date
  maxOccurrences?: number
  nextInvoiceDate: Date
}

export interface InsuranceInfo {
  insuranceId: string
  policyNumber: string
  groupNumber?: string
  coveragePercentage: number
  deductible: number
  copay: number
  maxBenefit?: number
  preAuthRequired: boolean
  preAuthNumber?: string
  claimNumber?: string
  // Datos de la aseguradora
  insurance?: Insurance
}

export interface Insurance {
  id: string
  name: string
  code: string
  type: InsuranceType
  contactInfo: {
    phone: string
    email: string
    website?: string
    address: string
  }
  coverageTypes: ServiceCategory[]
  defaultCoverage: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  invoiceId: string
  paymentNumber: string
  amount: number
  paymentDate: Date
  paymentMethod: PaymentMethod
  reference?: string
  notes?: string
  status: PaymentStatus
  processedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PaymentPlan {
  id: string
  invoiceId: string
  totalAmount: number
  installments: PaymentInstallment[]
  status: PaymentPlanStatus
  createdAt: Date
  updatedAt: Date
}

export interface PaymentInstallment {
  id: string
  installmentNumber: number
  amount: number
  dueDate: Date
  paidDate?: Date
  status: InstallmentStatus
}

export type InvoiceStatus =
  | 'DRAFT' // Borrador
  | 'PENDING' // Pendiente
  | 'SENT' // Enviada
  | 'VIEWED' // Vista por el paciente
  | 'OVERDUE' // Vencida
  | 'CANCELLED' // Cancelada
  | 'REFUNDED' // Reembolsada

export type PaymentStatus =
  | 'UNPAID' // Sin pagar
  | 'PARTIAL' // Pago parcial
  | 'PAID' // Pagada
  | 'OVERPAID' // Sobrepago
  | 'REFUNDED' // Reembolsada

export type PaymentMethod =
  | 'CASH' // Efectivo
  | 'CREDIT_CARD' // Tarjeta de crédito
  | 'DEBIT_CARD' // Tarjeta de débito
  | 'BANK_TRANSFER' // Transferencia bancaria
  | 'CHECK' // Cheque
  | 'INSURANCE' // Seguro médico
  | 'FINANCING' // Financiamiento
  | 'OTHER' // Otros

export type ServiceCategory =
  | 'CONSULTATION' // Consulta
  | 'PROCEDURE' // Procedimiento
  | 'LABORATORY' // Laboratorio
  | 'IMAGING' // Imagenología
  | 'THERAPY' // Terapia
  | 'SURGERY' // Cirugía
  | 'EMERGENCY' // Emergencia
  | 'VACCINATION' // Vacunación
  | 'MEDICATION' // Medicamentos
  | 'EQUIPMENT' // Equipos/Materiales
  | 'ACCOMMODATION' // Hospitalización
  | 'OTHER' // Otros

export type DiscountType =
  | 'PERCENTAGE' // Porcentaje
  | 'FIXED' // Cantidad fija
  | 'INSURANCE' // Descuento por seguro
  | 'SENIOR' // Descuento tercera edad
  | 'STUDENT' // Descuento estudiante
  | 'EMPLOYEE' // Descuento empleado

export type RecurringFrequency =
  | 'WEEKLY' // Semanal
  | 'MONTHLY' // Mensual
  | 'QUARTERLY' // Trimestral
  | 'YEARLY' // Anual

export type InsuranceType =
  | 'PRIVATE' // Privado
  | 'PUBLIC' // Público
  | 'MIXED' // Mixto

export type PaymentPlanStatus =
  | 'ACTIVE' // Activo
  | 'COMPLETED' // Completado
  | 'DEFAULTED' // En mora
  | 'CANCELLED' // Cancelado

export type InstallmentStatus =
  | 'PENDING' // Pendiente
  | 'PAID' // Pagada
  | 'OVERDUE' // Vencida
  | 'CANCELLED' // Cancelada

export interface InvoiceFormData {
  patientId: string
  doctorId: string
  appointmentId: string
  dueDate: string
  items: InvoiceItemData[]
  notes: string
  terms: string
  applyInsurance: boolean
  insuranceInfo?: {
    insuranceId: string
    policyNumber: string
    preAuthNumber: string
  }
  discounts: {
    type: DiscountType
    value: number
    reason: string
  }[]
  isRecurring: boolean
  recurringConfig?: {
    frequency: RecurringFrequency
    interval: number
    endDate: string
  }
}

export interface InvoiceItemData {
  serviceId: string
  quantity: number
  unitPrice: number
  discount: number
  notes: string
}

// Opciones para formularios
export const INVOICE_STATUS_OPTIONS: Array<{ value: InvoiceStatus; label: string; color: string }> =
  [
    { value: 'DRAFT', label: 'Borrador', color: 'gray' },
    { value: 'PENDING', label: 'Pendiente', color: 'yellow' },
    { value: 'SENT', label: 'Enviada', color: 'blue' },
    { value: 'VIEWED', label: 'Vista', color: 'indigo' },
    { value: 'OVERDUE', label: 'Vencida', color: 'red' },
    { value: 'CANCELLED', label: 'Cancelada', color: 'gray' },
    { value: 'REFUNDED', label: 'Reembolsada', color: 'purple' },
  ]

export const PAYMENT_STATUS_OPTIONS: Array<{ value: PaymentStatus; label: string; color: string }> =
  [
    { value: 'UNPAID', label: 'Sin Pagar', color: 'red' },
    { value: 'PARTIAL', label: 'Pago Parcial', color: 'yellow' },
    { value: 'PAID', label: 'Pagada', color: 'green' },
    { value: 'OVERPAID', label: 'Sobrepago', color: 'blue' },
    { value: 'REFUNDED', label: 'Reembolsada', color: 'purple' },
  ]

export const PAYMENT_METHODS: Array<{ value: PaymentMethod; label: string; icon: string }> = [
  { value: 'CASH', label: 'Efectivo', icon: '💵' },
  { value: 'CREDIT_CARD', label: 'Tarjeta de Crédito', icon: '💳' },
  { value: 'DEBIT_CARD', label: 'Tarjeta de Débito', icon: '💳' },
  { value: 'BANK_TRANSFER', label: 'Transferencia', icon: '🏦' },
  { value: 'CHECK', label: 'Cheque', icon: '📝' },
  { value: 'INSURANCE', label: 'Seguro Médico', icon: '🛡️' },
  { value: 'FINANCING', label: 'Financiamiento', icon: '📊' },
  { value: 'OTHER', label: 'Otros', icon: '💰' },
]

export const SERVICE_CATEGORIES: Array<{
  value: ServiceCategory
  label: string
  icon: string
  color: string
}> = [
  { value: 'CONSULTATION', label: 'Consulta', icon: '🩺', color: 'blue' },
  { value: 'PROCEDURE', label: 'Procedimiento', icon: '⚕️', color: 'green' },
  { value: 'LABORATORY', label: 'Laboratorio', icon: '🧪', color: 'purple' },
  { value: 'IMAGING', label: 'Imagenología', icon: '📷', color: 'indigo' },
  { value: 'THERAPY', label: 'Terapia', icon: '🤲', color: 'teal' },
  { value: 'SURGERY', label: 'Cirugía', icon: '🔪', color: 'red' },
  { value: 'EMERGENCY', label: 'Emergencia', icon: '🚨', color: 'orange' },
  { value: 'VACCINATION', label: 'Vacunación', icon: '💉', color: 'green' },
  { value: 'MEDICATION', label: 'Medicamentos', icon: '💊', color: 'pink' },
  { value: 'EQUIPMENT', label: 'Equipos', icon: '🔧', color: 'gray' },
  { value: 'ACCOMMODATION', label: 'Hospitalización', icon: '🏥', color: 'blue' },
  { value: 'OTHER', label: 'Otros', icon: '📋', color: 'gray' },
]

export const DISCOUNT_TYPES: Array<{ value: DiscountType; label: string }> = [
  { value: 'PERCENTAGE', label: 'Porcentaje (%)' },
  { value: 'FIXED', label: 'Cantidad Fija' },
  { value: 'INSURANCE', label: 'Descuento por Seguro' },
  { value: 'SENIOR', label: 'Tercera Edad' },
  { value: 'STUDENT', label: 'Estudiante' },
  { value: 'EMPLOYEE', label: 'Empleado' },
]

export const RECURRING_FREQUENCIES: Array<{ value: RecurringFrequency; label: string }> = [
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensual' },
  { value: 'QUARTERLY', label: 'Trimestral' },
  { value: 'YEARLY', label: 'Anual' },
]

// Utilidades
export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')

  return `INV${year}${month}${day}${random}`
}

export function generatePaymentNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')

  return `PAY${year}${month}${day}${random}`
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],
  taxes: InvoiceTax[],
  discounts: InvoiceDiscount[]
) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const totalTax = taxes.reduce((sum, tax) => sum + tax.amount, 0)
  const totalDiscount = discounts.reduce((sum, discount) => sum + discount.amount, 0)
  const total = subtotal + totalTax - totalDiscount

  return { subtotal, totalTax, totalDiscount, total }
}

export function calculateItemTotal(quantity: number, unitPrice: number, discount: number): number {
  const subtotal = quantity * unitPrice
  return subtotal - discount
}

export function calculateTaxAmount(amount: number, rate: number, isInclusive: boolean): number {
  if (isInclusive) {
    return amount - amount / (1 + rate / 100)
  } else {
    return amount * (rate / 100)
  }
}

export function calculateDiscountAmount(amount: number, type: DiscountType, value: number): number {
  switch (type) {
    case 'PERCENTAGE':
      return amount * (value / 100)
    case 'FIXED':
      return Math.min(value, amount)
    default:
      return 0
  }
}

export function getInvoiceStatusLabel(status: InvoiceStatus): string {
  const option = INVOICE_STATUS_OPTIONS.find((opt) => opt.value === status)
  return option?.label || status
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  const option = PAYMENT_STATUS_OPTIONS.find((opt) => opt.value === status)
  return option?.label || status
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  const option = PAYMENT_METHODS.find((opt) => opt.value === method)
  return option?.label || method
}

export function getServiceCategoryLabel(category: ServiceCategory): string {
  const option = SERVICE_CATEGORIES.find((opt) => opt.value === category)
  return option?.label || category
}

export function getServiceCategoryIcon(category: ServiceCategory): string {
  const option = SERVICE_CATEGORIES.find((opt) => opt.value === category)
  return option?.icon || '📋'
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function isInvoiceOverdue(dueDate: Date): boolean {
  return new Date() > dueDate
}

export function calculateDaysOverdue(dueDate: Date): number {
  if (!isInvoiceOverdue(dueDate)) return 0
  const diffTime = new Date().getTime() - dueDate.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getInvoiceAging(invoices: Invoice[]): {
  current: number
  thirtyDays: number
  sixtyDays: number
  ninetyDays: number
  overNinety: number
} {
  const aging = {
    current: 0,
    thirtyDays: 0,
    sixtyDays: 0,
    ninetyDays: 0,
    overNinety: 0,
  }

  invoices.forEach((invoice) => {
    if (invoice.paymentStatus === 'PAID') return

    const daysOverdue = calculateDaysOverdue(invoice.dueDate)
    const balance = invoice.balance

    if (daysOverdue <= 0) {
      aging.current += balance
    } else if (daysOverdue <= 30) {
      aging.thirtyDays += balance
    } else if (daysOverdue <= 60) {
      aging.sixtyDays += balance
    } else if (daysOverdue <= 90) {
      aging.ninetyDays += balance
    } else {
      aging.overNinety += balance
    }
  })

  return aging
}

export function generatePaymentPlan(
  totalAmount: number,
  installments: number,
  startDate: Date
): PaymentInstallment[] {
  const installmentAmount = totalAmount / installments
  const plan: PaymentInstallment[] = []

  for (let i = 0; i < installments; i++) {
    const dueDate = new Date(startDate)
    dueDate.setMonth(dueDate.getMonth() + i)

    plan.push({
      id: Math.random().toString(36).substr(2, 9),
      installmentNumber: i + 1,
      amount:
        i === installments - 1
          ? totalAmount - installmentAmount * (installments - 1) // Ajustar último pago por redondeo
          : installmentAmount,
      dueDate,
      status: 'PENDING',
    })
  }

  return plan
}
