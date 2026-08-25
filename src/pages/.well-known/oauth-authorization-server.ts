/**
 * RFC 8414 OAuth Authorization Server Metadata (ASM).
 *
 * elucidsoft.com does not run an OAuth token-issuance backend yet, so this
 * only publishes fields that are actually true today (issuer identity and
 * the scopes named in the API catalog). Do not add authorization_endpoint,
 * token_endpoint, registration_endpoint, revocation_endpoint, or an
 * agent_auth block until those routes exist and return something other
 * than 404 — see auth.md, which documents that state explicitly.
 */
import type { APIRoute } from 'astro';
import { SITE_URL } from '../../data/company';

export const GET: APIRoute = () => {
  const metadata = {
    issuer: SITE_URL,
    scopes_supported: ['read', 'write', 'agent:read', 'agent:write'],
  };

  return new Response(JSON.stringify(metadata, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
