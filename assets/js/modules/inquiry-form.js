/**
 * Private inquiry form → opens WhatsApp (default) or the email app with a
 * neatly formatted message. No backend required, nothing stored.
 * Validation is native (required/type=email) with accessible inline errors.
 */
import { CONFIG } from '../config.js';
import { waLink } from './whatsapp.js';

const FIELDS = [
  ['name', 'Name'], ['country', 'Country'], ['email', 'Email'], ['phone', 'Phone / WhatsApp'],
  ['interest', 'Interested in'], ['budget', 'Budget'], ['message', 'Message'],
];

export function initInquiryForm(form) {
  const success = document.getElementById('form-success');

  // Pre-fill from links such as contact.html?interest=private-viewing&ref=A1
  const params = new URLSearchParams(location.search);
  const interest = form.elements.interest;
  if (params.get('interest') && [...interest.options].some((o) => o.value === params.get('interest'))) {
    interest.value = params.get('interest');
  }
  if (params.get('ref')) form.elements.message.value = `I'm interested in Ref. ${params.get('ref')}.\n`;

  const fieldOf = (el) => el.closest('.field');
  const validate = (el) => {
    const ok = el.checkValidity();
    fieldOf(el)?.classList.toggle('has-error', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  };

  form.addEventListener('blur', (e) => { if (e.target.matches('[required]')) validate(e.target); }, true);
  form.addEventListener('input', (e) => { if (fieldOf(e.target)?.classList.contains('has-error')) validate(e.target); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = [...form.querySelectorAll('[required]')].filter((el) => !validate(el));
    if (invalid.length) { invalid[0].focus(); return; }

    const data = new FormData(form);
    const label = (name) => (data.get(name) ? form.elements[name].selectedOptions[0].text : '');
    const lines = FIELDS
      .map(([key, title]) => [title, key === 'interest' || key === 'budget' ? label(key) : data.get(key)])
      .filter(([, v]) => v && String(v).trim())
      .map(([title, v]) => `${title}: ${String(v).trim()}`);
    const body = [`Hello ${CONFIG.brand}! I'd like a private consultation.`, '', ...lines].join('\n');

    if (data.get('channel') === 'email') {
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(`Private inquiry — ${data.get('name')}`)}&body=${encodeURIComponent(body)}`;
    } else {
      window.open(waLink(body), '_blank', 'noopener');
    }

    if (success) {
      form.hidden = true;
      success.hidden = false;
      success.querySelector('h3')?.focus();
    }
  });

  document.querySelector('[data-form-again]')?.addEventListener('click', () => {
    form.hidden = false;
    success.hidden = true;
    form.querySelector('input')?.focus();
  });
}
