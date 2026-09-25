document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mobileIcon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        if (navLinks.classList.contains('active')) {
            mobileIcon.classList.remove('ph-list');
            mobileIcon.classList.add('ph-x');
        } else {
            mobileIcon.classList.remove('ph-x');
            mobileIcon.classList.add('ph-list');
        }
    });

    // Cierra el menú al hacer clic en un enlace en móvil
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                mobileIcon.classList.remove('ph-x');
                mobileIcon.classList.add('ph-list');
            }
        });
    });

    // 2. Navbar effect on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.05)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // 3. Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const isActive = currentItem.classList.contains('active');
            
            // Cerrar todos
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            // Abrir el clickeado si no estaba activo
            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    });

    // 4. Update Footer Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 5. Form Submission via AJAX to GoHighLevel Webhook
    const form = document.getElementById('agendar-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const messageDiv = document.getElementById('form-message');
            const originalBtnText = submitBtn.innerHTML;
            
            // UI Update: Loading state
            submitBtn.innerHTML = 'Enviando... <i class="ph ph-spinner ph-spin"></i>';
            submitBtn.disabled = true;
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
            
            // Gather form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                // Webhook URL de GoHighLevel
                const webhookUrl = 'https://services.leadconnectorhq.com/hooks/BFlduntAgxuswIL9HZhj/webhook-trigger/20dd9d18-9000-421a-9a16-10e5c411d759';
                
                // 1. Enviar a GoHighLevel (sin esperar respuesta para evitar bloqueos CORS)
                fetch(webhookUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData).toString()
                }).catch(err => console.error("GHL Error:", err));

                // 2. Enviar correo electrónico directamente (vía FormSubmit)
                const emailUrl = 'https://formsubmit.co/ajax/Dannyprieto29042000@gmail.com';
                try {
                    await fetch(emailUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            Nombre: data.nombre || "No especificado",
                            Telefono: data.telefono || "No especificado",
                            Correo: data.correo || "No especificado",
                            Requerimiento: data.requerimiento || "Ninguno",
                            Servicio: data.servicio || "No especificado"
                        })
                    });
                } catch(emailErr) {
                    console.error("Email Error:", emailErr);
                }
                
                // Asumimos éxito si llegamos aquí, ya que los errores están manejados
                messageDiv.textContent = '¡Gracias! Hemos recibido tu solicitud y te contactaremos pronto.';
                messageDiv.className = 'form-message success';
                form.reset();

            } catch (error) {
                console.error('Error submitting form:', error);
                messageDiv.textContent = 'Ocurrió un error al enviar el formulario. Por favor, intenta de nuevo o escríbenos directamente.';
                messageDiv.className = 'form-message error';
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
