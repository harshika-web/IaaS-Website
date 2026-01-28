/* ============================================
   ANIMATED STATISTICS COUNTERS
   ============================================ */

/**
 * Animate counter from 0 to target value
 * @param {HTMLElement} element - Counter element
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 * @param {string} suffix - Optional suffix (e.g., '%', '+', 'M')
 */
function animateCounter(element, target, duration = 2000, suffix = '') {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        // Format number based on size
        let displayValue;
        if (target >= 1000000) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (target >= 1000) {
            displayValue = (current / 1000).toFixed(1) + 'K';
        } else {
            displayValue = Math.floor(current);
        }

        element.textContent = displayValue + suffix;
    }, 16);
}

/**
 * Initialize counter animations when visible
 */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');

                const target = parseFloat(entry.target.getAttribute('data-target'));
                const suffix = entry.target.getAttribute('data-suffix') || '';

                animateCounter(entry.target, target, 2000, suffix);

                // Unobserve after counting
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Initialize counters when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCounters();
});

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Easing function for smooth animation
 * @param {number} t - Time
 * @returns {number} Eased value
 */
function easeOutQuad(t) {
    return t * (2 - t);
}

/**
 * Advanced counter with easing
 * @param {HTMLElement} element - Counter element
 * @param {number} target - Target number
 * @param {number} duration - Duration in ms
 */
function animateCounterWithEasing(element, target, duration = 2000) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuad(progress);
        const current = Math.floor(easedProgress * target);

        element.textContent = formatNumber(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatNumber(target);
        }
    }

    requestAnimationFrame(update);
}
