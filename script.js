/* ═══════════════════════════════════════════════════════════════
   DWIJ OFFENSIVE SECURITY — script.js
═══════════════════════════════════════════════════════════════ */
'use strict';

/* ── NAVBAR ─────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── MOBILE NAV ─────────────────────────────────────────────── */
const toggle  = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  navMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});
document.addEventListener('click', e => {
  if (navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) && !toggle.contains(e.target)) {
    toggle.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 75, behavior: 'smooth' });
  });
});

/* ── ACTIVE NAV LINK ─────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe.call(
  { observe: s => sections.forEach(s2 => { if(s2 === s) return; }) },
  document.body
);
// simpler active link approach
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* ── SCROLL ANIMATIONS ───────────────────────────────────────── */
const animObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      animObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

// Attach fade-up to card groups
['.svc-card', '.wu-card', '.pain-card', '.av-item'].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade-up', `d${Math.min(i % 6 + 1, 6)}`);
    animObserver.observe(el);
  });
});

// Section headers
document.querySelectorAll('.section-header, .about-text-col, .about-visual-col, .contact-left').forEach(el => {
  el.classList.add('fade-up');
  animObserver.observe(el);
});

/* ── PROCESS STEPS — staggered ───────────────────────────────── */
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.ps-item').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    }
  });
}, { threshold: 0.1 }).observe(document.querySelector('.process-steps') || document.body);

/* ── DELIVERABLES LIST ────────────────────────────────────────── */
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.del-item').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 110);
      });
    }
  });
}, { threshold: 0.1 }).observe(document.querySelector('.del-list') || document.body);

/* ── CONTACT FORM ────────────────────────────────────────────── */
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
const submitB = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const message = document.getElementById('fmessage').value.trim();

    // validate
    let valid = true;
    [
      { id: 'fname',    val: name },
      { id: 'femail',   val: email },
      { id: 'fmessage', val: message },
    ].forEach(({ id, val }) => {
      const el = document.getElementById(id);
      if (!val) { el.style.borderColor = '#dc2626'; valid = false; }
    });
    if (!valid) { shakeCard(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('femail').style.borderColor = '#dc2626';
      shakeCard(); return;
    }

    // loading
    submitB.disabled = true;
    submitB.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .8s linear infinite">
        <path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/>
      </svg>
      Sending...
    `;

    setTimeout(() => {
      form.querySelectorAll('input,textarea,select').forEach(el => {
        el.value = ''; el.style.borderColor = '';
      });
      success.classList.add('show');
      submitB.disabled = false;
      submitB.innerHTML = `Send Message <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10h12M10 4l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      setTimeout(() => success.classList.remove('show'), 8000);
    }, 1400);
  });

  form.querySelectorAll('input,textarea').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });
}

function shakeCard() {
  const card = document.querySelector('.form-card');
  if (!card) return;
  card.style.animation = 'none';
  requestAnimationFrame(() => { card.style.animation = 'shake .4s ease'; });
}

/* ── GLOBAL KEYFRAMES ────────────────────────────────────────── */
const s = document.createElement('style');
s.textContent = `
  @keyframes spin  { to { transform: rotate(360deg); } }
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    20%     { transform:translateX(-6px); }
    40%     { transform:translateX(6px); }
    60%     { transform:translateX(-4px); }
    80%     { transform:translateX(4px); }
  }
`;
document.head.appendChild(s);
