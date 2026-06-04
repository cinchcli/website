# Works Anywhere Promo Video — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static (and currently broken) screenshot in the landing page "Works Anywhere" tab with a code-rendered 7-second muted looping video that shows a clip `cinch send`-ed from a remote box behind a firewall landing instantly in the cinch desktop app.

**Architecture:** A self-contained Remotion (React/TS) subproject at `website/video/` builds the composition and renders WebM + MP4 + a poster into `public/videos/`. The Astro page consumes only those static files via a `<video>` element that plays when the "Works Anywhere" tab is activated and respects `prefers-reduced-motion`. The site build never runs Remotion.

**Tech Stack:** Remotion 4 (`remotion`, `@remotion/cli`, `@remotion/google-fonts`), React 18, TypeScript; Astro + Vitest for the page integration.

---

## Working directory

All paths are relative to the worktree root:
`/Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video/`

**Every task starts by confirming the branch:**

```bash
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video && pwd && git rev-parse --abbrev-ref HEAD
# Expected: .../website/claude-works-anywhere-video  and  agent/claude/works-anywhere-video
```

## File structure (what gets created / modified)

```
video/                                  # NEW Remotion subproject (isolated npm deps)
  package.json                          # deps + render scripts
  tsconfig.json
  remotion.config.ts
  scripts/copy-to-public.mjs            # copies rendered out/* → ../public/videos/
  src/
    index.ts                            # registerRoot(RemotionRoot)
    Root.tsx                            # <Composition id="WorksAnywhere" .../>
    theme.ts                            # typed design tokens + canvas/timing constants
    fonts.ts                            # Geist + Geist Mono via @remotion/google-fonts
    scene.ts                            # typed scene script + beat timing constants
    components/
      TerminalWindow.tsx                # mirrors src/components/landing/TerminalWindow.astro
      Typewriter.tsx                    # frame-driven char reveal + blinking caret
      SourcePill.tsx                    # mirrors desktop SourcePill.tsx
      ClipRow.tsx                       # mirrors desktop ClipList.tsx ClipRow
      ClipList.tsx                      # column with section label + rows
      Rail.tsx                          # desktop left icon rail
      DesktopWindow.tsx                 # window chrome + Rail + ClipList
      SignalPath.tsx                    # packet + VPN/firewall markers + relay node
      Tagline.tsx                       # bottom tagline, fades in/out
    WorksAnywhere.tsx                   # the composition: orchestrates beats by frame
  out/                                  # local render output (gitignored)

public/videos/                          # NEW committed rendered assets
  works-anywhere.webm
  works-anywhere.mp4
  works-anywhere-poster.png

src/components/landing/Features.astro   # MODIFY: <img> → <video>; extend tab <script>
src/components/landing/Features.test.ts # NEW: DOM/source test for the video integration
.gitignore                              # MODIFY: ignore video/node_modules, video/out
```

**Design-token values** (mirror exactly into `video/src/theme.ts`, sourced from
`src/layouts/Landing.astro` dark `:root` and `TerminalWindow.astro`):

| token | value |
|---|---|
| bg | `#050505` |
| card | `#0e0f10` |
| card2 | `#161719` |
| terminalBg | `#0e0f11` |
| border | `rgba(255,255,255,0.06)` |
| text1 | `#F0EBE0` |
| text2 | `#A1A1A1` |
| text3 | `#6B6B6B` |
| accent | `#4FB3A9` |
| accentMuted | `#3E928A` |
| accentSubtle | `rgba(79,179,169,0.1)` |
| selected | `rgba(79,179,169,0.20)` |
| accentPastel | `#BED9D7` |
| semanticOk | `#4ade80` |
| dotR / dotY / dotG | `#ff5f57` / `#febc2e` / `#28c840` |

---

## Task 1: Scaffold the Remotion subproject

**Files:**
- Create: `video/package.json`, `video/tsconfig.json`, `video/remotion.config.ts`, `video/src/index.ts`, `video/src/theme.ts`, `video/src/Root.tsx`, `video/src/WorksAnywhere.tsx` (placeholder), `video/scripts/copy-to-public.mjs`
- Modify: `.gitignore`

- [ ] **Step 1: Create `video/package.json`**

```json
{
  "name": "cinch-video",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "studio": "remotion studio",
    "render:webm": "remotion render WorksAnywhere out/works-anywhere.webm --codec=vp9 --scale=2",
    "render:mp4": "remotion render WorksAnywhere out/works-anywhere.mp4 --codec=h264 --scale=2",
    "still:poster": "remotion still WorksAnywhere out/works-anywhere-poster.png --frame=150 --scale=2",
    "render:all": "npm run render:webm && npm run render:mp4 && npm run still:poster && node scripts/copy-to-public.mjs",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@remotion/cli": "4.0.249",
    "@remotion/google-fonts": "4.0.249",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "remotion": "4.0.249"
  },
  "devDependencies": {
    "@types/react": "18.3.12",
    "typescript": "5.6.3"
  }
}
```

> Note: every `remotion` / `@remotion/*` package MUST share the exact same version. If `npm install` reports a version-mismatch, bump all four to the same latest 4.x string.

- [ ] **Step 2: Create `video/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "lib": ["ES2020", "DOM"]
  },
  "include": ["src", "scripts"]
}
```

- [ ] **Step 3: Create `video/remotion.config.ts`**

```ts
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
```

- [ ] **Step 4: Create `video/src/theme.ts`** (tokens + canvas/timing constants)

```ts
export const FPS = 30;
export const DURATION_IN_FRAMES = 210; // 7.00s
export const WIDTH = 1280;
export const HEIGHT = 800;

export interface Theme {
  bg: string;
  card: string;
  card2: string;
  terminalBg: string;
  border: string;
  text1: string;
  text2: string;
  text3: string;
  accent: string;
  accentMuted: string;
  accentSubtle: string;
  selected: string;
  accentPastel: string;
  semanticOk: string;
  dotR: string;
  dotY: string;
  dotG: string;
}

export const theme: Theme = {
  bg: '#050505',
  card: '#0e0f10',
  card2: '#161719',
  terminalBg: '#0e0f11',
  border: 'rgba(255,255,255,0.06)',
  text1: '#F0EBE0',
  text2: '#A1A1A1',
  text3: '#6B6B6B',
  accent: '#4FB3A9',
  accentMuted: '#3E928A',
  accentSubtle: 'rgba(79,179,169,0.1)',
  selected: 'rgba(79,179,169,0.20)',
  accentPastel: '#BED9D7',
  semanticOk: '#4ade80',
  dotR: '#ff5f57',
  dotY: '#febc2e',
  dotG: '#28c840',
};
```

- [ ] **Step 5: Create `video/src/WorksAnywhere.tsx` (temporary placeholder)**

```tsx
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from './theme';

export const WorksAnywhere: React.FC = () => {
  return <AbsoluteFill style={{ backgroundColor: theme.bg }} />;
};
```

- [ ] **Step 6: Create `video/src/Root.tsx`**

```tsx
import React from 'react';
import { Composition } from 'remotion';
import { WorksAnywhere } from './WorksAnywhere';
import { WIDTH, HEIGHT, FPS, DURATION_IN_FRAMES } from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="WorksAnywhere"
      component={WorksAnywhere}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
```

- [ ] **Step 7: Create `video/src/index.ts`**

```ts
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
```

- [ ] **Step 8: Create `video/scripts/copy-to-public.mjs`**

```js
import { copyFileSync, mkdirSync } from 'node:fs';

const files = ['works-anywhere.webm', 'works-anywhere.mp4', 'works-anywhere-poster.png'];
mkdirSync(new URL('../../public/videos/', import.meta.url), { recursive: true });
for (const f of files) {
  copyFileSync(
    new URL(`../out/${f}`, import.meta.url),
    new URL(`../../public/videos/${f}`, import.meta.url),
  );
  console.log('copied', f);
}
```

- [ ] **Step 9: Append to `.gitignore`**

Add these lines at the end of `.gitignore`:

```
# Remotion video subproject — deps and local render output
video/node_modules/
video/out/
```

- [ ] **Step 10: Install and verify a trivial still renders**

```bash
cd video && npm install && npm run still:poster
```

Expected: `npm install` succeeds; `still:poster` writes `video/out/works-anywhere-poster.png` (a solid near-black `#050505` frame). If install fails on version mismatch, set all `remotion`/`@remotion/*` to the same latest 4.x and retry.

- [ ] **Step 11: Commit**

```bash
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video
git add video/package.json video/tsconfig.json video/remotion.config.ts video/scripts video/src .gitignore
git commit -m "chore(video): scaffold Remotion subproject for Works Anywhere promo"
```

---

## Task 2: Fonts + scene script

**Files:**
- Create: `video/src/fonts.ts`, `video/src/scene.ts`

- [ ] **Step 1: Create `video/src/fonts.ts`**

```ts
import { loadFont as loadGeist } from '@remotion/google-fonts/Geist';
import { loadFont as loadGeistMono } from '@remotion/google-fonts/GeistMono';

export const { fontFamily: BODY_FONT } = loadGeist();
export const { fontFamily: MONO_FONT } = loadGeistMono();
```

- [ ] **Step 2: Create `video/src/scene.ts`** (typed content + beat timing)

```ts
export interface ClipData {
  machine: string; // SourcePill label
  time: string; // e.g. "now", "2m"
  preview: string; // row preview text
}

export interface SceneData {
  terminalTitle: string;
  promptCommand: string; // text typed after the "$ "
  successLine: string; // e.g. "✓ sent · E2EE"
  restingClips: ClipData[];
  newClip: ClipData;
  tagline: string; // may contain "\n"
}

export const scene: SceneData = {
  terminalTitle: 'ssh prod-box — bash',
  promptCommand: 'tail -n 20 err.log | cinch send',
  successLine: '✓ sent · E2EE',
  restingClips: [
    { machine: 'macbook', time: '2m', preview: 'git diff --stat HEAD~1' },
    { machine: 'deploy-box', time: '14m', preview: 'postgres://stg-db.internal:5432/cinch?sslmode=require' },
  ],
  newClip: {
    machine: 'prod-box',
    time: 'now',
    preview: "panic: ttl in ms, not s — thread 'main' panicked at clips.rs:212",
  },
  tagline: 'Copied behind a firewall.\nAlready on your desktop.',
};

// Beat timing — frames at 30fps. Frame 0 and frame 209 must read as the same
// "resting" state for a seamless loop.
export const beats = {
  typeStart: 4,
  typeEnd: 42,
  successAt: 46,
  packetStart: 60,
  packetEnd: 108,
  rowSlideStart: 108,
  rowSlideEnd: 132,
  taglineIn: 132,
  resetStart: 198,
  end: 210,
} as const;
```

- [ ] **Step 3: Typecheck and commit**

```bash
cd video && npm run typecheck
# Expected: no errors
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video
git add video/src/fonts.ts video/src/scene.ts
git commit -m "feat(video): add fonts (Geist) and typed scene script"
```

---

## Task 3: TerminalWindow + Typewriter

**Files:**
- Create: `video/src/components/TerminalWindow.tsx`, `video/src/components/Typewriter.tsx`

- [ ] **Step 1: Create `video/src/components/Typewriter.tsx`**

```tsx
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface TypewriterProps {
  text: string;
  startFrame: number;
  endFrame: number;
  caret?: boolean;
  style?: React.CSSProperties;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, startFrame, endFrame, caret = true, style }) => {
  const frame = useCurrentFrame();
  const count = Math.round(
    interpolate(frame, [startFrame, endFrame], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const blinkOn = Math.floor(frame / 16) % 2 === 0;
  const showCaret = caret && frame >= startFrame;
  return (
    <span style={style}>
      {text.slice(0, count)}
      {showCaret ? (
        <span style={{ opacity: count < text.length ? 1 : blinkOn ? 1 : 0 }}>▋</span>
      ) : null}
    </span>
  );
};
```

- [ ] **Step 2: Create `video/src/components/TerminalWindow.tsx`**

```tsx
import React from 'react';
import { theme } from '../theme';
import { MONO_FONT } from '../fonts';

interface TerminalWindowProps {
  title: string;
  width: number;
  height: number;
  children: React.ReactNode;
}

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span style={{ width: 11, height: 11, borderRadius: '50%', background: color, display: 'inline-block' }} />
);

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ title, width, height, children }) => {
  return (
    <div
      style={{
        width,
        height,
        background: theme.terminalBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 24px 56px -12px rgba(0,0,0,0.45)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '12px 18px',
          background: 'rgba(255,255,255,0.025)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Dot color={theme.dotR} />
        <Dot color={theme.dotY} />
        <Dot color={theme.dotG} />
        <span style={{ marginLeft: 'auto', fontFamily: MONO_FONT, fontSize: 16, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>
          {title}
        </span>
      </div>
      <div
        style={{
          padding: '30px 34px',
          fontFamily: MONO_FONT,
          fontSize: 19,
          lineHeight: 1.85,
          color: 'rgba(255,255,255,0.75)',
          flex: 1,
          fontVariantLigatures: 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Preview-render check (temporary wiring)**

Temporarily edit `video/src/WorksAnywhere.tsx` to render the terminal so a still can be inspected:

```tsx
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from './theme';
import { scene } from './scene';
import { TerminalWindow } from './components/TerminalWindow';
import { Typewriter } from './components/Typewriter';
import { MONO_FONT } from './fonts';

export const WorksAnywhere: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <div style={{ position: 'absolute', left: 70, top: 250, fontFamily: MONO_FONT }}>
        <TerminalWindow title={scene.terminalTitle} width={440} height={300}>
          <div>
            <span style={{ color: theme.accent }}>$ </span>
            <Typewriter text={scene.promptCommand} startFrame={4} endFrame={42} />
          </div>
          <div style={{ color: theme.semanticOk }}>{scene.successLine}</div>
        </TerminalWindow>
      </div>
    </AbsoluteFill>
  );
};
```

```bash
cd video && npm run still:poster
```

Expected: `video/out/works-anywhere-poster.png` shows the terminal window with the fully-typed command (frame 150 is past `typeEnd`) and the success line, in Geist Mono on `#050505`. Open the PNG and confirm it reads cleanly.

- [ ] **Step 4: Commit**

```bash
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video
git add video/src/components/TerminalWindow.tsx video/src/components/Typewriter.tsx video/src/WorksAnywhere.tsx
git commit -m "feat(video): terminal window + typewriter components"
```

---

## Task 4: Desktop window (Rail + ClipList + ClipRow + SourcePill)

**Files:**
- Create: `video/src/components/SourcePill.tsx`, `video/src/components/ClipRow.tsx`, `video/src/components/ClipList.tsx`, `video/src/components/Rail.tsx`, `video/src/components/DesktopWindow.tsx`

Reference the real anatomy in `cinch/main/apps/desktop/src/components/ClipList.tsx` and `SourcePill.tsx` plus the mockup `cinch/main/apps/desktop/preview/redesign-mockups/clip-list.html`.

- [ ] **Step 1: Create `video/src/components/SourcePill.tsx`**

```tsx
import React from 'react';
import { theme } from '../theme';
import { MONO_FONT } from '../fonts';

// Per-machine tint. Local-ish machines read muted; the hero "prod-box" reads in
// the porcelain accent so the eye lands on the new remote clip.
const TINTS: Record<string, { bg: string; fg: string }> = {
  'prod-box': { bg: 'rgba(79,179,169,0.18)', fg: theme.accentPastel },
  macbook: { bg: 'rgba(255,255,255,0.06)', fg: theme.text2 },
  'deploy-box': { bg: 'rgba(190,217,215,0.10)', fg: '#9db8b5' },
};

export const SourcePill: React.FC<{ machine: string }> = ({ machine }) => {
  const tint = TINTS[machine] ?? { bg: 'rgba(255,255,255,0.06)', fg: theme.text2 };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: tint.bg,
        color: tint.fg,
        fontSize: 15,
        fontFamily: MONO_FONT,
        letterSpacing: '0.04em',
        padding: '2px 11px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      {machine}
    </span>
  );
};
```

- [ ] **Step 2: Create `video/src/components/ClipRow.tsx`**

```tsx
import React from 'react';
import { theme } from '../theme';
import { BODY_FONT, MONO_FONT } from '../fonts';
import { SourcePill } from './SourcePill';
import type { ClipData } from '../scene';

interface ClipRowProps {
  clip: ClipData;
  active?: boolean; // new/highlighted row
  highlight?: number; // 0..1 extra pulse strength
}

export const ClipRow: React.FC<ClipRowProps> = ({ clip, active = false, highlight = 0 }) => {
  const baseBg = active ? theme.accentSubtle : 'transparent';
  // Brief brighter flash when the row arrives, decaying to the resting active tint.
  const bg = active
    ? `color-mix(in srgb, ${theme.selected} ${Math.round(highlight * 100)}%, ${theme.accentSubtle})`
    : baseBg;
  return (
    <div
      style={{
        position: 'relative',
        padding: '16px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
        borderBottom: `1px solid ${theme.border}`,
        background: bg,
        boxShadow: active ? `inset 3px 0 0 ${theme.accent}` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 15, fontFamily: MONO_FONT, letterSpacing: '0.04em', color: theme.text3 }}>
        <SourcePill machine={clip.machine} />
        <span style={{ color: theme.text3 }}>·</span>
        <span>{clip.time}</span>
      </div>
      <div
        style={{
          fontSize: 19,
          fontFamily: BODY_FONT,
          color: theme.text1,
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
        }}
      >
        {clip.preview}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Create `video/src/components/ClipList.tsx`**

```tsx
import React from 'react';
import { theme } from '../theme';
import { MONO_FONT } from '../fonts';
import { ClipRow } from './ClipRow';
import type { ClipData } from '../scene';

interface ClipListProps {
  width: number;
  newClip: ClipData;
  restingClips: ClipData[];
  newRowOpacity: number; // 0..1
  newRowShift: number; // px translateY (negative = from above)
  newRowHighlight: number; // 0..1
}

export const ClipList: React.FC<ClipListProps> = ({ width, newClip, restingClips, newRowOpacity, newRowShift, newRowHighlight }) => {
  return (
    <div style={{ width, background: theme.card, borderRight: `1px solid ${theme.border}`, height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
          padding: '18px 22px 10px',
          fontFamily: MONO_FONT,
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: '0.01em',
          color: theme.text3,
        }}
      >
        <span>Today</span>
        <span style={{ marginLeft: 'auto', fontSize: 14, color: theme.text3 }}>{restingClips.length + (newRowOpacity > 0.05 ? 1 : 0)}</span>
      </div>
      <div style={{ opacity: newRowOpacity, transform: `translateY(${newRowShift}px)` }}>
        <ClipRow clip={newClip} active highlight={newRowHighlight} />
      </div>
      {restingClips.map((c) => (
        <ClipRow key={`${c.machine}-${c.time}`} clip={c} />
      ))}
    </div>
  );
};
```

- [ ] **Step 4: Create `video/src/components/Rail.tsx`**

```tsx
import React from 'react';
import { theme } from '../theme';

// Minimal left icon rail — three rounded glyphs, the top one active (accent).
const RailIcon: React.FC<{ active?: boolean }> = ({ active = false }) => (
  <div
    style={{
      width: 34,
      height: 34,
      borderRadius: 9,
      background: active ? theme.accentSubtle : 'transparent',
      border: `1.5px solid ${active ? theme.accent : 'rgba(255,255,255,0.14)'}`,
    }}
  />
);

export const Rail: React.FC<{ width: number }> = ({ width }) => (
  <div
    style={{
      width,
      height: '100%',
      background: theme.bg,
      borderRight: `1px solid ${theme.border}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: '20px 0',
    }}
  >
    <RailIcon active />
    <RailIcon />
    <RailIcon />
  </div>
);
```

- [ ] **Step 5: Create `video/src/components/DesktopWindow.tsx`**

```tsx
import React from 'react';
import { theme } from '../theme';
import { MONO_FONT } from '../fonts';
import { Rail } from './Rail';
import { ClipList } from './ClipList';
import type { ClipData } from '../scene';

interface DesktopWindowProps {
  width: number;
  height: number;
  newClip: ClipData;
  restingClips: ClipData[];
  newRowOpacity: number;
  newRowShift: number;
  newRowHighlight: number;
}

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span style={{ width: 11, height: 11, borderRadius: '50%', background: color, display: 'inline-block' }} />
);

export const DesktopWindow: React.FC<DesktopWindowProps> = ({ width, height, newClip, restingClips, newRowOpacity, newRowShift, newRowHighlight }) => {
  const railW = 56;
  const listW = 360;
  return (
    <div
      style={{
        width,
        height,
        background: theme.card,
        border: `1px solid rgba(255,255,255,0.10)`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '13px 18px', borderBottom: `1px solid ${theme.border}`, background: 'rgba(255,255,255,0.02)' }}>
        <Dot color={theme.dotR} />
        <Dot color={theme.dotY} />
        <Dot color={theme.dotG} />
        <span style={{ marginLeft: 'auto', fontFamily: MONO_FONT, fontSize: 15, color: theme.text3, letterSpacing: '0.04em' }}>cinch</span>
      </div>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Rail width={railW} />
        <ClipList
          width={listW}
          newClip={newClip}
          restingClips={restingClips}
          newRowOpacity={newRowOpacity}
          newRowShift={newRowShift}
          newRowHighlight={newRowHighlight}
        />
        <div style={{ flex: 1, background: theme.bg }} />
      </div>
    </div>
  );
};
```

- [ ] **Step 6: Preview-render check**

Temporarily wire the desktop window into `WorksAnywhere.tsx` (add alongside the terminal), passing static values `newRowOpacity={1} newRowShift={0} newRowHighlight={0}`:

```tsx
// inside the AbsoluteFill, after the terminal block:
<div style={{ position: 'absolute', right: 70, top: 120 }}>
  <DesktopWindow
    width={520}
    height={560}
    newClip={scene.newClip}
    restingClips={scene.restingClips}
    newRowOpacity={1}
    newRowShift={0}
    newRowHighlight={0}
  />
</div>
```

(Import `DesktopWindow` at the top.) Then:

```bash
cd video && npm run still:poster
```

Expected: the still shows the desktop window — title bar, rail, and a `ClipList` with the `prod-box · now` highlighted row on top plus the two resting rows. Compare against `cinch/main/apps/desktop/preview/redesign-mockups/clip-list.html`.

- [ ] **Step 7: Commit**

```bash
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video
git add video/src/components/SourcePill.tsx video/src/components/ClipRow.tsx video/src/components/ClipList.tsx video/src/components/Rail.tsx video/src/components/DesktopWindow.tsx video/src/WorksAnywhere.tsx
git commit -m "feat(video): faithful desktop window (rail + clip list + source pill)"
```

---

## Task 5: SignalPath (packet crossing VPN/firewall → relay)

**Files:**
- Create: `video/src/components/SignalPath.tsx`

- [ ] **Step 1: Create `video/src/components/SignalPath.tsx`**

```tsx
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../theme';
import { MONO_FONT } from '../fonts';
import { beats } from '../scene';

interface SignalPathProps {
  width: number; // horizontal span of the path
  height: number;
}

// A glowing accent packet travels left→right, crossing two faint boundary
// markers (VPN, firewall) and pulsing a small relay node on arrival.
export const SignalPath: React.FC<SignalPathProps> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const midY = height / 2;
  const progress = interpolate(frame, [beats.packetStart, beats.packetEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = progress * width;
  const visible = frame >= beats.packetStart && frame <= beats.packetEnd + 6;
  const relayPulse = interpolate(frame, [beats.packetEnd - 8, beats.packetEnd, beats.packetEnd + 16], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const Boundary: React.FC<{ at: number; label: string }> = ({ at, label }) => (
    <>
      <div style={{ position: 'absolute', left: at, top: midY - 46, width: 1.5, height: 92, background: 'rgba(255,255,255,0.10)' }} />
      <span style={{ position: 'absolute', left: at - 22, top: midY + 52, fontFamily: MONO_FONT, fontSize: 13, letterSpacing: '0.08em', color: theme.text3, textTransform: 'uppercase' }}>
        {label}
      </span>
    </>
  );

  return (
    <div style={{ position: 'relative', width, height }}>
      {/* baseline route */}
      <div style={{ position: 'absolute', left: 0, top: midY, width, height: 1.5, background: 'rgba(255,255,255,0.06)' }} />
      <Boundary at={width * 0.3} label="VPN" />
      <Boundary at={width * 0.6} label="firewall" />
      {/* relay node */}
      <div
        style={{
          position: 'absolute',
          left: width - 16,
          top: midY - 16,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: `1.5px solid ${theme.accent}`,
          background: `rgba(79,179,169,${0.12 + relayPulse * 0.5})`,
          boxShadow: `0 0 ${10 + relayPulse * 30}px rgba(79,179,169,${0.3 + relayPulse * 0.5})`,
        }}
      />
      <span style={{ position: 'absolute', left: width - 30, top: midY + 28, fontFamily: MONO_FONT, fontSize: 13, color: theme.text3 }}>relay</span>
      {/* the packet */}
      {visible ? (
        <div
          style={{
            position: 'absolute',
            left: x - 7,
            top: midY - 7,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: theme.accent,
            boxShadow: `0 0 22px 6px rgba(79,179,169,0.7)`,
          }}
        />
      ) : null}
    </div>
  );
};
```

- [ ] **Step 2: Preview-render check at mid-flight**

Temporarily set the poster frame to mid-flight to inspect the packet, and wire `SignalPath` into the center of `WorksAnywhere.tsx`:

```tsx
// import SignalPath, then inside AbsoluteFill, centered between the two windows:
<div style={{ position: 'absolute', left: 520, top: 280 }}>
  <SignalPath width={180} height={200} />
</div>
```

```bash
cd video && npx remotion still WorksAnywhere out/mid.png --frame=84 --scale=2
```

Expected: `video/out/mid.png` shows the accent packet roughly halfway along the route, the two faint `VPN`/`firewall` markers, and the relay node on the right. Delete `out/mid.png` after viewing.

- [ ] **Step 3: Commit**

```bash
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video
git add video/src/components/SignalPath.tsx video/src/WorksAnywhere.tsx
git commit -m "feat(video): signal path with VPN/firewall crossing + relay pulse"
```

---

## Task 6: Tagline

**Files:**
- Create: `video/src/components/Tagline.tsx`

- [ ] **Step 1: Create `video/src/components/Tagline.tsx`**

```tsx
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../theme';
import { BODY_FONT } from '../fonts';
import { beats } from '../scene';

export const Tagline: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [beats.taglineIn, beats.taglineIn + 14, beats.resetStart, beats.end],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const rise = interpolate(frame, [beats.taglineIn, beats.taglineIn + 14], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${rise}px)`,
        fontFamily: BODY_FONT,
        fontWeight: 600,
        fontSize: 30,
        lineHeight: 1.3,
        color: theme.text1,
        textAlign: 'center',
        whiteSpace: 'pre-line',
        letterSpacing: '-0.01em',
      }}
    >
      {text}
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video
git add video/src/components/Tagline.tsx
git commit -m "feat(video): tagline component"
```

---

## Task 7: Compose `WorksAnywhere` (full frame orchestration + seamless loop)

**Files:**
- Modify: `video/src/WorksAnywhere.tsx` (replace placeholder/preview wiring with the final composition)

- [ ] **Step 1: Replace `video/src/WorksAnywhere.tsx` with the final composition**

```tsx
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from './theme';
import { scene, beats } from './scene';
import { MONO_FONT } from './fonts';
import { TerminalWindow } from './components/TerminalWindow';
import { Typewriter } from './components/Typewriter';
import { DesktopWindow } from './components/DesktopWindow';
import { SignalPath } from './components/SignalPath';
import { Tagline } from './components/Tagline';

export const WorksAnywhere: React.FC = () => {
  const frame = useCurrentFrame();

  // Success line fades in after the command is typed; fades out on reset.
  const successOpacity = interpolate(
    frame,
    [beats.successAt, beats.successAt + 8, beats.resetStart, beats.end],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Command fades out on reset so frame 209 ≈ frame 0 (empty terminal).
  const commandOpacity = interpolate(frame, [beats.resetStart, beats.end], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // New clip row: slide in (from above) + fade in, then fade out on reset.
  const newRowOpacity = interpolate(
    frame,
    [beats.rowSlideStart, beats.rowSlideEnd, beats.resetStart, beats.end],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const newRowShift = interpolate(frame, [beats.rowSlideStart, beats.rowSlideEnd], [-26, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const newRowHighlight = interpolate(frame, [beats.rowSlideEnd, beats.rowSlideEnd + 18], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Source terminal (left) */}
      <div style={{ position: 'absolute', left: 70, top: 250 }}>
        <TerminalWindow title={scene.terminalTitle} width={440} height={300}>
          <div style={{ opacity: commandOpacity }}>
            <span style={{ color: theme.accent }}>$ </span>
            <Typewriter text={scene.promptCommand} startFrame={beats.typeStart} endFrame={beats.typeEnd} />
          </div>
          <div style={{ color: theme.semanticOk, opacity: successOpacity, marginTop: 6 }}>{scene.successLine}</div>
        </TerminalWindow>
      </div>

      {/* Signal path (center) */}
      <div style={{ position: 'absolute', left: 520, top: 300 }}>
        <SignalPath width={170} height={200} />
      </div>

      {/* Desktop window (right, hero) */}
      <div style={{ position: 'absolute', right: 70, top: 120 }}>
        <DesktopWindow
          width={520}
          height={560}
          newClip={scene.newClip}
          restingClips={scene.restingClips}
          newRowOpacity={newRowOpacity}
          newRowShift={newRowShift}
          newRowHighlight={newRowHighlight}
        />
      </div>

      {/* Tagline (bottom center) */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center', fontFamily: MONO_FONT }}>
        <Tagline text={scene.tagline} />
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Render the full set of review stills**

```bash
cd video
for f in 0 30 50 84 120 150 175 205; do npx remotion still WorksAnywhere out/frame-$f.png --frame=$f --scale=1; done
```

Expected: 8 PNGs in `video/out/`. Verify the beats read correctly:
- `frame-0` / `frame-205`: resting state (empty terminal, no packet, no new row, no tagline) — they should look ~identical (seamless loop).
- `frame-30`: command mid-type.
- `frame-50`: command done + `✓ sent · E2EE`.
- `frame-84`: packet mid-flight crossing the markers.
- `frame-120`: new `prod-box · now` row sliding in / highlighted.
- `frame-150`: tagline fully visible (this is the poster frame).
- `frame-175`: hold.

Delete the review frames after inspection: `rm video/out/frame-*.png`.

- [ ] **Step 3: Commit**

```bash
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video
git add video/src/WorksAnywhere.tsx
git commit -m "feat(video): full WorksAnywhere composition with seamless loop"
```

---

## Task 8: Render final assets + enforce size budget

**Files:**
- Create (committed): `public/videos/works-anywhere.webm`, `public/videos/works-anywhere.mp4`, `public/videos/works-anywhere-poster.png`

- [ ] **Step 1: Render all three outputs and copy into `public/videos/`**

```bash
cd video && npm run render:all
```

Expected: `render:all` writes `out/works-anywhere.{webm,mp4}` + `out/works-anywhere-poster.png`, then copies all three into `../public/videos/` (the copy script prints `copied ...` three times).

- [ ] **Step 2: Check the size budget**

```bash
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video
ls -lh public/videos/
```

Expected budget: webm < 1 MB, mp4 < 1.5 MB, poster < 200 KB. If the webm/mp4 exceed budget, lower bitrate, e.g. re-render with `--crf=30` (webm) / a higher `--crf` for h264, then re-copy. Record the final sizes in the commit message.

- [ ] **Step 3: Commit the rendered assets**

```bash
git add public/videos/works-anywhere.webm public/videos/works-anywhere.mp4 public/videos/works-anywhere-poster.png
git commit -m "feat(video): render Works Anywhere promo assets (webm/mp4/poster)"
```

---

## Task 9: Astro integration (TDD)

**Files:**
- Create: `src/components/landing/Features.test.ts`
- Modify: `src/components/landing/Features.astro`

- [ ] **Step 1: Write the failing test**

Create `src/components/landing/Features.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const src = readFileSync(
  fileURLToPath(new URL('./Features.astro', import.meta.url)),
  'utf8',
);

describe('Works Anywhere tab — promo video', () => {
  it('drops the dead screenshot reference', () => {
    expect(src).not.toContain('/images/desktop-screenshot.png');
  });

  it('renders a muted, looping, inline video with a poster', () => {
    expect(src).toContain('<video');
    expect(src).toMatch(/\bmuted\b/);
    expect(src).toMatch(/\bloop\b/);
    expect(src).toMatch(/\bplaysinline\b/);
    expect(src).toContain('poster="/videos/works-anywhere-poster.png"');
    expect(src).toContain('aria-label=');
    expect(src).toContain('data-tab-video="desktop"');
  });

  it('offers both webm and mp4 sources', () => {
    expect(src).toContain('/videos/works-anywhere.webm');
    expect(src).toContain('/videos/works-anywhere.mp4');
    expect(src).toContain('type="video/webm"');
    expect(src).toContain('type="video/mp4"');
  });

  it('plays only on the active tab and respects reduced motion', () => {
    expect(src).toContain('prefers-reduced-motion');
    expect(src).toMatch(/\.play\(/);
    expect(src).toMatch(/\.pause\(/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video
npx vitest run src/components/landing/Features.test.ts
```

Expected: FAIL — the assertions about `<video>`, sources, poster, and the reduced-motion/`.play(` script are not yet present; the `/images/desktop-screenshot.png` assertion also fails because the old `<img>` is still there.

- [ ] **Step 3: Replace the `<img>` with the `<video>` in `Features.astro`**

In `src/components/landing/Features.astro`, replace the `#tab-desktop` `.panel-visual` block (the `<div class="screenshot-frame"> ... <img ... /> </div>`, currently lines ~64-71) with:

```html
            <div class="panel-visual">
              <div class="screenshot-frame">
                <video
                  class="desktop-screenshot"
                  data-tab-video="desktop"
                  muted
                  loop
                  playsinline
                  preload="none"
                  poster="/videos/works-anywhere-poster.png"
                  aria-label="Demo: a clip sent with cinch from a remote box behind a firewall appears instantly in the cinch desktop app"
                >
                  <source src="/videos/works-anywhere.webm" type="video/webm" />
                  <source src="/videos/works-anywhere.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
```

(There is no static `autoplay` attribute: the panel starts hidden, so playback is JS-driven on tab activation. The `poster` is what reduced-motion users and the no-JS baseline see.)

- [ ] **Step 4: Extend the tab `<script>` for tab-gated, reduced-motion-aware playback**

In `src/components/landing/Features.astro`, the existing `<script>` ends with the `buttons.forEach(...)` click handler. Replace that whole `<script>` block with:

```html
<script>
  const buttons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const demoVideo = document.querySelector('video[data-tab-video="desktop"]');

  function syncDemoVideo(activeTab: string | null) {
    if (!(demoVideo instanceof HTMLVideoElement)) return;
    if (activeTab === 'desktop' && !reduceMotion) {
      demoVideo.play().catch(() => {});
    } else {
      demoVideo.pause();
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');

      buttons.forEach((b) => b.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(`tab-${tab}`);
      if (target) {
        target.classList.add('active');
      }
      syncDemoVideo(tab);
    });
  });
</script>
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video
npx vitest run src/components/landing/Features.test.ts
```

Expected: PASS (all four `describe` cases green).

- [ ] **Step 6: Build the site to confirm no Astro/TS errors**

```bash
npm run build
```

Expected: Astro build completes with no errors; `dist/` is produced. (The Remotion `video/` subproject is not part of this build.)

- [ ] **Step 7: Commit**

```bash
git add src/components/landing/Features.astro src/components/landing/Features.test.ts
git commit -m "feat(landing): play Works Anywhere promo video in the desktop tab"
```

---

## Task 10: Visual QA + finish

- [ ] **Step 1: Visual QA in a browser**

Use the `/browse` skill (or `npm run dev` + manual) to open the landing page, click the **Works Anywhere** tab, and confirm:
- the video plays once the tab is active, loops seamlessly, and is muted;
- the poster shows before play and for reduced-motion (toggle OS "Reduce motion" and reload);
- mobile layout (≤900px) still renders the panel cleanly (the `.panel-visual` order flips above the copy).

Capture before/after screenshots for the PR.

- [ ] **Step 2: Run the full test + lint suite**

```bash
cd /Users/jinmu/Programming/cinchcli/website/claude-works-anywhere-video
npx vitest run
npm run lint || true   # if the repo defines a lint script; new video/ TS is scoped out of the Astro config
```

Expected: all tests pass.

- [ ] **Step 3: Finish the branch**

Use the `superpowers:finishing-a-development-branch` skill to choose merge / PR / cleanup. The branch is `agent/claude/works-anywhere-video`; the spec is at `docs/superpowers/specs/2026-06-04-works-anywhere-promo-video-design.md`.

---

## Self-review notes (author)

- **Spec coverage:** medium=Remotion (Tasks 1-8), story=cross-boundary (Task 7 beats), fidelity=faithful rebuild (Tasks 3-4 mirror real components), 16:10 @2× (theme `WIDTH/HEIGHT` + `--scale=2`), integration + lazy/tab-gated + reduced-motion + poster (Task 9), honesty (`cinch send`/E2EE/`prod-box`/`now` in `scene.ts`), testing (Task 9 DOM test + still reviews), size budget (Task 8). All spec sections map to a task.
- **Fonts:** resolved to Geist + Geist Mono via `@remotion/google-fonts` (spec open question 1 closed).
- **Type consistency:** `ClipData` (`scene.ts`) flows through `ClipRow`/`ClipList`/`DesktopWindow`; `newRowOpacity`/`newRowShift`/`newRowHighlight` names are identical across `ClipList`, `DesktopWindow`, and the composition; `beats.*` keys used by `SignalPath`, `Tagline`, and `WorksAnywhere` all exist in `scene.ts`.
- **Loop seam:** every animated element (command, success, packet, new row, tagline) returns to its frame-0 state by `beats.end`, verified by the `frame-0` vs `frame-205` still comparison in Task 7 Step 2.
