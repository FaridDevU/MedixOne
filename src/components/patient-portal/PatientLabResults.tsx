import React, { useState } from 'react'
import {
  PatientLabResult,
  LabResultDetail,
  getResultStatusColor,
  formatFileSize,
  getDocumentIcon,
} from '@/types/patient-portal'
import { Card, CardHeader, CardContent, Button, Input } from '@/components/ui'

interface PatientLabResultsProps {
  results: PatientLabResult[]
  onDownloadResult?: (resultId: string) => Promise<void>
  onMarkAsRead?: (resultId: string) => Promise<void>
}

export function PatientLabResults({
  results,
  onDownloadResult,
  onMarkAsRead,
}: PatientLabResultsProps) {
  const [selectedResult, setSelectedResult] = useState<PatientLabResult | null>(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredResults = results.filter((result) => {
    // Filtro por estado
    const statusMatch =
      filter === 'all' ||
      (filter === 'ready' && result.status === 'READY') ||
      (filter === 'pending' && ['PENDING', 'IN_PROGRESS'].includes(result.status)) ||
      (filter === 'abnormal' && ['ABNORMAL', 'CRITICAL'].includes(result.status)) ||
      (filter === 'unread' && !result.isRead)

    // Filtro por búsqueda
    const searchMatch =
      searchTerm === '' ||
      result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.doctor.name.toLowerCase().includes(searchTerm.toLowerCase())

    return statusMatch && searchMatch
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleViewResult = (result: PatientLabResult) => {
    setSelectedResult(result)
    if (!result.isRead && onMarkAsRead) {
      onMarkAsRead(result.id)
    }
  }

  const handleDownload = async (resultId: string) => {
    if (onDownloadResult) {
      await onDownloadResult(resultId)
    }
  }

  const getParameterStatusColor = (status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL') => {
    switch (status) {
      case 'NORMAL':
        return 'bg-green-100 text-green-800'
      case 'ABNORMAL':
        return 'bg-yellow-100 text-yellow-800'
      case 'CRITICAL':
        return 'bg-red-100 text-red-800'
    }
  }

  const getParameterIcon = (status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL') => {
    switch (status) {
      case 'NORMAL':
        return '✓'
      case 'ABNORMAL':
        return '⚠'
      case 'CRITICAL':
        return '⚠'
    }
  }

  const getPriorityColor = (priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT') => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-800'
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'URGENT':
        return 'bg-red-100 text-red-800'
    }
  }

  const newResultsCount = results.filter((r) => !r.isRead).length
  const readyResultsCount = results.filter((r) => r.status === 'READY').length
  const abnormalResultsCount = results.filter((r) =>
    ['ABNORMAL', 'CRITICAL'].includes(r.status)
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resultados de Laboratorio</h1>
          <p className="text-gray-500 mt-1">Consulta tus resultados médicos y reportes</p>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-700">{results.length}</h3>
                <p className="text-sm text-blue-600">Total resultados</p>
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
                <h3 className="text-2xl font-bold text-green-700">{readyResultsCount}</h3>
                <p className="text-sm text-green-600">Listos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-yellow-700">{abnormalResultsCount}</h3>
                <p className="text-sm text-yellow-600">Requieren atención</p>
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-700">{newResultsCount}</h3>
                <p className="text-sm text-purple-600">Sin revisar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda y filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre del examen o doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Todos ({results.length})
              </Button>
              <Button
                variant={filter === 'ready' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('ready')}
              >
                Listos ({readyResultsCount})
              </Button>
              <Button
                variant={filter === 'pending' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pendientes (
                {results.filter((r) => ['PENDING', 'IN_PROGRESS'].includes(r.status)).length})
              </Button>
              <Button
                variant={filter === 'abnormal' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('abnormal')}
              >
                Anormales ({abnormalResultsCount})
              </Button>
              <Button
                variant={filter === 'unread' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Sin leer ({newResultsCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de resultados */}
      <Card>
        <CardContent className="p-0">
          {filteredResults.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay resultados</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? 'No se encontraron resultados con ese criterio de búsqueda.'
                  : 'Los resultados aparecerán aquí cuando estén listos.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${!result.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icono del tipo de examen */}
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl">
                        🧪
                      </div>

                      {/* Información principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{result.testName}</h3>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getResultStatusColor(result.status)}`}
                          >
                            {result.status === 'READY' && 'Listo'}
                            {result.status === 'PENDING' && 'Pendiente'}
                            {result.status === 'IN_PROGRESS' && 'En proceso'}
                            {result.status === 'ABNORMAL' && 'Anormal'}
                            {result.status === 'CRITICAL' && 'Crítico'}
                          </span>

                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(result.priority)}`}
                          >
                            {result.priority === 'LOW' && 'Baja'}
                            {result.priority === 'NORMAL' && 'Normal'}
                            {result.priority === 'HIGH' && 'Alta'}
                            {result.priority === 'URGENT' && 'Urgente'}
                          </span>

                          {!result.isRead && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              Nuevo
                            </span>
                          )}
                        </div>

                        {/* Información del doctor y fechas */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center">
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Dr. {result.doctor.name}
                          </div>
                          <div className="flex items-center">
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
                            Ordenado: {formatDate(result.orderDate)}
                          </div>
                          {result.resultDate && (
                            <div className="flex items-center">
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
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Resultado: {formatDate(result.resultDate)}
                            </div>
                          )}
                        </div>

                        {/* Resumen de resultados si están disponibles */}
                        {result.results && result.status === 'READY' && (
                          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Resumen</h4>
                            <p className="text-sm text-gray-700">{result.results.summary}</p>

                            {result.results.interpretation && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  <strong>Interpretación:</strong> {result.results.interpretation}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Documentos adjuntos */}
                        {result.documents.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
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
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            <span>
                              {result.documents.length} archivo
                              {result.documents.length > 1 ? 's' : ''} adjunto
                              {result.documents.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {result.status === 'READY' && (
                        <>
                          <Button size="sm" onClick={() => handleViewResult(result)}>
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Ver Detalle
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(result.id)}
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
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Descargar
                          </Button>
                        </>
                      )}

                      {['PENDING', 'IN_PROGRESS'].includes(result.status) && (
                        <div className="text-sm text-gray-500 text-center">
                          {result.status === 'PENDING' ? 'Pendiente' : 'En proceso'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalle del resultado */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedResult.testName}</h3>
                  <p className="text-gray-500">
                    Dr. {selectedResult.doctor.name} • {formatDateTime(selectedResult.resultDate!)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedResult(null)}
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
            <CardContent className="space-y-6">
              {/* Resumen y estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Estado del Resultado</h4>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getResultStatusColor(selectedResult.status)}`}
                  >
                    {selectedResult.status === 'READY' && 'Listo'}
                    {selectedResult.status === 'ABNORMAL' && 'Anormal'}
                    {selectedResult.status === 'CRITICAL' && 'Crítico'}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prioridad</h4>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedResult.priority)}`}
                  >
                    {selectedResult.priority === 'LOW' && 'Baja'}
                    {selectedResult.priority === 'NORMAL' && 'Normal'}
                    {selectedResult.priority === 'HIGH' && 'Alta'}
                    {selectedResult.priority === 'URGENT' && 'Urgente'}
                  </span>
                </div>
              </div>

              {/* Resumen */}
              {selectedResult.results?.summary && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resumen</h4>
                  <p className="text-gray-700">{selectedResult.results.summary}</p>
                </div>
              )}

              {/* Resultados detallados */}
              {selectedResult.results?.details && selectedResult.results.details.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Resultados Detallados</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                            Parámetro
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                            Valor
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                            Rango de Referencia
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedResult.results.details.map((detail, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-900">{detail.parameter}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                              {detail.value} {detail.unit}
                              {detail.flag && (
                                <span className="ml-2 text-red-600 font-semibold">
                                  {detail.flag}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {detail.referenceRange}
                            </td>
                            <td className="px-4 py-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getParameterStatusColor(detail.status)}`}
                              >
                                {getParameterIcon(detail.status)}{' '}
                                {detail.status === 'NORMAL'
                                  ? 'Normal'
                                  : detail.status === 'ABNORMAL'
                                    ? 'Anormal'
                                    : 'Crítico'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Interpretación */}
              {selectedResult.results?.interpretation && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Interpretación Médica</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <p className="text-blue-800">{selectedResult.results.interpretation}</p>
                  </div>
                </div>
              )}

              {/* Recomendaciones */}
              {selectedResult.results?.recommendations &&
                selectedResult.results.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recomendaciones</h4>
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <ul className="list-disc list-inside space-y-1 text-green-800">
                        {selectedResult.results.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              {/* Documentos adjuntos */}
              {selectedResult.documents.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Documentos Adjuntos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedResult.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl mr-3">{getDocumentIcon(doc.type)}</span>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h5>
                          <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                        </div>
                        <Button variant="outline" size="sm">
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
                          Descargar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedResult(null)}>
                  Cerrar
                </Button>
                <Button onClick={() => handleDownload(selectedResult.id)}>
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Descargar Resultado
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
