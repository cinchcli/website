/**
 * Public pricing data for cinchcli.com. Keep in sync with biz/PRICING.md.
 *
 * Product model: Cinch is free and open source. Users can self-host the relay.
 * The public hosted relay is a best-effort onboarding surface. Commercial
 * support is handled case by case.
 */

import { SITE_ORIGIN, urls } from './social';

export type PlanId = 'free' | 'hosted' | 'commercial';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  tagline: string;
  priceLabel: string;
  priceNote: string;
  bullets: readonly string[];
  recommended?: boolean;
  cta: 'get-started' | 'contact';
}

export const PLANS: PlanDefinition[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Open-source developer clipboard for local and self-hosted use.',
    priceLabel: '$0',
    priceNote: 'Free and open source',
    bullets: [
      'CLI, desktop app, and local clipboard history',
      'MCP tools, transforms, and redaction',
      'Self-host the relay on your own infrastructure',
    ],
    cta: 'get-started',
  },
  {
    id: 'hosted',
    name: 'Hosted relay',
    tagline: 'Try cross-machine clipboard without running your own relay.',
    priceLabel: '$0',
    priceNote: 'Free public relay',
    bullets: [
      'Cinch-operated public relay',
      '7-day hosted retention',
      'Best-effort availability',
      'Fair-use and abuse limits',
    ],
    recommended: true,
    cta: 'get-started',
  },
  {
    id: 'commercial',
    name: 'Commercial support',
    tagline: 'Deployment and support help for teams adopting Cinch.',
    priceLabel: 'Custom',
    priceNote: 'Contact us',
    bullets: [
      'Self-hosting setup help',
      'Deployment guidance',
      'Hosted-to-self-hosted migration help',
      'Support agreement discussion',
    ],
    cta: 'contact',
  },
];

export const PRICING_TAGLINE =
  'Cinch is free and open source. Use the hosted relay, or self-host the relay when you want full control.';

export const SELF_HOST_SECTION = {
  title: 'Self-hosting stays free',
  lead:
    'Run the relay yourself when you want full infrastructure control. The hosted relay is for onboarding and trying the remote clipboard loop, not a required subscription.',
  bullets: [
    'Single Go binary or Docker image on any VPS',
    'Same encrypted relay protocol as hosted',
    'Point the CLI and desktop app at your URL with --relay',
  ] as const,
  primaryCta: { label: 'Self-hosting guide', href: '/docs/relay/self-hosting/' },
  secondaryCta: { label: 'Configuration reference', href: '/docs/relay/configuration/' },
} as const;

export const BILLING_FAQ = [
  {
    q: 'Is Cinch free?',
    a: 'Yes. The CLI, desktop app, local store, MCP server, transforms, and self-hosted relay are free and open source.',
  },
  {
    q: 'How does hosted relay access work?',
    a: 'Hosted relay access is free, best-effort, subject to fair-use and abuse limits, and keeps the current 7-day hosted retention default.',
  },
  {
    q: 'Should I self-host?',
    a: 'Self-host when you need infrastructure control, stronger uptime expectations, private network boundaries, or custom retention.',
  },
  {
    q: 'What is commercial support?',
    a: 'Commercial support is for self-hosting setup help, migration support, deployment guidance, and support agreement discussions. It is not required to use Cinch.',
  },
] as const;

export const CONTACT_EMAIL = 'contact@cinchcli.com' as const;

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
          'Free open-source remote clipboard for developer context with hosted relay access and commercial support.',
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
          price: plan.id === 'commercial' ? undefined : 0,
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
