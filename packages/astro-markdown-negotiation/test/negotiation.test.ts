import { describe, it, expect } from 'bun:test';
import {
  parseAcceptHeader,
  isMarkdownMimeType,
  isHtmlMimeType,
  shouldServeMarkdown,
  getMarkdownResponseHeaders,
} from '../src/negotiation';

describe('Content Negotiation', () => {
  describe('parseAcceptHeader', () => {
    it('parses empty or missing header', () => {
      expect(parseAcceptHeader('')).toEqual([]);
      // @ts-ignore
      expect(parseAcceptHeader(null)).toEqual([]);
    });

    it('parses single media type with default q=1.0', () => {
      const result = parseAcceptHeader('text/markdown');
      expect(result).toHaveLength(1);
      expect(result[0]?.mimeType).toBe('text/markdown');
      expect(result[0]?.type).toBe('text');
      expect(result[0]?.subtype).toBe('markdown');
      expect(result[0]?.q).toBe(1.0);
    });

    it('parses multiple types and sorts by q-factor descending', () => {
      const header = 'text/html;q=0.8, text/markdown;q=1.0, application/json;q=0.5';
      const result = parseAcceptHeader(header);

      expect(result).toHaveLength(3);
      expect(result[0]?.mimeType).toBe('text/markdown');
      expect(result[0]?.q).toBe(1.0);
      expect(result[1]?.mimeType).toBe('text/html');
      expect(result[1]?.q).toBe(0.8);
      expect(result[2]?.mimeType).toBe('application/json');
      expect(result[2]?.q).toBe(0.5);
    });

    it('parses parameters alongside q-values', () => {
      const header = 'text/plain; format=markdown; q=0.9';
      const result = parseAcceptHeader(header);
      expect(result[0]?.mimeType).toBe('text/plain');
      expect(result[0]?.q).toBe(0.9);
      expect(result[0]?.params['format']).toBe('markdown');
    });
  });

  describe('isMarkdownMimeType', () => {
    it('recognizes standard and vendor markdown types', () => {
      expect(isMarkdownMimeType('text/markdown')).toBe(true);
      expect(isMarkdownMimeType('text/x-markdown')).toBe(true);
      expect(isMarkdownMimeType('application/markdown')).toBe(true);
      expect(isMarkdownMimeType('text/plain', { format: 'markdown' })).toBe(true);
    });

    it('rejects non-markdown types', () => {
      expect(isMarkdownMimeType('text/html')).toBe(false);
      expect(isMarkdownMimeType('application/json')).toBe(false);
      expect(isMarkdownMimeType('text/plain')).toBe(false);
    });
  });

  describe('isHtmlMimeType', () => {
    it('recognizes html and xhtml mime types', () => {
      expect(isHtmlMimeType('text/html')).toBe(true);
      expect(isHtmlMimeType('application/xhtml+xml')).toBe(true);
    });

    it('rejects non-html types', () => {
      expect(isHtmlMimeType('text/markdown')).toBe(false);
      expect(isHtmlMimeType('application/json')).toBe(false);
    });
  });

  describe('shouldServeMarkdown', () => {
    it('returns true when client requests Accept: text/markdown', () => {
      const req = new Request('https://example.com/about', {
        headers: { Accept: 'text/markdown' },
      });
      expect(shouldServeMarkdown(req)).toBe(true);
    });

    it('returns true when client prefers text/markdown over text/html', () => {
      const req = new Request('https://example.com/about', {
        headers: { Accept: 'text/markdown;q=1.0, text/html;q=0.8' },
      });
      expect(shouldServeMarkdown(req)).toBe(true);
    });

    it('returns true when client accepts both equally', () => {
      const req = new Request('https://example.com/about', {
        headers: { Accept: 'text/html, text/markdown' },
      });
      expect(shouldServeMarkdown(req)).toBe(true);
    });

    it('returns false when client prefers text/html over text/markdown', () => {
      const req = new Request('https://example.com/about', {
        headers: { Accept: 'text/html;q=1.0, text/markdown;q=0.5' },
      });
      expect(shouldServeMarkdown(req)).toBe(false);
    });

    it('returns false for standard browser Accept header', () => {
      const req = new Request('https://example.com/about', {
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        },
      });
      expect(shouldServeMarkdown(req)).toBe(false);
    });

    it('returns true when query param ?format=markdown is present', () => {
      const req = new Request('https://example.com/about?format=markdown');
      expect(shouldServeMarkdown(req)).toBe(true);
    });

    it('returns true when query param ?format=md is present', () => {
      const req = new Request('https://example.com/about?format=md');
      expect(shouldServeMarkdown(req)).toBe(true);
    });

    it('returns true when ?markdown or ?md flag is present', () => {
      const req1 = new Request('https://example.com/about?markdown');
      expect(shouldServeMarkdown(req1)).toBe(true);
      const req2 = new Request('https://example.com/about?md=1');
      expect(shouldServeMarkdown(req2)).toBe(true);
    });

    it('returns true when X-Markdown header is present', () => {
      const req = new Request('https://example.com/about', {
        headers: { 'X-Markdown': 'true' },
      });
      expect(shouldServeMarkdown(req)).toBe(true);
    });
  });

  describe('getMarkdownResponseHeaders', () => {
    it('sets Content-Type and Vary headers', () => {
      const headers = getMarkdownResponseHeaders();
      expect(headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
      expect(headers.get('Vary')).toContain('Accept');
      expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    });

    it('preserves and appends existing Vary header', () => {
      const existing = new Headers({ Vary: 'User-Agent', 'Cache-Control': 'max-age=3600' });
      const headers = getMarkdownResponseHeaders({}, existing);
      expect(headers.get('Vary')).toBe('User-Agent, Accept');
      expect(headers.get('Cache-Control')).toBe('max-age=3600');
    });
  });
});
