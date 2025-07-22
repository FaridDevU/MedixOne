import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardContent, Button } from '@/components/ui'
import {
  FileText,
  Search,
  Plus,
  Eye,
  Calendar,
  Heart,
  AlertTriangle,
  User,
  ArrowRight,
  Clock,
} from 'lucide-react'

// Mock data simplificado
const mockPatients = [
  {
    id: 'pat-001',
    firstName: 'María',
    lastName: 'González López',
    birthDate: new Date('1985-03-15'),
    gender: 'F' as const,
    bloodType: 'O+',
    lastConsultation: new Date('2024-01-15'),
    totalConsultations: 12,
    riskLevel: 'MEDIUM' as const,
    activeAllergies: 2,
    chronicDiseases: 2,
  },
  {
    id: 'pat-002',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    birthDate: new Date('1978-07-22'),
    gender: 'M' as const,
    bloodType: 'A+',
    lastConsultation: new Date('2024-01-12'),
    totalConsultations: 8,
    riskLevel: 'HIGH' as const,
    activeAllergies: 1,
    chronicDiseases: 3,
  },
]

export default function MedicalRecordsPage() {
  const { user, isLoading } = useAuthGuard()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const filteredPatients = mockPatients.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      LOW: 'text-green-600 bg-green-100 border-green-200',
      MEDIUM: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      HIGH: 'text-orange-600 bg-orange-100 border-orange-200',
    }
    return colors[riskLevel as keyof typeof colors] || 'text-gray-600 bg-gray-100 border-gray-200'
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 h-6 w-6" />
            Historiales Médicos
          </h1>
          <p className="text-gray-600 mt-1">Gestión de historiales clínicos de pacientes</p>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button onClick={() => router.push('/patients/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Paciente
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Historias</p>
                  <p className="text-2xl font-semibold text-gray-900">{mockPatients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alto Riesgo</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockPatients.filter((p) => p.riskLevel === 'HIGH').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consultas Recientes</p>
                  <p className="text-2xl font-semibold text-gray-900">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Con Alergias</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockPatients.filter((p) => p.activeAllergies > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Pacientes ({filteredPatients.length})
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/medical-records/${patient.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(patient.riskLevel)}`}
                          >
                            {patient.riskLevel === 'MEDIUM' ? 'Riesgo Medio' : 'Riesgo Alto'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{getAgeFromBirthDate(patient.birthDate)} años</span>
                          <span>•</span>
                          <span>{patient.gender === 'M' ? 'Masculino' : 'Femenino'}</span>
                          <span>•</span>
                          <span>Tipo {patient.bloodType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Consultas:</span>
                            <span className="ml-1 font-medium">{patient.totalConsultations}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Alergias:</span>
                            <span className="ml-1 font-medium">{patient.activeAllergies}</span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              Última: {patient.lastConsultation.toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron historias clínicas
                </h3>
                <p className="text-gray-600">No hay pacientes que coincidan con tu búsqueda.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
