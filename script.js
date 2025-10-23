// script.js (V10 - Con Animaciones Re-activables)

document.addEventListener('DOMContentLoaded', () => {

    console.log("Portafolio Oscar Olarte V10 cargado (Animaciones Reactivables).");

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

    // --- 3. Animación de "Scroll Reveal" (MODIFICADO V10) ---
    // Esta lógica ahora RE-ACTIVA las animaciones cada vez que entran y salen.
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Inicia cuando el 10% del elemento es visible
    };
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // El elemento es visible, añade la clase 'visible' para activar la animación
                entry.target.classList.add('visible');
            } else {
                // El elemento ya no es visible, quita la clase para que la animación pueda repetirse
                entry.target.classList.remove('visible');
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealObserverOptions);
    
    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
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

    // --- 5. Lógica del Modal ---
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

    // --- 6. Lógica de Navegación Activa ---
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

