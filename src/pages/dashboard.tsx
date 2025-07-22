import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { useTranslations } from '@/contexts/LanguageContext'
import { StatCard } from '@/components/dashboard/StatCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { TodayAppointments } from '@/components/dashboard/TodayAppointments_fixed'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'

export default function DashboardPage() {
  const { t } = useTranslations()

  return (
    <Layout title={t('navigation.dashboard')}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('dashboard.welcome')}, Admin
            </h1>
            <p className="text-blue-100">
              {t('dashboard.systemControlPanel')}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t('dashboard.todayPatients')}
            value="24"
            subtitle={t('dashboard.scheduledConsultations')}
            icon="users"
            color="blue"
          />
          <StatCard
            title={t('dashboard.todayRevenue')}
            value="$8,420"
            subtitle={t('dashboard.completedConsultations')}
            icon="dollar"
            color="green"
          />
          <StatCard
            title={t('dashboard.labResults')}
            value="15"
            subtitle={t('dashboard.pendingReview')}
            icon="lab"
            color="purple"
          />
          <StatCard
            title={t('dashboard.emergencies')}
            value="3"
            subtitle={t('dashboard.activeCases')}
            icon="alert"
            color="red"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions & Today's Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
                        <TodayAppointments appointments={[]} />
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed activities={[]} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
