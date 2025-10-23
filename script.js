// script.js (Final)

document.addEventListener('DOMContentLoaded', () => {

    console.log("Portafolio Oscar Olarte V3 cargado (con Modales y ScrollSpy).");

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

    // --- 3. Animación de "Scroll Reveal" (IntersectionObserver) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(el => {
        observer.observe(el);
    });

    // --- 4. Lógica del Menú Móvil ---
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

    // ==================================
    // --- 5. LÓGICA DEL MODAL ---
    // ==================================

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

    // ==================================
    // --- 6. Active Nav Link on Scroll (¡NUEVO!) ---
    // ==================================

    // Seleccionamos todas las secciones que tienen un ID
    // Importante: incluimos 'header' para el 'hero'
    const sections = document.querySelectorAll('header[id], section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a');

    const highlightNav = () => {
        let currentSectionId = '';
        const scrollY = window.pageYOffset; // Posición actual del scroll

        // Iteramos sobre las secciones para encontrar la última que esté visible
        sections.forEach(section => {
            // Un offset de 150px para que el enlace se active un poco antes
            const sectionTop = section.offsetTop - 150; 
            if (scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Función para actualizar los enlaces
        const updateLinks = (links) => {
            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSectionId) {
                    link.classList.add('active');
                }
            });
        };

        // Actualizamos ambos menús
        updateLinks(navLinks);
        updateLinks(mobileNavLinks);
    };

    // Añadimos el listener al evento de scroll
    window.addEventListener('scroll', highlightNav);

    // Opcional: Ejecutar una vez al cargar por si la página no carga en el 'top'
    highlightNav();

});