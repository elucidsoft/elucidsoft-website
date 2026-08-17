import { describe, it, expect } from 'bun:test';
import { createMarkdownMiddleware } from '../src/middleware';
import type { APIContext, MiddlewareNext } from 'astro';

function createMockContext(urlStr: string, headers: Record<string, string> = {}): APIContext {
  const url = new URL(urlStr);
  const request = new Request(urlStr, { headers });

  return {
    url,
    request,
    site: new URL('https://example.com'),
    generator: 'Astro',
    props: {},
    redirect: () => new Response(null, { status: 302 }),
    rewrite: () => Promise.resolve(new Response(null)),
    cookies: {} as any,
    params: {},
    locals: {},
    clientAddress: '127.0.0.1',
    preferredLocale: undefined,
    preferredLocaleList: undefined,
    currentLocale: undefined,
  } as unknown as APIContext;
}

describe('Astro Markdown Middleware', () => {
  const sampleHtml = `
    <!doctype html>
    <html>
      <head>
        <title>Test Page</title>
        <meta name="description" content="Test description">
      </head>
      <body>
        <main>
          <h1>Hello World</h1>
          <p>This is a test paragraph.</p>
        </main>
      </body>
    </html>
  `;

  it('converts HTML to Markdown when Accept: text/markdown is present', async () => {
    const middleware = createMarkdownMiddleware();
    const ctx = createMockContext('https://example.com/test', {
      Accept: 'text/markdown',
    });

    const next: MiddlewareNext = async () => {
      return new Response(sampleHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    };

    const res = await middleware(ctx, next);
    expect(res).toBeDefined();
    if (!res) throw new Error('Expected response');

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(res.headers.get('Vary')).toContain('Accept');

    const body = await res.text();
    expect(body).toContain('# Hello World');
    expect(body).toContain('This is a test paragraph.');
    expect(body).toContain('> Test description');
  });

  it('preserves HTML response when Accept is standard browser header', async () => {
    const middleware = createMarkdownMiddleware();
    const ctx = createMockContext('https://example.com/test', {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    });

    const next: MiddlewareNext = async () => {
      return new Response(sampleHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    };

    const res = await middleware(ctx, next);
    expect(res).toBeDefined();
    if (!res) throw new Error('Expected response');

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
    expect(res.headers.get('Vary')).toContain('Accept');

    const body = await res.text();
    expect(body).toContain('<!doctype html>');
  });

  it('does not alter non-HTML responses even if Accept: text/markdown is requested', async () => {
    const middleware = createMarkdownMiddleware();
    const ctx = createMockContext('https://example.com/api/data.json', {
      Accept: 'text/markdown',
    });

    const jsonPayload = JSON.stringify({ message: 'hello' });
    const next: MiddlewareNext = async () => {
      return new Response(jsonPayload, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const res = await middleware(ctx, next);
    expect(res).toBeDefined();
    if (!res) throw new Error('Expected response');

    expect(res.headers.get('Content-Type')).toBe('application/json');
    const body = await res.text();
    expect(body).toBe(jsonPayload);
  });

  it('skips routes matching excludeRoutes', async () => {
    const middleware = createMarkdownMiddleware({
      excludeRoutes: ['/private/'],
    });
    const ctx = createMockContext('https://example.com/private/secret', {
      Accept: 'text/markdown',
    });

    const next: MiddlewareNext = async () => {
      return new Response(sampleHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    };

    const res = await middleware(ctx, next);
    expect(res).toBeDefined();
    if (!res) throw new Error('Expected response');

    expect(res.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
    const body = await res.text();
    expect(body).toContain('<!doctype html>');
  });

  it('converts when query param ?format=markdown is provided', async () => {
    const middleware = createMarkdownMiddleware();
    const ctx = createMockContext('https://example.com/test?format=markdown');

    const next: MiddlewareNext = async () => {
      return new Response(sampleHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    };

    const res = await middleware(ctx, next);
    expect(res).toBeDefined();
    if (!res) throw new Error('Expected response');

    expect(res.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    const body = await res.text();
    expect(body).toContain('# Hello World');
  });

  it('attaches agent discovery Link headers on root path', async () => {
    const middleware = createMarkdownMiddleware();
    const ctx = createMockContext('https://example.com/');

    const next: MiddlewareNext = async () => {
      return new Response(sampleHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    };

    const res = await middleware(ctx, next);
    expect(res).toBeDefined();
    if (!res) throw new Error('Expected response');

    const linkHeader = res.headers.get('Link');
    expect(linkHeader).toContain('rel="api-catalog"');
    expect(linkHeader).toContain('rel="service-desc"');
    expect(linkHeader).toContain('rel="service-doc"');
    expect(linkHeader).toContain('rel="describedby"');
  });
});
