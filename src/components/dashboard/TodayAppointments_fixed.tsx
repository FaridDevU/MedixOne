import React from 'react'
import { useTranslations } from '@/contexts/LanguageContext'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Calendar, Clock, User } from 'lucide-react'

interface Appointment {
  id: string
  patient: {
    firstName: string
    lastName: string
  }
  time: string
  doctor: string
  status: 'confirmed' | 'pending' | 'completed'
}

interface TodayAppointmentsProps {
  appointments: Appointment[]
}

export function TodayAppointments({ appointments = [] }: TodayAppointmentsProps) {
  const { t } = useTranslations()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.todayAppointments')}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{appointments.length} {t('dashboard.scheduledConsultations').toLowerCase()}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Sin citas programadas
            </h4>
            <p className="text-gray-600">
              No hay citas programadas para hoy.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                    <span className="text-gray-300">•</span>
                    <p className="text-sm text-gray-500">{appointment.doctor}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {appointment.status === 'confirmed' && t('appointments.confirmed')}
                    {appointment.status === 'pending' && t('appointments.pending')}
                    {appointment.status === 'completed' && t('appointments.completed')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}