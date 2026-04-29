# Cinch CLI — SEO Implementation Roadmap

**Date:** 2026-04-29  
**Site:** https://cinchcli.com  
**Framework:** Astro 6 + Starlight + Cloudflare Pages

---

## Phase 1: Foundation (Weeks 1–4 — May 2026)

**Goal:** Fix all technical gaps; launch 5 core pages; establish schema coverage.

### Technical

- [ ] Add `BreadcrumbList` JSON-LD to all docs pages (via Starlight head injection)
- [ ] Add `FAQPage` JSON-LD to FAQ page and comparison pages
- [ ] Add `HowTo` JSON-LD to all use-case pages
- [ ] Add `TechArticle` schema to docs pages (supplement existing `SoftwareApplication`)
- [ ] Publish `llms.txt` at `/llms.txt` listing all key pages for AI crawlers
- [ ] Verify `SoftwareApplication` schema completeness: add `featureList`, `screenshot`, `downloadUrl`
- [ ] Confirm Core Web Vitals baseline via Cloudflare Analytics or PageSpeed Insights
- [ ] Verify no broken internal links (run `npx astro check` + link checker)
- [ ] Confirm sitemap includes all published pages

### Content

- [ ] Create `/use-cases/ssh` page
- [ ] Create `/use-cases/neovim` page
- [ ] Create `/use-cases/tmux` page
- [ ] Create `/compare/osc-52` page
- [ ] Create `/security` page
- [ ] Create `/changelog` page (can be simple Markdown list initially)
- [ ] Add "Use Cases" section to main nav

### Analytics

- [ ] Confirm Google Search Console verified and sitemap submitted
- [ ] Set up Cloudflare Web Analytics (or Plausible) for organic traffic tracking
- [ ] Annotate baseline metrics (indexed pages, GSC impressions)

---

## Phase 2: Expansion (Weeks 5–12 — June–July 2026)

**Goal:** Launch blog; publish 4 posts; add remaining use-case and comparison pages.

### Technical

- [ ] Add `BlogPosting` / `Article` JSON-LD to blog post layout
- [ ] Create `/blog` index page with pagination (Astro content collections)
- [ ] Add `author` schema fields (link to GitHub profile for E-E-A-T)
- [ ] Add `datePublished` and `dateModified` to all content pages
- [ ] Submit new pages to GSC as they publish
- [ ] Internal link audit: ensure every new page has ≥ 2 inbound links

### Content

- [ ] Launch blog with Post 1: "Why Copy-Paste Breaks Over SSH"
- [ ] Post 2: "Vim Clipboard Over SSH Guide"
- [ ] Post 3: "tmux Clipboard Not Working? Every Fix"
- [ ] Post 4: "Copy Text Out of a Docker Container"
- [ ] Create `/use-cases/docker` page
- [ ] Create `/compare/lemonade` page
- [ ] Create `/compare/clipper` page
- [ ] Add "Compare" links to footer nav

### Off-Page / Link Building

- [ ] Submit to awesome-neovim list (GitHub PR)
- [ ] Submit to awesome-cli-apps list
- [ ] Submit to awesome-selfhosted if relay is the primary CTA
- [ ] Post to Hacker News "Show HN" (coordinate with product launch if not already done)
- [ ] Post to r/vim, r/tmux, r/commandline subreddits

---

## Phase 3: Scale (Weeks 13–24 — August–September 2026)

**Goal:** 1,000+ monthly organic visits; 20+ keywords in top 10; GEO footprint established.

### Technical

- [ ] Implement `SiteLinksSearchBox` schema on homepage
- [ ] Add structured comparison tables (HTML `<table>` — parseable by AI Overviews)
- [ ] Performance audit: verify LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Check AI visibility: is cinchcli.com cited in Perplexity / ChatGPT for primary queries?
- [ ] Add `hreflang` if any localization is planned

### Content

- [ ] Post 5: "Self-Hosting a Clipboard Sync Server"
- [ ] Post 6: "Clipboard Sync for AI Agents"
- [ ] Post 7: "Developer's Guide to Clipboard Security"
- [ ] Post 8: "SSH Tips for Remote Development 2026"
- [ ] Create `/use-cases/ci-cd` page
- [ ] Add author bio section to all blog posts (photo + GitHub link)
- [ ] Add "Last reviewed" date to all comparison pages

### Off-Page

- [ ] Reach out to 3–5 Neovim/tmux newsletter authors for mentions
- [ ] Guest post on dev.to or Terminal Trove about remote clipboard problem
- [ ] Engage in relevant GitHub Discussions / issues where users ask about remote clipboard

---

## Phase 4: Authority (Months 7–12 — October 2026+)

**Goal:** Thought leadership; DA 20+; AI search citations; 5,000+ monthly organic visits.

### Technical

- [ ] Implement `Organization` schema with `sameAs` links (GitHub, Hacker News, npm, Homebrew tap)
- [ ] Add FAQ sections to all high-value pages (with `FAQPage` schema)
- [ ] Review and update all comparison pages with current data
- [ ] Automate "Last updated" metadata from git commit timestamps

### Content

- [ ] Post 9: "OSC 52 Explained" (deep technical authority piece)
- [ ] Post 10: "Clipboard-Aware CI/CD Pipeline"
- [ ] Case study: developer workflow before/after cinch
- [ ] Create `/docs/protocol` deep-dive page (technical authority)
- [ ] Annual "State of Remote Development" post with original data (survey GitHub users)

### Off-Page

- [ ] Apply for inclusion in relevant developer newsletters (TLDR, Pointer, etc.)
- [ ] Respond to Hacker News / Reddit threads where remote clipboard is discussed
- [ ] Reach out to Neovim/tmux plugin authors for integration mentions
- [ ] Monitor for AI citation gaps; add targeted content where cinch is not yet cited

---

## Resource Requirements

| Phase | Effort (person-hours/week) | Owner |
|-------|---------------------------|-------|
| Foundation | 4–6 hrs/week | Core team |
| Expansion | 6–8 hrs/week | Core team + 1 writer |
| Scale | 6–8 hrs/week | Core team + writer |
| Authority | 4–6 hrs/week | Core team (maintenance) |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Low domain authority limits early rankings | Focus on long-tail, low-competition queries first |
| Comparison page legal concerns | Make only verifiable factual claims; add "Last reviewed" dates |
| Blog content quality | All posts require working code examples tested against current cinch version |
| OSC 52 awareness content cannibalizes itself | Ensure each OSC 52 page clearly positions cinch as the better alternative with a CTA |
