/**
 * Business settings — the single source of truth for contact details.
 * Change a phone number or email here and every WhatsApp/email link updates.
 * (The static HTML footer also prints these; search for "+94 71 109 8429".)
 */
export const CONFIG = Object.freeze({
  brand: 'FACET',
  siteUrl: 'https://facet-seven-xi.vercel.app/',
  whatsapp: '94711098429',            // international format, digits only
  phoneDisplay: '+94 71 109 8429',
  email: 'sales@example.com',   // TODO: placeholder, replace with your real email (also in the HTML footers)
  showroom: 'World Trade Center, Colombo 01, Sri Lanka',
  baseCurrency: 'LKR',
  currencies: {
    LKR: { locale: 'en-LK', decimals: 0 },
    USD: { locale: 'en-US', decimals: 0 },
    GBP: { locale: 'en-GB', decimals: 0 },
    EUR: { locale: 'de-DE', decimals: 0 },
    AUD: { locale: 'en-AU', decimals: 0 },
  },
  // Used only if the live rate API is unreachable. Approximate LKR → X rates.
  fallbackRates: { LKR: 1, USD: 0.0033, GBP: 0.0026, EUR: 0.0031, AUD: 0.0051 },
  ratesUrl: 'https://open.er-api.com/v6/latest/LKR',
});
