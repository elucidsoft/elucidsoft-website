/**
 * RFC 9728 OAuth Protected Resource Metadata (PRM)
 */
import type { APIRoute } from 'astro';
import { SITE_URL } from '../../data/company';

export const GET: APIRoute = () => {
  const metadata = {
    resource: SITE_URL,
    authorization_servers: [SITE_URL],
    scopes_supported: ['read', 'write', 'agent:read', 'agent:write'],
    bearer_methods_supported: ['header'],
    resource_documentation: `${SITE_URL}/auth.md`,
  };

  return new Response(JSON.stringify(metadata, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
