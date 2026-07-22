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
