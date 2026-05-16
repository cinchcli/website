/**
 * Single source of truth for outbound GitHub and “social header” URLs used by Astro + Starlight.
 * Prefer importing here over hardcoding URLs in components or markdown fragments.
 */

export const GITHUB_ORIGIN = 'https://github.com' as const;

export const SITE_ORIGIN = 'https://cinchcli.com' as const;

/** Fully qualified repository roots */
export const repo = {
  cinchCli: `${GITHUB_ORIGIN}/cinchcli/cinch`,
  desktop: `${GITHUB_ORIGIN}/cinchcli/desktop`,
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
  desktopLatestRelease: `${repo.desktop}/releases/latest`,
  desktopLatestManifest: `${repo.desktop}/releases/latest/download/latest.json`,
  /** Starlight docs “edit this page” */
  docsEditBase: `${repo.website}/edit/main/`,
  relayGitCloneHttps: `${repo.relay}.git`,
  vimHome: repo.vim,
} as const;

export function desktopDmgHref(version: string): string {
  const v = version.trim();
  return `${repo.desktop}/releases/download/desktop-v${v}/Cinch_${v}_aarch64.dmg`;
}

/** Starlight sidebar header social icons */
export const starlightSocial = [
  { icon: 'github' as const, label: 'GitHub', href: urls.githubHome },
] as const;

/** Default JSON-LD when a page does not pass custom `jsonLd` into `Landing`. */
export function defaultLandingStructuredData(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Cinch CLI',
        description:
          'Open-source remote clipboard tool for developers. Push from any terminal, pull on any machine via WebSocket relay.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'macOS, Linux, Windows',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        license: 'https://opensource.org/licenses/AGPL-3.0',
        url: SITE_ORIGIN,
        downloadUrl: `${SITE_ORIGIN}/download`,
        author: { '@id': '#organization' },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Cinch Desktop',
        description:
          'macOS menubar app that receives clipboard syncs automatically via the Cinch relay.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'macOS',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        license: 'https://opensource.org/licenses/AGPL-3.0',
        url: SITE_ORIGIN,
        downloadUrl: urls.desktopLatestRelease,
        author: { '@id': '#organization' },
      },
      {
        '@type': 'Organization',
        '@id': '#organization',
        name: 'Cinch',
        url: SITE_ORIGIN,
        sameAs: [urls.githubHome],
      },
    ],
  };
}
