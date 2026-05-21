/**
 * Billing toggle + NumberFlow price rolls (taap.it-style odometer).
 * @see https://taap.it/pricing
 */
import 'number-flow';
import 'number-flow/group';
import { continuous } from 'number-flow/plugins';
import type { Plugin } from 'number-flow/plugins';
import type { BillingInterval } from '../site/pricing';

type NumberFlowEl = HTMLElement & {
  update: (value: number) => void;
  plugins: Plugin[];
  locales: string;
  format: Intl.NumberFormatOptions;
  numberPrefix: string;
  spinTiming: EffectTiming;
  opacityTiming: EffectTiming;
  transformTiming: EffectTiming;
  animated: boolean;
};

/** ~1.2s spring with light bounce, aligned with taap.it NumberFlow config */
const FLOW_SPIN_TIMING: EffectTiming = {
  duration: 1200,
  easing: 'cubic-bezier(0.22, 1.26, 0.32, 1)',
};

const FLOW_OPACITY_TIMING: EffectTiming = {
  duration: 400,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

interface PlanCardUi {
  flow: NumberFlowEl;
  monthlyValue: number;
  annualValue: number;
}

function parseInterval(raw: string | null): BillingInterval {
  return raw === 'annual' ? 'annual' : 'monthly';
}

function configureFlow(flow: NumberFlowEl): void {
  flow.plugins = [continuous];
  flow.locales = 'en-US';
  flow.format = { minimumFractionDigits: 0, maximumFractionDigits: 0 };
  flow.numberPrefix = '$';
  flow.spinTiming = FLOW_SPIN_TIMING;
  flow.opacityTiming = FLOW_OPACITY_TIMING;
  flow.transformTiming = FLOW_SPIN_TIMING;
  flow.style.setProperty('--number-flow-mask-height', '0.15em');
  flow.style.setProperty('--number-flow-mask-width', '0.5em');
  flow.style.lineHeight = '0.85';
}

function initPricingBilling(): void {
  const section = document.getElementById('pricing-plans');
  if (!section) return;

  const toggleBtns = section.querySelectorAll<HTMLButtonElement>(
    '.billing-toggle-btn[data-billing-interval]',
  );
  let currentInterval = parseInterval(section.getAttribute('data-billing-interval'));
  const cards: PlanCardUi[] = [];

  function syncToggleUi(interval: BillingInterval): void {
    if (!section) return;
    section.setAttribute('data-billing-interval', interval);
    toggleBtns.forEach((btn) => {
      const active = btn.dataset.billingInterval === interval;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    try {
      const url = new URL(window.location.href);
      if (interval === 'annual') {
        url.searchParams.set('billing', 'annual');
      } else {
        url.searchParams.delete('billing');
      }
      window.history.replaceState(null, '', url);
    } catch {
      /* ignore */
    }
  }

  function setBillingInterval(interval: BillingInterval, instant = false): void {
    if (interval !== 'monthly' && interval !== 'annual') return;
    if (interval === currentInterval && !instant) return;

    syncToggleUi(interval);

    cards.forEach(({ flow, monthlyValue, annualValue }) => {
      const nextValue = interval === 'annual' ? annualValue : monthlyValue;
      if (instant) flow.animated = false;
      flow.update(nextValue);
      if (instant) flow.animated = true;
      flow.style.setProperty('--price-tilt', `${nextValue * -0.1}deg`);
    });

    currentInterval = interval;
  }

  const toggleRoot = section.querySelector<HTMLElement>('.billing-toggle');
  toggleRoot?.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>(
      '.billing-toggle-btn[data-billing-interval]',
    );
    if (!btn) return;
    const interval = parseInterval(btn.dataset.billingInterval ?? null);
    setBillingInterval(interval);
  });

  section.querySelectorAll<HTMLElement>('[data-plan-id][data-price-monthly]').forEach((card) => {
    const flow = card.querySelector<NumberFlowEl>('number-flow.plan-price-flow');
    if (!flow) return;

    try {
      configureFlow(flow);
    } catch (err) {
      console.error('[pricing-billing] NumberFlow setup failed', err);
      return;
    }

    const monthlyValue = Number(card.dataset.priceMonthly);
    const annualValue = Number(card.dataset.priceAnnual);
    const hydrateValue = currentInterval === 'annual' ? annualValue : monthlyValue;
    flow.update(hydrateValue);
    flow.style.setProperty('--price-tilt', `${hydrateValue * -0.1}deg`);

    cards.push({
      flow,
      monthlyValue,
      annualValue,
    });
  });

  try {
    const initial = new URL(window.location.href).searchParams.get('billing');
    if (initial === 'annual') setBillingInterval('annual', true);
  } catch {
    /* ignore */
  }
}

function bootPricingBilling(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPricingBilling, { once: true });
    return;
  }
  initPricingBilling();
}

bootPricingBilling();
