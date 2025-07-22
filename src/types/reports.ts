// Tipos para el sistema de reportes médicos
export interface MedicalReport {
  id: string
  title: string
  type: ReportType
  description?: string
  generatedBy: string
  generatedAt: Date
  dateRange: DateRange
  filters: ReportFilters
  data: ReportData
  format: ReportFormat
  status: ReportStatus
  downloadUrl?: string
  createdAt: Date
  updatedAt: Date
  // Datos relacionados
  generatedByUser?: {
    id: string
    firstName: string
    lastName: string
    role: string
  }
}

export interface DateRange {
  startDate: Date
  endDate: Date
}

export interface ReportFilters {
  patientIds?: string[]
  doctorIds?: string[]
  departments?: string[]
  conditions?: string[]
  ageRange?: {
    min: number
    max: number
  }
  gender?: 'MALE' | 'FEMALE' | 'ALL'
  priority?: string[]
  status?: string[]
}

export interface ReportData {
  summary: ReportSummary
  charts: ChartData[]
  tables: TableData[]
  metrics: MetricData[]
}

export interface ReportSummary {
  totalRecords: number
  periodDescription: string
  keyFindings: string[]
  recommendations?: string[]
}

export interface ChartData {
  id: string
  title: string
  type: ChartType
  data: any[]
  labels: string[]
  colors?: string[]
  options?: any
}

export interface TableData {
  id: string
  title: string
  headers: string[]
  rows: (string | number)[][]
  totals?: (string | number)[]
}

export interface MetricData {
  id: string
  label: string
  value: number | string
  previousValue?: number | string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  unit?: string
  format?: 'number' | 'percentage' | 'currency' | 'time'
}

export type ReportType =
  | 'PATIENT_DEMOGRAPHICS' // Demografía de pacientes
  | 'APPOINTMENT_ANALYTICS' // Análisis de citas
  | 'LABORATORY_RESULTS' // Resultados de laboratorio
  | 'PRESCRIPTION_ANALYSIS' // Análisis de prescripciones
  | 'FINANCIAL_SUMMARY' // Resumen financiero
  | 'PERFORMANCE_METRICS' // Métricas de rendimiento
  | 'DISEASE_STATISTICS' // Estadísticas de enfermedades
  | 'TREATMENT_OUTCOMES' // Resultados de tratamientos
  | 'INVENTORY_REPORT' // Reporte de inventario
  | 'COMPLIANCE_REPORT' // Reporte de cumplimiento
  | 'CUSTOM' // Personalizado

export type ReportFormat = 'PDF' | 'EXCEL' | 'CSV' | 'JSON' | 'HTML'

export type ReportStatus = 'GENERATING' | 'COMPLETED' | 'FAILED' | 'EXPIRED'

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'radar'

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: ReportType
  defaultFilters: ReportFilters
  sections: ReportSection[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ReportSection {
  id: string
  title: string
  type: 'chart' | 'table' | 'metric' | 'text'
  configuration: any
  order: number
}

export interface ReportFormData {
  title: string
  type: ReportType
  description: string
  dateRange: {
    startDate: string
    endDate: string
  }
  filters: {
    patientIds: string[]
    doctorIds: string[]
    departments: string[]
    gender: 'MALE' | 'FEMALE' | 'ALL'
    ageRange: {
      min: number
      max: number
    }
  }
  format: ReportFormat
  includeCharts: boolean
  includeTables: boolean
  includeMetrics: boolean
}

// Opciones para formularios
export const REPORT_TYPES: Array<{
  value: ReportType
  label: string
  description: string
  icon: string
  color: string
}> = [
  {
    value: 'PATIENT_DEMOGRAPHICS',
    label: 'Demografía de Pacientes',
    description: 'Análisis demográfico de la población de pacientes',
    icon: '👥',
    color: 'blue',
  },
  {
    value: 'APPOINTMENT_ANALYTICS',
    label: 'Análisis de Citas',
    description: 'Estadísticas y tendencias de citas médicas',
    icon: '📅',
    color: 'green',
  },
  {
    value: 'LABORATORY_RESULTS',
    label: 'Resultados de Laboratorio',
    description: 'Análisis de resultados y tendencias de laboratorio',
    icon: '🧪',
    color: 'purple',
  },
  {
    value: 'PRESCRIPTION_ANALYSIS',
    label: 'Análisis de Prescripciones',
    description: 'Patrones de prescripción y uso de medicamentos',
    icon: '💊',
    color: 'emerald',
  },
  {
    value: 'FINANCIAL_SUMMARY',
    label: 'Resumen Financiero',
    description: 'Ingresos, gastos y análisis financiero',
    icon: '💰',
    color: 'yellow',
  },
  {
    value: 'PERFORMANCE_METRICS',
    label: 'Métricas de Rendimiento',
    description: 'KPIs y métricas de rendimiento del centro médico',
    icon: '📊',
    color: 'indigo',
  },
  {
    value: 'DISEASE_STATISTICS',
    label: 'Estadísticas de Enfermedades',
    description: 'Prevalencia y distribución de enfermedades',
    icon: '🩺',
    color: 'red',
  },
  {
    value: 'TREATMENT_OUTCOMES',
    label: 'Resultados de Tratamientos',
    description: 'Efectividad y seguimiento de tratamientos',
    icon: '🎯',
    color: 'teal',
  },
  {
    value: 'INVENTORY_REPORT',
    label: 'Reporte de Inventario',
    description: 'Stock de medicamentos y suministros médicos',
    icon: '📦',
    color: 'orange',
  },
  {
    value: 'COMPLIANCE_REPORT',
    label: 'Reporte de Cumplimiento',
    description: 'Cumplimiento de protocolos y regulaciones',
    icon: '✅',
    color: 'slate',
  },
  {
    value: 'CUSTOM',
    label: 'Reporte Personalizado',
    description: 'Reporte personalizado según necesidades específicas',
    icon: '🔧',
    color: 'gray',
  },
]

export const REPORT_FORMATS: Array<{
  value: ReportFormat
  label: string
  description: string
  icon: string
}> = [
  { value: 'PDF', label: 'PDF', description: 'Documento portable para impresión', icon: '📄' },
  { value: 'EXCEL', label: 'Excel', description: 'Hoja de cálculo para análisis', icon: '📊' },
  { value: 'CSV', label: 'CSV', description: 'Datos separados por comas', icon: '📋' },
  { value: 'JSON', label: 'JSON', description: 'Formato de datos estructurados', icon: '🔗' },
  { value: 'HTML', label: 'HTML', description: 'Página web interactiva', icon: '🌐' },
]

export const REPORT_STATUS_OPTIONS: Array<{ value: ReportStatus; label: string; color: string }> = [
  { value: 'GENERATING', label: 'Generando', color: 'yellow' },
  { value: 'COMPLETED', label: 'Completado', color: 'green' },
  { value: 'FAILED', label: 'Fallido', color: 'red' },
  { value: 'EXPIRED', label: 'Expirado', color: 'gray' },
]

export const CHART_TYPES: Array<{ value: ChartType; label: string; description: string }> = [
  { value: 'line', label: 'Línea', description: 'Tendencias a lo largo del tiempo' },
  { value: 'bar', label: 'Barras', description: 'Comparación entre categorías' },
  { value: 'pie', label: 'Circular', description: 'Distribución porcentual' },
  { value: 'doughnut', label: 'Dona', description: 'Distribución con centro hueco' },
  { value: 'area', label: 'Área', description: 'Volumen a lo largo del tiempo' },
  { value: 'scatter', label: 'Dispersión', description: 'Correlación entre variables' },
  { value: 'radar', label: 'Radar', description: 'Múltiples métricas comparativas' },
]

// Utilidades
export function generateReportId(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')

  return `RPT${year}${month}${day}${random}`
}

export function getReportTypeLabel(type: ReportType): string {
  const option = REPORT_TYPES.find((opt) => opt.value === type)
  return option?.label || type
}

export function getReportTypeIcon(type: ReportType): string {
  const option = REPORT_TYPES.find((opt) => opt.value === type)
  return option?.icon || '📊'
}

export function getReportStatusLabel(status: ReportStatus): string {
  const option = REPORT_STATUS_OPTIONS.find((opt) => opt.value === status)
  return option?.label || status
}

export function formatReportValue(value: number | string, format?: string, unit?: string): string {
  if (typeof value === 'string') return value

  switch (format) {
    case 'percentage':
      return `${value.toFixed(1)}%`
    case 'currency':
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    case 'time':
      return `${value} ${unit || 'hrs'}`
    case 'number':
    default:
      return `${value.toLocaleString('en-US')}${unit ? ` ${unit}` : ''}`
  }
}

export function calculateDateRange(
  period: 'today' | 'week' | 'month' | 'quarter' | 'year'
): DateRange {
  const today = new Date()
  const startDate = new Date()

  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0)
      break
    case 'week':
      startDate.setDate(today.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(today.getMonth() - 1)
      break
    case 'quarter':
      startDate.setMonth(today.getMonth() - 3)
      break
    case 'year':
      startDate.setFullYear(today.getFullYear() - 1)
      break
  }

  return {
    startDate,
    endDate: today,
  }
}

export function generateSampleChartData(type: ChartType, dataPoints: number = 7): ChartData {
  const labels = []
  const data = []

  for (let i = 0; i < dataPoints; i++) {
    labels.push(`Punto ${i + 1}`)
    data.push(Math.floor(Math.random() * 100) + 10)
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    title: `Gráfico de ${type}`,
    type,
    data,
    labels,
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'],
  }
}

export function exportReportData(report: MedicalReport, format: ReportFormat): void {
  switch (format) {
    case 'JSON':
      const jsonData = JSON.stringify(report, null, 2)
      downloadFile(jsonData, `${report.title}.json`, 'application/json')
      break
    case 'CSV':
      const csvData = convertToCSV(report.data.tables)
      downloadFile(csvData, `${report.title}.csv`, 'text/csv')
      break
    case 'HTML':
      const htmlData = generateHTMLReport(report)
      downloadFile(htmlData, `${report.title}.html`, 'text/html')
      break
    default:
      console.log(`Export format ${format} not implemented yet`)
  }
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function convertToCSV(tables: TableData[]): string {
  if (tables.length === 0) return ''

  let csv = ''
  tables.forEach((table, index) => {
    if (index > 0) csv += '\n\n'
    csv += `${table.title}\n`
    csv += table.headers.join(',') + '\n'
    table.rows.forEach((row) => {
      csv += row.join(',') + '\n'
    })
  })

  return csv
}

function generateHTMLReport(report: MedicalReport): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${report.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { border-bottom: 2px solid #3B82F6; padding-bottom: 10px; margin-bottom: 20px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${report.title}</h1>
        <p>Generado el: ${report.generatedAt.toLocaleDateString()}</p>
        <p>${report.description}</p>
      </div>
      
      <h2>Resumen</h2>
      <p>Total de registros: ${report.data.summary.totalRecords}</p>
      <p>Período: ${report.data.summary.periodDescription}</p>
      
      <h2>Métricas</h2>
      ${report.data.metrics
        .map(
          (metric) => `
        <div class="metric">
          <strong>${metric.label}:</strong> ${formatReportValue(metric.value, metric.format, metric.unit)}
        </div>
      `
        )
        .join('')}
      
      <h2>Tablas</h2>
      ${report.data.tables
        .map(
          (table) => `
        <h3>${table.title}</h3>
        <table>
          <tr>${table.headers.map((header) => `<th>${header}</th>`).join('')}</tr>
          ${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
        </table>
      `
        )
        .join('')}
    </body>
    </html>
  `
}
