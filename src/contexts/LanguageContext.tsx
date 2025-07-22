import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Tipos de idiomas soportados
export type SupportedLanguage = 'es' | 'en'

// Interfaz del contexto
interface LanguageContextType {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
  translations: Record<string, any>
  t: (key: string) => string
}

// Crear el contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Provider del contexto
interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('es')
  const [translations, setTranslations] = useState<Record<string, any>>({})

  // Cargar traducciones
  useEffect(() => {
    loadTranslations(currentLanguage)
  }, [currentLanguage])

  // Detectar idioma del navegador al inicializar
  useEffect(() => {
    const savedLanguage =
      typeof window !== 'undefined'
        ? (localStorage.getItem('medixone-language') as SupportedLanguage)
        : null
    const browserLanguage =
      typeof window !== 'undefined' && navigator.language.startsWith('en') ? 'en' : 'es'
    const initialLanguage = savedLanguage || browserLanguage
    setCurrentLanguage(initialLanguage)
  }, [])

  const loadTranslations = async (language: SupportedLanguage) => {
    try {
      const response = await import(`@/translations/${language}.json`)
      setTranslations(response.default)
    } catch (error) {
      console.error(`Error loading translations for ${language}:`, error)
      // Fallback a español si falla
      if (language !== 'es') {
        try {
          const fallback = await import('@/translations/es.json')
          setTranslations(fallback.default)
        } catch (fallbackError) {
          console.error('Error loading fallback translations:', fallbackError)
          setTranslations({})
        }
      }
    }
  }

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language)
    if (typeof window !== 'undefined') {
      localStorage.setItem('medixone-language', language)
    }
  }

  // Función de traducción
  const t = (key: string): string => {
    const keys = key.split('.')
    let value = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }

  const value: LanguageContextType = {
    language: currentLanguage,
    setLanguage,
    translations,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// Hook personalizado para usar el contexto
export function useTranslations() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useTranslations must be used within a LanguageProvider')
  }
  return context
}
