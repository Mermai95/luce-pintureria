// ============================================================
// LUCE — main.js
// Menú responsive, dropdown en mobile, pill activa según scroll,
// validación básica del formulario de contacto.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- menú mobile ----
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navLinks.classList.contains('open');
      burger.setAttribute('aria-expanded', expanded);
    });
  }

  // ---- dropdown tap en mobile (además del hover en desktop) ----
  document.querySelectorAll('.dropdown-wrap > a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // ---- pill activa en catálogo según sección visible ----
  const sections = document.querySelectorAll('[data-category]');
  const pills = document.querySelectorAll('.pill[data-target]');
  if (sections.length && pills.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-category');
          pills.forEach(p => p.classList.toggle('active', p.dataset.target === id));
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  // ---- lightbox de galería de producto (catálogo) ----
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImage = lightbox.querySelector('.lightbox-image');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');
    const lbDots = lightbox.querySelector('.lightbox-dots');
    let images = [];
    let current = 0;
    let lastFocused = null;

    function renderDots() {
      lbDots.innerHTML = '';
      if (images.length < 2) return;
      images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'lightbox-dot';
        dot.setAttribute('aria-label', `Ver foto ${i + 1}`);
        if (i === current) dot.classList.add('active');
        dot.addEventListener('click', () => show(i));
        lbDots.appendChild(dot);
      });
    }

    function show(index) {
      current = (index + images.length) % images.length;
      const target = images[current];
      if (lbImage.src) {
        lbImage.classList.add('is-swapping');
        window.setTimeout(() => {
          lbImage.src = target.src;
          lbImage.alt = target.alt;
          lbImage.classList.remove('is-swapping');
        }, 150);
      } else {
        lbImage.src = target.src;
        lbImage.alt = target.alt;
      }
      renderDots();
    }

    function openLightbox(imgs) {
      images = imgs;
      const multi = images.length > 1;
      lbPrev.hidden = !multi;
      lbNext.hidden = !multi;
      show(0);
      lastFocused = document.activeElement;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.lightbox-close').focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
      window.setTimeout(() => { lbImage.src = ''; }, 150);
    }

    document.querySelectorAll('[data-gallery]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        let paths = [];
        try { paths = JSON.parse(trigger.getAttribute('data-gallery')); } catch (e) { paths = []; }
        if (!paths.length) return;
        const name = trigger.getAttribute('data-gallery-name') || '';
        const imgs = paths.map((src, i) => ({ src, alt: paths.length > 1 ? `${name} — foto ${i + 1}` : name }));
        openLightbox(imgs);
      });
    });

    lightbox.querySelectorAll('[data-lightbox-close]').forEach(el => el.addEventListener('click', closeLightbox));
    lbPrev.addEventListener('click', () => show(current - 1));
    lbNext.addEventListener('click', () => show(current + 1));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  // ---- reveal progresivo de secciones al hacer scroll ----
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealSections = document.querySelectorAll('.about, .showcase-card, .cat-banner, .contact-split');
    const cards = document.querySelectorAll('.showcase-card');

    revealSections.forEach(el => el.classList.add('reveal'));
    cards.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i, 8) * 60}ms`; });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealSections.forEach(el => revealObserver.observe(el));
  }

  // ---- validación básica del formulario de contacto ----
  const form = document.querySelector('.contact-form form');
  if (form) {
    const status = form.querySelector('.form-status');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('.field').forEach(field => {
        const input = field.querySelector('input, textarea');
        field.classList.remove('invalid');

        if (input.hasAttribute('required') && !input.value.trim()) {
          field.classList.add('invalid');
          valid = false;
        }
        if (input.type === 'email' && input.value.trim()) {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!re.test(input.value.trim())) {
            field.classList.add('invalid');
            valid = false;
          }
        }
      });

      if (!valid) return;

      // Placeholder: acá va la integración real (fetch a un endpoint,
      // Formspree, Netlify Forms, etc.) cuando el cliente confirme cómo
      // quiere recibir los mensajes.
      status.textContent = 'Mensaje enviado. Te vamos a contestar a la brevedad.';
      status.classList.add('show');
      form.reset();
    });
  }

});
