// 🚀 SCRIPT PARA ARREGLAR EL SELECTOR DE IDIOMA
// Copia y pega este código en la CONSOLA de DevTools

console.log('🔧 Iniciando arreglo del selector de idioma...');

// Buscar todos los elementos que contengan texto de idioma
const languageElements = document.querySelectorAll('*');
let selectorFound = false;

languageElements.forEach(element => {
  const text = element.textContent || '';
  
  // Buscar elementos que contengan "es Español" o "en English"
  if (text.includes('es Español') || text.includes('en English')) {
    console.log('🎯 Encontré selector de idioma:', element);
    
    // Remover event listeners existentes y agregar el nuestro
    const newButton = element.cloneNode(true);
    
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const currentLang = localStorage.getItem('language') || 'es';
      const newLang = currentLang === 'es' ? 'en' : 'es';
      
      console.log('🌍 CAMBIANDO IDIOMA DE', currentLang, 'A', newLang);
      localStorage.setItem('language', newLang);
      
      alert(`Cambiando idioma a: ${newLang === 'es' ? 'Español' : 'English'}`);
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
    
    // Reemplazar el elemento original
    if (element.parentNode) {
      element.parentNode.replaceChild(newButton, element);
      console.log('✅ Selector de idioma arreglado!');
      selectorFound = true;
    }
  }
});

if (!selectorFound) {
  console.log('❌ No se encontró el selector de idioma');
  console.log('💡 Buscando por atributos...');
  
  // Buscar por otros métodos
  const possibleSelectors = document.querySelectorAll('[class*="language"], [class*="Language"], button');
  console.log('🔍 Elementos encontrados:', possibleSelectors.length);
}

console.log('🏁 Script completado. Ahora prueba hacer clic en el selector de idioma.');