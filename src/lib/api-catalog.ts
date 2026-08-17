/**
 * RFC 9727 API Catalog implementation.
 *
 * Implements the Linkset format (RFC 9264) for machine-readable discovery of APIs
 * across Elucidsoft products (cloudlayer.io, Upstat, and corporate APIs).
 */
import { COMPANY, SITE_URL } from '../data/company';
import { PRODUCTS } from '../data/portfolio';

export interface LinkObject {
  href: string;
  type?: string;
  title?: string;
}

export interface LinksetItem {
  anchor: string;
  'service-desc'?: LinkObject[];
  'service-doc'?: LinkObject[];
  status?: LinkObject[];
  'service-meta'?: LinkObject[];
  [key: string]: unknown;
}

export interface ApiCatalogDocument {
  linkset: LinksetItem[];
}

export function buildApiCatalog(): ApiCatalogDocument {
  const cloudlayer = PRODUCTS.find((p) => p.slug === 'cloudlayer');
  const upstat = PRODUCTS.find((p) => p.slug === 'upstat');

  const linkset: LinksetItem[] = [
    {
      anchor: 'https://api.cloudlayer.io/v2',
      'service-desc': [
        {
          href: 'https://api.cloudlayer.io/v2/openapi.json',
          type: 'application/json',
          title: 'cloudlayer.io REST API OpenAPI v3 Specification (JSON)',
        },
      ],
      'service-doc': [
        {
          href: cloudlayer?.docsUrl ?? 'https://cloudlayer.io/docs/api-overview/',
          type: 'text/html',
          title: 'cloudlayer.io Document & Image Generation API Documentation',
        },
      ],
      status: [
        {
          href: 'https://status.cloudlayer.io',
          type: 'text/html',
          title: 'cloudlayer.io Service Status & Uptime',
        },
      ],
    },
    {
      anchor: 'https://api.upstat.io/v1',
      'service-desc': [
        {
          href: 'https://api.upstat.io/v1/openapi.json',
          type: 'application/json',
          title: 'Upstat Incident Management API OpenAPI Specification (JSON)',
        },
      ],
      'service-doc': [
        {
          href: upstat?.docsUrl ?? 'https://upstat.io/docs/',
          type: 'text/html',
          title: 'Upstat Incident Management & Intelligence API Documentation',
        },
      ],
      status: [
        {
          href: 'https://status.upstat.io',
          type: 'text/html',
          title: 'Upstat Service Status',
        },
      ],
    },
    {
      anchor: `${SITE_URL}/api`,
      'service-doc': [
        {
          href: `${SITE_URL}/facts/`,
          type: 'text/html',
          title: `${COMPANY.legalName} Corporate Ground Truth & Entity Information`,
        },
      ],
      status: [
        {
          href: `${SITE_URL}/`,
          type: 'text/html',
          title: `${COMPANY.legalName} Corporate Portal`,
        },
      ],
    },
  ];

  return { linkset };
}
