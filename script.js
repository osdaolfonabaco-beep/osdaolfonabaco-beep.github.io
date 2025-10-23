// script.js (V7 - Versión Final y Corregida)

document.addEventListener('DOMContentLoaded', () => {

    console.log("Portafolio Oscar Olarte V7 cargado (con Modales y Triggers).");

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
    // Este es el código que hace que las animaciones "stagger" y "reveal" funcionen.
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Inicia cuando el 10% del elemento es visible
    };
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // El elemento es visible, añade la clase 'visible' para activar la animación CSS
                entry.target.classList.add('visible');
                // Deja de observar el elemento para que la animación no se repita
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Crea el observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Selecciona todos los elementos con la clase '.reveal' y los observa
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
    // --- 5. LÓGICA DEL MODAL (Corregida) ---
    // ==================================

    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    const projectButtons = document.querySelectorAll('.btn-project-modal');

    // Elementos del modal que vamos a rellenar
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTags = document.getElementById('modal-tags');
    const modalGithubLink = document.getElementById('modal-github-link');

    // Función para abrir el modal y llenarlo con datos
    const openModal = (projectCard) => {
        // 1. Extraer datos del projectCard usando atributos 'data-'
        const title = projectCard.dataset.title;
        const description = projectCard.dataset.description;
        const githubUrl = projectCard.dataset.githubUrl;
        const tags = JSON.parse(projectCard.dataset.tags); // Parseamos el string JSON

        // 2. Rellenar el contenido del modal
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalGithubLink.href = githubUrl;

        // 3. Limpiar y rellenar los tags
        modalTags.innerHTML = ''; // Limpia tags anteriores
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag;
            modalTags.appendChild(tagElement);
        });

        // 4. Mostrar el modal
        modalOverlay.classList.add('is-active');
    };

    // Función para cerrar el modal
    const closeModal = () => {
        modalOverlay.classList.remove('is-active');
    };

    // Añadir listeners a TODOS los botones "Ver Detalles"
    projectButtons.forEach(button => {
        // Esta es la línea que tenía el error de la 'M'
        button.addEventListener('click', () => {
            const projectCard = button.closest('.project-card');
            openModal(projectCard);
        });
    });

    // Añadir listener al botón de cerrar
    modalCloseBtn.addEventListener('click', closeModal);

    // Añadir listener para cerrar el modal haciendo clic en el fondo
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
});