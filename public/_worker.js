/**
 * Built-in Edge Content Negotiation Worker for Cloudflare Pages / Workers.
 *
 * Implements Accept: text/markdown content negotiation, routing requests
 * to pre-rendered companion .md files without requiring proprietary vendor features.
 */
export default {
  async fetch(request, env) {
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

    if (isMarkdownRequested && !url.pathname.endsWith('.svg') && !url.pathname.endsWith('.png') && !url.pathname.endsWith('.jpg') && !url.pathname.endsWith('.ico')) {
      let mdPath = url.pathname;
      if (mdPath === '' || mdPath === '/') {
        mdPath = '/index.md';
      } else if (mdPath.endsWith('/')) {
        mdPath = `${mdPath.slice(0, -1)}/index.md`;
      } else if (!mdPath.endsWith('.md')) {
        mdPath = `${mdPath}.md`;
      }

      const mdUrl = new URL(mdPath, url.origin);
      let mdResponse = await env.ASSETS.fetch(new Request(mdUrl.toString(), request));

      // If /path/index.md wasn't found, try /path.md fallback
      if (!mdResponse.ok && mdPath.endsWith('/index.md')) {
        const directMdPath = url.pathname.endsWith('/') ? `${url.pathname.slice(0, -1)}.md` : `${url.pathname}.md`;
        const directMdUrl = new URL(directMdPath, url.origin);
        mdResponse = await env.ASSETS.fetch(new Request(directMdUrl.toString(), request));
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

    // Default HTML / static asset handling
    const response = await env.ASSETS.fetch(request);
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
