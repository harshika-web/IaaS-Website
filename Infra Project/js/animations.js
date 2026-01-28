/* ============================================
   SCROLL & INTERACTION ANIMATIONS
   ============================================ */

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavbarScroll();
    initButtonRipples();
});

/**
 * Initialize Intersection Observer for scroll-based animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .hero-fade-in'
    );

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Add blur effect to navbar on scroll
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when scrolled down
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Add ripple effect to buttons
 */
function initButtonRipples() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            // Calculate position
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Smooth scroll to section
 * @param {string} targetId - ID of target section
 */
function scrollToSection(targetId) {
    const target = document.getElementById(targetId);

    if (target) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Parallax effect for hero section
 */
function initParallax() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = hero.querySelectorAll('.floating-element');

        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.2);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Initialize parallax if needed
if (document.querySelector('.hero')) {
    initParallax();
}

/**
 * Add stagger animation to grid items
 */
function staggerAnimation(selector, delay = 100) {
    const items = document.querySelectorAll(selector);

    items.forEach((item, index) => {
        item.style.animationDelay = `${index * delay}ms`;
    });
}

// Apply stagger animations
document.addEventListener('DOMContentLoaded', () => {
    staggerAnimation('.service-card', 100);
    staggerAnimation('.feature-item', 80);
    staggerAnimation('.testimonial-card', 120);
});
