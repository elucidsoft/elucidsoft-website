/**
 * Elucidsoft LLC — entity facts.
 *
 * Every string here is transcribed from a filed or published source, not
 * composed for the website. The address and entity description are taken
 * verbatim from the Upstat Terms of Service, Privacy Policy, Security page
 * and DPA, which are the company's existing public legal record.
 *
 * Nothing in this file may be embellished. If a claim cannot be traced to a
 * document or a live URL, it does not belong here — /facts/ renders straight
 * from this module and is meant to be citable.
 */

export const SITE_URL = 'https://elucidsoft.com';

/** Stable JSON-LD node id. Child sites point `parentOrganization` at this. */
export const ORG_ID = `${SITE_URL}/#organization`;

export const COMPANY = {
  legalName: 'Elucidsoft LLC',
  shortName: 'Elucidsoft',
  /**
   * schema.org has no property for a "doing business as" name. `alternateName`
   * is the correct carrier, and these two are the registered trade names.
   */
  tradeNames: ['Upstat', 'cloudlayer.io'],
  /*
   * There is deliberately no `entityType` or "a Virginia limited liability
   * company" statement here.
   *
   * The legal structure was rendered in the footer, on /about/, on /facts/,
   * on /contact/ and in every legal page, and it is filing-cabinet language:
   * it tells a reader nothing they came to find out. "Elucidsoft LLC" is kept
   * everywhere as the company's NAME — that is not a claim about structure.
   * Where the jurisdiction genuinely matters (governing law) the legal copy
   * says so in prose.
   */
  /**
   * Jurisdiction only. The registered street address is deliberately not
   * published: a suite number at a mail-forwarding address is not a corporate
   * headquarters, and printing one in the footer of every page reads as a
   * small operation trying to look larger. The jurisdiction is the part that
   * actually means something — it establishes which state's law governs and
   * which registry the entity can be looked up in.
   *
   * Written notice still has a route: the contact form.
   */
  region: 'Virginia',
  regionCode: 'VA',
  country: 'United States',
  countryCode: 'US',
  founder: {
    name: 'Eric Malamisura',
    url: 'https://ericmalamisura.com',
  },
  foundingYear: 2010,
  githubAccounts: [
    { label: 'upstat-io', url: 'https://github.com/upstat-io' },
    { label: 'cloudlayerio', url: 'https://github.com/cloudlayerio' },
    { label: 'elucidsoft', url: 'https://github.com/elucidsoft' },
  ],
  githubUrl: 'https://github.com/elucidsoft',
  sponsorUrl: 'https://github.com/sponsors/upstat-io',
} as const;

/** Short jurisdiction string for chrome and footers. */
export const JURISDICTION = `${COMPANY.region}, ${COMPANY.country}`;

/**
 * Web3Forms access key for /contact/.
 *
 * PLACEHOLDER — this must be replaced with a key issued to an Elucidsoft
 * address at https://web3forms.com before the contact form will deliver
 * anything. The key on the personal portfolio site is bound to a different
 * inbox and must not be reused here.
 */
export const CONTACT = {
  web3formsKey: 'REPLACE_ME_ELUCIDSOFT_WEB3FORMS_KEY',
  endpoint: 'https://api.web3forms.com/submit',
} as const;

/**
 * Topics the organization demonstrably works in, for Organization.knowsAbout.
 * Each maps to a product that actually ships in that space.
 */
export const KNOWS_ABOUT = [
  'Incident management',
  'Site reliability engineering',
  'On-call scheduling',
  'Document generation',
  'PDF generation',
  'Compiler design',
  'Programming language design',
  'Terminal emulators',
  'Web application frameworks',
  'Developer tools',
] as const;
