// Tipos para el sistema de notificaciones

// Tipos de notificación
export type NotificationType =
  | 'APPOINTMENT_REMINDER'
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_RESCHEDULED'
  | 'LAB_RESULTS_READY'
  | 'LAB_RESULTS_CRITICAL'
  | 'PRESCRIPTION_READY'
  | 'PRESCRIPTION_REFILL_DUE'
  | 'BILL_PAYMENT_DUE'
  | 'BILL_OVERDUE'
  | 'BILL_PAYMENT_RECEIVED'
  | 'MEDICAL_RECORD_UPDATED'
  | 'SYSTEM_MAINTENANCE'
  | 'SECURITY_ALERT'
  | 'WELCOME_MESSAGE'
  | 'BIRTHDAY_WISHES'
  | 'HEALTH_TIP'
  | 'SURVEY_REQUEST'
  | 'CUSTOM_MESSAGE'

// Canales de comunicación
export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP' | 'PHONE_CALL'

// Estado de notificación
export type NotificationStatus =
  | 'PENDING' // Pendiente de envío
  | 'QUEUED' // En cola
  | 'SENDING' // Enviando
  | 'SENT' // Enviado
  | 'DELIVERED' // Entregado
  | 'READ' // Leído
  | 'FAILED' // Falló
  | 'CANCELLED' // Cancelado
  | 'SCHEDULED' // Programado

// Prioridad de notificación
export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL'

// Audiencia objetivo
export type NotificationAudience =
  | 'ALL_PATIENTS'
  | 'ALL_STAFF'
  | 'SPECIFIC_USERS'
  | 'DEPARTMENT'
  | 'ROLE_BASED'
  | 'LOCATION_BASED'
  | 'AGE_GROUP'
  | 'CONDITION_BASED'

// Interfaz principal de notificación
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  channels: NotificationChannel[]
  priority: NotificationPriority
  status: NotificationStatus
  recipientId: string
  recipientEmail: string
  recipientPhone?: string
  senderId?: string
  senderName?: string
  templateId?: string
  variables?: Record<string, any>
  scheduledAt?: Date
  sentAt?: Date
  deliveredAt?: Date
  readAt?: Date
  failureReason?: string
  retryCount: number
  maxRetries: number
  metadata: {
    appointmentId?: string
    patientId?: string
    billId?: string
    resultId?: string
    prescriptionId?: string
    source: string
    campaign?: string
    tracking?: {
      opened: boolean
      clicked: boolean
      clickedLinks: string[]
      deviceInfo?: string
      location?: string
    }
  }
  createdAt: Date
  updatedAt: Date
}

// Template de notificación
export interface NotificationTemplate {
  id: string
  name: string
  type: NotificationType
  title: string
  messageText: string
  messageHtml?: string
  smsMessage?: string
  pushMessage?: string
  variables: TemplateVariable[]
  channels: NotificationChannel[]
  isActive: boolean
  isDefault: boolean
  language: 'es' | 'en'
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  usageCount: number
  lastUsed?: Date
}

// Variable de template
export interface TemplateVariable {
  name: string
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'EMAIL' | 'PHONE' | 'URL'
  description: string
  required: boolean
  defaultValue?: string
  format?: string // Para fechas y números
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

// Configuración de envío
export interface NotificationConfig {
  id: string
  type: NotificationType
  isEnabled: boolean
  channels: NotificationChannel[]
  timing: {
    sendImmediately: boolean
    delay?: number // minutos
    scheduleTime?: string // HH:mm
    daysInAdvance?: number
    reminderIntervals?: number[] // días antes
  }
  frequency: {
    maxPerDay: number
    maxPerWeek: number
    cooldownPeriod: number // minutos entre notificaciones del mismo tipo
  }
  audience: {
    type: NotificationAudience
    filters?: {
      departments?: string[]
      roles?: string[]
      locations?: string[]
      ageRange?: { min: number; max: number }
      conditions?: string[]
      tags?: string[]
    }
  }
  template: {
    templateId: string
    fallbackTemplateId?: string
  }
  delivery: {
    retryAttempts: number
    retryDelay: number // minutos
    failureNotification: boolean
    requireDeliveryConfirmation: boolean
  }
  tracking: {
    trackOpens: boolean
    trackClicks: boolean
    trackLocation: boolean
    analyticsEnabled: boolean
  }
}

// Campaña de notificaciones
export interface NotificationCampaign {
  id: string
  name: string
  description: string
  type: 'BROADCAST' | 'TARGETED' | 'TRIGGERED' | 'SCHEDULED'
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  audience: {
    type: NotificationAudience
    totalRecipients: number
    filters: Record<string, any>
  }
  content: {
    templateId: string
    variables: Record<string, any>
    testMode: boolean
  }
  schedule: {
    startDate: Date
    endDate?: Date
    sendTime?: string // HH:mm
    timezone: string
    frequency?: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
  }
  delivery: {
    channels: NotificationChannel[]
    priority: NotificationPriority
    batchSize: number
    delayBetweenBatches: number // minutos
  }
  statistics: {
    totalSent: number
    totalDelivered: number
    totalFailed: number
    totalOpened: number
    totalClicked: number
    deliveryRate: number
    openRate: number
    clickRate: number
    bounceRate: number
    unsubscribeRate: number
  }
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

// Suscripción de usuario
export interface NotificationSubscription {
  id: string
  userId: string
  userEmail: string
  preferences: {
    [key in NotificationType]?: {
      enabled: boolean
      channels: NotificationChannel[]
      frequency: 'IMMEDIATE' | 'DAILY_DIGEST' | 'WEEKLY_DIGEST' | 'MONTHLY_DIGEST'
      quietHours?: {
        start: string // HH:mm
        end: string // HH:mm
        timezone: string
      }
    }
  }
  globalSettings: {
    enabled: boolean
    channels: NotificationChannel[]
    language: 'es' | 'en'
    timezone: string
    doNotDisturb: boolean
    marketingConsent: boolean
    dataProcessingConsent: boolean
  }
  deviceTokens: {
    fcm?: string[]
    apns?: string[]
    web?: string[]
  }
  unsubscribeToken: string
  createdAt: Date
  updatedAt: Date
}

// Cola de notificaciones
export interface NotificationQueue {
  id: string
  notificationId: string
  priority: NotificationPriority
  scheduledAt: Date
  attempts: number
  maxAttempts: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  processingStartedAt?: Date
  processingCompletedAt?: Date
  errorMessage?: string
  createdAt: Date
}

// Estadísticas de notificaciones
export interface NotificationStats {
  period: {
    start: Date
    end: Date
  }
  totals: {
    sent: number
    delivered: number
    failed: number
    opened: number
    clicked: number
  }
  byChannel: {
    [key in NotificationChannel]: {
      sent: number
      delivered: number
      failed: number
      deliveryRate: number
    }
  }
  byType: {
    [key in NotificationType]: {
      sent: number
      delivered: number
      openRate: number
      clickRate: number
    }
  }
  performance: {
    averageDeliveryTime: number // segundos
    deliveryRate: number
    openRate: number
    clickRate: number
    bounceRate: number
    unsubscribeRate: number
  }
  topPerformingTemplates: {
    templateId: string
    templateName: string
    sent: number
    openRate: number
    clickRate: number
  }[]
  trends: {
    date: Date
    sent: number
    delivered: number
    opened: number
    clicked: number
  }[]
}

// Log de envío
export interface NotificationLog {
  id: string
  notificationId: string
  channel: NotificationChannel
  recipientId: string
  status: NotificationStatus
  provider?: string // SendGrid, Twilio, etc.
  providerId?: string
  response?: any
  errorCode?: string
  errorMessage?: string
  deliveryTime?: number // milliseconds
  cost?: number
  metadata: Record<string, any>
  timestamp: Date
}

// Proveedor de notificaciones
export interface NotificationProvider {
  id: string
  name: string
  type: NotificationChannel
  isActive: boolean
  isPrimary: boolean
  config: {
    apiKey?: string
    apiSecret?: string
    senderId?: string
    webhookUrl?: string
    features: string[]
    limits: {
      dailyLimit?: number
      monthlyLimit?: number
      rateLimit?: number
    }
  }
  statistics: {
    totalSent: number
    totalFailed: number
    averageDeliveryTime: number
    lastUsed?: Date
    uptime: number
  }
  createdAt: Date
  updatedAt: Date
}

// Funciones de utilidad
export function getNotificationTypeDisplayName(type: NotificationType): string {
  const names: Record<NotificationType, string> = {
    APPOINTMENT_REMINDER: 'Recordatorio de Cita',
    APPOINTMENT_CONFIRMED: 'Cita Confirmada',
    APPOINTMENT_CANCELLED: 'Cita Cancelada',
    APPOINTMENT_RESCHEDULED: 'Cita Reprogramada',
    LAB_RESULTS_READY: 'Resultados de Laboratorio Listos',
    LAB_RESULTS_CRITICAL: 'Resultados de Laboratorio Críticos',
    PRESCRIPTION_READY: 'Receta Lista',
    PRESCRIPTION_REFILL_DUE: 'Recarga de Medicamento Vencida',
    BILL_PAYMENT_DUE: 'Factura por Vencer',
    BILL_OVERDUE: 'Factura Vencida',
    BILL_PAYMENT_RECEIVED: 'Pago Recibido',
    MEDICAL_RECORD_UPDATED: 'Historial Médico Actualizado',
    SYSTEM_MAINTENANCE: 'Mantenimiento del Sistema',
    SECURITY_ALERT: 'Alerta de Seguridad',
    WELCOME_MESSAGE: 'Mensaje de Bienvenida',
    BIRTHDAY_WISHES: 'Felicitaciones de Cumpleaños',
    HEALTH_TIP: 'Consejo de Salud',
    SURVEY_REQUEST: 'Solicitud de Encuesta',
    CUSTOM_MESSAGE: 'Mensaje Personalizado',
  }
  return names[type] || type
}

export function getChannelDisplayName(channel: NotificationChannel): string {
  const names: Record<NotificationChannel, string> = {
    EMAIL: 'Correo Electrónico',
    SMS: 'Mensaje de Texto',
    PUSH: 'Notificación Push',
    IN_APP: 'Notificación en App',
    PHONE_CALL: 'Llamada Telefónica',
  }
  return names[channel] || channel
}

export function getStatusColor(status: NotificationStatus): string {
  switch (status) {
    case 'PENDING':
    case 'QUEUED':
    case 'SCHEDULED':
      return 'bg-yellow-100 text-yellow-800'
    case 'SENDING':
      return 'bg-blue-100 text-blue-800'
    case 'SENT':
    case 'DELIVERED':
      return 'bg-green-100 text-green-800'
    case 'READ':
      return 'bg-purple-100 text-purple-800'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getPriorityColor(priority: NotificationPriority): string {
  switch (priority) {
    case 'LOW':
      return 'bg-gray-100 text-gray-800'
    case 'NORMAL':
      return 'bg-blue-100 text-blue-800'
    case 'HIGH':
      return 'bg-orange-100 text-orange-800'
    case 'URGENT':
      return 'bg-red-100 text-red-800'
    case 'CRITICAL':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function calculateDeliveryRate(total: number, delivered: number): number {
  return total > 0 ? Math.round((delivered / total) * 100) : 0
}

export function calculateOpenRate(delivered: number, opened: number): number {
  return delivered > 0 ? Math.round((opened / delivered) * 100) : 0
}

export function calculateClickRate(opened: number, clicked: number): number {
  return opened > 0 ? Math.round((clicked / opened) * 100) : 0
}

// Templates predefinidos
export const DEFAULT_TEMPLATES: Partial<NotificationTemplate>[] = [
  {
    name: 'Recordatorio de Cita - 24h',
    type: 'APPOINTMENT_REMINDER',
    title: 'Recordatorio: Tienes una cita mañana',
    messageText:
      'Hola {{patientName}}, te recordamos que tienes una cita mañana {{appointmentDate}} a las {{appointmentTime}} con {{doctorName}}. Ubicación: {{location}}.',
    smsMessage:
      'Recordatorio: Cita mañana {{appointmentDate}} {{appointmentTime}} con {{doctorName}}. {{location}}',
    variables: [
      { name: 'patientName', type: 'TEXT', description: 'Nombre del paciente', required: true },
      { name: 'appointmentDate', type: 'DATE', description: 'Fecha de la cita', required: true },
      { name: 'appointmentTime', type: 'TEXT', description: 'Hora de la cita', required: true },
      { name: 'doctorName', type: 'TEXT', description: 'Nombre del doctor', required: true },
      { name: 'location', type: 'TEXT', description: 'Ubicación de la cita', required: true },
    ],
    channels: ['EMAIL', 'SMS'],
    language: 'es',
    category: 'Citas',
  },
  {
    name: 'Resultados de Laboratorio Listos',
    type: 'LAB_RESULTS_READY',
    title: 'Tus resultados de laboratorio están listos',
    messageText:
      'Hola {{patientName}}, tus resultados de laboratorio de {{testName}} están listos. Puedes verlos en tu portal del paciente o contactar a tu médico {{doctorName}} para más información.',
    variables: [
      { name: 'patientName', type: 'TEXT', description: 'Nombre del paciente', required: true },
      { name: 'testName', type: 'TEXT', description: 'Nombre del examen', required: true },
      { name: 'doctorName', type: 'TEXT', description: 'Nombre del doctor', required: true },
    ],
    channels: ['EMAIL', 'SMS', 'PUSH'],
    language: 'es',
    category: 'Laboratorio',
  },
  {
    name: 'Factura Vencida',
    type: 'BILL_OVERDUE',
    title: 'Factura vencida - Acción requerida',
    messageText:
      'Hola {{patientName}}, tu factura #{{invoiceNumber}} por {{amount}} está vencida desde {{dueDate}}. Por favor realiza el pago lo antes posible para evitar cargos adicionales.',
    variables: [
      { name: 'patientName', type: 'TEXT', description: 'Nombre del paciente', required: true },
      { name: 'invoiceNumber', type: 'TEXT', description: 'Número de factura', required: true },
      { name: 'amount', type: 'TEXT', description: 'Monto de la factura', required: true },
      { name: 'dueDate', type: 'DATE', description: 'Fecha de vencimiento', required: true },
    ],
    channels: ['EMAIL', 'SMS'],
    language: 'es',
    category: 'Facturación',
  },
]
