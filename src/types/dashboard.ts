export interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  pendingResults: number
  monthlyRevenue: number
}

export interface StatCard {
  title: string
  value: string
  subtitle: string
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow'
  icon: React.ReactNode
  trend: {
    value: number
    label: string
    type: 'increase' | 'decrease' | 'neutral'
  }
}

export interface RecentActivity {
  id: string
  type: 'appointment' | 'lab' | 'prescription' | 'patient'
  message: string
  time: string
  user: string
  priority?: 'high' | 'medium' | 'low'
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  href: string
}
