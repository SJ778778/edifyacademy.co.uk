// Edify Academy - Main JavaScript
(function() {
  'use strict';

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');

  if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', String(!isExpanded));
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
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        }
      });

      // Toggle current FAQ
      question.setAttribute('aria-expanded', String(!isExpanded));
      if (answer) {
        if (!isExpanded) answer.style.maxHeight = answer.scrollHeight + 'px';
        else answer.style.maxHeight = '0';
      }
    });
  });

  // ✅ IMPORTANT:
  // Removed the old "Contact form handling" block that did:
  // e.preventDefault() + mailto redirect.
  // Formspree needs the browser to POST the form normally.

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href === '#top') return;

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
  const animateElements = document.querySelectorAll(
    '.feature-card, .testimonial-card, .course-card, .instructor-card, .timeline-item, .gallery-item'
  );

  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

})();

// Community registration is separate from academic enquiries.
(function () {
  'use strict';

  const form = document.getElementById('communityRegistrationForm');
  if (!form) return;
  const status = document.getElementById('communityFormStatus');
  const button = form.querySelector('button[type="submit"]');
  const requiredFields = Array.from(form.querySelectorAll('[required]'));
  let submitting = false;

  function validateField(field) {
    field.setCustomValidity('');
    if (!field.value.trim()) {
      field.setCustomValidity('Please complete this field.');
    } else if (field.type === 'tel' && !/^[+()\d\s.\-]{7,30}$/.test(field.value.trim())) {
      field.setCustomValidity('Please enter a valid phone number.');
    } else if (field.type === 'tel' && field.value.replace(/\D/g, '').length < 7) {
      field.setCustomValidity('Please enter a valid phone number.');
    }
    field.setAttribute('aria-invalid', String(!field.validity.valid));
  }

  function showStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
    status.hidden = false;
  }

  requiredFields.forEach(field => {
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('invalid', () => field.setAttribute('aria-invalid', 'true'));
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    requiredFields.forEach(validateField);
    if (!form.reportValidity()) return;

    submitting = true;
    button.disabled = true;
    button.textContent = 'Sending...';
    form.setAttribute('aria-busy', 'true');
    showStatus('Sending your registration...', 'pending');

    try {
      const data = new FormData(form);
      requiredFields.forEach(field => data.set(field.name, field.value.trim()));
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Registration was not accepted.');
      form.reset();
      requiredFields.forEach(field => {
        field.setCustomValidity('');
        field.removeAttribute('aria-invalid');
      });
      showStatus('Thank you. Your registration has been received. We will contact you by phone or email to confirm your place. Your place is not confirmed yet.', 'success');
    } catch (error) {
      showStatus('We could not confirm that your registration was received. Your details are still here. Please try again, or contact admissions@edifyacademy.co.uk or 07776 926664.', 'error');
    } finally {
      submitting = false;
      button.disabled = false;
      button.textContent = 'Register Interest';
      form.removeAttribute('aria-busy');
      status.focus();
    }
  });
})();
