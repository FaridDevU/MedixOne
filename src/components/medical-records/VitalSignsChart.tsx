import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Heart, Thermometer, Activity, Gauge } from 'lucide-react'

interface VitalSigns {
  id: string
  patientId: string
  recordedAt: Date
  recordedBy: string
  systolicBP?: number
  diastolicBP?: number
  heartRate?: number
  temperature?: number
  respiratoryRate?: number
  oxygenSaturation?: number
  weight?: number
  height?: number
  bmi?: number
  painScale?: number
  notes?: string
}

interface VitalSignsChartProps {
  vitalSigns: VitalSigns[]
  patientId: string
}

export function VitalSignsChart({ vitalSigns }: VitalSignsChartProps) {
  const latestVitals = vitalSigns[0] // Más reciente

  if (!latestVitals) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay signos vitales</h3>
          <p className="text-gray-600">
            Aún no se han registrado signos vitales para este paciente.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getValueStatus = (value: number | undefined, normal: [number, number]): string => {
    if (!value) return 'text-gray-500'
    if (value < normal[0] || value > normal[1]) return 'text-red-600'
    return 'text-green-600'
  }

  const getBMICategory = (bmi: number | undefined): string => {
    if (!bmi) return 'Sin datos'
    if (bmi < 18.5) return 'Bajo peso'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Sobrepeso'
    return 'Obesidad'
  }

  const getBMIColor = (bmi: number | undefined): string => {
    if (!bmi) return 'text-gray-500'
    if (bmi < 18.5 || bmi >= 30) return 'text-red-600'
    if (bmi >= 25) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Signos vitales actuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Presión Arterial */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Presión Arterial</p>
                <p
                  className={`text-xl font-semibold ${getValueStatus(latestVitals.systolicBP, [90, 140])}`}
                >
                  {latestVitals.systolicBP || '--'}/{latestVitals.diastolicBP || '--'}
                </p>
                <p className="text-xs text-gray-500">mmHg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frecuencia Cardíaca */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Frecuencia Cardíaca</p>
                <p
                  className={`text-xl font-semibold ${getValueStatus(latestVitals.heartRate, [60, 100])}`}
                >
                  {latestVitals.heartRate || '--'}
                </p>
                <p className="text-xs text-gray-500">bpm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperatura */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Thermometer className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Temperatura</p>
                <p
                  className={`text-xl font-semibold ${getValueStatus(latestVitals.temperature, [36.1, 37.2])}`}
                >
                  {latestVitals.temperature || '--'}°C
                </p>
                <p className="text-xs text-gray-500">Celsius</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saturación de Oxígeno */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Gauge className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Saturación O2</p>
                <p
                  className={`text-xl font-semibold ${getValueStatus(latestVitals.oxygenSaturation, [95, 100])}`}
                >
                  {latestVitals.oxygenSaturation || '--'}%
                </p>
                <p className="text-xs text-gray-500">SpO2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Medidas Antropométricas</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Peso:</span>
                <span className="font-medium">{latestVitals.weight || '--'} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Altura:</span>
                <span className="font-medium">{latestVitals.height || '--'} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IMC:</span>
                <span className={`font-medium ${getBMIColor(latestVitals.bmi)}`}>
                  {latestVitals.bmi?.toFixed(1) || '--'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoría:</span>
                <span className={`text-sm ${getBMIColor(latestVitals.bmi)}`}>
                  {getBMICategory(latestVitals.bmi)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Signos Respiratorios</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Frecuencia Respiratoria:</span>
                <span
                  className={`font-medium ${getValueStatus(latestVitals.respiratoryRate, [12, 20])}`}
                >
                  {latestVitals.respiratoryRate || '--'} rpm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturación O2:</span>
                <span
                  className={`font-medium ${getValueStatus(latestVitals.oxygenSaturation, [95, 100])}`}
                >
                  {latestVitals.oxygenSaturation || '--'}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Información del Registro</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-gray-600 text-sm">Registrado por:</span>
                <p className="font-medium">{latestVitals.recordedBy}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Fecha y hora:</span>
                <p className="font-medium">{latestVitals.recordedAt.toLocaleString('es-ES')}</p>
              </div>
              {latestVitals.painScale !== undefined && (
                <div>
                  <span className="text-gray-600 text-sm">Escala de dolor (0-10):</span>
                  <p
                    className={`font-medium ${latestVitals.painScale > 7 ? 'text-red-600' : latestVitals.painScale > 4 ? 'text-yellow-600' : 'text-green-600'}`}
                  >
                    {latestVitals.painScale}/10
                  </p>
                </div>
              )}
              {latestVitals.notes && (
                <div>
                  <span className="text-gray-600 text-sm">Notas:</span>
                  <p className="text-sm text-gray-700 mt-1">{latestVitals.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de signos vitales */}
      {vitalSigns.length > 1 && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Historial de Signos Vitales</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PA (mmHg)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      FC (bpm)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Temp (°C)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SpO2 (%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peso (kg)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrado por
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vitalSigns.slice(0, 10).map((vital) => (
                    <tr key={vital.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vital.recordedAt.toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vital.systolicBP && vital.diastolicBP
                          ? `${vital.systolicBP}/${vital.diastolicBP}`
                          : '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vital.heartRate || '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vital.temperature || '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vital.oxygenSaturation || '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vital.weight || '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vital.recordedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
