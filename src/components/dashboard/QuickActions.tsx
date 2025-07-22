import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  href: string
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: 'new-patient',
      title: 'Nuevo Paciente',
      description: 'Registrar un paciente nuevo',
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/patients/new',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      id: 'schedule-appointment',
      title: 'Agendar Cita',
      description: 'Programar nueva cita médica',
      color: 'bg-green-500 hover:bg-green-600',
      href: '/appointments/new',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 'lab-results',
      title: 'Resultados Lab',
      description: 'Registrar resultados de laboratorio',
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/laboratory/results/new',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
    {
      id: 'emergency',
      title: 'Emergencia',
      description: 'Atención médica urgente',
      color: 'bg-red-500 hover:bg-red-600',
      href: '/emergency',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
    },
  ]

  return (
    <Card variant="elevated">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              className={`${action.color} text-white p-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg group`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all">
                  {action.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{action.title}</h4>
                  <p className="text-xs opacity-90 mt-1">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
