import React, { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Input, Select } from '@/components/ui'
import { RoleConfiguration } from '@/types/access-control'

interface RoleManagementProps {
  roles: RoleConfiguration[]
  onCreateRole?: (role: Partial<RoleConfiguration>) => void
  onUpdateRole?: (id: string, role: Partial<RoleConfiguration>) => void
  onDeleteRole?: (id: string) => void
  onDuplicateRole?: (id: string) => void
}

export function RoleManagement({
  roles,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
  onDuplicateRole,
}: RoleManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [selectedRole, setSelectedRole] = useState<RoleConfiguration | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Filtrar roles
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = !levelFilter || role.level.toString() === levelFilter

    return matchesSearch && matchesLevel
  })

  const getLevelColor = (level: number) => {
    if (level >= 9) return 'bg-red-100 text-red-800'
    if (level >= 7) return 'bg-orange-100 text-orange-800'
    if (level >= 5) return 'bg-yellow-100 text-yellow-800'
    if (level >= 3) return 'bg-blue-100 text-blue-800'
    return 'bg-green-100 text-green-800'
  }

  const getLevelLabel = (level: number) => {
    if (level >= 9) return 'Administrador'
    if (level >= 7) return 'Supervisor'
    if (level >= 5) return 'Especialista'
    if (level >= 3) return 'Usuario'
    return 'Básico'
  }

  const handleCreateRole = () => {
    setIsCreating(true)
    setSelectedRole(null)
  }

  const handleEditRole = (role: RoleConfiguration) => {
    setSelectedRole(role)
    setIsCreating(false)
  }

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gestión de Roles</h3>
              <p className="text-sm text-gray-500">
                {filteredRoles.length} rol{filteredRoles.length !== 1 ? 'es' : ''} encontrado
                {filteredRoles.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button onClick={handleCreateRole} className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Rol
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por nombre o descripción..."
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
              placeholder="Nivel de acceso"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos los niveles' },
                { value: '9', label: 'Administrador (9+)' },
                { value: '7', label: 'Supervisor (7-8)' },
                { value: '5', label: 'Especialista (5-6)' },
                { value: '3', label: 'Usuario (3-4)' },
                { value: '1', label: 'Básico (1-2)' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <Card key={role.id} className={`${!role.isActive ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{role.displayName}</h3>
                    {role.isSystemRole && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Sistema
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>

                  <div className="flex items-center space-x-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(role.level)}`}
                    >
                      Nivel {role.level} - {getLevelLabel(role.level)}
                    </span>
                    <span className="text-gray-500">{role.permissions.length} permisos</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Sesiones:</span>
                    <div className="font-medium">{role.maxConcurrentSessions}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Timeout:</span>
                    <div className="font-medium">{role.sessionTimeout}min</div>
                  </div>
                  <div>
                    <span className="text-gray-500">MFA:</span>
                    <div className="font-medium">{role.requiresMFA ? 'Requerido' : 'Opcional'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Estado:</span>
                    <div
                      className={`font-medium ${role.isActive ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {role.isActive ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Editar
                      </Button>
                      {onDuplicateRole && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDuplicateRole(role.id)}
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
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Duplicar
                        </Button>
                      )}
                    </div>
                    {!role.isSystemRole && onDeleteRole && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteRole(role.id)}
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vacío */}
      {filteredRoles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay roles</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || levelFilter
                ? 'No se encontraron roles con los filtros aplicados.'
                : 'Comienza creando tu primer rol de usuario.'}
            </p>
            {!searchTerm && !levelFilter && (
              <div className="mt-6">
                <Button onClick={handleCreateRole}>
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
                  Crear Primer Rol
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de creación/edición (simplificado) */}
      {(isCreating || selectedRole) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {isCreating ? 'Crear Nuevo Rol' : 'Editar Rol'}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false)
                    setSelectedRole(null)
                  }}
                >
                  ✕
                </Button>
              </div>

              <div className="text-center py-8">
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Formulario de Rol</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Esta funcionalidad estará disponible próximamente
                </p>
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      setIsCreating(false)
                      setSelectedRole(null)
                    }}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
