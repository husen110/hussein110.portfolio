// ─── Marquee ──────────────────────────────────────────────────────────────────

(function () {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  // Clone children to create seamless loop
  const items = Array.from(track.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
})();
