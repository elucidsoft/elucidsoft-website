import { parse, type DefaultTreeAdapterMap } from 'parse5';
import type { HtmlToMarkdownOptions, PageMetadata } from './types';

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];
type TextNode = DefaultTreeAdapterMap['textNode'];
type Document = DefaultTreeAdapterMap['document'];

/**
 * Common HTML entities decoder.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';

  const namedEntities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    ndash: '–',
    mdash: '—',
    lsquo: '‘',
    rsquo: '’',
    ldquo: '“',
    rdquo: '”',
    hellip: '…',
    bull: '•',
    copy: '©',
    reg: '®',
    trade: '™',
    euro: '€',
    pound: '£',
    yen: '¥',
    times: '×',
    divide: '÷',
    plusmn: '±',
    deg: '°',
    sect: '§',
    para: '¶',
    middot: '·',
    laquo: '«',
    raquo: '»',
    frac12: '½',
    frac14: '¼',
    frac34: '¾',
    cent: '¢',
    fnof: 'ƒ',
    tilde: '~',
  };

  let decoded = text
    .replace(/&([a-zA-Z]+);/g, (match, name) => namedEntities[name.toLowerCase()] ?? match)
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      const code = parseInt(hex, 16);
      return !isNaN(code) ? String.fromCodePoint(code) : match;
    })
    .replace(/&#([0-9]+);/g, (match, dec) => {
      const code = parseInt(dec, 10);
      return !isNaN(code) ? String.fromCodePoint(code) : match;
    });

  // Normalize non-breaking space \u00A0 to standard space
  decoded = decoded.replace(/\u00A0/g, ' ');

  return decoded;
}

function isElement(node: Node): node is Element {
  return 'tagName' in node && typeof (node as Element).tagName === 'string';
}

function isTextNode(node: Node): node is TextNode {
  return node.nodeName === '#text' && 'value' in node;
}

function getAttr(element: Element, name: string): string | null {
  if (!element.attrs) return null;
  const attr = element.attrs.find((a) => a.name.toLowerCase() === name.toLowerCase());
  return attr ? attr.value : null;
}

function getClassList(element: Element): string[] {
  const cls = getAttr(element, 'class');
  return cls ? cls.split(/\s+/).filter(Boolean) : [];
}

/**
 * Basic CSS selector matching for HTML AST elements.
 * Supports tag names, classes (.class), IDs (#id), attributes ([attr], [attr="val"]),
 * and compound selectors.
 */
export function matchesSelector(element: Element, selector: string): boolean {
  const sel = selector.trim();
  if (!sel) return false;

  // Handle multiple comma-separated selectors
  if (sel.includes(',')) {
    return sel.split(',').some((s) => matchesSelector(element, s));
  }

  // Handle tag, class, id, attribute
  const tag = element.tagName.toLowerCase();
  const classes = getClassList(element);
  const id = getAttr(element, 'id') || '';

  // Attribute selector [attr] or [attr="val"]
  const attrMatch = sel.match(/^\[([a-zA-Z0-9_-]+)(?:([*^$]?=)(["']?)(.*?)\3)?\]$/);
  if (attrMatch) {
    const attrName = attrMatch[1] ?? '';
    const operator = attrMatch[2] ?? '';
    const targetVal = attrMatch[4] ?? '';
    const actualVal = getAttr(element, attrName);

    if (actualVal === null) return false;
    if (!operator) return true; // [attr] exists

    if (operator === '=') return actualVal === targetVal;
    if (operator === '^=') return actualVal.startsWith(targetVal);
    if (operator === '$=') return actualVal.endsWith(targetVal);
    if (operator === '*=') return actualVal.includes(targetVal);
    return false;
  }

  // ID selector #my-id
  if (sel.startsWith('#')) {
    return id.toLowerCase() === sel.slice(1).toLowerCase();
  }

  // Class selector .my-class
  if (sel.startsWith('.')) {
    const targetClass = sel.slice(1).toLowerCase();
    return classes.some((c) => c.toLowerCase() === targetClass);
  }

  // Tag selector
  if (/^[a-zA-Z0-9_-]+$/.test(sel)) {
    return tag === sel.toLowerCase();
  }

  // Tag with class e.g. div.my-class
  const tagClassMatch = sel.match(/^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)$/);
  if (tagClassMatch) {
    const t = tagClassMatch[1] ?? '';
    const c = tagClassMatch[2] ?? '';
    return tag === t.toLowerCase() && classes.some((cl) => cl.toLowerCase() === c.toLowerCase());
  }

  return false;
}

/**
 * Searches a node tree recursively for elements matching a selector.
 */
export function findElements(root: Node, selector: string): Element[] {
  const matches: Element[] = [];

  function walk(node: Node) {
    if (isElement(node)) {
      if (matchesSelector(node, selector)) {
        matches.push(node);
      }
    }
    if ('childNodes' in node && Array.isArray(node.childNodes)) {
      for (const child of node.childNodes) {
        walk(child);
      }
    }
  }

  walk(root);
  return matches;
}

/**
 * Extracts page metadata from HTML document <head>.
 */
export function extractPageMetadata(document: Document, baseUrl?: string): PageMetadata {
  const metadata: PageMetadata = {};

  function walk(node: Node) {
    if (isElement(node)) {
      const tag = node.tagName.toLowerCase();

      if (tag === 'title') {
        const text = node.childNodes
          .filter(isTextNode)
          .map((n) => n.value)
          .join('')
          .trim();
        if (text && !metadata.title) {
          metadata.title = decodeHtmlEntities(text);
        }
      } else if (tag === 'meta') {
        const name = getAttr(node, 'name')?.toLowerCase();
        const property = getAttr(node, 'property')?.toLowerCase();
        const content = getAttr(node, 'content');

        if (content) {
          const decoded = decodeHtmlEntities(content.trim());
          if (name === 'description' || property === 'og:description') {
            if (!metadata.description) metadata.description = decoded;
          } else if (name === 'author' || property === 'article:author') {
            if (!metadata.author) metadata.author = decoded;
          } else if (name === 'keywords') {
            metadata.keywords = decoded.split(',').map((k) => k.trim()).filter(Boolean);
          } else if (property === 'og:title' && !metadata.title) {
            metadata.title = decoded;
          } else if (property === 'og:image') {
            metadata.ogImage = decoded;
          } else if (property === 'og:type') {
            metadata.ogType = decoded;
          } else if (property === 'og:site_name') {
            metadata.siteName = decoded;
          } else if (property === 'article:published_time' || name === 'date') {
            metadata.datePublished = decoded;
          } else if (property === 'article:modified_time') {
            metadata.dateModified = decoded;
          }
        }
      } else if (tag === 'link') {
        const rel = getAttr(node, 'rel')?.toLowerCase();
        const href = getAttr(node, 'href');
        if (rel === 'canonical' && href) {
          try {
            metadata.canonical = baseUrl ? new URL(href, baseUrl).href : href;
          } catch {
            metadata.canonical = href;
          }
        }
      }
    }

    if ('childNodes' in node && Array.isArray(node.childNodes)) {
      for (const child of node.childNodes) {
        walk(child);
      }
    }
  }

  walk(document);
  return metadata;
}

/**
 * Context during HTML to Markdown AST traversal.
 */
interface ConversionContext {
  options: HtmlToMarkdownOptions;
  excludeSet: string[];
  preserveSet: string[];
  inPre: boolean;
  inTable: boolean;
  listDepth: number;
  listIndexStack: number[];
  listTypeStack: ('ul' | 'ol')[];
  baseUrl?: string;
}

/**
 * Gets the raw text content of a node tree without formatting.
 */
function getNodeText(node: Node): string {
  if (isTextNode(node)) {
    return node.value;
  }
  if ('childNodes' in node && Array.isArray(node.childNodes)) {
    return node.childNodes.map(getNodeText).join('');
  }
  return '';
}

/**
 * Converts a table element into a GitHub Flavored Markdown table.
 */
function convertTable(tableNode: Element, context: ConversionContext): string {
  const rows: string[][] = [];
  const alignments: ('left' | 'center' | 'right' | '')[] = [];

  function collectRows(node: Node) {
    if (isElement(node)) {
      const tag = node.tagName.toLowerCase();
      if (tag === 'tr') {
        const rowCells: string[] = [];
        const cells = (node.childNodes || []).filter(
          (c): c is Element => isElement(c) && (c.tagName.toLowerCase() === 'th' || c.tagName.toLowerCase() === 'td')
        );

        cells.forEach((cell, idx) => {
          const align = (getAttr(cell, 'align') || '').toLowerCase();
          if (align === 'center' || align === 'right' || align === 'left') {
            alignments[idx] = align;
          } else if (!alignments[idx]) {
            alignments[idx] = '';
          }

          // Convert inner content of cell
          const cellContent = convertChildren(cell, { ...context, inTable: true })
            .trim()
            .replace(/\n+/g, ' ')
            .replace(/\|/g, '\\|');
          rowCells.push(cellContent || ' ');
        });

        if (rowCells.length > 0) {
          rows.push(rowCells);
        }
        return;
      }
    }

    if ('childNodes' in node && Array.isArray(node.childNodes)) {
      for (const child of node.childNodes) {
        collectRows(child);
      }
    }
  }

  collectRows(tableNode);

  if (rows.length === 0) return '';

  const maxCols = Math.max(...rows.map((r) => r.length), alignments.length);
  if (maxCols === 0) return '';

  // Pad all rows to maxCols
  const paddedRows = rows.map((r) => {
    const copy = [...r];
    while (copy.length < maxCols) copy.push(' ');
    return copy;
  });

  const headerRow = paddedRows[0] ?? [];
  const bodyRows = paddedRows.slice(1);

  const delimiterRow = Array.from({ length: maxCols }, (_, idx) => {
    const align = alignments[idx];
    if (align === 'center') return ':---:';
    if (align === 'right') return '---:';
    return '---';
  });

  const lines: string[] = [
    `| ${headerRow.join(' | ')} |`,
    `| ${delimiterRow.join(' | ')} |`,
    ...bodyRows.map((row) => `| ${row.join(' | ')} |`),
  ];

  return `\n\n${lines.join('\n')}\n\n`;
}

/**
 * Converts pre / code blocks, extracting language identifiers and preserving formatting.
 */
function convertPre(preNode: Element, context: ConversionContext): string {
  let language = '';
  const classList = getClassList(preNode);

  // Check language from pre class
  for (const cls of classList) {
    if (cls.startsWith('language-')) language = cls.replace('language-', '');
    else if (cls.startsWith('lang-')) language = cls.replace('lang-', '');
  }

  const dataLang =
    getAttr(preNode, 'data-language') ||
    getAttr(preNode, 'data-lang') ||
    getAttr(preNode, 'lang');
  if (dataLang) language = dataLang;

  // Look for inner <code> element
  const codeElement = (preNode.childNodes || []).find(
    (c): c is Element => isElement(c) && c.tagName.toLowerCase() === 'code'
  );

  if (codeElement) {
    const codeClasses = getClassList(codeElement);
    for (const cls of codeClasses) {
      if (cls.startsWith('language-')) language = cls.replace('language-', '');
      else if (cls.startsWith('lang-')) language = cls.replace('lang-', '');
    }
    const codeDataLang =
      getAttr(codeElement, 'data-language') ||
      getAttr(codeElement, 'data-lang') ||
      getAttr(codeElement, 'lang');
    if (codeDataLang) language = codeDataLang;
  }

  // Extract raw text, stripping span tags from syntax highlighters (e.g. Shiki, Prism)
  const rawCode = getNodeText(codeElement || preNode);
  const decodedCode = decodeHtmlEntities(rawCode).replace(/\r\n/g, '\n').replace(/^\n+|\n+$/g, '');

  if (context.options.codeBlockStyle === 'indented') {
    const indented = decodedCode
      .split('\n')
      .map((line) => `    ${line}`)
      .join('\n');
    return `\n\n${indented}\n\n`;
  }

  return `\n\n\`\`\`${language}\n${decodedCode}\n\`\`\`\n\n`;
}

/**
 * Converts child nodes of an element.
 */
function convertChildren(parent: Node, context: ConversionContext): string {
  if (!('childNodes' in parent) || !Array.isArray(parent.childNodes)) {
    return '';
  }

  let result = '';
  for (const child of parent.childNodes) {
    result += convertNode(child, context);
  }
  return result;
}

/**
 * Main recursive node-to-markdown converter.
 */
function convertNode(node: Node, context: ConversionContext): string {
  // Text node
  if (isTextNode(node)) {
    const text = node.value;
    if (context.inPre) {
      return text;
    }
    // In normal HTML text, collapse redundant spaces/tabs/newlines to a single space
    const cleaned = text.replace(/[\r\n\t ]+/g, ' ');
    return decodeHtmlEntities(cleaned);
  }

  // Comment or document type
  if (!isElement(node)) {
    return '';
  }

  const element = node as Element;
  const tag = element.tagName.toLowerCase();

  // Check exclusions
  const isPreserved = context.preserveSet.some((sel) => matchesSelector(element, sel));
  if (!isPreserved) {
    if (context.excludeSet.some((sel) => matchesSelector(element, sel))) {
      return '';
    }
  }

  // Special containers
  if (tag === 'pre') {
    return convertPre(element, context);
  }

  if (tag === 'table') {
    return convertTable(element, context);
  }

  // Headings
  if (/^h[1-6]$/.test(tag)) {
    const level = parseInt(tag[1] ?? '1', 10);
    const content = convertChildren(element, context).trim();
    if (!content) return '';

    if (context.options.headingStyle === 'setext' && (level === 1 || level === 2)) {
      const underline = level === 1 ? '='.repeat(content.length) : '-'.repeat(content.length);
      return `\n\n${content}\n${underline}\n\n`;
    }

    const hashes = '#'.repeat(level);
    return `\n\n${hashes} ${content}\n\n`;
  }

  // Paragraph
  if (tag === 'p') {
    const content = convertChildren(element, context).trim();
    return content ? `\n\n${content}\n\n` : '';
  }

  // Blockquote
  if (tag === 'blockquote') {
    const inner = convertChildren(element, context).trim();
    if (!inner) return '';
    const quoted = inner
      .split('\n')
      .map((line) => (line.trim() ? `> ${line}` : '>'))
      .join('\n');
    return `\n\n${quoted}\n\n`;
  }

  // Lists
  if (tag === 'ul' || tag === 'ol') {
    const isOrdered = tag === 'ol';
    const startAttr = getAttr(element, 'start');
    const startIndex = startAttr ? parseInt(startAttr, 10) || 1 : 1;

    const newContext: ConversionContext = {
      ...context,
      listDepth: context.listDepth + 1,
      listIndexStack: [...context.listIndexStack, startIndex],
      listTypeStack: [...context.listTypeStack, isOrdered ? 'ol' : 'ul'],
    };

    const content = convertChildren(element, newContext).trim();
    return content ? `\n\n${content}\n\n` : '';
  }

  // List Item
  if (tag === 'li') {
    const depth = Math.max(0, context.listDepth - 1);
    const indent = '  '.repeat(depth);
    const currentListType = context.listTypeStack[context.listTypeStack.length - 1] || 'ul';
    const currentIndex = context.listIndexStack[context.listIndexStack.length - 1] || 1;

    let marker = `${context.options.bulletMarker || '-'} `;
    if (currentListType === 'ol') {
      marker = `${currentIndex}. `;
      // Increment counter for next sibling
      context.listIndexStack[context.listIndexStack.length - 1] = currentIndex + 1;
    }

    // Check for task list checkboxes
    const inputChild = (element.childNodes || []).find(
      (c): c is Element => isElement(c) && c.tagName.toLowerCase() === 'input' && getAttr(c, 'type') === 'checkbox'
    );
    let taskPrefix = '';
    if (inputChild) {
      const isChecked = getAttr(inputChild, 'checked') !== null;
      taskPrefix = isChecked ? '[x] ' : '[ ] ';
    }

    const content = convertChildren(element, context).trim();
    const lines = content.split('\n');
    const firstLine = lines[0] ?? '';
    const remainingLines = lines.slice(1);

    const formattedFirstLine = `${indent}${marker}${taskPrefix}${firstLine}`;
    const formattedRemaining = remainingLines
      .map((line) => (line.trim() ? `${indent}  ${line}` : ''))
      .join('\n');

    return `\n${formattedFirstLine}${remainingLines.length > 0 ? `\n${formattedRemaining}` : ''}`;
  }

  // Inline Formatting
  if (tag === 'strong' || tag === 'b') {
    const content = convertChildren(element, context);
    const trimmed = content.trim();
    if (!trimmed) return content;
    const leadingSpace = content.startsWith(' ') ? ' ' : '';
    const trailingSpace = content.endsWith(' ') ? ' ' : '';
    return `${leadingSpace}**${trimmed}**${trailingSpace}`;
  }

  if (tag === 'em' || tag === 'i') {
    const content = convertChildren(element, context);
    const trimmed = content.trim();
    if (!trimmed) return content;
    const leadingSpace = content.startsWith(' ') ? ' ' : '';
    const trailingSpace = content.endsWith(' ') ? ' ' : '';
    return `${leadingSpace}*${trimmed}*${trailingSpace}`;
  }

  if (tag === 's' || tag === 'del' || tag === 'strike') {
    const content = convertChildren(element, context);
    const trimmed = content.trim();
    if (!trimmed) return content;
    const leadingSpace = content.startsWith(' ') ? ' ' : '';
    const trailingSpace = content.endsWith(' ') ? ' ' : '';
    return `${leadingSpace}~~${trimmed}~~${trailingSpace}`;
  }

  if (tag === 'code') {
    const code = getNodeText(element);
    const decoded = decodeHtmlEntities(code).trim();
    if (!decoded) return '';
    // If code contains backticks, use double backticks
    if (decoded.includes('`')) {
      return ` \`\` ${decoded} \`\` `;
    }
    return `\`${decoded}\``;
  }

  // Links
  if (tag === 'a') {
    let href = getAttr(element, 'href') || '';
    const title = getAttr(element, 'title');
    const content = convertChildren(element, context).trim();

    if (!href || href.startsWith('javascript:') || href === '#') {
      return content;
    }

    if (context.baseUrl && href.startsWith('/')) {
      try {
        href = new URL(href, context.baseUrl).href;
      } catch {
        // Keep relative on parse error
      }
    }

    const titleSuffix = title ? ` "${title.replace(/"/g, '\\"')}"` : '';
    return `[${content || href}](${href}${titleSuffix})`;
  }

  // Images
  if (tag === 'img') {
    let src = getAttr(element, 'src') || '';
    const alt = getAttr(element, 'alt') || '';
    const title = getAttr(element, 'title');

    if (!src) return '';

    if (context.baseUrl && src.startsWith('/')) {
      try {
        src = new URL(src, context.baseUrl).href;
      } catch {
        // Keep relative
      }
    }

    const titleSuffix = title ? ` "${title.replace(/"/g, '\\"')}"` : '';
    return `![${alt}](${src}${titleSuffix})`;
  }

  // Figure / Figcaption
  if (tag === 'figure') {
    const content = convertChildren(element, context).trim();
    return content ? `\n\n${content}\n\n` : '';
  }

  if (tag === 'figcaption') {
    const content = convertChildren(element, context).trim();
    return content ? `\n*${content}*\n` : '';
  }

  // Details / Summary
  if (tag === 'details') {
    const summaryElem = (element.childNodes || []).find(
      (c): c is Element => isElement(c) && c.tagName.toLowerCase() === 'summary'
    );
    const summaryText = summaryElem ? convertChildren(summaryElem, context).trim() : 'Details';
    const bodyNodes = (element.childNodes || []).filter((c) => c !== summaryElem);

    const bodyContent = bodyNodes.map((n) => convertNode(n, context)).join('').trim();
    return `\n\n**${summaryText}**\n\n${bodyContent}\n\n`;
  }

  // Definition Lists
  if (tag === 'dt') {
    const content = convertChildren(element, context).trim();
    return `\n\n**${content}**\n`;
  }

  if (tag === 'dd') {
    const content = convertChildren(element, context).trim();
    return `: ${content}\n`;
  }

  // Horizontal Rule
  if (tag === 'hr') {
    return '\n\n---\n\n';
  }

  // Line Break
  if (tag === 'br') {
    return '\n';
  }

  // Sectioning / Divs
  if (
    tag === 'div' ||
    tag === 'section' ||
    tag === 'article' ||
    tag === 'main' ||
    tag === 'aside' ||
    tag === 'header'
  ) {
    const content = convertChildren(element, context).trim();
    return content ? `\n\n${content}\n\n` : '';
  }

  // Default fallback for any unhandled tags (spans, small, sup, sub, etc.)
  return convertChildren(element, context);
}

const DEFAULT_EXCLUDE_SELECTORS = [
  'script',
  'style',
  'noscript',
  'svg',
  'iframe',
  'template',
  'nav',
  'footer',
  '.no-markdown',
  '[data-no-markdown]',
];

/**
 * Converts an HTML document or fragment string to clean Markdown.
 */
export async function htmlToMarkdown(html: string, options: HtmlToMarkdownOptions = {}): Promise<string> {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const document = parse(html) as Document;
  const baseUrl = options.baseUrl ? options.baseUrl.toString() : undefined;
  const metadata = extractPageMetadata(document, baseUrl);

  // Determine exclusions
  const excludeSet = [
    ...(options.excludeSelectors ?? DEFAULT_EXCLUDE_SELECTORS),
    ...(options.extraExcludeSelectors ?? []),
  ];
  const preserveSet = options.preserveSelectors ?? [];

  // Determine root content element
  let rootNode: Node = document;
  const selectorMode = options.contentSelector ?? 'auto';

  if (selectorMode === 'auto') {
    // Try main content targets in priority order
    const candidates = ['main', 'article', '[role="main"]', '#main', '#content', '.main-content', '.content'];
    for (const cand of candidates) {
      const found = findElements(document, cand);
      if (found.length > 0) {
        rootNode = found[0] as Element;
        break;
      }
    }
    // Fallback to body if none of the above match
    if (rootNode === document) {
      const bodies = findElements(document, 'body');
      if (bodies.length > 0) {
        rootNode = bodies[0] as Element;
      }
    }
  } else if (selectorMode === 'body') {
    const bodies = findElements(document, 'body');
    if (bodies.length > 0) {
      rootNode = bodies[0] as Element;
    }
  } else if (typeof selectorMode === 'string' || Array.isArray(selectorMode)) {
    const selectorStr = Array.isArray(selectorMode) ? selectorMode.join(',') : selectorMode;
    const found = findElements(document, selectorStr);
    if (found.length > 0) {
      rootNode = found[0] as Element;
    } else {
      const bodies = findElements(document, 'body');
      if (bodies.length > 0) {
        rootNode = bodies[0] as Element;
      }
    }
  }

  const context: ConversionContext = {
    options,
    excludeSet,
    preserveSet,
    inPre: false,
    inTable: false,
    listDepth: 0,
    listIndexStack: [],
    listTypeStack: [],
    baseUrl,
  };

  let bodyMarkdown = convertNode(rootNode, context);

  // Normalize newlines and whitespace
  bodyMarkdown = bodyMarkdown
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '') // Remove trailing spaces on lines
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    .trim();

  // Format header / metadata
  const metadataMode = options.metadata ?? 'header';
  let formattedHeader = '';

  if (metadataMode === 'yaml') {
    const yamlLines: string[] = ['---'];
    if (metadata.title) yamlLines.push(`title: ${JSON.stringify(metadata.title)}`);
    if (metadata.description) yamlLines.push(`description: ${JSON.stringify(metadata.description)}`);
    if (metadata.author) yamlLines.push(`author: ${JSON.stringify(metadata.author)}`);
    if (metadata.datePublished) yamlLines.push(`datePublished: ${JSON.stringify(metadata.datePublished)}`);
    if (metadata.canonical && options.includeCanonical !== false) {
      yamlLines.push(`canonical: ${JSON.stringify(metadata.canonical)}`);
    }
    yamlLines.push('---', '');
    formattedHeader = `${yamlLines.join('\n')}\n`;
  } else if (metadataMode === 'header' || metadataMode === true) {
    const headerLines: string[] = [];

    // Check if the body already starts with an H1 heading equal to title
    const firstH1Match = bodyMarkdown.match(/^#\s+(.+)$/m);
    const bodyStartsWithTitle =
      firstH1Match &&
      metadata.title &&
      firstH1Match[1]?.trim().toLowerCase() === metadata.title.trim().toLowerCase();

    if (metadata.title && !bodyStartsWithTitle) {
      headerLines.push(`# ${metadata.title}`, '');
    }

    if (metadata.description) {
      headerLines.push(`> ${metadata.description}`, '');
    }

    const metaFacts: string[] = [];
    if (metadata.author) metaFacts.push(`Author: ${metadata.author}`);
    if (metadata.datePublished) metaFacts.push(`Published: ${metadata.datePublished}`);
    if (metadata.canonical && options.includeCanonical !== false) {
      metaFacts.push(`Source: ${metadata.canonical}`);
    }

    if (metaFacts.length > 0) {
      headerLines.push(...metaFacts, '');
    }

    if (headerLines.length > 0) {
      headerLines.push('---', '');
      formattedHeader = `${headerLines.join('\n')}\n`;
    }
  }

  let finalMarkdown = `${formattedHeader}${bodyMarkdown}\n`.trim() + '\n';

  if (options.transform) {
    finalMarkdown = await options.transform(finalMarkdown, {
      url: options.url || metadata.canonical || '',
      html,
      metadata,
    });
  }

  return finalMarkdown;
}
