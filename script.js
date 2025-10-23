// script.js (Corregido)

document.addEventListener('DOMContentLoaded', () => {

    console.log("Portafolio Oscar Olarte V3 cargado (con Modales).");

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
    // --- 5. LÓGICA DEL MODAL (CORREGIDA) ---
    // ==================================

    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    const projectButtons = document.querySelectorAll('.btn-project-modal');

    // Elementos del modal que vamos a rellenar
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTags = document.getElementById('modal-tags');
    const modalGithubLink = document.getElementById('modal-github-link');
    // const modalImage = document.getElementById('modal-image'); // (Para el futuro)

    // Función para abrir el modal y llenarlo con datos
    const openModal = (projectCard) => {
        // 1. Extraer datos del projectCard usando atributos 'data-'
        const title = projectCard.dataset.title;
        const description = projectCard.dataset.description;
        const githubUrl = projectCard.dataset.githubUrl;
        // Parseamos el string JSON de los tags
        const tags = JSON.parse(projectCard.dataset.tags);

        // 2. Rellenar el contenido del modal
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalGithubLink.href = githubUrl;
        // (En el futuro, también pondrías la imagen)
        // modalImage.src = projectCard.dataset.imageUrl;

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
        // --- AQUÍ ESTABA EL ERROR ---
        // Corregido de ()M => a () =>
        button.addEventListener('click', () => {
            // 'closest' sube por el DOM hasta encontrar la tarjeta padre
            const projectCard = button.closest('.project-card');
            openModal(projectCard);
        });
    });

    // Añadir listener al botón de cerrar
    modalCloseBtn.addEventListener('click', closeModal);

    // Añadir listener para cerrar el modal haciendo clic en el fondo
    modalOverlay.addEventListener('click', (event) => {
        // Si el clic fue en el overlay (fondo) y no en el contenido
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
});
