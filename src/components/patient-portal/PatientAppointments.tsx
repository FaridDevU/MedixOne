import React, { useState } from 'react'
import {
  PatientAppointment,
  AppointmentRequest,
  APPOINTMENT_TYPES,
  getAppointmentStatusColor,
  getTimeUntilAppointment,
  canCancelAppointment,
  canRescheduleAppointment,
} from '@/types/patient-portal'
import { Card, CardHeader, CardContent, Button, Input, Select, Textarea } from '@/components/ui'

interface PatientAppointmentsProps {
  appointments: PatientAppointment[]
  onRequestAppointment?: (request: AppointmentRequest) => Promise<void>
  onCancelAppointment?: (appointmentId: string) => Promise<void>
  onRescheduleAppointment?: (appointmentId: string) => Promise<void>
}

export function PatientAppointments({
  appointments,
  onRequestAppointment,
  onCancelAppointment,
  onRescheduleAppointment,
}: PatientAppointmentsProps) {
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  // Formulario para nueva cita
  const [newAppointment, setNewAppointment] = useState<Partial<AppointmentRequest>>({
    doctorId: '',
    appointmentType: 'CONSULTATION',
    preferredDates: [],
    preferredTimes: [],
    reason: '',
    isUrgent: false,
    notes: '',
    isVirtual: false,
  })

  const filteredAppointments = appointments.filter((appointment) => {
    switch (filter) {
      case 'upcoming':
        return ['SCHEDULED', 'CONFIRMED'].includes(appointment.status)
      case 'completed':
        return appointment.status === 'COMPLETED'
      case 'cancelled':
        return ['CANCELLED', 'NO_SHOW'].includes(appointment.status)
      default:
        return true
    }
  })

  const upcomingAppointments = filteredAppointments.filter((apt) =>
    ['SCHEDULED', 'CONFIRMED'].includes(apt.status)
  )

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onRequestAppointment) return

    setLoading(true)
    try {
      await onRequestAppointment(newAppointment as AppointmentRequest)
      setShowNewAppointment(false)
      setNewAppointment({
        doctorId: '',
        appointmentType: 'CONSULTATION',
        preferredDates: [],
        preferredTimes: [],
        reason: '',
        isUrgent: false,
        notes: '',
        isVirtual: false,
      })
    } catch (error) {
      console.error('Error al solicitar cita:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (appointmentId: string) => {
    if (!onCancelAppointment) return

    const confirmed = window.confirm('¿Estás seguro de que deseas cancelar esta cita?')
    if (!confirmed) return

    try {
      await onCancelAppointment(appointmentId)
    } catch (error) {
      console.error('Error al cancelar cita:', error)
    }
  }

  const handleReschedule = async (appointmentId: string) => {
    if (!onRescheduleAppointment) return

    try {
      await onRescheduleAppointment(appointmentId)
    } catch (error) {
      console.error('Error al reprogramar cita:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Citas Médicas</h1>
          <p className="text-gray-500 mt-1">Gestiona tus citas médicas y solicita nuevas</p>
        </div>
        <Button onClick={() => setShowNewAppointment(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Solicitar Cita
        </Button>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-700">{upcomingAppointments.length}</h3>
                <p className="text-sm text-blue-600">Próximas citas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-green-600"
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
              <div>
                <h3 className="text-2xl font-bold text-green-700">
                  {appointments.filter((apt) => apt.status === 'COMPLETED').length}
                </h3>
                <p className="text-sm text-green-600">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-700">
                  {appointments.filter((apt) => apt.doctor).length
                    ? Array.from(new Set(appointments.map((apt) => apt.doctor.id))).length
                    : 0}
                </h3>
                <p className="text-sm text-purple-600">Doctores diferentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas ({appointments.length})
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('upcoming')}
            >
              Próximas ({upcomingAppointments.length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completadas ({appointments.filter((apt) => apt.status === 'COMPLETED').length})
            </Button>
            <Button
              variant={filter === 'cancelled' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('cancelled')}
            >
              Canceladas (
              {appointments.filter((apt) => ['CANCELLED', 'NO_SHOW'].includes(apt.status)).length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal para nueva cita */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Solicitar Nueva Cita</h3>
                <button
                  onClick={() => setShowNewAppointment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
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
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <Select
                  label="Tipo de Cita"
                  value={newAppointment.appointmentType || ''}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      appointmentType: e.target.value as any,
                    }))
                  }
                  options={[
                    { value: '', label: 'Seleccionar tipo' },
                    ...APPOINTMENT_TYPES.map((type) => ({
                      value: type.value,
                      label: `${type.icon} ${type.label}`,
                    })),
                  ]}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Primera opción de fecha"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <Select
                    label="Hora preferida"
                    options={[
                      { value: '', label: 'Seleccionar hora' },
                      { value: '08:00', label: '8:00 AM' },
                      { value: '09:00', label: '9:00 AM' },
                      { value: '10:00', label: '10:00 AM' },
                      { value: '11:00', label: '11:00 AM' },
                      { value: '14:00', label: '2:00 PM' },
                      { value: '15:00', label: '3:00 PM' },
                      { value: '16:00', label: '4:00 PM' },
                      { value: '17:00', label: '5:00 PM' },
                    ]}
                    required
                  />
                </div>

                <Textarea
                  label="Motivo de la consulta"
                  value={newAppointment.reason || ''}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  placeholder="Describe brevemente el motivo de tu consulta..."
                  rows={3}
                  required
                />

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newAppointment.isUrgent || false}
                      onChange={(e) =>
                        setNewAppointment((prev) => ({ ...prev, isUrgent: e.target.checked }))
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Es urgente</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newAppointment.isVirtual || false}
                      onChange={(e) =>
                        setNewAppointment((prev) => ({ ...prev, isVirtual: e.target.checked }))
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Consulta virtual</span>
                  </label>
                </div>

                <Textarea
                  label="Notas adicionales (opcional)"
                  value={newAppointment.notes || ''}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Información adicional que consideres importante..."
                  rows={2}
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewAppointment(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={loading}>
                    Solicitar Cita
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de citas */}
      <Card>
        <CardContent className="p-0">
          {filteredAppointments.length === 0 ? (
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay citas</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all'
                  ? 'No tienes citas programadas.'
                  : `No hay citas ${filter === 'upcoming' ? 'próximas' : filter === 'completed' ? 'completadas' : 'canceladas'}.`}
              </p>
              <div className="mt-6">
                <Button onClick={() => setShowNewAppointment(true)}>Solicitar Primera Cita</Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Avatar del doctor */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold">
                        {appointment.doctor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>

                      {/* Información principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Dr. {appointment.doctor.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}
                          >
                            {appointment.status === 'SCHEDULED' && 'Programada'}
                            {appointment.status === 'CONFIRMED' && 'Confirmada'}
                            {appointment.status === 'COMPLETED' && 'Completada'}
                            {appointment.status === 'CANCELLED' && 'Cancelada'}
                            {appointment.status === 'NO_SHOW' && 'No asistió'}
                          </span>

                          {appointment.type && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {APPOINTMENT_TYPES.find((t) => t.value === appointment.type)?.icon}{' '}
                              {APPOINTMENT_TYPES.find((t) => t.value === appointment.type)?.label}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{appointment.doctor.specialty}</p>

                        {/* Fecha y hora */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center text-sm text-gray-600">
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatDateTime(appointment.date)}
                          </div>

                          {['SCHEDULED', 'CONFIRMED'].includes(appointment.status) && (
                            <div className="flex items-center text-sm font-medium text-blue-600">
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {getTimeUntilAppointment(appointment.date)}
                            </div>
                          )}
                        </div>

                        {/* Ubicación */}
                        <div className="flex items-center text-sm text-gray-600 mb-3">
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {appointment.location.isVirtual ? (
                            <span className="text-green-600 font-medium">Consulta Virtual</span>
                          ) : (
                            <span>
                              {appointment.location.room &&
                                `Consultorio ${appointment.location.room}`}
                              {appointment.location.address && ` - ${appointment.location.address}`}
                            </span>
                          )}
                        </div>

                        {/* Motivo */}
                        <p className="text-sm text-gray-700 mb-3">
                          <strong>Motivo:</strong> {appointment.reason}
                        </p>

                        {/* Instrucciones especiales */}
                        {appointment.instructions && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                            <div className="flex items-start">
                              <svg
                                className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <div>
                                <h4 className="text-sm font-medium text-blue-800 mb-1">
                                  Instrucciones especiales
                                </h4>
                                <p className="text-sm text-blue-700">{appointment.instructions}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Enlace virtual */}
                        {appointment.location.isVirtual &&
                          appointment.location.virtualLink &&
                          ['SCHEDULED', 'CONFIRMED'].includes(appointment.status) && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 text-green-600 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <span className="text-sm text-green-700">
                                    El enlace estará disponible 15 minutos antes de la cita
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-300"
                                >
                                  Unirse a la consulta
                                </Button>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Acciones */}
                    {['SCHEDULED', 'CONFIRMED'].includes(appointment.status) && (
                      <div className="flex flex-col space-y-2 ml-4">
                        {canRescheduleAppointment(appointment) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReschedule(appointment.id)}
                          >
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Reprogramar
                          </Button>
                        )}

                        {canCancelAppointment(appointment) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(appointment.id)}
                            className="text-red-600 hover:text-red-700 border-red-300"
                          >
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Cancelar
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
