/* ═══════════════════════════════════════════════════════════════
   DWIJ OFFENSIVE SECURITY — script.js
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── NAVBAR SCROLL ───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── HAMBURGER MENU ─────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── INTERSECTION OBSERVER — fade-in ────────────────────────── */
const fadeObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  }),
  { threshold: 0.12 }
);

// Apply fade-in to cards and sections
const fadeTargets = [
  '.service-card',
  '.why-card',
  '.industry-card',
  '.deliverable-item',
  '.pillar',
  '.about-content',
  '.section-header',
  '.report-mock',
  '.contact-info',
  '.contact-form-wrap',
];
fadeTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade-in');
    if (i < 6) el.classList.add(`fade-in-delay-${i + 1}`);
    fadeObserver.observe(el);
  });
});

/* ── METHODOLOGY STEPS ────────────────────────────────────────── */
const stepObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      const steps = document.querySelectorAll('.method-step');
      steps.forEach((step, i) => {
        setTimeout(() => step.classList.add('visible'), i * 150);
      });
      stepObserver.disconnect();
    }
  }),
  { threshold: 0.1 }
);
const methodSection = document.querySelector('.methodology-flow');
if (methodSection) stepObserver.observe(methodSection);

/* ── ANIMATED COUNTERS ────────────────────────────────────────── */
const counterObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounters();
      counterObserver.disconnect();
    }
  }),
  { threshold: 0.5 }
);
const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObserver.observe(statsEl);

function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

/* ── TERMINAL TYPEWRITER ─────────────────────────────────────── */
const terminalEl = document.getElementById('terminal');

const terminalLines = [
  { type: 'prompt', text: '$ ', cmd: 'nmap -sV target.dwijsec.com' },
  { type: 'output', text: 'Starting Nmap scan...' },
  { type: 'output', text: 'Discovered open port 443/tcp' },
  { type: 'output', text: 'Discovered open port 8080/tcp' },
  { type: 'warn',   text: '[!] Outdated SSL version detected' },
  { type: 'prompt', text: '$ ', cmd: 'gobuster dir -u https://target -w common.txt' },
  { type: 'output', text: 'Found: /admin (Status: 200)' },
  { type: 'output', text: 'Found: /api/v1 (Status: 200)' },
  { type: 'crit',   text: '[VULN] IDOR in /api/v1/users' },
  { type: 'prompt', text: '$ ', cmd: 'sqlmap -u "https://target/search?q=1"' },
  { type: 'warn',   text: '[!] Parameter q is injectable' },
  { type: 'crit',   text: '[CRITICAL] SQL Injection confirmed!' },
  { type: 'ok',     text: '[+] Report generated: report.pdf' },
  { type: 'prompt', text: '$ ', cmd: '' },
];

let lineIndex = 0;
let charIndex  = 0;
let isTyping   = false;

function getLineClass(type) {
  const map = { prompt: 't-prompt', cmd: 't-cmd', output: 't-out', warn: 't-warn', crit: 't-crit', ok: 't-ok' };
  return map[type] || 't-out';
}

function typeLine() {
  if (lineIndex >= terminalLines.length - 1) {
    // last line — show blinking cursor only
    const div = document.createElement('div');
    div.innerHTML = '<span class="t-prompt">$ </span><span class="t-cursor"></span>';
    terminalEl.appendChild(div);
    return;
  }

  const line = terminalLines[lineIndex];

  if (line.type === 'prompt') {
    const div = document.createElement('div');
    div.innerHTML = `<span class="t-prompt">${line.text}</span>`;
    terminalEl.appendChild(div);
    // type the command
    const cmdSpan = document.createElement('span');
    cmdSpan.className = 't-cmd';
    div.appendChild(cmdSpan);
    typeChars(line.cmd, cmdSpan, () => {
      lineIndex++;
      setTimeout(typeLine, 300);
    });
  } else {
    const div = document.createElement('div');
    const cls = getLineClass(line.type);
    div.innerHTML = `<span class="${cls}">${line.text}</span>`;
    terminalEl.appendChild(div);
    terminalEl.scrollTop = terminalEl.scrollHeight;
    lineIndex++;
    setTimeout(typeLine, 120);
  }
}

function typeChars(text, el, onDone) {
  let i = 0;
  function next() {
    if (i < text.length) {
      el.textContent += text[i++];
      terminalEl.scrollTop = terminalEl.scrollHeight;
      setTimeout(next, 40 + Math.random() * 30);
    } else {
      onDone && onDone();
    }
  }
  next();
}

// start terminal after a short delay
setTimeout(typeLine, 800);

/* ── FORM SUBMISSION ─────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email) {
      shakeForm();
      return;
    }

    // Simulate async submission
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Sending...
    `;

    setTimeout(() => {
      contactForm.querySelectorAll('input, textarea, select').forEach(el => el.value = '');
      formSuccess.classList.add('show');
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
        Send Message
      `;
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    }, 1400);
  });
}

function shakeForm() {
  const wrap = document.querySelector('.contact-form-wrap');
  wrap.style.animation = 'shake 0.4s ease-in-out';
  setTimeout(() => wrap.style.animation = '', 500);
}

// add shake keyframe dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .spin { animation: spin 1s linear infinite; }
`;
document.head.appendChild(styleSheet);

/* ── ACTIVE NAV LINK on scroll ──────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link:not(.nav-cta)');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));

/* ── HEX GRID HOVER PULSE ────────────────────────────────────── */
document.querySelectorAll('.hex').forEach((hex, i) => {
  setTimeout(() => {
    hex.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
    setInterval(() => {
      hex.style.borderColor = 'rgba(13, 242, 200, 0.4)';
      hex.querySelector('svg').style.color = 'var(--accent)';
      setTimeout(() => {
        hex.style.borderColor = '';
        hex.querySelector('svg').style.color = '';
      }, 600);
    }, 2000 + i * 400);
  }, i * 200);
});

/* ── GLITCH EFFECT ON LOGO ───────────────────────────────────── */
const logoText = document.querySelector('.logo-text');
if (logoText) {
  setInterval(() => {
    const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const orig   = 'DWIJ';
    let count    = 0;
    const interval = setInterval(() => {
      logoText.textContent = orig
        .split('')
        .map((c, i) => {
          if (i < count) return orig[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      count++;
      if (count > orig.length) {
        logoText.textContent = orig;
        clearInterval(interval);
      }
    }, 60);
  }, 5000);
}
