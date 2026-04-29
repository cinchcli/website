# Cinch CLI — SEO Strategy

**Date:** 2026-04-29  
**Site:** https://cinchcli.com  
**Industry:** Developer Tools / Open-Source CLI SaaS  
**Template Applied:** SaaS

---

## 1. Business Context

**Product:** Cinch is an open-source (AGPL 3.0) remote clipboard tool that lets developers copy text/code from any terminal (SSH, Vim, tmux, CI runners, containers) and paste it instantly on any machine via a WebSocket-powered relay.

**Core differentiator:** Works universally — no OSC 52 hacks, no terminal support required, no SSH flags. Pure HTTPS, self-hostable, Unix-native (stdin/stdout).

**Target audience:**
- Primary: Backend/DevOps/SRE engineers working heavily in SSH and remote terminals
- Secondary: Neovim/tmux power users, platform engineers, AI agent builders
- Tertiary: Security-conscious developers who self-host their tools

**Business model:** Open-source product with self-hosting option; potential future hosted relay (freemium).

---

## 2. Current SEO Baseline

| Signal | Status |
|--------|--------|
| Sitemap | ✅ Auto-generated (sitemap-index.xml) |
| robots.txt | ✅ Configured (allows all) |
| JSON-LD SoftwareApplication | ✅ Present on homepage |
| OG / Twitter meta | ✅ Present |
| Core content pages | ✅ Docs (Overview, Quick Start, CLI ref, Relay) |
| Comparison pages | ❌ Missing |
| Use-case landing pages | ❌ Missing |
| Blog / content hub | ❌ Missing |
| Author E-E-A-T signals | ❌ Missing |
| `/pricing` page | ❌ No pricing page (free/self-host model needs explanation) |

---

## 3. Keyword Strategy

### Primary Keywords (high intent, long-tail)

| Keyword | Intent | Priority |
|---------|--------|----------|
| remote clipboard linux terminal | Informational/Tool | P1 |
| copy paste over ssh | Problem-aware | P1 |
| clipboard sync ssh session | Problem-aware | P1 |
| osc 52 alternative | Solution-aware | P1 |
| tmux clipboard remote | Problem-aware | P2 |
| self hosted clipboard sync | Solution-aware | P2 |
| copy from ssh to local clipboard | Problem-aware | P2 |
| neovim remote clipboard | Problem-aware | P2 |
| clipboard sync across machines developer | Informational | P2 |
| terminal clipboard sync tool | Informational | P3 |

### Branded / Competitor Keywords

| Keyword | Type |
|---------|------|
| cinch cli | Brand |
| cinchcli | Brand |
| osc 52 vs cinch | Comparison |
| clipper vs cinch | Comparison |
| lemonade clipboard alternative | Comparison |

### Long-tail Content Keywords

- "how to copy from ssh to mac clipboard"
- "vim yank to system clipboard ssh"
- "tmux clipboard not working remote"
- "copy text from docker container to clipboard"
- "share clipboard between linux machines"

---

## 4. Content Pillars

### Pillar 1: Remote Clipboard Problem (Awareness)
Educational content explaining why clipboard over SSH is hard and what solutions exist.

### Pillar 2: Cinch How-To Guides (Consideration)
Step-by-step guides for specific environments: SSH, Neovim, tmux, Docker, CI/CD.

### Pillar 3: Comparisons (Decision)
Direct comparisons against OSC 52, lemonade, pbcopy, clipper, Clipcat.

### Pillar 4: Self-Hosting (Retention)
Relay setup guides for Fly.io, VPS, Docker Compose — reduces churn, builds trust.

---

## 5. E-E-A-T Strategy

**Experience:** Add contributor/author pages with GitHub profiles and real usage testimonials.

**Expertise:** Document the protocol spec, security model, and encryption approach in detail.

**Authoritativeness:** 
- Get listed in awesome-neovim, awesome-cli-apps, awesome-selfhosted
- Contribute to relevant blog posts on Terminal Trove, Hacker News, dev.to
- Target GitHub stars ≥ 500 as a trust signal in schema

**Trustworthiness:**
- Add Security page (responsible disclosure, AGPL license details)
- Add Privacy page (already exists — ensure it's complete)
- Publish roadmap transparently

---

## 6. Technical SEO Priorities

### Already Done
- Sitemap, robots.txt, canonical tags, OG meta, SoftwareApplication schema

### To Implement

1. **BreadcrumbList schema** on all docs pages
2. **FAQPage schema** on FAQ and comparison pages
3. **HowTo schema** on tutorial/guide pages
4. **TechArticle schema** on all doc pages (upgrade from none)
5. **SiteLinksSearchBox** schema on homepage
6. `llms.txt` for AI crawler discoverability (GEO readiness)
7. Structured comparison tables (machine-readable for AI Overviews)
8. Performance: ensure LCP < 2.5s, CLS < 0.1, INP < 200ms on Cloudflare Pages

---

## 7. KPI Targets

| Metric | Baseline (now) | 3 Month | 6 Month | 12 Month |
|--------|---------------|---------|---------|----------|
| Organic Traffic (monthly) | ~0 (new site) | 200 | 1,000 | 5,000 |
| Keyword Rankings (top 10) | 0 | 5 | 20 | 60 |
| Indexed Pages | ~15 | 25 | 40 | 80+ |
| Domain Authority (Moz DA) | ~1 | 5 | 15 | 25 |
| GitHub Stars (trust signal) | unknown | +100 | +300 | +800 |
| Core Web Vitals | unknown | All green | All green | All green |

---

## 8. Success Criteria Per Phase

| Phase | Key Outcome |
|-------|-------------|
| Foundation (wks 1–4) | All core pages indexed; schema valid; no crawl errors |
| Expansion (wks 5–12) | 5+ keywords in top 20; blog launched with 6 posts |
| Scale (wks 13–24) | 20+ keywords top 10; 1,000+ monthly organic visits |
| Authority (mo 7–12) | Cited in AI Overviews for primary queries; DA 20+ |
