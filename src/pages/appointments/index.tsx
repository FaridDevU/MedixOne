import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardContent, Button } from '@/components/ui'
import { Search, Plus, Calendar, Clock } from 'lucide-react'

export default function AppointmentsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuthGuard()
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

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="mr-3 h-6 w-6" />
            Gestión de Citas
          </h1>
          <p className="text-gray-600 mt-1">Programa y administra las citas médicas</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button onClick={() => router.push('/appointments/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Citas Hoy</p>
                  <p className="text-2xl font-semibold text-gray-900">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Calendario de Citas</h3>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Sin citas programadas</h3>
              <p className="mt-1 text-sm text-gray-500">Programa la primera cita para comenzar.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
