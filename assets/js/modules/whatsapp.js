import { CONFIG } from '../config.js';

/** Build a wa.me link with a pre-filled message. */
export function waLink(message) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Pre-filled message for a specific product so the gemologist knows exactly what you mean. */
export function productMessage(product, { intent = 'inquire', priceLabel = '' } = {}) {
  const url = new URL(`${product.page}#${product.id}`, CONFIG.siteUrl).href;
  const opener = intent === 'video'
    ? `Hello ${CONFIG.brand}! I'd like a live video viewing of this piece:`
    : `Hello ${CONFIG.brand}! I'm interested in this piece:`;
  const lines = [opener, `• ${product.name} (Ref. ${product.id})`];
  if (priceLabel) lines.push(`• Listed: ${priceLabel}`);
  lines.push(url, '', 'Is it still available?');
  return lines.join('\n');
}

/**
 * Progressive enhancement: any element with data-wa="Your message" becomes
 * a WhatsApp link. Without JS the plain href (also wa.me) still works.
 */
export function initWhatsAppLinks(root = document) {
  root.querySelectorAll('[data-wa]').forEach((el) => {
    el.href = waLink(el.dataset.wa || `Hello ${CONFIG.brand}!`);
    el.target = '_blank';
    el.rel = 'noopener';
  });
}
