# CLAUDE.md — elucidsoft.com

Rules for working in this repo. These are decisions already made. Do not relitigate them, and do not quietly drift from them.

---

## 1. Copy — HARD RULE

**Only a Sonnet subagent writes copy. Period.**

Every human-readable string on this site — headlines, leads, body prose, product descriptions, button labels, form labels, status messages, meta titles, meta descriptions, legal text, news articles — is written by a **Sonnet** subagent via the Agent tool with `model: "sonnet"`.

Opus does not write copy. Fable does not write copy. No exceptions, not even for a single word, not even for a placeholder, not even when it seems faster.

- All copy lives in `src/data/copy.ts` and `src/content/news/*.md`.
- Components and pages read strings from `COPY.*`. Never hard-code prose in a `.astro` or `.svelte` file.
- If a page needs a new string, extend the brief and send it to a Sonnet subagent. Do not write it inline "temporarily".
- Programmatic labels derived from data (`All ${PRODUCTS.length} products`) are code, not copy. Actual sentences are copy.

## 2. This is a corporate homepage, not a portfolio or a blog

The site must read as **a company's own site**. It must not resemble `/home/eric/projects/eric-malamisura-portfolio`, which is the owner's personal site and uses: Playfair Display + Source Serif on warm paper, a dot/line grid background, dot leaders, monospace labels, a large editorial display serif, and a single centred column.

Specific traps already fallen into once — do not repeat:

- **No text-only portfolio lists.** Real corporate umbrella sites (Bending Spoons, Tiny, IAC) show the portfolio as a **grid of brand logos and cards with imagery**, not as a ruled text register with dot leaders.
- **No dot leaders.** That is a table-of-contents device and reads editorial.
- **No background grid, dot field, or paper texture.**
- **Monospace is for data only** — versions, licences, dates, code. Not nav, not body, not headings, not footer prose.
- **The page needs actual visuals.** A page made entirely of type and hairlines reads as a blog. Corporate homepages carry product cards, brand marks, and screenshots.
- **The hero needs CTAs.** Primary and secondary, above the fold.

## 3. Facts vs prose are separate files

- `src/data/portfolio.ts` — **facts only**: URLs, licences, versions, packages, stage, category. No prose.
- `src/data/copy.ts` — **prose only**. No URLs, no version numbers.
- `src/data/company.ts` — entity facts.

They are joined by `slug`. Facts are verified against live hosts; prose is written and reviewed. Different failure modes, different files.

## 4. Never publish anything that changes without a deploy

No GitHub star counts. No download counts. No "trusted by N teams". No live metrics of any kind. A static page states them as fact and they become false in the background.

## 5. No mailing address, and no legal-structure boilerplate

**No street address anywhere** — not in the footer, `/contact/`, `/facts/`, the legal pages, or JSON-LD. `postalAddress()` in `src/lib/schema.ts` emits `addressRegion` and `addressCountry` only. Written notice routes through the contact form.

This has had to be fixed twice: the first pass removed it from the components but left it embedded in prose inside `copy.ts`. **Grep for it after any copy change:**

```bash
grep -rn "Jefferson Davis\|111-1054\|22554\|Stafford" src/ public/
```

**No legal-structure language either.** The client: *"You don't need to advertise it's a limited liability company, nobody cares."*

- Banned from prose and from rendered labels: "limited liability company", "a Virginia limited liability company", "legal entity", "privately held", "entity type", "registered record".
- `company.ts` deliberately has **no** `entityType` and **no** `entityStatement` field, so nothing can render them.
- **Keep the name "Elucidsoft LLC"** wherever the company is named. That is its name, not a claim about its structure. Do not shorten it to "Elucidsoft" in legal or footer contexts.
- "Based in Virginia" is fine and preferred. Governing law belongs in the legal pages' prose, nowhere else.

## 6. Links must be live-verified

Every outbound URL is probed before it ships. Known traps:

- `orijs.dev` is **dead** — the live site is `orijs.org`. (The `orijs-website` repo still has the wrong value in its own config.)
- `warpkit.dev` belongs to **an unrelated company**; `warpkit.io` is a parked registrar page. Ours is `warpkit.org`.
- `cloudlayer.io` requires a **trailing slash** (`trailingSlash: 'always'`); `upstat.io` uses **bare paths**. Getting this wrong costs a redirect hop on every link.
- OriJS is **not published to npm**. Only WarpKit's eight `@warpkit/*` packages are.
- These GitHub `/releases` tabs 404 (no releases published): `ori-lang`, `ori-term`.

Re-run the audit after touching `portfolio.ts`:
```bash
bun run build
grep -rhoE 'https?://[^"<) ]+' dist/ | sort -u | while read -r u; do
  c=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 "$u"); [ "$c" = 200 ] || echo "$c $u"; done
```

## 7. The entity graph is the point of the site

`src/lib/schema.ts` publishes `Organization` with one `subOrganization` per product; every product page publishes `parentOrganization` pointing back at `ORG_ID`. **The edges must stay reciprocal.** This exists because the four OSS projects were credited as "a project by upstat.io", which told crawlers an incident-management SaaS was the parent of a programming language.

Do not rename the `upstat-io` GitHub organisation — see `MIGRATION.md` for what it would break.

## 8. Stack

Astro 5 + Svelte 5 islands, `output: 'static'`, `trailingSlash: 'always'`, **no Tailwind** — hand-written CSS with custom properties in `src/styles/tokens.css` and `global.css`.

- Typography: IBM Plex Sans (display, text, UI) + IBM Plex Mono (data only). One family, weight carries hierarchy.
- Brand gradient `#35C4EF → #7C8CF5 → #A25CF7`, sampled from the logo artwork. It appears in the mark, in section rules, and in the active-row fill. **Never as a background wash.**
- The logo should be rendered large. `Mark.astro` defaults to `variant="tight"`, which crops the viewBox to the ink extent so `size` means the width actually drawn.

## 9. Accessibility and quality gates — do not regress

- axe: **0 violations** on every page, in both themes.
- Every text token clears **4.5:1** against the page ground in both themes. Contrast is why the muted ramp is spaced by ratio (15.8 / 8.8 / 6.1 / 4.7), not by even lightness.
- Lighthouse: SEO 100, Accessibility 100, Best Practices 100.
- `bunx astro check` — 0 errors, 0 warnings.
- Build must emit **no `[seo]` warnings**. Titles 30–65 chars, descriptions 120–158. CI fails on any warning; locally they stay warnings.

## 10. News system

- `src/content.config.ts` is `.strict()` — an unknown frontmatter key **fails the build**. Keep it that way.
- `status: draft` gets **no route at all**, and cannot appear in RSS, `llms.txt`, the sitemap, or any listing. Everything reads through `getPublished()` in `src/lib/news.ts`. Verify with a canary draft after changing any listing surface.
- Reading time is **derived**, never authored.
- `/news/page/1/` must never exist — it would duplicate the index.
- Hero images must be exactly 1200×630; they double as the OG card and the schema enforces it.

## 11. Anti-AI-slop — enforced on all copy briefs

Banned words: delve, revolutionize, game-changer, seamless, cutting-edge, robust, leverage (verb), empower, unlock, elevate, transform, harness, supercharge, effortless, best-in-class, world-class, industry-leading, trusted by thousands, in today's fast-paced world, at the intersection of, the future of, craft/crafted, solutions, suite.

Banned constructions: `It's not just X, it's Y` · rule-of-three adjective stacks · sentence fragments for punch · rhetorical-question headings · em dashes for dramatic pause · **lists of exactly five items** (there are six products — say six) · headlines that are a list or a count.

Never soften a product's alpha status. **WarpKit is the only alpha product described as running in production**, because it genuinely is (inside Upstat and cloudlayer.io). No customer names, testimonials, awards, funding, team size, or metrics — none exist.

## 12. Before launch

- `elucidsoft.com` has **no DNS records**. The build targets it; `public/CNAME` is ready.
- `CONTACT.web3formsKey` in `src/data/company.ts` is a **placeholder**. The contact form will not deliver until a key issued to an Elucidsoft address replaces it. Do not reuse the personal portfolio's key.

## Commands

```bash
bun run dev          # localhost:4325
bun run build        # checks OG cards, then builds
bun run og           # regenerate OG cards (add a page to CARDS *and* OG_ROUTES)
bunx astro check     # types
```
