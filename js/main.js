// ============================================================
// LUCE — main.js
// Menú responsive, dropdown en mobile, pill activa según scroll,
// validación básica del formulario de contacto.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- scroll al hash inicial ----
  // scroll-behavior:smooth (base.css) rompe el salto nativo del navegador
  // al cargar una página directamente en una URL con #hash (ej. venir de
  // catalogo.html a index.html#quiero-vender): el navegador se queda
  // arriba de todo y ni siquiera responde a scrollTo/scrollIntoView hasta
  // que se dispara una navegación de fragmento real. Forzamos esa
  // navegación (quitando y volviendo a poner el hash) una vez cargado
  // todo, y corregimos el offset del header sticky.
  if (location.hash) {
    const id = location.hash.slice(1);
    const target = document.getElementById(id);
    if (target) {
      window.addEventListener('load', () => {
        const html = document.documentElement;
        const prevBehavior = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';

        history.replaceState(null, '', location.pathname + location.search);
        location.hash = id;

        const header = document.querySelector('header');
        const offset = header ? header.getBoundingClientRect().height : 0;
        window.scrollBy(0, -(offset + 16));

        html.style.scrollBehavior = prevBehavior;
      });
    }
  }

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

  // ---- reveal progresivo de secciones al hacer scroll ----
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealSections = document.querySelectorAll('.about, .showcase-card, .cat-banner, .contact-split, .vender-form');
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

  // ---- validación básica de formularios (contacto y quiero vender) ----
  document.querySelectorAll('.contact-form form, form.vender-form').forEach(form => {
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

      const radioGroup = form.querySelector('.form-radio-group');
      if (radioGroup) {
        radioGroup.classList.remove('invalid');
        const radios = Array.from(radioGroup.querySelectorAll('input[type="radio"]'));
        const required = radios.some(r => r.hasAttribute('required'));
        const checked = radios.some(r => r.checked);
        if (required && !checked) {
          radioGroup.classList.add('invalid');
          valid = false;
        }
      }

      if (!valid) return;

      // Placeholder: acá va la integración real (fetch a un endpoint,
      // Formspree, Netlify Forms, etc.) cuando el cliente confirme cómo
      // quiere recibir los mensajes.
      if (status) {
        status.textContent = 'Mensaje enviado. Te vamos a contestar a la brevedad.';
        status.classList.add('show');
      }
      form.reset();
    });
  });

});
