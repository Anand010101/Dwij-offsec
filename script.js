/* ═══════════════════════════════════════════════════════════════
   DWIJ OFFENSIVE SECURITY — script.js
═══════════════════════════════════════════════════════════════ */
'use strict';

/* ── ANNOUNCEMENT BAR close ─────────────────────────────────── */
const annBar   = document.getElementById('annBar');
const annClose = document.getElementById('annClose');
if (annClose && annBar) {
  annClose.addEventListener('click', () => {
    annBar.style.maxHeight = annBar.scrollHeight + 'px';
    requestAnimationFrame(() => {
      annBar.style.transition = 'max-height .3s ease, opacity .3s ease, padding .3s ease';
      annBar.style.maxHeight  = '0';
      annBar.style.opacity    = '0';
      annBar.style.padding    = '0';
    });
    setTimeout(() => annBar.remove(), 320);
  });
}

/* ── NAVBAR scroll ───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ── MOBILE NAV ─────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const open = navToggle.classList.toggle('open');
  navMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});
document.addEventListener('click', e => {
  if (navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── ACTIVE NAV LINK ─────────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' }).observe.call(
  { observe: () => {} }, document.body
);
// Correct active link observer
const linkObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(s => linkObserver.observe(s));

/* ── GENERIC FADE-UP OBSERVER ────────────────────────────────── */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); fadeObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });

[
  '.svc-card', '.fear-card', '.testi-card', '.ps-item',
  '.why-card', '.section-header', '.risk-intro', '.risk-solution',
  '.proof-bar-inner', '.urgency-inner', '.contact-left',
  '.hero-copy', '.hero-risk-panel', '.report-mockup',
].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade-up', `d${Math.min((i % 6) + 1, 6)}`);
    fadeObs.observe(el);
  });
});

/* ── PROCESS TIMELINE — staggered ───────────────────────────── */
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.pt-item').forEach((el, i) => {
        setTimeout(() => el.classList.add('show'), i * 120);
      });
    }
  });
}, { threshold: 0.1 }).observe(document.querySelector('.process-timeline') || document.body);

/* ── DELIVERABLES LIST — staggered ──────────────────────────── */
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.del-item').forEach((el, i) => {
        setTimeout(() => el.classList.add('show'), i * 100);
      });
    }
  });
}, { threshold: 0.1 }).observe(document.querySelector('.del-list') || document.body);

/* ── CONTACT FORM ────────────────────────────────────────────── */
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
const submitB = document.getElementById('submitBtn');

if (form) {
  // Real-time clear error highlight
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('f-name').value.trim();
    const email   = document.getElementById('f-email').value.trim();
    const message = document.getElementById('f-message').value.trim();

    // Validate required fields
    let valid = true;
    [{ id: 'f-name', val: name }, { id: 'f-email', val: email }, { id: 'f-message', val: message }]
      .forEach(({ id, val }) => {
        if (!val) { document.getElementById(id).style.borderColor = '#dc2626'; valid = false; }
      });
    if (!valid) { shakeForm(); return; }

    // Email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('f-email').style.borderColor = '#dc2626';
      shakeForm(); return;
    }

    // Loading state
    submitB.disabled = true;
    submitB.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .8s linear infinite">
        <path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/>
      </svg>
      Sending...
    `;

    // Simulate submission (replace with real backend/Formspree/EmailJS)
    setTimeout(() => {
      form.querySelectorAll('input, textarea, select').forEach(el => {
        el.value = ''; el.style.borderColor = '';
      });
      success.classList.add('show');
      submitB.disabled = false;
      submitB.innerHTML = `
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Send Message — Get Free Consultation
      `;
      // Scroll to success message
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => success.classList.remove('show'), 8000);
    }, 1400);
  });
}

function shakeForm() {
  const wrap = document.querySelector('.form-wrap');
  if (!wrap) return;
  wrap.style.animation = 'none';
  requestAnimationFrame(() => { wrap.style.animation = 'shake .4s ease'; });
}

/* ── GLOBAL KEYFRAMES ────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes spin  { to { transform: rotate(360deg); } }
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    20%     { transform:translateX(-6px); }
    40%     { transform:translateX(6px); }
    60%     { transform:translateX(-4px); }
    80%     { transform:translateX(4px); }
  }
`;
document.head.appendChild(style);
