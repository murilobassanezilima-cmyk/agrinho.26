document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Menu Responsivo Mobile
       ========================================================================== */
    const mobileBtn = document.querySelector('.btn-mobile-nav');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    // Fecha o menu ao clicar em qualquer link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        });
    });

    /* ==========================================================================
       2. Scroll Ativo dos Links das Seções
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       3. Animação ao Entrar na Tela (Intersection Observer)
       ========================================================================== */
    const animatedElements = document.querySelectorAll('.hidden-slide');

    const appearanceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-slide');
                observer.unobserve(entry.target); // Deixa de observar após animar
            }
        });
    }, {
        threshold: 0.15
    });

    animatedElements.forEach(el => appearanceObserver.observe(el));

    /* ==========================================================================
       4. Contadores Animados (Indicadores de Impacto)
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    const impactoSection = document.getElementById('impacto');
    let counterStarted = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = target / 80; // Controla a velocidade do incremento
            
            const updateCount = () => {
                const current = +counter.innerText;
                if (current < target) {
                    counter.innerText = Math.ceil(current + speed);
                    setTimeout(updateCount, 25);
                } else {
                    counter.innerText = target.toLocaleString('pt-BR');
                }
            };
            updateCount();
        });
    };

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counterStarted) {
            counterStarted = true;
            startCounters();
        }
    }, { threshold: 0.4 });

    if(impactoSection) counterObserver.observe(impactoSection);

    /* ==========================================================================
       5. Lightbox da Galeria
       ========================================================================== */
    const galeriaItens = document.querySelectorAll('.galeria-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    galeriaItens.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').getAttribute('src');
            // Otimização para buscar imagem de maior resolução do placeholder
            const largeImgSrc = imgSrc.replace('&w=600', '&w=1200');
            lightboxImg.setAttribute('src', largeImgSrc);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Trava scroll do fundo
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) closeLightbox();
    });

    /* ==========================================================================
       6. Carrossel de Depoimentos Automatizado
       ========================================================================== */
    const slides = document.querySelectorAll('.carrossel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    const startSlideShow = () => {
        slideInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
    };

    const stopSlideShow = () => {
        clearInterval(slideInterval);
    };

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            stopSlideShow();
            currentSlide = parseInt(e.target.getAttribute('data-index'));
            showSlide(currentSlide);
            startSlideShow();
        });
    });

    // Inicializa carrossel
    if(slides.length > 0) startSlideShow();

    /* ==========================================================================
       7. Validação Avançada do Formulário de Contato
       ========================================================================== */
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateInput = (input) => {
        const group = input.parentElement;
        if (input.value.trim() === '') {
            group.classList.add('error');
            return false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            group.classList.add('error');
            return false;
        } else {
            group.classList.remove('error');
            return true;
        }
    };

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;
            
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if(!validateInput(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Simulação de envio corporativo bem sucedido
                form.style.display = 'none';
                successMsg.style.display = 'flex';
                form.reset();
            }
        });

        // Remove estados de erro "ao digitar" para otimizar UX
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                if(input.value.trim() !== '') {
                    input.parentElement.classList.remove('error');
                }
            });
        });
    }

    /* ==========================================================================
       8. Botão "Voltar ao Topo"
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
