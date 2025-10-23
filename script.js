// ==================================
// --- CLASE: TextScramble (NUEVA) ---
// ==================================
// Esta clase crea el efecto "decoder" o "scramble" de alta eficiencia.
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________'; // Caracteres para el efecto
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}


// ==================================
// --- SCRIPT PRINCIPAL DEL PORTAFOLIO ---
// ==================================
document.addEventListener('DOMContentLoaded', () => {

    console.log("Portafolio Oscar Olarte V9 (Cyber-Sobrio) cargado.");

    // --- 1. Animación de la Barra de Navegación (SIN CAMBIOS) ---
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { 
            nav.classList.add('navbar-scrolled');
        } else {
            nav.classList.remove('navbar-scrolled');
        }
    });

    // --- 2. Animación de Entrada del "Hero" (MODIFICADA) ---
    // Se reemplaza el fade-in simple por el efecto TextScramble
    const h1 = document.querySelector('.hero-content h1');
    const subtitle = document.querySelector('.hero-subtitle');
    const description = document.querySelector('.hero-description');
    const links = document.querySelector('.hero-links');
    
    if (h1 && subtitle && description && links) {
        const fx_h1 = new TextScramble(h1);
        const fx_subtitle = new TextScramble(subtitle);

        // Limpiar el texto inicial para que el scramble funcione desde vacío
        h1.textContent = '';
        subtitle.textContent = '';
        
        // Iniciar la secuencia de animación
        setTimeout(() => {
            fx_h1.setText("Hola, soy Oscar David Olarte Forero");
        }, 500); // Inicia el H1 después de 500ms

        setTimeout(() => {
            fx_subtitle.setText("Especialista en Ciberseguridad e Inteligencia Artificial");
        }, 1200); // Inicia el subtítulo 700ms después del H1

        // Activa el fade-in de la descripción y los botones (controlado por CSS)
        setTimeout(() => {
            description.style.opacity = '1';
            description.style.transform = 'translateY(0)';
            links.style.opacity = '1';
            links.style.transform = 'translateY(0)';
        }, 1800);
    }


    // --- 3. Animación de "Scroll Reveal" (SIN CAMBIOS) ---
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealObserverOptions);
    
    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. Lógica del Menú Móvil (SIN CAMBIOS) ---
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const navClose = document.getElementById('mobile-nav-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (navToggle && mobileNav && navClose && mobileLinks.length > 0) {
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
    }

    // --- 5. Lógica del Modal (SIN CAMBIOS) ---
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
    
    if (modalCloseBtn && modalOverlay) {
        modalCloseBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }


    // --- 6. LÓGICA DE NAVEGACIÓN ACTIVA (SIN CAMBIOS) ---
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-menu a');
    
    if (sections.length > 0 && allNavLinks.length > 0) {
        const navObserverOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // Activa cuando la sección está en el medio de la pantalla
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
    }

});