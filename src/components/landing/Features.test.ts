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
