/**
 * Markdown mirror of every published article, at /news/<slug>.md
 *
 * Language models retrieve and quote plain text far more reliably than they
 * parse a rendered page, and the llms.txt index points at these URLs rather
 * than the HTML ones. Serving the article's own source removes the navigation,
 * the styling and the hydration payload from what a model has to read.
 *
 * Frontmatter is stripped and replaced with a short human-readable header, so
 * the file opens as a document rather than as a YAML block.
 */
import type { APIRoute } from 'astro';
import { getPublished, formatDate } from '../../lib/news';
import { SITE_URL, COMPANY } from '../../data/company';

export async function getStaticPaths() {
  const entries = await getPublished();
  return entries.map((entry) => ({
    params: { slug: entry.data.slug },
    props: { entry },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { entry } = props as { entry: Awaited<ReturnType<typeof getPublished>>[number] };
  const { data } = entry;

  const body = (entry.body ?? '').replace(/^---[\s\S]*?---\s*/, '');

  const header = [
    `# ${data.title}`,
    '',
    `> ${data.summary}`,
    '',
    `Published: ${formatDate(data.datePublished)}`,
    data.dateModified ? `Updated: ${formatDate(data.dateModified)}` : null,
    `Author: ${data.author}`,
    `Category: ${data.category}`,
    `Source: ${SITE_URL}/news/${data.slug}/`,
    `Publisher: ${COMPANY.legalName}`,
    '',
    '---',
    '',
  ]
    .filter((line) => line !== null)
    .join('\n');

  return new Response(`${header}${body}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
