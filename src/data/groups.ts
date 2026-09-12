/**
 * The group registry.
 *
 * A parent group is a broad subject area (android today; ai, backend, etc.
 * later). Registering one gets it a custom accent colour and nicer copy,
 * but it is NOT required: any folder under src/content/posts/<group>/
 * builds and renders fine unregistered, via getGroup()'s fallback — so a
 * contributor's new group never breaks the build. The maintainer registers
 * it later purely for the accent block in tokens.css and a proper
 * title/tagline.
 */
export type Tint = 'teal' | 'violet' | 'coral' | 'blue' | 'green' | 'amber' | 'grey';

export interface Group {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  tint: Tint;
}

export const groups: Group[] = [
  {
    id: 'android',
    badge: 'AN',
    title: 'Android',
    tagline: 'The platform, one layer below the API.',
    tint: 'teal',
  },
];

export const groupById = new Map(groups.map((group) => [group.id, group]));

function titleize(id: string): string {
  return id.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

/** Registered groups get a custom accent + tagline; an unregistered one still renders. */
export function getGroup(id: string): Group {
  return groupById.get(id) ?? { id, badge: id.slice(0, 2).toUpperCase(), title: titleize(id), tagline: '', tint: 'grey' };
}

/**
 * "android/linux-for-android-engineers" → { group: 'android', slug: '...' }.
 * A bare id with no "/" (a standalone post with no group folder) has no group.
 */
export function splitPostId(id: string): { group: string | null; slug: string } {
  const parts = id.split('/');
  if (parts.length === 1) return { group: null, slug: parts[0] };
  const [group, ...rest] = parts;
  return { group, slug: rest.join('/') };
}
