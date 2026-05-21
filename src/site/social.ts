/**
 * Single source of truth for outbound GitHub and “social header” URLs used by Astro + Starlight.
 * Prefer importing here over hardcoding URLs in components or markdown fragments.
 */

export const GITHUB_ORIGIN = 'https://github.com' as const;

export const SITE_ORIGIN = 'https://cinchcli.com' as const;

/**
 * Fully qualified repository roots.
 *
 * Post Phase 4 migration, the CLI, desktop app, and shared client library
 * all live in `cinchcli/cinch`. The legacy `cinchcli/desktop` and
 * `cinchcli/cinch-core` repos are archived. `repo.desktop` is kept as an
 * alias for callers that semantically want "the desktop's repo".
 */
const CINCH_MONOREPO = `${GITHUB_ORIGIN}/cinchcli/cinch` as const;

export const repo = {
  cinchCli: CINCH_MONOREPO,
  desktop: CINCH_MONOREPO,
  website: `${GITHUB_ORIGIN}/cinchcli/website`,
  relay: `${GITHUB_ORIGIN}/cinchcli/relay`,
  vim: `${GITHUB_ORIGIN}/cinchcli/cinch.vim`,
} as const;

/** Common paths derived from repos */
export const urls = {
  /** Primary repo link (nav, footer, footer social icons, structured data sameAs, Starlight social) */
  githubHome: repo.cinchCli,
  changelog: `${repo.cinchCli}/releases`,
  cliLatestReleaseZip: `${repo.cinchCli}/releases/latest`,
  discussions: `${repo.cinchCli}/discussions`,
  desktopLatestRelease: `${repo.cinchCli}/releases/latest`,
  desktopLatestManifest: `${repo.cinchCli}/releases/latest/download/latest.json`,
  /** Starlight docs “edit this page” */
  docsEditBase: `${repo.website}/edit/main/`,
  relayGitCloneHttps: `${repo.relay}.git`,
  vimHome: repo.vim,
} as const;

export function desktopDmgHref(version: string): string {
  const v = version.trim();
  // Monorepo release path: release/<version>/Cinch_<version>_aarch64.dmg
  return `${repo.cinchCli}/releases/download/release/${v}/Cinch_${v}_aarch64.dmg`;
}

/** Starlight sidebar header social icons */
export const starlightSocial = [
  { icon: 'github' as const, label: 'GitHub', href: urls.githubHome },
] as const;

const JSONLD_ORG_ID = `${SITE_ORIGIN}/#organization` as const;
const JSONLD_WEBSITE_ID = `${SITE_ORIGIN}/#website` as const;
const JSONLD_CLI_ID = `${SITE_ORIGIN}/#cinch-cli` as const;
const JSONLD_DESKTOP_ID = `${SITE_ORIGIN}/#cinch-desktop` as const;

/** Core software + organization nodes (absolute @id URLs for stable JSON-LD graph). */
function cinchSoftwareAndOrgGraph(): Record<string, unknown>[] {
  return [
    {
      '@type': 'SoftwareApplication',
      '@id': JSONLD_CLI_ID,
      name: 'Cinch CLI',
      description:
        'Open-source remote clipboard tool for developers. Push from any terminal, pull on any machine via WebSocket relay.',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'macOS, Linux, Windows',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      license: 'https://opensource.org/licenses/AGPL-3.0',
      url: SITE_ORIGIN,
      downloadUrl: `${SITE_ORIGIN}/download`,
      author: { '@id': JSONLD_ORG_ID },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': JSONLD_DESKTOP_ID,
      name: 'Cinch Desktop',
      description:
        'macOS menubar app that receives clipboard syncs automatically via the Cinch relay.',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'macOS',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      license: 'https://opensource.org/licenses/AGPL-3.0',
      url: SITE_ORIGIN,
      downloadUrl: urls.desktopLatestRelease,
      author: { '@id': JSONLD_ORG_ID },
    },
    {
      '@type': 'Organization',
      '@id': JSONLD_ORG_ID,
      name: 'Cinch',
      url: SITE_ORIGIN,
      sameAs: [urls.githubHome],
    },
  ];
}

/** Default JSON-LD when a page does not pass custom `jsonLd` into `Landing`. */
export function defaultLandingStructuredData(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': cinchSoftwareAndOrgGraph(),
  };
}

/** Richer graph for /download — WebPage + WebSite clarifies page intent for crawlers. */
export function downloadPageStructuredData(): Record<string, unknown> {
  const downloadUrl = `${SITE_ORIGIN}/download/`;
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
        '@id': `${downloadUrl}#webpage`,
        url: downloadUrl,
        name: 'Download Cinch',
        description:
          'Download the Cinch desktop app for macOS, or install the CLI on Linux and Windows. Free, open source, AGPL 3.0.',
        isPartOf: { '@id': JSONLD_WEBSITE_ID },
        about: [{ '@id': JSONLD_CLI_ID }, { '@id': JSONLD_DESKTOP_ID }],
      },
      ...cinchSoftwareAndOrgGraph(),
    ],
  };
}
