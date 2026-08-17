import { describe, it, expect } from 'bun:test';
import { htmlToMarkdown, decodeHtmlEntities } from '../src/converter';

describe('HTML to Markdown Converter', () => {
  describe('decodeHtmlEntities', () => {
    it('decodes named, decimal, and hex HTML entities', () => {
      expect(decodeHtmlEntities('&amp; &lt; &gt; &quot; &#39; &copy; &mdash;')).toBe('& < > " \' © —');
      expect(decodeHtmlEntities('&#160;&#8212;')).toBe(' —');
      expect(decodeHtmlEntities('&#x2014;')).toBe('—');
    });
  });

  describe('Headings', () => {
    it('converts h1 through h6 to ATX style', async () => {
      const html = `
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      `;
      const md = await htmlToMarkdown(html, { metadata: 'none' });
      expect(md).toContain('# Heading 1');
      expect(md).toContain('## Heading 2');
      expect(md).toContain('### Heading 3');
      expect(md).toContain('#### Heading 4');
      expect(md).toContain('##### Heading 5');
      expect(md).toContain('###### Heading 6');
    });

    it('supports setext style for h1 and h2', async () => {
      const html = `<h1>Title</h1><h2>Subtitle</h2>`;
      const md = await htmlToMarkdown(html, { metadata: 'none', headingStyle: 'setext' });
      expect(md).toContain('Title\n=====');
      expect(md).toContain('Subtitle\n--------');
    });
  });

  describe('Inline Formatting', () => {
    it('converts strong, em, strike, and code', async () => {
      const html = `<p>This is <strong>bold</strong>, <em>italic</em>, <del>deleted</del>, and <code>code()</code>.</p>`;
      const md = await htmlToMarkdown(html, { metadata: 'none' });
      expect(md).toContain('This is **bold**, *italic*, ~~deleted~~, and `code()`.');
    });

    it('handles nested backticks in inline code', async () => {
      const html = `<p><code>\`foo\`</code></p>`;
      const md = await htmlToMarkdown(html, { metadata: 'none' });
      expect(md).toContain('`` `foo` ``');
    });
  });

  describe('Links and Images', () => {
    it('converts links with titles and base URL resolution', async () => {
      const html = `<p><a href="/docs/guide" title="User Guide">Documentation</a></p>`;
      const md = await htmlToMarkdown(html, {
        metadata: 'none',
        baseUrl: 'https://example.com',
      });
      expect(md).toContain('[Documentation](https://example.com/docs/guide "User Guide")');
    });

    it('converts images with alt and title', async () => {
      const html = `<img src="/logo.png" alt="Company Logo" title="Logo">`;
      const md = await htmlToMarkdown(html, {
        metadata: 'none',
        baseUrl: 'https://example.com',
      });
      expect(md).toContain('![Company Logo](https://example.com/logo.png "Logo")');
    });

    it('converts linked images', async () => {
      const html = `<a href="https://example.com"><img src="https://example.com/img.png" alt="Example"></a>`;
      const md = await htmlToMarkdown(html, { metadata: 'none' });
      expect(md).toContain('[![Example](https://example.com/img.png)](https://example.com)');
    });
  });

  describe('Code Blocks', () => {
    it('extracts language and preserves whitespace from pre/code', async () => {
      const html = `
        <pre class="language-typescript"><code>function add(a: number, b: number): number {
  return a + b;
}</code></pre>
      `;
      const md = await htmlToMarkdown(html, { metadata: 'none' });
      expect(md).toContain('```typescript\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n```');
    });

    it('strips syntax-highlighter spans (Shiki / Prism)', async () => {
      const html = `
        <pre class="astro-code github-dark" data-language="js"><code><span class="line"><span style="color:#F97583">const</span><span style="color:#B392F0"> x</span><span style="color:#F97583"> =</span><span style="color:#79B8FF"> 42</span><span style="color:#E1E4E8">;</span></span></code></pre>
      `;
      const md = await htmlToMarkdown(html, { metadata: 'none' });
      expect(md).toContain('```js\nconst x = 42;\n```');
    });
  });

  describe('Lists', () => {
    it('converts unordered and ordered lists with nesting', async () => {
      const html = `
        <ul>
          <li>Item 1</li>
          <li>Item 2
            <ul>
              <li>Subitem 2.1</li>
              <li>Subitem 2.2</li>
            </ul>
          </li>
        </ul>
        <ol start="5">
          <li>Fifth item</li>
          <li>Sixth item</li>
        </ol>
      `;
      const md = await htmlToMarkdown(html, { metadata: 'none' });
      expect(md).toContain('- Item 1');
      expect(md).toContain('- Item 2');
      expect(md).toContain('  - Subitem 2.1');
      expect(md).toContain('  - Subitem 2.2');
      expect(md).toContain('5. Fifth item');
      expect(md).toContain('6. Sixth item');
    });

    it('converts task lists with checkboxes', async () => {
      const html = `
        <ul>
          <li><input type="checkbox" checked> Task completed</li>
          <li><input type="checkbox"> Task pending</li>
        </ul>
      `;
      const md = await htmlToMarkdown(html, { metadata: 'none' });
      expect(md).toContain('- [x] Task completed');
      expect(md).toContain('- [ ] Task pending');
    });
  });

  describe('Tables', () => {
    it('converts HTML tables to GFM format with alignment', async () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="center">Status</th>
              <th align="right">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>WarpKit</td>
              <td>Active</td>
              <td>1,200</td>
            </tr>
            <tr>
              <td>OriJS</td>
              <td>Alpha</td>
              <td>350</td>
            </tr>
          </tbody>
        </table>
      `;
      const md = await htmlToMarkdown(html, { metadata: 'none' });
      expect(md).toContain('| Name | Status | Count |');
      expect(md).toContain('| --- | :---: | ---: |');
      expect(md).toContain('| WarpKit | Active | 1,200 |');
      expect(md).toContain('| OriJS | Alpha | 350 |');
    });
  });

  describe('Blockquotes & Details', () => {
    it('converts blockquotes and details', async () => {
      const html = `
        <blockquote>
          <p>This is a quote.</p>
          <p>Second line.</p>
        </blockquote>
        <details>
          <summary>Click to expand</summary>
          <p>Hidden information here.</p>
        </details>
      `;
      const md = await htmlToMarkdown(html, { metadata: 'none' });
      expect(md).toContain('> This is a quote.');
      expect(md).toContain('> Second line.');
      expect(md).toContain('**Click to expand**');
      expect(md).toContain('Hidden information here.');
    });
  });

  describe('Exclusions and Content Scoping', () => {
    it('strips nav, footer, script, style, and .no-markdown by default', async () => {
      const html = `
        <html>
          <head><style>body { color: red; }</style></head>
          <body>
            <nav><a href="/">Home</a></nav>
            <main>
              <h1>Main Article</h1>
              <p>Content to keep.</p>
              <div class="no-markdown">Banner ad to strip</div>
            </main>
            <footer><p>Footer content</p></footer>
            <script>console.log('strip');</script>
          </body>
        </html>
      `;
      const md = await htmlToMarkdown(html, { metadata: 'none' });
      expect(md).toContain('# Main Article');
      expect(md).toContain('Content to keep.');
      expect(md).not.toContain('Home');
      expect(md).not.toContain('Banner ad');
      expect(md).not.toContain('Footer content');
      expect(md).not.toContain('console.log');
      expect(md).not.toContain('color: red');
    });

    it('scopes conversion to custom contentSelector', async () => {
      const html = `
        <div id="sidebar">Sidebar stuff</div>
        <article id="post">
          <h2>Article Title</h2>
          <p>Article body.</p>
        </article>
      `;
      const md = await htmlToMarkdown(html, {
        metadata: 'none',
        contentSelector: '#post',
      });
      expect(md).toContain('## Article Title');
      expect(md).toContain('Article body.');
      expect(md).not.toContain('Sidebar stuff');
    });
  });

  describe('Metadata Extraction', () => {
    const htmlWithMeta = `
      <!doctype html>
      <html>
        <head>
          <title>About Us | Elucidsoft</title>
          <meta name="description" content="Company background and mission statement.">
          <meta name="author" content="Eric Malamisura">
          <link rel="canonical" href="https://elucidsoft.com/about/">
        </head>
        <body>
          <main>
            <p>Welcome to the about page.</p>
          </main>
        </body>
      </html>
    `;

    it('formats metadata as human-readable document header by default', async () => {
      const md = await htmlToMarkdown(htmlWithMeta);
      expect(md).toContain('# About Us | Elucidsoft');
      expect(md).toContain('> Company background and mission statement.');
      expect(md).toContain('Author: Eric Malamisura');
      expect(md).toContain('Source: https://elucidsoft.com/about/');
      expect(md).toContain('---');
      expect(md).toContain('Welcome to the about page.');
    });

    it('formats metadata as YAML frontmatter when metadata="yaml"', async () => {
      const md = await htmlToMarkdown(htmlWithMeta, { metadata: 'yaml' });
      expect(md).toContain('---');
      expect(md).toContain('title: "About Us | Elucidsoft"');
      expect(md).toContain('description: "Company background and mission statement."');
      expect(md).toContain('canonical: "https://elucidsoft.com/about/"');
      expect(md).toContain('author: "Eric Malamisura"');
      expect(md).toContain('Welcome to the about page.');
    });
  });

  describe('Custom Transform Hook', () => {
    it('applies custom transformation hook', async () => {
      const html = `<h1>Hello</h1>`;
      const md = await htmlToMarkdown(html, {
        metadata: 'none',
        transform: (markdown) => `${markdown}\n\n*Transformed by hook*`,
      });
      expect(md).toContain('# Hello');
      expect(md).toContain('*Transformed by hook*');
    });
  });
});
