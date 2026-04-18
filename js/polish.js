// ─── Typewriter role ticker ────────────────────────────────────────────────

(function () {
  const el = document.getElementById('typewriterText');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = '$ AI engineer · automation builder · hackathon winner';
    document.querySelector('.hero-typewriter')?.classList.add('visible');
    return;
  }

  const phrases = [
    '$ building AI automation for SMEs',
    '$ shipping voice agents with ElevenLabs',
    '$ deploying n8n workflows at scale',
    '$ crafting React Native mobile apps',
    '$ winning hackathons with AI — #1 Pandora 2026',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let speed = 65;

  const ticker = document.querySelector('.hero-typewriter');

  function tick() {
    const phrase = phrases[phraseIdx];
    if (deleting) {
      el.textContent = phrase.slice(0, --charIdx);
      speed = 28;
    } else {
      el.textContent = phrase.slice(0, ++charIdx);
      speed = 65;
    }

    if (!deleting && charIdx === phrase.length) {
      speed = 2200;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 380;
    }

    setTimeout(tick, speed);
  }

  // Show the elements then start typing after the loader finishes
  function start() {
    document.querySelector('.hero-role')?.classList.add('visible');
    if (ticker) ticker.classList.add('visible');
    setTimeout(tick, 200);
  }

  // Loader fires window.animateHero — hook in after it
  const origAnimateHero = window.animateHero;
  window.animateHero = function () {
    if (origAnimateHero) origAnimateHero();
    setTimeout(start, 1400);
  };

  // Fallback if animateHero never fires
  setTimeout(() => {
    if (el.textContent === '') start();
  }, 4000);
})();
