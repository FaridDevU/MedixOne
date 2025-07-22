// Tipos de reportes avanzados
export type AdvancedReportType =
  | 'EXECUTIVE_DASHBOARD'
  | 'FINANCIAL_DETAILED'
  | 'MEDICAL_KPIS'
  | 'OPERATIONAL_METRICS'
  | 'PATIENT_ANALYTICS'
  | 'CUSTOM_REPORT'

// Tipos de visualización
export type VisualizationType =
  | 'line_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'area_chart'
  | 'scatter_plot'
  | 'heatmap'
  | 'gauge'
  | 'table'
  | 'kpi_card'
  | 'funnel'
  | 'waterfall'
  | 'radar'

// Métricas disponibles
export type MetricType =
  | 'revenue'
  | 'costs'
  | 'profit'
  | 'patients_count'
  | 'appointments_count'
  | 'lab_orders'
  | 'prescriptions'
  | 'satisfaction_score'
  | 'bed_occupancy'
  | 'avg_wait_time'
  | 'staff_productivity'
  | 'readmission_rate'

// Períodos de tiempo
export type TimePeriod =
  | 'TODAY'
  | 'YESTERDAY'
  | 'THIS_WEEK'
  | 'LAST_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'THIS_QUARTER'
  | 'LAST_QUARTER'
  | 'THIS_YEAR'
  | 'LAST_YEAR'
  | 'CUSTOM'

// Estado del reporte
export type ReportStatus = 'GENERATING' | 'COMPLETED' | 'FAILED' | 'SCHEDULED'

// Formato de exportación
export type ExportFormat = 'PDF' | 'EXCEL' | 'CSV' | 'PNG' | 'JSON' | 'POWERPOINT'

// KPIs del dashboard ejecutivo
export interface ExecutiveKPI {
  id: string
  name: string
  value: number | string
  previousValue?: number | string
  change?: number
  changeType: 'increase' | 'decrease' | 'neutral'
  unit: string
  icon: string
  color: string
  target?: number
  description: string
}

// Métricas financieras
export interface FinancialMetrics {
  totalRevenue: number
  totalCosts: number
  netProfit: number
  profitMargin: number
  revenueGrowth: number
  avgRevenuePerPatient: number
  collectionsRate: number
  accountsReceivable: number
  operatingExpenses: number
  staffCosts: number
  equipmentCosts: number
  utilitiesCosts: number
  period: TimePeriod
  comparisonPeriod?: TimePeriod
}

// KPIs médicos
export interface MedicalKPIs {
  totalPatients: number
  newPatients: number
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  noShowRate: number
  avgWaitTime: number
  patientSatisfaction: number
  bedOccupancyRate: number
  avgLengthOfStay: number
  readmissionRate: number
  mortalityRate: number
  infectionRate: number
  staffUtilization: number
  equipmentUtilization: number
  period: TimePeriod
}

// Datos del reporte personalizado
export interface CustomReportData {
  id: string
  name: string
  description: string
  type: AdvancedReportType
  metrics: MetricType[]
  visualizations: {
    type: VisualizationType
    title: string
    metrics: MetricType[]
    config: Record<string, any>
  }[]
  filters: {
    dateRange: {
      from: Date
      to: Date
    }
    departments?: string[]
    doctors?: string[]
    services?: string[]
    customFilters?: Record<string, any>
  }
  schedule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY'
    time: string
    recipients: string[]
    isActive: boolean
  }
  createdBy: string
  createdAt: Date
  lastGenerated?: Date
}

// Configuración del generador de reportes
export interface ReportGeneratorConfig {
  title: string
  description?: string
  metrics: {
    id: MetricType
    label: string
    aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max'
    format: 'number' | 'currency' | 'percentage' | 'time'
  }[]
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'department' | 'doctor'
  filters: Record<string, any>
  visualizations: {
    type: VisualizationType
    title: string
    width: number
    height: number
    config: Record<string, any>
  }[]
}

// Datos del dashboard ejecutivo
export interface ExecutiveDashboardData {
  period: TimePeriod
  lastUpdated: Date

  // KPIs principales
  mainKPIs: ExecutiveKPI[]

  // Métricas financieras
  financialMetrics: FinancialMetrics

  // KPIs médicos
  medicalKPIs: MedicalKPIs

  // Gráficos principales
  charts: {
    revenueChart: {
      labels: string[]
      datasets: {
        label: string
        data: number[]
        color: string
      }[]
    }
    patientChart: {
      labels: string[]
      datasets: {
        label: string
        data: number[]
        color: string
      }[]
    }
    departmentPerformance: {
      department: string
      revenue: number
      patients: number
      satisfaction: number
    }[]
    topServices: {
      name: string
      revenue: number
      count: number
      growth: number
    }[]
  }

  // Alertas y notificaciones
  alerts: {
    id: string
    type: 'warning' | 'error' | 'info'
    title: string
    message: string
    value?: number
    threshold?: number
    createdAt: Date
  }[]
}

// Mock data para desarrollo
export const mockExecutiveDashboard: ExecutiveDashboardData = {
  period: 'THIS_MONTH',
  lastUpdated: new Date(),

  mainKPIs: [
    {
      id: 'revenue',
      name: 'Ingresos Totales',
      value: 2450000,
      previousValue: 2180000,
      change: 12.4,
      changeType: 'increase',
      unit: 'MXN',
      icon: 'dollar-sign',
      color: 'green',
      target: 2500000,
      description: 'Ingresos totales del mes actual',
    },
    {
      id: 'patients',
      name: 'Pacientes Atendidos',
      value: 1850,
      previousValue: 1720,
      change: 7.6,
      changeType: 'increase',
      unit: 'pacientes',
      icon: 'users',
      color: 'blue',
      target: 2000,
      description: 'Total de pacientes atendidos',
    },
    {
      id: 'satisfaction',
      name: 'Satisfacción',
      value: 4.7,
      previousValue: 4.5,
      change: 4.4,
      changeType: 'increase',
      unit: '/5',
      icon: 'star',
      color: 'yellow',
      target: 4.8,
      description: 'Promedio de satisfacción del paciente',
    },
    {
      id: 'occupancy',
      name: 'Ocupación de Camas',
      value: 85.3,
      previousValue: 82.1,
      change: 3.9,
      changeType: 'increase',
      unit: '%',
      icon: 'bed',
      color: 'purple',
      target: 90,
      description: 'Tasa de ocupación de camas',
    },
  ],

  financialMetrics: {
    totalRevenue: 2450000,
    totalCosts: 1850000,
    netProfit: 600000,
    profitMargin: 24.5,
    revenueGrowth: 12.4,
    avgRevenuePerPatient: 1324,
    collectionsRate: 94.2,
    accountsReceivable: 320000,
    operatingExpenses: 1200000,
    staffCosts: 980000,
    equipmentCosts: 250000,
    utilitiesCosts: 85000,
    period: 'THIS_MONTH',
  },

  medicalKPIs: {
    totalPatients: 1850,
    newPatients: 285,
    totalAppointments: 2150,
    completedAppointments: 2035,
    cancelledAppointments: 115,
    noShowRate: 5.3,
    avgWaitTime: 18,
    patientSatisfaction: 4.7,
    bedOccupancyRate: 85.3,
    avgLengthOfStay: 3.2,
    readmissionRate: 4.1,
    mortalityRate: 0.8,
    infectionRate: 2.1,
    staffUtilization: 78.5,
    equipmentUtilization: 82.3,
    period: 'THIS_MONTH',
  },

  charts: {
    revenueChart: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Ingresos',
          data: [2100000, 2250000, 2180000, 2320000, 2400000, 2450000],
          color: '#10B981',
        },
        {
          label: 'Costos',
          data: [1680000, 1750000, 1720000, 1800000, 1830000, 1850000],
          color: '#EF4444',
        },
      ],
    },
    patientChart: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Pacientes',
          data: [1620, 1680, 1720, 1780, 1820, 1850],
          color: '#3B82F6',
        },
      ],
    },
    departmentPerformance: [
      { department: 'Cardiología', revenue: 580000, patients: 320, satisfaction: 4.8 },
      { department: 'Neurología', revenue: 420000, patients: 180, satisfaction: 4.6 },
      { department: 'Pediatría', revenue: 380000, patients: 450, satisfaction: 4.9 },
      { department: 'Ginecología', revenue: 320000, patients: 280, satisfaction: 4.7 },
      { department: 'Traumatología', revenue: 450000, patients: 380, satisfaction: 4.5 },
    ],
    topServices: [
      { name: 'Consulta Cardiológica', revenue: 450000, count: 890, growth: 15.2 },
      { name: 'Cirugía Menor', revenue: 320000, count: 125, growth: 8.7 },
      { name: 'Laboratorio Completo', revenue: 280000, count: 1250, growth: 12.1 },
      { name: 'Resonancia Magnética', revenue: 250000, count: 85, growth: 22.3 },
      { name: 'Ultrasonido', revenue: 180000, count: 420, growth: 5.8 },
    ],
  },

  alerts: [
    {
      id: 'alert-1',
      type: 'warning',
      title: 'Tasa de No-Show Alta',
      message: 'La tasa de no-show ha aumentado al 5.3%, por encima del objetivo de 4%',
      value: 5.3,
      threshold: 4.0,
      createdAt: new Date(),
    },
    {
      id: 'alert-2',
      type: 'info',
      title: 'Meta de Ingresos Cerca',
      message: 'Se ha alcanzado el 98% de la meta de ingresos del mes',
      value: 98,
      threshold: 100,
      createdAt: new Date(),
    },
  ],
}

// Funciones helper para formateo
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-MX').format(value)
}

export const getChangeColor = (changeType: 'increase' | 'decrease' | 'neutral'): string => {
  switch (changeType) {
    case 'increase':
      return 'text-green-600'
    case 'decrease':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export const getChangeIcon = (changeType: 'increase' | 'decrease' | 'neutral'): string => {
  switch (changeType) {
    case 'increase':
      return 'trending-up'
    case 'decrease':
      return 'trending-down'
    default:
      return 'minus'
  }
}
