import React from 'react'
import { useRouter } from 'next/router'
import { Card, CardHeader, CardContent, Button } from '@/components/ui'
import { Calendar, TestTube, FileText, CreditCard, User, Phone, Mail } from 'lucide-react'

export default function PatientPortalPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">MedixOne</h1>
              <span className="ml-4 text-gray-600">Portal del Paciente</span>
            </div>
            <Button variant="outline" onClick={() => router.push('/login')}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido, María González</h2>
          <p className="text-gray-600">Accede a tu información médica y gestiona tus citas</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Próxima Cita</p>
                  <p className="text-lg font-semibold text-gray-900">15 Ene 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100">
                  <TestTube className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resultados</p>
                  <p className="text-lg font-semibold text-gray-900">3 Nuevos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recetas</p>
                  <p className="text-lg font-semibold text-gray-900">2 Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-100">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saldo Pendiente</p>
                  <p className="text-lg font-semibold text-gray-900">$1,250</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2"
                    onClick={() => router.push('/patient/appointments')}
                  >
                    <Calendar className="h-6 w-6" />
                    <span>Mis Citas</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2"
                    onClick={() => router.push('/patient/results')}
                  >
                    <TestTube className="h-6 w-6" />
                    <span>Resultados</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex flex-col space-y-2">
                    <FileText className="h-6 w-6" />
                    <span>Mi Historia</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2"
                    onClick={() => router.push('/patient/bills')}
                  >
                    <CreditCard className="h-6 w-6" />
                    <span>Facturación</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-6">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <TestTube className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Resultados de laboratorio disponibles</p>
                      <p className="text-xs text-gray-500">hace 2 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Cita confirmada para el 15 de enero</p>
                      <p className="text-xs text-gray-500">ayer</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <FileText className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Nueva receta médica emitida</p>
                      <p className="text-xs text-gray-500">hace 3 días</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile & Contact */}
          <div>
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Mi Perfil</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">María González López</h4>
                    <p className="text-sm text-gray-600">38 años • Tipo O+</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>+52 555 123 4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>maria.gonzalez@email.com</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Información Médica</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Alergias:</span>
                    <p className="text-gray-600">Penicilina, Mariscos</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Enfermedades crónicas:</span>
                    <p className="text-gray-600">Diabetes Tipo 2, Hipertensión</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Medicamentos actuales:</span>
                    <p className="text-gray-600">Metformina, Enalapril</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
