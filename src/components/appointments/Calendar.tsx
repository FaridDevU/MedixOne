import React, { useState } from 'react'
import { Appointment } from '@/types/appointment'
import { Card, CardHeader, CardContent, Button, Badge } from '@/components/ui'

interface CalendarProps {
  appointments: Appointment[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onAppointmentClick?: (appointment: Appointment) => void
}

export function Calendar({
  appointments,
  selectedDate,
  onDateSelect,
  onAppointmentClick,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate))

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Obtener días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: { date: Date; isCurrentMonth: boolean }[] = []

    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({ date, isCurrentMonth: true })
    }

    // Días del mes siguiente para completar la grilla
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day)
      days.push({ date: nextDate, isCurrentMonth: false })
    }

    return days
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => apt.date.toDateString() === date.toDateString())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const days = getDaysInMonth(currentMonth)
  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date()
                setCurrentMonth(today)
                onDateSelect(today)
              }}
            >
              Hoy
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Encabezados de días */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Grilla de días */}
        <div className="grid grid-cols-7 gap-1">
          {days.map(({ date, isCurrentMonth }, index) => {
            const dayAppointments = getAppointmentsForDate(date)
            const isCurrentDay = isToday(date)
            const isSelectedDay = isSelected(date)

            return (
              <div
                key={index}
                className={`
                  relative p-2 min-h-[80px] cursor-pointer transition-all duration-200 rounded-lg border
                  ${isCurrentMonth ? 'hover:bg-gray-50' : 'text-gray-300'}
                  ${isCurrentDay ? 'bg-medical-50 border-medical-200' : 'border-gray-200'}
                  ${isSelectedDay ? 'bg-medical-100 border-medical-300 shadow-md' : ''}
                `}
                onClick={() => onDateSelect(date)}
              >
                {/* Número del día */}
                <div
                  className={`
                  text-sm font-medium mb-1
                  ${isCurrentDay ? 'text-medical-700' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isSelectedDay ? 'text-medical-800' : ''}
                `}
                >
                  {date.getDate()}
                </div>

                {/* Indicadores de citas */}
                {dayAppointments.length > 0 && (
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`
                          text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer
                          ${
                            appointment.type === 'EMERGENCY'
                              ? 'bg-red-600'
                              : appointment.status === 'CANCELLED'
                                ? 'bg-gray-500'
                                : 'bg-blue-500'
                          }
                        `}
                        onClick={(e) => {
                          e.stopPropagation()
                          onAppointmentClick?.(appointment)
                        }}
                        title={`Paciente: ${appointment.patientId} - ${getAppointmentTypeLabel(appointment.type)}`}
                      >
                        {formatTime(appointment.date)} - {appointment.patientId.substring(0, 8)}
                      </div>
                    ))}

                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayAppointments.length - 2} más
                      </div>
                    )}
                  </div>
                )}

                {/* Punto indicador si hay citas */}
                {dayAppointments.length > 0 && (
                  <div className="absolute top-1 right-1">
                    <div
                      className={`
                      w-2 h-2 rounded-full
                      ${
                        dayAppointments.some((apt) => apt.type === 'EMERGENCY')
                          ? 'bg-red-500'
                          : dayAppointments.some((apt) => apt.status === 'CANCELLED')
                            ? 'bg-gray-500'
                            : 'bg-blue-500'
                      }
                    `}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
