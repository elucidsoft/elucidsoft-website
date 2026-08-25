import type { APIRoute } from 'astro';
import { COMPANY, SITE_URL } from '../data/company';

const AUTH_MD_CONTENT = `# ${COMPANY.legalName} auth.md

Authentication and authorization discovery document for ${COMPANY.legalName} (\`${SITE_URL.replace(/^https?:\/\//, '')}\`) and associated services.

## Overview

This document describes the OAuth discovery metadata published for APIs and services under ${COMPANY.legalName}.

- **Issuer / Authorization Server:** ${SITE_URL}
- **Protected Resource:** ${SITE_URL}
- **Protected Resource Metadata (PRM):** ${SITE_URL}/.well-known/oauth-protected-resource
- **Authorization Server Metadata (ASM):** ${SITE_URL}/.well-known/oauth-authorization-server
- **API Catalog (RFC 9727):** ${SITE_URL}/.well-known/api-catalog

The ASM currently publishes only an issuer identity and the scopes listed below. It does not yet publish an authorization endpoint, a token endpoint, or a registration endpoint, and no working OAuth token-issuance flow runs on this domain today.

## Agent Registration & Identity Flows

${COMPANY.legalName} operates \`${SITE_URL.replace(/^https?:\/\//, '')}\` as a static site. It does not run an agent self-registration, credential-issuance, or revocation endpoint. There is no \`/agent/register\`, \`/agent/claim\`, or \`/agent/revoke\` route, and no identity-assertion, verified-email, or anonymous-access flow issues credentials today.

The PRM and ASM documents linked above describe protected-resource and authorization-server discovery only. An agent or tool reading this file should treat the scopes below as declarative, not as evidence of a working registration or token-issuance flow.

## Scopes Supported

- \`read\`: Read access to public company facts, news, and portfolio metadata.
- \`write\`: Submission of contact forms and enterprise inquiries.
- \`agent:read\`: Autonomous agent retrieval of OpenAPI specifications, API catalogs, and schemas.
- \`agent:write\`: Autonomous agent provisioning and registration operations.

## Bearer Token Usage

This section describes the wire format a client would use once a token exists. No endpoint on this domain issues one today.

Include the issued bearer token in the HTTP \`Authorization\` header:

\`\`\`http
Authorization: Bearer <token>
\`\`\`
`;

export const GET: APIRoute = () => {
  return new Response(AUTH_MD_CONTENT, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
