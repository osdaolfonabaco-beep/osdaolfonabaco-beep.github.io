// script.js (V25 - Animación de Párrafos y Foto "About Me")

document.addEventListener('DOMContentLoaded', () => {

    console.log("Portafolio Oscar Olarte V25 cargado (Animación About Me + Foto).");

    // === 0. INICIALIZACIÓN DE VANTA.JS (NET) ===
    try {
        VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x36ade0,
            backgroundColor: 0x21453e,
            points: 20.00,
            maxDistance: 30.00,
            spacing: 15.00
        });
    } catch (e) {
        console.error("Error al cargar Vanta.js: ", e);
    }
    // === FIN DE SECCIÓN 0 ===


    // === 1. REGISTRO DE PLUGINS DE GSAP ===
    try {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    } catch (e) {
        console.error("Error crítico: Las librerías GSAP no se cargaron.");
        return;
    }

    // === 2. FUNCIÓN SCRAMBLE (Tu función original) ===
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ*!#%&_";
    const scrambleAnimation = (element) => {
        if (!element.dataset.originalText) {
            element.dataset.originalText = element.textContent;
        }
        const originalText = element.dataset.originalText;
        let iteration = 0;
        
        if (element.dataset.intervalId) {
            clearInterval(parseInt(element.dataset.intervalId));
        }

        const intervalId = setInterval(() => {
            element.textContent = originalText.split("")
                .map((letter, index) => {
                    if(index < iteration) { return originalText[index]; }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            if(iteration >= originalText.length){
                clearInterval(intervalId);
                element.dataset.intervalId = null; 
            }
            iteration += originalText.length / 23; 
        }, 30); 

        element.dataset.intervalId = intervalId.toString(); 
    };

    // === 3. LÓGICA DE CURSOR INTERACTIVO (V3 - GSAP COMPLETO) ===
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let isHovering = false;
    gsap.set(cursorDot, { xPercent: -50, yPercent: -50, scale: 1 });
    gsap.set(cursorOutline, { xPercent: -50, yPercent: -50, scale: 1 });
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        gsap.to(cursorDot, { duration: 0.1, x: posX, y: posY });
        gsap.to(cursorOutline, { duration: 0.4, x: posX, y: posY, ease: "power2.out" });
    });
    const interactiveElements = document.querySelectorAll('a, button, .nav-toggle, .modal-close');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            gsap.to(cursorDot, { duration: 0.3, scale: 0.5, ease: 'power2.out' });
            gsap.to(cursorOutline, { 
                duration: 0.3, 
                scale: 2.0,
                backgroundColor: 'rgba(0, 170, 255, 0.1)',
                ease: 'power2.out' 
            });
        });
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            gsap.to(cursorDot, { duration: 0.3, scale: 1, ease: 'power2.out' });
            gsap.to(cursorOutline, { 
                duration: 0.3, 
                scale: 1, 
                backgroundColor: 'rgba(0, 170, 255, 0.2)',
                ease: 'power2.out' 
            });
        });
    });
    window.addEventListener('mousedown', () => {
        const outlineScaleTarget = isHovering ? 1.8 : 0.8;
        gsap.to(cursorDot, { duration: 0.1, scale: 0.3 });
        gsap.to(cursorOutline, { duration: 0.1, scale: outlineScaleTarget });
    });
    window.addEventListener('mouseup', () => {
        const outlineScaleTarget = isHovering ? 2.0 : 1;
        const dotScaleTarget = isHovering ? 0.5 : 1;
        gsap.to(cursorDot, { duration: 0.1, scale: dotScaleTarget });
        gsap.to(cursorOutline, { duration: 0.1, scale: outlineScaleTarget });
    });
    // === FIN DE SECCIÓN 3 ===


    // === 4. ANIMACIÓN DE ENTRADA "HERO" (Timeline de GSAP) ===
    const heroH1 = document.querySelector('.hero-content h1.fade-in');
    const heroTimeline = gsap.timeline({ delay: 0.2 });
    heroTimeline
        .to('.navbar', { 
            y: 0, 
            duration: 1, 
            ease: 'power2.out' 
        })
        .to('.nav-menu li', { 
            opacity: 1, 
            duration: 0.5, 
            stagger: 0.1, 
            ease: 'power1.inOut' 
        }, "-=0.5") 
        .to('.hero-content .fade-in', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15, 
            ease: 'power2.out'
        }, "-=0.5")
        .call(scrambleAnimation, [heroH1], ">-0.6"); 


    // === 5. SCROLL SUAVE Y NAVEGACIÓN ACTIVA (GSAP) ===
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .hero-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') {
                gsap.to(window, { duration: 1.2, scrollTo: 0, ease: 'power2.inOut' });
                return;
            }
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                gsap.to(window, { 
                    duration: 1.2, 
                    scrollTo: { 
                        y: targetElement, 
                        offsetY: 80 
                    }, 
                    ease: 'power2.inOut' 
                });
            }
        });
    });
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-menu a');
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onToggle: self => {
                if (self.isActive) {
                    const id = section.id;
                    allNavLinks.forEach(link => link.classList.remove('active-link'));
                    const activeLinks = document.querySelectorAll(`a[href="#${id}"]`);
                    activeLinks.forEach(link => { link.classList.add('active-link'); });
                }
            }
        });
    });

    // === 6. ANIMACIONES DE SCROLL (GSAP) ===
    
    // 6.1: Títulos de Sección (con tu Scramble)
    const revealTitles = document.querySelectorAll('.reveal-title');
    revealTitles.forEach(title => {
        ScrollTrigger.create({
            trigger: title,
            start: 'top 85%',
            onEnter: () => {
                if (!title.dataset.intervalId || title.dataset.intervalId === 'null') {
                    gsap.to(title, { opacity: 1, y: 0, duration: 0.5 });
                    scrambleAnimation(title);
                }
            },
            onLeaveBack: () => {
                if (title.dataset.intervalId && title.dataset.intervalId !== 'null') {
                    clearInterval(parseInt(title.dataset.intervalId));
                    title.dataset.intervalId = null;
                }
                if (title.dataset.originalText) {
                    title.textContent = title.dataset.originalText;
                }
                gsap.to(title, { opacity: 0, y: 30, duration: 0.5 });
            },
            once: false
        });
    });

    // 6.2: Tarjetas (Proyectos, Habilidades, Timeline)
    const revealCards = document.querySelectorAll('.reveal-card');
    revealCards.forEach(card => {
        gsap.fromTo(card, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                    
                    // ======== ANIMACIÓN PÁRRAFOS Y FOTO "ABOUT ME" (ACTUALIZADO) ========
                    onEnter: () => {
                        // Comprueba si esta tarjeta está dentro de la sección #about
                        if (card.closest('#about')) {
                            // Anima los párrafos
                            gsap.to('#about .about-text > p', {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                stagger: 0.2, 
                                ease: 'power2.out',
                                delay: 0.3 
                            });
                            // Anima la foto
                            gsap.to('#about .about-image', {
                                opacity: 1,
                                x: 0,
                                duration: 0.8,
                                ease: 'power2.out',
                                delay: 0.5 // Un poco después que el texto
                            });
                        }
                    }
                    // ===============================================================
                }
            }
        );
    });

    // 6.3: Animación escalonada de Habilidades
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        ScrollTrigger.create({
            trigger: category,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(category.querySelectorAll('.skill-list li'), {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            }
        });
    });

    // === 7. LÓGICA DE NAVBAR SCROLLED (Tu función original) ===
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) { 
            nav.classList.add('navbar-scrolled');
        } else {
            nav.classList.remove('navbar-scrolled');
        }
    });

    // === 8. LÓGICA DEL MENÚ MÓVIL (Tu función original) ===
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navClose = document.getElementById('mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    if (navToggle && mobileNav && navClose && mobileNavLinks) {
        navToggle.addEventListener('click', () => {
            mobileNav.classList.add('is-active');
            navToggle.classList.add('is-active'); 
        });
        navClose.addEventListener('click', () => {
            mobileNav.classList.remove('is-active');
            navToggle.classList.remove('is-active');
        });
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('is-active');
                navToggle.classList.remove('is-active');
            });
        });
    } else { console.error("Error: No se encontraron elementos del menú móvil."); }

    // === 9. LÓGICA DEL MODAL (Tu función original) ===
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    const projectButtons = document.querySelectorAll('.btn-project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTags = document.getElementById('modal-tags');
    const modalGithubLink = document.getElementById('modal-github-link');
    const modalImagePlaceholder = document.getElementById('modal-image-placeholder'); 
    if (modalOverlay && modalCloseBtn && projectButtons.length > 0 && modalTitle && modalDescription && modalTags && modalGithubLink && modalImagePlaceholder) {
        const openModal = (projectCard) => {
            const title = projectCard.dataset.title;
            const description = projectCard.dataset.description;
            const githubUrl = projectCard.dataset.githubUrl;
            const tags = JSON.parse(projectCard.dataset.tags); 
            const imageUrl = projectCard.dataset.imageUrl || 'https://via.placeholder.com/600x400.png?text=Imagen+del+Proyecto'; 
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalGithubLink.href = githubUrl;
            if (githubUrl) {
                modalGithubLink.style.display = 'inline-block';
            } else {
                modalGithubLink.style.display = 'none';
            }
            modalTags.innerHTML = ''; 
            tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.textContent = tag;
                modalTags.appendChild(tagElement);
            });
            
            const img = new Image();
            img.src = imageUrl;
            img.alt = title;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '8px';
            modalImagePlaceholder.innerHTML = ''; 
            modalImagePlaceholder.appendChild(img); 

            modalOverlay.classList.add('is-active');
        };
        const closeModal = () => {
            modalOverlay.classList.remove('is-active');
        };
        projectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectCard = button.closest('.project-card');
                openModal(projectCard);
            });
        });
        modalCloseBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) { closeModal(); }
        });
    } else { console.error("Error: No se encontraron elementos del modal."); }


    // === 10. ANIMACIÓN DE FONDO (ELIMINADA) ===
    // Vanta.js maneja el fondo estáticamente.

}); // Fin de DOMContentLoaded