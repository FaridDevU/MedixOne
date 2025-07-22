import React, { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Input } from '@/components/ui'
import {
  NotificationCampaign,
  NotificationTemplate,
  NotificationAudience,
  NotificationChannel,
  NotificationPriority,
  getChannelDisplayName,
} from '@/types/notifications'

interface CampaignManagementProps {
  campaigns: NotificationCampaign[]
  templates: NotificationTemplate[]
  onCreateCampaign: (campaign: Partial<NotificationCampaign>) => void
  onUpdateCampaign: (id: string, campaign: Partial<NotificationCampaign>) => void
  onDeleteCampaign: (id: string) => void
  onStartCampaign: (id: string) => void
  onPauseCampaign: (id: string) => void
  onStopCampaign: (id: string) => void
  onViewStats: (campaign: NotificationCampaign) => void
}

export function CampaignManagement({
  campaigns,
  templates,
  onCreateCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onStartCampaign,
  onPauseCampaign,
  onStopCampaign,
  onViewStats,
}: CampaignManagementProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<NotificationCampaign | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || campaign.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateCampaign = () => {
    setSelectedCampaign(null)
    setIsCreateModalOpen(true)
  }

  const handleEditCampaign = (campaign: NotificationCampaign) => {
    setSelectedCampaign(campaign)
    setIsEditModalOpen(true)
  }

  const handleViewStats = (campaign: NotificationCampaign) => {
    setSelectedCampaign(campaign)
    setIsStatsModalOpen(true)
    onViewStats(campaign)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'RUNNING':
        return 'bg-green-100 text-green-800'
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: campaigns.length,
    draft: campaigns.filter((c) => c.status === 'DRAFT').length,
    scheduled: campaigns.filter((c) => c.status === 'SCHEDULED').length,
    running: campaigns.filter((c) => c.status === 'RUNNING').length,
    completed: campaigns.filter((c) => c.status === 'COMPLETED').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campañas de Notificaciones</h2>
          <p className="text-gray-600">Gestiona campañas masivas y programadas</p>
        </div>
        <Button onClick={handleCreateCampaign}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Campaña
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              <p className="text-sm text-gray-600">Borradores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              <p className="text-sm text-gray-600">Programadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.running}</p>
              <p className="text-sm text-gray-600">Activas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar campañas por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Todos los estados</option>
                <option value="DRAFT">Borrador</option>
                <option value="SCHEDULED">Programada</option>
                <option value="RUNNING">Activa</option>
                <option value="PAUSED">Pausada</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de campañas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                    >
                      {campaign.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-3">
                    <div>
                      <span className="font-medium">Audiencia:</span>
                      <p>{campaign.audience.totalRecipients.toLocaleString()} destinatarios</p>
                    </div>
                    <div>
                      <span className="font-medium">Tipo:</span>
                      <p>{campaign.type}</p>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="text-sm text-gray-500 mb-3">
                    <div className="flex justify-between">
                      <span>Inicio:</span>
                      <span>{campaign.schedule.startDate.toLocaleDateString('es-ES')}</span>
                    </div>
                    {campaign.schedule.endDate && (
                      <div className="flex justify-between">
                        <span>Fin:</span>
                        <span>{campaign.schedule.endDate.toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                  </div>

                  {/* Canales */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {campaign.delivery.channels.map((channel) => (
                      <span
                        key={channel}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                      >
                        {getChannelDisplayName(channel)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Estadísticas de la campaña */}
              {campaign.status !== 'DRAFT' && (
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {campaign.statistics.totalSent.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">Enviados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-600">
                      {campaign.statistics.deliveryRate}%
                    </p>
                    <p className="text-xs text-gray-600">Entregados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-purple-600">
                      {campaign.statistics.openRate}%
                    </p>
                    <p className="text-xs text-gray-600">Abiertos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-600">
                      {campaign.statistics.clickRate}%
                    </p>
                    <p className="text-xs text-gray-600">Clicks</p>
                  </div>
                </div>
              )}

              {/* Progreso */}
              {campaign.status === 'RUNNING' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>
                      {campaign.statistics.totalSent}/{campaign.audience.totalRecipients}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((campaign.statistics.totalSent / campaign.audience.totalRecipients) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex space-x-2">
                {campaign.status === 'DRAFT' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCampaign(campaign)}
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onStartCampaign(campaign.id)}
                      className="bg-green-600 text-white hover:bg-green-700"
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
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Iniciar
                    </Button>
                  </>
                )}

                {campaign.status === 'SCHEDULED' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCampaign(campaign)}
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStopCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-700"
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
                    </Button>
                  </>
                )}

                {campaign.status === 'RUNNING' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPauseCampaign(campaign.id)}
                      className="text-yellow-600 hover:text-yellow-700"
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
                          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStopCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-700"
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
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </Button>
                  </>
                )}

                {campaign.status === 'PAUSED' && (
                  <Button
                    size="sm"
                    onClick={() => onStartCampaign(campaign.id)}
                    className="bg-green-600 text-white hover:bg-green-700 flex-1"
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
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Reanudar
                  </Button>
                )}

                <Button variant="outline" size="sm" onClick={() => handleViewStats(campaign)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </Button>

                {campaign.status === 'DRAFT' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteCampaign(campaign.id)}
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

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron campañas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando tu primera campaña de notificaciones.
          </p>
          <div className="mt-6">
            <Button onClick={handleCreateCampaign}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nueva Campaña
            </Button>
          </div>
        </div>
      )}

      {/* Modales */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <CampaignEditor
          campaign={selectedCampaign}
          templates={templates}
          isOpen={isCreateModalOpen || isEditModalOpen}
          isCreate={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false)
            setIsEditModalOpen(false)
            setSelectedCampaign(null)
          }}
          onSave={(campaignData) => {
            if (isCreateModalOpen) {
              onCreateCampaign(campaignData)
            } else if (selectedCampaign) {
              onUpdateCampaign(selectedCampaign.id, campaignData)
            }
            setIsCreateModalOpen(false)
            setIsEditModalOpen(false)
            setSelectedCampaign(null)
          }}
        />
      )}

      {isStatsModalOpen && selectedCampaign && (
        <CampaignStatsModal
          campaign={selectedCampaign}
          isOpen={isStatsModalOpen}
          onClose={() => {
            setIsStatsModalOpen(false)
            setSelectedCampaign(null)
          }}
        />
      )}
    </div>
  )
}

// Modal del editor de campañas
interface CampaignEditorProps {
  campaign: NotificationCampaign | null
  templates: NotificationTemplate[]
  isOpen: boolean
  isCreate: boolean
  onClose: () => void
  onSave: (campaign: Partial<NotificationCampaign>) => void
}

function CampaignEditor({
  campaign,
  templates,
  isOpen,
  isCreate,
  onClose,
  onSave,
}: CampaignEditorProps) {
  const [formData, setFormData] = useState<Partial<NotificationCampaign>>(() => {
    if (campaign) {
      return { ...campaign }
    }
    return {
      name: '',
      description: '',
      type: 'BROADCAST',
      status: 'DRAFT',
      audience: {
        type: 'ALL_PATIENTS',
        totalRecipients: 0,
        filters: {},
      },
      content: {
        templateId: '',
        variables: {},
        testMode: false,
      },
      schedule: {
        startDate: new Date(),
        timezone: 'America/Mexico_City',
      },
      delivery: {
        channels: ['EMAIL'],
        priority: 'NORMAL',
        batchSize: 100,
        delayBetweenBatches: 5,
      },
    }
  })

  if (!isOpen) return null

  const toggleChannel = (channel: NotificationChannel) => {
    setFormData((prev) => {
      const channels = prev.delivery?.channels || []
      const hasChannel = channels.includes(channel)
      return {
        ...prev,
        delivery: {
          ...prev.delivery!,
          channels: hasChannel ? channels.filter((c) => c !== channel) : [...channels, channel],
        },
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
                {isCreate ? 'Crear Nueva Campaña' : 'Editar Campaña'}
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
                <h4 className="font-medium text-gray-900">Información General</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Campaña
                  </label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Recordatorios Navideños 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe el propósito de esta campaña"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Campaña
                  </label>
                  <select
                    value={formData.type || 'BROADCAST'}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, type: e.target.value as any }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="BROADCAST">Difusión Masiva</option>
                    <option value="TARGETED">Audiencia Específica</option>
                    <option value="TRIGGERED">Activada por Eventos</option>
                    <option value="SCHEDULED">Programada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template de Mensaje
                  </label>
                  <select
                    value={formData.content?.templateId || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: { ...prev.content!, templateId: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Configuración de entrega */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Configuración de Entrega</h4>

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
                            checked={(formData.delivery?.channels || []).includes(channel)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select
                    value={formData.delivery?.priority || 'NORMAL'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        delivery: {
                          ...prev.delivery!,
                          priority: e.target.value as NotificationPriority,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="LOW">Baja</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">Alta</option>
                    <option value="URGENT">Urgente</option>
                    <option value="CRITICAL">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamaño de Lote
                  </label>
                  <Input
                    type="number"
                    value={formData.delivery?.batchSize || 100}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        delivery: {
                          ...prev.delivery!,
                          batchSize: parseInt(e.target.value),
                        },
                      }))
                    }
                    placeholder="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Número de notificaciones por lote</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retraso entre Lotes (minutos)
                  </label>
                  <Input
                    type="number"
                    value={formData.delivery?.delayBetweenBatches || 5}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        delivery: {
                          ...prev.delivery!,
                          delayBetweenBatches: parseInt(e.target.value),
                        },
                      }))
                    }
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio
                  </label>
                  <Input
                    type="datetime-local"
                    value={
                      formData.schedule?.startDate
                        ? new Date(
                            formData.schedule.startDate.getTime() -
                              formData.schedule.startDate.getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .slice(0, 16)
                        : ''
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        schedule: {
                          ...prev.schedule!,
                          startDate: new Date(e.target.value),
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin (Opcional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={
                      formData.schedule?.endDate
                        ? new Date(
                            formData.schedule.endDate.getTime() -
                              formData.schedule.endDate.getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .slice(0, 16)
                        : ''
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        schedule: {
                          ...prev.schedule!,
                          endDate: e.target.value ? new Date(e.target.value) : undefined,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Audiencia */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Audiencia Objetivo</h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Audiencia
                  </label>
                  <select
                    value={formData.audience?.type || 'ALL_PATIENTS'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        audience: {
                          ...prev.audience!,
                          type: e.target.value as NotificationAudience,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ALL_PATIENTS">Todos los Pacientes</option>
                    <option value="ALL_STAFF">Todo el Personal</option>
                    <option value="SPECIFIC_USERS">Usuarios Específicos</option>
                    <option value="DEPARTMENT">Por Departamento</option>
                    <option value="ROLE_BASED">Por Rol</option>
                    <option value="LOCATION_BASED">Por Ubicación</option>
                    <option value="AGE_GROUP">Por Grupo de Edad</option>
                    <option value="CONDITION_BASED">Por Condición Médica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinatarios Estimados
                  </label>
                  <Input
                    type="number"
                    value={formData.audience?.totalRecipients || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        audience: {
                          ...prev.audience!,
                          totalRecipients: parseInt(e.target.value),
                        },
                      }))
                    }
                    placeholder="0"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Se calculará automáticamente basado en los filtros
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={() => onSave(formData)}>
                {isCreate ? 'Crear Campaña' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal de estadísticas de campaña
interface CampaignStatsModalProps {
  campaign: NotificationCampaign
  isOpen: boolean
  onClose: () => void
}

function CampaignStatsModal({ campaign, isOpen, onClose }: CampaignStatsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Estadísticas: {campaign.name}</h3>
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

            {/* Métricas principales */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="py-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {campaign.statistics.totalSent.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Enviados</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {campaign.statistics.deliveryRate}%
                    </p>
                    <p className="text-sm text-gray-600">Entregados</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {campaign.statistics.openRate}%
                    </p>
                    <p className="text-sm text-gray-600">Abiertos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {campaign.statistics.clickRate}%
                    </p>
                    <p className="text-sm text-gray-600">Clicks</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detalles adicionales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h4 className="font-medium text-gray-900">Detalles de Entrega</h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Enviados:</span>
                      <span className="font-medium">
                        {campaign.statistics.totalSent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Entregados:</span>
                      <span className="font-medium">
                        {campaign.statistics.totalDelivered.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Fallidos:</span>
                      <span className="font-medium text-red-600">
                        {campaign.statistics.totalFailed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Abiertos:</span>
                      <span className="font-medium">
                        {campaign.statistics.totalOpened.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Clicks:</span>
                      <span className="font-medium">
                        {campaign.statistics.totalClicked.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h4 className="font-medium text-gray-900">Tasas de Conversión</h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa de Entrega:</span>
                      <span className="font-medium">{campaign.statistics.deliveryRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa de Apertura:</span>
                      <span className="font-medium">{campaign.statistics.openRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa de Click:</span>
                      <span className="font-medium">{campaign.statistics.clickRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa de Rebote:</span>
                      <span className="font-medium">{campaign.statistics.bounceRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa de Baja:</span>
                      <span className="font-medium">{campaign.statistics.unsubscribeRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
