/**
 * Product quick-view built on the native <dialog> element:
 * focus trapping, Esc-to-close and inert background come for free.
 * Deep links: page.html#A1 opens the dialog for product A1.
 */
import { CONFIG } from '../config.js';
import { onCurrencyChange } from './currency.js';
import { waLink, productMessage } from './whatsapp.js';
import { icon, esc, imgTag, specs, priceLabel } from './product-view.js';

let dialog;
let current = null;
let index = 0;
let opener = null;

function ensureDialog() {
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.className = 'product-dialog';
  dialog.setAttribute('aria-labelledby', 'pd-title');
  document.body.append(dialog);

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();                       // backdrop click
    if (e.target.closest('[data-close]')) dialog.close();
    if (e.target.closest('[data-step]')) show(index + Number(e.target.closest('[data-step]').dataset.step));
    const thumb = e.target.closest('[data-thumb]');
    if (thumb) show(Number(thumb.dataset.thumb));
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    opener?.focus();
    current = null;
  });

  // Swipe between photos on touch devices
  let x0 = null;
  dialog.addEventListener('touchstart', (e) => { if (e.target.closest('.product-dialog__stage')) x0 = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  onCurrencyChange(() => { if (current) render(); });
  return dialog;
}

function show(i) {
  if (!current) return;
  const n = current.photos.length;
  index = (i + n) % n;
  const photo = current.photos[index];
  const stage = dialog.querySelector('.product-dialog__stage');
  stage.classList.toggle('product-dialog__stage--plinth', Boolean(photo.plinth));
  stage.innerHTML = imgTag(photo, { alt: `${current.name} — photo ${index + 1} of ${n}`, sizes: '(max-width: 820px) 100vw, 560px', eager: true });
  dialog.querySelectorAll('[data-thumb]').forEach((t) => t.setAttribute('aria-current', String(Number(t.dataset.thumb) === index)));
}

function render() {
  const p = current;
  const many = p.photos.length > 1;
  const price = priceLabel(p);
  const viewing = `Hello ${CONFIG.brand}! I'd like to book a private viewing for ${p.name} (Ref. ${p.id}).`;
  const mail = `mailto:${CONFIG.email}?subject=${encodeURIComponent(`Inquiry: ${p.name} (Ref. ${p.id})`)}&body=${encodeURIComponent(productMessage(p, { priceLabel: price }))}`;

  dialog.innerHTML = `
    <button class="product-dialog__close" type="button" data-close aria-label="Close">${icon('close')}</button>
    <div class="product-dialog__grid">
      <div class="product-dialog__gallery">
        <div class="product-dialog__stage"></div>
        ${many ? `
          <button class="product-dialog__nav product-dialog__nav--prev" type="button" data-step="-1" aria-label="Previous photo">${icon('chevron-left')}</button>
          <button class="product-dialog__nav product-dialog__nav--next" type="button" data-step="1" aria-label="Next photo">${icon('chevron-right')}</button>
          <div class="product-dialog__thumbs">
            ${p.photos.map((ph, i) => `<button type="button" data-thumb="${i}" aria-label="Show photo ${i + 1}"><img src="${esc(ph.src)}" alt="" width="60" height="60" loading="lazy"></button>`).join('')}
          </div>` : ''}
      </div>
      <div class="product-dialog__info">
        <p class="eyebrow">Ref. ${esc(p.id)} · ${p.status === 'available' ? 'Available now' : esc(p.status)}</p>
        <h2 class="product-dialog__title" id="pd-title">${esc(p.name)}</h2>
        <p class="product-dialog__price">${p.priceFrom ? `<small>GUIDE PRICE · FINAL QUOTE ON REQUEST</small>${esc(price)}` : 'Price on request'}</p>
        <div class="product-dialog__ctas">
          <a class="btn btn--wa btn--block" href="${esc(waLink(productMessage(p, { priceLabel: price })))}" target="_blank" rel="noopener" data-track="wa-dialog">
            ${icon('whatsapp')} Ask about this piece
          </a>
          <div class="btn-row">
            <a class="btn btn--ghost btn--sm" href="${esc(waLink(productMessage(p, { intent: 'video' })))}" target="_blank" rel="noopener">${icon('video')} Live video</a>
            <a class="btn btn--ghost btn--sm" href="${esc(waLink(viewing))}" target="_blank" rel="noopener">${icon('calendar')} Book viewing</a>
          </div>
          <a class="link-arrow" href="${esc(mail)}">Prefer email? ${esc(CONFIG.email)} ${icon('arrow')}</a>
        </div>
        <dl class="spec-list">${specs(p).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <ul class="mini-trust">
          <li>${icon('video')} See the stone on live video before you pay</li>
          <li>${icon('award')} Original gem lab report included</li>
          <li>${icon('globe')} Fully insured FedEx / DHL delivery worldwide</li>
          <li>${icon('return')} 14-day money-back guarantee</li>
        </ul>
      </div>
    </div>`;
  show(index);
}

export function openProduct(product, trigger = document.activeElement) {
  ensureDialog();
  current = product;
  index = 0;
  opener = trigger;
  render();
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
  history.replaceState(null, '', `#${product.id}`);
  dialog.querySelector('.product-dialog__close').focus();
}
