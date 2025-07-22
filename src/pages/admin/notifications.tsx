import React, { useState } from 'react'
import { Card, CardHeader, CardContent, Button } from '@/components/ui'
import { TemplateManagement } from '@/components/notifications/TemplateManagement'
import { NotificationQueue } from '@/components/notifications/NotificationQueue'
import { CampaignManagement } from '@/components/notifications/CampaignManagement'
import {
  Notification,
  NotificationTemplate,
  NotificationCampaign,
  NotificationStats,
  NotificationChannel,
  getChannelDisplayName,
  DEFAULT_TEMPLATES,
} from '@/types/notifications'

// Datos de ejemplo
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'APPOINTMENT_REMINDER',
    title: 'Recordatorio de Cita - Dr. García',
    message:
      'Hola María, te recordamos que tienes una cita mañana 15/01/2024 a las 10:00 AM con Dr. García. Especialidad: Cardiología.',
    channels: ['EMAIL', 'SMS'],
    priority: 'HIGH',
    status: 'DELIVERED',
    recipientId: 'patient-1',
    recipientEmail: 'maria.gonzalez@email.com',
    recipientPhone: '+52 555 123 4567',
    senderId: 'system',
    senderName: 'Sistema MedixOne',
    templateId: 'template-1',
    variables: {
      patientName: 'María González',
      appointmentDate: '15/01/2024',
      appointmentTime: '10:00 AM',
      doctorName: 'Dr. García',
      location: 'Consultorio 3, Piso 2',
    },
    scheduledAt: new Date('2024-01-14T08:00:00'),
    sentAt: new Date('2024-01-14T08:00:05'),
    deliveredAt: new Date('2024-01-14T08:00:12'),
    retryCount: 0,
    maxRetries: 3,
    metadata: {
      appointmentId: 'apt-123',
      patientId: 'patient-1',
      source: 'appointment_system',
      tracking: {
        opened: true,
        clicked: false,
        clickedLinks: [],
        deviceInfo: 'iPhone 14 Pro',
        location: 'Mexico City, MX',
      },
    },
    createdAt: new Date('2024-01-14T07:55:00'),
    updatedAt: new Date('2024-01-14T08:00:12'),
  },
  {
    id: '2',
    type: 'LAB_RESULTS_READY',
    title: 'Resultados de Laboratorio Disponibles',
    message:
      'Hola Carlos, tus resultados de Análisis de Sangre están listos. Puedes verlos en tu portal del paciente.',
    channels: ['EMAIL', 'PUSH'],
    priority: 'NORMAL',
    status: 'SENT',
    recipientId: 'patient-2',
    recipientEmail: 'carlos.rivera@email.com',
    senderId: 'lab-system',
    senderName: 'Laboratorio MedixOne',
    templateId: 'template-2',
    variables: {
      patientName: 'Carlos Rivera',
      testName: 'Análisis de Sangre',
      doctorName: 'Dr. Martínez',
    },
    scheduledAt: new Date('2024-01-14T09:30:00'),
    sentAt: new Date('2024-01-14T09:30:03'),
    retryCount: 0,
    maxRetries: 3,
    metadata: {
      resultId: 'result-456',
      patientId: 'patient-2',
      source: 'lab_system',
      tracking: {
        opened: false,
        clicked: false,
        clickedLinks: [],
      },
    },
    createdAt: new Date('2024-01-14T09:25:00'),
    updatedAt: new Date('2024-01-14T09:30:03'),
  },
  {
    id: '3',
    type: 'BILL_PAYMENT_DUE',
    title: 'Recordatorio de Pago - Factura Vence en 3 Días',
    message:
      'Hola Ana, tu factura #INV-789 por $1,250.00 vence el 18/01/2024. Por favor realiza el pago para evitar cargos adicionales.',
    channels: ['EMAIL', 'SMS'],
    priority: 'URGENT',
    status: 'FAILED',
    recipientId: 'patient-3',
    recipientEmail: 'ana.lopez@email.com',
    recipientPhone: '+52 555 987 6543',
    senderId: 'billing-system',
    senderName: 'Facturación MedixOne',
    failureReason: 'Número de teléfono inválido para SMS',
    retryCount: 2,
    maxRetries: 3,
    metadata: {
      billId: 'bill-789',
      patientId: 'patient-3',
      source: 'billing_system',
    },
    createdAt: new Date('2024-01-14T10:00:00'),
    updatedAt: new Date('2024-01-14T10:15:00'),
  },
]

const mockTemplates: NotificationTemplate[] = [
  {
    id: 'template-1',
    name: 'Recordatorio de Cita - 24h',
    type: 'APPOINTMENT_REMINDER',
    title: 'Recordatorio: Tienes una cita mañana',
    messageText:
      'Hola {{patientName}}, te recordamos que tienes una cita mañana {{appointmentDate}} a las {{appointmentTime}} con {{doctorName}}. Ubicación: {{location}}.',
    messageHtml:
      '<p>Hola <strong>{{patientName}}</strong>,</p><p>Te recordamos que tienes una cita mañana <strong>{{appointmentDate}}</strong> a las <strong>{{appointmentTime}}</strong> con <strong>{{doctorName}}</strong>.</p><p>Ubicación: {{location}}</p>',
    smsMessage:
      'Recordatorio: Cita mañana {{appointmentDate}} {{appointmentTime}} con {{doctorName}}. {{location}}',
    pushMessage: 'Cita mañana con {{doctorName}} a las {{appointmentTime}}',
    variables: [
      { name: 'patientName', type: 'TEXT', description: 'Nombre del paciente', required: true },
      { name: 'appointmentDate', type: 'DATE', description: 'Fecha de la cita', required: true },
      { name: 'appointmentTime', type: 'TEXT', description: 'Hora de la cita', required: true },
      { name: 'doctorName', type: 'TEXT', description: 'Nombre del doctor', required: true },
      { name: 'location', type: 'TEXT', description: 'Ubicación de la cita', required: true },
    ],
    channels: ['EMAIL', 'SMS', 'PUSH'],
    isActive: true,
    isDefault: true,
    language: 'es',
    category: 'Citas',
    tags: ['citas', 'recordatorios'],
    createdAt: new Date('2024-01-01T00:00:00'),
    updatedAt: new Date('2024-01-01T00:00:00'),
    createdBy: 'admin',
    usageCount: 1247,
    lastUsed: new Date('2024-01-14T08:00:00'),
  },
  {
    id: 'template-2',
    name: 'Resultados de Laboratorio Listos',
    type: 'LAB_RESULTS_READY',
    title: 'Tus resultados de laboratorio están listos',
    messageText:
      'Hola {{patientName}}, tus resultados de laboratorio de {{testName}} están listos. Puedes verlos en tu portal del paciente o contactar a tu médico {{doctorName}} para más información.',
    messageHtml:
      '<p>Hola <strong>{{patientName}}</strong>,</p><p>Tus resultados de laboratorio de <strong>{{testName}}</strong> están listos.</p><p>Puedes verlos en tu portal del paciente o contactar a tu médico <strong>{{doctorName}}</strong> para más información.</p>',
    pushMessage: 'Resultados de {{testName}} disponibles',
    variables: [
      { name: 'patientName', type: 'TEXT', description: 'Nombre del paciente', required: true },
      { name: 'testName', type: 'TEXT', description: 'Nombre del examen', required: true },
      { name: 'doctorName', type: 'TEXT', description: 'Nombre del doctor', required: true },
    ],
    channels: ['EMAIL', 'SMS', 'PUSH'],
    isActive: true,
    isDefault: true,
    language: 'es',
    category: 'Laboratorio',
    tags: ['laboratorio', 'resultados'],
    createdAt: new Date('2024-01-01T00:00:00'),
    updatedAt: new Date('2024-01-01T00:00:00'),
    createdBy: 'admin',
    usageCount: 892,
    lastUsed: new Date('2024-01-14T09:30:00'),
  },
]

const mockCampaigns: NotificationCampaign[] = [
  {
    id: 'campaign-1',
    name: 'Campaña Navideña 2024',
    description: 'Felicitaciones navideñas y promociones especiales para todos los pacientes',
    type: 'BROADCAST',
    status: 'COMPLETED',
    audience: {
      type: 'ALL_PATIENTS',
      totalRecipients: 5420,
      filters: {},
    },
    content: {
      templateId: 'template-custom-1',
      variables: {
        year: '2024',
        clinicName: 'MedixOne',
      },
      testMode: false,
    },
    schedule: {
      startDate: new Date('2023-12-24T09:00:00'),
      endDate: new Date('2023-12-24T18:00:00'),
      sendTime: '09:00',
      timezone: 'America/Mexico_City',
      frequency: 'ONCE',
    },
    delivery: {
      channels: ['EMAIL', 'SMS'],
      priority: 'NORMAL',
      batchSize: 200,
      delayBetweenBatches: 10,
    },
    statistics: {
      totalSent: 5420,
      totalDelivered: 5285,
      totalFailed: 135,
      totalOpened: 3156,
      totalClicked: 847,
      deliveryRate: 97.5,
      openRate: 59.7,
      clickRate: 26.8,
      bounceRate: 2.5,
      unsubscribeRate: 0.8,
    },
    createdAt: new Date('2023-12-20T00:00:00'),
    updatedAt: new Date('2023-12-24T18:00:00'),
    createdBy: 'admin',
  },
  {
    id: 'campaign-2',
    name: 'Recordatorios de Chequeos Anuales',
    description: 'Campaña para recordar a pacientes mayores de 40 años sobre sus chequeos anuales',
    type: 'TARGETED',
    status: 'RUNNING',
    audience: {
      type: 'AGE_GROUP',
      totalRecipients: 1250,
      filters: {
        ageRange: { min: 40, max: 80 },
        lastCheckup: 'more_than_year',
      },
    },
    content: {
      templateId: 'template-checkup',
      variables: {
        clinicName: 'MedixOne',
        phone: '+52 555 000 0000',
      },
      testMode: false,
    },
    schedule: {
      startDate: new Date('2024-01-15T08:00:00'),
      endDate: new Date('2024-02-15T18:00:00'),
      sendTime: '08:00',
      timezone: 'America/Mexico_City',
      frequency: 'WEEKLY',
    },
    delivery: {
      channels: ['EMAIL', 'SMS'],
      priority: 'NORMAL',
      batchSize: 50,
      delayBetweenBatches: 30,
    },
    statistics: {
      totalSent: 350,
      totalDelivered: 335,
      totalFailed: 15,
      totalOpened: 198,
      totalClicked: 67,
      deliveryRate: 95.7,
      openRate: 59.1,
      clickRate: 33.8,
      bounceRate: 4.3,
      unsubscribeRate: 1.2,
    },
    createdAt: new Date('2024-01-10T00:00:00'),
    updatedAt: new Date('2024-01-14T12:00:00'),
    createdBy: 'marketing-manager',
  },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'templates' | 'queue' | 'campaigns'>(
    'dashboard'
  )
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [templates, setTemplates] = useState<NotificationTemplate[]>(mockTemplates)
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>(mockCampaigns)

  // Estadísticas del dashboard
  const stats: NotificationStats = {
    period: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-14'),
    },
    totals: {
      sent: 15420,
      delivered: 14892,
      failed: 528,
      opened: 8945,
      clicked: 2134,
    },
    byChannel: {
      EMAIL: { sent: 8500, delivered: 8234, failed: 266, deliveryRate: 96.9 },
      SMS: { sent: 4200, delivered: 3987, failed: 213, deliveryRate: 94.9 },
      PUSH: { sent: 2500, delivered: 2456, failed: 44, deliveryRate: 98.2 },
      IN_APP: { sent: 220, delivered: 215, failed: 5, deliveryRate: 97.7 },
      PHONE_CALL: { sent: 0, delivered: 0, failed: 0, deliveryRate: 0 },
    },
    byType: {
      APPOINTMENT_REMINDER: { sent: 4500, delivered: 4367, openRate: 65.2, clickRate: 12.4 },
      LAB_RESULTS_READY: { sent: 2800, delivered: 2723, openRate: 78.9, clickRate: 34.7 },
      BILL_PAYMENT_DUE: { sent: 1200, delivered: 1156, openRate: 45.8, clickRate: 18.9 },
      PRESCRIPTION_READY: { sent: 980, delivered: 945, openRate: 52.1, clickRate: 22.3 },
      WELCOME_MESSAGE: { sent: 340, delivered: 335, openRate: 89.2, clickRate: 45.1 },
      APPOINTMENT_CONFIRMED: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      APPOINTMENT_CANCELLED: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      APPOINTMENT_RESCHEDULED: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      LAB_RESULTS_CRITICAL: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      PRESCRIPTION_REFILL_DUE: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      BILL_OVERDUE: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      BILL_PAYMENT_RECEIVED: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      MEDICAL_RECORD_UPDATED: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      SYSTEM_MAINTENANCE: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      SECURITY_ALERT: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      BIRTHDAY_WISHES: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      HEALTH_TIP: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      SURVEY_REQUEST: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
      CUSTOM_MESSAGE: { sent: 0, delivered: 0, openRate: 0, clickRate: 0 },
    },
    performance: {
      averageDeliveryTime: 4.2,
      deliveryRate: 96.6,
      openRate: 60.1,
      clickRate: 23.9,
      bounceRate: 3.4,
      unsubscribeRate: 1.2,
    },
    topPerformingTemplates: [
      {
        templateId: 'template-1',
        templateName: 'Recordatorio de Cita - 24h',
        sent: 1247,
        openRate: 65.2,
        clickRate: 12.4,
      },
      {
        templateId: 'template-2',
        templateName: 'Resultados de Laboratorio Listos',
        sent: 892,
        openRate: 78.9,
        clickRate: 34.7,
      },
    ],
    trends: [
      { date: new Date('2024-01-08'), sent: 1200, delivered: 1156, opened: 695, clicked: 167 },
      { date: new Date('2024-01-09'), sent: 1350, delivered: 1302, opened: 782, clicked: 187 },
      { date: new Date('2024-01-10'), sent: 1100, delivered: 1067, opened: 641, clicked: 153 },
      { date: new Date('2024-01-11'), sent: 1450, delivered: 1398, opened: 839, clicked: 201 },
      { date: new Date('2024-01-12'), sent: 1280, delivered: 1236, opened: 742, clicked: 178 },
      { date: new Date('2024-01-13'), sent: 1320, delivered: 1275, opened: 765, clicked: 183 },
      { date: new Date('2024-01-14'), sent: 890, delivered: 858, opened: 515, clicked: 123 },
    ],
  }

  // Handlers para templates
  const handleCreateTemplate = (template: Partial<NotificationTemplate>) => {
    const newTemplate: NotificationTemplate = {
      id: `template-${Date.now()}`,
      name: template.name || '',
      type: template.type || 'CUSTOM_MESSAGE',
      title: template.title || '',
      messageText: template.messageText || '',
      messageHtml: template.messageHtml,
      smsMessage: template.smsMessage,
      pushMessage: template.pushMessage,
      variables: template.variables || [],
      channels: template.channels || ['EMAIL'],
      isActive: template.isActive ?? true,
      isDefault: template.isDefault ?? false,
      language: template.language || 'es',
      category: template.category || '',
      tags: template.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
      usageCount: 0,
    }
    setTemplates((prev) => [...prev, newTemplate])
  }

  const handleUpdateTemplate = (id: string, updates: Partial<NotificationTemplate>) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === id ? { ...template, ...updates, updatedAt: new Date() } : template
      )
    )
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const handleDuplicateTemplate = (id: string) => {
    const original = templates.find((t) => t.id === id)
    if (original) {
      const duplicate: NotificationTemplate = {
        ...original,
        id: `template-${Date.now()}`,
        name: `${original.name} (Copia)`,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        lastUsed: undefined,
      }
      setTemplates((prev) => [...prev, duplicate])
    }
  }

  const handlePreviewTemplate = (
    template: NotificationTemplate,
    variables: Record<string, any>
  ) => {
    console.log('Preview template:', template, variables)
  }

  // Handlers para notificaciones
  const handleRetryNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              status: 'PENDING',
              retryCount: notification.retryCount + 1,
              updatedAt: new Date(),
            }
          : notification
      )
    )
  }

  const handleCancelNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              status: 'CANCELLED',
              updatedAt: new Date(),
            }
          : notification
      )
    )
  }

  const handleViewDetails = (notification: Notification) => {
    console.log('View notification details:', notification)
  }

  const handleResendNotification = (id: string, channels?: any[]) => {
    console.log('Resend notification:', id, channels)
  }

  // Handlers para campañas
  const handleCreateCampaign = (campaign: Partial<NotificationCampaign>) => {
    const newCampaign: NotificationCampaign = {
      id: `campaign-${Date.now()}`,
      name: campaign.name || '',
      description: campaign.description || '',
      type: campaign.type || 'BROADCAST',
      status: 'DRAFT',
      audience: campaign.audience || { type: 'ALL_PATIENTS', totalRecipients: 0, filters: {} },
      content: campaign.content || { templateId: '', variables: {}, testMode: false },
      schedule: campaign.schedule || { startDate: new Date(), timezone: 'America/Mexico_City' },
      delivery: campaign.delivery || {
        channels: ['EMAIL'],
        priority: 'NORMAL',
        batchSize: 100,
        delayBetweenBatches: 5,
      },
      statistics: {
        totalSent: 0,
        totalDelivered: 0,
        totalFailed: 0,
        totalOpened: 0,
        totalClicked: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
        unsubscribeRate: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
    }
    setCampaigns((prev) => [...prev, newCampaign])
  }

  const handleUpdateCampaign = (id: string, updates: Partial<NotificationCampaign>) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id ? { ...campaign, ...updates, updatedAt: new Date() } : campaign
      )
    )
  }

  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id))
  }

  const handleStartCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id ? { ...campaign, status: 'RUNNING', updatedAt: new Date() } : campaign
      )
    )
  }

  const handlePauseCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id ? { ...campaign, status: 'PAUSED', updatedAt: new Date() } : campaign
      )
    )
  }

  const handleStopCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id ? { ...campaign, status: 'CANCELLED', updatedAt: new Date() } : campaign
      )
    )
  }

  const handleViewStats = (campaign: NotificationCampaign) => {
    console.log('View campaign stats:', campaign)
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Enviadas</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totals.sent.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Últimos 14 días</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Tasa de Entrega</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.performance.deliveryRate}%
                </p>
                <p className="text-xs text-green-600 mt-1">+2.3% vs semana anterior</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Tasa de Apertura</p>
                <p className="text-3xl font-bold text-purple-600">{stats.performance.openRate}%</p>
                <p className="text-xs text-purple-600 mt-1">+5.7% vs semana anterior</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Notificaciones Fallidas</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.totals.failed.toLocaleString()}
                </p>
                <p className="text-xs text-red-600 mt-1">-12.4% vs semana anterior</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estadísticas por canal */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Rendimiento por Canal</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.byChannel).map(([channel, data]) => (
                <div
                  key={channel}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getChannelDisplayName(channel as NotificationChannel)}
                      </p>
                      <p className="text-sm text-gray-500">{data.sent.toLocaleString()} enviadas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{data.deliveryRate}%</p>
                    <p className="text-sm text-gray-500">entrega</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Templates más usados */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Templates Más Efectivos</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPerformingTemplates.map((template) => (
                <div
                  key={template.templateId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{template.templateName}</p>
                    <p className="text-sm text-gray-500">
                      {template.sent.toLocaleString()} enviados
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-purple-600">{template.openRate}% apertura</p>
                    <p className="text-sm text-blue-600">{template.clickRate}% clicks</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('queue')}>
              Ver Cola Completa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 line-clamp-1">{notification.title}</p>
                  <p className="text-sm text-gray-600">Para: {notification.recipientEmail}</p>
                  <p className="text-xs text-gray-500">
                    {notification.createdAt.toLocaleString('es-ES')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      notification.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-800'
                        : notification.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {notification.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Notificaciones</h1>
          <p className="text-gray-600">Gestiona comunicaciones automáticas y campañas</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exportar Reportes
          </Button>
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva Notificación
          </Button>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg
              className="w-5 h-5 mr-2 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg
              className="w-5 h-5 mr-2 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Templates
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'queue'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg
              className="w-5 h-5 mr-2 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            Cola de Envío
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg
              className="w-5 h-5 mr-2 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Campañas
          </button>
        </nav>
      </div>

      {/* Contenido de la pestaña activa */}
      {activeTab === 'dashboard' && renderDashboard()}

      {activeTab === 'templates' && (
        <TemplateManagement
          templates={templates}
          onCreateTemplate={handleCreateTemplate}
          onUpdateTemplate={handleUpdateTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onDuplicateTemplate={handleDuplicateTemplate}
          onPreviewTemplate={handlePreviewTemplate}
        />
      )}

      {activeTab === 'queue' && (
        <NotificationQueue
          notifications={notifications}
          onRetryNotification={handleRetryNotification}
          onCancelNotification={handleCancelNotification}
          onViewDetails={handleViewDetails}
          onResendNotification={handleResendNotification}
        />
      )}

      {activeTab === 'campaigns' && (
        <CampaignManagement
          campaigns={campaigns}
          templates={templates}
          onCreateCampaign={handleCreateCampaign}
          onUpdateCampaign={handleUpdateCampaign}
          onDeleteCampaign={handleDeleteCampaign}
          onStartCampaign={handleStartCampaign}
          onPauseCampaign={handlePauseCampaign}
          onStopCampaign={handleStopCampaign}
          onViewStats={handleViewStats}
        />
      )}
    </div>
  )
}
