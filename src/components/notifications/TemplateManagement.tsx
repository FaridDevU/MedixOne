import React, { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Input } from '@/components/ui'
import {
  NotificationTemplate,
  NotificationType,
  NotificationChannel,
  TemplateVariable,
  getNotificationTypeDisplayName,
  getChannelDisplayName,
  DEFAULT_TEMPLATES,
} from '@/types/notifications'

interface TemplateManagementProps {
  templates: NotificationTemplate[]
  onCreateTemplate: (template: Partial<NotificationTemplate>) => void
  onUpdateTemplate: (id: string, template: Partial<NotificationTemplate>) => void
  onDeleteTemplate: (id: string) => void
  onDuplicateTemplate: (id: string) => void
  onPreviewTemplate: (template: NotificationTemplate, variables: Record<string, any>) => void
}

export function TemplateManagement({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onPreviewTemplate,
}: TemplateManagementProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<NotificationType | 'ALL'>('ALL')
  const [filterChannel, setFilterChannel] = useState<NotificationChannel | 'ALL'>('ALL')

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.messageText.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'ALL' || template.type === filterType
    const matchesChannel = filterChannel === 'ALL' || template.channels.includes(filterChannel)
    return matchesSearch && matchesType && matchesChannel
  })

  const handleEditTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template)
    setIsEditModalOpen(true)
  }

  const handleCreateTemplate = () => {
    setSelectedTemplate(null)
    setIsCreateModalOpen(true)
  }

  const handlePreviewTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template)
    setIsPreviewModalOpen(true)
  }

  const getUsageColor = (count: number) => {
    if (count === 0) return 'text-gray-500'
    if (count < 10) return 'text-blue-600'
    if (count < 100) return 'text-green-600'
    return 'text-purple-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Templates de Notificaciones</h2>
          <p className="text-gray-600">Gestiona plantillas de mensajes personalizables</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              /* Import templates */
            }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            Importar
          </Button>
          <Button onClick={handleCreateTemplate}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear Template
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar templates por nombre, título o contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as NotificationType | 'ALL')}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Todos los tipos</option>
                <option value="APPOINTMENT_REMINDER">Recordatorio de Cita</option>
                <option value="LAB_RESULTS_READY">Resultados de Lab</option>
                <option value="BILL_PAYMENT_DUE">Factura por Vencer</option>
                <option value="PRESCRIPTION_READY">Receta Lista</option>
                <option value="WELCOME_MESSAGE">Mensaje de Bienvenida</option>
                <option value="CUSTOM_MESSAGE">Mensaje Personalizado</option>
              </select>

              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value as NotificationChannel | 'ALL')}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Todos los canales</option>
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="PUSH">Push</option>
                <option value="IN_APP">In-App</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de templates */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <div className="flex items-center space-x-1">
                      {template.isDefault && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Por defecto
                        </span>
                      )}
                      {!template.isActive && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{template.title}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <span>Tipo:</span>
                      <span className="font-medium">
                        {getNotificationTypeDisplayName(template.type)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Usos:</span>
                      <span className={`font-medium ${getUsageColor(template.usageCount)}`}>
                        {template.usageCount}
                      </span>
                    </div>
                  </div>

                  {/* Canales */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.channels.map((channel) => (
                      <span
                        key={channel}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800"
                      >
                        {getChannelDisplayName(channel)}
                      </span>
                    ))}
                  </div>

                  {/* Variables */}
                  <div className="text-xs text-gray-500">
                    Variables: {template.variables.map((v) => `{{${v.name}}}`).join(', ')}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Preview del mensaje */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700 line-clamp-3">{template.messageText}</p>
              </div>

              {/* Información adicional */}
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>Creado: {template.createdAt.toLocaleDateString('es-ES')}</span>
                <span>Categoría: {template.category}</span>
              </div>

              {/* Acciones */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreviewTemplate(template)}
                  className="flex-1"
                >
                  <svg
                    className="w-4 h-4 mr-1"
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
                  Vista Previa
                </Button>

                <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicateTemplate(template.id)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </Button>

                {!template.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modales */}
      {(isEditModalOpen || isCreateModalOpen) && (
        <TemplateEditor
          template={selectedTemplate}
          isOpen={isEditModalOpen || isCreateModalOpen}
          isCreate={isCreateModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setIsCreateModalOpen(false)
            setSelectedTemplate(null)
          }}
          onSave={(templateData) => {
            if (isCreateModalOpen) {
              onCreateTemplate(templateData)
            } else if (selectedTemplate) {
              onUpdateTemplate(selectedTemplate.id, templateData)
            }
            setIsEditModalOpen(false)
            setIsCreateModalOpen(false)
            setSelectedTemplate(null)
          }}
        />
      )}

      {isPreviewModalOpen && selectedTemplate && (
        <TemplatePreview
          template={selectedTemplate}
          isOpen={isPreviewModalOpen}
          onClose={() => {
            setIsPreviewModalOpen(false)
            setSelectedTemplate(null)
          }}
        />
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Templates Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {templates.filter((t) => t.isActive).length}
                </p>
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
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Más Usado</p>
                <p className="text-lg font-bold text-purple-600">
                  {templates.length > 0
                    ? templates.reduce((max, t) =>
                        t.usageCount > (max?.usageCount || 0) ? t : max
                      )?.name || 'N/A'
                    : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  {Math.max(...templates.map((t) => t.usageCount))} usos
                </p>
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Canales Únicos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(templates.flatMap((t) => t.channels)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente Editor de Templates
interface TemplateEditorProps {
  template: NotificationTemplate | null
  isOpen: boolean
  isCreate: boolean
  onClose: () => void
  onSave: (template: Partial<NotificationTemplate>) => void
}

function TemplateEditor({ template, isOpen, isCreate, onClose, onSave }: TemplateEditorProps) {
  const [formData, setFormData] = useState<Partial<NotificationTemplate>>(() => {
    if (template) {
      return { ...template }
    }
    return {
      name: '',
      type: 'CUSTOM_MESSAGE',
      title: '',
      messageText: '',
      messageHtml: '',
      smsMessage: '',
      pushMessage: '',
      variables: [],
      channels: ['EMAIL'],
      isActive: true,
      isDefault: false,
      language: 'es',
      category: '',
      tags: [],
    }
  })

  const [newVariable, setNewVariable] = useState<Partial<TemplateVariable>>({
    name: '',
    type: 'TEXT',
    description: '',
    required: false,
  })

  if (!isOpen) return null

  const addVariable = () => {
    if (newVariable.name && newVariable.description) {
      setFormData((prev) => ({
        ...prev,
        variables: [...(prev.variables || []), newVariable as TemplateVariable],
      }))
      setNewVariable({
        name: '',
        type: 'TEXT',
        description: '',
        required: false,
      })
    }
  }

  const removeVariable = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variables: (prev.variables || []).filter((_, i) => i !== index),
    }))
  }

  const toggleChannel = (channel: NotificationChannel) => {
    setFormData((prev) => {
      const channels = prev.channels || []
      const hasChannel = channels.includes(channel)
      return {
        ...prev,
        channels: hasChannel ? channels.filter((c) => c !== channel) : [...channels, channel],
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {isCreate ? 'Crear Nuevo Template' : 'Editar Template'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información básica */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Información Básica</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Template
                  </label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Recordatorio de Cita - 24h"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Notificación
                  </label>
                  <select
                    value={formData.type || 'CUSTOM_MESSAGE'}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, type: e.target.value as NotificationType }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="APPOINTMENT_REMINDER">Recordatorio de Cita</option>
                    <option value="LAB_RESULTS_READY">Resultados de Laboratorio</option>
                    <option value="BILL_PAYMENT_DUE">Factura por Vencer</option>
                    <option value="PRESCRIPTION_READY">Receta Lista</option>
                    <option value="WELCOME_MESSAGE">Mensaje de Bienvenida</option>
                    <option value="CUSTOM_MESSAGE">Mensaje Personalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título del Mensaje
                  </label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Título que aparecerá en la notificación"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <Input
                    value={formData.category || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="Ej: Citas, Laboratorio, Facturación"
                  />
                </div>

                {/* Canales */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canales de Comunicación
                  </label>
                  <div className="space-y-2">
                    {(['EMAIL', 'SMS', 'PUSH', 'IN_APP'] as NotificationChannel[]).map(
                      (channel) => (
                        <label key={channel} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={(formData.channels || []).includes(channel)}
                            onChange={() => toggleChannel(channel)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {getChannelDisplayName(channel)}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Contenido del Mensaje</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje Principal (Email/In-App)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    value={formData.messageText || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, messageText: e.target.value }))
                    }
                    placeholder="Texto del mensaje con variables {{nombreVariable}}"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje SMS (Versión Corta)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    value={formData.smsMessage || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, smsMessage: e.target.value }))
                    }
                    placeholder="Versión corta para SMS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje Push
                  </label>
                  <Input
                    value={formData.pushMessage || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, pushMessage: e.target.value }))
                    }
                    placeholder="Mensaje para notificaciones push"
                  />
                </div>

                {/* Variables */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variables del Template
                  </label>

                  {/* Variables existentes */}
                  <div className="space-y-2 mb-3">
                    {(formData.variables || []).map((variable, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <span className="font-medium">{`{{${variable.name}}}`}</span>
                          <span className="text-sm text-gray-500 ml-2">({variable.type})</span>
                          <span className="text-sm text-gray-700 ml-2">{variable.description}</span>
                        </div>
                        <button
                          onClick={() => removeVariable(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Agregar nueva variable */}
                  <div className="grid grid-cols-4 gap-2">
                    <Input
                      placeholder="Nombre"
                      value={newVariable.name || ''}
                      onChange={(e) =>
                        setNewVariable((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                    <select
                      value={newVariable.type || 'TEXT'}
                      onChange={(e) =>
                        setNewVariable((prev) => ({ ...prev, type: e.target.value as any }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="TEXT">Texto</option>
                      <option value="NUMBER">Número</option>
                      <option value="DATE">Fecha</option>
                      <option value="EMAIL">Email</option>
                      <option value="PHONE">Teléfono</option>
                    </select>
                    <Input
                      placeholder="Descripción"
                      value={newVariable.description || ''}
                      onChange={(e) =>
                        setNewVariable((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                    <Button size="sm" onClick={addVariable}>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={() => onSave(formData)}>
                {isCreate ? 'Crear Template' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente Preview de Template
interface TemplatePreviewProps {
  template: NotificationTemplate
  isOpen: boolean
  onClose: () => void
}

function TemplatePreview({ template, isOpen, onClose }: TemplatePreviewProps) {
  const [previewVariables, setPreviewVariables] = useState<Record<string, any>>(() => {
    const vars: Record<string, any> = {}
    template.variables.forEach((variable) => {
      switch (variable.type) {
        case 'TEXT':
          vars[variable.name] = variable.defaultValue || 'Ejemplo de texto'
          break
        case 'DATE':
          vars[variable.name] = new Date().toLocaleDateString('es-ES')
          break
        case 'EMAIL':
          vars[variable.name] = 'ejemplo@email.com'
          break
        case 'PHONE':
          vars[variable.name] = '+52 555 123 4567'
          break
        default:
          vars[variable.name] = variable.defaultValue || 'Valor de ejemplo'
      }
    })
    return vars
  })

  if (!isOpen) return null

  const renderPreview = (content: string) => {
    let rendered = content
    Object.entries(previewVariables).forEach(([key, value]) => {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
    return rendered
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Vista Previa: {template.name}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Variables de prueba */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Variables de Prueba</h4>
              <div className="grid grid-cols-2 gap-3">
                {template.variables.map((variable) => (
                  <div key={variable.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {variable.name}
                    </label>
                    <Input
                      value={previewVariables[variable.name] || ''}
                      onChange={(e) =>
                        setPreviewVariables((prev) => ({
                          ...prev,
                          [variable.name]: e.target.value,
                        }))
                      }
                      placeholder={variable.description}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Previews por canal */}
            <div className="space-y-6">
              {template.channels.includes('EMAIL') && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Email
                  </h4>
                  <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <div className="border-b border-gray-200 pb-2 mb-3">
                      <p className="font-medium text-gray-900">{renderPreview(template.title)}</p>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {renderPreview(template.messageText)}
                    </div>
                  </div>
                </div>
              )}

              {template.channels.includes('SMS') && template.smsMessage && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    SMS
                  </h4>
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4 max-w-sm">
                    <div className="text-sm text-gray-700">
                      {renderPreview(template.smsMessage)}
                    </div>
                  </div>
                </div>
              )}

              {template.channels.includes('PUSH') && template.pushMessage && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7a7.5 7.5 0 0115 0v10z"
                      />
                    </svg>
                    Notificación Push
                  </h4>
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 max-w-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {renderPreview(template.title)}
                        </p>
                        <p className="text-sm text-gray-700">
                          {renderPreview(template.pushMessage)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={onClose}>Cerrar</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
