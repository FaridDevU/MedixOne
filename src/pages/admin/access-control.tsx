import React, { useState } from 'react'
import type { NextPage } from 'next'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardContent, Button } from '@/components/ui'

// Tipos locales para control de acceso
interface RoleConfiguration {
  id: string
  name: string
  displayName: string
  description: string
  level: number
  isSystemRole: boolean
  isActive: boolean
  permissions: any[]
  maxConcurrentSessions: number
  sessionTimeout: number
  requiresMFA: boolean
  createdAt: Date
  updatedAt: Date
}

interface SystemUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: string
  department: string
  specialty: string
  employeeId: string
  licenseNumber: string
  phone: string
  lastLoginAt?: Date
  lastLoginIP?: string
  failedLoginAttempts: number
  isLockedOut: boolean
  mustChangePassword: boolean
  passwordLastChanged: Date
  mfaEnabled: boolean
  preferences: any
  permissions: any[]
  dataAccessLevel: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isDeleted: boolean
}

interface AuditLog {
  id: string
  userId: string
  userEmail: string
  action: string
  module: string
  resourceType?: string
  resourceId?: string
  details: any
  oldValues?: any
  newValues?: any
  ipAddress: string
  userAgent: string
  sessionId: string
  timestamp: Date
  severity: string
  success: boolean
}

interface SecurityAlert {
  id: string
  type: string
  severity: string
  title: string
  description: string
  userId: string
  ipAddress: string
  details: any
  isResolved: boolean
  createdAt: Date
}

interface UserSession {
  id: string
  userId: string
  token: string
  refreshToken: string
  deviceInfo: any
  location: any
  startedAt: Date
  lastActivityAt: Date
  expiresAt: Date
  isActive: boolean
  mfaVerified: boolean
}

type AccessControlTab = 'dashboard' | 'roles' | 'users' | 'audit' | 'security' | 'sessions'

const AccessControlPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<AccessControlTab>('dashboard')

  // Datos de ejemplo - en producción vendrían de la API
  const mockRoles: RoleConfiguration[] = [
    {
      id: '1',
      name: 'DOCTOR',
      displayName: 'Médico General',
      description: 'Médico con acceso completo a pacientes y historiales',
      level: 8,
      isSystemRole: true,
      isActive: true,
      permissions: [
        {
          module: 'PATIENTS',
          permissions: ['CREATE', 'READ', 'UPDATE'],
          dataAccessLevel: 'DEPARTMENT',
        },
        {
          module: 'MEDICAL_RECORDS',
          permissions: ['CREATE', 'READ', 'UPDATE', 'SIGN'],
          dataAccessLevel: 'DEPARTMENT',
        },
        {
          module: 'APPOINTMENTS',
          permissions: ['READ', 'UPDATE', 'COMPLETE'],
          dataAccessLevel: 'DEPARTMENT',
        },
      ],
      maxConcurrentSessions: 2,
      sessionTimeout: 240,
      requiresMFA: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ]

  const mockUsers: SystemUser[] = [
    {
      id: '1',
      username: 'dr.martinez',
      email: 'dr.martinez@medixone.com',
      firstName: 'Ana',
      lastName: 'Martínez',
      role: 'DOCTOR',
      status: 'ACTIVE',
      department: 'Cardiología',
      specialty: 'Cardiología Intervencionista',
      employeeId: 'EMP001',
      licenseNumber: 'MED123456',
      phone: '+52 555 123 4567',
      lastLoginAt: new Date('2024-01-20T08:30:00'),
      lastLoginIP: '192.168.1.100',
      failedLoginAttempts: 0,
      isLockedOut: false,
      mustChangePassword: false,
      passwordLastChanged: new Date('2024-01-01'),
      mfaEnabled: true,
      preferences: {
        language: 'es',
        timezone: 'America/Mexico_City',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        currency: 'MXN',
        notifications: {
          email: true,
          sms: true,
          push: true,
          inApp: true,
        },
        dashboard: {
          defaultView: 'appointments',
          widgetPreferences: {},
        },
        privacy: {
          showOnlineStatus: true,
          allowDirectMessages: true,
        },
      },
      permissions: mockRoles[0]?.permissions ?? [],
      dataAccessLevel: 'DEPARTMENT',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-20'),
      createdBy: 'system',
      isDeleted: false,
    },
  ]

  const mockAuditLogs: AuditLog[] = [
    {
      id: '1',
      userId: '1',
      userEmail: 'dr.martinez@medixone.com',
      action: 'LOGIN_SUCCESS',
      module: 'DASHBOARD',
      details: { loginMethod: 'password_mfa' },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess123',
      timestamp: new Date('2024-01-20T08:30:00'),
      severity: 'LOW',
      success: true,
    },
    {
      id: '2',
      userId: '1',
      userEmail: 'dr.martinez@medixone.com',
      action: 'UPDATE_PATIENT',
      module: 'PATIENTS',
      resourceType: 'Patient',
      resourceId: 'pat123',
      details: { updatedFields: ['phone', 'address'] },
      oldValues: { phone: '+52 555 111 1111', address: 'Av. Principal 123' },
      newValues: { phone: '+52 555 222 2222', address: 'Av. Secundaria 456' },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess123',
      timestamp: new Date('2024-01-20T09:15:00'),
      severity: 'MEDIUM',
      success: true,
    },
  ]

  const mockSecurityAlerts: SecurityAlert[] = [
    {
      id: '1',
      type: 'SUSPICIOUS_LOGIN',
      severity: 'MEDIUM',
      title: 'Intento de acceso desde nueva ubicación',
      description: 'El usuario dr.martinez@medixone.com intentó acceder desde una IP no reconocida',
      userId: '1',
      ipAddress: '203.0.113.1',
      details: {
        location: 'Unknown Location',
        previousLocations: ['Mexico City, MX'],
      },
      isResolved: false,
      createdAt: new Date('2024-01-20T10:00:00'),
    },
  ]

  const mockSessions: UserSession[] = [
    {
      id: 'sess123',
      userId: '1',
      token: 'jwt_token_here',
      refreshToken: 'refresh_token_here',
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        platform: 'Win32',
        browser: 'Chrome',
        os: 'Windows',
        isMobile: false,
      },
      location: {
        ip: '192.168.1.100',
        country: 'Mexico',
        city: 'Mexico City',
        coordinates: { lat: 19.4326, lng: -99.1332 },
      },
      startedAt: new Date('2024-01-20T08:30:00'),
      lastActivityAt: new Date('2024-01-20T10:30:00'),
      expiresAt: new Date('2024-01-20T12:30:00'),
      isActive: true,
      mfaVerified: true,
    },
  ]

  const tabs = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
    },
    {
      id: 'roles',
      name: 'Roles',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    },
    {
      id: 'users',
      name: 'Usuarios',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    },
    {
      id: 'audit',
      name: 'Auditoría',
      icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
      id: 'security',
      name: 'Seguridad',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
      id: 'sessions',
      name: 'Sesiones',
      icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
    },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AccessControlDashboard
            users={mockUsers}
            roles={mockRoles}
            auditLogs={mockAuditLogs}
            securityAlerts={mockSecurityAlerts}
            sessions={mockSessions}
          />
        )
      case 'roles':
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Gestión de Roles - Próximamente</p>
          </div>
        )
      case 'users':
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Gestión de Usuarios - Próximamente</p>
          </div>
        )
      case 'audit':
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Auditoría - Próximamente</p>
          </div>
        )
      case 'security':
        return (
          <SecurityOverview
            alerts={mockSecurityAlerts}
            sessions={mockSessions}
            auditLogs={mockAuditLogs}
          />
        )
      case 'sessions':
        return <SessionManagement sessions={mockSessions} users={mockUsers} />
      default:
        return <div>Contenido no encontrado</div>
    }
  }

  return (
    <Layout title="Control de Acceso">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white shadow">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Control de Acceso</h1>
                  <p className="text-gray-600">Sistema avanzado de roles, permisos y seguridad</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Sistema Activo</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Última actualización: {new Date().toLocaleTimeString('es-ES')}
                  </div>
                </div>
              </div>
            </div>

            {/* Navegación por pestañas */}
            <div className="border-t border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AccessControlTab)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={tab.icon}
                      />
                    </svg>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6">{renderContent()}</div>
        </div>
      </div>
    </Layout>
  )
}

// Componente Dashboard del Control de Acceso
interface AccessControlDashboardProps {
  users: SystemUser[]
  roles: RoleConfiguration[]
  auditLogs: AuditLog[]
  securityAlerts: SecurityAlert[]
  sessions: UserSession[]
}

function AccessControlDashboard({
  users,
  roles,
  auditLogs,
  securityAlerts,
  sessions,
}: AccessControlDashboardProps) {
  const activeUsers = users.filter((u) => u.status === 'ACTIVE' && !u.isDeleted)
  const lockedUsers = users.filter((u) => u.isLockedOut && !u.isDeleted)
  const mfaUsers = users.filter((u) => u.mfaEnabled && !u.isDeleted)
  const criticalAlerts = securityAlerts.filter((a) => a.severity === 'CRITICAL' && !a.isResolved)
  const activeSessions = sessions.filter((s) => s.isActive)
  const recentFailedLogins = auditLogs.filter(
    (l) =>
      l.action.includes('LOGIN') &&
      !l.success &&
      l.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000) // últimas 24h
  )

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-3xl font-bold text-green-600">{activeUsers.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  de {users.filter((u) => !u.isDeleted).length} total
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Alertas Críticas</p>
                <p className="text-3xl font-bold text-red-600">{criticalAlerts.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {securityAlerts.filter((a) => !a.isResolved).length} sin resolver
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Sesiones Activas</p>
                <p className="text-3xl font-bold text-blue-600">{activeSessions.length}</p>
                <p className="text-xs text-gray-500 mt-1">{mfaUsers.length} con MFA</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Logins Fallidos</p>
                <p className="text-3xl font-bold text-orange-600">{recentFailedLogins.length}</p>
                <p className="text-xs text-gray-500 mt-1">últimas 24h</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de seguridad recientes */}
      {securityAlerts.filter((a) => !a.isResolved).length > 0 && (
        <Card className="border-l-4 border-l-red-400">
          <CardHeader>
            <h3 className="text-lg font-semibold text-red-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              Alertas de Seguridad Activas
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityAlerts
                .filter((a) => !a.isResolved)
                .slice(0, 3)
                .map((alert) => (
                  <div key={alert.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-red-800">{alert.title}</h4>
                        <p className="text-sm text-red-700 mt-1">{alert.description}</p>
                        <div className="flex items-center mt-2 text-xs text-red-600">
                          <span>Severidad: {alert.severity}</span>
                          <span className="mx-2">•</span>
                          <span>{alert.createdAt.toLocaleString('es-ES')}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                        Revisar
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usuarios bloqueados */}
        {lockedUsers.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Usuarios Bloqueados</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lockedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-red-600">
                        {user.failedLoginAttempts} intentos fallidos
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Desbloquear
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actividad reciente */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${log.success ? 'bg-green-400' : 'bg-red-400'}`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500">
                      {log.userEmail} • {log.timestamp.toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente de vista general de seguridad
interface SecurityOverviewProps {
  alerts: SecurityAlert[]
  sessions: UserSession[]
  auditLogs: AuditLog[]
}

function SecurityOverview({ alerts, sessions, auditLogs }: SecurityOverviewProps) {
  return (
    <div className="space-y-6">
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Vista General de Seguridad</h3>
        <p className="mt-1 text-sm text-gray-500">
          Esta funcionalidad estará disponible próximamente
        </p>
      </div>
    </div>
  )
}

// Componente de gestión de sesiones
interface SessionManagementProps {
  sessions: UserSession[]
  users: SystemUser[]
}

function SessionManagement({ sessions, users }: SessionManagementProps) {
  return (
    <div className="space-y-6">
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
            d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Gestión de Sesiones</h3>
        <p className="mt-1 text-sm text-gray-500">
          Esta funcionalidad estará disponible próximamente
        </p>
      </div>
    </div>
  )
}

export default AccessControlPage
