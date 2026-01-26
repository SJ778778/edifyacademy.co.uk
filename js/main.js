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
