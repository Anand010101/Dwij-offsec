/* ═══════════════════════════════════════════════════════════════
   DWIJ OFFENSIVE SECURITY — script.js
   Clean, reviewed, no dead code
═══════════════════════════════════════════════════════════════ */
'use strict';

/* ── ANNOUNCEMENT BAR ───────────────────────────────────────── */
const annBar   = document.getElementById('annBar');
const annClose = document.getElementById('annClose');

if (annBar && annClose) {
  annClose.addEventListener('click', () => {
    annBar.style.overflow = 'hidden';
    annBar.style.transition = 'max-height .35s ease, opacity .35s ease, padding .35s ease';
    annBar.style.maxHeight = annBar.offsetHeight + 'px';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        annBar.style.maxHeight = '0';
        annBar.style.opacity = '0';
        annBar.style.padding = '0';
      });
    });
    setTimeout(() => {
      annBar.style.display = 'none';
    }, 380);
  });
}

/* ── NAVBAR ─────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 10);
  lastScroll = y;
}, { passive: true });

/* ── MOBILE NAV ─────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

function closeNav() {
  navToggle.classList.remove('open');
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  const opening = !navMenu.classList.contains('open');
  navToggle.classList.toggle('open', opening);
  navMenu.classList.toggle('open', opening);
  navToggle.setAttribute('aria-expanded', String(opening));
  document.body.style.overflow = opening ? 'hidden' : '';
});

navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

document.addEventListener('click', e => {
  if (navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)) {
    closeNav();
  }
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) closeNav();
});

/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 72; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── ACTIVE NAV LINK ─────────────────────────────────────────── */
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks  = document.querySelectorAll('.nav-link');

const activeLinkObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { rootMargin: '-35% 0px -58% 0px' });

sections.forEach(s => activeLinkObserver.observe(s));

/* ── GENERIC FADE-UP ANIMATIONS ────────────────────────────── */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

[
  '.svc-card', '.risk-card', '.testi',
  '.pstat', '.why-card', '.why-featured',
  '.step-card', '.section-header',
  '.risk-vs', '.svc-bottom-cta',
  '.hero-copy', '.hero-card',
  '.why-left', '.report-mock',
  '.contact-info', '.form-card',
  '.urgency-inner',
].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade-up', `d${Math.min((i % 6) + 1, 6)}`);
    fadeObserver.observe(el);
  });
});

/* ── PROCESS TIMELINE STAGGER ───────────────────────────────── */
const timelineEl = document.querySelector('.timeline');
if (timelineEl) {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.tl-item').forEach((item, i) => {
          setTimeout(() => item.classList.add('show'), i * 120);
        });
      }
    });
  }, { threshold: 0.1 }).observe(timelineEl);
}

/* ── DELIVERABLES LIST STAGGER ──────────────────────────────── */
const delListEl = document.querySelector('.del-list');
if (delListEl) {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.del-item').forEach((item, i) => {
          setTimeout(() => item.classList.add('show'), i * 100);
        });
      }
    });
  }, { threshold: 0.1 }).observe(delListEl);
}

/* ── CONTACT FORM ────────────────────────────────────────────── */
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
const submitB = document.getElementById('submitBtn');

if (form) {
  // Clear individual error state on input
  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
    el.addEventListener('change', () => el.classList.remove('error'));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameEl    = document.getElementById('f-name');
    const emailEl   = document.getElementById('f-email');
    const messageEl = document.getElementById('f-msg');

    const name    = nameEl.value.trim();
    const email   = emailEl.value.trim();
    const message = messageEl.value.trim();

    // Validate
    let valid = true;
    if (!name)    { nameEl.classList.add('error');    valid = false; }
    if (!email)   { emailEl.classList.add('error');   valid = false; }
    if (!message) { messageEl.classList.add('error'); valid = false; }

    if (!valid) {
      shakeForm();
      // Focus first errored field
      form.querySelector('.error')?.focus();
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      emailEl.classList.add('error');
      emailEl.focus();
      shakeForm();
      return;
    }

    // Loading state
    submitB.disabled = true;
    submitB.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" style="animation:spin .8s linear infinite" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" stroke-linecap="round"/>
      </svg>
      Sending…
    `;

    // Simulate async form submission
    // Replace with Formspree, EmailJS, or any backend endpoint
    setTimeout(() => {
      // Reset form
      form.reset();
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      // Show success
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Reset button
      submitB.disabled = false;
      submitB.innerHTML = `
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M10 1 3 4.5v5C3 13 6.1 16.4 10 17.3c3.9-.9 7-4.3 7-7.8V4.5L10 1z"/>
          <path d="m7 10 2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Send Message — Get Free Consultation
      `;

      // Auto-hide success after 8s
      setTimeout(() => success.classList.remove('show'), 8000);
    }, 1400);
  });
}

function shakeForm() {
  const card = document.querySelector('.form-card');
  if (!card) return;
  card.style.animation = 'none';
  void card.offsetHeight; // force reflow
  card.style.animation = 'formShake .4s ease';
}

/* ── INJECT KEYFRAMES ────────────────────────────────────────── */
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes formShake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-7px); }
    40%     { transform: translateX(7px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
`;
document.head.appendChild(styleTag);
