import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent, Button, Input, Select, Badge } from '@/components/ui'

// Tipos locales para el componente
interface InvoiceItem {
  id: string
  description: string
  total: number
}

interface InsuranceInfo {
  insurance?: {
    name: string
  }
  policyNumber: string
  coveragePercentage: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  invoiceDate: Date
  dueDate: Date
  status: string
  paymentStatus: string
  total: number
  paidAmount: number
  balance: number
  currency: string
  paymentMethod?: string
  insuranceInfo?: InsuranceInfo
  items?: InvoiceItem[]
  patientId: string
  doctorId: string
}

// Funciones utilitarias locales
const getInvoiceStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    DRAFT: 'Borrador',
    PENDING: 'Pendiente',
    SENT: 'Enviada',
    VIEWED: 'Vista',
    OVERDUE: 'Vencida',
    CANCELLED: 'Cancelada',
    REFUNDED: 'Reembolsada',
  }
  return labels[status] || status
}

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    UNPAID: 'Sin Pagar',
    PARTIAL: 'Pago Parcial',
    PAID: 'Pagada',
    OVERPAID: 'Sobrepago',
    REFUNDED: 'Reembolsada',
  }
  return labels[status] || status
}

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

const isInvoiceOverdue = (dueDate: Date) => {
  return new Date() > dueDate
}

const calculateDaysOverdue = (dueDate: Date) => {
  const today = new Date()
  const diffTime = today.getTime() - dueDate.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

interface InvoiceListProps {
  invoices: Invoice[]
  onInvoiceClick?: (invoice: Invoice) => void
  onSendInvoice?: (invoiceId: string) => void
  onRecordPayment?: (invoiceId: string) => void
  onPrintInvoice?: (invoiceId: string) => void
  onDeleteInvoice?: (invoiceId: string) => void
}

export function InvoiceList({
  invoices,
  onInvoiceClick,
  onSendInvoice,
  onRecordPayment,
  onPrintInvoice,
  onDeleteInvoice,
}: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const invoicesPerPage = 10

  // Filtrar facturas
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.doctorId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || invoice.status === statusFilter
    const matchesPaymentStatus =
      !paymentStatusFilter || invoice.paymentStatus === paymentStatusFilter

    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  // Paginación
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage)
  const startIndex = (currentPage - 1) * invoicesPerPage
  const currentInvoices = filteredInvoices.slice(startIndex, startIndex + invoicesPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'SENT':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'VIEWED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'OVERDUE':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'CANCELLED':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'REFUNDED':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'UNPAID':
        return 'bg-red-100 text-red-800'
      case 'PARTIAL':
        return 'bg-yellow-100 text-yellow-800'
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'OVERPAID':
        return 'bg-blue-100 text-blue-800'
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Facturas Médicas</h3>
              <p className="text-sm text-gray-500">
                {filteredInvoices.length} factura{filteredInvoices.length !== 1 ? 's' : ''}{' '}
                encontrada{filteredInvoices.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link href="/billing/invoices/new">
              <Button className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nueva Factura
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por número, paciente o doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>
            <Select
              placeholder="Estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos los estados' },
                { value: 'DRAFT', label: 'Borrador' },
                { value: 'PENDING', label: 'Pendiente' },
                { value: 'SENT', label: 'Enviada' },
                { value: 'VIEWED', label: 'Vista' },
                { value: 'OVERDUE', label: 'Vencida' },
                { value: 'CANCELLED', label: 'Cancelada' },
                { value: 'REFUNDED', label: 'Reembolsada' },
              ]}
            />
            <Select
              placeholder="Estado de Pago"
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos los pagos' },
                { value: 'UNPAID', label: 'Sin Pagar' },
                { value: 'PARTIAL', label: 'Pago Parcial' },
                { value: 'PAID', label: 'Pagada' },
                { value: 'OVERPAID', label: 'Sobrepago' },
                { value: 'REFUNDED', label: 'Reembolsada' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de facturas */}
      <Card>
        <CardContent className="p-0">
          {currentInvoices.length === 0 ? (
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
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay facturas</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter || paymentStatusFilter
                  ? 'No se encontraron facturas con los filtros aplicados.'
                  : 'Comienza creando tu primera factura médica.'}
              </p>
              {!searchTerm && !statusFilter && !paymentStatusFilter && (
                <div className="mt-6">
                  <Link href="/billing/invoices/new">
                    <Button>
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Crear Primera Factura
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {currentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => onInvoiceClick?.(invoice)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Icono de factura */}
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                        💰
                      </div>

                      {/* Información principal */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </h3>
                          <Badge
                            variant={
                              invoice.status === 'PAID'
                                ? 'success'
                                : invoice.status === 'OVERDUE'
                                  ? 'error'
                                  : 'default'
                            }
                          >
                            {getInvoiceStatusLabel(invoice.status)}
                          </Badge>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(invoice.paymentStatus)}`}
                          >
                            {getPaymentStatusLabel(invoice.paymentStatus)}
                          </span>
                          {invoice.insuranceInfo && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Seguro
                            </span>
                          )}
                          {isInvoiceOverdue(invoice.dueDate) &&
                            invoice.paymentStatus !== 'PAID' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Vencida ({calculateDaysOverdue(invoice.dueDate)} días)
                              </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Paciente: {invoice.patientId.substring(0, 8)}
                          </span>

                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-7 0h2m-5 0H6m5 0v-5a2 2 0 011-1h2a2 2 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            Doctor: {invoice.doctorId.substring(0, 8)}
                          </span>

                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
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
                            Fecha: {formatDate(invoice.invoiceDate)}
                          </span>

                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
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
                            Vencimiento: {formatDate(invoice.dueDate)}
                          </span>

                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                              />
                            </svg>
                            {invoice.items?.length || 0} servicio
                            {(invoice.items?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Información financiera */}
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(invoice.total, invoice.currency)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Pagado:</span>
                            <div className="font-semibold text-green-600">
                              {formatCurrency(invoice.paidAmount, invoice.currency)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Saldo:</span>
                            <div
                              className={`font-semibold ${invoice.balance > 0 ? 'text-red-600' : 'text-green-600'}`}
                            >
                              {formatCurrency(invoice.balance, invoice.currency)}
                            </div>
                          </div>
                          {invoice.paymentMethod && (
                            <div>
                              <span className="text-gray-500">Método:</span>
                              <div className="font-medium text-gray-900">
                                {invoice.paymentMethod === 'CASH' && '💵 Efectivo'}
                                {invoice.paymentMethod === 'CREDIT_CARD' && '💳 Tarjeta'}
                                {invoice.paymentMethod === 'INSURANCE' && '🛡️ Seguro'}
                                {invoice.paymentMethod === 'BANK_TRANSFER' && '🏦 Transferencia'}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Información del seguro */}
                        {invoice.insuranceInfo && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center text-sm text-blue-700">
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
                                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                              </svg>
                              <strong>Seguro:</strong> {invoice.insuranceInfo.insurance?.name} |
                              <strong className="ml-2">Póliza:</strong>{' '}
                              {invoice.insuranceInfo.policyNumber} |
                              <strong className="ml-2">Cobertura:</strong>{' '}
                              {invoice.insuranceInfo.coveragePercentage}%
                            </div>
                          </div>
                        )}

                        {/* Servicios */}
                        {invoice.items && invoice.items.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {invoice.items.slice(0, 3).map((item) => (
                              <span
                                key={item.id}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                              >
                                {item.description} - {formatCurrency(item.total, invoice.currency)}
                              </span>
                            ))}
                            {invoice.items.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                +{invoice.items.length - 3} más
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2">
                      {invoice.paymentStatus !== 'PAID' && onRecordPayment && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onRecordPayment(invoice.id)
                          }}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
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
                          Pago
                        </Button>
                      )}

                      {(invoice.status === 'DRAFT' || invoice.status === 'PENDING') &&
                        onSendInvoice && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSendInvoice(invoice.id)
                            }}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                            Enviar
                          </Button>
                        )}

                      {onPrintInvoice && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onPrintInvoice(invoice.id)
                          }}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                            />
                          </svg>
                          Imprimir
                        </Button>
                      )}

                      {invoice.status === 'DRAFT' && onDeleteInvoice && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteInvoice(invoice.id)
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      )}

                      <div className="relative">
                        <Button variant="outline" size="sm" className="p-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {startIndex + 1} -{' '}
                {Math.min(startIndex + invoicesPerPage, filteredInvoices.length)} de{' '}
                {filteredInvoices.length} facturas
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
