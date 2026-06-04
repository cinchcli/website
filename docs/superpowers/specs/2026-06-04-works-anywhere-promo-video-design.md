# Works Anywhere — Promotional Loop (code-rendered video)

- **Date:** 2026-06-04
- **Status:** Design — pending user review
- **Repo / branch:** `website` · `agent/claude/works-anywhere-video`
- **Owner:** desktop-app promotion

## 1. Context & Goal

The landing page Features section (`src/components/landing/Features.astro`) has a
tab strip. The **"Works Anywhere"** tab (`data-tab="desktop"` → `#tab-desktop`)
currently renders a single static image, `/images/desktop-screenshot.png` —
which is **not present** in `public/images/` (the reference is broken or the
asset is generated elsewhere).

Replace that `panel-visual` slot with a short, **autoplaying, muted, looping**
promotional video that dramatizes cinch's core differentiator: a clip copied on
a remote box **behind a firewall / VPN** lands instantly in the **cinch desktop
app**. The desktop app is the hero of the shot.

The video is authored **in code** with [Remotion](https://www.remotion.dev/)
(React + TypeScript, frame-accurate) and rendered to WebM + MP4. The same
component library is reusable later for a square social crop and a longer launch
cut.

This mirrors an existing, proven pattern in this repo: `LiveWire.astro` is
already a "promo animation made with code" (typewriter terminals, scene
rotation, accessibility labels) living on the same page.

## 2. Scope

**In scope (this spec):**

- One Remotion composition: `WorksAnywhere`, the "cross-boundary single scene"
  story.
- Faithful rebuild of the real desktop UI (`Rail` + `ClipList` + `SourcePill`
  rows) as Remotion React components.
- Format: **16:10, ~7 s, 30 fps, rendered @2×.**
- Integration into `Features.astro` `#tab-desktop`: `<video>` element with WebM +
  MP4 sources and a poster.
- Performance + accessibility: lazy / tab-gated load, `prefers-reduced-motion`
  fallback to the poster, descriptive `aria-label`.

**Out of scope (now, but designed for):**

- Audio / voiceover (the asset is muted by definition in a tab).
- The other three tabs (`Feed AI Context`, `From the Terminal`, `Own the Relay`).
- A separate square (1:1) social crop and a long-form launch film — both reuse
  the same components later (see §14).

## 3. Locked decisions

| Decision | Value | Rationale |
|---|---|---|
| Medium | Remotion → VP9 **WebM** + H.264 **MP4** + **poster PNG** | User chose a real video file; Remotion is best-in-class for React/TS programmatic video and lets us animate the desktop UI natively. |
| Story | Cross-boundary single scene | Shows the actual moat (where copy-paste / OSC-52 dies), desktop-app-centric. |
| Fidelity | Faithful rebuild of the real desktop UI | Promotes the desktop app specifically; full control of the "row slides in" beat. |
| Format | 16:10 · ~7 s · 30 fps · @2× | Matches the desktop-window shape and the landscape `panel-visual` slot. |

## 4. Narrative & storyboard

Logical canvas **1280×800** (16:10); rendered at scale **2×** → **2560×1600**
output. **30 fps, 210 frames = 7.00 s.** Frames below at 30 fps.

| Frames (time) | Beat |
|---|---|
| 0–42 (0.0–1.4 s) | Source terminal (`ssh prod-box — bash`) types `tail -n 20 err.log \| cinch send` with a typewriter reveal + blinking caret. |
| 42–60 (1.4–2.0 s) | Success line `✓ sent · E2EE` appears; a glowing accent "packet" detaches from the terminal. |
| 60–108 (2.0–3.6 s) | Packet travels along the signal path, passing two faint boundary markers labelled **VPN** and **firewall**, into a small **relay (ours)** node that pulses. |
| 108–132 (3.6–4.4 s) | Desktop `ClipList`: a **new `ClipRow` slides in at the top** with a highlight pulse — `SourcePill` `prod-box` · `now` · preview `panic: ttl in ms, not s`. |
| 132–162 (4.4–5.4 s) | Tagline fades in: **"Copied behind a firewall. Already on your desktop."** |
| 162–198 (5.4–6.6 s) | Gentle hold (caret blink, subtle relay pulse). |
| 198–210 (6.6–7.0 s) | Tagline fades out, source terminal resets to empty so frame 210 == frame 0 → **seamless loop**. |

## 5. Composition layout (16:10)

Background `--canvas` `#07080a`. Three zones, left → right:

- **Source terminal (left, ~32 %)** — a `TerminalWindow` matching the website's
  `TerminalWindow.astro` (mac traffic-light dots, mono body, `$` prompt in
  accent, `✓` in success green). Title `ssh prod-box — bash`.
- **Signal path (center)** — a horizontal route with: the animated accent packet,
  two faint vertical boundary markers (`VPN`, `firewall`) the packet crosses, and
  a small `relay (ours)` node that pulses on arrival. Accent glow uses
  `--accent` `#4FB3A9` / `--accent-tint` `#BED9D7`.
- **Desktop app window (right, ~56 %, the hero)** — a `DesktopWindow` frame
  (title bar + traffic lights) containing the real desktop layout: `Rail` (left
  icon strip), a `ClipList` column (section label `Today`, a few resting rows),
  and the new row that slides in. A sliver of `ClipDetail` may show on the right
  edge for depth.

## 6. Visual fidelity — components to mirror

Rebuilt as Remotion components, matched 1:1 to the real desktop source and the
existing static mockups in `cinch/main/apps/desktop/preview/redesign-mockups/`
(`clip-list.html`, `hud.html`, `states.html`).

- **`DesktopWindow`** — rounded window, 1 px border `--border-strong` `#252829`,
  drop shadow consistent with the site's `.desktop-screenshot` (`box-shadow`
  stack in `Features.astro`). Title bar with mac traffic lights.
- **`ClipList`** — 320 px (logical) column, `background --surface-100 #101111`,
  right border. Section label row (`Today` + count), mono 11 px, `--text-faint`.
- **`ClipRow`** — exact anatomy from `cinch/main/apps/desktop/src/components/ClipList.tsx`:
  - Meta line (mono 10.5 px, letter-spacing 0.04em, `--text-faint`):
    `SourcePill` · `·` · time · optional sync-state badge.
  - Preview line (body 13.5 px, `--text-primary`, 2-line clamp).
  - Active / new row: `--accent-subtle` background + `inset 2px 0 0 --accent`
    left edge (the real `rowActive` style).
- **`SourcePill`** — from `SourcePill.tsx`: tinted chip, mono 10 px, radius 999,
  letter-spacing 0.04em, padding `1px 7px`, per-source tint (use the
  porcelain-pastel family for `prod-box`). Label = machine name.
- **`TerminalWindow`** — mirror `src/components/landing/TerminalWindow.astro`
  (mac dots, title bar, mono body, `.term-prompt` accent, `.term-success`).
- **`SignalPath`** — the packet (accent glow with a soft trail), the two boundary
  markers, the relay node; all driven by `interpolate` / `spring` on `frame`.
- **`Tagline`** — bottom-aligned, site display font, fade in/out.

## 7. Design tokens → `video/theme.ts`

Remotion renders standalone (no access to the site's CSS custom properties), so
mirror the **resolved dark-theme values** from `DESIGN.md` into a typed
`theme.ts`:

```
canvas        #07080a   surface100   #101111   surface200   #1b1c1e
textPrimary   #F0EBE0   textMuted    #9c9c9d   textFaint    #6a6b6c
borderStrong  #252829   accent       #4FB3A9   accentHover  #5FC5BA
accentMuted   #3E928A   accentOn     #07080a   accentTint   #BED9D7
success       (from DESIGN.md)        error    (from DESIGN.md)
```

Fonts: embed the **exact site body + mono families** (confirm names from
`astro.config.ts` / `DESIGN.md` at implementation) via `@remotion/fonts` or
local files, so terminal/UI type matches the page. No `any` types — `theme.ts`
exports a typed `Theme` interface (per repo convention).

## 8. Accuracy / honesty constraints

Follow the `LiveWire.astro` HONESTY discipline:

- Cross-machine delivery uses **`cinch send`** (fleet, E2EE) — **not** `cinch copy`
  (local-only). The desktop receives a fleet clip.
- `SourcePill` shows a **remote machine name** (`prod-box`), consistent with how
  remote clips render.
- Timestamp reads `now` (the real `formatTime` returns `just now` for < 60 s).
- "Copied behind a firewall" is truthful: the hosted relay is reached by an
  **outbound** connection from the constrained box, so it crosses NAT/VPN/firewall.
  Consistent with the tab's existing claim "Sign in and it syncs."
- Clip content is realistic (`tail -n 20 err.log | cinch send` → `✓ sent · E2EE`;
  preview `panic: ttl in ms, not s`). No claims the tab copy doesn't already make.

## 9. Technical architecture

**Location:** a self-contained Remotion subproject in the website worktree at
`video/` — its **own** `package.json` / `tsconfig.json`, **not** part of the
Astro/Vite build. Remotion is a dev-time render tool; the site only consumes the
rendered static files.

```
website/
  video/                         # Remotion subproject (isolated deps)
    package.json                 # remotion, @remotion/cli, react; render scripts
    tsconfig.json
    remotion.config.ts
    src/
      Root.tsx                   # registerRoot — registers <Composition WorksAnywhere>
      WorksAnywhere.tsx          # the composition (orchestrates beats by frame)
      theme.ts                   # mirrored design tokens (typed)
      scene.ts                   # typed scene script (commands, machine, clip text)
      components/
        DesktopWindow.tsx
        Rail.tsx
        ClipList.tsx
        ClipRow.tsx
        SourcePill.tsx
        TerminalWindow.tsx
        SignalPath.tsx
        Tagline.tsx
      assets/fonts/...
    out/                         # local render output (gitignored)
  public/
    videos/                      # COMMITTED rendered assets the site serves
      works-anywhere.webm
      works-anywhere.mp4
      works-anywhere-poster.png
```

**Render pipeline** (npm scripts in `video/package.json`):

- `render:webm` → `remotion render WorksAnywhere out/works-anywhere.webm --codec=vp9 --scale=2`
- `render:mp4`  → `remotion render WorksAnywhere out/works-anywhere.mp4 --codec=h264 --scale=2`
- `still:poster`→ `remotion still WorksAnywhere out/works-anywhere-poster.png --frame=150 --scale=2`
- `render:all`  → runs all three, then copies `out/*` into `../public/videos/`.

**Committed output:** the three rendered files live in `public/videos/` and are
committed, so the site build + deploy need no Remotion toolchain. `video/out/`
and `video/node_modules/` are gitignored.

**Size budget:** WebM target **< 1 MB**, MP4 fallback **< 1.5 MB** (7 s of mostly
flat UI compresses well); poster PNG **< 200 KB**. Verify after first render; if
over, drop bitrate / dimensions before committing.

## 10. Astro integration (`Features.astro` → `#tab-desktop` → `.panel-visual`)

Replace the `<img>` with a `<video>` inside the existing `.screenshot-frame`
(keep its border / radius / shadow via the `.desktop-screenshot` class):

```html
<video
  class="desktop-screenshot"
  autoplay muted loop playsinline
  preload="none"
  poster="/videos/works-anywhere-poster.png"
  aria-label="Demo: a clip sent with cinch from a remote box behind a firewall
              appears instantly in the cinch desktop app">
  <source src="/videos/works-anywhere.webm" type="video/webm" />
  <source src="/videos/works-anywhere.mp4" type="video/mp4" />
</video>
```

- **`muted` + `playsinline`** are required for autoplay on iOS Safari and Chrome.
- **Lazy / tab-gated:** the tab panel is `display:none` until activated, but the
  browser may still fetch the sources. Use `preload="none"` and extend the
  existing tab `<script>` so that when the **Works Anywhere** tab becomes active
  the video calls `.play()`, and pauses on deactivation (saves CPU/decoding).
- **`prefers-reduced-motion`:** a small inline script — if
  `matchMedia('(prefers-reduced-motion: reduce)').matches`, do **not** autoplay /
  `.play()`; the `poster` stays visible as a static image.
- Remove the now-dead `/images/desktop-screenshot.png` reference.
- Tab heading / copy ("A hosted relay that just works") is left as-is by default;
  aligning the headline to the firewall story is a **minor optional** follow-up,
  flagged but not required.

## 11. Testing

- **Render gate:** `render:all` must complete headless (CI-able) with exit 0.
- **Still review:** render stills at frames 0 / 50 / 95 / 120 / 150 / 200 and
  eyeball against the real desktop UI + `redesign-mockups/`.
- **Astro DOM test** (Vitest, mirroring `Hero.test.ts`): `#tab-desktop` contains a
  `<video>` with both `webm` + `mp4` `<source>`s, a `poster`, an `aria-label`, and
  `muted/loop/playsinline`; the reduced-motion + tab-gating script is present.
- **Lint/format:** new TS under `video/` passes its own ESLint/Prettier (or is
  scoped out of the Astro lint config); no `any` types.
- **Visual QA:** `/design-review` or `/browse` on the built page (tab interaction,
  autoplay, reduced-motion, mobile) before merge.

## 12. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Font mismatch (site vs Remotion) | Embed the exact body + mono families in `video/`. |
| Autoplay blocked | `muted` + `playsinline`; poster always set as fallback. |
| Heavy Remotion devDeps polluting the site | Isolated `video/` subproject, not in Astro deps; `node_modules` gitignored; only rendered output committed. |
| Hidden-tab video still downloading | `preload="none"` + `.play()` on tab activation. |
| Desktop UI drifts from the rebuilt mockup | Small, focused components; values sourced from `DESIGN.md` + real component files; acceptable maintenance cost. |
| Rendered binaries bloat git | Enforce the size budget (§9) before committing; reconsider CI-render if it grows. |

## 13. File / change summary

- **New:** `video/` Remotion subproject (above).
- **New (committed):** `public/videos/works-anywhere.{webm,mp4}` + `-poster.png`.
- **Edit:** `src/components/landing/Features.astro` — swap `<img>` → `<video>`;
  extend tab `<script>` for tab-gated play + reduced-motion.
- **New:** an Astro DOM test for the `#tab-desktop` video.
- **Edit:** `.gitignore` — ignore `video/node_modules/`, `video/out/`.

## 14. Future / reuse

- **Square 1:1 social crop** and a **longer launch cut** reuse the same component
  library by parametrizing composition size and the `scene.ts` script. Designed
  for, not built now.

## 15. Open questions (resolve at implementation)

1. Exact site body + mono font family names / files to embed (from
   `astro.config.ts` / `DESIGN.md`).
2. Commit rendered binaries (default, simplest) vs render-in-CI — revisit only if
   the size budget is exceeded.
