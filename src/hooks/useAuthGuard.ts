import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'

export function useAuthGuard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user && router.pathname !== '/login') {
      router.push('/login')
    }
  }, [user, isLoading, router])

  return { user, isLoading }
}
