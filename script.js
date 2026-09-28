document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const updateStickyHeader = () => {
      siteHeader.classList.toggle('is-sticky', window.scrollY > 120);
    };

    window.addEventListener('scroll', updateStickyHeader, { passive: true });
    updateStickyHeader();
  }

  const revealElements = document.querySelectorAll(
    '[data-reveal], .section-header, .feature-item, .service-card, .doctor-card, .check-item, .facility-card, .wellness-card, .gallery-item, .contact-copy, .contact-form, .location-map-card, .about-copy, .about-visual'
  );
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (revealElements.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    document.documentElement.classList.add('motion-ready');
    revealElements.forEach((element) => element.setAttribute('data-reveal', ''));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (navToggle && nav) {
    const closeMobileMenu = () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', (event) => {
      const clickedInsideNav = nav.contains(event.target);
      const clickedToggle = navToggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle && nav.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  const carousel = document.querySelector('.banner-carousel');
  const slides = carousel?.querySelectorAll('.slide') ?? [];
  const dots = carousel?.querySelectorAll('.dot') ?? [];
  const prevBtn = carousel?.querySelector('.carousel-btn.prev');
  const nextBtn = carousel?.querySelector('.carousel-btn.next');
  const toggleBtn = carousel?.querySelector('.carousel-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (carousel && slides.length > 0) {
    let currentIndex = Array.from(slides).findIndex((slide) => slide.classList.contains('active'));
    let autoAdvance = !reducedMotion;
    let interactionPaused = false;
    let slideTimer;

    if (currentIndex < 0) currentIndex = 0;

    const stopAutoAdvance = () => {
      window.clearInterval(slideTimer);
      slideTimer = undefined;
    };

    const syncAutoAdvance = () => {
      stopAutoAdvance();
      if (autoAdvance && !interactionPaused && document.visibilityState === 'visible' && slides.length > 1) {
        slideTimer = window.setInterval(() => showSlide(currentIndex + 1), 6000);
      }
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-pressed', String(autoAdvance));
        toggleBtn.setAttribute('aria-label', autoAdvance ? 'Pause slideshow' : 'Play slideshow');
      }
    };

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const isActive = i === currentIndex;
        slide.classList.toggle('active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      dots.forEach((dot, i) => {
        const isActive = i === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', String(isActive));
      });
    }

    prevBtn?.addEventListener('click', () => showSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => showSlide(currentIndex + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));

    toggleBtn?.addEventListener('click', () => {
      autoAdvance = !autoAdvance;
      if (autoAdvance) interactionPaused = false;
      syncAutoAdvance();
    });
    carousel.addEventListener('mouseenter', () => {
      interactionPaused = true;
      syncAutoAdvance();
    });
    carousel.addEventListener('mouseleave', () => {
      interactionPaused = false;
      syncAutoAdvance();
    });
    carousel.addEventListener('focusin', () => {
      interactionPaused = true;
      syncAutoAdvance();
    });
    carousel.addEventListener('focusout', (event) => {
      if (!carousel.contains(event.relatedTarget)) {
        interactionPaused = false;
        syncAutoAdvance();
      }
    });
    document.addEventListener('visibilitychange', syncAutoAdvance);
    syncAutoAdvance();
  }

  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    const updateScrollProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      scrollTopBtn.style.setProperty('--progress', `${Math.min(progress, 100)}%`);

      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        const original = button.textContent;
        button.textContent = 'Enquiry Sent';
        button.disabled = true;
        setTimeout(() => {
          button.textContent = original;
          button.disabled = false;
          form.reset();
        }, 1800);
      }
    });
  }
});
