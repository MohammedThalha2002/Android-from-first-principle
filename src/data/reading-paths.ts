/**
 * The reading paths from the "tooling & reading paths" post, as data.
 *
 * Slugs are validated against the posts collection by tests/content.test.js:
 * a path that names a post which does not exist fails the build rather than
 * rendering a dead link on a group page.
 */
export interface ReadingPath {
  id: string;
  title: string;
  summary: string;
  /** Post ids, in the order the path recommends reading them. */
  posts: string[];
}

export const readingPaths: ReadingPath[] = [
  {
    id: 'new-to-android',
    title: 'New to Android',
    summary: 'The designed path: Parts I to IV in order. The machine first, then the framework, then application engineering, then production.',
    posts: [
      'android/linux-for-android-engineers',
      'android/boot-zygote-and-the-runtime',
      'android/binder-and-the-system',
      'android/frames-from-a-value-to-a-pixel',
      'android/activity-and-process-lifecycle',
      'android/components',
      'android/communication-and-navigation',
      'android/the-view-framework',
      'android/background-execution',
      'android/security',
      'android/performance',
      'android/kotlin-for-android',
      'android/compose-internals',
      'android/architecture-and-dependency-injection',
      'android/persistence',
      'android/networking',
      'android/offline-first-sync-and-paging',
      'android/testing',
      'android/adaptive-ui-design-systems-and-accessibility',
      'android/production',
    ],
  },
  {
    id: 'experienced-self-taught',
    title: 'Experienced but self-taught',
    summary: 'Fills the mechanism gaps behind APIs you already use daily.',
    posts: [
      'android/boot-zygote-and-the-runtime',
      'android/binder-and-the-system',
      'android/activity-and-process-lifecycle',
      'android/kotlin-for-android',
      'android/compose-internals',
      'android/offline-first-sync-and-paging',
      'android/background-execution',
      'android/performance',
    ],
  },
  {
    id: 'interview-preparation',
    title: 'Interview preparation',
    summary: 'The chapters that get asked about, plus every "when it breaks" section.',
    posts: [
      'android/boot-zygote-and-the-runtime',
      'android/binder-and-the-system',
      'android/activity-and-process-lifecycle',
      'android/kotlin-for-android',
      'android/compose-internals',
      'android/background-execution',
      'android/performance',
    ],
  },
  {
    id: 'legacy-app',
    title: 'Maintaining a legacy app',
    summary: 'Components, lifecycle and Views first, then the production work that keeps an old codebase shippable.',
    posts: [
      'android/components',
      'android/activity-and-process-lifecycle',
      'android/the-view-framework',
      'android/production',
      'android/performance',
    ],
  },
  {
    id: 'backend-crossing-over',
    title: 'Backend engineer crossing over',
    summary: 'The differences from a server are the whole point: process model, threading, unreliable networks, offline, background limits.',
    posts: [
      'android/linux-for-android-engineers',
      'android/binder-and-the-system',
      'android/frames-from-a-value-to-a-pixel',
      'android/networking',
      'android/offline-first-sync-and-paging',
      'android/background-execution',
    ],
  },
];
