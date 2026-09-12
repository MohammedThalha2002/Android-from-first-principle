import { describe, expect, it } from 'vitest';
import { dedent, extractRegion, languageFor } from '../../src/lib/snippet';
import { countSections } from '../../src/lib/sections';

const KOTLIN = `package labs.ch05

object Search {
    // region:debounce
    fun search(q: String) =
        repo.search(q)
    // endregion
}
`;

describe('extractRegion', () => {
  it('returns the lines between the markers, flush left', () => {
    expect(extractRegion(KOTLIN, 'debounce')).toBe('fun search(q: String) =\n    repo.search(q)');
  });

  it('accepts # and <!-- comment styles for Gradle and XML', () => {
    expect(extractRegion('# region:a\nvalue=1\n# endregion', 'a')).toBe('value=1');
    expect(extractRegion('<!-- region:a -->\n<x/>\n<!-- endregion -->', 'a')).toBe('<x/>');
  });

  it('names the file when the region is missing, rather than emitting nothing', () => {
    expect(() => extractRegion(KOTLIN, 'nope', 'Debounce.kt'))
      .toThrow(/no region "nope" in Debounce\.kt/);
  });

  it('fails on an unterminated region', () => {
    expect(() => extractRegion('// region:a\nx', 'a', 'F.kt')).toThrow(/no closing/);
  });

  it('does not let a region name inject a pattern', () => {
    expect(() => extractRegion(KOTLIN, 'de.*ce')).toThrow(/no region/);
  });
});

describe('dedent', () => {
  it('keeps relative indentation and trims blank edges', () => {
    expect(dedent('\n    a\n      b\n\n')).toBe('a\n  b');
  });
});

describe('languageFor', () => {
  it('maps Android file extensions to Shiki languages', () => {
    expect(languageFor('a/B.kt')).toBe('kotlin');
    expect(languageFor('build.gradle.kts')).toBe('kotlin');
    expect(languageFor('AndroidManifest.xml')).toBe('xml');
    expect(languageFor('notes.unknown')).toBe('text');
  });
});

describe('countSections', () => {
  it('counts h2 headings', () => {
    expect(countSections('intro\n\n## One\n\ntext\n\n## Two\n')).toBe(2);
  });

  it('ignores h2-looking lines inside fenced code', () => {
    expect(countSections('## Real\n\n```sh\n## not a heading\n```\n\n## Also real\n')).toBe(2);
  });

  it('ignores h3 and deeper, and bare hashes', () => {
    expect(countSections('## One\n### Two\n#### Three\n##\n##notaheading\n')).toBe(1);
  });
});
