import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { useTranslations } from '@/contexts/LanguageContext'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardContent, Button, Input } from '@/components/ui'
import { Search, Plus, Users } from 'lucide-react'

export default function PatientsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuthGuard()
  const { t } = useTranslations()
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
    <Layout title={t('patients.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('patients.title')}</h1>
            <p className="mt-1 text-sm text-gray-600">{t('patients.subtitle')}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => router.push('/patients/new')}>
              <Plus className="h-4 w-4 mr-2" />
              {t('patients.newPatient')}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t('patients.searchPlaceholder')}
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('patients.title')} {t('common.total')}</p>
                  <p className="text-2xl font-semibold text-gray-900">2,845</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('patients.title')}</h3>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">{t('patients.noPatients')}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('patients.addFirst')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
