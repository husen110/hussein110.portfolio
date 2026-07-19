(function () {
  const track = document.getElementById('heroSlidesTrack');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.hero-slide'));
  const INTERVAL = 2500;
  const START_FALLBACK_MS = 4000;

  // Feed each slide's own image to its blurred backdrop layer (see slideshow.css).
  // Use img.src, not getAttribute('src'): a relative url() inside a custom
  // property resolves against the stylesheet, so it would look under /css/.
  slides.forEach((slide) => {
    const src = slide.querySelector('img')?.src;
    if (src) slide.style.setProperty('--slide-img', `url("${src}")`);
  });
  let current = 0;
  let timer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  // Slide 1 is the hackathon win — hold it until the loader clears, otherwise
  // the rotation eats it while the hero is still hidden behind the loader.
  slides[0].classList.add('active');

  let started = false;
  function start() {
    if (started) return;

    // Never begin rotating while the loader is still covering the hero, or the
    // hackathon slide would be spent before anyone sees it.
    const loader = document.getElementById('loader');
    const loaderStillUp = loader &&
      loader.style.display !== 'none' &&
      !loader.classList.contains('fade-out');
    if (loaderStillUp) {
      setTimeout(start, 400);
      return;
    }

    started = true;
    goTo(0);      // re-assert slide 1 in case anything advanced early
    resetTimer();
  }

  // The loader calls window.animateHero when it finishes; chain onto it.
  const prevAnimateHero = window.animateHero;
  window.animateHero = function () {
    if (typeof prevAnimateHero === 'function') prevAnimateHero();
    start();
  };

  // Safety net if the loader never fires (script error, reduced-motion path)
  setTimeout(start, START_FALLBACK_MS);

  const section = document.getElementById('hero');
  if (section) {
    section.addEventListener('mouseenter', () => clearInterval(timer));
    section.addEventListener('mouseleave', () => { if (started) resetTimer(); });
  }
})();
