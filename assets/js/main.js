/**
 * Site entry point (loaded on every page as a deferred ES module).
 * Each feature is a small module and only runs if its markup is present.
 */
import { initNav } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initWhatsAppLinks } from './modules/whatsapp.js';
import { initCurrency } from './modules/currency.js';

document.documentElement.classList.add('js');

initNav();
initWhatsAppLinks();
initReveal();
initCurrency();

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Feature modules are code-split: downloaded only on pages that use them.
document.querySelectorAll('[data-catalog]').forEach((root) => {
  import('./modules/catalog.js').then(({ initCatalog }) => initCatalog(root));
});

const form = document.querySelector('[data-inquiry-form]');
if (form) import('./modules/inquiry-form.js').then(({ initInquiryForm }) => initInquiryForm(form));

const viewer = document.querySelector('[data-model]');
if (viewer) import('./modules/ring-viewer.js').then(({ initRingViewer }) => initRingViewer(viewer));
