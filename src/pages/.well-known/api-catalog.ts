/**
 * RFC 9727 API Catalog Endpoint
 *
 * Serves /.well-known/api-catalog in application/linkset+json format.
 */
import type { APIRoute } from 'astro';
import { buildApiCatalog } from '../../lib/api-catalog';

export const GET: APIRoute = () => {
  const catalog = buildApiCatalog();

  return new Response(JSON.stringify(catalog, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/linkset+json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
