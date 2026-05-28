import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const heroSource = readFileSync(
  fileURLToPath(new URL('./Hero.astro', import.meta.url)),
  'utf8',
);

describe('landing hero background', () => {
  it('renders a decorative instrument glow layer behind hero content', () => {
    expect(heroSource).toContain('<div class="hero-atmosphere" aria-hidden="true">');
    expect(heroSource.match(/class="instrument-ring"/g)).toHaveLength(2);
    expect(heroSource).toContain('<span class="scanline"></span>');
    expect(heroSource).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
