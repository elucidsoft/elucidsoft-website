# @elucidsoft/astro-markdown-negotiation

A reusable Astro integration and middleware layer that automatically converts HTML pages to clean, structured Markdown for clients requesting `Accept: text/markdown`.

Designed for AI crawlers, LLM agents (e.g. Claude, ChatGPT), CLI tools, and automated pipelines without needing to maintain duplicate content files manually.

---

## Features

- **HTTP Content Negotiation (RFC 9110 / RFC 7231):** Accurately inspects `Accept` quality values (`q=`), query parameters (`?format=markdown`), and headers (`X-Markdown: true`).
- **Zero-Config Astro Integration:** Drop into `astro.config.mjs` to enable automatic conversion across SSR, hybrid, dev server, and static builds.
- **High-Fidelity HTML-to-Markdown:** Converts semantic HTML, headings, lists, tables, blockquotes, code blocks (preserving syntax highlighting language identifiers while stripping styling spans), and images.
- **Smart DOM Scoping & Cleanup:** Automatically scopes conversion to `<main>`, `<article>`, or custom content selectors while stripping boilerplate (`<nav>`, `<footer>`, `<script>`, `<style>`, `<svg>`, `.no-markdown`).
- **Metadata & Frontmatter Extraction:** Extracts `<title>`, `<meta name="description">`, `<link rel="canonical">`, and OpenGraph tags into readable document headers or YAML frontmatter.
- **Static Companion Generator:** In SSG mode (`astro build`), automatically writes static `.md` companion files (e.g. `dist/about/index.md` or `dist/about.md`) and injects `<link rel="alternate" type="text/markdown">`.
- **Edge-Ready:** Includes ready-to-use middleware handlers for Cloudflare Pages / Workers, Netlify Edge Functions, and Vercel Edge Middleware.
- **Proper HTTP Caching:** Adds `Vary: Accept` headers to ensure downstream caches and CDNs do not mix HTML and Markdown responses.

---

## Installation

```bash
# In your Astro project
bun add @elucidsoft/astro-markdown-negotiation
# or
npm install @elucidsoft/astro-markdown-negotiation
# or
pnpm add @elucidsoft/astro-markdown-negotiation
```

---

## Quickstart

### 1. As an Astro Integration (Recommended)

Add `markdownNegotiation` to your `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import markdownNegotiation from '@elucidsoft/astro-markdown-negotiation';

export default defineConfig({
  integrations: [
    markdownNegotiation({
      // Optional configuration
      metadata: 'header', // 'header' | 'yaml' | 'none'
      contentSelector: 'auto', // 'auto' | 'body' | '#content' | 'main'
      generateStaticFiles: true, // generates companion .md files on build
    }),
  ],
});
```

### 2. As Standalone Astro Middleware

If you manage your own middleware pipeline with `sequence()`:

```typescript
// src/middleware.ts
import { sequence } from 'astro:middleware';
import { createMarkdownMiddleware } from '@elucidsoft/astro-markdown-negotiation/middleware';

const markdownMiddleware = createMarkdownMiddleware({
  metadata: 'header',
  allowQueryParam: true,
});

export const onRequest = sequence(markdownMiddleware);
```

### 3. As a Standalone Converter / Helper

```typescript
import { htmlToMarkdown, shouldServeMarkdown } from '@elucidsoft/astro-markdown-negotiation';

// Convert raw HTML string
const markdown = await htmlToMarkdown(htmlString, {
  baseUrl: 'https://example.com',
  metadata: 'yaml',
});

// Check incoming Request
if (shouldServeMarkdown(request)) {
  // Handle markdown request
}
```

---

## How It Works

### 1. Dynamic Requests & SSR / Dev Server

When a client sends a request:

```bash
curl -H "Accept: text/markdown" https://yoursite.com/about/
# or
curl https://yoursite.com/about/?format=markdown
```

1. The middleware intercepts the request.
2. If `Accept: text/markdown` has higher or equal priority to `text/html`, or `?format=markdown` is present:
3. The rendered HTML response is converted on-the-fly to clean Markdown.
4. The response is returned with `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`.

### 2. Static Site Generation (`output: 'static'`)

During `astro build`:
1. Astro renders standard HTML files to `dist/`.
2. The integration's `astro:build:done` hook scans all generated HTML files.
3. It generates `.md` counterparts (e.g. `dist/about/index.md` and `dist/about.md`).
4. It injects `<link rel="alternate" type="text/markdown" href="/about.md">` into the HTML `<head>`.

### 3. Edge CDNs (Cloudflare Pages / Netlify)

For static hosts with Edge Workers, use the built-in edge handler to rewrite requests directly at the CDN edge:

```typescript
// functions/_middleware.ts (Cloudflare Pages)
import { createCloudflarePagesHandler } from '@elucidsoft/astro-markdown-negotiation/edge';

export const onRequest = createCloudflarePagesHandler();
```

---

## Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `contentSelector` | `string \| string[] \| 'auto' \| 'body'` | `'auto'` | Scopes conversion to `<main>`, `<article>`, etc., falling back to `<body>`. |
| `excludeSelectors` | `string[]` | `['nav', 'footer', 'script', 'style', 'noscript', 'svg', 'iframe', 'template', '.no-markdown', '[data-no-markdown]']` | Elements to strip before converting to Markdown. |
| `extraExcludeSelectors` | `string[]` | `[]` | Additional CSS selectors to strip. |
| `metadata` | `'header' \| 'yaml' \| 'none' \| boolean` | `'header'` | How page metadata (`<title>`, `<meta name="description">`, canonical) is output. |
| `includeCanonical` | `boolean` | `true` | Includes `Source: <canonical>` in the metadata header. |
| `allowQueryParam` | `boolean` | `true` | Allows triggering Markdown via `?format=markdown` or `?format=md`. |
| `queryParamName` | `string` | `'format'` | Name of the query parameter. |
| `headingStyle` | `'atx' \| 'setext'` | `'atx'` | Heading format (`# Heading` vs `Heading\n===`). |
| `bulletMarker` | `'-' \| '*' \| '+'` | `'-'` | List bullet character. |
| `codeBlockStyle` | `'fenced' \| 'indented'` | `'fenced'` | Code block format. |
| `generateStaticFiles` | `boolean` | `true` | Generates companion `.md` files in `dist/` on build. |
| `staticFilePattern` | `'twin' \| 'direct' \| 'both'` | `'both'` | File pattern for static `.md` files (`path/index.md`, `path.md`, or both). |
| `injectAlternateLink` | `boolean` | `true` | Injects `<link rel="alternate" type="text/markdown">` in HTML head. |
| `setVaryHeader` | `boolean` | `true` | Sets `Vary: Accept` header on all responses. |
| `excludeRoutes` | `(string \| RegExp)[] \| ((path: string) => boolean)` | `undefined` | Routes to bypass from Markdown conversion. |
| `transform` | `(md: string, ctx: Context) => string \| Promise<string>` | `undefined` | Custom hook to post-process generated Markdown. |

---

## Testing Content Negotiation

### cURL
```bash
# Markdown via Accept header
curl -i -H "Accept: text/markdown" http://localhost:4325/about/

# Markdown via query parameter
curl -i http://localhost:4325/about/?format=markdown

# Standard HTML
curl -i http://localhost:4325/about/
```

---

## License

MIT © [Elucidsoft LLC](https://elucidsoft.com)
