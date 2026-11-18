/**
 * Pure rendering helpers for products (no DOM state).
 * Shared by the catalog grid, the homepage "featured" rows and the dialog.
 */
import { formatPrice } from './currency.js';
import { waLink, productMessage } from './whatsapp.js';

const ICONS = 'assets/icons.svg';
export const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="${ICONS}#i-${name}"/></svg>`;

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

const STATUS_LABEL = { available: 'Available', reserved: 'Reserved', sold: 'Sold' };

export function priceLabel(p) {
  return p.priceFrom ? `From ${formatPrice(p.priceFrom)}` : 'Price on request';
}

export function specLine(p) {
  return p.type === 'gem'
    ? [`${p.carat.toFixed(2)} ct`, p.shape, 'Ceylon'].join(' · ')
    : [p.metal, p.gem].filter(Boolean).join(' · ');
}

export function specs(p) {
  return p.type === 'gem'
    ? [['Weight', `${p.carat.toFixed(2)} ct`], ['Shape', p.shape], ['Origin', p.origin], ['Certification', p.certificate]]
    : [['Metal', p.metal], ['Gemstone', p.gem], ['Ref.', p.id], ['Sizing', 'Made to your size']];
}

export function imgTag(photo, { alt, sizes, eager = false } = {}) {
  return `<img src="${esc(photo.src)}"${photo.srcset ? ` srcset="${esc(photo.srcset)}" sizes="${esc(sizes || '(max-width: 560px) 50vw, 300px')}"` : ''}
    alt="${esc(photo.alt || alt)}" width="${photo.width}" height="${photo.height}"
    ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

export function cardHTML(p, { headingLevel = 3 } = {}) {
  const photo = p.photos[0];
  const h = `h${headingLevel}`;
  const name = `${p.name}, ref. ${p.id}`;
  return `
<article class="product-card" id="card-${esc(p.id)}" data-reveal>
  <div class="product-card__media${photo.plinth ? ' product-card__media--plinth' : ''}" data-open="${esc(p.id)}">
    <span class="badge badge--${esc(p.status)}">${STATUS_LABEL[p.status] || ''}</span>
    ${imgTag(photo, { alt: p.name })}
    <span class="product-card__quick" aria-hidden="true">${icon('eye')} Quick view</span>
  </div>
  <div class="product-card__body">
    <p class="product-card__ref">Ref. ${esc(p.id)}</p>
    <${h} class="product-card__title"><button type="button" data-open="${esc(p.id)}" aria-haspopup="dialog">${esc(p.name)}</button></${h}>
    <p class="product-card__specs">${esc(specLine(p))}</p>
    <p class="product-card__price" data-price-for="${esc(p.id)}">${p.priceFrom ? `<small>Guide price</small>${esc(priceLabel(p))}` : `<small>Bespoke</small>Price on request`}</p>
    <div class="product-card__actions">
      <a class="btn btn--wa btn--sm" href="${esc(waLink(productMessage(p, { priceLabel: priceLabel(p) })))}" target="_blank" rel="noopener"
         aria-label="Ask about ${esc(name)} on WhatsApp" data-track="wa-card">${icon('whatsapp')} Ask on WhatsApp</a>
    </div>
  </div>
</article>`;
}

/** schema.org ItemList so search engines understand the catalogue. */
export function catalogSchema(products, { name, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: `${p.name} (${p.id})`,
        sku: p.id,
        url: `${url}#${p.id}`,
        image: new URL(p.photos[0].src, url).href,
        brand: { '@type': 'Brand', name: 'FACET' },
        ...(p.priceFrom && {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'LKR',
            lowPrice: p.priceFrom,
            highPrice: p.priceTo || p.priceFrom,
            availability: p.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          },
        }),
      },
    })),
  };
}
