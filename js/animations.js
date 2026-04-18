// ─── GSAP Animations ──────────────────────────────────────────────────────────

(function () {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Hero entrance (called by loader.js after load completes) ──────────────
  window.animateHero = function () {
    if (reducedMotion) {
      // Just make everything visible
      document.querySelectorAll('.word-inner').forEach(el => el.style.transform = 'translateY(0)');
      document.querySelector('.hero-eyebrow').style.opacity = '1';
      document.querySelector('.hero-eyebrow').style.transform = 'translateY(0)';
      document.querySelector('.hero-sub').style.opacity = '1';
      document.querySelector('.hero-sub').style.transform = 'translateY(0)';
      document.querySelector('.hero-ctas').style.opacity = '1';
      document.querySelector('.hero-ctas').style.transform = 'translateY(0)';
      document.querySelector('.scroll-indicator').style.opacity = '1';
      return;
    }

    const tl = gsap.timeline();

    tl.to('.hero-eyebrow', {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
    }, 0)
    .to('.word-inner', {
      y: '0%', duration: 1, ease: 'power4.out',
      stagger: 0.1
    }, 0.2)
    .to('.hero-sub', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    }, 0.7)
    .to('.hero-ctas', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    }, 0.9)
    .to('.scroll-indicator', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    }, 1.3);
  };

  // ── Scroll-triggered section reveals ──────────────────────────────────────
  if (!reducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 60, duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      });
    });

    // ── Stat count-up ──────────────────────────────────────────────────────
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isDecimal = String(target).includes('.');

      ScrollTrigger.create({
        trigger: el, start: 'top 80%', once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target, duration: 1.5, ease: 'power2.out',
            onUpdate: function () {
              const v = this.targets()[0].val;
              el.textContent = isDecimal ? v.toFixed(1) + suffix : Math.round(v) + suffix;
            }
          });
        }
      });
    });

    // ── Achievement cards stagger ──────────────────────────────────────────
    gsap.from('.achievement-card', {
      opacity: 0, y: 50, duration: 0.8, stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.achievements-grid', start: 'top 80%', once: true }
    });

    // ── Skills cascade ─────────────────────────────────────────────────────
    gsap.from('.skill-pill', {
      opacity: 0, scale: 0.7, duration: 0.5, stagger: 0.03,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '.skills-grid', start: 'top 80%', once: true }
    });

    // ── Timeline line draw ─────────────────────────────────────────────────
    gsap.from('.timeline-line', {
      scaleY: 0,
      transformOrigin: 'top center',
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1
      }
    });

    // ── Timeline card alternating slide ───────────────────────────────────
    document.querySelectorAll('.timeline-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, x: i % 2 === 0 ? -60 : 60, duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 82%', once: true }
      });
    });

    // ── Nav shrink on scroll ───────────────────────────────────────────────
    const nav = document.getElementById('navbar');
    if (nav) {
      ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
          nav.classList.toggle('nav-scrolled', self.progress > 0);
        }
      });
    }
  }

  // ── Contact form → Telegram ────────────────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    const TG_TOKEN   = '8748998672:AAFpYV9XINFkoRL3uIXm1ngznvjzMSfXvuQ';
    const TG_CHAT_ID = '7658502739';
    const TG_URL     = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();
      const btn     = form.querySelector('.contact-submit');

      btn.textContent = 'Sending…';
      btn.disabled = true;

      const text =
        `📬 <b>New message from Portfolio</b>\n\n` +
        `👤 <b>Name:</b> ${name}\n` +
        `📧 <b>Email:</b> ${email}\n\n` +
        `💬 <b>Message:</b>\n${message}`;

      try {
        const res = await fetch(TG_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: 'HTML' }),
        });

        if (!res.ok) throw new Error('API error');

        btn.textContent = 'Sent ✓';
        btn.style.background = 'linear-gradient(135deg, #ffffff, #888888)';
        form.reset();
        setTimeout(() => {
          btn.textContent = 'Send Message →';
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);

      } catch {
        btn.textContent = 'Failed — try email';
        btn.style.background = 'rgba(255,80,80,0.3)';
        setTimeout(() => {
          btn.textContent = 'Send Message →';
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }
    });
  }

  // ── Project drag-to-scroll ────────────────────────────────────────────────
  const track = document.getElementById('projectsTrack');
  if (track) {
    let isDown = false;
    let startX, scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('grabbing');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('grabbing');
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('grabbing');
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  // ── Mobile nav ────────────────────────────────────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileOverlay = document.getElementById('navMobileOverlay');

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileOverlay.classList.toggle('open', isOpen);
      mobileOverlay.setAttribute('aria-hidden', !isOpen);
    });

    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        mobileOverlay.classList.remove('open');
        mobileOverlay.setAttribute('aria-hidden', true);
      });
    });
  }
})();
