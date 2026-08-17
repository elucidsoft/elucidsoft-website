import type { APIRoute } from 'astro';
import { COMPANY, SITE_URL } from '../data/company';

const AUTH_MD_CONTENT = `# ${COMPANY.legalName} auth.md

Agent registration and authentication discovery document for ${COMPANY.legalName} (\`${SITE_URL.replace(/^https?:\/\//, '')}\`) and associated services.

## Overview

This document specifies authentication, authorization, and autonomous agent registration mechanisms for APIs and services published by ${COMPANY.legalName}.

- **Issuer / Authorization Server:** ${SITE_URL}
- **Protected Resource:** ${SITE_URL}
- **Protected Resource Metadata (PRM):** ${SITE_URL}/.well-known/oauth-protected-resource
- **Authorization Server Metadata (ASM):** ${SITE_URL}/.well-known/oauth-authorization-server
- **API Catalog (RFC 9727):** ${SITE_URL}/.well-known/api-catalog

## Supported Agent Registration & Identity Flows

Autonomous AI agents, developer tools, and automated pipelines can authenticate and register using three supported identity models:

### 1. Identity Assertion (ID-JAG)
- **Identity Type:** \`identity_assertion\`
- **Assertion Type:** \`urn:ietf:params:oauth:token-type:id-jag\`
- **Credential Types:** \`bearer_token\`, \`api_key\`
- **Registration Endpoint:** ${SITE_URL}/agent/register
- **Revocation Endpoint:** ${SITE_URL}/agent/revoke
- **Usage:** Submit a cryptographically signed JSON Assertion Grant (ID-JAG) to obtain a scoped access token for authorized API operations.

### 2. Verified Email
- **Identity Type:** \`identity_assertion\`
- **Assertion Type:** \`verified_email\`
- **Credential Types:** \`bearer_token\`, \`api_key\`
- **Claim Endpoint:** ${SITE_URL}/agent/claim
- **Usage:** Submit verified domain/email identity claims for agent credential provisioning.

### 3. Anonymous / Scoped Public Access
- **Identity Type:** \`anonymous\`
- **Credential Types:** \`ephemeral_token\`, \`public_read\`
- **Claim Endpoint:** ${SITE_URL}/agent/claim
- **Usage:** Request ephemeral public-read access tokens for unauthenticated exploration of public catalogs and documentation.

## Scopes Supported

- \`read\`: Read access to public company facts, news, and portfolio metadata.
- \`write\`: Submission of contact forms and enterprise inquiries.
- \`agent:read\`: Autonomous agent retrieval of OpenAPI specifications, API catalogs, and schemas.
- \`agent:write\`: Autonomous agent provisioning and registration operations.

## Bearer Token Usage

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
