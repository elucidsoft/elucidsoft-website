import type { MarkdownNegotiationOptions } from './types';

export interface MediaType {
  mimeType: string;
  type: string;
  subtype: string;
  q: number;
  params: Record<string, string>;
}

const MARKDOWN_MIME_TYPES = new Set([
  'text/markdown',
  'text/x-markdown',
  'application/markdown',
  'text/markdown; charset=utf-8',
]);

const HTML_MIME_TYPES = new Set([
  'text/html',
  'application/xhtml+xml',
]);

/**
 * Parses an HTTP Accept header string into an array of MediaType objects sorted by quality factor (q).
 */
export function parseAcceptHeader(acceptHeader: string): MediaType[] {
  if (!acceptHeader || typeof acceptHeader !== 'string') {
    return [];
  }

  const items = acceptHeader.split(',');
  const results: MediaType[] = [];

  for (const rawItem of items) {
    const trimmed = rawItem.trim();
    if (!trimmed) continue;

    const parts = trimmed.split(';');
    const mimeType = (parts[0] ?? '').trim().toLowerCase();
    if (!mimeType) continue;

    const [type = '', subtype = ''] = mimeType.split('/');
    let q = 1.0;
    const params: Record<string, string> = {};

    for (let i = 1; i < parts.length; i++) {
      const param = parts[i]?.trim() ?? '';
      const eqIdx = param.indexOf('=');
      if (eqIdx !== -1) {
        const key = param.substring(0, eqIdx).trim().toLowerCase();
        const value = param.substring(eqIdx + 1).trim();
        params[key] = value;
        if (key === 'q') {
          const parsedQ = parseFloat(value);
          if (!isNaN(parsedQ) && parsedQ >= 0 && parsedQ <= 1) {
            q = parsedQ;
          }
        }
      }
    }

    results.push({
      mimeType,
      type,
      subtype,
      q,
      params,
    });
  }

  // Sort descending by q factor
  return results.sort((a, b) => b.q - a.q);
}

/**
 * Checks if a given MIME type or media type is Markdown.
 */
export function isMarkdownMimeType(mimeType: string, params: Record<string, string> = {}): boolean {
  const normalized = mimeType.toLowerCase().trim();
  if (MARKDOWN_MIME_TYPES.has(normalized)) {
    return true;
  }
  if (normalized === 'text/plain' && (params['format'] === 'markdown' || params['markup'] === 'markdown')) {
    return true;
  }
  return false;
}

/**
 * Checks if a given MIME type is HTML / XHTML.
 */
export function isHtmlMimeType(mimeType: string): boolean {
  return HTML_MIME_TYPES.has(mimeType.toLowerCase().trim());
}

/**
 * Determines whether a given request should be served Markdown content based on:
 * 1. Query parameters (?format=markdown, ?format=md, ?markdown, ?md)
 * 2. Explicit request headers (X-Markdown, Accept-Markdown)
 * 3. Content negotiation via the Accept header (RFC 9110 / RFC 7231)
 */
export function shouldServeMarkdown(request: Request, options: MarkdownNegotiationOptions = {}): boolean {
  const {
    allowQueryParam = true,
    queryParamName = 'format',
    queryParamValues = ['markdown', 'md', 'text/markdown'],
  } = options;

  // 1. Check Query Parameters (e.g. ?format=markdown or ?format=md)
  if (allowQueryParam) {
    try {
      const url = new URL(request.url);
      const queryVal = url.searchParams.get(queryParamName)?.toLowerCase().trim();
      if (queryVal && queryParamValues.map((v) => v.toLowerCase()).includes(queryVal)) {
        return true;
      }
      if (url.searchParams.has('markdown') || url.searchParams.has('md')) {
        const flag = url.searchParams.get('markdown') ?? url.searchParams.get('md');
        if (flag === '' || flag === 'true' || flag === '1') {
          return true;
        }
      }
    } catch {
      // Ignore URL parsing errors on relative or malformed URLs
    }
  }

  // 2. Check Custom / Direct Headers
  const xMarkdown = request.headers.get('x-markdown') || request.headers.get('accept-markdown');
  if (xMarkdown && (xMarkdown.toLowerCase() === 'true' || xMarkdown === '1')) {
    return true;
  }

  // 3. Content Negotiation via Accept Header
  const accept = request.headers.get('accept');
  if (!accept) {
    return false;
  }

  const mediaTypes = parseAcceptHeader(accept);
  if (mediaTypes.length === 0) {
    return false;
  }

  let markdownQ = 0;
  let htmlQ = 0;

  for (const item of mediaTypes) {
    if (isMarkdownMimeType(item.mimeType, item.params)) {
      if (item.q > markdownQ) {
        markdownQ = item.q;
      }
    } else if (isHtmlMimeType(item.mimeType)) {
      if (item.q > htmlQ) {
        htmlQ = item.q;
      }
    }
  }

  // Client explicitly requested markdown
  if (markdownQ > 0) {
    // If no HTML requested or markdown q is >= HTML q, serve Markdown
    if (htmlQ === 0 || markdownQ >= htmlQ) {
      return true;
    }
  }

  return false;
}

/**
 * Builds standard response headers for serving Markdown with caching and content negotiation.
 */
export function getMarkdownResponseHeaders(
  options: MarkdownNegotiationOptions = {},
  existingHeaders?: Headers
): Headers {
  const headers = new Headers(existingHeaders);

  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  headers.set('X-Content-Type-Options', 'nosniff');

  if (options.setVaryHeader !== false) {
    const currentVary = headers.get('Vary');
    if (!currentVary) {
      headers.set('Vary', 'Accept');
    } else if (!currentVary.toLowerCase().includes('accept')) {
      headers.set('Vary', `${currentVary}, Accept`);
    }
  }

  return headers;
}
