// Edify Academy - Main JavaScript

(function() {
    'use strict';

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (mobileMenuToggle && navList) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    const otherAnswer = q.nextElementSibling;
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                }
            });
            
            // Toggle current FAQ
            question.setAttribute('aria-expanded', !isExpanded);
            if (answer) {
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const formError = document.getElementById('formError');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Clear previous errors
            if (formError) {
                formError.style.display = 'none';
                formError.textContent = '';
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const required = contactForm.querySelectorAll('[required]');
            const missing = [];
            
            required.forEach(field => {
                const value = (field.value || '').trim();
                if (value === '') {
                    const label = field.previousElementSibling;
                    if (label && label.tagName === 'LABEL') {
                        missing.push(label.textContent.replace('*', '').trim());
                    }
                }
            });
            
            // Email validation
            const email = contactForm.querySelector('input[type="email"]');
            if (email && email.value.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email.value.trim())) {
                    missing.push('Email (enter a valid email address)');
                }
            }
            
            // Show errors if any
            if (missing.length > 0 && formError) {
                formError.innerHTML = '<strong>Please complete the following required fields:</strong><ul style="margin-top: 8px; padding-left: 20px;">' +
                    missing.map(field => '<li>' + field + '</li>').join('') +
                    '</ul>';
                formError.style.display = 'block';
                formError.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
            
            // Prepare email data
            const emailBody = `Name: ${data.name || ''}\nEmail: ${data.email || ''}\nPhone: ${data.phone || ''}\nSubject: ${data.subject || ''}\nMessage: ${data.message || ''}`;
            const emailSubject = encodeURIComponent('New Website Enquiry - Edify Academy');
            const emailBodyEncoded = encodeURIComponent(emailBody);
            
            // Open email client with pre-filled data
            window.location.href = `mailto:admissions@edifyacademy.co.uk?subject=${emailSubject}&body=${emailBodyEncoded}`;
            
            // Show success message
            setTimeout(() => {
                alert('Thank you for your message! Your email client should open. If not, please email us directly at admissions@edifyacademy.co.uk');
            }, 500);
            
            contactForm.reset();
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#top') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .course-card, .instructor-card, .timeline-item, .gallery-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

})();
