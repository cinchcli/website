# Cinch Website

Marketing and docs site for [cinchcli.com](https://cinchcli.com).

## Built with

- [Astro](https://astro.build/) — static site framework
- [Starlight](https://starlight.astro.build/) — docs theme for Astro

## Development

```bash
npm install
npm run dev
```

## Deploy

Auto-deploys to Cloudflare Pages on push to `main` via GitHub Actions (`.github/workflows/deploy.yml`).

- **Build command:** `npm run build`
- **Output directory:** `dist/`
- **Cloudflare Pages project:** `cinchcli-website`

## Design system

`DESIGN.md` in this repo is the canonical design system for Cinch. All font choices, colors, spacing, and aesthetic direction are defined there. Do not deviate without explicit approval.
