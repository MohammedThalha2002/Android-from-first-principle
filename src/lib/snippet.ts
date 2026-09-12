/**
 * Region extraction for <Snippet>.
 *
 * Lives here rather than inside the component so it can be unit-tested and
 * reused by the content lint, which checks every <Snippet> target in every
 * chapter resolves before the site builds. The sibling repo had to *ask*
 * contributors to keep the panel and the file in sync; here the file is the
 * source and a broken reference fails the build.
 */

const EXT_LANG: Record<string, string> = {
  kt: 'kotlin', kts: 'kotlin', java: 'java', xml: 'xml',
  gradle: 'groovy', toml: 'toml', json: 'json', sh: 'bash',
  pro: 'properties', properties: 'properties', proto: 'proto', sql: 'sql',
};

export function languageFor(file: string): string {
  return EXT_LANG[file.split('.').pop() ?? ''] ?? 'text';
}

/** Remove the common leading indent so an extracted region is flush left. */
export function dedent(source: string): string {
  const lines = source.replace(/^\n+|\s+$/g, '').split('\n');
  const widths = lines.filter((line) => line.trim()).map((line) => line.match(/^[ \t]*/)![0].length);
  const indent = widths.length ? Math.min(...widths) : 0;
  return lines.map((line) => line.slice(indent)).join('\n');
}

/**
 * Return the lines between `// region:<name>` and the next `// endregion`.
 * Tolerates //, #, <!-- and /* comment styles so the same markers work in
 * Kotlin, Gradle, XML and shell fixtures.
 *
 * Throws with the file name in the message — a silent empty code block is
 * far worse than a failed build.
 */
export function extractRegion(source: string, region: string, file = 'the file'): string {
  const open = new RegExp(`(?://|#|<!--|/\\*)\\s*region:${escape(region)}\\b.*$`, 'm');
  const close = /(?:\/\/|#|<!--|\/\*)\s*endregion\b/m;

  const start = source.match(open);
  if (!start || start.index === undefined) {
    throw new Error(`<Snippet> found no region "${region}" in ${file}. Add "// region:${region}" and "// endregion".`);
  }
  const rest = source.slice(start.index + start[0].length);
  const end = rest.match(close);
  if (!end || end.index === undefined) {
    throw new Error(`<Snippet> found "region:${region}" in ${file} but no closing "// endregion".`);
  }
  return dedent(rest.slice(0, end.index));
}

function escape(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
