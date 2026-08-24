/**
 * copy.ts — human-readable strings for Elucidsoft.
 *
 * This is a plain data module: constants only, no imports, no logic, no
 * framework code. Pages and components read strings from here rather than
 * hard-coding prose inline.
 *
 * Facts referenced in this copy (entity details, product stages, versions,
 * licences, URLs) are drawn directly from the company's verified records.
 */

// ---------------------------------------------------------------------------
// Site-wide
// ---------------------------------------------------------------------------

export const SITE = {
  tagline: 'Independent software company building commercial platforms and open-source developer tools.',
  metaDescription:
    'Elucidsoft is an independent software company founded in 2010 by Eric Malamisura, operating commercial SaaS platforms and open-source developer tools.',
} as const;

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------

export const HOME = {
  headline: 'We build cool software.',
  lead: 'Founded in 2010 by Eric Malamisura, Elucidsoft is an independent software company. We build commercial platforms and open-source developer tools, funded by product revenue and built on long-term engineering.',
  ctaPrimary: 'Explore our products',
  ctaSecondary: 'About the company',
  heroLogosLabel: 'Commercial products and open-source developer tools',

  figuresLabel: 'Corporate overview',

  portfolioEyebrow: 'Products',
  portfolioTitle: 'Commercial platforms and open-source projects',
  portfolioLead:
    'We build two types of software: commercial SaaS products that generate revenue, and open-source developer tools released to the community.',
  commercialLabel: 'Commercial SaaS',
  commercialNote:
    'Operating businesses generating sustainable revenue under registered trade names.',
  openSourceLabel: 'Open-source tools',
  openSourceNote:
    'Developer tools, frameworks, and programming languages published for the community.',

  entityEyebrow: 'Corporate governance',
  entityTitle: 'Independent, founder-led software engineering',
  entityBody: [
    'Elucidsoft was founded in 2010 by Eric Malamisura as a privately held software company in Virginia. Operating with long-term autonomy, we focus on sustainable software architecture, operational independence, and deep technical craft.',
    'We develop two software lines: commercial SaaS products (Upstat, cloudlayer.io, and ActLume), and independent open-source technologies (WarpKit, Ori, ori-term, and OriJS). Revenue from our commercial products directly funds our ongoing work on open-source tools.',
  ],

  newsEyebrow: 'Corporate communications',
  newsTitle: 'Company announcements',
  newsLink: 'View all announcements',

  ctaTitle: 'Corporate inquiries & partnerships',
  ctaBody:
    'For inquiries concerning corporate governance, strategic partnerships, open-source licensing, or investment in cloudlayer.io, contact our corporate office.',
  ctaButton: 'Contact Elucidsoft',
} as const;

// ---------------------------------------------------------------------------
// Portfolio index
// ---------------------------------------------------------------------------

export const PORTFOLIO = {
  metaTitle: 'Software Products & Systems | Elucidsoft',
  metaDescription:
    'Explore our portfolio of seven software products across commercial SaaS and open source, including Upstat, cloudlayer.io, and ActLume.',
  eyebrow: 'Products',
  title: 'Products',
  lead: 'A directory of our commercial SaaS products and open-source developer tools, detailed by division, development stage, and license.',
  saasIntro:
    'Commercial SaaS platforms operated as registered trade names.',
  ossIntro:
    'Open-source developer tools, languages, and frameworks.',
} as const;

// ---------------------------------------------------------------------------
// Products — keys match the portfolio register slugs exactly
// ---------------------------------------------------------------------------

export const PRODUCTS = {
  upstat: {
    blurb: 'Incident response and operational intelligence platform',
    metaTitle: 'Upstat: Incident Response Platform',
    metaDescription:
      'Upstat is an upcoming incident response platform uniting synthetic monitoring, on-call scheduling, incident workflows, and status pages for engineering teams.',
    summary:
      'Upstat is an upcoming incident response and operational intelligence platform for DevOps engineers, site reliability engineers, and engineering managers. It unifies synthetic monitoring, on-call scheduling, incident workflows, and status pages within a single operational data model.',
    body: [
      'Incident response is commonly assembled from disparate tools that operate in isolation. A monitor triggers an alert in one service, a page dispatches through another, the incident is tracked in a third, and updates are posted to customers via a fourth. Each boundary between these tools causes lost context and wasted time during active outages.',
      'Upstat brings synthetic monitoring (HTTP, TCP, and heartbeat checks), on-call scheduling with escalation policies, incident management, automated runbooks, service catalogs with dependency mapping, and public status pages into a single platform. Alerts retain their originating check, associated service, on-call owner, and operational history throughout the incident lifecycle.',
      'Upstat is currently in active pre-release development, with early access opening soon for DevOps engineers, SREs, and engineering teams seeking an integrated incident management workflow without the complexity of disconnected legacy toolchains.',
    ],
    whyItExists:
      'Incident response tools that lack shared data and unified context cost engineering teams critical minutes during an outage.',
  },

  cloudlayer: {
    blurb: 'HTML-first visual content, document, and form platform',
    metaTitle: 'cloudlayer.io: Visual Content Platform',
    metaDescription:
      'cloudlayer.io is a visual content and document generation platform uniting drag-and-drop design, dynamic HTML templates, PDF/image APIs, and hosted forms.',
    summary:
      'cloudlayer.io is an HTML-first visual content, document, and form platform. It combines visual drag-and-drop designer tooling, dynamic HTML/Nunjucks templates, and automated capture with high-performance PDF and image generation APIs.',
    body: [
      'Programmatic document generation and content capture are critical bottlenecks across modern applications, frequently solved with brittle containerized headless browsers, disconnected form engines, and unmaintainable styling hacks.',
      'cloudlayer.io unifies visual content creation, automated document rendering, and hosted form workflows into a single structured artifact platform. Users author dynamic documents through code-level HTML/CSS or a visual drag-and-drop designer, outputting pixel-perfect PDFs, images, and full-page captures synchronously or via webhooks.',
      'Operating continuously since 2020 with official SDKs for eight programming languages, cloudlayer.io is actively scaling its platform capabilities and currently raising capital to expand its enterprise document and form infrastructure.',
    ],
    whyItExists:
      'Turning dynamic application data into reliable documents should be handled by dedicated infrastructure rather than bespoke rendering scripts.',
  },

  actlume: {
    blurb: 'CRA Article 14 reporting workspace for manufacturers',
    metaTitle: 'ActLume: CRA Article 14 Reporting Workspace',
    metaDescription:
      'ActLume is an upcoming reporting workspace helping manufacturers prepare EU Cyber Resilience Act Article 14 incident notifications ahead of the 2026 deadline.',
    summary:
      'ActLume is an upcoming multi-tenant web platform for commercial manufacturers subject to the EU Cyber Resilience Act. It is a reporting workspace for CRA Article 14, keeping readiness details, incident facts, human reportability decisions, and staged deadline tracking together in one case record per occurrence.',
    body: [
      'CRA Article 14 requires manufacturers to report actively exploited vulnerabilities and severe incidents affecting product security, with staged outer time limits after awareness: a 24-hour early warning, a 72-hour notification, and a final report. These obligations enter into application on 11 September 2026, and tracking them across spreadsheets and email threads leaves accountable staff without a single record of what was decided and when.',
      'ActLume keeps manufacturer, product, and reporter readiness details alongside incident facts, human reportability decisions, declared awareness times, deadline tracking, and staged report preparation and review in one case record per occurrence. A human filer signs into the ENISA Single Reporting Platform with EU Login to review and submit each report; ActLume never signs in, submits, or automates the portal itself, offering copy-assist to copy one selected value per explicit user gesture and recording the confirmed result as evidence. Every legal determination stays with accountable people.',
      'ActLume is currently in pre-release development, with its marketing site live at actlume.com ahead of Article 14 obligations entering into application on 11 September 2026, for manufacturers organizing their CRA reporting readiness before the deadline.',
    ],
    whyItExists:
      'Staged CRA Article 14 deadlines and human reportability decisions need one accountable case record rather than scattered spreadsheets and email threads.',
  },

  warpkit: {
    blurb: 'State-oriented Svelte 5 application framework',
    metaTitle: 'WarpKit: Svelte 5 Application Framework',
    metaDescription:
      'WarpKit is a Svelte 5 application framework structuring routes around application state, featuring a ten-phase navigation pipeline and caching data layer.',
    summary:
      'WarpKit is a standalone Svelte 5 framework for single-page web applications. It organizes routing around explicit application states rather than simple URL patterns, providing a ten-phase navigation pipeline, modular authentication adapters, a caching data layer, and schema-validated forms.',
    body: [
      'Traditional client-side routers treat routes strictly as URL patterns, requiring developers to manually coordinate access permissions, prerequisite data loading, and authentication states across individual route guards. As applications scale, scattered route checks often drift out of alignment, introducing authorization and layout inconsistencies.',
      'WarpKit organizes views into distinct application stages (such as public, onboarding, and authenticated sessions) to explicitly govern navigation boundaries. Middleware executes across a structured ten-phase lifecycle rather than arbitrary hooks. The framework includes a configuration-driven data layer with ETag and stale-while-revalidate caching, deep proxy form binding validated via StandardSchema, typed WebSocket handling, and provider-agnostic authentication adapters.',
      'WarpKit is currently in alpha at version 0.0.1, yet powers the production frontends of both Upstat and cloudlayer.io. It is published on npm under the @warpkit scope across eight modular packages under the MIT license.',
    ],
    whyItExists:
      'Frontend web applications need routing organized around actual session state and data readiness rather than disconnected URL patterns.',
  },

  'ori-lang': {
    blurb: 'Compiled systems programming language on LLVM',
    metaTitle: 'Ori: Statically Typed Compiled Language',
    metaDescription:
      'Ori is a statically typed systems language featuring value semantics, automatic reference counting, and capability effects, compiled via LLVM to native code.',
    summary:
      'Ori is a statically typed, expression-based systems programming language featuring value semantics and automatic reference counting in place of garbage collection or manual borrow checking. It compiles through LLVM to standalone native binaries across Windows, Linux, and macOS without a runtime dependency.',
    body: [
      'Garbage-collected runtimes trade execution predictability and memory footprint for developer convenience, while borrow checkers require explicit lifetime annotations that increase language complexity. Systems programmers are frequently forced to choose between these two paradigms even when neither matches the needs of a particular system.',
      'Ori employs value semantics coupled with deterministic automatic reference counting, eliminating garbage collection pauses while avoiding complex ownership annotations in type signatures. External side effects are declared explicitly as capabilities within function signatures to clarify dependencies. Testing syntax is built directly into the language specification, and the compiler targets LLVM to produce optimized native binaries.',
      'Ori is currently in alpha at version 2026.7.28-alpha.1, dual-licensed under MIT and Apache-2.0, with a compiler implemented in Rust. The language is experimental and not intended for production deployments, serving systems programmers and language researchers exploring alternative safety models.',
    ],
    whyItExists:
      'Memory safety and predictable systems performance should not require choosing between runtime stop-the-world pauses and complex borrow-checker lifecycles.',
  },

  'ori-term': {
    blurb: 'GPU-accelerated terminal, multiplexer and shell',
    metaTitle: 'ori-term: GPU-Accelerated Terminal',
    metaDescription:
      'ori-term is a GPU-accelerated terminal emulator in Rust combining terminal emulation, multiplexing, and window management with native splits and tabs.',
    summary:
      'ori-term is a GPU-accelerated terminal emulator written in Rust that integrates terminal emulation, multiplexing, and window management into a single application. It treats splits, tabs, floating panes, and multiple windows as core primitives rather than layered plugins.',
    body: [
      'Developers frequently stack separate terminal emulators, terminal multiplexers, and window managers that operate in friction. Scrollback buffers conflict with split panes, keybindings collide across layers, and layout recalculations must be mediated across disconnected process boundaries.',
      'ori-term resolves this friction by integrating these layers into a unified architecture. Tiling splits, tabbed navigation, floating panes, and multi-window layouts are first-class features powered by a GPU-accelerated rendering engine with negligible idle CPU utilization. It includes font ligatures, inline image protocols, custom themes, and consistent frameless window chrome across Windows, Linux, and macOS.',
      'ori-term is in alpha at version 0.2.0-alpha.20260528 under the MIT license, functioning as a daily driver across Windows, Linux, and macOS. Ongoing development is focused on background session detachment, remote shells over SSH/WSL, and headless client support.',
    ],
    whyItExists:
      'Integrating terminal emulation, multiplexing, and window layout into a single architecture removes keybinding conflicts and performance overhead.',
  },

  orijs: {
    blurb: 'Modular TypeScript backend framework for Bun',
    metaTitle: 'OriJS: Backend Framework for Bun',
    metaDescription:
      'OriJS is a TypeScript backend framework for Bun offering a modular NestJS-style architecture configured via a fluent builder API without decorators.',
    summary:
      'OriJS is a TypeScript backend framework for the Bun runtime, structured around modular architecture similar to NestJS but operating entirely without decorators or reflect-metadata. Modules, dependency injection providers, guards, and interceptors are configured through an explicit, type-safe fluent builder API.',
    body: [
      'Decorator-based dependency injection typically requires specialized compiler flags, runtime reflection polyfills, and fragile build transformations. While the architectural patterns of modules, injectable providers, guards, and interceptors provide clear structural benefits, reflection metadata introduces subtle runtime errors that can be difficult to trace.',
      'OriJS preserves modular dependency injection while removing decorator overhead. Service providers are declared explicitly via a fluent builder, making dependency graphs obvious and inspectable without runtime metadata reflection. Modular packages provide support for validation, configuration management, caching, event broadcasting, background job queues, saga workflows, WebSockets, and structured logging.',
      'OriJS is currently in alpha at version 0.0.1 under the MIT license and is hosted on GitHub prior to its initial npm release. It is designed for TypeScript backend engineers on the Bun runtime who want clean modular architecture without decorator dependencies.',
    ],
    whyItExists:
      'Clean modular backend architecture and dependency injection do not require experimental decorators or runtime reflection metadata.',
  },
} as const;

// ---------------------------------------------------------------------------
// Open source index
// ---------------------------------------------------------------------------

export const OPEN_SOURCE = {
  metaTitle: 'Open Source Engineering & Projects | Elucidsoft',
  metaDescription:
    'Explore our open-source engineering projects: WarpKit, Ori, ori-term, and OriJS across frontend frameworks, compilers, terminals, and backends.',
  eyebrow: 'Open source',
  title: 'Open-source engineering',
  lead: 'Our open-source developer tools span frontend frameworks, compiled systems languages, GPU terminal emulation, and backend application architectures.',
  policyTitle: 'Licensing and maintenance',
  policyBody: [
    'All our open-source projects are released under permissive licenses: WarpKit, ori-term, and OriJS under MIT, and Ori dual-licensed under MIT and Apache-2.0. Repositories are maintained under the github.com/upstat-io organization for build and package continuity.',
    'All codebases are open for community issues, RFCs, and pull requests. We do not sell commercial support contracts or restrictive enterprise licensing; WarpKit is maintained to production standards because it actively powers our commercial SaaS platforms.',
  ],
  sponsorTitle: 'Project sponsorship',
  sponsorBody:
    'Organizations and individuals wishing to support our independent open-source research and development may contribute through GitHub Sponsors.',
} as const;

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export const ABOUT = {
  metaTitle: 'About Elucidsoft: Corporate Background & Leadership',
  metaDescription:
    'Learn about Elucidsoft, an independent software company founded in 2010 by Eric Malamisura, operating commercial SaaS and open-source systems.',
  eyebrow: 'Corporate profile',
  title: 'About Elucidsoft',
  lead: 'Founded in 2010 by Eric Malamisura, Elucidsoft is an independent software company based in Virginia. We build sustainable commercial software products and open-source developer tools.',

  structureTitle: 'History and governance',
  structureBody: [
    'Elucidsoft was established in 2010 by engineer and entrepreneur Eric Malamisura in Virginia, United States. From inception, the company has operated as a privately held software enterprise dedicated to building dependable digital infrastructure and developer technologies without external investor constraints.',
    'The corporate structure is straightforward: Elucidsoft serves as the parent software company and legal entity. Upstat (incident response and operational intelligence), cloudlayer.io (document generation and capture infrastructure), and ActLume (CRA Article 14 reporting workspace) operate as commercial business units under registered trade names (DBAs). cloudlayer.io is live and generating revenue, while Upstat and ActLume are currently in pre-release development.',
    'Alongside its commercial products, Elucidsoft builds and publishes open-source software, including the WarpKit application framework, the Ori systems programming language, the ori-term GPU terminal emulator, and the OriJS backend framework. Revenue from our commercial products directly supports our open-source development.',
  ],

  principlesTitle: 'Operating philosophy',
  principles: [
    {
      title: 'Long-term independence',
      body: 'We are self-funded and founder-led. Operating with operational autonomy allows us to prioritize product stability, customer trust, and architectural longevity over artificial growth targets.',
    },
    {
      title: 'Dogfooding our engineering',
      body: 'We rely on the software we build. WarpKit powers the production frontends of our commercial SaaS platforms, ensuring our open-source tools are proven in real-world environments before being published.',
    },
    {
      title: 'Transparent governance',
      body: 'Every commercial service, trademark, and open-source repository maps directly to Elucidsoft as the single accountable parent organization.',
    },
    {
      title: 'Grounded, verifiable facts',
      body: 'All release stages, version numbers, and technical specifications published across our web properties reflect verified repository and package registry reality.',
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const CONTACT = {
  metaTitle: 'Corporate Contact & Inquiries | Elucidsoft',
  metaDescription:
    'Contact Elucidsoft for corporate inquiries, partnership proposals, and open-source licensing. Product support is managed on individual product sites.',
  eyebrow: 'Corporate communications',
  title: 'Contact',
  lead: 'Get in touch regarding company inquiries, partnerships, or licensing. For technical assistance with commercial products, please use the support channels on their respective websites.',

  nameLabel: 'Name',
  emailLabel: 'Email',
  subjectLabel: 'Subject',
  messageLabel: 'Message',
  submitLabel: 'Send corporate inquiry',

  statusSending: 'Sending...',
  statusSent: 'Inquiry received.',
  statusError: 'Something went wrong. Please try again.',

  asideTitle: 'Commercial product support',
  asideBody:
    'For customer support, billing inquiries, or technical assistance with Upstat, cloudlayer.io, or ActLume, please visit the official support channels on the product website.',
  channelsTitle: 'Corporate channels & repositories',
} as const;

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export const NEWS = {
  metaTitle: 'Corporate Announcements & News | Elucidsoft',
  metaDescription:
    'Official announcements and technical milestones covering company governance, commercial SaaS products, and open-source developer tool releases.',
  eyebrow: 'Communications',
  title: 'Corporate news',
  lead: 'Company announcements, product updates, and technical milestones across our commercial platforms and open-source projects.',
  empty: 'No announcements published at this time.',
} as const;

// ---------------------------------------------------------------------------
// Facts (citable ground-truth page)
// ---------------------------------------------------------------------------

export const FACTS = {
  metaTitle: 'Verified Corporate Facts & Register | Elucidsoft',
  metaDescription:
    'Verified corporate facts for Elucidsoft: founding in 2010, founder Eric Malamisura, business entity structure, software licenses, and versions.',
  eyebrow: 'Corporate facts',
  title: 'Facts & registry',
  lead: 'A verified, citable factual record of the company, founder Eric Malamisura, and the software portfolio. Drawn directly from public entity filings and repository metadata.',

  entityTitle: 'Company record',
  productsTitle: 'Software portfolio register',
  notClaimedTitle: 'Operating boundaries & disclaimers',
  notClaimed: [
    'Elucidsoft is privately held and founder-led; outside investment is currently being raised specifically for cloudlayer.io.',
    'The company is founder-led by Eric Malamisura; no additional employees or contractors are represented on this site.',
    'Upstat and ActLume are in pre-release development; Ori, ori-term, and OriJS are experimental alpha projects and are not marketed as production-ready.',
    'No unsolicited customer logos, paid endorsements, or sponsored awards are published.',
  ],
} as const;

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

export const FOOTER = {
  blurb: 'An independent software company founded in 2010 by Eric Malamisura, operating commercial SaaS platforms and open-source systems.',
  portfolioHeading: 'Portfolio',
  companyHeading: 'Company',
  machineHeading: 'Machine-readable',
  rights: '© {year} Elucidsoft LLC. All rights reserved.',
} as const;

// ---------------------------------------------------------------------------
// 404
// ---------------------------------------------------------------------------

export const NOT_FOUND = {
  eyebrow: '404 error',
  title: 'Page not found',
  body: 'The requested page does not exist or has been moved.',
  cta: 'Back to home',
} as const;

// ---------------------------------------------------------------------------
// Legal
// ---------------------------------------------------------------------------

export const LEGAL = {
  privacyTitle: 'Privacy policy',
  privacyMetaDescription:
    'Privacy policy for Elucidsoft: details on static site hosting, contact form processing, data retention, client storage, and Virginia privacy rights.',
  privacyIntro:
    'This Privacy Policy describes how Elucidsoft LLC handles information collected through elucidsoft.com, our corporate communications, and direct executive inquiries. It also clarifies the operational boundaries between this corporate website and our commercial SaaS products.',
  privacyBody: [
    {
      heading: '1. Scope and operational boundaries',
      paragraphs: [
        'This Privacy Policy applies strictly to the elucidsoft.com website and direct corporate communications sent to Elucidsoft LLC. It explains our data handling practices for visitors reviewing corporate documentation, announcements, and open-source project directories.',
        'Elucidsoft operates distinct commercial SaaS platforms (including Upstat, cloudlayer.io, and ActLume) that maintain separate privacy policies, terms of service, and customer data processing addenda (DPAs). Customer account credentials, billing records, monitoring payloads, and document rendering jobs processed on those commercial platforms are governed exclusively by their respective policies and service agreements.',
      ],
    },
    {
      heading: '2. Information we collect',
      paragraphs: [
        'Direct Communications: When you contact us through our corporate contact form or email, we collect the personal information you choose to provide. This typically includes your name, email address, company affiliation, subject matter, and message content.',
        'Network Access Logs: Like standard web infrastructure, our hosting servers and content delivery networks automatically generate technical access logs when you request pages on elucidsoft.com. These logs include internet protocol (IP) addresses, browser user agent strings, referring URLs, request timestamps, and HTTP status codes.',
        'Local Storage Preferences: We store your display theme preference (light or dark mode) locally on your device using your browser\'s localStorage under the key "elucid-theme". This value is stored purely client-side and is never transmitted to our servers or third parties.',
      ],
    },
    {
      heading: '3. No tracking cookies or behavioral profiling',
      paragraphs: [
        'elucidsoft.com is built as a static site and operated without tracking cookies, advertising beacons, fingerprinting scripts, or third-party behavioral analytics platforms.',
        'We do not track your browsing activity across other websites, build marketing profiles, or participate in cross-context behavioral advertising.',
      ],
    },
    {
      heading: '4. How we use your information',
      paragraphs: [
        'Information submitted through direct corporate inquiries is used solely to evaluate and respond to your messages, discuss partnership proposals, answer open-source licensing questions, or handle investor inquiries.',
        'Network access logs are used exclusively for infrastructure maintenance, traffic routing, performance optimization, and defending against automated vulnerability scans, malicious scraping, or distributed denial-of-service (DDoS) attacks.',
        'We do not sell, rent, monetize, or trade your personal information with data brokers, marketing agencies, or unauthorized third parties.',
      ],
    },
    {
      heading: '5. Service providers and data processors',
      paragraphs: [
        'Contact Form Processing: Inquiries submitted through our contact form are routed securely via Web3Forms directly to our corporate email inbox. Web3Forms acts as a data processor solely for relaying form submissions.',
        'Content Delivery and Hosting: elucidsoft.com is served across global edge networks to ensure secure, low-latency static delivery. Edge network providers process incoming HTTP requests to route web traffic and protect service availability.',
      ],
    },
    {
      heading: '6. Data retention and security',
      paragraphs: [
        'We retain correspondence records only for as long as necessary to address your inquiry, fulfill legitimate business needs, or comply with applicable legal and statutory recordkeeping obligations.',
        'Technical server access logs are maintained on short rotation schedules and automatically purged.',
        'We implement appropriate administrative and technical security measures, including modern Transport Layer Security (TLS/HTTPS) encryption for all web and form traffic in transit, to protect your information against unauthorized access, loss, or alteration.',
      ],
    },
    {
      heading: '7. Your legal privacy rights',
      paragraphs: [
        'Depending on your location, including under the Virginia Consumer Data Protection Act (VCDPA), the European Union General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA/CPRA), you may have specific statutory rights regarding your personal information.',
        'These rights may include the right to access personal data we hold about you, request correction of inaccurate data, request deletion of your information, or obtain a portable copy of your data.',
        'To exercise any applicable statutory privacy rights, please submit an inquiry through our contact form with the subject line "Privacy Rights Request". We will verify and process your request within the timeframe required by applicable law.',
      ],
    },
    {
      heading: '8. Commercial SaaS privacy policies',
      paragraphs: [
        'Customer data processed within Upstat, cloudlayer.io, or ActLume is governed by each platform\'s dedicated privacy documentation and customer data protection agreements:',
      ],
      productLinks: true,
    },
    {
      heading: '9. Governing law and policy updates',
      paragraphs: [
        'Elucidsoft LLC is established in Virginia, United States. This Privacy Policy is governed by the laws of the Commonwealth of Virginia and applicable United States federal law.',
        'We may update this Privacy Policy periodically to reflect changes in our practices or statutory requirements. Any revisions will be published directly on this page with an updated modification notice.',
      ],
    },
  ],

  termsTitle: 'Terms of use',
  termsMetaDescription:
    'Terms of use for elucidsoft.com: informational scope, commercial SaaS separation, open-source software licensing, intellectual property, and governing law.',
  termsIntro:
    'These Terms of Use constitute a binding legal agreement between you and Elucidsoft LLC governing your access to and use of elucidsoft.com. Please review these terms carefully before browsing our website.',
  termsBody: [
    {
      heading: '1. Acceptance and informational scope',
      paragraphs: [
        'By accessing or using elucidsoft.com, you agree to comply with and be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, you must not access or use the website.',
        'elucidsoft.com is an informational corporate website established to provide verified corporate records, announcements, and architectural documentation regarding Elucidsoft LLC and its software holdings. This website does not directly host user accounts, billing portals, or commercial transaction processing.',
      ],
    },
    {
      heading: '2. Commercial SaaS services separation',
      paragraphs: [
        'Elucidsoft operates commercial software platforms under registered trade names, including Upstat (upstat.io), cloudlayer.io (cloudlayer.io), and ActLume (actlume.com). Each commercial service is governed by its own independent Terms of Service, Service Level Agreements (SLAs), and customer subscription agreements.',
        'Accessing elucidsoft.com does not grant a commercial SaaS license, establish a service level agreement, or create a customer subscriber relationship with any commercial product line.',
      ],
      productLinks: true,
    },
    {
      heading: '3. Open-source software licensing',
      paragraphs: [
        'Elucidsoft funds, develops, and publishes open-source software projects, including the WarpKit frontend framework, the Ori systems programming language, the ori-term GPU terminal emulator, and the OriJS backend framework.',
        'All open-source source code, package distributions, and binaries are released under permissive open-source licenses (specifically MIT or dual MIT/Apache-2.0). Your rights to inspect, fork, compile, modify, and distribute open-source software are governed exclusively by the applicable license file in each project\'s repository.',
        'Nothing in these website Terms of Use restricts, supersedes, or modifies any rights granted under open-source software licenses for code published in those public repositories.',
      ],
    },
    {
      heading: '4. Intellectual property and trademarks',
      paragraphs: [
        'All content, design assets, typography, layout structures, graphics, and text prose published on elucidsoft.com—including the Elucidsoft name, corporate logo mark, and distinctive branding—are the exclusive intellectual property of Elucidsoft LLC.',
        'You may not copy, reproduce, distribute, modify, create derivative works of, or publicly display corporate branding assets from this website without prior written permission from Elucidsoft LLC, except as permitted under statutory fair use doctrine.',
      ],
    },
    {
      heading: '5. Permitted use and prohibited conduct',
      paragraphs: [
        'You agree to use elucidsoft.com only for lawful informational purposes in accordance with these Terms. When accessing the website, you agree not to:',
        'Engage in unauthorized security probing, vulnerability scanning, penetration testing, or denial-of-service attacks against our servers or network infrastructure.',
        'Transmit malicious software, viruses, automated spam payloads, or unlawful content through corporate contact forms.',
        'Scrape, crawl, or harvest data from this website using aggressive automated bots that impair server performance or circumvent rate limiting.',
        'Misrepresent your identity, affiliation, or authority when submitting communications through our contact channels.',
      ],
    },
    {
      heading: '6. Disclaimer of warranties',
      paragraphs: [
        'Information on elucidsoft.com is provided on an "as is" and "as available" basis without warranties of any kind, whether express, implied, statutory, or otherwise.',
        'While we strive to keep version numbers, release stages, and technical specifications accurate, Elucidsoft LLC makes no representations or warranties regarding the completeness, reliability, or accuracy of the information published on this website.',
        'Product roadmaps, release milestones, and architecture descriptions reflect current engineering plans and are subject to change without notice.',
      ],
    },
    {
      heading: '7. Limitation of liability',
      paragraphs: [
        'To the maximum extent permitted by applicable law, Elucidsoft LLC, its founder, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your access to, use of, or inability to access this website.',
        'In no event shall our total aggregate liability arising from or related to your use of this informational website exceed one hundred United States dollars ($100 USD).',
      ],
    },
    {
      heading: '8. External links and third-party resources',
      paragraphs: [
        'This website contains links to external platforms, including GitHub repositories, package registries (npm), personal portfolio sites, and external documentation resources. These links are provided solely for convenience and reference.',
        'Elucidsoft LLC does not control, endorse, or assume responsibility for the content, privacy policies, or practices of any third-party websites or services.',
      ],
    },
    {
      heading: '9. Indemnification',
      paragraphs: [
        'You agree to defend, indemnify, and hold harmless Elucidsoft LLC and its officers, directors, and agents from and against any third-party claims, liabilities, damages, judgments, awards, losses, costs, or expenses (including reasonable legal fees) arising out of or relating to your violation of these Terms of Use or your misuse of the website.',
      ],
    },
    {
      heading: '10. Governing law and dispute resolution',
      paragraphs: [
        'These Terms of Use and any dispute or claim arising out of or related to them shall be governed by and construed in accordance with the laws of the Commonwealth of Virginia, United States, without giving effect to any choice or conflict of law provision.',
        'Any legal action, suit, or proceeding arising out of or related to these Terms or elucidsoft.com shall be instituted exclusively in the state or federal courts located in the Commonwealth of Virginia.',
      ],
    },
    {
      heading: '11. Severability and entire agreement',
      paragraphs: [
        'If any provision of these Terms of Use is determined by a court of competent jurisdiction to be invalid, unlawful, or unenforceable, such provision shall be modified to the minimum extent necessary or severed, and the remaining provisions will continue in full force and effect.',
        'These Terms of Use, together with our Privacy Policy, constitute the entire agreement between you and Elucidsoft LLC regarding your use of elucidsoft.com.',
      ],
    },
    {
      heading: '12. Revisions and inquiries',
      paragraphs: [
        'We reserve the right to revise and update these Terms of Use at any time. Changes become effective immediately upon publication to this page. Your continued use of the website following the publication of revised Terms signifies your acceptance of the revisions.',
        'For inquiries concerning these Terms of Use, please contact us through our corporate contact form.',
      ],
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// Barrel
// ---------------------------------------------------------------------------

export const COPY = {
  SITE,
  HOME,
  PORTFOLIO,
  PRODUCTS,
  OPEN_SOURCE,
  ABOUT,
  CONTACT,
  NEWS,
  FACTS,
  FOOTER,
  NOT_FOUND,
  LEGAL,
} as const;

/** Prose for one product, keyed by the slug used in portfolio.ts. */
export type ProductCopy = (typeof PRODUCTS)[keyof typeof PRODUCTS];
