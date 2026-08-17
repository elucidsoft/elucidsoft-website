export interface PageMetadata {
  title?: string;
  description?: string;
  canonical?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  siteName?: string;
  [key: string]: unknown;
}

export interface MarkdownNegotiationOptions {
  /**
   * Strategy for extracting content:
   * - 'auto': Checks for <main>, <article>, [role="main"], #content, falling back to <body>.
   * - 'body': Converts the entire <body>.
   * - string | string[]: Custom CSS selector(s) for the container element(s).
   * @default 'auto'
   */
  contentSelector?: string | string[] | 'auto' | 'body';

  /**
   * CSS selectors for elements that should be removed prior to markdown conversion.
   * Default exclusions strip navbars, footers, scripts, styles, iframes, templates, and elements with .no-markdown / [data-no-markdown].
   * @default ['script', 'style', 'noscript', 'svg', 'iframe', 'template', 'nav', 'footer', '.no-markdown', '[data-no-markdown]']
   */
  excludeSelectors?: string[];

  /**
   * Additional selectors to exclude (appended to the default exclusions).
   */
  extraExcludeSelectors?: string[];

  /**
   * Selectors to preserve even if they match default exclusion rules.
   */
  preserveSelectors?: string[];

  /**
   * Metadata header generation mode:
   * - 'yaml': Generates YAML frontmatter block (--- \n title: ... \n description: ... \n ---)
   * - 'header': Generates Markdown header block (# Title \n > Description \n Source: ...)
   * - 'none' | false: Do not inject metadata header.
   * - 'auto' | true: Defaults to 'header'.
   * @default 'header'
   */
  metadata?: 'yaml' | 'header' | 'none' | boolean;

  /**
   * Whether to include canonical URL / source link in metadata header.
   * @default true
   */
  includeCanonical?: boolean;

  /**
   * Base URL of the site to resolve relative links and canonical URLs.
   */
  baseUrl?: string;

  /**
   * Whether to allow triggering markdown output via query parameter (e.g. ?format=markdown or ?format=md).
   * @default true
   */
  allowQueryParam?: boolean;

  /**
   * Name of the query parameter for triggering markdown.
   * @default 'format'
   */
  queryParamName?: string;

  /**
   * Allowed values for the query parameter.
   * @default ['markdown', 'md', 'text/markdown']
   */
  queryParamValues?: string[];

  /**
   * Heading style in markdown output: 'atx' (# Heading) or 'setext' (Heading \n ===)
   * @default 'atx'
   */
  headingStyle?: 'atx' | 'setext';

  /**
   * Bullet list marker: '-' | '*' | '+'
   * @default '-'
   */
  bulletMarker?: '-' | '*' | '+';

  /**
   * Code block style: 'fenced' (```) or 'indented' (4 spaces)
   * @default 'fenced'
   */
  codeBlockStyle?: 'fenced' | 'indented';

  /**
   * Whether to generate static companion `.md` files during `astro build` (for static SSG hosting).
   * @default true
   */
  generateStaticFiles?: boolean;

  /**
   * File naming scheme for static markdown files:
   * - 'twin': Outputs `path/index.md` alongside `path/index.html` (e.g. `/about/index.md`)
   * - 'direct': Outputs `path.md` (e.g. `/about.md`)
   * - 'both': Outputs both `path/index.md` and `path.md`
   * @default 'both'
   */
  staticFilePattern?: 'twin' | 'direct' | 'both';

  /**
   * Exclude routes or filepaths from static markdown generation or conversion.
   * Return true to skip conversion.
   */
  excludeRoutes?: (string | RegExp)[] | ((pathname: string) => boolean);

  /**
   * Custom transformation hook to post-process generated markdown.
   */
  transform?: (
    markdown: string,
    context: { url: URL | string; html: string; metadata: PageMetadata }
  ) => string | Promise<string>;

  /**
   * Whether to automatically inject `<link rel="alternate" type="text/markdown" href="...">` into HTML head during SSR/middleware or build.
   * @default true
   */
  injectAlternateLink?: boolean;

  /**
   * Set the Vary: Accept header on all HTML and Markdown responses so reverse proxies and CDNs cache them separately.
   * @default true
   */
  setVaryHeader?: boolean;

  /**
   * Set the x-markdown-tokens header with an estimated token count on markdown responses.
   * @default true
   */
  setTokenHeader?: boolean;
}

export interface HtmlToMarkdownOptions extends Omit<MarkdownNegotiationOptions, 'generateStaticFiles' | 'staticFilePattern'> {
  url?: string | URL;
}
