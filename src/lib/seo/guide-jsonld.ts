import type { CollectionEntry } from 'astro:content';

type GuideEntry = CollectionEntry<'guides'>;
type JsonLd = Record<string, unknown>;

export function buildGuideJsonLd(entry: GuideEntry, site: URL): JsonLd {
  const url = new URL(`/guides/${entry.id}/`, site).href;
  const base = {
    '@context': 'https://schema.org',
    inLanguage: 'en',
    url,
    headline: entry.data.title,
    description: entry.data.description,
    datePublished: entry.data.publishedAt.toISOString(),
    dateModified: (entry.data.updatedAt ?? entry.data.publishedAt).toISOString(),
    author: { '@type': 'Organization', name: 'Cinch', url: site.href },
    publisher: { '@type': 'Organization', name: 'Cinch', url: site.href },
  };

  if (entry.data.type === 'compare') {
    if (entry.data.faqs && entry.data.faqs.length > 0) {
      return {
        ...base,
        '@type': 'FAQPage',
        mainEntity: entry.data.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      };
    }
    return { ...base, '@type': 'TechArticle' };
  }

  if (entry.data.type === 'use-case') {
    return {
      ...base,
      '@type': 'HowTo',
      name: entry.data.title,
      step: (entry.data.steps ?? []).map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    };
  }

  return { ...base, '@type': 'TechArticle' };
}
