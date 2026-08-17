import type { AstroIntegration } from 'astro';
import type { MarkdownNegotiationOptions } from './types';
import { handleStaticBuild } from './static';
import path from 'path';
import { fileURLToPath } from 'url';

const PKG_NAME = '@elucidsoft/astro-markdown-negotiation';

/**
 * Creates the Astro Markdown Negotiation integration.
 *
 * Automatically converts HTML to Markdown for HTTP requests with `Accept: text/markdown`,
 * and optionally generates companion `.md` files for static builds.
 */
export function markdownNegotiation(options: MarkdownNegotiationOptions = {}): AstroIntegration {
  return {
    name: PKG_NAME,
    hooks: {
      'astro:config:setup': ({ addMiddleware, updateConfig, logger }) => {
        // Resolve middleware entrypoint
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        const middlewarePath = path.resolve(currentDir, './middleware.ts');

        // Extract serializable options for the virtual module
        const serializableOptions: Partial<MarkdownNegotiationOptions> = {
          ...options,
          // Remove non-serializable functions from virtual module payload
          excludeRoutes: Array.isArray(options.excludeRoutes)
            ? options.excludeRoutes.filter((r): r is string => typeof r === 'string')
            : undefined,
          transform: undefined,
        };

        // Inject Vite virtual module plugin to pass config to middleware
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'vite-plugin-astro-markdown-negotiation-config',
                resolveId(id) {
                  if (id === 'virtual:astro-markdown-negotiation/config') {
                    return '\0' + id;
                  }
                },
                load(id) {
                  if (id === '\0virtual:astro-markdown-negotiation/config') {
                    return `export const options = ${JSON.stringify(serializableOptions)};`;
                  }
                },
              },
            ],
          },
        });

        // Register the middleware in Astro pipeline
        try {
          addMiddleware({
            entrypoint: middlewarePath,
            order: 'post',
          });
          logger.info('Astro Markdown Negotiation middleware registered.');
        } catch (e) {
          logger.warn(`Could not automatically register middleware entrypoint: ${e}`);
        }
      },

      'astro:build:done': async ({ dir, logger }) => {
        if (options.generateStaticFiles !== false) {
          logger.info('Generating static Markdown files for content negotiation...');
          await handleStaticBuild(dir, options, logger);
        }
      },
    },
  };
}

export default markdownNegotiation;
export * from './types';
export * from './converter';
export * from './negotiation';
export * from './middleware';
export * from './static';
export * from './edge';
