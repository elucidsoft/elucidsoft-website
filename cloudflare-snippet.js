/**
 * Cloudflare Worker for elucidsoft.com — Markdown for Agents content negotiation.
 *
 * The site is hosted on GitHub Pages; Cloudflare only proxies DNS. GitHub Pages
 * cannot execute `_worker.js` (that's a Cloudflare Pages Functions convention),
 * so this script must be deployed as an actual Worker with a Route bound to
 * `elucidsoft.com/*` (Workers & Pages → the worker → Triggers → Routes), NOT
 * pasted in as a Snippet — Snippets cap at 32KB and this still needs to run on
 * every request ahead of origin, which a Route does natively.
 *
 * Requests with `Accept: text/markdown` (or `?format=md`, `?markdown`, etc.)
 * are rewritten to the matching pre-rendered `.md` file already published by
 * @elucidsoft/astro-markdown-negotiation, mirroring public/_worker.js's logic
 * but fetching from the GitHub Pages origin instead of a Pages ASSETS binding.
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const accept = request.headers.get('accept') || '';
    const xMarkdown = request.headers.get('x-markdown') || request.headers.get('accept-markdown');
    const queryFormat = url.searchParams.get('format')?.toLowerCase();
    const hasMarkdownParam = url.searchParams.has('markdown') || url.searchParams.has('md');

    const isMarkdownRequested =
      accept.includes('text/markdown') ||
      accept.includes('text/x-markdown') ||
      queryFormat === 'markdown' ||
      queryFormat === 'md' ||
      queryFormat === 'text/markdown' ||
      hasMarkdownParam ||
      xMarkdown === 'true' ||
      xMarkdown === '1';

    const isAsset = /\.(svg|png|jpg|jpeg|ico|webp|avif|xml|json|txt|md)$/.test(url.pathname);

    if (isMarkdownRequested && !isAsset) {
      let mdPath = url.pathname;
      if (mdPath === '' || mdPath === '/') {
        mdPath = '/index.md';
      } else if (mdPath.endsWith('/')) {
        mdPath = `${mdPath.slice(0, -1)}/index.md`;
      } else {
        mdPath = `${mdPath}.md`;
      }

      let mdResponse = await fetch(new URL(mdPath, url.origin), request);

      // If /path/index.md wasn't found, try /path.md fallback.
      if (!mdResponse.ok && mdPath.endsWith('/index.md')) {
        const directMdPath = url.pathname.endsWith('/') ? `${url.pathname.slice(0, -1)}.md` : `${url.pathname}.md`;
        mdResponse = await fetch(new URL(directMdPath, url.origin), request);
      }

      if (mdResponse.ok) {
        const body = await mdResponse.text();
        const tokens = Math.ceil(body.length / 4);
        const headers = new Headers(mdResponse.headers);
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
        headers.set('Vary', 'Accept');
        headers.set('x-markdown-tokens', String(tokens));
        headers.set('X-Content-Type-Options', 'nosniff');

        return new Response(body, {
          status: mdResponse.status,
          statusText: mdResponse.statusText,
          headers,
        });
      }
    }

    // Default HTML / static asset passthrough to the GitHub Pages origin.
    const response = await fetch(request);
    const headers = new Headers(response.headers);
    headers.set('Vary', 'Accept');

    if (url.pathname === '/' || url.pathname === '') {
      headers.set(
        'Link',
        '</.well-known/api-catalog>; rel="api-catalog", </llms.txt>; rel="describedby"; type="text/plain", </auth.md>; rel="service-doc"; type="text/markdown", </.well-known/oauth-protected-resource>; rel="service-desc"; type="application/json"'
      );
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
