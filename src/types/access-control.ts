// Tipos para el sistema de control de acceso avanzado

// Roles del sistema
export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'DOCTOR'
  | 'NURSE'
  | 'RECEPTIONIST'
  | 'LAB_TECHNICIAN'
  | 'PHARMACIST'
  | 'BILLING_CLERK'
  | 'PATIENT'
  | 'GUEST'

// Módulos del sistema
export type SystemModule =
  | 'DASHBOARD'
  | 'PATIENTS'
  | 'APPOINTMENTS'
  | 'MEDICAL_RECORDS'
  | 'LABORATORY'
  | 'PRESCRIPTIONS'
  | 'BILLING'
  | 'REPORTS'
  | 'SETTINGS'
  | 'USER_MANAGEMENT'
  | 'AUDIT_LOGS'
  | 'NOTIFICATIONS'

// Acciones disponibles
export type Permission =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT'
  | 'EXPORT'
  | 'PRINT'
  | 'ASSIGN'
  | 'SCHEDULE'
  | 'CANCEL'
  | 'COMPLETE'
  | 'SIGN'
  | 'VERIFY'
  | 'AUDIT'

// Estado de usuario
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_ACTIVATION'

// Nivel de acceso a datos
export type DataAccessLevel =
  | 'OWN_ONLY' // Solo sus propios datos
  | 'DEPARTMENT' // Datos de su departamento
  | 'BRANCH' // Datos de su sucursal
  | 'ORGANIZATION' // Todos los datos de la organización
  | 'RESTRICTED' // Acceso limitado específico

// Interfaz para permisos específicos
export interface ModulePermission {
  module: SystemModule
  permissions: Permission[]
  dataAccessLevel: DataAccessLevel
  restrictions?: {
    timeRestriction?: {
      startTime: string // HH:mm
      endTime: string // HH:mm
      allowedDays: number[] // 0-6 (domingo-sábado)
    }
    ipRestriction?: string[] // IPs permitidas
    locationRestriction?: string[] // Ubicaciones permitidas
    patientTypeRestriction?: string[] // Tipos de pacientes
  }
}

// Configuración de rol
export interface RoleConfiguration {
  id: string
  name: string
  displayName: string
  description: string
  level: number // Nivel jerárquico (1-10)
  isSystemRole: boolean
  isActive: boolean
  permissions: ModulePermission[]
  inheritsFrom?: string[] // Roles de los que hereda permisos
  maxConcurrentSessions: number
  sessionTimeout: number // minutos
  requiresMFA: boolean
  createdAt: Date
  updatedAt: Date
}

// Usuario del sistema
export interface SystemUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  customRoles?: string[] // Roles personalizados adicionales
  status: UserStatus
  department?: string
  branch?: string
  employeeId?: string
  licenseNumber?: string // Para médicos
  specialty?: string
  phone?: string
  avatar?: string
  lastLoginAt?: Date
  lastLoginIP?: string
  lastLoginLocation?: string
  failedLoginAttempts: number
  isLockedOut: boolean
  lockoutUntil?: Date
  mustChangePassword: boolean
  passwordLastChanged: Date
  mfaEnabled: boolean
  mfaSecret?: string
  backupCodes?: string[]
  preferences: UserPreferences
  permissions: ModulePermission[]
  dataAccessLevel: DataAccessLevel
  supervisor?: string // ID del supervisor
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isDeleted: boolean
}

// Preferencias de usuario
export interface UserPreferences {
  language: 'es' | 'en'
  timezone: string
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  timeFormat: '12h' | '24h'
  currency: 'USD' | 'MXN' | 'EUR'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    inApp: boolean
  }
  dashboard: {
    defaultView: string
    widgetPreferences: Record<string, any>
  }
  privacy: {
    showOnlineStatus: boolean
    allowDirectMessages: boolean
  }
}

// Sesión de usuario
export interface UserSession {
  id: string
  userId: string
  token: string
  refreshToken: string
  deviceInfo: {
    userAgent: string
    platform: string
    browser: string
    os: string
    isMobile: boolean
  }
  location: {
    ip: string
    country?: string
    city?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  startedAt: Date
  lastActivityAt: Date
  expiresAt: Date
  isActive: boolean
  mfaVerified: boolean
}

// Log de auditoría
export interface AuditLog {
  id: string
  userId: string
  userEmail: string
  action: string
  module: SystemModule
  resourceType?: string
  resourceId?: string
  details: Record<string, any>
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  ipAddress: string
  userAgent: string
  location?: string
  sessionId: string
  timestamp: Date
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  success: boolean
  errorMessage?: string
}

// Intento de login
export interface LoginAttempt {
  id: string
  username: string
  email?: string
  success: boolean
  ipAddress: string
  userAgent: string
  location?: string
  failureReason?: 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'MFA_FAILED' | 'ACCOUNT_DISABLED'
  timestamp: Date
}

// Alerta de seguridad
export interface SecurityAlert {
  id: string
  type:
    | 'SUSPICIOUS_LOGIN'
    | 'MULTIPLE_FAILURES'
    | 'PRIVILEGE_ESCALATION'
    | 'DATA_BREACH'
    | 'UNAUTHORIZED_ACCESS'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  description: string
  userId?: string
  ipAddress?: string
  details: Record<string, any>
  isResolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
  createdAt: Date
}

// Funciones de utilidad para permisos
export function hasPermission(
  user: SystemUser,
  module: SystemModule,
  permission: Permission
): boolean {
  const modulePermission = user.permissions.find((p) => p.module === module)
  return modulePermission?.permissions.includes(permission) || false
}

export function canAccessData(
  user: SystemUser,
  resourceOwnerId: string,
  resourceDepartment?: string,
  resourceBranch?: string
): boolean {
  switch (user.dataAccessLevel) {
    case 'OWN_ONLY':
      return user.id === resourceOwnerId
    case 'DEPARTMENT':
      return user.department === resourceDepartment
    case 'BRANCH':
      return user.branch === resourceBranch
    case 'ORGANIZATION':
      return true
    case 'RESTRICTED':
      return user.id === resourceOwnerId
    default:
      return false
  }
}

export function isWithinTimeRestriction(
  permission: ModulePermission,
  currentTime: Date = new Date()
): boolean {
  const restrictions = permission.restrictions?.timeRestriction
  if (!restrictions) return true

  const currentDay = currentTime.getDay()
  const currentTimeStr = currentTime.toTimeString().slice(0, 5) // HH:mm

  const isAllowedDay = restrictions.allowedDays.includes(currentDay)
  const isWithinTimeRange =
    currentTimeStr >= restrictions.startTime && currentTimeStr <= restrictions.endTime

  return isAllowedDay && isWithinTimeRange
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Administrador',
    ADMIN: 'Administrador',
    DOCTOR: 'Médico',
    NURSE: 'Enfermero/a',
    RECEPTIONIST: 'Recepcionista',
    LAB_TECHNICIAN: 'Técnico de Laboratorio',
    PHARMACIST: 'Farmacéutico',
    BILLING_CLERK: 'Facturación',
    PATIENT: 'Paciente',
    GUEST: 'Invitado',
  }
  return roleNames[role] || role
}

export function getModuleDisplayName(module: SystemModule): string {
  const moduleNames: Record<SystemModule, string> = {
    DASHBOARD: 'Panel de Control',
    PATIENTS: 'Pacientes',
    APPOINTMENTS: 'Citas',
    MEDICAL_RECORDS: 'Historiales Médicos',
    LABORATORY: 'Laboratorio',
    PRESCRIPTIONS: 'Recetas',
    BILLING: 'Facturación',
    REPORTS: 'Reportes',
    SETTINGS: 'Configuración',
    USER_MANAGEMENT: 'Gestión de Usuarios',
    AUDIT_LOGS: 'Logs de Auditoría',
    NOTIFICATIONS: 'Notificaciones',
  }
  return moduleNames[module] || module
}

export function getPermissionDisplayName(permission: Permission): string {
  const permissionNames: Record<Permission, string> = {
    CREATE: 'Crear',
    READ: 'Leer',
    UPDATE: 'Actualizar',
    DELETE: 'Eliminar',
    APPROVE: 'Aprobar',
    REJECT: 'Rechazar',
    EXPORT: 'Exportar',
    PRINT: 'Imprimir',
    ASSIGN: 'Asignar',
    SCHEDULE: 'Programar',
    CANCEL: 'Cancelar',
    COMPLETE: 'Completar',
    SIGN: 'Firmar',
    VERIFY: 'Verificar',
    AUDIT: 'Auditar',
  }
  return permissionNames[permission] || permission
}

// Configuraciones predefinidas de roles
export const DEFAULT_ROLE_CONFIGURATIONS: Record<UserRole, Partial<RoleConfiguration>> = {
  SUPER_ADMIN: {
    name: 'SUPER_ADMIN',
    displayName: 'Super Administrador',
    description: 'Acceso completo al sistema',
    level: 10,
    isSystemRole: true,
    maxConcurrentSessions: 5,
    sessionTimeout: 480, // 8 horas
    requiresMFA: true,
  },
  ADMIN: {
    name: 'ADMIN',
    displayName: 'Administrador',
    description: 'Administrador del sistema con permisos avanzados',
    level: 9,
    isSystemRole: true,
    maxConcurrentSessions: 3,
    sessionTimeout: 360, // 6 horas
    requiresMFA: true,
  },
  DOCTOR: {
    name: 'DOCTOR',
    displayName: 'Médico',
    description: 'Médico con acceso a pacientes y historiales',
    level: 8,
    isSystemRole: true,
    maxConcurrentSessions: 2,
    sessionTimeout: 240, // 4 horas
    requiresMFA: true,
  },
  NURSE: {
    name: 'NURSE',
    displayName: 'Enfermero/a',
    description: 'Personal de enfermería',
    level: 6,
    isSystemRole: true,
    maxConcurrentSessions: 2,
    sessionTimeout: 240,
    requiresMFA: false,
  },
  RECEPTIONIST: {
    name: 'RECEPTIONIST',
    displayName: 'Recepcionista',
    description: 'Personal de recepción y citas',
    level: 4,
    isSystemRole: true,
    maxConcurrentSessions: 1,
    sessionTimeout: 180,
    requiresMFA: false,
  },
  LAB_TECHNICIAN: {
    name: 'LAB_TECHNICIAN',
    displayName: 'Técnico de Laboratorio',
    description: 'Personal de laboratorio',
    level: 5,
    isSystemRole: true,
    maxConcurrentSessions: 1,
    sessionTimeout: 240,
    requiresMFA: false,
  },
  PHARMACIST: {
    name: 'PHARMACIST',
    displayName: 'Farmacéutico',
    description: 'Personal de farmacia',
    level: 6,
    isSystemRole: true,
    maxConcurrentSessions: 1,
    sessionTimeout: 240,
    requiresMFA: false,
  },
  BILLING_CLERK: {
    name: 'BILLING_CLERK',
    displayName: 'Facturación',
    description: 'Personal de facturación',
    level: 4,
    isSystemRole: true,
    maxConcurrentSessions: 1,
    sessionTimeout: 180,
    requiresMFA: false,
  },
  PATIENT: {
    name: 'PATIENT',
    displayName: 'Paciente',
    description: 'Paciente con acceso limitado',
    level: 1,
    isSystemRole: true,
    maxConcurrentSessions: 2,
    sessionTimeout: 120,
    requiresMFA: false,
  },
  GUEST: {
    name: 'GUEST',
    displayName: 'Invitado',
    description: 'Acceso muy limitado',
    level: 0,
    isSystemRole: true,
    maxConcurrentSessions: 1,
    sessionTimeout: 60,
    requiresMFA: false,
  },
}
