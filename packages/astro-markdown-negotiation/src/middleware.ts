import type { APIContext, MiddlewareHandler, MiddlewareNext } from 'astro';
import { shouldServeMarkdown, getMarkdownResponseHeaders } from './negotiation';
import { htmlToMarkdown } from './converter';
import type { MarkdownNegotiationOptions } from './types';

export function defineMiddleware(fn: MiddlewareHandler): MiddlewareHandler {
  return fn;
}

// Attempt to load virtual config if running inside Astro with the integration
let virtualOptions: MarkdownNegotiationOptions = {};
try {
  // @ts-ignore - Virtual module provided by the Astro integration Vite plugin
  const mod = await import('virtual:astro-markdown-negotiation/config');
  if (mod && mod.options) {
    virtualOptions = mod.options;
  }
} catch {
  // Standalone usage or test environment
}

/**
 * Creates an Astro middleware handler for content negotiation of HTML to Markdown and agent discovery.
 */
export function createMarkdownMiddleware(options: MarkdownNegotiationOptions = {}): MiddlewareHandler {
  const mergedOptions: MarkdownNegotiationOptions = {
    ...virtualOptions,
    ...options,
  };

  return defineMiddleware(async (context: APIContext, next: MiddlewareNext) => {
    // If the route is being prerendered at build time in SSG mode,
    // skip request header inspection to avoid Astro prerender header warnings.
    // Static companion .md files are generated during the astro:build:done hook.
    if ((context as { isPrerendered?: boolean }).isPrerendered) {
      return next();
    }

    const request = context.request;
    const url = context.url;
    const pathname = url ? url.pathname : '';

    // Check if current route is excluded
    if (mergedOptions.excludeRoutes && pathname) {
      if (typeof mergedOptions.excludeRoutes === 'function' && mergedOptions.excludeRoutes(pathname)) {
        return next();
      }
      if (Array.isArray(mergedOptions.excludeRoutes)) {
        for (const pattern of mergedOptions.excludeRoutes) {
          if (typeof pattern === 'string' && (pathname === pattern || pathname.startsWith(pattern))) {
            return next();
          }
          if (pattern instanceof RegExp && pattern.test(pathname)) {
            return next();
          }
        }
      }
    }

    const isMarkdownRequested = shouldServeMarkdown(request, mergedOptions);

    // Call downstream route handler / page renderer
    const response = await next();

    // Inject Vary: Accept header for proper HTTP caching
    if (mergedOptions.setVaryHeader !== false) {
      const currentVary = response.headers.get('Vary');
      if (!currentVary) {
        response.headers.set('Vary', 'Accept');
      } else if (!currentVary.toLowerCase().includes('accept')) {
        response.headers.set('Vary', `${currentVary}, Accept`);
      }
    }

    // Attach agent discovery Link headers on the homepage per RFC 8288 & RFC 9727
    if (pathname === '/' || pathname === '' || pathname === '/index.html') {
      const discoveryLinks = [
        '</.well-known/api-catalog>; rel="api-catalog"',
        '</llms.txt>; rel="describedby"; type="text/plain"',
        '</auth.md>; rel="service-doc"; type="text/markdown"',
        '</.well-known/oauth-protected-resource>; rel="service-desc"; type="application/json"',
      ].join(', ');

      const currentLink = response.headers.get('Link');
      if (!currentLink) {
        response.headers.set('Link', discoveryLinks);
      } else if (!currentLink.includes('rel="api-catalog"')) {
        response.headers.set('Link', `${currentLink}, ${discoveryLinks}`);
      }
    }

    // Check if the response is successful HTML
    const contentType = response.headers.get('content-type') || '';
    const isHtml = contentType.toLowerCase().includes('text/html');
    const isSuccess = response.status >= 200 && response.status < 300;

    if (isMarkdownRequested && isHtml && isSuccess) {
      try {
        const html = await response.text();
        const baseUrl = mergedOptions.baseUrl || (url ? url.origin : undefined);

        const markdown = await htmlToMarkdown(html, {
          ...mergedOptions,
          baseUrl,
          url: url ? url.href : undefined,
        });

        const headers = getMarkdownResponseHeaders(mergedOptions, response.headers, markdown);

        return new Response(markdown, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } catch (err) {
        // In case of conversion error, fallback gracefully to the original response
        console.error('[astro-markdown-negotiation] Error converting HTML to Markdown:', err);
        return response;
      }
    }

    return response;
  });
}

/**
 * Default middleware export for direct entrypoint loading.
 */
export const onRequest: MiddlewareHandler = createMarkdownMiddleware();
