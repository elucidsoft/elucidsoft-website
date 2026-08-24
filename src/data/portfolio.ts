/**
 * The portfolio register — the single source of truth for all seven products.
 *
 * This module holds FACTS ONLY: URLs, licences, versions, packages, stage.
 * Every piece of human-readable prose lives in `./copy.ts` and is joined to
 * these records by slug. The split is deliberate — facts are verified against
 * live hosts and repository metadata, prose is written and reviewed, and the
 * two have different failure modes.
 *
 * The home page, /portfolio/, every /portfolio/<slug>/ page, /open-source/,
 * /facts/, the footer, llms.txt and the Organization JSON-LD all derive from
 * this array. Nothing about a product is typed twice. That rule is not
 * stylistic: cloudlayer.io centralised its pricing into one module after four
 * of six hand-typed prices had drifted from the real plans, and a URL repeated
 * across a dozen templates fails the same way.
 *
 * NO STAR COUNTS, NO METRICS. Anything that changes without a deploy does not
 * belong on a static page — it would be published as fact and become false in
 * the background.
 *
 * URL ACCURACY — every `url` was verified live (HTTP 200 plus a <title> check),
 * not copied from the product's own repo config. Three traps:
 *
 *   - orijs.dev does not resolve. The orijs-website repo still sets
 *     `site: 'https://orijs.dev'`, so its canonicals point at a dead host.
 *     The live site is orijs.org.
 *   - warpkit.dev belongs to an unrelated company (a "TypeScript SaaS Starter
 *     Kit") and warpkit.io is a parked registrar page. Only warpkit.org is
 *     ours; it is the one serving github.com/upstat-io/warpkit in its footer.
 *   - cloudlayer.io runs trailingSlash: 'always' and Upstat (SvelteKit) runs
 *     bare paths. The trailing slashes below are deliberate — changing them
 *     costs a redirect hop on every outbound link.
 */

export type Division = 'saas' | 'oss';
export type Relationship = 'dba' | 'project';
export type Stage = 'live' | 'alpha' | 'coming-soon';

export interface Product {
  /** Route segment and the key into COPY.PRODUCTS. */
  slug: string;
  /** Display name, cased as the product cases itself. */
  name: string;
  /** Name as it appears in the register. */
  registerName: string;
  division: Division;
  relationship: Relationship;
  stage: Stage;
  /** Live, verified canonical URL. Trailing slash is significant. */
  url: string;
  /** Bare host, for display. */
  displayUrl: string;
  category: string;
  audience: string;
  tech: string[];
  /**
   * The product's OWN brand mark, taken from its live site, and the accent
   * colour that mark actually uses.
   *
   * This is what makes the page read as a holding company's rather than as one
   * person's index. Every corporate umbrella site that works — Bending Spoons,
   * Tiny, IAC — presents the portfolio as the real brand logos, not as a
   * styled text list. Six distinct identities on one page is the correct
   * outcome here rather than a failure of consistency: the parent's job is to
   * hold them, not to overwrite them.
   */
  brand: {
    /** Path under /brands/. */
    logo: string;
    /** Accent sampled from that product's own artwork or theme-color. */
    accent: string;
    /** The ground the mark was drawn for, so it never sits on a clashing tile. */
    ground: string;
    /**
     * Foreground for a tile painted in the brand's own accent. Chosen by
     * contrast rather than by taste: every one of the six accents is a mid-to-
     * light hue, so dark ink clears 5:1 or better on all of them while white
     * fails on four.
     */
    ink: string;
  };
  github?: string;
  license?: string;
  version?: string;
  docsUrl?: string;
  npmPackages?: string[];
  /** Verified links surfaced on the product page. */
  links?: { label: string; href: string }[];
  foundedYear?: number;
}

export const PRODUCTS: Product[] = [
  {
    slug: 'upstat',
    name: 'Upstat',
    registerName: 'Upstat',
    division: 'saas',
    relationship: 'dba',
    stage: 'coming-soon',
    url: 'https://upstat.io',
    displayUrl: 'upstat.io',
    brand: { logo: '/brands/upstat.svg', accent: '#3b82f6', ground: '#0b1120', ink: '#0B1020' },
    category: 'Incident management',
    audience: 'DevOps and SRE teams, engineering managers',
    tech: ['SvelteKit', 'TypeScript', 'Cloudflare'],
    docsUrl: 'https://upstat.io/docs/',
    links: [
      { label: 'Pricing', href: 'https://upstat.io/pricing' },
      { label: 'Documentation', href: 'https://upstat.io/docs/' },
      { label: 'Integrations', href: 'https://upstat.io/integrations' },
      { label: 'Security', href: 'https://upstat.io/security' },
      { label: 'Blog', href: 'https://upstat.io/blog/' },
    ],
  },
  {
    slug: 'cloudlayer',
    name: 'cloudlayer.io',
    registerName: 'cloudlayer.io',
    division: 'saas',
    relationship: 'dba',
    stage: 'live',
    url: 'https://cloudlayer.io/',
    displayUrl: 'cloudlayer.io',
    foundedYear: 2020,
    brand: { logo: '/brands/cloudlayer.svg', accent: '#9b74df', ground: '#0f0d1a', ink: '#0B1020' },
    category: 'Document generation',
    audience: 'Developers and operations teams',
    tech: ['Astro', 'Svelte 5', 'TypeScript', 'Cloudflare'],
    github: 'https://github.com/cloudlayerio',
    docsUrl: 'https://cloudlayer.io/docs/',
    links: [
      { label: 'Pricing', href: 'https://cloudlayer.io/pricing/' },
      { label: 'API reference', href: 'https://cloudlayer.io/docs/api-overview/' },
      { label: 'SDKs', href: 'https://cloudlayer.io/docs/sdks/' },
      { label: 'Templating', href: 'https://cloudlayer.io/docs/templating/' },
      { label: 'Visual editor', href: 'https://cloudlayer.io/docs/visual-editor/' },
      { label: 'Blog', href: 'https://cloudlayer.io/blog/' },
    ],
  },
  {
    slug: 'actlume',
    name: 'ActLume',
    registerName: 'ActLume',
    division: 'saas',
    relationship: 'dba',
    stage: 'coming-soon',
    url: 'https://actlume.com/',
    displayUrl: 'actlume.com',
    brand: { logo: '/brands/actlume.svg', accent: '#f2a67f', ground: '#224c40', ink: '#0B1020' },
    category: 'Regulatory incident reporting',
    audience: 'Manufacturers subject to the EU Cyber Resilience Act',
    tech: ['Bun', 'Svelte 5', 'OriJS', 'PostgreSQL'],
    docsUrl: 'https://actlume.com/docs/',
    links: [
      { label: 'How it works', href: 'https://actlume.com/how-it-works/' },
      { label: 'CRA Article 14 guide', href: 'https://actlume.com/cra-article-14/' },
      { label: 'Pricing', href: 'https://actlume.com/pricing/' },
      { label: 'Security', href: 'https://actlume.com/security/' },
      { label: 'Blog', href: 'https://actlume.com/blog/' },
    ],
  },
  {
    slug: 'warpkit',
    name: 'WarpKit',
    registerName: 'WarpKit',
    division: 'oss',
    relationship: 'project',
    stage: 'alpha',
    url: 'https://warpkit.org',
    displayUrl: 'warpkit.org',
    brand: { logo: '/brands/warpkit.svg', accent: '#f7a41d', ground: '#060a14', ink: '#0B1020' },
    category: 'Frontend framework',
    audience: 'Svelte developers building single-page applications',
    tech: ['Svelte 5', 'TypeScript', 'Vite'],
    github: 'https://github.com/upstat-io/warpkit',
    license: 'MIT',
    version: '0.0.1',
    docsUrl: 'https://warpkit.org/docs',
    npmPackages: [
      '@warpkit/core',
      '@warpkit/data',
      '@warpkit/cache',
      '@warpkit/forms',
      '@warpkit/validation',
      '@warpkit/websocket',
      '@warpkit/auth-firebase',
      '@warpkit/types',
    ],
    links: [
      { label: 'Documentation', href: 'https://warpkit.org/docs' },
      { label: '@warpkit/core on npm', href: 'https://www.npmjs.com/package/@warpkit/core' },
    ],
  },
  {
    slug: 'ori-lang',
    name: 'Ori',
    registerName: 'Ori Lang',
    division: 'oss',
    relationship: 'project',
    stage: 'alpha',
    url: 'https://ori-lang.com',
    displayUrl: 'ori-lang.com',
    brand: { logo: '/brands/ori-lang.svg', accent: '#daa520', ground: '#1a2028', ink: '#0B1020' },
    category: 'Programming language',
    audience: 'Language and systems programmers',
    tech: ['Rust', 'LLVM'],
    github: 'https://github.com/upstat-io/ori-lang',
    license: 'MIT OR Apache-2.0',
    version: '2026.7.28-alpha.1',
    docsUrl: 'https://ori-lang.com/docs',
    links: [
      { label: 'Playground', href: 'https://ori-lang.com/playground' },
      { label: 'Documentation', href: 'https://ori-lang.com/docs' },
      { label: 'Getting started', href: 'https://ori-lang.com/guide/01-getting-started' },
      { label: 'Changelog', href: 'https://ori-lang.com/changelog' },
      { label: 'Roadmap', href: 'https://ori-lang.com/roadmap' },
      { label: 'Discussions', href: 'https://github.com/upstat-io/ori-lang/discussions' },
    ],
  },
  {
    slug: 'ori-term',
    name: 'ori-term',
    registerName: 'ori-term',
    division: 'oss',
    relationship: 'project',
    stage: 'alpha',
    url: 'https://oriterm.com',
    displayUrl: 'oriterm.com',
    brand: { logo: '/brands/ori-term.svg', accent: '#00ff41', ground: '#0a0a0a', ink: '#0B1020' },
    category: 'Terminal emulator',
    audience: 'Terminal users on Windows, Linux and macOS',
    tech: ['Rust', 'GPU rendering'],
    github: 'https://github.com/upstat-io/ori-term',
    license: 'MIT',
    version: '0.2.0-alpha.20260528',
    docsUrl: 'https://oriterm.com/docs',
    links: [
      { label: 'Install', href: 'https://oriterm.com/install' },
      { label: 'Features', href: 'https://oriterm.com/features' },
      { label: 'Screenshots', href: 'https://oriterm.com/screenshots' },
      { label: 'Roadmap', href: 'https://oriterm.com/roadmap' },
      { label: 'Changelog', href: 'https://oriterm.com/changelog' },
    ],
  },
  {
    slug: 'orijs',
    name: 'OriJS',
    registerName: 'OriJS',
    division: 'oss',
    relationship: 'project',
    stage: 'alpha',
    url: 'https://orijs.org',
    displayUrl: 'orijs.org',
    brand: { logo: '/brands/orijs.svg', accent: '#7bb88a', ground: '#1a1612', ink: '#0B1020' },
    category: 'Backend framework',
    audience: 'TypeScript backend developers on Bun',
    tech: ['Bun', 'TypeScript'],
    github: 'https://github.com/upstat-io/orijs',
    license: 'MIT',
    version: '0.0.1',
    docsUrl: 'https://orijs.org/docs',
    links: [
      { label: 'Guide', href: 'https://orijs.org/guide' },
      { label: 'Documentation', href: 'https://orijs.org/docs' },
    ],
  },
];

export const SAAS_PRODUCTS = PRODUCTS.filter((p) => p.division === 'saas');
export const OSS_PRODUCTS = PRODUCTS.filter((p) => p.division === 'oss');

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const STAGE_LABEL: Record<Stage, string> = {
  live: 'Live',
  alpha: 'Alpha',
  'coming-soon': 'Coming soon',
};

export const DIVISION_LABEL: Record<Division, string> = {
  saas: 'Commercial',
  oss: 'Open source',
};

export const RELATIONSHIP_LABEL: Record<Relationship, string> = {
  dba: 'Registered trade name of Elucidsoft LLC',
  project: 'Open-source project of Elucidsoft LLC',
};
