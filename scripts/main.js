/**
 * Portfolio Main JavaScript
 * Minimal interactivity - smooth scrolling and subtle effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    initSmoothScroll();

    // Terminal typing effect for hero
    initTypingEffect();

    // Intersection observer for section animations
    initScrollAnimations();
});

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Simple typing effect for hero section
 * Fast and non-blocking - completes in <300ms per line
 */
function initTypingEffect() {
    const heroName = document.querySelector('.hero-name');
    const heroRole = document.querySelector('.hero-role');

    if (!heroName || !heroRole) return;

    // Add cursor blink animation
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '█';
    cursor.style.cssText = `
    animation: blink 1s step-end infinite;
    color: var(--accent-cyan);
  `;

    // Add cursor to the last visible element
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) {
        heroTagline.appendChild(cursor);
    }

    // Add blink keyframes
    if (!document.querySelector('#cursor-blink')) {
        const style = document.createElement('style');
        style.id = 'cursor-blink';
        style.textContent = `
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `;
        document.head.appendChild(style);
    }
}

/**
 * Subtle fade-in animation on scroll
 */
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;

    const sections = document.querySelectorAll('section');

    // Add initial hidden state
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });

    sections.forEach(section => observer.observe(section));
}
