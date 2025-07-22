import React, { useState, useMemo } from 'react'
import { useTranslations } from '@/contexts/LanguageContext'
import { Card, CardHeader, CardContent, Button } from '@/components/ui'
import {
  Calendar,
  Filter,
  Search,
  Clock,
  User,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

// Tipos locales para el componente
type MedicalEventType =
  | 'CONSULTATION'
  | 'DIAGNOSIS'
  | 'TREATMENT'
  | 'MEDICATION'
  | 'ALLERGY'
  | 'SURGERY'
  | 'HOSPITALIZATION'
  | 'EMERGENCY'
  | 'LAB_RESULT'
  | 'IMAGING'
  | 'VACCINATION'
  | 'VITAL_SIGNS'
  | 'REFERRAL'
  | 'FOLLOW_UP'
  | 'NOTE'

type CriticalityLevel = 'NORMAL' | 'HIGH' | 'CRITICAL' | 'EMERGENCY'

interface MedicalEvent {
  id: string
  title: string
  description: string
  type: MedicalEventType
  specialty: string
  date: Date
  doctorId: string
  doctorName: string
  criticality: CriticalityLevel
  tags?: string[]
}

interface TimelineFilters {
  dateFrom?: Date
  dateTo?: Date
  eventTypes?: MedicalEventType[]
  specialties?: string[]
  doctors?: string[]
  criticality?: CriticalityLevel[]
  searchTerm?: string
}

// Funciones utilitarias locales
const getEventTypeColor = (type: MedicalEventType): string => {
  const colors = {
    CONSULTATION: 'text-blue-700 bg-blue-100 border-blue-200',
    DIAGNOSIS: 'text-red-700 bg-red-100 border-red-200',
    TREATMENT: 'text-green-700 bg-green-100 border-green-200',
    MEDICATION: 'text-purple-700 bg-purple-100 border-purple-200',
    ALLERGY: 'text-orange-700 bg-orange-100 border-orange-200',
    SURGERY: 'text-indigo-700 bg-indigo-100 border-indigo-200',
    HOSPITALIZATION: 'text-pink-700 bg-pink-100 border-pink-200',
    EMERGENCY: 'text-red-700 bg-red-100 border-red-200',
    LAB_RESULT: 'text-cyan-700 bg-cyan-100 border-cyan-200',
    IMAGING: 'text-teal-700 bg-teal-100 border-teal-200',
    VACCINATION: 'text-lime-700 bg-lime-100 border-lime-200',
    VITAL_SIGNS: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    REFERRAL: 'text-violet-700 bg-violet-100 border-violet-200',
    FOLLOW_UP: 'text-sky-700 bg-sky-100 border-sky-200',
    NOTE: 'text-gray-700 bg-gray-100 border-gray-200',
  }
  return colors[type] || 'text-gray-700 bg-gray-100 border-gray-200'
}

const getCriticalityColor = (criticality: CriticalityLevel): string => {
  const colors = {
    NORMAL: 'bg-green-100 text-green-800',
    HIGH: 'bg-yellow-100 text-yellow-800',
    CRITICAL: 'bg-orange-100 text-orange-800',
    EMERGENCY: 'bg-red-100 text-red-800',
  }
  return colors[criticality]
}

interface MedicalTimelineProps {
  events: MedicalEvent[]
  filters?: TimelineFilters
  onFiltersChange?: (filters: TimelineFilters) => void
  groupBy?: 'DATE' | 'TYPE' | 'SPECIALTY'
}

export function MedicalTimeline({
  events,
  filters = {},
  onFiltersChange,
  groupBy = 'DATE',
}: MedicalTimelineProps) {
  const { t } = useTranslations()
  const [showFilters, setShowFilters] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null)

  // Filtrar eventos
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (filters.dateFrom && event.date < filters.dateFrom) return false
        if (filters.dateTo && event.date > filters.dateTo) return false
        if (filters.eventTypes && !filters.eventTypes.includes(event.type)) return false
        if (filters.specialties && !filters.specialties.includes(event.specialty)) return false
        if (filters.doctors && !filters.doctors.includes(event.doctorId)) return false
        if (filters.criticality && !filters.criticality.includes(event.criticality)) return false
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase()
          return (
            event.title.toLowerCase().includes(searchLower) ||
            event.description.toLowerCase().includes(searchLower) ||
            event.doctorName.toLowerCase().includes(searchLower)
          )
        }
        return true
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [events, filters])

  // Agrupar eventos
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: MedicalEvent[] } = {}

    filteredEvents.forEach((event) => {
      let groupKey: string

      switch (groupBy) {
        case 'TYPE':
          groupKey = event.type
          break
        case 'SPECIALTY':
          groupKey = event.specialty
          break
        case 'DATE':
        default:
          groupKey = event.date.toDateString()
          break
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey]!.push(event)
    })

    return groups
  }, [filteredEvents, groupBy])

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey)
    } else {
      newExpanded.add(groupKey)
    }
    setExpandedGroups(newExpanded)
  }

  const formatGroupTitle = (groupKey: string): string => {
    switch (groupBy) {
      case 'TYPE':
        return getEventTypeTranslation(groupKey as MedicalEventType)
      case 'SPECIALTY':
        return getSpecialtyTranslation(groupKey)
      case 'DATE':
      default:
        return new Date(groupKey).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
    }
  }

  const getEventTypeTranslation = (type: MedicalEventType): string => {
    const translations = {
      CONSULTATION: 'Consulta',
      DIAGNOSIS: 'Diagnóstico',
      TREATMENT: 'Tratamiento',
      MEDICATION: 'Medicación',
      ALLERGY: 'Alergia',
      SURGERY: 'Cirugía',
      HOSPITALIZATION: 'Hospitalización',
      EMERGENCY: 'Emergencia',
      LAB_RESULT: 'Resultado de Laboratorio',
      IMAGING: 'Imagen',
      VACCINATION: 'Vacunación',
      VITAL_SIGNS: 'Signos Vitales',
      REFERRAL: 'Referencia',
      FOLLOW_UP: 'Seguimiento',
      NOTE: 'Nota',
    }
    return translations[type] || type
  }

  const getSpecialtyTranslation = (specialty: string): string => {
    const translations = {
      GENERAL_MEDICINE: 'Medicina General',
      CARDIOLOGY: 'Cardiología',
      ENDOCRINOLOGY: 'Endocrinología',
      NEUROLOGY: 'Neurología',
      PEDIATRICS: 'Pediatría',
      GYNECOLOGY: 'Ginecología',
      DERMATOLOGY: 'Dermatología',
      PSYCHIATRY: 'Psiquiatría',
      OPHTHALMOLOGY: 'Oftalmología',
      TRAUMATOLOGY: 'Traumatología',
      ONCOLOGY: 'Oncología',
      RADIOLOGY: 'Radiología',
    }
    return translations[specialty as keyof typeof translations] || specialty
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Historial Médico ({filteredEvents.length} eventos)
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
              {showFilters ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar eventos
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar en título, descripción o doctor..."
                    value={filters.searchTerm || ''}
                    onChange={(e) => onFiltersChange?.({ ...filters, searchTerm: e.target.value })}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha desde</label>
                <input
                  type="date"
                  value={filters.dateFrom?.toISOString().split('T')[0] || ''}
                  onChange={(e) =>
                    onFiltersChange?.({
                      ...filters,
                      dateFrom: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha hasta</label>
                <input
                  type="date"
                  value={filters.dateTo?.toISOString().split('T')[0] || ''}
                  onChange={(e) =>
                    onFiltersChange?.({
                      ...filters,
                      dateTo: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Timeline de eventos */}
      <div className="space-y-4">
        {Object.entries(groupedEvents).map(([groupKey, groupEvents]) => (
          <Card key={groupKey}>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div
                className="flex items-center justify-between"
                onClick={() => toggleGroup(groupKey)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleGroup(groupKey)
                }}
                style={{ outline: 'none' }}
              >
                <div className="flex items-center space-x-3">
                  {expandedGroups.has(groupKey) ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                  <h4 className="text-lg font-medium text-gray-900">
                    {formatGroupTitle(groupKey)}
                  </h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {groupEvents.length}
                  </span>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>

            {expandedGroups.has(groupKey) && (
              <CardContent>
                <div className="space-y-4">
                  {groupEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border-l-4 border-blue-200 pl-4 hover:bg-gray-50 rounded-r-lg p-3 cursor-pointer transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}
                            >
                              {getEventTypeTranslation(event.type)}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(event.criticality)}`}
                            >
                              {event.criticality === 'NORMAL'
                                ? 'Normal'
                                : event.criticality === 'HIGH'
                                  ? 'Alto'
                                  : event.criticality === 'CRITICAL'
                                    ? 'Crítico'
                                    : 'Emergencia'}
                            </span>
                          </div>

                          <h5 className="font-semibold text-gray-900 mb-1">{event.title}</h5>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{event.date.toLocaleString('es-ES')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{event.doctorName}</span>
                            </div>
                            <span>•</span>
                            <span>{getSpecialtyTranslation(event.specialty)}</span>
                          </div>
                        </div>

                        <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 ml-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Modal de detalle del evento */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Detalle del Evento</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedEvent.title}</h4>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Fecha:</span>
                    <span className="ml-2 font-medium">
                      {selectedEvent.date.toLocaleString('es-ES')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Doctor:</span>
                    <span className="ml-2 font-medium">{selectedEvent.doctorName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Especialidad:</span>
                    <span className="ml-2 font-medium">
                      {getSpecialtyTranslation(selectedEvent.specialty)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Criticidad:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${getCriticalityColor(selectedEvent.criticality)}`}
                    >
                      {selectedEvent.criticality === 'NORMAL'
                        ? 'Normal'
                        : selectedEvent.criticality === 'HIGH'
                          ? 'Alto'
                          : selectedEvent.criticality === 'CRITICAL'
                            ? 'Crítico'
                            : 'Emergencia'}
                    </span>
                  </div>
                </div>

                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div>
                    <span className="text-gray-500 text-sm">Etiquetas:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedEvent.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay eventos</h3>
            <p className="text-gray-600">
              No se encontraron eventos médicos con los filtros aplicados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
