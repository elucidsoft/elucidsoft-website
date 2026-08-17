/**
 * RSS, generated from the collection rather than maintained by hand, so a
 * draft cannot appear in the feed while being correctly hidden from the site.
 */
import type { APIRoute } from 'astro';
import { getPublished, newsHref } from '../../lib/news';
import { SITE_URL, COMPANY } from '../../data/company';
import { COPY } from '../../data/copy';

/** XML has five predefined entities; all five have to be escaped, in order. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const entries = await getPublished();

  const items = entries
    .map((entry) => {
      const url = `${SITE_URL}${newsHref(entry)}`;
      return `    <item>
      <title>${esc(entry.data.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <description>${esc(entry.data.summary)}</description>
      <category>${esc(entry.data.category)}</category>
      <pubDate>${entry.data.datePublished.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${COMPANY.legalName} — ${COPY.NEWS.title}`)}</title>
    <link>${SITE_URL}/news/</link>
    <atom:link href="${SITE_URL}/news/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc(COPY.NEWS.metaDescription)}</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
