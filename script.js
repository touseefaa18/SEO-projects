/**
 * Speed Limit Showroom - Luxury Racing Car Showroom
 * Script: script.js
 * Handles navigation, mobile menu toggle, scroll-reveal animations via IntersectionObserver,
 * form validation, interactive vehicle pre-selection, and smooth back-to-top scrolling.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Sticky Navbar & Scroll Effects
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar shrink/background effect on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Back to top scroll handler
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       2. Mobile Navigation Menu Toggle
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, #mobileCtaBtn');

    function toggleMobileMenu() {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });
    }

    /* ==========================================================================
       3. Intersection Observer for Scroll-Reveal Animations
       ========================================================================== */
    const revealElements = document.querySelectorAll('.car-card, .founder-card');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const revealCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index if multiple cards
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, (index % 3) * 120);

                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       4. Interactive Vehicle Pre-selection from Collection to Contact Form
       ========================================================================== */
    const carSelectLinks = document.querySelectorAll('[data-car-select]');
    const preferredVehicleSelect = document.getElementById('preferredVehicle');

    carSelectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const carName = link.getAttribute('data-car-select');
            if (preferredVehicleSelect && carName) {
                for (let i = 0; i < preferredVehicleSelect.options.length; i++) {
                    if (preferredVehicleSelect.options[i].value === carName) {
                        preferredVehicleSelect.selectedIndex = i;
                        break;
                    }
                }
            }
        });
    });

    /* ==========================================================================
       5. Contact Form Validation and Submission Handling
       ========================================================================== */
    const enquiryForm = document.getElementById('enquiryForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccessMessage = document.getElementById('formSuccessMessage');
    const resetFormBtn = document.getElementById('resetFormBtn');

    // Input fields
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const vehicleSelect = document.getElementById('preferredVehicle');

    // Helper validation functions
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function isValidPhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(String(phone));
    }

    function setError(inputElement, hasError) {
        if (hasError) {
            inputElement.classList.add('error');
        } else {
            inputElement.classList.remove('error');
        }
    }

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            // Validate Full Name
            if (!fullNameInput.value.trim()) {
                setError(fullNameInput, true);
                isValid = false;
            } else {
                setError(fullNameInput, false);
            }

            // Validate Email
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                setError(emailInput, true);
                isValid = false;
            } else {
                setError(emailInput, false);
            }

            // Validate Phone
            if (!phoneInput.value.trim() || !isValidPhone(phoneInput.value)) {
                setError(phoneInput, true);
                isValid = false;
            } else {
                setError(phoneInput, false);
            }

            // Validate Vehicle Selection
            if (!vehicleSelect.value) {
                setError(vehicleSelect, true);
                isValid = false;
            } else {
                setError(vehicleSelect, false);
            }

            if (!isValid) {
                return;
            }

            // Show Loading State on Button
            const btnText = submitBtn.querySelector('.btn-text');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');

            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-flex';
            submitBtn.disabled = true;

            // Simulate secure backend API submission delay (1.5 seconds)
            setTimeout(() => {
                // Reset button state
                btnText.style.display = 'inline-block';
                btnSpinner.style.display = 'none';
                submitBtn.disabled = false;

                // Hide form and show success message
                enquiryForm.style.display = 'none';
                formSuccessMessage.style.display = 'block';

                // Reset form values for future
                enquiryForm.reset();
            }, 1500);
        });

        // Real-time error clearing on input change
        [fullNameInput, emailInput, phoneInput, vehicleSelect].forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    setError(input, false);
                }
            });
            input.addEventListener('change', () => {
                if (input.classList.contains('error')) {
                    setError(input, false);
                }
            });
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            formSuccessMessage.style.display = 'none';
            enquiryForm.style.display = 'block';
        });
    }

    /* ==========================================================================
       6. Active Navigation Link Highlighting on Scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href*="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);
});
