/* ============================================================
   SAMUEL AUBRON – PORTFOLIO JS
   ============================================================ */

// ── CUSTOM CURSOR ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

if (cursor && cursorFollower) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function loop() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    cursorFollower.style.left = fx + 'px';
    cursorFollower.style.top  = fy + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.project-card,.skill-category,.tl-card,.hnav-card,.veille-card,.certif-card,input,textarea').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hov'); cursorFollower.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hov'); cursorFollower.classList.remove('hov'); });
  });
}

// ── NAVBAR SCROLL ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
}

// ── ACTIVE NAV LINK ────────────────────────────────────────
(function highlightNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── BURGER MENU ────────────────────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const spans = burger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuOpen = false; mobileMenu.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ── SCROLL REVEAL ──────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal-up').forEach(el => revealObs.observe(el));

window.addEventListener('load', () => {
  document.querySelectorAll('.reveal-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('visible');
  });
});

// ── COUNTER ANIMATION ──────────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(step); else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const aboutCard = document.querySelector('.about-card');
if (aboutCard) {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-num').forEach(n => animateCounter(n, +n.dataset.target));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 }).observe(aboutCard);
}

// ── TIMELINE TABS (stages.html) ────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.timeline').forEach(tl => tl.classList.add('hidden'));
    const target = document.getElementById('tab-' + btn.dataset.tab);
    if (target) {
      target.classList.remove('hidden');
      target.querySelectorAll('.reveal-up').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), 60);
      });
    }
  });
});
document.querySelectorAll('.timeline:not(.hidden) .reveal-up').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 120);
});

// ── CONTACT FORM (Formspree) ───────────────────────────────
const FORMSPREE_ID = 'xlgzayqj';

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn     = document.getElementById('submitBtn');
    const success = document.getElementById('formSuccess');
    const error   = document.getElementById('formError');

    btn.disabled    = true;
    btn.textContent = 'Envoi en cours…';
    success.classList.add('hidden');
    error.classList.add('hidden');

    try {
      const res  = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' }
      });
      const data = await res.json();

      if (res.ok) {
        success.classList.remove('hidden');
        form.reset();
        setTimeout(() => success.classList.add('hidden'), 6000);
      } else {
        error.textContent = data.errors?.[0]?.message || 'Une erreur est survenue.';
        error.classList.remove('hidden');
      }
    } catch {
      error.textContent = 'Impossible d\'envoyer le message. Contactez-moi directement par email.';
      error.classList.remove('hidden');
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Envoyer le message';
    }
  });
}

// ── CERTIF CAROUSEL ARROWS ────────────────────────────────
const certifCarousel = document.getElementById('certifCarousel');
const certifPrev     = document.getElementById('certifPrev');
const certifNext     = document.getElementById('certifNext');
if (certifCarousel && certifPrev && certifNext) {
  const scrollBy = 280;
  const updateArrows = () => {
    certifPrev.disabled = certifCarousel.scrollLeft <= 0;
    certifNext.disabled = certifCarousel.scrollLeft + certifCarousel.clientWidth >= certifCarousel.scrollWidth - 2;
  };
  certifPrev.addEventListener('click', () => { certifCarousel.scrollLeft -= scrollBy; });
  certifNext.addEventListener('click', () => { certifCarousel.scrollLeft += scrollBy; });
  certifCarousel.addEventListener('scroll', updateArrows);
  updateArrows();
}

// ── CANVAS PARTICLES (home only) ───────────────────────────
const canvas = document.getElementById('bgCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const N = 80;
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize(); window.addEventListener('resize', () => { resize(); init(); });
  class P {
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 1.4 + .3;
      this.vx = (Math.random() - .5) * .4;
      this.vy = (Math.random() - .5) * .4;
      this.o = Math.random() * .55 + .1;
      this.c = Math.random() > .5 ? '108,99,255' : '67,230,184';
    }
    constructor() { this.reset(); }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${this.c},${this.o})`; ctx.fill();
    }
  }
  function init() { particles = Array.from({length:N}, () => new P()); }
  function drawLines() {
    for (let i = 0; i < particles.length; i++)
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${.06*(1-d/120)})`; ctx.lineWidth = .5; ctx.stroke();
        }
      }
  }
  init();
  (function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines(); requestAnimationFrame(loop);
  })();
}
