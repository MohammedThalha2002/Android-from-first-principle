/**
 * Count a post's trackable sections from its raw body.
 *
 * The lesson list needs a section COUNT for every post in the group, on
 * every group page. Getting that by calling render() on every entry inside
 * getStaticPaths was both slow and fragile: render() resolves each entry
 * through the content-layer module map, so a single stale entry in .astro/
 * takes down route resolution for the whole group with "Unexpected error
 * while rendering". Counting `## ` in the body needs no module map, no
 * cache and no render.
 *
 * render() is still the right call where the section IDS are needed — the
 * current post's own headings — because those must match the anchor slugs
 * Astro actually emits.
 */

/** Number of `##` headings, ignoring any inside a fenced code block. */
export function countSections(body: string): number {
  return (stripFences(body).match(/^##[ \t]+\S/gm) ?? []).length;
}

/** Fenced blocks can contain `## ` lines that are code, not headings. */
function stripFences(body: string): string {
  return body.replace(/^([ \t]*)(`{3,}|~{3,})[\s\S]*?^\1\2[ \t]*$/gm, '');
}
