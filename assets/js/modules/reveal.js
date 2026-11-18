/** Fade-up elements marked [data-reveal] as they enter the viewport. */
export function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  observeAll(items, io);
}

/** Stagger siblings inside [data-reveal-group] for a cascading entrance. */
function observeAll(items, io) {
  items.forEach((el) => {
    const group = el.closest('[data-reveal-group]');
    if (group) {
      const siblings = [...group.querySelectorAll('[data-reveal]')];
      el.style.setProperty('--reveal-i', String(Math.min(siblings.indexOf(el), 6)));
    }
    io.observe(el);
  });
}

/** Re-run for content rendered after page load (e.g. product grids). */
export function revealNow(root) {
  root.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.style.setProperty('--reveal-i', String(Math.min(i, 6)));
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-visible')));
  });
}
