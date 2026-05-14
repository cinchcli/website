import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cinchcli.com',
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8090',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          ws: true,
        },
      },
    },
  },
  integrations: [
    starlight({
      title: 'Cinch',
      logo: {
        dark:  './src/assets/lockup-dark-icon.svg',
        light: './src/assets/lockup-light-icon.svg',
      },
      social: [
        { icon: 'github',  label: 'GitHub',  href: 'https://github.com/cinchcli/cinch' },
      ],
      editLink: {
        baseUrl: 'https://github.com/cinchcli/website/edit/main/',
      },
      lastUpdated: true,
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Overview',      slug: 'docs' },
            { label: 'Installation',  slug: 'docs/getting-started' },
            { label: 'Quick Start',   slug: 'docs/quick-start' },
          ],
        },
        {
          label: 'CLI Reference',
          items: [
            { label: 'cinch push', slug: 'docs/cli/push' },
            { label: 'cinch pull', slug: 'docs/cli/pull' },
            { label: 'cinch auth', slug: 'docs/cli/auth' },
          ],
        },
        {
          label: 'Relay',
          items: [
            { label: 'Self-hosting',  slug: 'docs/relay/self-hosting' },
            { label: 'Configuration', slug: 'docs/relay/configuration' },
            { label: 'Protocol',      slug: 'docs/relay/protocol' },
          ],
        },
        {
          label: 'Integrations',
          items: [
            { label: 'cinch.vim', slug: 'docs/vim-plugin' },
          ],
        },
        {
          label: 'More',
          items: [
            { label: 'Why Cinch',           slug: 'docs/why-cinch' },
            { label: 'Privacy & Retention', slug: 'docs/privacy-retention' },
            { label: 'FAQ',                 slug: 'docs/faq' },
            { label: 'Comparison',          slug: 'docs/comparison' },
            {
              label: 'Changelog',
              link:  'https://github.com/cinchcli/cinch/releases',
              attrs: { target: '_blank', rel: 'noopener noreferrer' },
            },
            {
              label: 'Discussions',
              link:  'https://github.com/cinchcli/cinch/discussions',
              attrs: { target: '_blank', rel: 'noopener noreferrer' },
            },
          ],
        },
      ],
      customCss: ['./src/styles/starlight.css'],
      components: {
        Footer: './src/components/overrides/StarlightFooter.astro',
        SiteTitle: './src/components/overrides/StarlightSiteTitle.astro',
      },
      head: [
        { tag: 'link', attrs: { rel: 'icon',             href: '/favicon.ico',          sizes: '32x32' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'manifest',         href: '/site.webmanifest' } },
        { tag: 'meta', attrs: { name: 'theme-color',     content: '#4FB3A9' } },
        { tag: 'meta', attrs: { property: 'og:image',    content: 'https://cinchcli.com/og-image.png' } },
        { tag: 'meta', attrs: { property: 'og:site_name',content: 'Cinch' } },
        { tag: 'meta', attrs: { name: 'twitter:card',    content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image',   content: 'https://cinchcli.com/og-image.png' } },
        // Geist (UI + headings) + Geist Mono — async to avoid render-blocking
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
        {
          tag: 'link',
          attrs: {
            rel:    'preload',
            as:     'style',
            href:   'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Geist:wght@400;500;600;700;800&display=swap',
            onload: "this.rel='stylesheet'",
          },
        },
        {
          tag: 'noscript',
          content: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Geist:wght@400;500;600;700;800&display=swap">',
        },
        // Analytics
        { tag: 'script', attrs: { defer: true, src: 'https://umami.jinmu.me/script.js', 'data-website-id': '9c8818d2-8496-48cd-a55d-81e6e3979078' } },
      ],
      disable404Route: false,
    }),
    mdx(),
    sitemap(),
  ],
});
