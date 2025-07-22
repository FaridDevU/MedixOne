import React, { useState } from 'react'
import { Appointment } from '@/types/appointment'
import { Card, CardHeader, CardContent, Button, Badge } from '@/components/ui'

interface DayScheduleProps {
  selectedDate: Date
  appointments: Appointment[]
  onAppointmentClick?: (appointment: Appointment) => void
  onEditAppointment?: (appointment: Appointment) => void
  onCancelAppointment?: (appointmentId: string) => void
}

export function DaySchedule({
  selectedDate,
  appointments,
  onAppointmentClick,
  onEditAppointment,
  onCancelAppointment,
}: DayScheduleProps) {
  const dayAppointments = appointments
    .filter((apt) => apt.date.toDateString() === selectedDate.toDateString())
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getAppointmentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      CONSULTATION: 'Consulta',
      FOLLOWUP: 'Seguimiento',
      EMERGENCY: 'Emergencia',
      SURGERY: 'Cirugía',
      CHECKUP: 'Chequeo',
    }
    return types[type] || type
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      SCHEDULED: 'Programada',
      CONFIRMED: 'Confirmada',
      IN_PROGRESS: 'En Progreso',
      COMPLETED: 'Completada',
      CANCELLED: 'Cancelada',
      NO_SHOW: 'No Asistió',
    }
    return labels[status] || status
  }

  const formatAppointmentTime = (date: Date, duration: number) => {
    const startTime = formatTime(date)
    const endTime = formatTime(new Date(date.getTime() + duration * 60000))
    return `${startTime} - ${endTime}`
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EMERGENCY':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'SURGERY':
        return (
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
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        )
      default:
        return (
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        )
    }
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Agenda del Día</h3>
            <p className="text-sm text-gray-500 capitalize">{formatDate(selectedDate)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {dayAppointments.length} cita{dayAppointments.length !== 1 ? 's' : ''}
            </span>
            <Button size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nueva Cita
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {dayAppointments.length === 0 ? (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay citas programadas</h3>
            <p className="mt-1 text-sm text-gray-500">Este día está libre para nuevas citas.</p>
            <div className="mt-6">
              <Button>Programar Primera Cita</Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {dayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => onAppointmentClick?.(appointment)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Icono de tipo */}
                    <div className="flex-shrink-0">{getTypeIcon(appointment.type)}</div>

                    {/* Información principal */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="text-lg font-medium text-gray-900">
                          Paciente ID: {appointment.patientId}
                        </h4>
                        <Badge
                          variant={
                            appointment.status === 'CONFIRMED'
                              ? 'success'
                              : appointment.status === 'CANCELLED'
                                ? 'error'
                                : 'default'
                          }
                        >
                          {getStatusLabel(appointment.status)}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                        <span className="flex items-center">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatAppointmentTime(appointment.date, appointment.duration)}
                        </span>

                        <span className="flex items-center">
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
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          {getAppointmentTypeLabel(appointment.type)}
                        </span>

                        <span className="flex items-center">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Doctor ID: {appointment.doctorId}
                        </span>
                      </div>

                      {appointment.reason && (
                        <p className="mt-2 text-sm text-gray-700">
                          <strong>Motivo:</strong> {appointment.reason}
                        </p>
                      )}

                      {appointment.notes && (
                        <p className="mt-1 text-sm text-gray-500">
                          <strong>Notas:</strong> {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-2">
                    {appointment.status === 'SCHEDULED' && (
                      <Button variant="primary" size="sm">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Confirmar
                      </Button>
                    )}

                    {appointment.status === 'CONFIRMED' && (
                      <Button variant="primary" size="sm">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Iniciar
                      </Button>
                    )}

                    {onEditAppointment && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditAppointment(appointment)
                        }}
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
                    )}

                    <div className="relative">
                      <Button variant="outline" size="sm" className="p-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
