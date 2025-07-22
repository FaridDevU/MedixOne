import React, { useState } from 'react'
import { useTranslations } from '@/contexts/LanguageContext'
import { Card, CardHeader, CardContent, Button } from '@/components/ui'
import {
  User,
  Heart,
  AlertTriangle,
  Calendar,
  FileText,
  Activity,
  Phone,
  Mail,
  MapPin,
  Shield,
} from 'lucide-react'

// Tipos básicos para el componente
interface Patient {
  id: string
  firstName: string
  lastName: string
  birthDate: Date
  gender: 'M' | 'F' | 'OTHER'
  bloodType?: string
  photo?: string
  contactInfo: {
    phone: string
    email: string
    address: string
  }
}

interface Allergy {
  substance: string
  reaction: string
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'
}

interface ChronicDisease {
  condition: string
  diagnosedDate: Date
  status: 'ACTIVE' | 'INACTIVE' | 'RESOLVED'
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  startDate: Date
  isActive: boolean
}

interface MedicalRecord {
  id: string
  patientId: string
  patient: Patient
  criticalInfo: {
    allergies: Allergy[]
    chronicDiseases: ChronicDisease[]
    currentMedications: Medication[]
  }
  statistics: {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    totalConsultations: number
    totalAllergies: number
    totalMedications: number
    totalSurgeries: number
    lastConsultation?: Date
  }
  timeline: any[]
  notes: any[]
  recentVitalSigns: any[]
}

interface MedicalRecordProps {
  medicalRecord: MedicalRecord
  onUpdateRecord?: (record: MedicalRecord) => void
}

export function MedicalRecord({ medicalRecord, onUpdateRecord }: MedicalRecordProps) {
  const { t } = useTranslations()
  const [activeTab, setActiveTab] = useState<'timeline' | 'notes' | 'vitals' | 'evolution'>(
    'timeline'
  )

  const { patient, criticalInfo, statistics, recentVitalSigns } = medicalRecord

  const getAgeFromBirthDate = (birthDate: Date): number => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const getRiskLevelColor = (riskLevel: string): string => {
    const colors = {
      LOW: 'text-green-600 bg-green-100',
      MEDIUM: 'text-yellow-600 bg-yellow-100',
      HIGH: 'text-orange-600 bg-orange-100',
      CRITICAL: 'text-red-600 bg-red-100',
    }
    return colors[riskLevel as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  }

  const tabs = [
    { id: 'timeline', label: t('medicalRecords.timeline'), icon: Activity },
    { id: 'notes', label: t('medicalRecords.medicalNotes'), icon: FileText },
    { id: 'vitals', label: 'Signos Vitales', icon: Heart },
    { id: 'evolution', label: t('medicalRecords.evolution'), icon: Calendar },
  ]

  return (
    <div className="space-y-6">
      {/* Header del Paciente */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            {/* Foto del paciente */}
            <div className="flex-shrink-0">
              {patient.photo ? (
                <img
                  src={patient.photo}
                  alt={`${patient.firstName} ${patient.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
            </div>

            {/* Información básica */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {patient.firstName} {patient.lastName}
                </h2>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span>{getAgeFromBirthDate(patient.birthDate)} años</span>
                  <span>•</span>
                  <span>
                    {patient.gender === 'M'
                      ? 'Masculino'
                      : patient.gender === 'F'
                        ? 'Femenino'
                        : 'Otro'}
                  </span>
                  {patient.bloodType && (
                    <>
                      <span>•</span>
                      <span className="font-medium">Tipo {patient.bloodType}</span>
                    </>
                  )}
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(statistics.riskLevel)}`}
                  >
                    {statistics.riskLevel === 'LOW'
                      ? 'Riesgo Bajo'
                      : statistics.riskLevel === 'MEDIUM'
                        ? 'Riesgo Medio'
                        : statistics.riskLevel === 'HIGH'
                          ? 'Riesgo Alto'
                          : 'Riesgo Crítico'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Información de Contacto</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{patient.contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{patient.contactInfo.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{patient.contactInfo.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Estadísticas Médicas</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Consultas:</span>
                    <span className="ml-1 font-medium">{statistics.totalConsultations}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Alergias:</span>
                    <span className="ml-1 font-medium">{statistics.totalAllergies}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Medicamentos:</span>
                    <span className="ml-1 font-medium">{statistics.totalMedications}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cirugías:</span>
                    <span className="ml-1 font-medium">{statistics.totalSurgeries}</span>
                  </div>
                </div>
                {statistics.lastConsultation && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span>Última consulta: </span>
                    <span className="font-medium">
                      {statistics.lastConsultation.toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Médica Crítica */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alergias */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold text-gray-900">Alergias</h3>
            </div>
          </CardHeader>
          <CardContent>
            {criticalInfo.allergies.length > 0 ? (
              <div className="space-y-3">
                {criticalInfo.allergies.map((allergy, index) => (
                  <div key={index} className="border-l-4 border-red-400 pl-3">
                    <div className="font-medium text-red-800">{allergy.substance}</div>
                    <div className="text-sm text-gray-600">{allergy.reaction}</div>
                    <div
                      className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                        allergy.severity === 'LIFE_THREATENING'
                          ? 'bg-red-100 text-red-800'
                          : allergy.severity === 'SEVERE'
                            ? 'bg-orange-100 text-orange-800'
                            : allergy.severity === 'MODERATE'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {allergy.severity === 'LIFE_THREATENING'
                        ? 'Amenaza de vida'
                        : allergy.severity === 'SEVERE'
                          ? 'Severa'
                          : allergy.severity === 'MODERATE'
                            ? 'Moderada'
                            : 'Leve'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Sin alergias conocidas</p>
            )}
          </CardContent>
        </Card>

        {/* Enfermedades Crónicas */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Enfermedades Crónicas</h3>
            </div>
          </CardHeader>
          <CardContent>
            {criticalInfo.chronicDiseases.length > 0 ? (
              <div className="space-y-3">
                {criticalInfo.chronicDiseases.map((disease, index) => (
                  <div key={index} className="border-l-4 border-orange-400 pl-3">
                    <div className="font-medium text-orange-800">{disease.condition}</div>
                    <div className="text-sm text-gray-600">
                      Desde: {disease.diagnosedDate.toLocaleDateString('es-ES')}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                        disease.status === 'ACTIVE'
                          ? 'bg-red-100 text-red-800'
                          : disease.status === 'INACTIVE'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {disease.status === 'ACTIVE'
                        ? 'Activa'
                        : disease.status === 'INACTIVE'
                          ? 'Inactiva'
                          : 'Resuelta'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Sin enfermedades crónicas</p>
            )}
          </CardContent>
        </Card>

        {/* Medicamentos Actuales */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-blue-500 rounded" />
              <h3 className="font-semibold text-gray-900">Medicamentos Actuales</h3>
            </div>
          </CardHeader>
          <CardContent>
            {criticalInfo.currentMedications.filter((med) => med.isActive).length > 0 ? (
              <div className="space-y-3">
                {criticalInfo.currentMedications
                  .filter((med) => med.isActive)
                  .map((medication, index) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-3">
                      <div className="font-medium text-blue-800">{medication.name}</div>
                      <div className="text-sm text-gray-600">
                        {medication.dosage} - {medication.frequency}
                      </div>
                      <div className="text-xs text-gray-500">
                        Desde: {medication.startDate.toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Sin medicamentos actuales</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon
                  className={`-ml-0.5 mr-2 h-5 w-5 ${
                    activeTab === tab.id
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div className="mt-6">
        {activeTab === 'timeline' && (
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Historial Médico</h3>
              <p className="text-gray-600 mb-4">
                El historial médico muestra todos los eventos médicos del paciente organizados
                cronológicamente.
              </p>
              <p className="text-sm text-gray-500">
                {medicalRecord.timeline.length} eventos registrados
              </p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notes' && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notas Médicas</h3>
              <p className="text-gray-600 mb-4">
                Las notas médicas contienen observaciones y comentarios importantes sobre el
                paciente.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {medicalRecord.notes.length} notas registradas
              </p>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Nueva Nota
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'vitals' && (
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Signos Vitales</h3>
              <p className="text-gray-600 mb-4">
                Registro de signos vitales del paciente incluyendo presión arterial, frecuencia
                cardíaca, temperatura y más.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {recentVitalSigns.length} registros de signos vitales
              </p>
              <Button>
                <Heart className="h-4 w-4 mr-2" />
                Registrar Signos Vitales
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'evolution' && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Evoluciones Médicas</h3>
              <p className="text-gray-600 mb-4">
                Las evoluciones médicas permiten documentar el progreso del paciente a lo largo del
                tiempo.
              </p>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Nueva Evolución
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
