import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardContent, Button } from '@/components/ui'
import {
  ArrowLeft,
  FileText,
  Calendar,
  Heart,
  Activity,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'

// Mock data simplificado
const mockMedicalRecord = {
  id: 'mr-001',
  patient: {
    firstName: 'María',
    lastName: 'González López',
    birthDate: new Date('1985-03-15'),
    gender: 'F' as const,
    bloodType: 'O+',
    contactInfo: {
      phone: '+52 555 123 4567',
      email: 'maria.gonzalez@email.com',
      address: 'Av. Reforma 123, Col. Centro, CDMX',
    },
  },
  allergies: [
    { substance: 'Penicilina', reaction: 'Urticaria', severity: 'Moderada' },
    { substance: 'Mariscos', reaction: 'Anafilaxia', severity: 'Severa' },
  ],
  chronicDiseases: [
    { condition: 'Diabetes Mellitus Tipo 2', status: 'Activa' },
    { condition: 'Hipertensión Arterial', status: 'Activa' },
  ],
  currentMedications: [
    { name: 'Metformina', dosage: '850mg', frequency: 'BID' },
    { name: 'Enalapril', dosage: '10mg', frequency: 'QD' },
  ],
  recentEvents: [
    {
      id: 'event-1',
      title: 'Consulta de Control - Diabetes',
      description: 'Control rutinario. Glucemia: 125 mg/dL',
      date: new Date('2024-01-15'),
      doctor: 'Dr. José Martínez',
      type: 'Consulta',
    },
    {
      id: 'event-2',
      title: 'Resultados de Laboratorio',
      description: 'HbA1c: 7.2%, Control metabólico aceptable',
      date: new Date('2024-01-10'),
      doctor: 'Dr. José Martínez',
      type: 'Laboratorio',
    },
  ],
}

export default function MedicalRecordDetailPage() {
  const router = useRouter()
  const { user, isLoading } = useAuthGuard()
  const { id } = router.query
  const [activeTab, setActiveTab] = useState<'timeline' | 'notes'>('timeline')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !id) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Historia clínica no encontrada
              </h3>
              <p className="text-gray-600 mb-4">La historia clínica que buscas no existe.</p>
              <Button onClick={() => router.push('/medical-records')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

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

  return (
    <Layout title="Historia Clínica">
      {/* Content */}
      <div className="space-y-6">
        {/* Patient Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {mockMedicalRecord.patient.firstName} {mockMedicalRecord.patient.lastName}
                  </h2>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span>{getAgeFromBirthDate(mockMedicalRecord.patient.birthDate)} años</span>
                    <span>•</span>
                    <span>
                      {mockMedicalRecord.patient.gender === 'F' ? 'Femenino' : 'Masculino'}
                    </span>
                    <span>•</span>
                    <span>Tipo {mockMedicalRecord.patient.bloodType}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Información de Contacto</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{mockMedicalRecord.patient.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{mockMedicalRecord.patient.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">
                        {mockMedicalRecord.patient.contactInfo.address}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Información Médica</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Alergias:</span>
                      <span className="ml-1 font-medium">
                        {mockMedicalRecord.allergies.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Enfermedades:</span>
                      <span className="ml-1 font-medium">
                        {mockMedicalRecord.chronicDiseases.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Medicamentos:</span>
                      <span className="ml-1 font-medium">
                        {mockMedicalRecord.currentMedications.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allergies */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-gray-900">Alergias</h3>
              </div>
            </CardHeader>
            <CardContent>
              {mockMedicalRecord.allergies.length > 0 ? (
                <div className="space-y-3">
                  {mockMedicalRecord.allergies.map((allergy, index) => (
                    <div key={index} className="border-l-4 border-red-400 pl-3">
                      <div className="font-medium text-red-800">{allergy.substance}</div>
                      <div className="text-sm text-gray-600">{allergy.reaction}</div>
                      <div className="text-xs px-2 py-1 rounded mt-1 inline-block bg-red-100 text-red-800">
                        {allergy.severity}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sin alergias conocidas</p>
              )}
            </CardContent>
          </Card>

          {/* Chronic Diseases */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Enfermedades Crónicas</h3>
              </div>
            </CardHeader>
            <CardContent>
              {mockMedicalRecord.chronicDiseases.length > 0 ? (
                <div className="space-y-3">
                  {mockMedicalRecord.chronicDiseases.map((disease, index) => (
                    <div key={index} className="border-l-4 border-orange-400 pl-3">
                      <div className="font-medium text-orange-800">{disease.condition}</div>
                      <div className="text-xs px-2 py-1 rounded mt-1 inline-block bg-orange-100 text-orange-800">
                        {disease.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sin enfermedades crónicas</p>
              )}
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-blue-500 rounded" />
                <h3 className="font-semibold text-gray-900">Medicamentos Actuales</h3>
              </div>
            </CardHeader>
            <CardContent>
              {mockMedicalRecord.currentMedications.length > 0 ? (
                <div className="space-y-3">
                  {mockMedicalRecord.currentMedications.map((medication, index) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-3">
                      <div className="font-medium text-blue-800">{medication.name}</div>
                      <div className="text-sm text-gray-600">
                        {medication.dosage} - {medication.frequency}
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

        {/* Timeline */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Timeline Médico</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMedicalRecord.recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-l-4 border-blue-200 pl-4 hover:bg-gray-50 rounded-r-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {event.type}
                        </span>
                      </div>

                      <h5 className="font-semibold text-gray-900 mb-1">{event.title}</h5>
                      <p className="text-gray-600 text-sm mb-2">{event.description}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date.toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{event.doctor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
