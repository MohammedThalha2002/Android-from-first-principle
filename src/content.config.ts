import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    navTitle: z.string().optional(),
    summary: z.string(),
    date: z.coerce.date(),
    readingTime: z.string(),
    minutes: z.number().int().positive(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** An ordered sequence this post belongs to, e.g. "android-internals". */
    subtopic: z.string().optional(),
    /** Position within `subtopic`; falls back to `date` order when absent. */
    subtopicOrder: z.number().int().positive().optional(),
    /** Free-form grouping label within a subtopic (e.g. "I", "appendix") — display only. */
    part: z.string().optional(),
    /** Cosmetic only — a small "Reference" style label, not used for numbering. */
    kind: z.enum(['post', 'appendix']).default('post'),
    verifiedAgainst: z.string().optional(),
    labModule: z.string().optional(),
    stage: z.enum(['outline', 'draft', 'published']).default('outline'),
  }),
});

/**
 * A course is a folder of chapters, each a folder of lessons. The folder
 * names carry the order (`01-process/01-your-app-is-a-process`) and the slug;
 * nothing about the sequence is hand-maintained in frontmatter beyond the
 * `chapter` and `lesson` numbers, which a test asserts agree with the folders.
 */
const courses = defineCollection({
  loader: glob({
    pattern: '*/course.md',
    base: './src/content/courses',
    generateId: ({ entry }) => entry.replace(/\/course\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    navTitle: z.string().optional(),
    tagline: z.string(),
    summary: z.string(),
    group: z.string(),
    status: z.enum(['available', 'coming-soon']).default('available'),
    planned: z.object({ chapters: z.number().int(), lessons: z.number().int() }).optional(),
  }),
});

const chapters = defineCollection({
  loader: glob({
    pattern: '*/*/chapter.md',
    base: './src/content/courses',
    generateId: ({ entry }) => entry.replace(/\/chapter\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    navTitle: z.string().optional(),
    /** One sentence: what a reader can do after this chapter that they could not before. */
    proves: z.string(),
  }),
});

const lessons = defineCollection({
  loader: glob({
    pattern: '*/*/*/lesson.mdx',
    base: './src/content/courses',
    generateId: ({ entry }) => entry.replace(/\/lesson\.mdx$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    /** One line under 20 words the reader can repeat a week later. */
    motto: z.string(),
    course: z.string(),
    chapter: z.number().int().positive(),
    lesson: z.number().int().positive(),
    type: z.enum(['mechanism', 'tooling', 'build']),
    minutes: z.number().int().positive(),
    /** Lesson ids like "1.4"; a test checks they exist and come earlier. */
    prerequisites: z.array(z.string()).default([]),
    objectives: z.array(z.string()).min(3).max(6),
    terms: z.array(z.string()).min(2).max(5),
    verifiedOn: z.string(),
    stage: z.enum(['outline', 'draft', 'verified', 'published']).default('outline'),
    sources: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, courses, chapters, lessons };
