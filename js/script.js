// ============================================
// FORMULARIO DE COTIZACIÓN - DIBIAGI
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // CONTADOR DE AÑOS EN EL MERCADO (Automático)
  // ============================================
  // Dibiagi fue fundada en 1961
  const FOUNDING_YEAR = 1961;
  const yearsCounter = document.getElementById("years-counter");
  if (yearsCounter) {
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = currentYear - FOUNDING_YEAR;
    yearsCounter.textContent = yearsInBusiness;
  }

  // Inicializar tooltips de Bootstrap con posición debajo
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      placement: "bottom",
    });
  });

  // Inicializar AOS (Animate On Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      once: true, // Solo animar una vez
      offset: 100, // Offset desde el viewport
    });
  }

  // ============================================
  // MODAL DE COTIZACIÓN
  // ============================================

  // Lista de países para el selector de teléfono
  const countries = [
    { code: "ar", name: "Argentina", prefix: "+54" },
    { code: "cl", name: "Chile", prefix: "+56" },
    { code: "uy", name: "Uruguay", prefix: "+598" },
    { code: "br", name: "Brasil", prefix: "+55" },
    { code: "py", name: "Paraguay", prefix: "+595" },
    { code: "bo", name: "Bolivia", prefix: "+591" },
    { code: "pe", name: "Perú", prefix: "+51" },
    { code: "us", name: "Estados Unidos", prefix: "+1" },
    { code: "es", name: "España", prefix: "+34" },
  ];

  // Agregar el modal al body si no existe
  if (!document.getElementById("cotizacionModal")) {
      const modalHTML = `
        <div class="modal fade" id="cotizacionModal" tabindex="-1" aria-labelledby="cotizacionModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content cotizacion-modal-content">
                    <button type="button" class="cotizacion-close-btn" data-bs-dismiss="modal" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-body cotizacion-modal-body">
                        <h2 class="cotizacion-title" data-i18n="modal-cotizar-title">Cotizar cargas</h2>
                        <form id="cotizacionForm">
                            <div class="cotizacion-form-grid">
                                <!-- Fila 1: Nombre y Apellido | Origen -->
                                <div class="cotizacion-field">
                                    <input type="text" class="cotizacion-input" id="cotizacion-name" name="name" placeholder="Nombre y apellido" data-i18n="modal-cotizar-nombre" required>
                                </div>
                                <div class="cotizacion-field">
                                    <input type="text" class="cotizacion-input" id="cotizacion-origen" name="origen" placeholder="Origen" data-i18n="modal-cotizar-origen" required>
                                </div>
                                
                                <!-- Fila 2: Empresa | Destino -->
                                <div class="cotizacion-field">
                                    <input type="text" class="cotizacion-input" id="cotizacion-empresa" name="empresa" placeholder="Empresa" data-i18n="modal-cotizar-empresa">
                                </div>
                                <div class="cotizacion-field">
                                    <input type="text" class="cotizacion-input" id="cotizacion-destino" name="destino" placeholder="Destino" data-i18n="modal-cotizar-destino" required>
                                </div>
                                
                                <!-- Fila 3: Email | Volumen -->
                                <div class="cotizacion-field">
                                    <input type="email" class="cotizacion-input" id="cotizacion-email" name="email" placeholder="Email" data-i18n="modal-cotizar-email" required>
                                </div>
                                <div class="cotizacion-field">
                                    <input type="text" class="cotizacion-input" id="cotizacion-volumen" name="volumen" placeholder="Volumen (m2)" data-i18n="modal-cotizar-volumen">
                                </div>
                                
                                <!-- Fila 4: Teléfono con bandera | Peso -->
                                <div class="cotizacion-field">
                                    <div class="cotizacion-phone-wrapper">
                                        <div class="cotizacion-phone-prefix" id="flag-selector">
                                            <img src="https://flagcdn.com/w40/ar.png" alt="AR" class="cotizacion-flag" id="current-flag">
                                            <i class="fas fa-chevron-down cotizacion-chevron"></i>
                                            <div class="cotizacion-flag-dropdown" id="flag-dropdown">
                                                ${countries
                                                  .map(
                                                    (c) => `
                                                    <div class="flag-option" data-code="${c.code}" data-prefix="${c.prefix}">
                                                        <img src="https://flagcdn.com/w40/${c.code}.png" alt="${c.name}">
                                                        <span>${c.name} (${c.prefix})</span>
                                                    </div>
                                                `,
                                                  )
                                                  .join("")}
                                            </div>
                                        </div>
                                        <input type="tel" class="cotizacion-input cotizacion-phone-input" id="cotizacion-phone" name="phone" placeholder="Teléfono" data-i18n="modal-cotizar-telefono" value="+54 ">
                                    </div>
                                </div>
                                <div class="cotizacion-field">
                                    <input type="text" class="cotizacion-input" id="cotizacion-peso" name="peso" placeholder="Peso" data-i18n="modal-cotizar-peso">
                                </div>
                                
                                <!-- Fila 5: Tipo de carga | Tipo de embalaje -->
                                <div class="cotizacion-field">
                                    <select class="cotizacion-input cotizacion-select" id="cotizacion-tipoCarga" name="tipoCarga">
                                        <option value="" selected data-i18n="modal-cotizar-tipo-carga">Tipo de carga</option>
                                        <option value="CONSOLIDADA" data-i18n="modal-cotizar-carga-consolidada">Consolidada</option>
                                        <option value="COMPLETA" data-i18n="modal-cotizar-carga-completa">Completa</option>
                                        <option value="REFRIGERADA" data-i18n="modal-cotizar-carga-refrigerada">Refrigerada</option>
                                        <option value="OTRAS" data-i18n="modal-cotizar-carga-otras">Otras</option>
                                    </select>
                                </div>
                                <div class="cotizacion-field">
                                    <input type="text" class="cotizacion-input" id="cotizacion-embalaje" name="tipoEmbalaje" placeholder="Tipo de embalaje" data-i18n="modal-cotizar-tipo-embalaje">
                                </div>
                                
                                <!-- Fila 6: Comentario (ancho completo) -->
                                <div class="cotizacion-field cotizacion-field-full">
                                    <textarea class="cotizacion-input cotizacion-textarea" id="cotizacion-comentario" name="comentario" rows="3" placeholder="Comentario" data-i18n="modal-cotizar-comentario"></textarea>
                                </div>
                            </div>
                            
                            <!-- Botón de envío -->
                            <div class="cotizacion-submit-wrapper">
                                <button type="submit" class="cotizacion-submit-btn" id="btnEnviarCotizacion">
                                    <span class="btn-text" data-i18n="modal-cotizar-btn">Cotizar</span>
                                    <span class="btn-loading" style="display: none;">
                                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        <span data-i18n="modal-cotizar-enviando">Enviando...</span>
                                    </span>
                                </button>
                            </div>
                        </form>
                        
                        <!-- Mensaje de éxito/error -->
                        <div id="cotizacion-message" class="mt-3" style="display: none;"></div>
                    </div>
                </div>
            </div>
        </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Traducir el modal recién inyectado
    if (typeof updateContent === "function") {
      updateContent();
    }
  }

  // Inicializar lógica de flags para todos los formularios
  initAllFlagSelectors();

  function initAllFlagSelectors() {
    const wrappers = document.querySelectorAll(".cotizacion-phone-wrapper");

    wrappers.forEach((wrapper) => {
      const prefix = wrapper.querySelector(".cotizacion-phone-prefix");
      const dropdown = wrapper.querySelector(".cotizacion-flag-dropdown");
      const currentFlag = wrapper.querySelector(".cotizacion-flag");
      const phoneInput = wrapper.querySelector(".cotizacion-phone-input");

      if (!prefix || !dropdown || !currentFlag || !phoneInput) return;

      prefix.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Cerrar otros dropdowns abiertos
        document.querySelectorAll(".cotizacion-flag-dropdown").forEach((d) => {
          if (d !== dropdown) d.classList.remove("active");
        });

        dropdown.classList.toggle("active");
      });

      dropdown.querySelectorAll(".flag-option").forEach((option) => {
        option.addEventListener("click", function (e) {
          e.stopPropagation();
          const code = this.getAttribute("data-code");
          const countryPrefix = this.getAttribute("data-prefix");
          const countryName = this.querySelector("span").textContent.split(" (")[0];

          currentFlag.src = `https://flagcdn.com/w40/${code}.png`;
          currentFlag.alt = code.toUpperCase();
          phoneInput.value = countryPrefix + " ";
          phoneInput.focus();

          // Actualizar campo oculto de país si existe
          const paisInput = wrapper.querySelector('[name="pais"]');
          if (paisInput) {
            paisInput.value = countryName;
          }

          dropdown.classList.remove("active");
        });
      });
    });

    document.addEventListener("click", function () {
      document.querySelectorAll(".cotizacion-flag-dropdown").forEach((d) => {
        d.classList.remove("active");
      });
    });
  }

  // Capturar clicks en botones de cotización
  const cotizarButtons = document.querySelectorAll(
    ".btn-cotizar, .btn-cotizacion, .btn-fleet-primary",
  );
  let selectedUnit = ""; // Variable para guardar la unidad seleccionada

  cotizarButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Solo si el href es "#" o vacío
      if (this.getAttribute("href") === "#" || !this.getAttribute("href")) {
        e.preventDefault();

        // Si el botón tiene información de vehículo (Flota)
        const vehicle = this.getAttribute("data-vehicle");
        selectedUnit = vehicle || ""; // Guardar globalmente para el envío

        const commentArea = document.getElementById("cotizacion-comentario");

        if (vehicle && commentArea) {
          // Detectar idioma actual
          const lang = localStorage.getItem("language") || "es";
          
          // Obtener prefijo traducido
          const prefix = (translations[lang] && translations[lang]["modal-cotizar-comentario-prefix"]) 
            || "Solicito cotización para el vehículo: ";
          
          // Obtener nombre del vehículo traducido (si el vehicle es una key)
          const translatedVehicle = (translations[lang] && translations[lang][vehicle]) || vehicle;
          
          commentArea.value = `${prefix}${translatedVehicle}`;
        } else if (commentArea) {
          commentArea.value = ""; // Limpiar si es genérico
        }

        const modal = new bootstrap.Modal(
          document.getElementById("cotizacionModal"),
        );
        modal.show();
      }
    });
  });

  // ============================================
  // MODAL DE FICHAS TÉCNICAS (transporte.html)
  // ============================================
  const infoButtons = document.querySelectorAll(".btn-fleet-secondary");
  const fichaModalEl = document.getElementById("fichaModal");
  const fichaImage = document.getElementById("fichaImage");

  if (infoButtons.length > 0 && fichaModalEl && fichaImage) {
    infoButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        
        // Detectar idioma actual
        const lang = localStorage.getItem("language") || "es";
        
        // Obtener la ruta correspondiente al idioma
        const fichaPath = this.getAttribute(`data-ficha-${lang}`);
        
        if (fichaPath && fichaPath !== "#") {
          // Inicializar modal solo si es necesario
          const fichaModal = new bootstrap.Modal(fichaModalEl);
          // Mostrar siempre en el modal (tanto JPG como PNG)
          fichaImage.src = fichaPath;
          fichaModal.show();
        }
      });
    });
  }

  // Manejar envío del formulario
  const cotizacionForm = document.getElementById("cotizacionForm");
  if (cotizacionForm) {
    cotizacionForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const btn = document.getElementById("btnEnviarCotizacion");
      const btnText = btn.querySelector(".btn-text");
      const btnLoading = btn.querySelector(".btn-loading");
      const messageDiv = document.getElementById("cotizacion-message");

      // Mostrar loading
      btnText.style.display = "none";
      btnLoading.style.display = "inline-flex";
      btn.disabled = true;
      messageDiv.style.display = "none";

      // Recopilar datos del formulario
      const formData = {
        name: document.getElementById("cotizacion-name").value,
        empresa: document.getElementById("cotizacion-empresa").value,
        email: document.getElementById("cotizacion-email").value,
        phone: document.getElementById("cotizacion-phone").value,
        tipoCarga: document.getElementById("cotizacion-tipoCarga").value,
        origen: document.getElementById("cotizacion-origen").value,
        destino: document.getElementById("cotizacion-destino").value,
        volumen: document.getElementById("cotizacion-volumen").value,
        peso: document.getElementById("cotizacion-peso").value,
        tipoEmbalaje: document.getElementById("cotizacion-embalaje").value,
        comentario: document.getElementById("cotizacion-comentario").value,
        unidad: selectedUnit, // Enviar la unidad capturada
      };

      try {
        // Opción 1: Envío local (PHP) - Actualizado para soportar IA en el futuro
        // Para activar la IA, reemplazaremos esta URL por el Webhook de Make.com
        const response = await fetch("cotizacion.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          messageDiv.className = "mt-3 alert alert-success";
          messageDiv.innerHTML =
            '<i class="fas fa-check-circle me-2"></i>' + result.message;
          messageDiv.style.display = "block";

          // Limpiar formulario
          cotizacionForm.reset();

          // Cerrar modal después de 3 segundos
          setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(
              document.getElementById("cotizacionModal"),
            );
            if (modal) modal.hide();
            messageDiv.style.display = "none";
          }, 3000);
        } else {
          messageDiv.className = "mt-3 alert alert-danger";
          messageDiv.innerHTML =
            '<i class="fas fa-exclamation-circle me-2"></i>' + result.message;
          messageDiv.style.display = "block";
        }
      } catch (error) {
        console.error("Error:", error);
        messageDiv.className = "mt-3 alert alert-danger";
        messageDiv.innerHTML =
          '<i class="fas fa-exclamation-circle me-2"></i>Error de conexión. Por favor intente nuevamente.';
        messageDiv.style.display = "block";
      } finally {
        // Restaurar botón
        btnText.style.display = "inline";
        btnLoading.style.display = "none";
        btn.disabled = false;
      }
    });
  }

  // Limpiar mensaje cuando se cierra el modal
  const cotizacionModal = document.getElementById("cotizacionModal");
  if (cotizacionModal) {
    cotizacionModal.addEventListener("hidden.bs.modal", function () {
      const messageDiv = document.getElementById("cotizacion-message");
      if (messageDiv) {
        messageDiv.style.display = "none";
      }
    });
  }

  // ============================================
  // FORMULARIO DE CONTACTO (contacto.html)
  // ============================================
  const contactoForm = document.getElementById("contactoForm");
  if (contactoForm) {
    contactoForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const btn = document.getElementById("btnSubmitContacto");
      const btnText = btn.querySelector(".btn-text");
      const btnLoading = btn.querySelector(".btn-loading");
      const feedback = document.getElementById("contactoFeedback");

      // Mostrar loading
      btnText.style.display = "none";
      btnLoading.style.display = "inline-flex";
      btn.disabled = true;
      feedback.style.display = "none";

      const formData = {
        nombre: contactoForm.querySelector('[name="nombre"]').value,
        pais: contactoForm.querySelector('[name="pais"]').value,
        telefono: contactoForm.querySelector('[name="telefono"]').value,
        email: contactoForm.querySelector('[name="email"]').value,
        mensaje: contactoForm.querySelector('[name="mensaje"]').value,
      };

      try {
        const response = await fetch("contacto-handler.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          feedback.className = "mt-3 alert alert-success";
          feedback.innerHTML =
            '<i class="fas fa-check-circle me-2"></i>' + result.message;
          contactoForm.reset();
        } else {
          feedback.className = "mt-3 alert alert-danger";
          feedback.innerHTML =
            '<i class="fas fa-exclamation-circle me-2"></i>' + result.message;
        }
      } catch (error) {
        console.error("Error:", error);
        feedback.className = "mt-3 alert alert-danger";
        feedback.innerHTML =
          '<i class="fas fa-exclamation-circle me-2"></i>Error de conexión. Por favor intente nuevamente.';
      } finally {
        feedback.style.display = "block";
        btnText.style.display = "inline";
        btnLoading.style.display = "none";
        btn.disabled = false;
      }
    });
  }

  // ============================================
  // FORMULARIO TRABAJA CON NOSOTROS (contacto.html)
  // ============================================
  const recruitmentForm = document.getElementById("recruitmentForm");
  const cvInput = document.getElementById("cvInput");
  const cvText = document.getElementById("cvText");

  // Mostrar nombre del archivo seleccionado
  if (cvInput) {
    cvInput.addEventListener("change", function () {
      if (this.files.length > 0) {
        cvText.textContent = this.files[0].name;
      } else {
        cvText.textContent = "Subir CV (PDF/DOC)";
      }
    });
  }

  if (recruitmentForm) {
    recruitmentForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const btn = document.getElementById("btnSubmitTrabaja");
      const btnText = btn.querySelector(".btn-text");
      const btnLoading = btn.querySelector(".btn-loading");
      const feedback = document.getElementById("trabajaFeedback");

      // Mostrar loading
      btnText.style.display = "none";
      btnLoading.style.display = "inline-flex";
      btn.disabled = true;
      feedback.style.display = "none";

      const formData = new FormData(recruitmentForm);

      try {
        const response = await fetch("trabaja-handler.php", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          feedback.className = "mt-3 alert alert-success";
          feedback.innerHTML =
            '<i class="fas fa-check-circle me-2"></i>' + result.message;
          recruitmentForm.reset();
          cvText.textContent = "Subir CV (PDF/DOC)";
        } else {
          feedback.className = "mt-3 alert alert-danger";
          feedback.innerHTML =
            '<i class="fas fa-exclamation-circle me-2"></i>' + result.message;
        }
      } catch (error) {
        console.error("Error:", error);
        feedback.className = "mt-3 alert alert-danger";
        feedback.innerHTML =
          '<i class="fas fa-exclamation-circle me-2"></i>Error de conexión. Por favor intente nuevamente.';
      } finally {
        feedback.style.display = "block";
        btnText.style.display = "inline";
        btnLoading.style.display = "none";
        btn.disabled = false;
      }
    });
  }
  // ============================================
  // BOTÓN SCROLL TO TOP
  // ============================================
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollTopBtn.className = "scroll-top";
  scrollTopBtn.setAttribute("aria-label", "Volver arriba");
  document.body.appendChild(scrollTopBtn);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("active");
    } else {
      scrollTopBtn.classList.remove("active");
    }
  });

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // ============================================
  // CRONOLOGÍA ANIMADA (Intersection Observer)
  // ============================================
  const timelineItems = document.querySelectorAll(".tl-item");

  if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Unobserve para que solo anime una vez
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    timelineItems.forEach((item) => timelineObserver.observe(item));
  }

  // ============================================
  // LAZY LOAD VIDEO (IntersectionObserver)
  // ============================================
  const lazyVideos = document.querySelectorAll("video[data-src]");

  if (lazyVideos.length > 0) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target;
            video.src = video.getAttribute("data-src");
            video.removeAttribute("data-src");
            videoObserver.unobserve(video);
          }
        });
      },
      {
        rootMargin: "200px 0px", // Cargar 200px antes de que sea visible
      },
    );

    lazyVideos.forEach((video) => videoObserver.observe(video));
  }
});
