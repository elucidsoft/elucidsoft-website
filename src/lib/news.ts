/**
 * News helpers.
 *
 * Every surface that lists articles — the index, the paged slices, category
 * pages, RSS, llms.txt, the sitemap and the homepage — goes through
 * `getPublished()`. Filtering in one place is what guarantees a draft cannot
 * leak into a machine-readable feed while being correctly hidden from the HTML.
 */

import { getCollection, type CollectionEntry } from 'astro:content';

export type NewsEntry = CollectionEntry<'news'>;

export const POSTS_PER_PAGE = 8;

/** Published articles, newest first. The only entry point for reading news. */
export async function getPublished(): Promise<NewsEntry[]> {
  const entries = await getCollection('news', (entry) => entry.data.status === 'published');
  return entries.sort(
    (a, b) => b.data.datePublished.valueOf() - a.data.datePublished.valueOf(),
  );
}

export function newsHref(entry: NewsEntry): string {
  return `/news/${entry.data.slug}/`;
}

/**
 * Reading time, derived — never authored.
 *
 * cloudlayer.io carried this as a frontmatter field until an audit found 194
 * of 201 articles disagreed with their own word count, overstating by an
 * average of four minutes. A number a human types once and never revisits is
 * a number that is wrong.
 *
 * Fenced code is stripped first: nobody reads a config block at prose speed.
 */
export function readingMinutes(body: string): number {
  const prose = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-|]/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 300));
}

/**
 * Dates are formatted in UTC deliberately. A date-only frontmatter value parses
 * as UTC midnight; formatting it in the build machine's local zone renders the
 * previous day anywhere west of Greenwich.
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString();
}

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function categoriesOf(entries: NewsEntry[]): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.data.category, (counts.get(entry.data.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: categorySlug(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export interface Paged {
  featured: NewsEntry | undefined;
  rest: NewsEntry[];
  totalPages: number;
}

/**
 * The newest article takes a featured slot and is excluded from paging, so it
 * never appears twice across the index and page 2.
 */
export function splitForPaging(entries: NewsEntry[]): Paged {
  const [featured, ...rest] = entries;
  return {
    featured,
    rest,
    totalPages: Math.max(1, Math.ceil(rest.length / POSTS_PER_PAGE)),
  };
}

export function pageSlice(rest: NewsEntry[], page: number): NewsEntry[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return rest.slice(start, start + POSTS_PER_PAGE);
}
