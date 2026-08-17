# Attribution migration: `upstat.io` → Elucidsoft LLC

The four open-source project sites currently credit **"A project by upstat.io"**. That is wrong in a way that costs real SEO: it tells crawlers and answer engines that an incident-management SaaS is the parent of a programming language and a terminal emulator.

This site is the parent record. These are the edits needed in the *other* repositories to point at it. Nothing in this checklist has been applied — it is a work order, not a changelog.

Every file path and line number below was verified against the working copies under `/home/eric/projects/` at the time of writing.

---

## 1. Visible footer attribution

Replace `A project by upstat.io` with an Elucidsoft LLC credit linking to `https://elucidsoft.com`.

| Repository | File | Line |
|---|---|---|
| `orijs-website` | `src/components/Footer.svelte` | 35 |
| `warpkit-website` | `src/components/Footer.svelte` | 40 |
| `ori_lang/website_repo` | `src/components/common/Footer.astro` | 14 |
| `ori_term/website_repo` | `src/components/Footer.svelte` | 35 |

Rename the CSS classes alongside the copy, or the markup will keep saying `upstat` after the text no longer does:

- `orijs-website/src/components/Footer.svelte` — `.upstat` at lines 134, 139, 144
- `ori_lang/website_repo/src/components/common/Footer.astro` — `.upstat-link`

## 2. Structured-data publisher — highest SEO impact

Both files declare `publisher: { "@type": "Organization", "name": "Upstat", "url": "https://upstat.io" }`. This is the machine-readable version of the same wrong claim, and it is the one that actually feeds knowledge graphs.

| Repository | File | Lines |
|---|---|---|
| `orijs-website` | `src/layouts/Docs.astro` | 27–28 |
| `warpkit-website` | `src/layouts/Docs.astro` | 29–30 |

Change `name` to `Elucidsoft LLC` and `url` to `https://elucidsoft.com`.

## 3. Add the reciprocal edge

This site publishes `Organization` with a `subOrganization` entry for each of the six products, each carrying a stable `@id`. The edge only resolves as a graph if the child sites point back.

Add to the software/project JSON-LD on **all four** project sites:

```json
"parentOrganization": { "@id": "https://elucidsoft.com/#organization" }
```

Worth doing on `upstat.io` and `cloudlayer.io` as well — neither currently declares a parent, so the two commercial products are also unattributed.

## 4. Fix a live bug while you are in there

`orijs-website` publishes canonicals and a sitemap pointing at **`orijs.dev`, which does not resolve**. The live site is `orijs.org`. Every canonical on that site currently names a dead host.

- `orijs-website/astro.config.mjs:110` — `site: 'https://orijs.dev'` → `https://orijs.org`
- `orijs-website/public/robots.txt:4` — `Sitemap: https://orijs.dev/sitemap-index.xml` → `orijs.org`

This is independent of the branding work and is costing indexing today.

## 5. Cross-promotion sections

Each project site has a "From the team" / "Other projects" card grid that links Upstat as a sibling:

- `orijs-website/src/pages/index.astro` — 261, 273, 275
- `warpkit-website/src/pages/index.astro` — 171, 183, 185
- `ori_lang/website_repo/src/pages/index.astro` — 76, 88, 90 (also carries "Built by the same team behind Ori Lang")
- `ori_term/website_repo/src/pages/index.astro` — 121, 133, 135

These should stay, reframed from "the same team" to the Elucidsoft portfolio, with a link to `https://elucidsoft.com/portfolio/`.

## 6. Copyright

| Repository | File | Current | Target |
|---|---|---|---|
| `warpkit` | `LICENSE:3` | `Copyright (c) 2026 Upstat` | `Copyright (c) 2026 Elucidsoft LLC` |
| `ori_term/term_repo` | `LICENSE:3` | `Copyright (c) 2026 elucidsoft llc` | casing → `Elucidsoft LLC` |
| `orijs` | `LICENSE:3` | `Copyright (c) 2024 OriJS Contributors` | leave as is |
| `ori_lang/compiler_repo` | `LICENSE-MIT:3` | `Copyright (c) 2025 Ori Contributors` | leave as is |

The two "Contributors" lines are conventional for community projects and do not misattribute ownership. Only WarpKit names Upstat as the copyright holder.

## 7. Prose in READMEs and docs

- `warpkit/README.md:3` — "built and used in production by [Upstat](https://upstat.io) and [cloudlayer.io](https://cloudlayer.io)". This one is *factually true* and worth keeping; it only needs the publisher framed as Elucidsoft LLC.
- `warpkit-website/CLAUDE.md:8` — "WarpKit is built by [Upstat]"
- `warpkit/CLAUDE.md:6` and `warpkit-website/CLAUDE.md:3,35` — repo references

---

## Do NOT rename the `upstat-io` GitHub organisation

Renaming it would break, at minimum:

- the `repository`, `homepage` and `bugs` fields in `warpkit/package.json` and all twelve `warpkit/packages/*/package.json`
- published npm metadata for the eight `@warpkit/*` packages
- `warpkit/packages/create-warpkit/src/index.ts:1200` — the URL baked into every scaffolded app
- `warpkit/SECURITY.md:11` — the security advisory URL
- `orijs-website/.github/workflows/deploy.yml:29` and `warpkit-website/.github/workflows/deploy.yml:29`, which check out `upstat-io/*` by name
- `warpkit/.github/workflows/notify-website.yml:16` — `gh api repos/upstat-io/warpkit-website/dispatches`
- the install one-liners in the `ori-lang` and `ori-term` READMEs, which curl from `raw.githubusercontent.com/upstat-io/...`

GitHub redirects renamed orgs, but package registries and shell one-liners already in circulation do not benefit reliably. The account name is infrastructure, not branding. `/open-source/` on this site states plainly that it predates the site and is not being renamed, so the mismatch is explained rather than hidden.

## Domains: leave these alone

- **`warpkit.dev` is not ours.** It serves a different company's "TypeScript SaaS Starter Kit". `warpkit.io` is a parked Cloudflare registrar page. The canonical site is **`warpkit.org`**.
- `orijs.org`, `ori-lang.com` and `oriterm.com` are correct and live.
