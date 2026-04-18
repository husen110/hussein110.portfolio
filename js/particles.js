// ─── Particles ────────────────────────────────────────────────────────────────

(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = () => window.innerWidth < 768;
  const COUNT = () => isMobile() ? 40 : 80;
  const ACCENT = '124, 109, 250';

  let particles = [];
  let mouseX = -999, mouseY = -999;
  let animId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createParticle() {
    return {
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      vx:      randomBetween(-0.4, 0.4),
      vy:      randomBetween(-0.4, 0.4),
      radius:  randomBetween(1, 2.5),
      opacity: randomBetween(0.2, 0.6),
    };
  }

  function init() {
    resize();
    particles = [];
    const n = COUNT();
    for (let i = 0; i < n; i++) particles.push(createParticle());
  }

  function draw() {
    if (document.hidden) {
      animId = requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.6;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Speed cap
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) {
        p.vx = (p.vx / speed) * 1.5;
        p.vy = (p.vy / speed) * 1.5;
      }

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT}, ${p.opacity})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const cdx = p.x - q.x;
        const cdy = p.y - q.y;
        const d = Math.sqrt(cdx * cdx + cdy * cdy);
        if (d < 120) {
          const alpha = (1 - d / 120) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Pause when hidden
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !animId) {
      animId = requestAnimationFrame(draw);
    }
  });

  // Re-init on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });

  init();
  draw();
})();
