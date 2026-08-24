/** HTML twin of /llms-full.txt. See llms.html.ts for why both exist. */
import type { APIRoute } from 'astro';
import { buildLlmsFullTxt, wrapAsHtml } from '../lib/llms';
import { COMPANY, SITE_URL } from '../data/company';

export const GET: APIRoute = async () =>
  new Response(
    wrapAsHtml(
      `llms-full.txt — ${COMPANY.legalName}`,
      `Complete machine-readable record of ${COMPANY.legalName}: full descriptions of all seven products, the company structure, and an explicit list of what the company does not claim.`,
      `${SITE_URL}/llms-full.html`,
      await buildLlmsFullTxt(),
    ),
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
