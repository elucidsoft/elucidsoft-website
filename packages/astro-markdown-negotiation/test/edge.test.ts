import { describe, it, expect } from 'bun:test';
import { getMarkdownAssetPath } from '../src/edge';

describe('Edge Helpers', () => {
  it('resolves markdown twin asset paths', () => {
    expect(getMarkdownAssetPath(new URL('https://example.com/'), 'twin')).toBe('/index.md');
    expect(getMarkdownAssetPath(new URL('https://example.com/about/'), 'twin')).toBe('/about/index.md');
    expect(getMarkdownAssetPath(new URL('https://example.com/blog/post-1'), 'twin')).toBe('/blog/post-1/index.md');
  });

  it('resolves markdown direct asset paths', () => {
    expect(getMarkdownAssetPath(new URL('https://example.com/'), 'direct')).toBe('/index.md');
    expect(getMarkdownAssetPath(new URL('https://example.com/about/'), 'direct')).toBe('/about.md');
    expect(getMarkdownAssetPath(new URL('https://example.com/blog/post-1'), 'direct')).toBe('/blog/post-1.md');
  });
});
