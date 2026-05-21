/**
 * Public pricing data for cinchcli.com — keep in sync with biz/PRICING.md and biz/src/types.ts PLAN_LIMITS.
 */

import { SITE_ORIGIN, urls } from './social';

export type PlanId = 'free' | 'pro' | 'team';

export interface PlanPrice {
  monthlyUsd: number;
  annualUsd: number;
  /** Human-readable monthly equivalent when billed annually */
  annualMonthlyUsd: number;
}

export interface PlanLimits {
  deviceLimit: number | null; // null = unlimited
  retentionDays: number;
  pushesPerDay: number | null; // null = unlimited
}

export interface PlanFeatureRow {
  label: string;
  free: boolean | string;
  pro: boolean | string;
  team: boolean | string;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  tagline: string;
  price: PlanPrice;
  limits: PlanLimits;
  recommended?: boolean;
  /** Lemon Squeezy checkout — fill when store is live */
  checkoutUrl: string | null;
  cta: 'get-started' | 'coming-soon' | 'contact';
}

/** Mirrors biz/src/types.ts PLAN_LIMITS */
export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: { deviceLimit: 3, retentionDays: 7, pushesPerDay: null },
  pro: { deviceLimit: 10, retentionDays: 90, pushesPerDay: null },
  team: { deviceLimit: null, retentionDays: 365, pushesPerDay: null },
};

export const PLANS: PlanDefinition[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'For solo developers getting started.',
    price: { monthlyUsd: 0, annualUsd: 0, annualMonthlyUsd: 0 },
    limits: PLAN_LIMITS.free,
    checkoutUrl: null,
    cta: 'get-started',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'More devices and deeper relay history.',
    price: { monthlyUsd: 4, annualUsd: 36, annualMonthlyUsd: 3 },
    limits: PLAN_LIMITS.pro,
    recommended: true,
    checkoutUrl: null,
    cta: 'coming-soon',
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'Per-seat billing for shared fleets.',
    price: { monthlyUsd: 8, annualUsd: 72, annualMonthlyUsd: 6 },
    limits: PLAN_LIMITS.team,
    checkoutUrl: null,
    cta: 'coming-soon',
  },
];

export const PRICING_TAGLINE =
  'All plans include the same encryption, sync engine, and desktop / CLI features. Paid plans differ only in capacity and support response time.';

/** Self-host callout on /pricing (not a separate plan — works with every tier). */
export const SELF_HOST_SECTION = {
  title: 'Your relay, your infrastructure',
  lead:
    'Every plan — including Free — works with the hosted relay or a relay you run yourself. Self-hosting does not change Cinch’s price.',
  bullets: [
    'Single Go binary or Docker image on any VPS',
    'Same E2EE as hosted: relay stores ciphertext only',
    'Point the CLI and desktop app at your URL with --relay',
  ] as const,
  primaryCta: { label: 'Self-hosting guide', href: '/docs/relay/self-hosting/' },
  secondaryCta: { label: 'Configuration reference', href: '/docs/relay/configuration/' },
} as const;

export const VALUE_PROPS = [
  {
    title: 'Scale of fleet',
    body: 'Pro lifts the device cap to 10 — laptop, work Mac, a few VMs, and a CI runner. Team removes the per-seat cap.',
  },
  {
    title: 'History depth',
    body: '90 days on Pro or one year on Team of relay-backed clip history vs. 7 days on Free.',
  },
  {
    title: 'Unlimited pushes',
    body: 'Every plan includes unlimited daily pushes — use Cinch in CI, scripts, and terminals without watching a counter.',
  },
] as const;

export const BILLING_FAQ = [
  {
    q: 'How does billing work?',
    a: 'Free requires no card. Pro is a flat subscription for one user. Team is per seat — specify seats at checkout; add seats anytime with proration.',
  },
  {
    q: 'Currency and payment',
    a: 'Prices are in USD. Checkout runs through Lemon Squeezy (card, Apple Pay, Google Pay, and regional methods).',
  },
  {
    q: 'Refunds',
    a: '14-day refund window on your first purchase, no questions asked.',
  },
  {
    q: 'Tax',
    a: 'VAT and sales tax are collected and remitted by Lemon Squeezy as merchant of record.',
  },
] as const;

export const FEATURE_ROWS: PlanFeatureRow[] = [
  { label: 'End-to-end encryption', free: true, pro: true, team: true },
  { label: 'macOS desktop app', free: true, pro: true, team: true },
  { label: 'CLI (Linux / macOS / Windows)', free: true, pro: true, team: true },
  { label: 'Real-time WebSocket sync', free: true, pro: true, team: true },
  { label: 'Searchable local history (FTS5)', free: true, pro: true, team: true },
  { label: 'Self-hosted relay support', free: true, pro: true, team: true },
  { label: 'Centralized team billing', free: false, pro: false, team: true },
  { label: 'Shared team device pool', free: false, pro: false, team: true },
  { label: 'Priority support', free: false, pro: 'Email (48 h)', team: 'Email (24 h)' },
];

export const CONTACT_EMAIL = 'contact@cinchcli.com' as const;

export function formatDeviceLimit(n: number | null): string {
  if (n === null) return 'Unlimited per seat';
  return String(n);
}

export function formatRetention(days: number): string {
  if (days === 365) return '1 year';
  return `${days} days`;
}

export function formatPushLimit(n: number | null): string {
  if (n === null) return 'Unlimited';
  return `${n} / day`;
}

/** Short bullets for plan cards (pricing page). */
export function planCardBullets(plan: PlanDefinition): readonly string[] {
  const devices =
    plan.limits.deviceLimit === null
      ? 'Unlimited devices per seat'
      : `${formatDeviceLimit(plan.limits.deviceLimit)} connected devices`;
  const retention = `${formatRetention(plan.limits.retentionDays)} relay history`;
  const pushes =
    plan.limits.pushesPerDay === null
      ? 'Unlimited daily pushes'
      : `${formatPushLimit(plan.limits.pushesPerDay)} daily pushes`;
  const core = 'macOS app, CLI, E2EE, self-host relay';

  if (plan.id === 'team') {
    return [devices, retention, pushes, 'Centralized team billing', 'Priority support (24 h)', core];
  }
  if (plan.id === 'pro') {
    return [devices, retention, pushes, 'Email support (48 h)', core];
  }
  return [devices, retention, pushes, core];
}

export function formatMonthlyPrice(usd: number, perSeat = false): string {
  if (usd === 0) return '$0';
  const suffix = perSeat ? ' / seat / mo' : ' / mo';
  return `$${usd}${suffix}`;
}

export interface PriceParts {
  amount: string;
  unit: string;
}

/** Split price for display typography (amount large, unit small). */
export function formatPriceParts(usd: number, perSeat = false): PriceParts {
  if (usd === 0) return { amount: '$0', unit: 'Free forever' };
  return {
    amount: `$${usd}`,
    unit: perSeat ? 'per seat / month' : 'per month',
  };
}

export type BillingInterval = 'monthly' | 'annual';

/** Numeric amount for NumberFlow (excludes currency symbol). */
export function planPriceFlowValue(
  plan: PlanDefinition,
  interval: BillingInterval,
): number {
  if (plan.price.monthlyUsd === 0) return 0;
  return interval === 'monthly' ? plan.price.monthlyUsd : plan.price.annualMonthlyUsd;
}

/** Intl options shared by SSR renderInnerHTML and client hydration. */
export const PLAN_PRICE_FLOW_FORMAT: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

/** Percent saved vs paying monthly × 12 (paid plans only). */
export function annualSavingsPercent(plan: PlanDefinition): number {
  const { monthlyUsd, annualUsd } = plan.price;
  if (monthlyUsd === 0 || annualUsd === 0) return 0;
  const yearlyIfMonthly = monthlyUsd * 12;
  return Math.round(((yearlyIfMonthly - annualUsd) / yearlyIfMonthly) * 100);
}

export function maxAnnualSavingsPercent(): number {
  return Math.max(0, ...PLANS.map(annualSavingsPercent));
}

export function formatPlanPriceDisplay(
  plan: PlanDefinition,
  interval: BillingInterval,
): PriceParts {
  const perSeat = plan.id === 'team';
  if (plan.price.monthlyUsd === 0) {
    return { amount: '$0', unit: 'Free forever' };
  }
  if (interval === 'monthly') {
    return formatPriceParts(plan.price.monthlyUsd, perSeat);
  }
  const monthly = plan.price.annualMonthlyUsd;
  const amount = Number.isInteger(monthly) ? `$${monthly}` : `$${monthly.toFixed(2)}`;
  return {
    amount,
    unit: perSeat ? 'per seat / month, billed annually' : 'per month, billed annually',
  };
}

/** Secondary line under the headline price for the active billing interval. */
export function formatPlanPriceNote(
  plan: PlanDefinition,
  interval: BillingInterval,
): string | null {
  if (plan.price.annualUsd === 0) return null;
  const per = plan.id === 'team' ? ' per seat' : '';
  if (interval === 'monthly') {
    const pct = annualSavingsPercent(plan);
    return `$${plan.price.annualUsd}${per}/yr · save ${pct}% vs monthly`;
  }
  return `$${plan.price.annualUsd}${per} billed yearly`;
}

/** @deprecated Use formatPlanPriceNote — kept for callers that need the old copy. */
export function formatAnnualSubline(plan: PlanDefinition): string | null {
  return formatPlanPriceNote(plan, 'monthly');
}

const JSONLD_ORG_ID = `${SITE_ORIGIN}/#organization` as const;
const JSONLD_WEBSITE_ID = `${SITE_ORIGIN}/#website` as const;
const JSONLD_CLI_ID = `${SITE_ORIGIN}/#cinch-cli` as const;

export function pricingPageStructuredData(): Record<string, unknown> {
  const pricingUrl = `${SITE_ORIGIN}/pricing/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': JSONLD_WEBSITE_ID,
        url: SITE_ORIGIN,
        name: 'Cinch',
        publisher: { '@id': JSONLD_ORG_ID },
      },
      {
        '@type': 'WebPage',
        '@id': `${pricingUrl}#webpage`,
        url: pricingUrl,
        name: 'Cinch Pricing',
        description:
          'Free, Pro, and Team plans for Cinch remote clipboard sync. Same encryption and apps on every tier; paid plans add capacity.',
        isPartOf: { '@id': JSONLD_WEBSITE_ID },
        about: { '@id': JSONLD_CLI_ID },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': JSONLD_CLI_ID,
        name: 'Cinch',
        url: SITE_ORIGIN,
        applicationCategory: 'DeveloperApplication',
        offers: PLANS.map((plan) => ({
          '@type': 'Offer',
          name: plan.name,
          price: plan.price.monthlyUsd,
          priceCurrency: 'USD',
          description: plan.tagline,
        })),
      },
      {
        '@type': 'Organization',
        '@id': JSONLD_ORG_ID,
        name: 'Cinch',
        url: SITE_ORIGIN,
        sameAs: [urls.githubHome],
      },
    ],
  };
}
