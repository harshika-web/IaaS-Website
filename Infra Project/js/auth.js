/**
 * Cloud Nexus Authentication Logic
 * Handles modal visibility and form switching
 */

document.addEventListener('DOMContentLoaded', () => {
    const authOverlay = document.getElementById('auth-overlay');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const closeBtn = document.querySelector('.auth-close');
    const loginTriggers = document.querySelectorAll('.btn-login, #trigger-login');
    const registerTriggers = document.querySelectorAll('.btn-register, #trigger-register');

    // Function to open modal
    const openModal = (view = 'login') => {
        authOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        switchTab(view);
    };

    // Function to close modal
    const closeModal = () => {
        authOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };

    // Function to switch tabs
    const switchTab = (view) => {
        authTabs.forEach(tab => {
            if (tab.dataset.view === view) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        authForms.forEach(form => {
            if (form.id === `${view}-form`) {
                form.classList.add('active');
            } else {
                form.classList.remove('active');
            }
        });
    };

    // Event Listeners for Open
    loginTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('login');
        });
    });

    registerTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('register');
        });
    });

    // Event Listener for Close
    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    authOverlay.addEventListener('click', (e) => {
        if (e.target === authOverlay) closeModal();
    });

    // Tab Switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.view);
        });
    });

    // Form Submissions
    authForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.auth-submit');
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';

            // Simulate API call
            setTimeout(() => {
                alert(`${form.id === 'login-form' ? 'Login' : 'Registration'} successful! (Demo Only)`);
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                closeModal();
            }, 1500);
        });
    });
});
