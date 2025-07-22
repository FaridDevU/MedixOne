import React, { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Input } from '@/components/ui'
import {
  Notification,
  NotificationStatus,
  NotificationPriority,
  NotificationChannel,
  getNotificationTypeDisplayName,
  getChannelDisplayName,
  getStatusColor,
  getPriorityColor,
} from '@/types/notifications'

interface NotificationQueueProps {
  notifications: Notification[]
  onRetryNotification: (id: string) => void
  onCancelNotification: (id: string) => void
  onViewDetails: (notification: Notification) => void
  onResendNotification: (id: string, channels?: NotificationChannel[]) => void
}

export function NotificationQueue({
  notifications,
  onRetryNotification,
  onCancelNotification,
  onViewDetails,
  onResendNotification,
}: NotificationQueueProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<NotificationStatus | 'ALL'>('ALL')
  const [filterPriority, setFilterPriority] = useState<NotificationPriority | 'ALL'>('ALL')
  const [filterChannel, setFilterChannel] = useState<NotificationChannel | 'ALL'>('ALL')
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || notification.status === filterStatus
    const matchesPriority = filterPriority === 'ALL' || notification.priority === filterPriority
    const matchesChannel = filterChannel === 'ALL' || notification.channels.includes(filterChannel)
    return matchesSearch && matchesStatus && matchesPriority && matchesChannel
  })

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsDetailModalOpen(true)
    onViewDetails(notification)
  }

  const formatDate = (date?: Date) => {
    if (!date) return '-'
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDeliveryTime = (notification: Notification) => {
    if (!notification.sentAt || !notification.deliveredAt) return '-'
    const diff = notification.deliveredAt.getTime() - notification.sentAt.getTime()
    return `${Math.round(diff / 1000)}s`
  }

  const stats = {
    total: notifications.length,
    pending: notifications.filter((n) => ['PENDING', 'QUEUED', 'SCHEDULED'].includes(n.status))
      .length,
    sending: notifications.filter((n) => n.status === 'SENDING').length,
    sent: notifications.filter((n) => ['SENT', 'DELIVERED', 'READ'].includes(n.status)).length,
    failed: notifications.filter((n) => n.status === 'FAILED').length,
    cancelled: notifications.filter((n) => n.status === 'CANCELLED').length,
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cola de Notificaciones</h2>
          <p className="text-gray-600">Monitorea el estado de todas las notificaciones</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-2">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600">
                  Pendientes: <strong>{stats.pending}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-600">
                  Enviando: <strong>{stats.sending}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-600">
                  Enviados: <strong>{stats.sent}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-gray-600">
                  Fallidos: <strong>{stats.failed}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por título, mensaje o destinatario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as NotificationStatus | 'ALL')}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Todos los estados</option>
                <option value="PENDING">Pendiente</option>
                <option value="QUEUED">En Cola</option>
                <option value="SENDING">Enviando</option>
                <option value="SENT">Enviado</option>
                <option value="DELIVERED">Entregado</option>
                <option value="READ">Leído</option>
                <option value="FAILED">Fallido</option>
                <option value="CANCELLED">Cancelado</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as NotificationPriority | 'ALL')}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Todas las prioridades</option>
                <option value="CRITICAL">Crítica</option>
                <option value="URGENT">Urgente</option>
                <option value="HIGH">Alta</option>
                <option value="NORMAL">Normal</option>
                <option value="LOW">Baja</option>
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

      {/* Lista de notificaciones */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destinatario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Canales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Programada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enviada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                          {notification.title}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <div className="text-xs text-gray-500">
                        {getNotificationTypeDisplayName(notification.type)}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {notification.recipientEmail}
                    </div>
                    {notification.recipientPhone && (
                      <div className="text-sm text-gray-500">{notification.recipientPhone}</div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}
                      >
                        {notification.status}
                      </span>
                      {notification.retryCount > 0 && (
                        <span className="text-xs text-orange-600">
                          Reintento {notification.retryCount}/{notification.maxRetries}
                        </span>
                      )}
                    </div>

                    {notification.status === 'FAILED' && notification.failureReason && (
                      <div className="text-xs text-red-600 mt-1 line-clamp-2">
                        {notification.failureReason}
                      </div>
                    )}

                    {notification.status === 'DELIVERED' && (
                      <div className="text-xs text-green-600 mt-1">
                        Tiempo: {getDeliveryTime(notification)}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {notification.channels.map((channel) => (
                        <span
                          key={channel}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800"
                        >
                          {getChannelDisplayName(channel)}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(notification.scheduledAt)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(notification.sentAt)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(notification)}
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Button>

                      {notification.status === 'FAILED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRetryNotification(notification.id)}
                          className="text-blue-600 hover:text-blue-700"
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </Button>
                      )}

                      {['SENT', 'DELIVERED', 'READ'].includes(notification.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onResendNotification(notification.id)}
                          className="text-green-600 hover:text-green-700"
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
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </Button>
                      )}

                      {['PENDING', 'QUEUED', 'SCHEDULED'].includes(notification.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCancelNotification(notification.id)}
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
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNotifications.length === 0 && (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No se encontraron notificaciones
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No hay notificaciones que coincidan con los filtros aplicados.
            </p>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {isDetailModalOpen && selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedNotification(null)
          }}
          onRetry={() => onRetryNotification(selectedNotification.id)}
          onResend={() => onResendNotification(selectedNotification.id)}
        />
      )}

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Notificaciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
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
                <p className="text-sm font-medium text-gray-600">Tasa de Entrega</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.total > 0 ? Math.round((stats.sent / stats.total) * 100) : 0}%
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
                <p className="text-sm font-medium text-gray-600">Notificaciones Fallidas</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
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

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending + stats.sending}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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

// Modal de detalles de notificación
interface NotificationDetailModalProps {
  notification: Notification
  isOpen: boolean
  onClose: () => void
  onRetry: () => void
  onResend: () => void
}

function NotificationDetailModal({
  notification,
  isOpen,
  onClose,
  onRetry,
  onResend,
}: NotificationDetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Detalles de Notificación</h3>
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

            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {getNotificationTypeDisplayName(notification.type)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Prioridad</h4>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}
                    >
                      {notification.priority}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}
                    >
                      {notification.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Reintentos</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {notification.retryCount}/{notification.maxRetries}
                  </p>
                </div>
              </div>

              {/* Destinatario */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Destinatario</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-900">{notification.recipientEmail}</p>
                  {notification.recipientPhone && (
                    <p className="text-sm text-gray-600">{notification.recipientPhone}</p>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Contenido</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h5 className="font-medium text-gray-900 mb-2">{notification.title}</h5>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {notification.message}
                  </p>
                </div>
              </div>

              {/* Canales */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Canales de Envío</h4>
                <div className="flex flex-wrap gap-2">
                  {notification.channels.map((channel) => (
                    <span
                      key={channel}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {getChannelDisplayName(channel)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Timeline</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Creada:</span>
                    <span className="text-gray-900">
                      {notification.createdAt.toLocaleString('es-ES')}
                    </span>
                  </div>
                  {notification.scheduledAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Programada:</span>
                      <span className="text-gray-900">
                        {notification.scheduledAt.toLocaleString('es-ES')}
                      </span>
                    </div>
                  )}
                  {notification.sentAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Enviada:</span>
                      <span className="text-gray-900">
                        {notification.sentAt.toLocaleString('es-ES')}
                      </span>
                    </div>
                  )}
                  {notification.deliveredAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Entregada:</span>
                      <span className="text-gray-900">
                        {notification.deliveredAt.toLocaleString('es-ES')}
                      </span>
                    </div>
                  )}
                  {notification.readAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Leída:</span>
                      <span className="text-gray-900">
                        {notification.readAt.toLocaleString('es-ES')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              {Object.keys(notification.metadata).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Metadata</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                      {JSON.stringify(notification.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Error (si existe) */}
              {notification.status === 'FAILED' && notification.failureReason && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Error</h4>
                  <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                    <p className="text-sm text-red-800">{notification.failureReason}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>

              {notification.status === 'FAILED' && (
                <Button onClick={onRetry} className="bg-blue-600 text-white hover:bg-blue-700">
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reintentar
                </Button>
              )}

              {['SENT', 'DELIVERED', 'READ'].includes(notification.status) && (
                <Button onClick={onResend} className="bg-green-600 text-white hover:bg-green-700">
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Reenviar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
