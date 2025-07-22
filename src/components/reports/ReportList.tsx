import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent, Button, Input, Select, Badge } from '@/components/ui'

// Tipos locales para el componente
interface User {
  firstName: string
  lastName: string
}

interface ReportData {
  summary: {
    totalRecords: number
  }
  charts: any[]
  tables: any[]
  metrics: any[]
}

interface MedicalReport {
  id: string
  title: string
  description?: string
  type: string
  status: string
  format: string
  generatedAt: Date
  generatedByUser?: User
  dateRange: {
    startDate: Date
    endDate: Date
  }
  data: ReportData
}

// Funciones utilitarias locales
const getReportTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    PATIENT_DEMOGRAPHICS: 'Demografía',
    APPOINTMENT_ANALYTICS: 'Citas',
    LABORATORY_RESULTS: 'Laboratorio',
    PRESCRIPTION_ANALYSIS: 'Recetas',
    FINANCIAL_SUMMARY: 'Financiero',
    PERFORMANCE_METRICS: 'Rendimiento',
  }
  return labels[type] || type
}

const getReportTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    PATIENT_DEMOGRAPHICS: '👥',
    APPOINTMENT_ANALYTICS: '📅',
    LABORATORY_RESULTS: '🧪',
    PRESCRIPTION_ANALYSIS: '💊',
    FINANCIAL_SUMMARY: '💰',
    PERFORMANCE_METRICS: '📊',
  }
  return icons[type] || '📄'
}

const getReportStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    COMPLETED: 'Completado',
    GENERATING: 'Generando',
    FAILED: 'Fallido',
    EXPIRED: 'Expirado',
  }
  return labels[status] || status
}

const exportReportData = (report: MedicalReport, format: string) => {
  // Simulación de exportación
  console.log(`Exportando reporte ${report.id} en formato ${format}`)
  // Aquí iría la lógica real de exportación
}

interface ReportListProps {
  reports: MedicalReport[]
  onReportClick?: (report: MedicalReport) => void
  onDeleteReport?: (reportId: string) => void
  onRegenerateReport?: (reportId: string) => void
}

export function ReportList({
  reports,
  onReportClick,
  onDeleteReport,
  onRegenerateReport,
}: ReportListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const reportsPerPage = 10

  // Filtrar reportes
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.generatedByUser?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.generatedByUser?.lastName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !typeFilter || report.type === typeFilter
    const matchesStatus = !statusFilter || report.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  // Paginación
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)
  const startIndex = (currentPage - 1) * reportsPerPage
  const currentReports = filteredReports.slice(startIndex, startIndex + reportsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'GENERATING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'FAILED':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'EXPIRED':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PATIENT_DEMOGRAPHICS':
        return 'bg-blue-100 text-blue-800'
      case 'APPOINTMENT_ANALYTICS':
        return 'bg-green-100 text-green-800'
      case 'LABORATORY_RESULTS':
        return 'bg-purple-100 text-purple-800'
      case 'PRESCRIPTION_ANALYSIS':
        return 'bg-emerald-100 text-emerald-800'
      case 'FINANCIAL_SUMMARY':
        return 'bg-yellow-100 text-yellow-800'
      case 'PERFORMANCE_METRICS':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const start = startDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    const end = endDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    return `${start} - ${end}`
  }

  const handleExport = (report: MedicalReport, format: string) => {
    exportReportData(report, format as any)
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Reportes Médicos</h3>
              <p className="text-sm text-gray-500">
                {filteredReports.length} reporte{filteredReports.length !== 1 ? 's' : ''} encontrado
                {filteredReports.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link href="/reports/new">
              <Button className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nuevo Reporte
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por título, descripción o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>
            <Select
              placeholder="Tipo"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos los tipos' },
                { value: 'PATIENT_DEMOGRAPHICS', label: 'Demografía' },
                { value: 'APPOINTMENT_ANALYTICS', label: 'Citas' },
                { value: 'LABORATORY_RESULTS', label: 'Laboratorio' },
                { value: 'PRESCRIPTION_ANALYSIS', label: 'Recetas' },
                { value: 'FINANCIAL_SUMMARY', label: 'Financiero' },
                { value: 'PERFORMANCE_METRICS', label: 'Rendimiento' },
              ]}
            />
            <Select
              placeholder="Estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos los estados' },
                { value: 'COMPLETED', label: 'Completado' },
                { value: 'GENERATING', label: 'Generando' },
                { value: 'FAILED', label: 'Fallido' },
                { value: 'EXPIRED', label: 'Expirado' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de reportes */}
      <Card>
        <CardContent className="p-0">
          {currentReports.length === 0 ? (
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reportes</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || typeFilter || statusFilter
                  ? 'No se encontraron reportes con los filtros aplicados.'
                  : 'Comienza generando tu primer reporte médico.'}
              </p>
              {!searchTerm && !typeFilter && !statusFilter && (
                <div className="mt-6">
                  <Link href="/reports/new">
                    <Button>
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Crear Primer Reporte
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {currentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => onReportClick?.(report)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Icono del tipo de reporte */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                        {getReportTypeIcon(report.type)}
                      </div>

                      {/* Información principal */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                          <Badge
                            variant={
                              report.status === 'COMPLETED'
                                ? 'success'
                                : report.status === 'GENERATING'
                                  ? 'warning'
                                  : report.status === 'FAILED'
                                    ? 'error'
                                    : 'default'
                            }
                          >
                            {getReportStatusLabel(report.status)}
                          </Badge>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(report.type)}`}
                          >
                            {getReportTypeLabel(report.type)}
                          </span>
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            {report.generatedByUser?.firstName} {report.generatedByUser?.lastName}
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatDate(report.generatedAt)}
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
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                            Período:{' '}
                            {formatDateRange(report.dateRange.startDate, report.dateRange.endDate)}
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
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Formato: {report.format}
                          </span>
                        </div>

                        {/* Descripción */}
                        {report.description && (
                          <div className="mt-2 text-sm text-gray-700">{report.description}</div>
                        )}

                        {/* Métricas resumen */}
                        <div className="mt-3 flex flex-wrap gap-4">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">Registros:</span>
                            <span className="ml-1 text-gray-600">
                              {report.data.summary.totalRecords.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">Gráficos:</span>
                            <span className="ml-1 text-gray-600">{report.data.charts.length}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">Tablas:</span>
                            <span className="ml-1 text-gray-600">{report.data.tables.length}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">Métricas:</span>
                            <span className="ml-1 text-gray-600">{report.data.metrics.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2">
                      {report.status === 'COMPLETED' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleExport(report, 'PDF')
                            }}
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
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            PDF
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleExport(report, 'EXCEL')
                            }}
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
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                            Excel
                          </Button>
                        </>
                      )}

                      {report.status === 'FAILED' && onRegenerateReport && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onRegenerateReport(report.id)
                          }}
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Regenerar
                        </Button>
                      )}

                      {report.status === 'GENERATING' && (
                        <div className="flex items-center text-sm text-yellow-600">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generando...
                        </div>
                      )}

                      {onDeleteReport && report.status !== 'GENERATING' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteReport(report.id)
                          }}
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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

      {/* Paginación */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {startIndex + 1} -{' '}
                {Math.min(startIndex + reportsPerPage, filteredReports.length)} de{' '}
                {filteredReports.length} reportes
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
