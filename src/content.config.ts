import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const compareRow = z.object({
  feature: z.string(),
  cinch: z.string(),
  competitor: z.string(),
  note: z.string().optional(),
});

const howToStep = z.object({
  name: z.string(),
  text: z.string(),
  code: z.string().optional(),
});

const faq = z.object({ q: z.string(), a: z.string() });

const guidesSchema = z.object({
  type: z.enum(['compare', 'use-case', 'tutorial']),
  title: z.string().max(70),
  description: z.string().max(160),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  editor: z.enum(['vim', 'neovim', 'vscode', 'cursor', 'jetbrains', 'emacs', 'zed']).optional(),
  environment: z.enum(['ssh', 'ci', 'docker', 'devcontainer', 'wsl', 'tmux']).optional(),
  os: z.array(z.enum(['macos', 'linux', 'windows'])).optional(),
  competitor: z.object({
    name: z.string(),
    url: z.string().url().optional(),
    rows: z.array(compareRow).default([]),
  }).optional(),
  steps: z.array(howToStep).optional(),
  faqs: z.array(faq).optional(),
  noindex: z.boolean().default(false),
  canonical: z.string().url().optional(),
  ogImage: z.string().optional(),
});

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  guides: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
    schema: guidesSchema,
  }),
};
