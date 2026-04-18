// ─── Loader ───────────────────────────────────────────────────────────────────

(function () {
  const loader  = document.getElementById('loader');
  const bar     = document.getElementById('loader-bar');
  const counter = document.getElementById('loader-counter');

  let progress = 0;

  function updateBar(p) {
    bar.style.width = p + '%';
  }

  function updateCounter(p) {
    counter.textContent = p + '%';
  }

  function hideLoader() {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
      // Trigger hero entrance animations
      if (typeof window.animateHero === 'function') {
        window.animateHero();
      }
      // Show navbar
      const nav = document.getElementById('navbar');
      if (nav) {
        setTimeout(() => nav.classList.add('nav-visible'), 100);
      }
    }, 650);
  }

  const interval = setInterval(() => {
    progress += 1;
    updateBar(progress);
    updateCounter(progress);
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => hideLoader(), 200);
    }
  }, 14);
})();
