document.addEventListener('DOMContentLoaded', () => {
    // ===== INICIALIZACIÓN DE AOS =====
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        easing: 'ease-out-cubic'
    });

    // ===== MENÚ MÓVIL =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        const isExpanded = navMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Bloquear scroll cuando el menú está abierto
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('#navMenu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // ===== FILTRADO DEL MENÚ =====
    // ===== FILTRADO DEL MENÚ MEJORADO =====
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Actualizar botones activos
        filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        
        const filter = btn.getAttribute('data-filter');
        
        // Filtrar elementos del menú con animación mejorada
        menuItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                // Mostrar elemento con delay escalonado
                setTimeout(() => {
                    item.style.display = 'flex';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 50);
            } else {
                // Ocultar elemento
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 400);
            }
        });
        
        // Animar scroll suave hacia el menú
        setTimeout(() => {
            const menuSection = document.getElementById('menu');
            if (menuSection) {
                const offsetTop = menuSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 300);
    });
});
    // ===== RESERVAS POR WHATSAPP =====
    const whatsappBtn = document.getElementById('whatsappBtn');
    const reservationForm = document.getElementById('reservationForm');
    const modal = document.getElementById('confirmationModal');
    const closeModalBtn = document.querySelector('.close-button');

    whatsappBtn.addEventListener('click', () => {
        // Validar formulario
        if (!validateForm()) {
            return;
        }
        
        // Obtener datos del formulario
        const formData = getFormData();
        
        // Crear mensaje de WhatsApp
        const message = createWhatsAppMessage(formData);
        const whatsappUrl = `https://wa.me/3153693952?text=${encodeURIComponent(message)}`;
        
        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Mostrar modal de confirmación
        showModal();
        
        // Limpiar formulario
        reservationForm.reset();
        
        // Enviar evento a Google Analytics (si está configurado)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'reservation_request', {
                'event_category': 'engagement',
                'event_label': 'WhatsApp Reservation'
            });
        }
    });

    // Función para validar formulario
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;
        
        if (!name || !phone || !date || !time || !guests) {
            showNotification('Por favor, completa todos los campos obligatorios.', 'error');
            return false;
        }
        
        // Validar formato de teléfono (básico)
        const phoneRegex = /^[0-9+\-\s()]{9,}$/;
        if (!phoneRegex.test(phone)) {
            showNotification('Por favor, introduce un número de teléfono válido.', 'error');
            return false;
        }
        
        return true;
    }

    // Función para obtener datos del formulario
    function getFormData() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;
        const notes = document.getElementById('notes').value.trim();
        
        return { name, phone, email, date, time, guests, notes };
    }

    // Función para crear mensaje de WhatsApp
    function createWhatsAppMessage(data) {
        const formattedDate = new Date(data.date + 'T00:00:00').toLocaleDateString('es-ES', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
        
        let message = `¡Hola! Me gustaría solicitar una reserva en Gourmet Experience:\n\n`;
        message += `*Nombre:* ${data.name}\n`;
        message += `*Teléfono:* ${data.phone}\n`;
        
        if (data.email) {
            message += `*Email:* ${data.email}\n`;
        }
        
        message += `*Fecha:* ${formattedDate}\n`;
        message += `*Hora:* ${data.time}\n`;
        message += `*Comensales:* ${data.guests}\n`;
        message += `*Notas:* ${data.notes || 'Ninguna'}\n\n`;
        message += `Espero su confirmación. ¡Gracias!`;
        
        return message;
    }

    // Función para mostrar notificación
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 700;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transform: translateX(120%);
            transition: transform 0.3s ease;
        `;
        
        // Color según el tipo
        if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
        } else if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
        } else {
            notification.style.backgroundColor = '#17a2b8';
        }
        
        // Añadir al DOM
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // ===== MODAL =====
    function showModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Enfocar el botón de cerrar para accesibilidad
        closeModalBtn.focus();
    }

    function hideModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', hideModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            hideModal();
        }
    });

    // ===== FECHA MÍNIMA PARA RESERVAS =====
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // ===== SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if(targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Offset para header fijo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Actualizar URL sin recargar la página
                history.pushState(null, null, targetId);
            }
            
            // Cerrar menú móvil si está abierto
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });

    // ===== HEADER CON SCROLL =====
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(26, 26, 26, 0.98)';
            header.style.padding = '0.7rem 0';
        } else {
            header.style.backgroundColor = 'rgba(26, 26, 26, 0.9)';
            header.style.padding = '1rem 0';
        }
        
        // Ocultar/mostrar header al hacer scroll
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = window.scrollY;
    });

    // ===== CARGADO PEREZOSO DE IMÁGENES =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===== MEJORA DE FORMULARIOS =====
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
        // Añadir clase cuando el campo tiene contenido
        control.addEventListener('blur', () => {
            if (control.value) {
                control.classList.add('has-value');
            } else {
                control.classList.remove('has-value');
            }
        });
        
        // Validación en tiempo real para teléfono
        if (control.type === 'tel') {
            control.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9+\-\s()]/g, '');
            });
        }
    });

    // ===== TESTIMONIOS DESLIZANTES =====
    // (Implementación básica - se puede expandir con una librería como Swiper)
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
    
    // Inicializar si hay testimonios
    if (testimonials.length > 0) {
        showTestimonial(0);
        
        // Cambiar testimonio cada 5 segundos
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }

    // ===== MEJORA DE RENDIMIENTO =====
    // Limitar la frecuencia de ejecución de eventos de scroll
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Aplicar throttle a eventos de scroll
    window.addEventListener('scroll', throttle(() => {
        // Código que se ejecuta durante el scroll
    }, 100));

    console.log('Gourmet Experience - Sitio web cargado correctamente');
});