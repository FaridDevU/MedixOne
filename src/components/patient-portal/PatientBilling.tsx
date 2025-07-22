import React, { useState } from 'react'
import { PatientBill, PaymentMethodOption } from '@/types/patient-portal'
import { formatCurrency } from '@/types/billing'
import { Card, CardHeader, CardContent, Button, Input, Select } from '@/components/ui'

interface PatientBillingProps {
  bills: PatientBill[]
  paymentMethods: PaymentMethodOption[]
  onPayBill?: (billId: string, paymentMethodId: string, amount: number) => Promise<void>
  onSetupPaymentPlan?: (billId: string) => Promise<void>
  onDownloadBill?: (billId: string) => Promise<void>
}

export function PatientBilling({
  bills,
  paymentMethods,
  onPayBill,
  onSetupPaymentPlan,
  onDownloadBill,
}: PatientBillingProps) {
  const [selectedBill, setSelectedBill] = useState<PatientBill | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [filter, setFilter] = useState('all')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredBills = bills.filter((bill) => {
    switch (filter) {
      case 'pending':
        return ['PENDING', 'OVERDUE'].includes(bill.status)
      case 'paid':
        return bill.status === 'PAID'
      case 'overdue':
        return bill.status === 'OVERDUE'
      case 'payment_plan':
        return bill.status === 'PAYMENT_PLAN'
      default:
        return true
    }
  })

  const totalOwed = bills
    .filter((bill) => bill.status !== 'PAID')
    .reduce((sum, bill) => sum + bill.balance, 0)

  const overdueCount = bills.filter((bill) => bill.status === 'OVERDUE').length
  const paidThisMonth = bills
    .filter((bill) => bill.status === 'PAID' && isThisMonth(bill.date))
    .reduce((sum, bill) => sum + bill.amount, 0)

  function isThisMonth(date: Date): boolean {
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getBillStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'OVERDUE':
        return 'bg-red-100 text-red-800'
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PAYMENT_PLAN':
        return 'bg-blue-100 text-blue-800'
      case 'DISPUTED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getBillStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente'
      case 'OVERDUE':
        return 'Vencida'
      case 'PAID':
        return 'Pagada'
      case 'PAYMENT_PLAN':
        return 'Plan de Pagos'
      case 'DISPUTED':
        return 'Disputada'
      default:
        return status
    }
  }

  const isOverdue = (dueDate: Date) => {
    return new Date() > dueDate
  }

  const getDaysOverdue = (dueDate: Date) => {
    const diff = new Date().getTime() - dueDate.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBill || !onPayBill) return

    setLoading(true)
    try {
      await onPayBill(
        selectedBill.id,
        selectedPaymentMethod,
        parseFloat(paymentAmount) || selectedBill.balance
      )
      setShowPayment(false)
      setSelectedBill(null)
      setPaymentAmount('')
      setSelectedPaymentMethod('')
    } catch (error) {
      console.error('Error al procesar el pago:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewBill = (bill: PatientBill) => {
    setSelectedBill(bill)
  }

  const handleStartPayment = (bill: PatientBill) => {
    setSelectedBill(bill)
    setPaymentAmount(bill.balance.toString())
    setShowPayment(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facturación y Pagos</h1>
          <p className="text-gray-500 mt-1">Gestiona tus facturas médicas y pagos</p>
        </div>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-700">{formatCurrency(totalOwed)}</h3>
                <p className="text-sm text-red-600">Saldo pendiente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-yellow-700">{overdueCount}</h3>
                <p className="text-sm text-yellow-600">Facturas vencidas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-700">
                  {formatCurrency(paidThisMonth)}
                </h3>
                <p className="text-sm text-green-600">Pagado este mes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-700">{bills.length}</h3>
                <p className="text-sm text-blue-600">Total facturas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas ({bills.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pendientes ({bills.filter((b) => ['PENDING', 'OVERDUE'].includes(b.status)).length})
            </Button>
            <Button
              variant={filter === 'overdue' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('overdue')}
            >
              Vencidas ({overdueCount})
            </Button>
            <Button
              variant={filter === 'paid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('paid')}
            >
              Pagadas ({bills.filter((b) => b.status === 'PAID').length})
            </Button>
            <Button
              variant={filter === 'payment_plan' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('payment_plan')}
            >
              Plan de Pagos ({bills.filter((b) => b.status === 'PAYMENT_PLAN').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de facturas */}
      <Card>
        <CardContent className="p-0">
          {filteredBills.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay facturas</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all'
                  ? 'No tienes facturas.'
                  : `No hay facturas ${getBillStatusLabel(filter).toLowerCase()}.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <div
                  key={bill.id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${!bill.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icono de factura */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
                        📄
                      </div>

                      {/* Información principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Factura #{bill.invoiceNumber}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBillStatusColor(bill.status)}`}
                          >
                            {getBillStatusLabel(bill.status)}
                          </span>

                          {!bill.isRead && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              Nueva
                            </span>
                          )}

                          {isOverdue(bill.dueDate) && bill.status !== 'PAID' && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              Vencida hace {getDaysOverdue(bill.dueDate)} días
                            </span>
                          )}
                        </div>

                        {/* Fechas y montos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Fecha: {formatDate(bill.date)}
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Vence: {formatDate(bill.dueDate)}
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                            Total: {formatCurrency(bill.amount)}
                          </div>
                          {bill.paidAmount > 0 && (
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Pagado: {formatCurrency(bill.paidAmount)}
                            </div>
                          )}
                        </div>

                        {/* Saldo pendiente */}
                        {bill.balance > 0 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-yellow-800">
                                  Saldo Pendiente
                                </h4>
                                <p className="text-2xl font-bold text-yellow-900">
                                  {formatCurrency(bill.balance)}
                                </p>
                              </div>
                              {bill.canPay && (
                                <Button
                                  onClick={() => handleStartPayment(bill)}
                                  className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                  Pagar Ahora
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Servicios */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900">Servicios:</h4>
                          {bill.services.slice(0, 3).map((service, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-600">
                              <span>{service.description}</span>
                              <span className="font-medium">{formatCurrency(service.amount)}</span>
                            </div>
                          ))}
                          {bill.services.length > 3 && (
                            <button
                              onClick={() => handleViewBill(bill)}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              +{bill.services.length - 3} servicio
                              {bill.services.length - 3 > 1 ? 's' : ''} más
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleViewBill(bill)}>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Ver Detalle
                      </Button>

                      {bill.downloadUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDownloadBill?.(bill.id)}
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Descargar
                        </Button>
                      )}

                      {bill.canPay && bill.balance > 0 && (
                        <>
                          <Button size="sm" onClick={() => handleStartPayment(bill)}>
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Pagar
                          </Button>

                          {onSetupPaymentPlan && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSetupPaymentPlan(bill.id)}
                            >
                              Plan de Pagos
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalle de factura */}
      {selectedBill && !showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Factura #{selectedBill.invoiceNumber}
                  </h3>
                  <p className="text-gray-500">
                    Fecha: {formatDate(selectedBill.date)} • Vence:{' '}
                    {formatDate(selectedBill.dueDate)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumen financiero */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <h4 className="text-sm text-gray-600">Total</h4>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(selectedBill.amount)}
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm text-gray-600">Pagado</h4>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(selectedBill.paidAmount)}
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm text-gray-600">Saldo</h4>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(selectedBill.balance)}
                  </p>
                </div>
              </div>

              {/* Servicios detallados */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Servicios</h4>
                <div className="space-y-3">
                  {selectedBill.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-200"
                    >
                      <div>
                        <h5 className="font-medium text-gray-900">{service.description}</h5>
                        <p className="text-sm text-gray-500">Fecha: {formatDate(service.date)}</p>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formatCurrency(service.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedBill(null)}>
                  Cerrar
                </Button>
                {selectedBill.downloadUrl && (
                  <Button variant="outline" onClick={() => onDownloadBill?.(selectedBill.id)}>
                    Descargar PDF
                  </Button>
                )}
                {selectedBill.canPay && selectedBill.balance > 0 && (
                  <Button
                    onClick={() => {
                      setPaymentAmount(selectedBill.balance.toString())
                      setShowPayment(true)
                    }}
                  >
                    Pagar {formatCurrency(selectedBill.balance)}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de pago */}
      {showPayment && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Procesar Pago</h3>
                <button
                  onClick={() => {
                    setShowPayment(false)
                    setSelectedBill(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">
                    Factura #{selectedBill.invoiceNumber}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Saldo pendiente: {formatCurrency(selectedBill.balance)}
                  </p>
                </div>

                <Select
                  label="Método de pago"
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  options={[
                    { value: '', label: 'Seleccionar método' },
                    ...paymentMethods.map((method) => ({
                      value: method.id,
                      label: `${method.name} ${method.last4 ? `****${method.last4}` : ''}`,
                    })),
                  ]}
                  required
                />

                <Input
                  label="Monto a pagar"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedBill.balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPayment(false)
                      setSelectedBill(null)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={loading}>
                    Procesar Pago
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
