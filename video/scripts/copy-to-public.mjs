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
