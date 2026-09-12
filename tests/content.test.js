/**
 * Content integrity.
 *
 * Deliberately loose: any contributor can add a post under
 * src/content/posts/<group>/<slug>.mdx (or a bare src/content/posts/<slug>.mdx
 * standalone post) without matching a fixed curriculum. What's still
 * enforced is frontmatter sanity, that reading paths don't link to posts
 * that don't exist, and that every <Snippet> resolves.
 */
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { extractRegion } from '../src/lib/snippet.ts';

const root = new URL('../', import.meta.url);
const postsDir = new URL('../src/content/posts/', import.meta.url);

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, 'frontmatter exists');
  return Object.fromEntries(match[1].split('\n').filter(Boolean).map((line) => {
    const [key, ...rest] = line.split(':');
    return [key.trim(), rest.join(':').trim().replace(/^"|"$/g, '')];
  }));
}

/** Every post file, as { id, path } — id is "<group>/<slug>" or a bare "<slug>". */
async function postFiles() {
  const out = [];
  async function walk(dir, prefix) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        await walk(join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
        continue;
      }
      if (!entry.name.endsWith('.mdx')) continue;
      const slug = entry.name.replace(/\.mdx$/, '');
      out.push({ id: prefix ? `${prefix}/${slug}` : slug, path: join(dir, entry.name) });
    }
  }
  await walk(new URL(postsDir).pathname, '');
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

test('every post has sane frontmatter', async () => {
  const files = await postFiles();
  assert.ok(files.length > 0, 'at least one post exists');

  const ids = new Set();
  for (const { id, path } of files) {
    assert.ok(!ids.has(id), `duplicate post id: ${id}`);
    ids.add(id);

    const source = await readFile(path, 'utf8');
    const data = parseFrontmatter(source);

    assert.ok(data.title, `${id}: title`);
    assert.ok(data.summary, `${id}: summary`);
    assert.ok(data.date, `${id}: date`);
    assert.ok(Number(data.minutes) > 0, `${id}: minutes`);
    assert.match(data.readingTime, /^\d(-\d)? hours?$/, `${id}: readingTime reads naturally`);
    if (data.subtopicOrder) assert.ok(data.subtopic, `${id}: subtopicOrder without a subtopic`);

    // Sections are the trackable unit. A post with none records nothing.
    assert.ok(/\n## /.test(source), `${id}: needs at least one h2 section`);
  }
});

test('reading paths reference posts that exist', async () => {
  const source = await readFile(new URL('../src/data/reading-paths.ts', import.meta.url), 'utf8');
  const ids = new Set((await postFiles()).map((f) => f.id));
  const referenced = [...source.matchAll(/'([a-z0-9-]+(?:\/[a-z0-9-]+)*)'/g)]
    .map((match) => match[1])
    .filter((value) => value.includes('/') || ids.has(value));

  assert.ok(referenced.length > 0, 'paths reference posts');
  for (const id of referenced) {
    assert.ok(ids.has(id), `reading path references missing post: ${id}`);
  }
});

test('every <Snippet> target and region resolves', async () => {
  // The notes do not hold their own copy of the code, so a post that points
  // at a file or a region that no longer exists must fail here rather than
  // shipping an empty code block.
  const files = await postFiles();
  const problems = [];

  for (const { id, path } of files) {
    // Strip fenced code first: the tooling post documents the <Snippet>
    // syntax inside a code block, and a documented example is not a usage.
    const source = (await readFile(path, 'utf8'))
      .replace(/^([ \t]*)(`{3,}|~{3,})[\s\S]*?^\1\2[ \t]*$/gm, '');
    for (const [, attrs] of source.matchAll(/<Snippet\s+([^>]*?)\/?>/g)) {
      const target = attrs.match(/file=["']([^"']+)["']/)?.[1];
      const region = attrs.match(/region=["']([^"']+)["']/)?.[1];
      if (!target) { problems.push(`${id}: <Snippet> without a file`); continue; }

      let code;
      try {
        code = await readFile(new URL(target, root), 'utf8');
      } catch {
        problems.push(`${id}: <Snippet> cannot read ${target}`);
        continue;
      }
      if (region) {
        try { extractRegion(code, region, target); }
        catch (error) { problems.push(`${id}: ${error.message}`); }
      }
    }
  }

  assert.deepEqual(problems, []);
});
