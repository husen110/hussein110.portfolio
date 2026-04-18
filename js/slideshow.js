(function () {
  const track = document.getElementById('heroSlidesTrack');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.hero-slide'));
  const INTERVAL = 4000;
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

  slides[0].classList.add('active');
  resetTimer();

  const section = document.getElementById('hero');
  if (section) {
    section.addEventListener('mouseenter', () => clearInterval(timer));
    section.addEventListener('mouseleave', resetTimer);
  }
})();
