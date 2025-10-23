// script.js (V11 - Con Animación de Títulos "Scramble")

document.addEventListener('DOMContentLoaded', () => {

    console.log("Portafolio Oscar Olarte V11 cargado (Animación de Títulos).");

    // --- 1. Animación de la Barra de Navegación ---
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { 
            nav.classList.add('navbar-scrolled');
        } else {
            nav.classList.remove('navbar-scrolled');
        }
    });

    // --- 2. Animación de Entrada del "Hero" ---
    const heroElements = document.querySelectorAll('.hero-content > .fade-in');
    heroElements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });

    // --- 3. NUEVA FUNCIÓN: Animación de Títulos "Scramble" ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ*!#%&_";
    
    const scrambleAnimation = (element) => {
        // Almacena el texto original si aún no lo ha hecho
        if (!element.dataset.originalText) {
            element.dataset.originalText = element.textContent;
        }
        
        const originalText = element.dataset.originalText;
        let iteration = 0;
        
        // Limpia cualquier animación anterior en este elemento
        if (element.dataset.intervalId) {
            clearInterval(parseInt(element.dataset.intervalId));
        }

        const intervalId = setInterval(() => {
            element.textContent = originalText.split("")
                .map((letter, index) => {
                    // Si el índice ya pasó, muestra la letra original
                    if(index < iteration) {
                        return originalText[index];
                    }
                    // Si no, muestra un símbolo aleatorio
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            // Si hemos "descifrado" todo el texto, detén la animación
            if(iteration >= originalText.length){
                clearInterval(intervalId);
                element.dataset.intervalId = null; // Limpia el ID
            }
            
            // Avanza la "descifración" (1/3 de letra por frame)
            iteration += originalText.length / 45; // Ajusta este divisor para la velocidad
        }, 30); // Velocidad del frame

        element.dataset.intervalId = intervalId.toString(); // Almacena el ID del intervalo
    };


    // --- 4. Animación de "Scroll Reveal" (MODIFICADO V11) ---
    // Este observer ahora maneja DOS tipos de animación
    
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Inicia cuando el 10% del elemento es visible
    };
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // SI es un título, ejecuta la animación "scramble"
                if (entry.target.classList.contains('reveal-title')) {
                    scrambleAnimation(entry.target);
                } 
                // SI es una tarjeta, ejecuta la animación "fade-in-up"
                else {
                    entry.target.classList.add('visible');
                }
            } else {
                // Si ya no es visible, resetea la animación para que pueda repetirse
                if (entry.target.classList.contains('reveal-title')) {
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
    
    // Observa AMBOS tipos de elementos
    const elementsToReveal = document.querySelectorAll('.reveal-card, .reveal-title');
    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 5. Lógica del Menú Móvil ---
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navClose = document.getElementById('mobile-nav-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

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

    // --- 6. Lógica del Modal ---
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    const projectButtons = document.querySelectorAll('.btn-project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTags = document.getElementById('modal-tags');
    const modalGithubLink = document.getElementById('modal-github-link');

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

    // --- 7. Lógica de Navegación Activa ---
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-menu a');
    
    const navObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Activa cuando la sección está en el medio
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

});