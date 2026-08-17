# Elucidsoft LLC auth.md

Agent registration and authentication discovery document for Elucidsoft LLC (`elucidsoft.com`) and associated services.

## Overview

This document specifies authentication, authorization, and autonomous agent registration mechanisms for APIs and services published by Elucidsoft LLC.

- **Issuer / Authorization Server:** https://elucidsoft.com
- **Protected Resource:** https://elucidsoft.com
- **Protected Resource Metadata (PRM):** https://elucidsoft.com/.well-known/oauth-protected-resource
- **Authorization Server Metadata (ASM):** https://elucidsoft.com/.well-known/oauth-authorization-server
- **API Catalog (RFC 9727):** https://elucidsoft.com/.well-known/api-catalog

## Supported Agent Registration & Identity Flows

Autonomous AI agents, developer tools, and automated pipelines can authenticate and register using three supported identity models:

### 1. Identity Assertion (ID-JAG)
- **Identity Type:** `identity_assertion`
- **Assertion Type:** `urn:ietf:params:oauth:token-type:id-jag`
- **Credential Types:** `bearer_token`, `api_key`
- **Registration Endpoint:** https://elucidsoft.com/agent/register
- **Revocation Endpoint:** https://elucidsoft.com/agent/revoke
- **Usage:** Submit a cryptographically signed JSON Assertion Grant (ID-JAG) to obtain a scoped access token for authorized API operations.

### 2. Verified Email
- **Identity Type:** `identity_assertion`
- **Assertion Type:** `verified_email`
- **Credential Types:** `bearer_token`, `api_key`
- **Claim Endpoint:** https://elucidsoft.com/agent/claim
- **Usage:** Submit verified domain/email identity claims for agent credential provisioning.

### 3. Anonymous / Scoped Public Access
- **Identity Type:** `anonymous`
- **Credential Types:** `ephemeral_token`, `public_read`
- **Claim Endpoint:** https://elucidsoft.com/agent/claim
- **Usage:** Request ephemeral public-read access tokens for unauthenticated exploration of public catalogs and documentation.

## Scopes Supported

- `read`: Read access to public company facts, news, and portfolio metadata.
- `write`: Submission of contact forms and enterprise inquiries.
- `agent:read`: Autonomous agent retrieval of OpenAPI specifications, API catalogs, and schemas.
- `agent:write`: Autonomous agent provisioning and registration operations.

## Bearer Token Usage

Include the issued bearer token in the HTTP `Authorization` header:

```http
Authorization: Bearer <token>
```
