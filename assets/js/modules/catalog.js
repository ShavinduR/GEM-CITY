/**
 * Catalog: renders a product grid from data with filter chips, search and sort.
 * State is mirrored in the URL (?type=blue&q=oval&sort=price-asc) so filtered
 * views can be shared on WhatsApp and survive a page refresh.
 *
 * Markup contract (see all-gems.html):
 *   [data-catalog]          root, data-catalog="gems" | "jewellery"
 *     [data-chips]          filter chip container (optional)
 *     [data-search]         <input type="search"> (optional)
 *     [data-sort]           <select> (optional)
 *     [data-count]          live result count (optional)
 *     [data-grid]           grid container (required)
 *     [data-empty]          "no results" block (optional)
 *   data-featured + data-limit="4" on the root → homepage teaser mode.
 */
import { cardHTML, catalogSchema, esc, priceLabel } from './product-view.js';
import { onCurrencyChange } from './currency.js';
import { openProduct } from './product-dialog.js';
import { revealNow } from './reveal.js';
import { CONFIG } from '../config.js';

const SOURCES = {
  gems: () => import('../data/gems.js').then((m) => ({ items: m.GEMS, categories: m.GEM_CATEGORIES, title: 'Ceylon Gem Collection' })),
  jewellery: () => import('../data/jewellery.js').then((m) => ({ items: m.JEWELLERY, categories: m.JEWELLERY_CATEGORIES, title: 'Fine Jewellery' })),
};

const SORTERS = {
  featured: null,
  'price-asc': (a, b) => (a.priceFrom ?? Infinity) - (b.priceFrom ?? Infinity),
  'price-desc': (a, b) => (b.priceFrom ?? -1) - (a.priceFrom ?? -1),
  'carat-desc': (a, b) => (b.carat ?? 0) - (a.carat ?? 0),
};

const normalise = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export async function initCatalog(root) {
  const { items, categories, title } = await SOURCES[root.dataset.catalog]();
  const grid = root.querySelector('[data-grid]');
  const chipsEl = root.querySelector('[data-chips]');
  const search = root.querySelector('[data-search]');
  const sort = root.querySelector('[data-sort]');
  const count = root.querySelector('[data-count]');
  const empty = root.querySelector('[data-empty]');
  const teaser = root.hasAttribute('data-featured');
  const byId = new Map(items.map((p) => [p.id, p]));
  const labelOf = Object.fromEntries(categories.map((c) => [c.id, c.label]));

  // ---- state (from URL) ----
  const params = new URLSearchParams(location.search);
  const state = teaser ? { type: 'all', q: '', sort: 'featured' } : {
    type: categories.some((c) => c.id === params.get('type')) ? params.get('type') : 'all',
    q: params.get('q') || '',
    sort: SORTERS[params.get('sort')] !== undefined ? params.get('sort') : 'featured',
  };
  if (search) search.value = state.q;
  if (sort) sort.value = state.sort;

  const haystack = (p) => normalise([p.name, p.id, p.shape, p.gem, p.metal, labelOf[p.category], p.carat && `${p.carat}ct`].join(' '));

  function visible() {
    if (teaser) {
      return items.filter((p) => p.featured).slice(0, Number(root.dataset.limit) || 4);
    }
    const terms = normalise(state.q).split(/\s+/).filter(Boolean);
    const list = items.filter((p) =>
      (state.type === 'all' || p.category === state.type) &&
      terms.every((t) => haystack(p).includes(t)));
    const sorter = SORTERS[state.sort];
    return sorter ? [...list].sort(sorter) : list;
  }

  function renderChips() {
    if (!chipsEl) return;
    chipsEl.innerHTML = categories.map((c) => {
      const n = c.id === 'all' ? items.length : items.filter((p) => p.category === c.id).length;
      if (!n) return '';
      return `<button type="button" class="chip" data-type="${esc(c.id)}" aria-pressed="${state.type === c.id}">${esc(c.label)}<span class="count">${n}</span></button>`;
    }).join('');
  }

  function render() {
    const list = visible();
    grid.innerHTML = list.map((p) => cardHTML(p)).join('');
    if (count) count.textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`;
    if (empty) empty.hidden = list.length > 0;
    revealNow(grid);
  }

  function syncURL() {
    if (teaser) return;
    const p = new URLSearchParams();
    if (state.type !== 'all') p.set('type', state.type);
    if (state.q) p.set('q', state.q);
    if (state.sort !== 'featured') p.set('sort', state.sort);
    const qs = p.toString();
    history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
  }

  function update() { syncURL(); render(); }

  // ---- events ----
  chipsEl?.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-type]');
    if (!chip) return;
    state.type = chip.dataset.type;
    chipsEl.querySelectorAll('[data-type]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    update();
  });

  let t;
  search?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = search.value.trim(); update(); }, 150);
  });
  sort?.addEventListener('change', () => { state.sort = sort.value; update(); });
  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    state.type = 'all'; state.q = ''; state.sort = 'featured';
    if (search) search.value = '';
    if (sort) sort.value = 'featured';
    renderChips(); update();
  });

  grid.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open]');
    if (!trigger) return;
    const product = byId.get(trigger.dataset.open);
    if (product) openProduct(product, trigger.closest('.product-card')?.querySelector('button[data-open]') || trigger);
  });

  // Only update the price text when the currency changes (no full re-render)
  onCurrencyChange(() => {
    grid.querySelectorAll('[data-price-for]').forEach((el) => {
      const p = byId.get(el.dataset.priceFor);
      if (p?.priceFrom) el.innerHTML = `<small>Guide price</small>${esc(priceLabel(p))}`;
    });
  });

  renderChips();
  render();

  // Deep link: all-gems.html#A1
  const openFromHash = () => {
    const product = byId.get(decodeURIComponent(location.hash.slice(1)));
    if (product) openProduct(product, grid.querySelector(`#card-${CSS.escape(product.id)} button[data-open]`));
  };
  if (!teaser) {
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(catalogSchema(items, { name: title, url: new URL(items[0]?.page || '', CONFIG.siteUrl).href }));
    document.head.append(script);
  }
}
