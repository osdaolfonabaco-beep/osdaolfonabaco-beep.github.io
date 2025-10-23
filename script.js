// script.js (V15 - Animación H1 Scramble, Refinamientos)

document.addEventListener('DOMContentLoaded', () => {

    console.log("Portafolio Oscar Olarte V15 cargado (H1 Scramble, Fondo CSS).");

    // --- 1. Animación de la Barra de Navegación ---
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { 
            nav.classList.add('navbar-scrolled');
        } else {
            nav.classList.remove('navbar-scrolled');
        }
    });

    // --- 2. FUNCIÓN: Animación de Títulos "Scramble" (Rápida) ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ*!#%&_";
    
    const scrambleAnimation = (element) => {
        if (!element.dataset.originalText) {
            element.dataset.originalText = element.textContent;
        }
        const originalText = element.dataset.originalText;
        let iteration = 0;
        
        // Limpiar intervalo previo si existe
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

    // --- 3. Animación de Entrada del "Hero" & Scroll Reveal con Scramble para H1 y H2 ---
    // El H1 del Hero ahora también usa la animación scramble y es parte del observer.
    const heroElements = document.querySelectorAll('.hero-content > .fade-in:not(h1)'); // Elementos que solo se desvanecen (subtítulo, descripción, botones)
    const heroH1 = document.querySelector('.hero-content h1.fade-in'); // El H1 que tendrá scramble

    // Activación inicial para los elementos que solo se desvanecen
    heroElements.forEach((el) => {
        void el.offsetWidth; // Forzar reflow
        el.classList.add('hero-visible');
    });

    // Intersection Observer para las animaciones de scroll y el H1 del Hero
    const revealObserverOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-title') || entry.target === heroH1) {
                    if (!entry.target.dataset.intervalId || entry.target.dataset.intervalId === 'null') {
                         scrambleAnimation(entry.target);
                    }
                } else {
                    entry.target.classList.add('visible');
                }
            } else {
                // Si ya no es visible, resetea la animación para que pueda repetirse
                if (entry.target.classList.contains('reveal-title') || entry.target === heroH1) {
                    if (entry.target.dataset.intervalId && entry.target.dataset.intervalId !== 'null') {
                        clearInterval(parseInt(entry.target.dataset.intervalId));
                        entry.target.dataset.intervalId = null;
                    }
                    if (entry.target.dataset.originalText) {
                        entry.target.textContent = entry.target.dataset.originalText;
                    }
                } else {
                    entry.target.classList.remove('visible');
                }
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealObserverOptions);
    
    // Incluimos el H1 del Hero en los elementos a observar
    const elementsToReveal = document.querySelectorAll('.reveal-card, .reveal-title, .hero-content h1.fade-in');
    elementsToReveal.forEach(el => { revealObserver.observe(el); });


    // --- 4. Lógica del Menú Móvil --- 
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navClose = document.getElementById('mobile-nav-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (navToggle && mobileNav && navClose && mobileLinks) {
        navToggle.addEventListener('click', () => {
            mobileNav.classList.add('is-active');
            navToggle.classList.add('is-active'); 
        });
        navClose.addEventListener('click', () => {
            mobileNav.classList.remove('is-active');
            navToggle.classList.remove('is-active');
        });
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('is-active');
                navToggle.classList.remove('is-active');
            });
        });
    } else { console.error("Error: No se encontraron elementos del menú móvil."); }

    // --- 5. Lógica del Modal ---
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    const projectButtons = document.querySelectorAll('.btn-project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTags = document.getElementById('modal-tags');
    const modalGithubLink = document.getElementById('modal-github-link');
    const modalImagePlaceholder = document.getElementById('modal-image-placeholder'); // Nuevo: placeholder para imagen

    if (modalOverlay && modalCloseBtn && projectButtons.length > 0 && modalTitle && modalDescription && modalTags && modalGithubLink && modalImagePlaceholder) {
        const openModal = (projectCard) => {
            const title = projectCard.dataset.title;
            const description = projectCard.dataset.description;
            const githubUrl = projectCard.dataset.githubUrl;
            const tags = JSON.parse(projectCard.dataset.tags); 
            const imageUrl = projectCard.dataset.imageUrl || 'https://via.placeholder.com/600x400.png?text=Imagen+del+Proyecto'; // Usa imagen del dataset o un placeholder

            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalGithubLink.href = githubUrl;
            
            // Si quieres que el botón "Ver Código" se oculte si no hay URL
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
            
            // Asigna la imagen al placeholder
            modalImagePlaceholder.innerHTML = `<img src="${imageUrl}" alt="${title}" style="max-width:100%; height:auto; border-radius:8px;">`;

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

    // --- 6. Lógica de Navegación Activa ---
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-menu a');

    if (sections.length > 0 && allNavLinks.length > 0) {
        const navObserverOptions = { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 };

        const navCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    allNavLinks.forEach(link => { link.classList.remove('active-link'); });
                    const activeLinks = document.querySelectorAll(`a[href="#${id}"]`);
                    activeLinks.forEach(link => { link.classList.add('active-link'); });
                }
            });
        };

        const navObserver = new IntersectionObserver(navCallback, navObserverOptions);
        sections.forEach(section => { navObserver.observe(section); });
    } else { console.error("Error: No se encontraron secciones o enlaces de navegación."); }

}); // Fin de DOMContentLoaded