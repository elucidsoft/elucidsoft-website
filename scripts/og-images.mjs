/**
 * Build-time OG card generation.
 *
 * Renders one 1200x630 card per route as SVG, then rasterises with sharp if it
 * is available. SVG rather than a headless browser because the card is pure
 * typography and vector: spinning up Chromium to draw six rectangles and two
 * lines of text is minutes of CI time for something resvg does in milliseconds.
 *
 * Run with `--check` in CI to fail when a card is missing rather than silently
 * shipping a link preview that falls back to the default.
 *
 * Fonts are referenced by family name and the rasteriser resolves them from the
 * system. Where the display serif is unavailable the card falls back to a
 * generic serif, which is a visual downgrade rather than a broken image.
 */

import { mkdir, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(here, '..', 'public', 'og');

const WIDTH = 1200;
const HEIGHT = 630;

/** Kept in step with src/data/portfolio.ts and the page routes. */
const CARDS = [
  { name: 'default', eyebrow: 'Elucidsoft LLC', title: 'Seven products, two divisions, one company' },
  { name: 'portfolio', eyebrow: 'Portfolio', title: 'The portfolio' },
  { name: 'open-source', eyebrow: 'Open source', title: 'Open source projects' },
  { name: 'about', eyebrow: 'About', title: 'About Elucidsoft' },
  { name: 'contact', eyebrow: 'Contact', title: 'Contact' },
  { name: 'facts', eyebrow: 'Facts', title: 'Facts' },
  { name: 'news', eyebrow: 'News', title: 'News' },
  { name: 'upstat', eyebrow: 'Portfolio', title: 'Upstat' },
  { name: 'cloudlayer', eyebrow: 'Portfolio', title: 'cloudlayer.io' },
  { name: 'actlume', eyebrow: 'Portfolio', title: 'ActLume' },
  { name: 'warpkit', eyebrow: 'Portfolio', title: 'WarpKit' },
  { name: 'ori-lang', eyebrow: 'Portfolio', title: 'Ori' },
  { name: 'ori-term', eyebrow: 'Portfolio', title: 'ori-term' },
  { name: 'orijs', eyebrow: 'Portfolio', title: 'OriJS' },
];

/** Escapes the five XML predefined entities. */
const esc = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/**
 * Wraps a title across at most three lines.
 *
 * Measured by character count against a per-line budget derived from the font
 * size — approximate, but the titles are short and the budget is conservative,
 * so a line never overruns the safe area.
 */
function wrap(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function card({ eyebrow, title }) {
  const size = title.length > 34 ? 62 : 78;
  const lines = wrap(title, title.length > 34 ? 30 : 24);
  const startY = 330 - (lines.length - 1) * (size * 0.58);

  const tspans = lines
    .map(
      (line, i) =>
        `<tspan x="90" y="${Math.round(startY + i * size * 1.16)}">${esc(line)}</tspan>`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#35C4EF"/>
      <stop offset="0.5" stop-color="#7C8CF5"/>
      <stop offset="1" stop-color="#A25CF7"/>
    </linearGradient>
    <linearGradient id="markgrad" x1="0" y1="142" x2="0" y2="257" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#35C4EF"/>
      <stop offset="0.5" stop-color="#7C8CF5"/>
      <stop offset="1" stop-color="#A25CF7"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0B1020"/>

  <!-- the mark, scaled from its 400-unit box into the top-left corner -->
  <g transform="translate(90 74) scale(0.18)">
    <g stroke="url(#markgrad)" stroke-width="23" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M109.5 153h48"/><path d="M109.5 200h48"/><path d="M109.5 246h48"/>
      <path d="M298 153H234v47h64v46h-64"/>
    </g>
  </g>

  <text x="180" y="118" font-family="IBM Plex Mono, monospace" font-size="20"
        letter-spacing="2.8" fill="#6E7794">${esc(eyebrow.toUpperCase())}</text>

  <text font-family="Newsreader, Georgia, serif" font-size="${size}" fill="#E8EAF2"
        letter-spacing="-1.6">${tspans}</text>

  <rect x="90" y="392" width="132" height="5" rx="2.5" fill="url(#brand)"/>

  <text x="90" y="556" font-family="IBM Plex Mono, monospace" font-size="19"
        letter-spacing="2.4" fill="#4A5270">ELUCIDSOFT LLC · STAFFORD, VIRGINIA</text>
  <text x="1110" y="556" text-anchor="end" font-family="IBM Plex Mono, monospace"
        font-size="19" letter-spacing="2.4" fill="#4A5270">ELUCIDSOFT.COM</text>
</svg>`;
}

const checkOnly = process.argv.includes('--check');

await mkdir(OUT_DIR, { recursive: true });

let sharp = null;
if (!checkOnly) {
  try {
    ({ default: sharp } = await import('sharp'));
  } catch {
    console.warn(
      '[og] sharp not installed — writing .svg only.\n' +
        '     Social platforms will not render SVG previews; run `bun add -d sharp` and re-run.',
    );
  }
}

let missing = 0;

for (const spec of CARDS) {
  const pngPath = join(OUT_DIR, `${spec.name}.png`);

  if (checkOnly) {
    try {
      await access(pngPath);
    } catch {
      console.error(`[og] missing card: og/${spec.name}.png`);
      missing += 1;
    }
    continue;
  }

  const svg = card(spec);
  await writeFile(join(OUT_DIR, `${spec.name}.svg`), svg, 'utf8');

  if (sharp) {
    await sharp(Buffer.from(svg)).png().toFile(pngPath);
  }
}

if (checkOnly) {
  if (missing > 0) {
    console.error(`[og] ${missing} card(s) missing — run \`bun scripts/og-images.mjs\``);
    process.exit(1);
  }
  console.log(`[og] all ${CARDS.length} cards present`);
} else {
  console.log(`[og] wrote ${CARDS.length} cards to public/og/`);
}
