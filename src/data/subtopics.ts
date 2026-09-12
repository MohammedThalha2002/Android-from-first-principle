/**
 * The subtopic registry.
 *
 * A subtopic is a named, ordered sequence of posts within a parent group
 * (e.g. "Android Internals"). Registering one gets a title, tagline and a
 * "coming soon" placeholder card before any post exists — but like groups,
 * it's not required: a post's `subtopic` frontmatter can name any slug,
 * registered or not, and still groups and orders correctly by
 * `subtopicOrder` (falling back to `date`).
 */
import type { Tint } from './groups';

export interface Subtopic {
  id: string;
  group: string;
  title: string;
  tagline: string;
  tint: Tint;
  status: 'available' | 'coming-soon';
  /** Rough size shown on the subtopic card before any post exists. */
  planned?: number;
}

/**
 * The first-generation long-form posts were grouped by subtopic. They are now
 * source material rather than published reading, so nothing registers
 * `android-internals` any more: the Android Internals *course* took the name.
 * What is left here is the two courses that are announced but not started.
 */
export const subtopics: Subtopic[] = [
  {
    id: 'lld-for-android',
    group: 'android',
    title: 'Low-Level Design for Android',
    tagline: 'Classes, boundaries and state, designed for process death.',
    tint: 'violet',
    status: 'coming-soon',
    planned: 16,
  },
  {
    id: 'hld-for-android',
    group: 'android',
    title: 'High-Level Design for Android',
    tagline: 'Sync, scale and the systems behind the screen.',
    tint: 'coral',
    status: 'coming-soon',
    planned: 14,
  },
];

export const subtopicById = new Map(subtopics.map((s) => [s.id, s]));

function titleize(id: string): string {
  return id.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

/** Registered subtopics get curated copy; an unregistered `subtopic` tag still works, titleized. */
export function getSubtopic(id: string): Subtopic {
  return subtopicById.get(id) ?? { id, group: '', title: titleize(id), tagline: '', tint: 'grey', status: 'available' };
}

export function subtopicsForGroup(groupId: string): Subtopic[] {
  return subtopics.filter((s) => s.group === groupId);
}
