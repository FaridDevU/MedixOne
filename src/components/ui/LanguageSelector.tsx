import React, { useState, useEffect } from 'react'
import { ChevronDown, Globe } from 'lucide-react'

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState('es')
  const [isOpen, setIsOpen] = useState(false)

  // Cargar idioma desde localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'es'
    setCurrentLanguage(savedLanguage)
    console.log('Current language loaded:', savedLanguage)
  }, [])

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  const handleLanguageChange = (langCode: string) => {
    console.log('🌍 CHANGING LANGUAGE FROM', currentLanguage, 'TO', langCode)
    setCurrentLanguage(langCode)
    localStorage.setItem('language', langCode)
    setIsOpen(false)
    
    // Forzar recarga para aplicar cambios INMEDIATAMENTE
    alert(`Cambiando idioma a: ${langCode === 'es' ? 'Español' : 'English'}`)
    window.location.reload()
  }

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => {
          console.log('🔘 Language selector clicked, current isOpen:', isOpen)
          setIsOpen(!isOpen)
        }}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        type="button"
      >
        <Globe className="h-4 w-4" />
        <span className="flex items-center space-x-1">
          <span>{currentLang.flag}</span>
          <span>{currentLang.code.toUpperCase()}</span>
          <span className="hidden sm:inline">{currentLang.name}</span>
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                currentLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
              {currentLanguage === language.code && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* Overlay para cerrar el dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}