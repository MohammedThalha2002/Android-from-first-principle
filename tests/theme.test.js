/**
 * Theme system invariants.
 *
 * Asserts the STRUCTURE, not literal values, so the palette can change
 * without rewriting tests: themes are a token swap across three states, the
 * chrome follows the theme rather than carrying its own palette, every
 * registered group has an accent in both themes, and no rule outside the
 * token file hardcodes a colour.
 */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const tokens = await readFile(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const stripped = tokens.replace(/\/\*[\s\S]*?\*\//g, '');

test('tokens define tri-state theme mechanics', () => {
  assert.match(stripped, /:root\s*\{/);
  assert.match(stripped, /@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme='light'\]\)/);
  assert.match(stripped, /:root\[data-theme='dark'\]\s*\{/);
});

/* The bar used to carry a second, fixed palette so it framed the page in every
   theme. It reads as app furniture on a reading site, worst in light, so the
   chrome family now points at the themed surfaces. Keeping every chrome colour
   a reference is what stops the two drifting apart again. */
test('the chrome follows the theme instead of carrying its own palette', () => {
  const rootBlock = stripped.slice(
    stripped.indexOf(':root'),
    stripped.indexOf('@media (prefers-color-scheme: dark)'),
  );
  const colours = [...rootBlock.matchAll(/(--chrome[a-z0-9-]*)\s*:\s*([^;]+);/g)]
    .filter(([, name]) => name !== '--chrome-bar');

  assert.ok(colours.length >= 5, 'the chrome family is declared in :root');
  for (const [, name, value] of colours) {
    assert.match(
      value.trim(),
      /^var\(--/,
      `${name} must resolve to a themed token so the bar cannot fall out of theme`,
    );
  }

  const dark = stripped.slice(stripped.indexOf('@media (prefers-color-scheme: dark)'));
  assert.doesNotMatch(
    dark,
    /--chrome[a-z-]*:/,
    'chrome tokens inherit from what they reference, so they are never redefined per theme',
  );
});

test('every registered group has an accent in light and dark', async () => {
  const registry = await readFile(new URL('../src/data/groups.ts', import.meta.url), 'utf8');
  const ids = [...registry.matchAll(/id:\s*'([a-z-]+)'/g)].map((m) => m[1]);
  assert.ok(ids.length >= 1);
  for (const id of ids) {
    assert.match(stripped, new RegExp(`:root\\[data-group='${id}'\\]\\s*\\{[^}]*--accent:`), `${id}: light accent`);
    assert.match(stripped, new RegExp(`:root\\[data-theme='dark'\\]\\[data-group='${id}'\\]\\s*\\{[^}]*--accent:`), `${id}: dark accent`);
    assert.match(stripped, new RegExp(`:root:not\\(\\[data-theme='light'\\]\\)\\[data-group='${id}'\\]\\s*\\{[^}]*--accent:`), `${id}: system-dark accent`);
  }
});

test('literal colours stay in tokens and favicon only', async () => {
  const allowed = new Set(['src/styles/tokens.css', 'public/favicon.svg']);
  const offenders = [];
  async function walk(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
      const child = join(path, entry.name);
      if (entry.isDirectory()) await walk(child);
      else if (/\.(astro|css|tsx?|svg)$/.test(entry.name)) {
        const rel = child.replace(root.pathname, '');
        const text = await readFile(child, 'utf8');
        if (!allowed.has(rel) && /#[0-9a-fA-F]{3,8}\b/.test(text)) offenders.push(rel);
      }
    }
  }
  await walk(join(root.pathname, 'src'));
  await walk(join(root.pathname, 'public'));
  assert.deepEqual(offenders, []);
});
