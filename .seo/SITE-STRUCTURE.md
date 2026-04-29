# Cinch CLI — Site Structure & URL Architecture

**Date:** 2026-04-29

---

## Recommended URL Hierarchy

```
cinchcli.com/
├── / (Home — value prop, hero, use cases, features, CTA)
│
├── /docs/ (Starlight — existing, keep as-is)
│   ├── /docs/getting-started
│   ├── /docs/quick-start
│   ├── /docs/cli/push
│   ├── /docs/cli/pull
│   ├── /docs/cli/auth
│   ├── /docs/relay/ (self-hosting)
│   ├── /docs/faq
│   └── /docs/comparison (internal comparison table — short version)
│
├── /use-cases/ (NEW — solution pages per environment)
│   ├── /use-cases/ssh          "Copy from SSH to local clipboard"
│   ├── /use-cases/neovim       "Neovim remote clipboard over SSH"
│   ├── /use-cases/tmux         "tmux clipboard sync across machines"
│   ├── /use-cases/docker       "Clipboard inside Docker containers"
│   └── /use-cases/ci-cd        "Clipboard in CI/CD pipelines"
│
├── /compare/ (NEW — comparison landing pages)
│   ├── /compare/osc-52         "Cinch vs OSC 52"
│   ├── /compare/lemonade       "Cinch vs Lemonade"
│   └── /compare/clipper        "Cinch vs Clipper"
│
├── /blog/ (NEW — content hub)
│   ├── /blog/copy-paste-over-ssh-guide
│   ├── /blog/vim-clipboard-ssh
│   ├── /blog/tmux-clipboard-not-working
│   ├── /blog/self-host-clipboard-sync
│   └── ... (ongoing)
│
├── /security (NEW — responsible disclosure, AGPL, privacy model)
│
└── /changelog (NEW — product updates, builds trust and freshness signals)
```

---

## Page Priority Matrix

| URL | Priority | Keyword Target | Schema |
|-----|----------|---------------|--------|
| / | Critical | cinch cli, remote clipboard tool | SoftwareApplication, Organization, WebSite |
| /use-cases/ssh | High | copy paste over ssh | HowTo, FAQPage |
| /use-cases/neovim | High | neovim remote clipboard | HowTo |
| /use-cases/tmux | High | tmux clipboard sync | HowTo |
| /compare/osc-52 | High | osc 52 alternative | FAQPage |
| /compare/lemonade | Medium | lemonade clipboard alternative | FAQPage |
| /use-cases/docker | Medium | clipboard docker container | HowTo |
| /blog/* | Medium | long-tail problem queries | BlogPosting, Article |
| /security | Medium | trust signal (no keyword target) | — |
| /changelog | Low | brand freshness | — |

---

## Internal Linking Strategy

### Hub → Spoke Pattern
- Homepage → all use-case pages (via "Use Cases" nav section)
- Each use-case page → relevant docs page + blog posts
- Comparison pages → use-case pages + docs

### Contextual Links
- Every doc page should link to the most relevant use-case page
- Blog posts should link to use-case pages (CTA) and docs (supporting detail)
- FAQ → use-case pages for deeper reading

### Navigation Changes Recommended
- Add "Use Cases" dropdown to main nav (linking to /use-cases/*)
- Add "Compare" link in footer
- Add blog link in header once 4+ posts published

---

## URL Conventions

- All lowercase, hyphen-separated: `/use-cases/docker-container` ✅
- No trailing slashes (Astro default with `trailingSlash: 'never'`)
- Short, descriptive slugs — avoid keyword stuffing
- Docs stay under `/docs/` (Starlight handles them)

---

## Sitemap Quality Gates

- [ ] All pages have a unique `<title>` (50–60 chars)
- [ ] All pages have a unique `<meta description>` (140–160 chars)
- [ ] No duplicate content between use-case pages and docs
- [ ] All images have descriptive `alt` text
- [ ] Internal links use descriptive anchor text (not "click here")
- [ ] All comparison pages clearly updated with "Last reviewed" date
