/**
 * HTML twin of /llms.txt. Exists because several engines will not index a bare
 * .txt response; this route carries a canonical and a description so the same
 * content is reachable by a crawler that only follows HTML.
 */
import type { APIRoute } from 'astro';
import { buildLlmsTxt, wrapAsHtml } from '../lib/llms';
import { COMPANY, SITE_URL } from '../data/company';

export const GET: APIRoute = async () =>
  new Response(
    wrapAsHtml(
      `llms.txt — ${COMPANY.legalName}`,
      `Machine-readable index of ${COMPANY.legalName}: the entity, its two commercial products and its four open-source projects, with stages, licences and canonical URLs.`,
      `${SITE_URL}/llms.html`,
      await buildLlmsTxt(),
    ),
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
