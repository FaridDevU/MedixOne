import React from 'react'
import type { NextPage } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

const LoginPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-blue-50 to-medical-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2"
          width="404"
          height="404"
          fill="none"
          viewBox="0 0 404 404"
        >
          <defs>
            <pattern
              id="medical-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="4"
                height="4"
                className="text-medical-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#medical-pattern)" />
        </svg>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-medical-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.708 22H4.292C3.028 22 2 20.972 2 19.708V4.292C2 3.028 3.028 2 4.292 2h15.416C20.972 2 22 3.028 22 4.292v15.416C22 20.972 20.972 22 19.708 22zM18 6h-4V2h-4v4H6v4h4v4h4v-4h4V6z" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">MedixOne</h1>
          <p className="text-lg text-gray-600">Sistema Integral de Gestión Médica</p>
          <div className="w-24 h-1 bg-medical-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Login Form */}
        <div className="relative">
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>© 2024 MedixOne</span>
            <span>•</span>
            <span>Sistema Seguro</span>
            <span>•</span>
            <span>Soporte 24/7</span>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Servidor Activo
            </div>
            <div className="flex items-center text-xs text-blue-600">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Conexión Segura
            </div>
          </div>
        </div>
      </div>

      {/* Medical Icons Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-medical-100 opacity-50">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2L13.09 8.26L20 9L14 14.74L15.18 21.02L10 18.26L4.82 21.02L6 14.74L0 9L6.91 8.26L10 2Z"
            />
          </svg>
        </div>
        <div className="absolute top-3/4 right-1/4 text-medical-100 opacity-50">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="absolute top-1/2 right-1/6 text-medical-100 opacity-50">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
