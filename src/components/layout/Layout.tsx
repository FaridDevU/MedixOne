import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import Head from 'next/head'
import { useRequireAuth } from '@/hooks/useAuth'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export function Layout({ children, title = 'MedixOne' }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const auth = useRequireAuth()

  // Mostrar loading mientras verifica autenticación
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-medical-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-8 h-8 text-white animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.708 22H4.292C3.028 22 2 20.972 2 19.708V4.292C2 3.028 3.028 2 4.292 2h15.416C20.972 2 22 3.028 22 4.292v15.416C22 20.972 20.972 22 19.708 22zM18 6h-4V2h-4v4H6v4h4v4h4v-4h4V6z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando MedixOne</h2>
          <p className="text-gray-600">Verificando credenciales...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, useRequireAuth ya redirige
  if (!auth.isAuthenticated) {
    return null
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="h-screen flex overflow-hidden bg-gray-50">
        {/* Sidebar fijo */}
        <div className="flex-shrink-0">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex-shrink-0">
            <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
