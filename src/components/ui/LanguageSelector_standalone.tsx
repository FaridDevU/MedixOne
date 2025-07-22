import React, { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState('es')

  // Cargar idioma desde localStorage al montar
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'es'
    setCurrentLanguage(savedLanguage)
  }, [])

  // Guardar idioma en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('language', currentLanguage)
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChange', { detail: currentLanguage }))
  }, [currentLanguage])

  const handleLanguageChange = () => {
    const newLanguage = currentLanguage === 'es' ? 'en' : 'es'
    console.log('Changing language from', currentLanguage, 'to', newLanguage)
    setCurrentLanguage(newLanguage)
    
    // Force page reload to apply changes
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
    <button
      onClick={handleLanguageChange}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      type="button"
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase font-semibold">
        {currentLanguage === 'es' ? 'ES' : 'EN'}
      </span>
    </button>
  )
}