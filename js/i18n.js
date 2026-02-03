function updateContent() {
  const lang = localStorage.getItem('language') || 'es';
  
  // Actualizar todos los elementos con data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang][key]) {
      // Si el elemento es un input o textarea, actualizamos el placeholder
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[lang][key];
      } else if (element.tagName === 'IMG') {
        element.alt = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }

      // También actualizamos el atributo title si existe la traducción
      if (element.hasAttribute('title')) {
        element.title = translations[lang][key];
      }
    }
  });

  // Actualizar clases activas en las banderas
  document.querySelectorAll('.lang-flag').forEach(flag => {
    if (flag.getAttribute('onclick').includes(lang)) {
      flag.classList.add('active');
    } else {
      flag.classList.remove('active');
    }
  });
}

function changeLanguage(lang) {
  localStorage.setItem('language', lang);
  updateContent();
  
  // Opcional: Podríamos disparar un evento si otros componentes necesitan saberlo
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Si no hay idioma guardado, detectamos el del navegador o usamos 'es' por defecto
  if (!localStorage.getItem('language')) {
    const browserLang = navigator.language.startsWith('en') ? 'en' : 'es';
    localStorage.setItem('language', browserLang);
  }
  updateContent();
});
