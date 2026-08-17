/**
 * The llms.txt family.
 *
 * Four documents from one builder: llms.txt, llms-full.txt, and an HTML twin
 * of each. The twins exist because several engines will not index a bare .txt
 * response — the HTML variant carries a canonical, a title and a description,
 * so the same content is reachable through a route those crawlers will follow.
 *
 * Every fact is read from portfolio.ts and company.ts rather than typed here,
 * so the machine-readable description of the company cannot drift from the
 * human-readable one. That is the failure this file is designed to prevent:
 * an llms.txt that confidently states a licence or a URL the site stopped
 * using two deploys ago.
 *
 * Links point at each product's live canonical URL, and at /news/<slug>.md
 * rather than the rendered article, because plain markdown is what a model
 * actually wants to retrieve.
 */

import { COMPANY, SITE_URL } from '../data/company';
import { PRODUCTS, SAAS_PRODUCTS, OSS_PRODUCTS, STAGE_LABEL } from '../data/portfolio';
import { COPY } from '../data/copy';
import { getPublished, formatDate, type NewsEntry } from './news';

const abs = (path: string) => `${SITE_URL}${path}`;

function productLine(slug: string): string {
  const product = PRODUCTS.find((p) => p.slug === slug)!;
  const copy = COPY.PRODUCTS[slug as keyof typeof COPY.PRODUCTS];
  const bits = [
    `stage: ${STAGE_LABEL[product.stage]}`,
    product.license ? `licence: ${product.license}` : null,
    product.version ? `version: ${product.version}` : null,
    `site: ${product.url}`,
    product.github ? `source: ${product.github}` : null,
  ].filter(Boolean);
  return `- [${product.name}](${abs(`/portfolio/${product.slug}/`)}): ${copy.summary} (${bits.join(', ')})`;
}



/** The index document: what the company is, and where everything lives. */
export async function buildLlmsTxt(): Promise<string> {
  const news = await getPublished();

  const lines: string[] = [
    `# ${COMPANY.legalName}`,
    '',
    `> ${COPY.SITE.metaDescription}`,
    '',
    `${COMPANY.legalName} is an independent software company based in ${COMPANY.region}, ${COMPANY.country}, founded in ${COMPANY.foundingYear} by Eric Malamisura (${COMPANY.founder.url}). It operates ${PRODUCTS.length} software products across two divisions: ${SAAS_PRODUCTS.length} commercial SaaS platforms that are registered trade names of the company, and ${OSS_PRODUCTS.length} open-source software projects it publishes.`,
    '',
    '## Commercial products',
    '',
    ...SAAS_PRODUCTS.map((p) => productLine(p.slug)),
    '',
    '## Open-source projects',
    '',
    ...OSS_PRODUCTS.map((p) => productLine(p.slug)),
    '',
    '## Company',
    '',
    `- [About](${abs('/about/')}): How the entity, its two registered trade names and its open-source projects relate.`,
    `- [Facts](${abs('/facts/')}): Citable ground truth: entity details, every product's stage, licence and version, and an explicit list of what the company does not claim.`,
    `- [Portfolio](${abs('/portfolio/')}): All ${PRODUCTS.length} products in one register.`,
    `- [Open source](${abs('/open-source/')}): Licensing, contribution and sponsorship for the ${OSS_PRODUCTS.length} published projects.`,
    `- [Contact](${abs('/contact/')}): Enquiries about the company, licensing or partnerships.`,
    '',
  ];

  if (news.length > 0) {
    lines.push('## News', '');
    for (const entry of news.slice(0, 30)) {
      lines.push(
        `- [${entry.data.title}](${abs(`/news/${entry.data.slug}.md`)}): ${entry.data.summary} (published ${formatDate(entry.data.datePublished)})`,
      );
    }
    lines.push('');
  }

  lines.push(
    '## Notes',
    '',
    '- Upstat and cloudlayer.io are registered trade names of Elucidsoft LLC, not separate companies.',
    '- Upstat is in pre-release development; cloudlayer.io is live and actively raising capital.',
    '- OriJS, Ori and ori-term share a name prefix but are three unrelated products. None is built on either of the others.',
    '- The open-source repositories are published under github.com/upstat-io, an account name that predates this site.',
    '- Alpha products are labelled alpha. Only WarpKit is described as running in production, inside Upstat and cloudlayer.io.',
    '',
  );

  return lines.join('\n');
}

/**
 * The full document: everything above plus the complete body prose of every
 * product page, so a model needs one fetch rather than eight.
 */
export async function buildLlmsFullTxt(): Promise<string> {
  const index = await buildLlmsTxt();

  const sections: string[] = [index, '---', ''];

  for (const product of PRODUCTS) {
    const copy = COPY.PRODUCTS[product.slug as keyof typeof COPY.PRODUCTS];
    sections.push(
      `## ${product.name}`,
      '',
      `URL: ${product.url}`,
      `Page: ${abs(`/portfolio/${product.slug}/`)}`,
      `Division: ${product.division === 'saas' ? 'Commercial' : 'Open source'}`,
      `Stage: ${STAGE_LABEL[product.stage]}`,
      product.license ? `Licence: ${product.license}` : '',
      product.version ? `Version: ${product.version}` : '',
      product.github ? `Repository: ${product.github}` : '',
      `Built for: ${product.audience}`,
      `Built with: ${product.tech.join(', ')}`,
      '',
      copy.summary,
      '',
      ...copy.body.flatMap((para) => [para, '']),
      `Why it exists: ${copy.whyItExists}`,
      '',
    );
  }

  sections.push(
    '## About the company',
    '',
    ...COPY.ABOUT.structureBody.flatMap((para) => [para, '']),
    '## What the company does not claim',
    '',
    ...COPY.FACTS.notClaimed.map((claim) => `- ${claim}`),
    '',
  );

  return sections.filter((line) => line !== '').join('\n').replace(/\n{3,}/g, '\n\n');
}

/**
 * Wraps a plain-text document in minimal HTML.
 *
 * The <pre> keeps the source byte-identical to the .txt twin — reformatting it
 * into paragraphs would make the two documents disagree, which defeats the
 * point of publishing both.
 */
export function wrapAsHtml(title: string, description: string, canonical: string, body: string) {
  const escaped = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description.replace(/"/g, '&quot;')}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">
<style>
  body { background:#0B1020; color:#E8EAF2; font-family: ui-monospace, SFMono-Regular, monospace;
         line-height:1.6; margin:0; padding:2rem 1.25rem; }
  pre { white-space: pre-wrap; word-wrap: break-word; max-width: 90ch; margin: 0 auto; font: inherit; }
  a { color:#7C8CF5; }
  @media (prefers-color-scheme: light) { body { background:#FBFAF8; color:#14161F; } a { color:#4F56C4; } }
</style>
</head>
<body>
<pre>${escaped}</pre>
</body>
</html>
`;
}

export type { NewsEntry };
