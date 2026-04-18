// ─── Magnetic Buttons ─────────────────────────────────────────────────────────

(function () {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const BUFFER = 40;
  const STRENGTH = 0.25;

  function attachMagnetic(el) {
    let rect;

    function onMouseMove(e) {
      rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;

      // Check if within buffer zone
      if (
        e.clientX >= rect.left  - BUFFER &&
        e.clientX <= rect.right + BUFFER &&
        e.clientY >= rect.top   - BUFFER &&
        e.clientY <= rect.bottom + BUFFER
      ) {
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        el.style.transform    = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
        el.style.transition   = `transform 0.2s var(--ease-out)`;
      } else {
        resetEl();
      }
    }

    function resetEl() {
      el.style.transform  = 'translate(0, 0)';
      el.style.transition = `transform 0.5s var(--ease-spring)`;
    }

    document.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', resetEl);
  }

  document.querySelectorAll('.btn-magnetic').forEach(attachMagnetic);
})();
