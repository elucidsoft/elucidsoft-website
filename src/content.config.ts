import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * News.
 *
 * Hero artwork doubles as the OG image, so its dimensions are fixed and
 * enforced rather than advisory. A hero that is not 1200x630 produces a social
 * card that is cropped or letterboxed on every platform, and that failure is
 * invisible until someone shares the link.
 */
export const HERO_WIDTH = 1200;
export const HERO_HEIGHT = 630;

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z
    .object({
      title: z.string().min(1).max(80),

      /**
       * The canonical slug. Authored rather than derived from the filename so
       * a file can be renamed or moved into a subfolder without changing a
       * published URL.
       */
      slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase words separated by single hyphens'),

      /** Card and listing text. */
      summary: z.string().min(1).max(240),

      /**
       * The search snippet, authored independently of `summary`. Deriving it
       * from the summary means the sentence that reads well on a card is also
       * the sentence competing in a SERP, and those are different jobs.
       */
      metaDescription: z
        .string()
        .min(120, 'too short to fill a search snippet')
        .max(158, 'will be truncated in search results'),

      /**
       * Only `published` gets a route. Two states is enough; a six-state
       * editorial workflow is machinery for a corpus this site will not have.
       */
      status: z.enum(['draft', 'published']).default('draft'),

      datePublished: z.coerce.date(),
      dateModified: z.coerce.date().optional(),

      author: z.string().min(1),
      category: z.string().min(1),

      image: z
        .object({
          src: z.string().min(1),
          alt: z.string().min(1),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
        })
        .optional(),

      relatedArticles: z.array(reference('news')).default([]),
    })
    /**
     * `.strict()` so an unknown frontmatter key fails the build instead of
     * passing through silently. A typo in a key name is otherwise indis-
     * tinguishable from an intentionally absent field.
     */
    .strict()
    .refine(
      (data) =>
        !data.image || (data.image.width === HERO_WIDTH && data.image.height === HERO_HEIGHT),
      {
        message: `hero image must be exactly ${HERO_WIDTH}x${HERO_HEIGHT} — it is reused as the OG card`,
        path: ['image'],
      },
    )
    .refine((data) => !data.dateModified || data.dateModified >= data.datePublished, {
      message: 'dateModified cannot precede datePublished',
      path: ['dateModified'],
    }),
});

export const collections = { news };
