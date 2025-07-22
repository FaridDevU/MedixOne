import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { Card, CardContent, CardHeader } from '@/components/ui'
import { TestTube } from 'lucide-react'

export default function LaboratoryPage() {
  const { user, isLoading } = useAuthGuard()

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
            <TestTube className="mr-3 h-6 w-6" />
            Laboratorio
          </h1>
          <p className="text-gray-600 mt-1">Gestión de órdenes y resultados de laboratorio</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Órdenes de Laboratorio</h3>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <TestTube className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Sin órdenes</h3>
              <p className="mt-1 text-sm text-gray-500">Crea la primera orden de laboratorio.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
