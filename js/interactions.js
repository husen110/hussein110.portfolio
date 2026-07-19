// ─── Interactions: scroll progress, active nav, heading reveals, copy-email ──

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COPY_FEEDBACK_MS = 1600;

// ─── Scroll progress bar ────────────────────────────────────────────────────

(function scrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  let ticking = false;

  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.transform = `scaleX(${Math.min(ratio, 1)})`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
})();

// ─── Active nav link ────────────────────────────────────────────────────────

(function activeNav() {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (links.length === 0) return;

  const byId = new Map(links.map((link) => [link.getAttribute('href').slice(1), link]));
  const sections = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (sections.length === 0) return;

  const visible = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visible.add(entry.target.id);
      } else {
        visible.delete(entry.target.id);
      }
    });

    // Highlight the topmost visible section; clear the highlight when none qualify
    const current = sections.find((section) => visible.has(section.id));
    links.forEach((link) => link.classList.remove('nav-active'));
    if (current) byId.get(current.id)?.classList.add('nav-active');
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => observer.observe(section));
})();

// ─── Heading underline reveal ───────────────────────────────────────────────

(function headingReveal() {
  const targets = Array.from(
    document.querySelectorAll('.section-header, #about h2, #contact h2')
  );
  if (targets.length === 0) return;

  if (REDUCED_MOTION) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  targets.forEach((el) => observer.observe(el));
})();

// ─── Click-to-copy email ────────────────────────────────────────────────────

/**
 * Copy text without the async Clipboard API, which browsers deny on insecure
 * origins and backgrounded documents. Returns whether the copy succeeded.
 */
function copyViaSelection(text) {
  const scratch = document.createElement('textarea');
  scratch.value = text;
  scratch.setAttribute('readonly', '');
  scratch.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;';
  document.body.appendChild(scratch);

  const selection = document.getSelection();
  const previous = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  scratch.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }

  document.body.removeChild(scratch);
  if (previous) {
    selection.removeAllRanges();
    selection.addRange(previous);
  }
  return copied;
}

(function copyEmail() {
  const link = document.querySelector('a[href^="mailto:"].contact-link');
  if (!link) return;

  const email = link.getAttribute('href').replace('mailto:', '');
  const label = link.querySelector('.contact-link-text');
  if (!label) return;

  const original = label.textContent;
  let resetTimer = null;

  function showCopied() {
    label.textContent = 'Copied to clipboard';
    link.classList.add('copied');
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      label.textContent = original;
      link.classList.remove('copied');
    }, COPY_FEEDBACK_MS);
  }

  link.addEventListener('click', async (event) => {
    event.preventDefault();

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(email);
        showCopied();
        return;
      } catch {
        // Permission denied or document backgrounded — try the legacy path below
      }
    }

    if (copyViaSelection(email)) {
      showCopied();
      return;
    }

    // Nothing could reach the clipboard — hand off to the mail client instead
    window.location.href = link.getAttribute('href');
  });
})();
