// ─── Custom Cursor ────────────────────────────────────────────────────────────

(function () {
  // Skip on touch devices
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let isHovering = false;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  // Mousedown scale
  document.addEventListener('mousedown', () => {
    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(0.7)`;
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(${isHovering ? 1.8 : 1})`;
  });

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .project-card, .stat-card, .achievement-card, .btn, .contact-link';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      isHovering = true;
      dot.style.background = 'var(--accent-2)';
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1.8)`;
      ring.style.borderColor = 'rgba(250, 109, 154, 0.6)';
      ring.style.width  = '54px';
      ring.style.height = '54px';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      isHovering = false;
      dot.style.background = 'var(--accent-1)';
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1)`;
      ring.style.borderColor = 'rgba(124, 109, 250, 0.5)';
      ring.style.width  = '36px';
      ring.style.height = '36px';
    }
  });

  // Ring lerp loop
  function lerp(a, b, t) { return a + (b - a) * t; }

  function raf() {
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
})();
