/**
 * Course ids carry their own order and slug.
 *
 *   courses/android-internals/01-process/01-your-app-is-a-process
 *           ^course id       ^chapter    ^lesson
 *
 * Everything the navigation needs (order, slug, parent) is parsed from that,
 * so no ordering is duplicated in frontmatter or in a hand-kept list.
 */
export interface Segment {
  /** The numeric prefix on the folder, or 0 when there is none. */
  order: number;
  /** The folder name without its prefix. This is what appears in the URL. */
  slug: string;
}

export function segment(name: string): Segment {
  const match = name.match(/^(\d+)-(.+)$/);
  return match ? { order: Number(match[1]), slug: match[2] } : { order: 0, slug: name };
}

/**
 * `android-internals` under the group `android` is `/android/internals/`.
 * A course whose id does not start with its group keeps its whole id.
 */
export function courseSlug(courseId: string, groupId: string): string {
  return courseId.startsWith(`${groupId}-`) ? courseId.slice(groupId.length + 1) : courseId;
}

export function chapterParts(chapterId: string) {
  const [course, chapter] = chapterId.split('/');
  return { course, chapter: segment(chapter) };
}

export function lessonParts(lessonId: string) {
  const [course, chapter, lesson] = lessonId.split('/');
  return { course, chapter: segment(chapter), lesson: segment(lesson) };
}

/** The directory the lesson's quiz and figures sit in, from its id. */
export function lessonDir(lessonId: string): string {
  return `/src/content/courses/${lessonId}`;
}

export function lessonHref(lessonId: string, groupId: string): string {
  const { course, chapter, lesson } = lessonParts(lessonId);
  return `/${groupId}/${courseSlug(course, groupId)}/${chapter.slug}/${lesson.slug}/`;
}

export function chapterHref(chapterId: string, groupId: string): string {
  const { course, chapter } = chapterParts(chapterId);
  return `/${groupId}/${courseSlug(course, groupId)}/${chapter.slug}/`;
}

export function courseHref(courseId: string, groupId: string): string {
  return `/${groupId}/${courseSlug(courseId, groupId)}/`;
}

/** "1.4" for a lesson, used by prerequisites and by the reader. */
export function lessonNumber(chapter: number, lesson: number): string {
  return `${chapter}.${lesson}`;
}

/** Sort by chapter order, then lesson order. */
export function byOrder(a: { id: string }, b: { id: string }): number {
  const x = lessonParts(a.id);
  const y = lessonParts(b.id);
  return x.chapter.order - y.chapter.order || x.lesson.order - y.lesson.order;
}
