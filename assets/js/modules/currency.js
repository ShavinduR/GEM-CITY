import { CONFIG } from '../config.js';

/**
 * Currency conversion for display only (prices are stored in LKR).
 * Rates are cached for 12h; if the API is down we fall back to approximate
 * rates so prices never disappear.
 */
const STORE_KEY = 'facet:currency';
const RATES_KEY = 'facet:rates:v2';
const TTL = 12 * 60 * 60 * 1000;

let rates = { ...CONFIG.fallbackRates };
let ratesLoaded = null;
try {
  const cached = JSON.parse(localStorage.getItem('facet:rates:v2') || 'null');
  if (cached?.rates) rates = { ...rates, ...cached.rates };
} catch { /* ignore */ }
let current = readCurrency();
const listeners = new Set();

function readCurrency() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    return saved && CONFIG.currencies[saved] ? saved : CONFIG.baseCurrency;
  } catch { return CONFIG.baseCurrency; }
}

function loadRates() {
  ratesLoaded ??= fetchRates();
  return ratesLoaded;
}

async function fetchRates() {
  try {
    const cached = JSON.parse(localStorage.getItem(RATES_KEY) || 'null');
    if (cached && Date.now() - cached.t < TTL) { rates = { ...rates, ...cached.rates }; return; }
  } catch { /* ignore corrupt cache */ }
  try {
    const res = await fetch(CONFIG.ratesUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const picked = Object.fromEntries(Object.keys(CONFIG.currencies).map((c) => [c, data.rates?.[c]]).filter(([, v]) => v));
    rates = { ...rates, ...picked };
    localStorage.setItem(RATES_KEY, JSON.stringify({ t: Date.now(), rates: picked }));
  } catch {
    /* offline or blocked: keep fallback rates */
  }
}

export function getCurrency() { return current; }

/** Format an LKR amount in the selected currency, e.g. "US$1,500". */
export function formatPrice(lkr, currency = current) {
  const { locale, decimals } = CONFIG.currencies[currency];
  const value = lkr * (rates[currency] ?? 1);
  // Round foreign prices to a tidy figure so they read as considered, not computed
  const rounded = currency === 'LKR' ? value : Math.round(value / 10) * 10;
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency, maximumFractionDigits: decimals, minimumFractionDigits: decimals,
  }).format(rounded);
}

export function onCurrencyChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

async function setCurrency(code) {
  current = code;
  try { localStorage.setItem(STORE_KEY, code); } catch { /* private mode */ }
  document.querySelectorAll('[data-currency-select]').forEach((s) => { s.value = code; });
  // Repaint instantly with cached/fallback rates, then again once live rates arrive
  listeners.forEach((fn) => fn(code));
  if (code !== CONFIG.baseCurrency) {
    await loadRates();
    if (current === code) listeners.forEach((fn) => fn(code));
  }
}

/** Update static elements that carry data-price-lkr="450000". */
function paintStatic() {
  document.querySelectorAll('[data-price-lkr]').forEach((el) => {
    el.textContent = formatPrice(Number(el.dataset.priceLkr));
  });
}

export async function initCurrency() {
  const selects = document.querySelectorAll('[data-currency-select]');
  selects.forEach((select) => {
    select.value = current;
    select.addEventListener('change', (e) => setCurrency(e.target.value));
  });
  onCurrencyChange(paintStatic);
  // Rates are only fetched for visitors who chose a foreign currency
  if (current !== CONFIG.baseCurrency) await setCurrency(current);
}
