import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui'

interface RecentActivity {
  id: string
  type: 'appointment' | 'lab' | 'prescription' | 'patient'
  message: string
  time: string
  user: string
  priority?: 'high' | 'medium' | 'low'
}

interface ActivityFeedProps {
  activities: RecentActivity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'appointment':
        return (
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )
      case 'lab':
        return (
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      case 'prescription':
        return (
          <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )
      case 'patient':
        return (
          <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-gray-300 bg-white'
    }
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <button className="text-sm text-medical-600 hover:text-medical-700 font-medium">
            Ver todo
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div
                    className={`relative flex space-x-3 p-4 border-l-4 ${getPriorityColor(activity.priority)}`}
                  >
                    <div className="flex-shrink-0">{getIcon(activity.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{activity.message}</p>
                        </div>
                        <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                          <span>por {activity.user}</span>
                          <span>•</span>
                          <time>{activity.time}</time>
                        </div>
                      </div>
                    </div>
                    {activity.priority === 'high' && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Urgente
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay actividad reciente</h3>
            <p className="mt-1 text-sm text-gray-500">La actividad aparecerá aquí cuando ocurra.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
