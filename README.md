# elucidsoft.com

Corporate umbrella site for **Elucidsoft LLC**, the Virginia company behind Upstat, cloudlayer.io, WarpKit, Ori, ori-term and OriJS.

Astro 5 + Svelte 5 islands, static output, no CSS framework.

```bash
bun install
bun run dev        # http://localhost:4325
bun run build      # -> dist/
bun run preview
```

## Why this site exists

The four open-source projects were credited on their own sites as *"A project by upstat.io"*, which told every crawler that an incident-management SaaS was the parent of a programming language and a terminal emulator. This site is the parent record: it publishes an `Organization` node with a `subOrganization` entry per product, and each product page points `parentOrganization` back at it.

`MIGRATION.md` is the work order for updating the four project repositories to match. None of it has been applied.

## Layout

```
src/data/company.ts      Entity facts. Address and legal wording transcribed
                         from the published Upstat legal pages.
src/data/portfolio.ts    The six products — FACTS ONLY (URLs, licences,
                         versions). No prose, no metrics.
src/data/copy.ts         Every human-readable string on the site.
src/lib/seo.ts           Title/description/canonical + build-time length checks.
src/lib/schema.ts        The Organization <-> product entity graph.
src/lib/llms.ts          Builds llms.txt, llms-full.txt and their HTML twins.
src/lib/news.ts          The only entry point for reading news entries.
```

**Facts and prose are separate on purpose.** Facts are verified against live hosts and repository metadata; prose is written and reviewed. They fail in different ways, so they live in different files.

**Nothing about a product is typed twice.** The home register, the six product pages, `/open-source/`, `/facts/`, the footer, `llms.txt`, the sitemap and the JSON-LD all derive from `portfolio.ts`.

**No star counts, no live metrics.** Anything that changes without a deploy would be published as fact and become false in the background.

## Adding a news article

Create `src/content/news/<name>.md`. The schema is `.strict()`, so an unknown frontmatter key fails the build rather than passing through silently.

```yaml
---
title: Something happened
slug: something-happened          # authored, so files can be renamed freely
summary: One or two sentences for the listing.
metaDescription: The search snippet. Enforced at 120-158 characters.
status: published                 # `draft` gets no route at all
datePublished: 2026-08-17
author: Eric Malamisura
category: Company
relatedArticles: []
---
```

A hero `image`, if present, must be exactly 1200×630 — it doubles as the OG card, and the schema rejects any other size.

Reading time is derived from the body, never authored. Commit and push; the whole site rebuilds.

## Machine-readable surfaces

`/llms.txt` · `/llms-full.txt` · `/llms.html` · `/llms-full.html` · `/news/<slug>.md` · `/news/rss.xml` · `/facts/` · `/sitemap-index.xml`

The `.html` twins exist because several engines will not index a bare `.txt`. All of them are generated from the content collection and the data modules, so a draft cannot leak into a feed and a licence cannot drift from the product page that states it.

## OG cards

```bash
bun scripts/og-images.mjs           # regenerate
bun scripts/og-images.mjs --check   # fail if any card is missing
```

Rendered as SVG and rasterised with sharp. Adding a page means adding it to `CARDS` in that script *and* to `OG_ROUTES` in `src/lib/seo.ts`.

## Deployment

GitHub Pages, via `.github/workflows/deploy.yml`, on every push to `main`. `public/CNAME` holds the domain.

CI fails the build on any `[seo]` length warning. Locally those stay warnings so copy can be edited without fighting the build.

> **Before launch:** `elucidsoft.com` has no DNS records yet, and `CONTACT.web3formsKey` in `src/data/company.ts` is a placeholder — the contact form will not deliver until a key issued to an Elucidsoft address replaces it.
