import React, { useState } from 'react'
import { useTranslations } from '@/contexts/LanguageContext'
import { Card, CardHeader, CardContent, Button } from '@/components/ui'
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'

// Tipos locales para el componente
type MedicalNoteType =
  | 'EVOLUTION'
  | 'DIAGNOSIS'
  | 'TREATMENT'
  | 'PROCEDURE'
  | 'CONSULTATION'
  | 'INTERCONSULTATION'
  | 'DISCHARGE'
  | 'FOLLOW_UP'

type MedicalSpecialty =
  | 'GENERAL_MEDICINE'
  | 'CARDIOLOGY'
  | 'ENDOCRINOLOGY'
  | 'NEUROLOGY'
  | 'PEDIATRICS'
  | 'GYNECOLOGY'
  | 'DERMATOLOGY'
  | 'PSYCHIATRY'
  | 'OPHTHALMOLOGY'
  | 'TRAUMATOLOGY'
  | 'ONCOLOGY'
  | 'RADIOLOGY'

type ApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'

interface MedicalNote {
  id: string
  title: string
  content: string
  type: MedicalNoteType
  specialty: MedicalSpecialty
  authorId: string
  doctorName?: string
  patientId: string
  createdAt: Date
  updatedAt?: Date
  approvalStatus: ApprovalStatus
  approvedBy?: string
  approvedAt?: Date
  isConfidential: boolean
  tags?: string[]
  digitalSignature?: string
}

interface MedicalNotesProps {
  notes: MedicalNote[]
  patientId: string
  onNotesChange?: (notes: MedicalNote[]) => void
}

export function MedicalNotes({ notes, patientId, onNotesChange }: MedicalNotesProps) {
  const { t } = useTranslations()
  const [showNewNoteForm, setShowNewNoteForm] = useState(false)
  const [selectedNote, setSelectedNote] = useState<MedicalNote | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    type: '' as MedicalNoteType | '',
    specialty: '' as MedicalSpecialty | '',
    status: '' as ApprovalStatus | '',
  })

  // Filtrar notas
  const filteredNotes = notes
    .filter((note) => {
      if (
        filters.search &&
        !note.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !note.content.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }
      if (filters.type && note.type !== filters.type) return false
      if (filters.specialty && note.specialty !== filters.specialty) return false
      if (filters.status && note.approvalStatus !== filters.status) return false
      return true
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const getStatusColor = (status: ApprovalStatus): string => {
    const colors = {
      DRAFT: 'text-gray-600 bg-gray-100',
      PENDING: 'text-yellow-600 bg-yellow-100',
      APPROVED: 'text-green-600 bg-green-100',
      REJECTED: 'text-red-600 bg-red-100',
    }
    return colors[status]
  }

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getNoteTypeLabel = (type: MedicalNoteType): string => {
    const labels = {
      EVOLUTION: 'Evolución',
      DIAGNOSIS: 'Diagnóstico',
      TREATMENT: 'Tratamiento',
      PROCEDURE: 'Procedimiento',
      CONSULTATION: 'Consulta',
      INTERCONSULTATION: 'Interconsulta',
      DISCHARGE: 'Egreso',
      FOLLOW_UP: 'Seguimiento',
    }
    return labels[type] || type
  }

  const getSpecialtyLabel = (specialty: MedicalSpecialty): string => {
    const labels = {
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
    return labels[specialty] || specialty
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('medicalRecords.medicalNotes')} ({filteredNotes.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Notas médicas y documentación clínica del paciente
              </p>
            </div>
            <Button onClick={() => setShowNewNoteForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('medicalRecords.newNote')}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="border-t">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar notas</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en título o contenido..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de nota</label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value as MedicalNoteType })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                <option value="EVOLUTION">Evolución</option>
                <option value="DIAGNOSIS">Diagnóstico</option>
                <option value="TREATMENT">Tratamiento</option>
                <option value="PROCEDURE">Procedimiento</option>
                <option value="CONSULTATION">Consulta</option>
                <option value="INTERCONSULTATION">Interconsulta</option>
                <option value="DISCHARGE">Egreso</option>
                <option value="FOLLOW_UP">Seguimiento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
              <select
                value={filters.specialty}
                onChange={(e) =>
                  setFilters({ ...filters, specialty: e.target.value as MedicalSpecialty })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las especialidades</option>
                <option value="GENERAL_MEDICINE">Medicina General</option>
                <option value="CARDIOLOGY">Cardiología</option>
                <option value="ENDOCRINOLOGY">Endocrinología</option>
                <option value="NEUROLOGY">Neurología</option>
                <option value="PEDIATRICS">Pediatría</option>
                <option value="GYNECOLOGY">Ginecología</option>
                <option value="DERMATOLOGY">Dermatología</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value as ApprovalStatus })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="DRAFT">Borrador</option>
                <option value="PENDING">Pendiente</option>
                <option value="APPROVED">Aprobada</option>
                <option value="REJECTED">Rechazada</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de notas */}
      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {getNoteTypeLabel(note.type)}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {getSpecialtyLabel(note.specialty)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(note.approvalStatus)}`}
                    >
                      {getStatusIcon(note.approvalStatus)}
                      <span>
                        {note.approvalStatus === 'DRAFT'
                          ? 'Borrador'
                          : note.approvalStatus === 'PENDING'
                            ? 'Pendiente'
                            : note.approvalStatus === 'APPROVED'
                              ? 'Aprobada'
                              : 'Rechazada'}
                      </span>
                    </span>
                    {note.isConfidential && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Confidencial
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{note.content}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Dr. {note.doctorName || note.authorId}</span>
                    <span>•</span>
                    <span>{note.createdAt.toLocaleDateString('es-ES')}</span>
                    {note.approvedBy && note.approvedAt && (
                      <>
                        <span>•</span>
                        <span>
                          Aprobada por {note.approvedBy} el{' '}
                          {note.approvedAt.toLocaleDateString('es-ES')}
                        </span>
                      </>
                    )}
                  </div>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => setSelectedNote(note)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {note.approvalStatus === 'DRAFT' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          /* Editar nota */
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          /* Eliminar nota */
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de vista de nota */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Nota Médica</h3>
                <button
                  onClick={() => setSelectedNote(null)}
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

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedNote.title}</h4>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {getNoteTypeLabel(selectedNote.type)}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {getSpecialtyLabel(selectedNote.specialty)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(selectedNote.approvalStatus)}`}
                    >
                      {getStatusIcon(selectedNote.approvalStatus)}
                      <span>
                        {selectedNote.approvalStatus === 'DRAFT'
                          ? 'Borrador'
                          : selectedNote.approvalStatus === 'PENDING'
                            ? 'Pendiente'
                            : selectedNote.approvalStatus === 'APPROVED'
                              ? 'Aprobada'
                              : 'Rechazada'}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">{selectedNote.content}</div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Doctor:</span>
                      <span className="ml-2 font-medium">
                        Dr. {selectedNote.doctorName || selectedNote.authorId}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Fecha de creación:</span>
                      <span className="ml-2 font-medium">
                        {selectedNote.createdAt.toLocaleString('es-ES')}
                      </span>
                    </div>
                    {selectedNote.approvedBy && selectedNote.approvedAt && (
                      <>
                        <div>
                          <span className="text-gray-500">Aprobado por:</span>
                          <span className="ml-2 font-medium">{selectedNote.approvedBy}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Fecha de aprobación:</span>
                          <span className="ml-2 font-medium">
                            {selectedNote.approvedAt.toLocaleString('es-ES')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {selectedNote.digitalSignature && (
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Documento firmado digitalmente</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredNotes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notas médicas</h3>
            <p className="text-gray-600 mb-4">
              Aún no se han creado notas médicas para este paciente.
            </p>
            <Button onClick={() => setShowNewNoteForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear primera nota
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
