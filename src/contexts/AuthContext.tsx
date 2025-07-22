import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Tipos de usuario
export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PATIENT'

// Interface del usuario
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
  isActive: boolean
  lastLogin?: Date
}

// Interface del contexto de autenticación
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider del contexto
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si hay una sesión activa al inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('medixone-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('medixone-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulación de login - en producción esto sería una llamada a API
      if (email === 'admin@medixone.com' && password === 'admin123') {
        const userData: User = {
          id: 'user-1',
          email: email,
          firstName: 'Admin',
          lastName: 'Usuario',
          role: 'ADMIN',
          isActive: true,
          lastLogin: new Date(),
        }

        setUser(userData)
        localStorage.setItem('medixone-user', JSON.stringify(userData))
        setIsLoading(false)
        return true
      }

      // Más usuarios de prueba
      const testUsers: Record<string, User> = {
        'doctor@medixone.com': {
          id: 'user-2',
          email: 'doctor@medixone.com',
          firstName: 'Dr. José',
          lastName: 'Martínez',
          role: 'DOCTOR',
          isActive: true,
          lastLogin: new Date(),
        },
        'nurse@medixone.com': {
          id: 'user-3',
          email: 'nurse@medixone.com',
          firstName: 'Enf. Carmen',
          lastName: 'López',
          role: 'NURSE',
          isActive: true,
          lastLogin: new Date(),
        },
        'patient@medixone.com': {
          id: 'user-4',
          email: 'patient@medixone.com',
          firstName: 'María',
          lastName: 'González',
          role: 'PATIENT',
          isActive: true,
          lastLogin: new Date(),
        },
      }

      if (testUsers[email] && password === 'password123') {
        const userData = testUsers[email]
        setUser(userData)
        localStorage.setItem('medixone-user', JSON.stringify(userData))
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('medixone-user')
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
