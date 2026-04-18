// ─── Motion (Framer) — Spring hover & scroll-linked effects ───────────────────

(function () {
  if (typeof Motion === 'undefined') return;

  const { animate, scroll, inView } = Motion;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  // ── Project card spring hover ──────────────────────────────────────────────
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      animate(card, { scale: 1.03, y: -6 }, { type: 'spring', stiffness: 300, damping: 20 });
    });
    card.addEventListener('mouseleave', () => {
      animate(card, { scale: 1, y: 0 }, { type: 'spring', stiffness: 260, damping: 24 });
    });
  });

  // ── Achievement card spring hover ──────────────────────────────────────────
  document.querySelectorAll('.achievement-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      animate(card, { scale: 1.04, y: -5 }, { type: 'spring', stiffness: 320, damping: 22 });
    });
    card.addEventListener('mouseleave', () => {
      animate(card, { scale: 1, y: 0 }, { type: 'spring', stiffness: 280, damping: 26 });
    });
  });

  // ── Skill pill spring hover ────────────────────────────────────────────────
  document.querySelectorAll('.skill-pill').forEach((pill) => {
    pill.addEventListener('mouseenter', () => {
      animate(pill, { scale: 1.12, y: -3 }, { type: 'spring', stiffness: 400, damping: 18 });
    });
    pill.addEventListener('mouseleave', () => {
      animate(pill, { scale: 1, y: 0 }, { type: 'spring', stiffness: 350, damping: 22 });
    });
  });

  // ── Stat card pop on enter ─────────────────────────────────────────────────
  inView('.stat-card', (info) => {
    animate(
      info.target,
      { scale: [0.85, 1], opacity: [0, 1] },
      { type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }
    );
  }, { margin: '-15% 0px' });

  // ── Hero orb scroll parallax ───────────────────────────────────────────────
  const orbs = [
    { el: document.querySelector('.orb-1'), speed: 0.18 },
    { el: document.querySelector('.orb-2'), speed: -0.12 },
    { el: document.querySelector('.orb-3'), speed: 0.09 },
  ];

  scroll(({ y }) => {
    orbs.forEach(({ el, speed }) => {
      if (el) el.style.transform = `translateY(${y.current * speed}px)`;
    });
  });

  // ── Timeline dot pulse on enter ────────────────────────────────────────────
  document.querySelectorAll('.timeline-dot').forEach((dot) => {
    inView(dot, () => {
      animate(dot, { scale: [0, 1.3, 1] }, { type: 'spring', stiffness: 300, damping: 15 });
    }, { margin: '-20% 0px' });
  });

  // ── Nav logo spring hover ──────────────────────────────────────────────────
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('mouseenter', () => {
      animate(navLogo, { scale: 1.08 }, { type: 'spring', stiffness: 400, damping: 20 });
    });
    navLogo.addEventListener('mouseleave', () => {
      animate(navLogo, { scale: 1 }, { type: 'spring', stiffness: 350, damping: 24 });
    });
  }
})();
