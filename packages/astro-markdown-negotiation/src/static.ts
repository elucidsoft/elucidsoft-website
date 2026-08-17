import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AstroIntegrationLogger } from 'astro';
import { htmlToMarkdown } from './converter';
import type { MarkdownNegotiationOptions } from './types';

/**
 * Finds all HTML files recursively in a directory.
 */
async function getHtmlFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await getHtmlFiles(fullPath);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Handles static build companion file generation during `astro:build:done`.
 */
export async function handleStaticBuild(
  outDir: URL | string,
  options: MarkdownNegotiationOptions = {},
  logger?: AstroIntegrationLogger
): Promise<{ generatedFiles: string[]; count: number }> {
  const rawPath = typeof outDir === 'string' ? outDir : fileURLToPath(outDir);
  const distPath = path.resolve(rawPath);
  const pattern = options.staticFilePattern || 'both';
  const generatedFiles: string[] = [];

  try {
    const htmlFiles = await getHtmlFiles(distPath);

    for (const htmlFile of htmlFiles) {
      const relPath = path.relative(distPath, htmlFile);
      const rawRoute = '/' + relPath.replace(/\\/g, '/').replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '');
      const routePath = rawRoute === '' ? '/' : rawRoute;

      // Check route exclusion
      if (options.excludeRoutes) {
        if (typeof options.excludeRoutes === 'function' && options.excludeRoutes(routePath)) {
          continue;
        }
        if (Array.isArray(options.excludeRoutes)) {
          let skip = false;
          for (const p of options.excludeRoutes) {
            if (typeof p === 'string' && (routePath === p || routePath.startsWith(p))) {
              skip = true;
              break;
            }
            if (p instanceof RegExp && p.test(routePath)) {
              skip = true;
              break;
            }
          }
          if (skip) continue;
        }
      }

      const htmlContent = await fs.readFile(htmlFile, 'utf-8');

      // Convert HTML to Markdown
      const markdown = await htmlToMarkdown(htmlContent, {
        ...options,
        baseUrl: options.baseUrl,
      });

      // Write companion markdown files according to staticFilePattern
      const dirname = path.resolve(path.dirname(htmlFile));
      const basename = path.basename(htmlFile);

      if (pattern === 'twin' || pattern === 'both') {
        // e.g. dist/about/index.html -> dist/about/index.md
        const twinMdPath = path.join(dirname, basename.replace(/\.html$/, '.md'));
        await fs.writeFile(twinMdPath, markdown, 'utf-8');
        generatedFiles.push(twinMdPath);
      }

      if (pattern === 'direct' || pattern === 'both') {
        // e.g. dist/about/index.html -> dist/about.md (only for subdirectories inside distPath)
        if (basename === 'index.html' && dirname !== distPath) {
          const directMdPath = `${dirname}.md`;
          await fs.writeFile(directMdPath, markdown, 'utf-8');
          generatedFiles.push(directMdPath);
        } else if (basename !== 'index.html') {
          const directMdPath = path.join(dirname, basename.replace(/\.html$/, '.md'));
          if (!generatedFiles.includes(directMdPath)) {
            await fs.writeFile(directMdPath, markdown, 'utf-8');
            generatedFiles.push(directMdPath);
          }
        }
      }

      // Inject alternate link in HTML head if enabled
      if (options.injectAlternateLink !== false) {
        const mdLinkHref = routePath === '/' ? '/index.md' : `${routePath.replace(/\/$/, '')}.md`;
        const linkTag = `<link rel="alternate" type="text/markdown" href="${mdLinkHref}">`;

        if (!htmlContent.includes('type="text/markdown"') && htmlContent.includes('</head>')) {
          const updatedHtml = htmlContent.replace('</head>', `  ${linkTag}\n</head>`);
          await fs.writeFile(htmlFile, updatedHtml, 'utf-8');
        }
      }
    }

    if (logger) {
      logger.info(`Generated ${generatedFiles.length} Markdown documents for content negotiation.`);
    }

    return { generatedFiles, count: generatedFiles.length };
  } catch (err) {
    if (logger) {
      logger.error(`Error generating static Markdown files: ${err instanceof Error ? err.message : String(err)}`);
    }
    return { generatedFiles: [], count: 0 };
  }
}
