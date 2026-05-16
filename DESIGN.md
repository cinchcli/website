# Design System — Cinch

## Product Context
- **What this is:** Remote clipboard for developers. Push from any terminal, pull on any machine.
- **Who it's for:** Developers who work across multiple machines and servers; AI agent operators routing data between sessions.
- **Space/industry:** Developer tools, CLI utilities, productivity infrastructure.
- **Project type:** CLI tool + relay server + desktop app (Tauri v2) + marketing/docs site (Astro).

## 1. Visual Theme & Atmosphere

Cinch's interface feels like the dark interior of a precision instrument — a network terminal carved from obsidian. The background isn't just dark, it's an almost-black blue-tint (`#07080a`) that creates the sense of being inside a macOS-native utility rather than a website. Every surface, every border, every shadow is calibrated to evoke the feeling of high-performance clipboard infrastructure: fast, trustworthy, developer-native.

The signature move is the layered shadow system borrowed from macOS window chrome: multi-layer box-shadows with inset highlights that simulate physical depth, as if cards and buttons are actual pressed or raised glass elements on a dark desk. Combined with the **Porcelain** brand palette — **Porcelain Deep** (`#4FB3A9`) for punch and **Porcelain Pastel** (`#BED9D7`) for breath — the palette reads as "powerful pipe with personality." The deep teal doesn't dominate; it glows. The pastel doesn't decorate; it tints.

The Porcelain palette was sampled directly from the glaze of a favorite cappuccino mug — an unmistakable, earned color. Inter is used everywhere — headings, body, buttons, captions — with extensive OpenType features (`calt`, `kern`, `liga`, `ss03`) creating a consistent, readable typographic voice. The positive letter-spacing (0.2px–0.4px on body text) is unusual for a dark UI and gives the text an airy, breathable quality that counterbalances the dense, dark surfaces. Geist Mono appears for code elements, clip previews, and tabular metadata — paired with Geist display for a single type family rhythm while reinforcing the developer-tool identity.

**Key Characteristics:**
- Near-black blue-tinted background (`#07080a`) on dark; warm bone (`#FBFBFA`) on light
- macOS-native shadow system with multi-layer inset highlights simulating physical depth
- Dual-token brand: **Deep** for CTAs, focus, live states · **Pastel** for tints, hovers, selected fills
- Inter with positive letter-spacing (0.2px) for an airy, readable dark-mode experience
- Subtle borders (rgba white 0.06–0.10 on dark; rgba black 0.06–0.12 on light) for containment
- Keyboard shortcut styling with gradient key caps and heavy shadows — core to clipboard-manager UX
- Data flow animation as signature interaction: left-to-right on push, right-to-left on pull

## 2. Color Palette & Roles

Color is a scarce resource in Cinch. It is used only for:
1. **Brand identity** — the Porcelain dual tokens
2. **Semantic meaning** — error, success, warning, info
3. **Hierarchy** — text primary / muted / faint

Anything else is neutral surface or near-neutral border. No decorative color, no gradients-for-decoration.

### 2.1 Brand — The Porcelain Dual Token

One color wouldn't survive both modes and every component role. Cinch uses **two related tokens**, sampled from the same object (a porcelain mug glaze) so they sing together:

| Token | Hex | HSL | Role |
|-------|-----|-----|------|
| **Porcelain Deep** (dark base) | `#4FB3A9` | `hsl(174, 40%, 51%)` | Primary brand on **dark** canvas — CTAs, focus rings, live pulse dots, pipe flow glow, selected-state left bar |
| **Porcelain Deep · Light** | `#246C65` | `hsl(174, 50%, 28%)` | Primary brand on **light** canvas — deeper base so foreground punch survives warm bone canvas. Same hue family, ~25% darker than the dark-mode base. Lands at WCAG AA body-text contrast (5.4:1) on `#FBFBFA`. |
| **Porcelain Deep · Hover (dark)** | `#5FC5BA` | `hsl(174, 43%, 57%)` | Hover brightening on dark (brighten pattern) |
| **Porcelain Deep · Hover (light)** | `#1A524D` | `hsl(174, 51%, 21%)` | Hover deepening on light (deepen pattern, inverse of dark) — exposed as `--accent-muted` |
| **Porcelain Deep · Muted** | `#3E928A` | `hsl(174, 40%, 41%)` | Pressed state; between the two Deep shades |
| **Porcelain Pastel** | `#BED9D7` | `hsl(175, 25%, 80%)` | Tint accent — hover row fills (light), ambient glow, subtle highlights |
| **Porcelain Pastel · Hover** | `#D2E5E3` | `hsl(175, 26%, 86%)` | Lifted pastel state |

**The dual-token rule:**
- **Deep** = punch. Saturated. Foreground role. Pulls the eye.
- **Pastel** = breath. Desaturated. Background role. Tints an area.

Never stack Deep on Pastel as solid fills — they occupy the same brand lane and compete. Use Deep against surfaces, Pastel against the canvas or behind text.

### 2.2 Dark Mode (primary — desktop app, marketing)

```
--canvas            #07080a    Page background — near-black blue-tint, never pure black
--surface-100       #101111    Cards, panels, sidebar
--surface-200       #1b1c1e    Badges, tags, nested containers
--text-primary      #F0EBE0    Warm cream — body text, WCAG AAA on canvas
--text-muted        #9c9c9d    Metadata, descriptions, nav default
--text-faint        #6a6b6c    Disabled, ghost button text
--text-disabled     #434345    Muted borders, inactive nav
--border            rgba(255,255,255,0.06)   Card containment, divider default
--border-hover      rgba(255,255,255,0.10)   Card hover brightening
--border-strong     #252829                  Explicit divider line
--accent            #4FB3A9    Porcelain Deep — CTAs, focus, live
--accent-hover      #5FC5BA    Deep brightened (brighten pattern on dark)
--accent-muted      #3E928A    Pressed / secondary
--accent-on         #07080a    Text color when using --accent as background — near-black for contrast on #4FB3A9
--accent-tint       #BED9D7    Porcelain Pastel — ambient tint base
--bg-selected       rgba(79,179,169,0.15)    Selected clip row fill (Deep @ 15%)
--bg-hover          rgba(79,179,169,0.08)    Hover row fill (Deep @ 8%)
--glow-accent       rgba(79,179,169,0.18)    Flow glow behind live elements
```

Key-cap gradient: `#121212` → `#0d0d0d` (unchanged across modes).

### 2.3 Light Mode (primary — docs, marketing long-form)

Light mode is not a "docs-only alternate" — it is a first-class parallel system. Marketing pages and the Starlight docs run in light by default, the desktop app runs in dark by default, and both share the same Porcelain brand soul.

```
--canvas            #FBFBFA    Warm bone — page background, never pure white
--surface-100       #FFFFFF    Cards, panels
--surface-200       #F7F6F3    Inset code blocks, elevated-inset areas
--text-primary      #2F3437    Charcoal — body text, never pure black
--text-muted        #787774    Metadata, descriptions
--text-faint        #B4B4B0    Disabled, low-emphasis
--text-disabled     #D0D0CC    Muted borders, inactive nav
--border            rgba(0,0,0,0.06)         Card containment, divider default
--border-hover      rgba(0,0,0,0.12)         Card hover
--border-strong     rgba(0,0,0,0.15)         Explicit divider line
--accent            #246C65    Porcelain Deep · Light — deepens on light canvas for punch + WCAG AA body-text contrast (5.4:1)
--accent-muted      #1A524D    Hover/pressed deepening on light (inverse of dark's brighten pattern)
--accent-on         #FFFFFF    Text color when using --accent as background (e.g. Emphasis Pill CTA)
--accent-tint       #BED9D7    Porcelain Pastel — hover/selected tint base (used at higher alpha)
--bg-selected       rgba(190,217,215,0.45)   Selected clip row fill (Pastel @ 45%)
--bg-hover          rgba(190,217,215,0.25)   Hover row fill (Pastel @ 25%)
--accent-subtle     rgba(36,108,101,0.08)    Subtle accent wash (Deep·Light @ 8%)
--glow-accent       rgba(36,108,101,0.20)    Flow glow behind live elements
```

**Why Deep splits per mode:** Porcelain Deep `#4FB3A9` reads as "living data in motion" against `#07080a` canvas, but goes slightly washed/pastel against warm bone `#FBFBFA`. Light mode uses `#246C65` (same hue, ~25% darker) to restore foreground punch and meet WCAG AA body-text contrast on the warm canvas. Both share the Porcelain family identity; only the saturation/luminance shifts to compensate for canvas luminance.

**Mode-flip rationale:**
- Hover on dark *brightens* (Deep → Hover Deep) because dark-on-dark needs to lift.
- Hover on light *deepens* (Deep → Deep Muted) because light-on-light needs to settle.
- Tints use Deep's alpha on dark (more color punch needed through the void); use Pastel's alpha on light (the mug's natural color layer sits beautifully on `#FBFBFA`).

### 2.4 Semantic Colors

Identical intent across modes; individual hex tuned per mode for AA contrast with body text.

| Intent | Dark (bg · fg) | Light (bg · fg) |
|--------|----------------|-----------------|
| Success | `#5fc992` · text | `#EDF3EC` bg · `#346538` text |
| Warning | `#ffbc33` · text | `#FBF3DB` bg · `#956400` text |
| Error   | `#FF6363` · text | `#FDEBEC` bg · `#9F2F2D` text |
| Info    | `#55b3ff` · text | `#E1F3FE` bg · `#1F6C9F` text |

Never reuse Porcelain Deep for semantic meaning — the brand accent is brand, not a status.

### 2.5 Gradients & Decorative Glow

| Treatment | Value | Use |
|-----------|-------|-----|
| Key-cap gradient | `#121212` → `#0d0d0d` (top→bottom) | `<kbd>` physical depth (dark) |
| Key-cap gradient (light) | `#F7F6F3` → `#EFEDE8` | `<kbd>` on light surfaces |
| Accent flow glow | `rgba(79,179,169,0.18) 0 0 20px 5px` | Push/pull animation trail · live relay pill |
| Pastel ambient | `rgba(190,217,215,0.08) 0 0 24px 6px` | Hero/storytelling halos |
| Red danger glow | `rgba(255,99,99,0.15) 0 0 20px 5px` | Destructive action emphasis |

## 3. Typography Rules

### Font Family
- **Primary (marketing site + docs)**: `Geist` — geometric sans-serif tuned for screen UI. Fallbacks: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, sans-serif
- **Primary (desktop app surfaces)**: `Inter` — humanist sans-serif, used in app chrome where macOS-native legibility matters more than display character. Fallbacks: `Inter Fallback`, `system-ui`, `-apple-system`
- **System** (select macOS-native surfaces): `SF Pro Text` → `SF Pro Icons` → `Inter`
- **Monospace**: `Geist Mono` — code blocks, `<kbd>`, clip previews, tabular metadata. Fallbacks: `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`
- **OpenType features**: `calt`, `kern`, `liga`, `ss03` enabled globally; `ss02`, `ss08` on display text; `"liga" 0` on hero headings to keep character shapes crisp at scale
- **Tabular numerals**: `font-variant-numeric: tabular-nums` on clip timestamps, sizes, row counts

### Hierarchy

Display sizes use **tight (negative) tracking** because Geist sets very open by default at large sizes; without compression headlines feel airy-loose rather than confident. Body and UI sizes use **positive tracking** to keep the breathable feel that defines the brand.

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| Display Hero (web) | clamp(40px, 8vw, 80px) | 700 | 1.1 | -0.04em (~-3.2px at 80px) | Geist; `text-wrap: balance`; `liga` 0 + ss02 + ss08 |
| Display Hero (app) | 64px | 600 | 1.10 | 0px | Inter (app surfaces); OpenType: `"liga" 0`, ss02, ss08 |
| Section Display | clamp(40px, 8vw, 80px) | 700 | 1.1 | -0.04em | Geist; matches Hero |
| Section Heading (h3) | 40px | 700 | 1.1 | -0.04em | Geist; card titles, panel headings |
| Card Heading | 22px | 600 | 1.15 | -0.025em | Geist; download platform labels |
| Sub-heading | 20px | 500 | 1.60 | +0.2px | Relaxed line-height, positive tracking |
| Body Large | 18px | 400 | 1.15 | +0.2px | Geist (web) / Inter (app) |
| Body | 16px | 500 | 1.60 | +0.2px | Primary body baseline |
| Body Tight | 16px | 400 | 1.15 | +0.1px | UI labels, clip row text |
| Button | 16px | 600 | 1.15 | +0.3px | Semibold, slightly wider tracking |
| Nav Link | 16px | 500 | 1.40 | +0.3px | Navigation links |
| Caption | 14px | 500 | 1.14 | +0.2px | Metadata, source labels |
| Caption Bold | 14px | 600 | 1.40 | 0px | Emphasized captions |
| Small (caps) | 12px | 700 | 1.10 | +1.8px / +0.15em | Footer column heads, eyebrow caps |
| Small Link | 12px | 400 | 1.50 | +0.4px | Footer, fine print |
| Code | 14px (Geist Mono) | 500 | 1.60 | +0.3px | Code blocks |
| Code Small | 12px (Geist Mono) | 400 | 1.60 | +0.2px | Inline code, CLI snippets, kbd |

### Principles
- **Two tracking systems, not one.** **Display sizes** (≥22px headings and large display text) use **negative tracking** (-0.025em to -0.04em) — Geist sets loose at large sizes, and compression is what reads as "confident, modern, instrument-like" rather than "airy stock font". **Body/UI sizes** (≤20px) use **positive tracking** (+0.1px to +0.4px) — the signature breathable feel that counterbalances dense dark surfaces and improves legibility at small sizes.
- **Weight 700 on display, 500 on body**: display sizes use bold (700) to anchor the page; body text uses medium (500) instead of regular (400) — the subtle extra heft improves legibility on warm/dark surfaces.
- **Display scaling via clamp**: `clamp(40px, 8vw, 80px)` is the standard web display scale. The 80px ceiling assumes generous side padding; do not exceed.
- **OpenType everywhere**: `calt`, `kern`, `liga`, `ss03` enabled globally; `"liga" 0` + `ss02` + `ss08` on hero headings to keep character shapes crisp at scale.
- **Measure**: 45–75 characters per line on long-form prose, 66 ideal.
- **`text-wrap: balance`** on headings; `text-wrap: pretty` on body paragraphs.

## 4. Component Stylings

All specs are mode-aware via tokens. Values below use dark-mode defaults with light-mode variations called out inline.

### Buttons
- **Primary Pill (CTA)**: Semi-transparent white background (`hsla(0,0%,100%,0.815)`) on dark / `#2F3437` fill on light, 86px+ radius. Hover: full white on dark / `#4A4A50` on light
- **Porcelain Emphasis Pill**: `--accent` (`#4FB3A9`) background with `#07080a` text on dark / `#FFFFFF` text on light, 86px+ radius, accent flow glow (`rgba(79,179,169,0.25) 0 0 20px 2px`). Hover: `--accent-hover`
- **Secondary Button**: Transparent background, `--text-primary` text, 6px radius, `1px solid --border-hover`, subtle drop shadow. Hover: opacity 0.6 on dark / darken-on-light
- **Ghost Button**: No background or border, `--text-faint` text, 86px radius. Hover: opacity 0.6, text brightens to `--text-primary`
- **Destructive**: Transparent background, error-red text, `1px solid rgba(error-red, 0.25)` border, red glow on hover
- **Transition**: Dark mode uses **opacity** transitions (0.6) on hover. Light mode uses **background darkening** because opacity on light produces wash rather than emphasis. `scale(0.98)` on `:active` in both modes.

### Cards & Containers
- **Standard Card**: `--surface-100` background, `1px solid --border`, 12px–16px radius
- **Elevated Card (dark)**: Ring shadow `rgb(27,28,30) 0 0 0 1px` outer + `rgb(7,8,10) 0 0 0 1px inset` — double-ring containment
- **Elevated Card (light)**: `0 2px 8px rgba(0,0,0,0.04)` subtle drop shadow, no rings (rings don't read on light)
- **Clip Row**: `--surface-100` background, 8px radius, 16px internal padding. Selected: `--bg-selected` fill + 1px `--accent` left bar
- **Hover**: Border opacity escalates (0.06 → 0.10 dark; 0.06 → 0.12 light), no layout shift

### Inputs & Forms
- Background `--canvas`, `1px solid --border`, 8px radius
- Focus: border transitions to `--accent`, 3px `--glow-accent` ring appears
- Text color `--text-primary`, placeholder `--text-faint`
- Labels: `--text-muted` at 14px weight 500

### Navigation
- **Top nav**: Blends with canvas, `--text-primary` links at 16px weight 500
- **Nav links**: `--text-muted` → `--text-primary` on hover, underline on hover
- **CTA slot**: Porcelain Emphasis Pill or translucent white pill at the right end
- **Sticky**: `1px solid --border` bottom border
- **Mobile**: Collapses to hamburger, maintains mode theme

### Image Treatment
- **Product screenshots**: macOS window chrome — 12px rounded corners, deep shadows simulating floating windows
- **Hero illustration**: Data-pipe motif — Porcelain Deep flow line crossing between two machine silhouettes
- **App UI embeds**: Show actual Cinch desktop app and CLI transcripts

### Keyboard Shortcut Keys (`<kbd>`)
- **Dark key cap**: `#121212 → #0d0d0d` gradient, heavy multi-layer shadow, Geist Mono 12/600
- **Light key cap**: `#F7F6F3 → #EFEDE8` gradient, subtle 1px bottom inset shadow, Geist Mono 12/600 in `--text-primary`
- **Radius**: 4px–6px individual keys; 4px gap between keys

### Badges & Tags
- **Neutral badge**: `--surface-200` background, `--text-primary` text, 6px radius, 14px weight 500, `0 6px` padding
- **Source pill**: Same base with a colored dot (accent = this device, gray = remote, amber = unauthenticated)
- **Status dot**: 8px circle — accent pulsing for "relay online", success for "push OK", red for "relay disconnected"

### Data Tables (clip list, device dashboard)
- Row height 44px, 1px bottom `--border-strong`, Geist Mono for size/time columns with `tabular-nums`
- Hover row: `--bg-hover`
- Selected row: `--bg-selected` fill + 2px `--accent` left bar

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Scale**: 1, 2, 3, 4, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 120
- **Section padding**: 80–120px vertical between major marketing sections
- **Card padding**: 16–32px internal
- **Component gaps**: 8–16px between related elements
- **Density**: Comfortable in marketing, dense in desktop app (target 8–12 clip rows per viewport)

### Grid & Container
- **Max width**: ~1200px centered (breakpoint at 1204px)
- **Column patterns**: Single-column hero, 2–3 column feature grids, full-width product showcases
- **App showcase**: Product UI in centered macOS window frames

### Whitespace Philosophy
- **Dramatic negative space**: Sections float in canvas, cinematic pacing between features
- **Dense product, sparse marketing**: Product UI is information-dense; marketing copy uses minimal text with generous spacing
- **Vertical rhythm**: 24–32px between elements within sections

### Border Radius Scale
- **2–3px**: Micro-elements, code spans, tiny indicators
- **4–5px**: Keyboard keys, small interactive elements
- **6px**: Buttons, badges, tags — workhorse
- **8px**: Input fields, clip rows
- **9–11px**: Images, medium containers
- **12px**: Standard cards, product screenshots
- **16px**: Large cards, feature sections
- **20px**: Hero cards, prominent containers
- **86px+**: Pill buttons, nav CTAs — full pill shape
- **Never**: `rounded-full` on large containers

## 6. Depth & Elevation

### Dark Mode

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Void) | No shadow, `--canvas` | Page background |
| Level 1 (Subtle) | `rgba(0,0,0,0.28) 0 1.189px 2.377px` | Minimal lift, inline elements |
| Level 2 (Ring) | `rgb(27,28,30) 0 0 0 1px` outer + `rgb(7,8,10) 0 0 0 1px inset` inner | Card containment, double-ring |
| Level 3 (Button) | `rgba(255,255,255,0.05) 0 1px 0 0 inset` + `rgba(255,255,255,0.25) 0 0 0 1px` + `rgba(0,0,0,0.2) 0 -1px 0 0 inset` | macOS-native button |
| Level 4 (Key) | 5-layer shadow stack with inset press effects | `<kbd>` caps — physical 3D |
| Level 5 (Floating) | `rgba(0,0,0,0.5) 0 0 0 2px` + `rgba(255,255,255,0.19) 0 0 14px` + insets | Command palette, popovers |

### Light Mode

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Void) | No shadow, `--canvas` | Page background |
| Level 1 (Subtle) | `0 1px 2px rgba(0,0,0,0.04)` | Minimal lift |
| Level 2 (Border) | `1px solid --border` only, no shadow | Card containment (rings don't read on light) |
| Level 3 (Card hover) | `0 2px 8px rgba(0,0,0,0.04)` — 200ms transition | Card on hover |
| Level 4 (Key) | `0 1px 1px rgba(0,0,0,0.12)` + inset `0 -1px 0 rgba(0,0,0,0.08)` | `<kbd>` caps |
| Level 5 (Elevated) | `0 8px 32px rgba(0,0,0,0.08)` | Modals, popovers |

### Shadow Philosophy
Dark mode shadows combine outer rings + inset highlights + inset darks for macOS-native physicality. Light mode shadows are quieter: no rings (they read as outlines on light), subtle single-drop shadows for elevation, and borders carry most of the containment duty.

### Decorative Depth
- **Accent flow glow**: `rgba(79,179,169,0.18) 0 0 20px 5px` — behind live relay indicator and push/pull animation endpoints
- **Red danger glow**: `rgba(255,99,99,0.15) 0 0 20px 5px` — error toasts, destructive confirmations
- **Pastel ambient** (marketing hero only): `rgba(190,217,215,0.08) 0 0 24px 6px` — soft halo behind storytelling blocks

## 7. Motion

- **Approach**: Invisible — present but never distracting.
- **Scroll entry**: `translateY(12px)` + `opacity: 0` → resolve over 600ms with `cubic-bezier(0.16, 1, 0.3, 1)`. Use IntersectionObserver.
- **Hover (dark)**: **opacity transition to 0.6** on buttons (not color swaps). Card borders fade 0.06 → 0.10.
- **Hover (light)**: background-color deepen (Deep → Deep Muted on accent buttons; border 0.06 → 0.12 on cards). Opacity-fade washes out light surfaces rather than emphasizing them.
- **Active**: `scale(0.98)` on `:active`.
- **Staggered reveals**: cascade delay `calc(var(--index) * 80ms)` on lists/grids.
- **Signature — the Pipe**: Data flow left-to-right on push, right-to-left on pull. A 2px `--accent` line animates along the fiber path, with accent flow glow trailing the leading edge.
- **Relay pulse**: `--accent` status dot pulses at 0.4 opacity → 1.0 at 2s intervals while WebSocket is connected; stops when disconnected.
- **Duration tiers**: micro (50–100ms), short (150–250ms), medium (250–400ms), long (400–700ms).
- **Performance**: Only animate `transform` and `opacity`. Never animate layout properties.
- **Reduced motion**: Fully respect `prefers-reduced-motion: reduce` — replace the pipe animation with a static `--accent` line.

## 8. Iconography

- **Style**: Phosphor Icons (Bold weight) or custom SVG with slightly thicker strokes than typical line icons.
- **Size**: 16px (inline), 20px (nav), 24px (feature), 32px+ (hero).
- **Color**: Inherit `currentColor` by default; accent with Porcelain Deep only for brand or active states.
- **Never**: Thin-line icon sets (Lucide, Feather, standard Heroicons); emoji as design elements.

## 9. Do's and Don'ts

### Do
- Use `--canvas` (not pure black or pure white) — the warm/cool tint in each mode is essential
- Apply positive letter-spacing (+0.2px) on body text — deliberately different from most dark UIs
- Use multi-layer shadows with inset highlights on dark-mode interactive elements
- Keep Porcelain Deep as punctuation for hero/CTA/live states; Porcelain Pastel for tints/hovers/ambient
- Use `--border` (barely visible rgba) for card containment
- Apply weight 500 as the body text baseline — medium weight improves dark-mode legibility
- Use pill shapes (86px+ radius) for primary CTAs, rectangular (6–8px) for secondary actions
- Enable OpenType features `calt`, `kern`, `liga`, `ss03` on all Inter text
- Hover via opacity 0.6 on dark; hover via darkening/background on light
- Use `tabular-nums` for clip sizes, timestamps, and any numeric column
- Use Deep Muted (`#3E928A`) or a darker deep for light-mode text links so body-text contrast stays AA

### Don't
- Use pure black (`#000000`) as the dark background, or pure white (`#FFFFFF`) as the light canvas — the tinted tones are what differentiate Cinch
- Apply negative letter-spacing on body text
- Use Porcelain Pastel as a solid fill for CTAs — it has no punch at 100% opacity on dark
- Stack Deep and Pastel as solid fills in the same region — they compete for the brand lane
- Create single-layer flat shadows on dark — always pair outer + inset
- Use regular (400) for body text when 500 is available — it reads thin on dark
- Mix warm and cool borders — stick to the mode's border palette
- Apply opacity-fade hover on light mode — it washes surfaces out rather than emphasizing
- Render clip metadata in Geist Mono — mono is for clip **payload**, not UI labels
- Reuse Porcelain Deep for semantic states (success/error/warning) — brand is brand, semantics are semantics

## 10. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <600px | Single column, stacked cards, hamburger nav, hero text ~40px |
| Small Tablet | 600–768px | 2-column grid begins, nav partially visible |
| Tablet | 768–1024px | 2–3 column features, screenshots scale |
| Desktop | 1024–1200px | Full layout, all nav links visible, 64px hero display |
| Large Desktop | >1200px | Max-width container centered, generous side margins |

### Touch Targets
- Pill buttons: 86px radius with 20px padding — well above the 44px minimum
- Secondary buttons: 8px+ padding; border expands the visual target
- Nav links: 16px text with surrounding padding for accessible touch

### Collapsing Strategy
- **Navigation**: Full horizontal → hamburger on mobile with slide-out menu
- **Hero**: 64px → 48px → 36px across breakpoints
- **Feature grids**: 3-column → 2-column → single-column stack
- **Desktop-app screenshots**: Scale within containers, maintain macOS window chrome proportions
- **Keyboard shortcuts**: Simplify or hide on mobile where shortcuts aren't applicable
- **Pipe animation**: Shortens horizontally; still renders on mobile (it's the brand) unless `prefers-reduced-motion` is set

## 11. Anti-patterns (never use)

- Inter substitutes like Roboto, Open Sans, Poppins, Montserrat, Arial, Helvetica as primary fonts
- Purple/violet gradients or blue-to-purple color schemes
- 3-column feature grid with icons in colored circles (the AI slop layout)
- Centered everything with uniform spacing
- Decorative blobs, floating circles, wavy SVG dividers
- Emoji as design elements (rockets in headings, emoji bullets)
- Colored left-border-only cards as the default card style
- Generic hero copy ("Welcome to X", "Unlock the power of...")
- Single-layer `shadow-md` / `shadow-lg` / `shadow-xl` default Tailwind shadows
- `rounded-full` on large containers or primary buttons
- Gradients, neon colors, 3D glassmorphism
- Oversaturated stock photos
- AI copywriting cliches: "Elevate", "Seamless", "Unleash", "Next-Gen", "Delve"
- Cookie-cutter section rhythm with equal-height sections
- Porcelain Pastel used as a CTA fill — it's tint material, not foreground punch
- Porcelain Deep used as a background wash — Deep is punctuation, Pastel is the wash color

## 12. Agent Prompt Guide

### Quick Token Reference

**Brand (both modes)**
- Porcelain Deep `#4FB3A9` — CTAs, focus, live pulse
- Porcelain Deep Hover `#5FC5BA` (dark) / `#3E928A` (light)
- Porcelain Pastel `#BED9D7` — tints, ambient, hover/selected fills on light

**Dark mode**
- `--canvas #07080a` · `--surface-100 #101111` · `--surface-200 #1b1c1e`
- `--text-primary #F0EBE0` · `--text-muted #9c9c9d` · `--text-faint #6a6b6c`
- `--border rgba(255,255,255,0.06)` · `--bg-selected rgba(79,179,169,0.15)`

**Light mode**
- `--canvas #FBFBFA` · `--surface-100 #FFFFFF` · `--surface-200 #F7F6F3`
- `--text-primary #2F3437` · `--text-muted #787774` · `--text-faint #B4B4B0`
- `--border rgba(0,0,0,0.06)` · `--bg-selected rgba(190,217,215,0.45)`

### Example Component Prompts
- "Create a hero on dark canvas `#07080a` with 64px Inter heading weight 600 in warm cream `#F0EBE0`, and a Porcelain Emphasis Pill CTA: `#4FB3A9` fill, `#07080a` text, 86px radius, `rgba(79,179,169,0.25) 0 0 20px 2px` glow."
- "Design a clip-row card at `#101111` background, `1px solid rgba(255,255,255,0.06)` border, 8px radius, Inter 16/500 for preview, Geist Mono 12 with `tabular-nums` for timestamp, selected state `rgba(79,179,169,0.15)` fill + 2px `#4FB3A9` left bar."
- "Build a light-mode marketing page at canvas `#FBFBFA`, `#FFFFFF` cards with `1px solid rgba(0,0,0,0.06)` border, charcoal `#2F3437` body text, Porcelain Deep `#4FB3A9` CTA filled with `#FFFFFF` text, hover deepens to `#3E928A`."
- "Render the live-relay pill: `--surface-200` background, 999 radius, 8px Porcelain Deep pulsing dot, 14px Inter weight 500 'Relay online', accent flow glow `rgba(79,179,169,0.18) 0 0 20px 5px` behind the pill."
- "Render the push/pull pipe: 2px `#4FB3A9` line with trailing flow glow moving left-to-right between machine glyphs, 600ms, `cubic-bezier(0.16, 1, 0.3, 1)`, static line under `prefers-reduced-motion: reduce`."

### Iteration Guide
When refining:
1. Canvas is tinted (`#07080a` dark / `#FBFBFA` light), not pure black/white.
2. Letter-spacing is positive (+0.2px) on body text.
3. Dark-mode shadows have outer + inset pairs; light-mode shadows are single subtle drops.
4. Inter has `calt`, `kern`, `liga`, `ss03` enabled.
5. Dark-mode hover uses opacity 0.6; light-mode hover uses background darken.
6. Porcelain Deep is foreground (CTAs/focus/live); Porcelain Pastel is background-tint (hovers/selected on light/ambient). Flag any inversions.
7. Semantic colors are not the brand — never color a CTA red to convey "danger as primary action."
8. Mono (Geist Mono) only on clip payload, code, kbd, and numeric columns — not UI labels.

## 13. Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-15 | Initial design system created | /design-consultation with competitive research (Raycast, Linear, Zed) + Codex and Claude subagent outside voices. Industrial utilitarian direction chosen over polished SaaS. |
| 2026-04-15 | Warm cream text `#F0EBE0` | Both outside voices independently proposed warm off-white over pure white. Adds material quality, reduces harshness, passes WCAG AAA. |
| 2026-04-15 | Shift to Premium Utilitarian Minimalism | Editorial warm monochrome with light-mode primary. Instrument Serif display, Notion-inspired palette. |
| 2026-04-20 | Body font DM Sans → Geist | DM Sans's rounded terminals read as "startup-friendly" at small sizes; Geist gave a cleaner, Raycast/Linear-adjacent tone. Mono restricted to code/kbd/data columns. |
| 2026-04-21 | Re-anchor on Raycast-style dark-first system | Editorial light-mode aesthetic read as "blog template" rather than "developer utility." Re-anchored the visual system on Raycast's macOS-native dark foundation: `#07080a` canvas, multi-layer inset shadows, Inter with positive tracking + OpenType (`calt`, `kern`, `liga`, `ss03`), pill CTAs, `<kbd>` key caps. JetBrains Mono replaces GeistMono for code (consistency with CLI and existing app surfaces). Pipe motion signature retained. |
| 2026-04-21 | **Brand accent: cyan → Porcelain dual token** | Cyan `#06B6D4` felt generic "tech-stock" and had only one operating mode (saturated punch). Sampled a new brand palette from a cappuccino mug's porcelain glaze — unmistakably earned, personal. **Porcelain Deep (`#4FB3A9`)** for CTAs, focus, live states, pipe glow; **Porcelain Pastel (`#BED9D7`)** for tints, hover fills, ambient. Dual-token solves the "one color can't do both foreground punch and background wash" problem — Deep punches on dark, Pastel breathes. |
| 2026-04-21 | **Light mode elevated to first-class parallel system** | Previous version treated light as a docs-only alternate. Marketing pages and Starlight docs run in light by default; desktop app in dark. Explicit per-mode tokens documented (surfaces, text, borders, hover behavior, shadow philosophy). Hover pattern flips: opacity-fade on dark → background-darken on light, because opacity-fade on light washes rather than emphasizes. |
| 2026-04-21 | **Porcelain Deep splits per mode: `#4FB3A9` (dark) · `#2F7F78` (light)** | Live browser QA in light mode revealed `#4FB3A9` read as mint/washed-pastel against warm bone canvas — foreground punch collapsed. Shifted light-mode `--accent` to `#2F7F78` (same hue family, deeper by ~20%) to restore "pulls the eye" quality on light. Ripple effects: (1) CTA pill text flips from near-black `#07080a` (OK on `#4FB3A9`) to white `#FFFFFF` (required on `#2F7F78` for AA contrast), so added `--accent-on` token that flips with mode. (2) Code-span text using `C.accent` now meets AA body-text contrast on light canvas (`#2F7F78` = 5.4:1 vs `#4FB3A9` = 2.5:1). Both modes still share Porcelain brand family; only saturation shifts to compensate for canvas luminance. |
| 2026-05-14 | **Marketing monospace: Geist Mono** | Website and Starlight load **Geist Mono** for `--mono`, code, kbd, and tabular metadata — pairs with **Geist** display; replaces JetBrains Mono on web. Desktop app typography is unchanged in this commit. |
| 2026-05-16 | **Reconciled DESIGN.md to live implementation** | Design review (`/design-review`) surfaced two spec-vs-code drifts. (1) Body font: spec said "Inter primary"; web has been on Geist since 2026-04-20 + 2026-05-14. Reframed: **Geist primary on web (marketing + docs), Inter primary on desktop-app surfaces** — both share the OpenType feature set, both follow the same letter-spacing rules. (2) Letter-spacing: spec said headings at 0 to +0.2px; reality is -0.04em on display sizes and -0.025em on card headings. Reframed as a **two-tracking-system rule**: negative on display (≥22px), positive on body/UI (≤20px) — Geist's open default at large sizes was the reason compression always crept back in. (3) `--accent` value: spec said `#2F7F78`; CSS shipped `#246C65` (deeper, lands at 5.4:1 AA on warm bone vs. 3.1:1 for the spec value). Spec updated to `#246C65` because the deeper value was the deliberate tune for body-text legibility. Paired hover token renamed `--accent-muted = #1A524D`. |
