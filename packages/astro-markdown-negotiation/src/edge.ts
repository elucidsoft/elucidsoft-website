import { shouldServeMarkdown, getMarkdownResponseHeaders } from './negotiation';
import type { MarkdownNegotiationOptions } from './types';

/**
 * Helper to determine the corresponding Markdown asset path for a given request URL.
 */
export function getMarkdownAssetPath(url: URL, pattern: 'twin' | 'direct' = 'twin'): string {
  let pathname = url.pathname;
  if (pathname === '' || pathname === '/') {
    return '/index.md';
  }

  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  if (pattern === 'twin') {
    return `${pathname}/index.md`;
  }

  return `${pathname}.md`;
}

const DISCOVERY_LINK_HEADERS = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</auth.md>; rel="service-doc"; type="text/markdown"',
  '</.well-known/oauth-protected-resource>; rel="service-desc"; type="application/json"',
].join(', ');

/**
 * Creates an edge fetch interceptor for Cloudflare Pages / Workers.
 * If Accept: text/markdown is requested, rewrites or fetches the .md asset.
 */
export function createCloudflarePagesHandler(options: MarkdownNegotiationOptions = {}) {
  return async (context: {
    request: Request;
    next: () => Promise<Response>;
    env: Record<string, unknown>;
  }): Promise<Response> => {
    const { request, next } = context;
    const url = new URL(request.url);

    if (shouldServeMarkdown(request, options)) {
      const mdPath = getMarkdownAssetPath(url);
      const mdUrl = new URL(mdPath, url.origin);

      // Attempt to fetch the static markdown file
      const mdResponse = await fetch(new Request(mdUrl.toString(), {
        headers: request.headers,
      }));

      if (mdResponse.ok) {
        const headers = getMarkdownResponseHeaders(options, mdResponse.headers);
        return new Response(mdResponse.body, {
          status: mdResponse.status,
          statusText: mdResponse.statusText,
          headers,
        });
      }
    }

    const response = await next();

    // Add Vary header
    if (options.setVaryHeader !== false) {
      response.headers.append('Vary', 'Accept');
    }

    // Add discovery Link headers on root
    if (url.pathname === '/' || url.pathname === '') {
      response.headers.append('Link', DISCOVERY_LINK_HEADERS);
    }

    return response;
  };
}

/**
 * Creates an edge handler for Netlify Edge Functions.
 */
export function createNetlifyEdgeHandler(options: MarkdownNegotiationOptions = {}) {
  return async (request: Request, context: { next: () => Promise<Response> }): Promise<Response> => {
    const url = new URL(request.url);

    if (shouldServeMarkdown(request, options)) {
      const mdPath = getMarkdownAssetPath(url);
      const mdUrl = new URL(mdPath, url.origin);

      const mdResponse = await fetch(new Request(mdUrl.toString(), {
        headers: request.headers,
      }));

      if (mdResponse.ok) {
        const headers = getMarkdownResponseHeaders(options, mdResponse.headers);
        return new Response(mdResponse.body, {
          status: mdResponse.status,
          statusText: mdResponse.statusText,
          headers,
        });
      }
    }

    const response = await context.next();
    if (options.setVaryHeader !== false) {
      response.headers.append('Vary', 'Accept');
    }
    if (url.pathname === '/' || url.pathname === '') {
      response.headers.append('Link', DISCOVERY_LINK_HEADERS);
    }
    return response;
  };
}
