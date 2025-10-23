// script.js (V12 - Hero Restaurado, Animación Rápida)

document.addEventListener('DOMContentLoaded', () => {

    console.log("Portafolio Oscar Olarte V12 cargado (Hero OK, Animación Rápida).");

    // --- 1. Animación de la Barra de Navegación ---
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { 
            nav.classList.add('navbar-scrolled');
        } else {
            nav.classList.remove('navbar-scrolled');
        }
    });

    // --- 2. Animación de Entrada del "Hero" (CORREGIDO) ---
    // Aseguramos que esta animación se ejecute al cargar, independientemente del scroll.
    const heroElements = document.querySelectorAll('.hero-content > .fade-in');
    // Usamos un pequeño retraso para asegurar que el CSS se haya cargado
    setTimeout(() => {
        heroElements.forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 100); // 100ms de retraso

    // --- 3. FUNCIÓN: Animación de Títulos "Scramble" (MÁS RÁPIDA) ---
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
                    if(index < iteration) {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            if(iteration >= originalText.length){
                clearInterval(intervalId);
                element.dataset.intervalId = null; 
            }
            
            // VELOCIDAD AJUSTADA (antes era / 45)
            iteration += originalText.length / 23; 
        }, 30); // Frame rate (30ms)

        element.dataset.intervalId = intervalId.toString(); 
    };


    // --- 4. Animación de "Scroll Reveal" (Sin cambios respecto a V11) ---
    // Esta lógica sigue reactivando las animaciones al entrar/salir.
    
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // SI es un título, ejecuta la animación "scramble"
                if (entry.target.classList.contains('reveal-title')) {
                    // Aseguramos que solo se anime si no está ya animándose
                    if (!entry.target.dataset.intervalId || entry.target.dataset.intervalId === 'null') {
                         scrambleAnimation(entry.target);
                    }
                } 
                // SI es una tarjeta, ejecuta la animación "fade-in-up"
                else {
                    entry.target.classList.add('visible');
                }
            } else {
                // Si ya no es visible, resetea la animación para que pueda repetirse
                if (entry.target.classList.contains('reveal-title')) {
                    // Detiene cualquier animación en curso al salir
                    if (entry.target.dataset.intervalId && entry.target.dataset.intervalId !== 'null') {
                        clearInterval(parseInt(entry.target.dataset.intervalId));
                        entry.target.dataset.intervalId = null;
                    }
                     // Resetea el texto al original para la próxima animación
                    if (entry.target.dataset.originalText) {
                        entry.target.textContent = entry.target.dataset.originalText;
                    }
                } 
                else {
                    entry.target.classList.remove('visible');
                }
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealObserverOptions);
    
    const elementsToReveal = document.querySelectorAll('.reveal-card, .reveal-title');
    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 5. Lógica del Menú Móvil --- (Sin cambios)
    // ... (código igual a V11)

    // --- 6. Lógica del Modal --- (Sin cambios)
    // ... (código igual a V11)

    // --- 7. Lógica de Navegación Activa --- (Sin cambios)
    // ... (código igual a V11)

});

// --- REPETICIÓN DEL CÓDIGO DE MODAL Y NAV ACTIVA (por si acaso) ---
// --- 5. Lógica del Menú Móvil --- 
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
} else {
    console.error("Error: No se encontraron elementos del menú móvil.");
}

// --- 6. Lógica del Modal ---
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close');
const projectButtons = document.querySelectorAll('.btn-project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalTags = document.getElementById('modal-tags');
const modalGithubLink = document.getElementById('modal-github-link');

if (modalOverlay && modalCloseBtn && projectButtons.length > 0 && modalTitle && modalDescription && modalTags && modalGithubLink) {
    const openModal = (projectCard) => {
        const title = projectCard.dataset.title;
        const description = projectCard.dataset.description;
        const githubUrl = projectCard.dataset.githubUrl;
        const tags = JSON.parse(projectCard.dataset.tags); 

        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalGithubLink.href = githubUrl;
        modalTags.innerHTML = ''; 
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag;
            modalTags.appendChild(tagElement);
        });
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
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
} else {
     console.error("Error: No se encontraron elementos del modal.");
}

// --- 7. Lógica de Navegación Activa ---
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-menu a');

if (sections.length > 0 && allNavLinks.length > 0) {
    const navObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', 
        threshold: 0
    };

    const navCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                
                allNavLinks.forEach(link => {
                    link.classList.remove('active-link');
                });

                const activeLinks = document.querySelectorAll(`a[href="#${id}"]`);
                activeLinks.forEach(link => {
                    link.classList.add('active-link');
                });
            }
        });
    };

    const navObserver = new IntersectionObserver(navCallback, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });
} else {
     console.error("Error: No se encontraron secciones o enlaces de navegación para el observer.");
}