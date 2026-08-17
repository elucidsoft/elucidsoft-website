/**
 * RFC 8414 OAuth Authorization Server Metadata (ASM) with Agent Auth Extension
 */
import type { APIRoute } from 'astro';
import { SITE_URL } from '../../data/company';

export const GET: APIRoute = () => {
  const metadata = {
    issuer: SITE_URL,
    authorization_endpoint: `${SITE_URL}/oauth/authorize`,
    token_endpoint: `${SITE_URL}/oauth/token`,
    registration_endpoint: `${SITE_URL}/oauth/register`,
    revocation_endpoint: `${SITE_URL}/oauth/revoke`,
    scopes_supported: ['read', 'write', 'agent:read', 'agent:write'],
    response_types_supported: ['code', 'token'],
    grant_types_supported: [
      'authorization_code',
      'client_credentials',
      'urn:ietf:params:oauth:grant-type:token-exchange',
      'urn:ietf:params:oauth:grant-type:identity-assertion',
    ],
    token_endpoint_auth_methods_supported: [
      'client_secret_basic',
      'client_secret_post',
      'private_key_jwt',
    ],
    agent_auth: {
      skill: `${SITE_URL}/auth.md`,
      register_uri: `${SITE_URL}/agent/register`,
      claim_uri: `${SITE_URL}/agent/claim`,
      revocation_uri: `${SITE_URL}/agent/revoke`,
      events_supported: ['revocation', 'credential_rotation'],
      identity_types_supported: [
        'identity_assertion',
        'verified_email',
        'anonymous',
      ],
      identity_assertion: {
        assertion_types_supported: [
          'urn:ietf:params:oauth:token-type:id-jag',
          'verified_email',
        ],
        credential_types_supported: ['bearer_token', 'api_key'],
      },
      anonymous: {
        credential_types_supported: ['ephemeral_token', 'public_read'],
      },
    },
  };

  return new Response(JSON.stringify(metadata, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
