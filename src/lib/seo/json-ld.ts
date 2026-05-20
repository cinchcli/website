/**
 * JSON-LD serialized for safe embedding in HTML <script type="application/ld+json">.
 * Escapes '<' so sequences like "</script>" inside string values cannot terminate the tag early
 * (which breaks parsing and surfaces as "Missing '}' or object member name" in Search Console).
 */
export function serializeJsonLdForHtmlScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export type JsonLdNode = Record<string, unknown>;

/**
 * Normalize landing-page JSON-LD to a single { @context, @graph } document for consistent parsing.
 */
export function toJsonLdDocument(
  custom: JsonLdNode | JsonLdNode[] | undefined,
  fallback: () => JsonLdNode,
): JsonLdNode {
  if (custom === undefined) {
    return fallback();
  }
  if (Array.isArray(custom)) {
    return { '@context': 'https://schema.org', '@graph': custom };
  }
  if ('@graph' in custom && custom['@graph'] !== undefined) {
    return {
      '@context': 'https://schema.org',
      ...custom,
    };
  }
  return { '@context': 'https://schema.org', '@graph': [custom] };
}
