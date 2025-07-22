import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent, Button, Input, Select, Badge } from '@/components/ui'

// Tipos locales para el componente
interface Patient {
  firstName: string
  lastName: string
  dateOfBirth?: Date
}

interface Doctor {
  firstName: string
  lastName: string
}

interface Medication {
  name: string
  category?: string
  isControlled?: boolean
}

interface PrescriptionMedication {
  id: string
  dosage: string
  medication?: Medication
}

interface Prescription {
  id: string
  prescriptionNumber: string
  patient?: Patient
  doctor?: Doctor
  diagnosis: string
  status: string
  prescriptionDate: Date
  followUpDate?: Date
  duration: number
  medications?: PrescriptionMedication[]
}

// Funciones utilitarias locales
const getPrescriptionStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    ACTIVE: 'Activa',
    COMPLETED: 'Completada',
    SUSPENDED: 'Suspendida',
    CANCELLED: 'Cancelada',
  }
  return labels[status] || status
}

const getMedicationCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    ANTIBIOTIC: '🦠',
    ANALGESIC: '💊',
    CARDIOVASCULAR: '❤️',
    RESPIRATORY: '🫁',
    NEUROLOGICAL: '🧠',
    DIABETES: '🩸',
    OTHER: '💊',
  }
  return icons[category] || '💊'
}

interface PrescriptionListProps {
  prescriptions: Prescription[]
  onPrescriptionClick?: (prescription: Prescription) => void
  onEditPrescription?: (prescription: Prescription) => void
  onPrintPrescription?: (prescriptionId: string) => void
}

export function PrescriptionList({
  prescriptions,
  onPrescriptionClick,
  onEditPrescription,
  onPrintPrescription,
}: PrescriptionListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const prescriptionsPerPage = 10

  // Filtrar recetas
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || prescription.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Paginación
  const totalPages = Math.ceil(filteredPrescriptions.length / prescriptionsPerPage)
  const startIndex = (currentPage - 1) * prescriptionsPerPage
  const currentPrescriptions = filteredPrescriptions.slice(
    startIndex,
    startIndex + prescriptionsPerPage
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'SUSPENDED':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recetas Médicas</h3>
              <p className="text-sm text-gray-500">
                {filteredPrescriptions.length} receta{filteredPrescriptions.length !== 1 ? 's' : ''}{' '}
                encontrada{filteredPrescriptions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link href="/prescriptions/new">
              <Button className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nueva Receta
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por número, paciente, doctor o diagnóstico..."
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
              placeholder="Estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos los estados' },
                { value: 'ACTIVE', label: 'Activa' },
                { value: 'COMPLETED', label: 'Completada' },
                { value: 'SUSPENDED', label: 'Suspendida' },
                { value: 'CANCELLED', label: 'Cancelada' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de recetas */}
      <Card>
        <CardContent className="p-0">
          {currentPrescriptions.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay recetas</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter
                  ? 'No se encontraron recetas con los filtros aplicados.'
                  : 'Comienza creando una nueva receta médica.'}
              </p>
              {!searchTerm && !statusFilter && (
                <div className="mt-6">
                  <Link href="/prescriptions/new">
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
                      Crear Primera Receta
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {currentPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => onPrescriptionClick?.(prescription)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Icono de medicamento principal */}
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                        {prescription.medications && prescription.medications.length > 0
                          ? getMedicationCategoryIcon(
                              prescription.medications[0].medication?.category || 'OTHER'
                            )
                          : '💊'}
                      </div>

                      {/* Información principal */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {prescription.prescriptionNumber}
                          </h3>
                          <Badge
                            variant={
                              prescription.status === 'ACTIVE'
                                ? 'success'
                                : prescription.status === 'COMPLETED'
                                  ? 'info'
                                  : prescription.status === 'SUSPENDED'
                                    ? 'warning'
                                    : 'error'
                            }
                          >
                            {getPrescriptionStatusLabel(prescription.status)}
                          </Badge>
                          {prescription.medications?.some(
                            (med) => med.medication?.isControlled
                          ) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Controlado
                            </span>
                          )}
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
                            {prescription.patient?.firstName} {prescription.patient?.lastName}
                            {prescription.patient?.dateOfBirth && (
                              <span className="ml-1">
                                ({calculateAge(prescription.patient.dateOfBirth)} años)
                              </span>
                            )}
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
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-7 0h2m-5 0H6m5 0v-5a2 2 0 011-1h2a2 2 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
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
                            {formatDate(prescription.prescriptionDate)} -{' '}
                            {formatTime(prescription.prescriptionDate)}
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
                            {prescription.medications?.length || 0} medicamento
                            {(prescription.medications?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Diagnóstico */}
                        <div className="mt-2 text-sm text-gray-700">
                          <strong>Diagnóstico:</strong> {prescription.diagnosis}
                        </div>

                        {/* Medicamentos principales */}
                        {prescription.medications && prescription.medications.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {prescription.medications.slice(0, 3).map((med) => (
                              <span
                                key={med.id}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800"
                              >
                                {med.medication?.name} - {med.dosage}
                              </span>
                            ))}
                            {prescription.medications.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                +{prescription.medications.length - 3} más
                              </span>
                            )}
                          </div>
                        )}

                        {/* Duración */}
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Duración:</strong> {prescription.duration} días
                          {prescription.followUpDate && (
                            <span className="ml-4">
                              <strong>Seguimiento:</strong> {formatDate(prescription.followUpDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2">
                      {onPrintPrescription && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onPrintPrescription(prescription.id)
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
                              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                            />
                          </svg>
                          Imprimir
                        </Button>
                      )}

                      {prescription.status === 'ACTIVE' && (
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
                          Dispensar
                        </Button>
                      )}

                      {onEditPrescription && prescription.status === 'ACTIVE' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditPrescription(prescription)
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

      {/* Paginación */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {startIndex + 1} -{' '}
                {Math.min(startIndex + prescriptionsPerPage, filteredPrescriptions.length)} de{' '}
                {filteredPrescriptions.length} recetas
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
