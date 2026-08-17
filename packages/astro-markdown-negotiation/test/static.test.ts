import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { handleStaticBuild } from '../src/static';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

describe('Static Build Companion File Generator', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'astro-static-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('generates twin and direct companion markdown files for static routes', async () => {
    // Setup mock dist directory with index.html and about/index.html
    const aboutDir = path.join(tempDir, 'about');
    await fs.mkdir(aboutDir, { recursive: true });

    const rootHtml = `
      <!doctype html>
      <html>
        <head><title>Home Page</title></head>
        <body><main><h1>Welcome Home</h1></main></body>
      </html>
    `;

    const aboutHtml = `
      <!doctype html>
      <html>
        <head><title>About Us</title></head>
        <body><main><h1>About Elucidsoft</h1><p>Our story.</p></main></head>
      </html>
    `;

    await fs.writeFile(path.join(tempDir, 'index.html'), rootHtml);
    await fs.writeFile(path.join(aboutDir, 'index.html'), aboutHtml);

    const result = await handleStaticBuild(tempDir, {
      staticFilePattern: 'both',
      metadata: 'none',
      injectAlternateLink: true,
    });

    expect(result.count).toBeGreaterThanOrEqual(3);

    // Check dist/index.md
    const rootMd = await fs.readFile(path.join(tempDir, 'index.md'), 'utf-8');
    expect(rootMd).toContain('# Welcome Home');

    // Check dist/about/index.md
    const aboutTwinMd = await fs.readFile(path.join(aboutDir, 'index.md'), 'utf-8');
    expect(aboutTwinMd).toContain('# About Elucidsoft');

    // Check dist/about.md
    const aboutDirectMd = await fs.readFile(path.join(tempDir, 'about.md'), 'utf-8');
    expect(aboutDirectMd).toContain('# About Elucidsoft');

    // Check injected link in HTML
    const updatedRootHtml = await fs.readFile(path.join(tempDir, 'index.html'), 'utf-8');
    expect(updatedRootHtml).toContain('<link rel="alternate" type="text/markdown" href="/index.md">');
  });
});
