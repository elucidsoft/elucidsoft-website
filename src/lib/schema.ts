/**
 * The entity graph.
 *
 * This is the substantive reason the site exists. Until now the four
 * open-source projects declared "A project by upstat.io", which told every
 * crawler and every answer engine that a monitoring SaaS is the parent of a
 * programming language and a terminal emulator. Nothing anywhere asserted that
 * one company owns all six.
 *
 * The fix is a reciprocal pair. This site publishes Organization with a
 * `subOrganization` entry per product, each carrying a stable `@id`; each
 * product page publishes the software entity with `parentOrganization` pointing
 * back at ORG_ID. Reciprocal edges are what let a knowledge graph treat the six
 * as one portfolio instead of six unrelated sites that happen to share a
 * GitHub org.
 *
 * schema.org has no property for a "doing business as" name, so the two trade
 * names are carried in `alternateName` — the documented substitute.
 */

import { COMPANY, ORG_ID, SITE_URL, KNOWS_ABOUT } from '../data/company';
import { PRODUCTS, type Product } from '../data/portfolio';
import { buildCanonical } from './seo';

export const CONTEXT = 'https://schema.org';

/** Stable node id for a product, referenced from both directions. */
export function productId(product: Product): string {
  return `${buildCanonical(`/portfolio/${product.slug}`)}#${
    product.division === 'saas' ? 'software' : 'project'
  }`;
}

/**
 * Jurisdiction only.
 *
 * The street address is not published anywhere on the site, so it is not
 * asserted here either — structured data that contradicts the visible page is
 * worse than structured data that is merely thin. Region and country still
 * carry the part that matters for entity resolution: which state's registry
 * this company can be looked up in.
 */
export function postalAddress() {
  return {
    '@type': 'PostalAddress',
    addressRegion: COMPANY.regionCode,
    addressCountry: COMPANY.countryCode,
  };
}

/**
 * The parent Organization node.
 *
 * `subOrganization` uses full nodes rather than bare `@id` references so the
 * homepage alone is enough for a crawler that never fetches a product page —
 * which, for an answer engine summarising "what does Elucidsoft make", is the
 * common case.
 */
export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: COMPANY.legalName,
    legalName: COMPANY.legalName,
    alternateName: [...COMPANY.tradeNames],
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: new URL('/logo.png', SITE_URL).href,
      width: 400,
      height: 400,
    },
    foundingDate: String(COMPANY.foundingYear),
    founder: {
      '@type': 'Person',
      name: COMPANY.founder.name,
      url: COMPANY.founder.url,
    },
    address: postalAddress(),
    sameAs: COMPANY.githubAccounts.map((a) => a.url),
    knowsAbout: [...KNOWS_ABOUT],
    subOrganization: PRODUCTS.map((product) => ({
      '@type': 'Organization',
      '@id': productId(product),
      name: product.name,
      url: product.url,
      description: product.category,
      parentOrganization: { '@id': ORG_ID },
    })),
  };
}

export function websiteSchema(siteName: string, description: string) {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: siteName,
    description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

/**
 * The per-product node.
 *
 * Commercial products are SoftwareApplication; the open-source projects are
 * SoftwareSourceCode, because that is what they actually are — a repository
 * and a licence, not a hosted application a visitor can sign up for. Declaring
 * an alpha compiler as a SoftwareApplication would be asserting eligibility
 * for rich results the page cannot honour.
 */
export function productSchema(product: Product, description: string) {
  const base = {
    '@id': productId(product),
    name: product.name,
    url: product.url,
    description,
    applicationCategory: product.category,
    parentOrganization: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    ...(product.version ? { softwareVersion: product.version } : {}),
  };

  if (product.division === 'saas') {
    return {
      '@type': 'SoftwareApplication',
      ...base,
      operatingSystem: 'Web',
    };
  }

  return {
    '@type': 'SoftwareSourceCode',
    ...base,
    codeRepository: product.github,
    programmingLanguage: product.tech,
    ...(product.license ? { license: product.license } : {}),
  };
}

/**
 * Wraps a set of nodes as a single @graph.
 *
 * One script tag with a graph beats several disconnected ones: the `@id`
 * references between nodes only resolve when a consumer sees them together.
 */
export function graph(...nodes: unknown[]) {
  return {
    '@context': CONTEXT,
    '@graph': nodes.filter(Boolean),
  };
}
