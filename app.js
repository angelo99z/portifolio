'use strict';

// ── NAV SCROLL EFFECT ─────────────────────────────────────────────────────
const navHeader = document.getElementById('nav-header');
window.addEventListener('scroll', () => {
  navHeader.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── MOBILE MENU ───────────────────────────────────────────────────────────
const burger    = document.getElementById('nav-burger');
const navMobile = document.getElementById('nav-mobile');
let mobileOpen  = false;

burger.addEventListener('click', () => {
  mobileOpen = !mobileOpen;
  navMobile.classList.toggle('open', mobileOpen);
  const spans = burger.querySelectorAll('span');
  if (mobileOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

function closeMobile() {
  mobileOpen = false;
  navMobile.classList.remove('open');
  burger.querySelectorAll('span').forEach(s => {
    s.style.transform = ''; s.style.opacity = '';
  });
}

// Close on outside click
document.addEventListener('click', e => {
  if (mobileOpen && !navHeader.contains(e.target)) closeMobile();
});

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings in the same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')]
        .filter(el => !el.classList.contains('visible'));
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── SMOOTH ACTIVE NAV LINKS ───────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--text)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── STAT NUMBER COUNTER ANIMATION ────────────────────────────────────────
function animateCounter(el) {
  const target = el.textContent.replace(/[^0-9]/g, '');
  if (!target) return;
  const suffix = el.textContent.replace(/[0-9]/g, '');
  const duration = 1200;
  const start    = performance.now();
  const from     = 0;
  const to       = parseInt(target, 10);

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
    el.textContent = Math.round(from + ease * (to - from)) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-n').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObserver.observe(statsEl);
