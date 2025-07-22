import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export function useAuth(): AuthContextType {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un token guardado al cargar
    const token = localStorage.getItem('medixone_token')
    const userData = localStorage.getItem('medixone_user')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        // Si hay error al parsear, limpiar localStorage
        localStorage.removeItem('medixone_token')
        localStorage.removeItem('medixone_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    // Simulación de login - reemplazar con API real
    if (email === 'admin@medixone.com' && password === 'admin123') {
      const userData: User = {
        id: '1',
        email,
        name: 'Dr. Administrador',
        role: 'ADMIN',
      }

      localStorage.setItem('medixone_token', 'demo-token-123')
      localStorage.setItem('medixone_user', JSON.stringify(userData))
      setUser(userData)
      router.push('/dashboard')
    } else {
      throw new Error('Credenciales incorrectas')
    }
  }

  const logout = () => {
    localStorage.removeItem('medixone_token')
    localStorage.removeItem('medixone_user')
    setUser(null)
    router.push('/auth/login')
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }
}

// Hook para proteger rutas
export function useRequireAuth() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      router.push('/auth/login')
    }
  }, [auth.loading, auth.isAuthenticated, router])

  return auth
}
