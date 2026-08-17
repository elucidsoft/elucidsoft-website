// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import markdownNegotiation from '@elucidsoft/astro-markdown-negotiation';

/**
 * Paged news routes declare `noindex, follow` in their <head>. Submitting them
 * in the sitemap would ask crawlers for the opposite of what the page says, so
 * they are filtered out here rather than being silently inconsistent.
 */
const PAGED_ROUTE = /\/page\/\d+\/?$/;

export default defineConfig({
  site: 'https://elucidsoft.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    svelte(),
    sitemap({
      filter: (page) => !PAGED_ROUTE.test(page),
    }),
    markdownNegotiation({
      metadata: 'header',
      generateStaticFiles: true,
      staticFilePattern: 'both',
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { dark: 'github-dark-default', light: 'github-light-default' },
      // Emits --shiki-light / --shiki-dark custom properties instead of baking
      // one theme in, so code blocks follow the site's data-theme switch.
      defaultColor: false,
      wrap: false,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
  devToolbar: { enabled: false },
});
