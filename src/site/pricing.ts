/**
 * Public pricing data for cinchcli.com — keep in sync with biz/PRICING.md and biz/src/types.ts PLAN_LIMITS.
 *
 * Product model: the AI clipboard core is free/open source. Paid plans are for
 * the hosted relay we operate, not for locking local AI/MCP features away.
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
    name: 'Hosted Relay Free',
    tagline: 'Free hosted sync for personal use.',
    price: { monthlyUsd: 0, annualUsd: 0, annualMonthlyUsd: 0 },
    limits: PLAN_LIMITS.free,
    checkoutUrl: null,
    cta: 'get-started',
  },
  {
    id: 'pro',
    name: 'Hosted Relay Plus',
    tagline: 'More devices and deeper hosted history.',
    price: { monthlyUsd: 4, annualUsd: 36, annualMonthlyUsd: 3 },
    limits: PLAN_LIMITS.pro,
    recommended: true,
    checkoutUrl: null,
    cta: 'coming-soon',
  },
  {
    id: 'team',
    name: 'Commercial',
    tagline: 'Support, private hosting, and custom terms.',
    price: { monthlyUsd: 0, annualUsd: 0, annualMonthlyUsd: 0 },
    limits: PLAN_LIMITS.team,
    checkoutUrl: null,
    cta: 'contact',
  },
];

export const PRICING_TAGLINE =
  'Cinch is a free, open-source AI clipboard. Pay only when you want us to run the relay for you.';

/** Self-host callout on /pricing (not a separate plan — works with every tier). */
export const SELF_HOST_SECTION = {
  title: 'Self-hosting stays free',
  lead:
    'The CLI, local MCP server, transforms, desktop app, and relay are available without a feature paywall. Run your own relay when you want full infrastructure control.',
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
    title: 'Hosted capacity',
    body: 'Plus lifts the hosted relay cap to 10 devices — laptop, work Mac, a few VMs, and a CI runner.',
  },
  {
    title: 'History depth',
    body: 'Plus keeps 90 days of hosted relay history vs. 7 days on Free. Local clipboard history remains on-device and is not capped by relay retention.',
  },
  {
    title: 'Trust by default',
    body: 'AI clipboard features stay local and open. Hosted plans are about uptime, retention, and support, not access to your own data.',
  },
] as const;

export const BILLING_FAQ = [
  {
    q: 'How does billing work?',
    a: 'Hosted Relay Free requires no card. Hosted Relay Plus is a flat subscription for one user. Commercial support and private hosting are handled directly.',
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
  { label: 'Local MCP server for AI tools', free: true, pro: true, team: true },
  { label: 'Local transforms and redaction', free: true, pro: true, team: true },
  { label: 'macOS desktop app', free: true, pro: true, team: true },
  { label: 'CLI (Linux / macOS / Windows)', free: true, pro: true, team: true },
  { label: 'Real-time WebSocket sync', free: true, pro: true, team: true },
  { label: 'Searchable local history (FTS5)', free: true, pro: true, team: true },
  { label: 'Local history retention', free: 'Unlimited on device', pro: 'Unlimited on device', team: 'Unlimited on device' },
  { label: 'Self-hosted relay support', free: true, pro: true, team: true },
  { label: 'Hosted relay devices', free: '3', pro: '10', team: 'Custom' },
  { label: 'Hosted relay retention', free: '7 days', pro: '90 days', team: 'Custom' },
  { label: 'Commercial support agreement', free: false, pro: false, team: true },
  { label: 'Private hosted relay', free: false, pro: false, team: 'Available' },
  { label: 'Priority support', free: false, pro: 'Email (48 h)', team: 'Custom SLA' },
];

export const CONTACT_EMAIL = 'contact@cinchcli.com' as const;

export function formatDeviceLimit(n: number | null): string {
  if (n === null) return 'Custom';
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
    return ['Custom hosted relay limits', 'Private hosting available', 'Commercial support terms', core];
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
  if (plan.cta === 'contact') {
    return { amount: 'Custom', unit: 'Contact us' };
  }
  const perSeat = false;
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
  if (plan.cta === 'contact') return null;
  if (plan.price.annualUsd === 0) return null;
  const per = '';
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
          'Free open-source AI clipboard with optional paid hosted relay capacity.',
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
