/**
 * Diagram invariants.
 *
 * Diagrams are the load-bearing images in this series, and they are drawn in
 * inline SVG so they can follow the theme. That only works if the artwork
 * touches nothing but the --dg-* roles. These tests pin the roles' contrast
 * in both themes, and check the artwork itself for the four mistakes that
 * silently break a diagram:
 *
 *   1. a literal colour, which survives one theme and vanishes in the other
 *   2. a font the site does not ship, which reflows every hand-placed label
 *   3. a markdown emphasis character inside <text>, which ends SVG foreign
 *      content and takes the rest of the page with it (14 diagrams in the
 *      backend repo died this way)
 *   4. a missing viewBox, which stops the drawing scaling on a phone
 *   5. a brace inside <text>. MDX parses it as a JSX expression, so a label
 *      like "Modifier.offset { IntOffset(0, y) }" fails the build with
 *      "IntOffset is not defined" — the same class of hazard as a bare angle
 *      bracket. Use the HTML entities instead.
 *   6. a <path> that inherits no fill. SVG defaults `fill` to BLACK and fills
 *      the implied closed area, so an L-shaped connector drawn with only a
 *      stroke paints a solid black triangle across the diagram — in both
 *      themes, in a colour that appears nowhere in the source. This is a real
 *      bug that shipped in chapter 1's build-pipeline diagram. `fill` is
 *      inherited, so a path is fine when either it or its <svg> declares one;
 *      the icons in the UI components rely on <svg fill="none"> and must keep
 *      passing.
 */
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const tokensPath = new URL('../src/styles/tokens.css', import.meta.url);

const AA = 4.5;

function toRgb(hex) {
  const h = hex.length === 4
    ? hex.slice(1).split('').map((c) => c + c).join('')
    : hex.slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function luminance([r, g, b]) {
  const channel = (value) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a, b) {
  const [hi, lo] = [luminance(toRgb(a)), luminance(toRgb(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Read one theme's token block out of tokens.css.
 *
 * Comments are stripped first: the file's own header documents the theme
 * mechanism and mentions both `@media (prefers-color-scheme: dark)` and the
 * `[data-theme]` selectors in prose, so a naive indexOf finds the explanation
 * rather than the rule. Blocks are then matched by counting braces.
 */
function blockAfter(css, selector) {
  const start = css.indexOf(selector);
  assert.ok(start !== -1, `tokens.css contains ${selector}`);
  const open = css.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  throw new Error(`Unbalanced braces after ${selector}`);
}

function tokensFor(css, theme) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const block = theme === 'light'
    ? blockAfter(stripped, ':root {')
    : blockAfter(stripped, ":root[data-theme='dark']");
  const values = {};
  for (const [, name, value] of block.matchAll(/(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    values[name] = value;
  }
  return values;
}

test('every --dg-* role clears AA against the diagram ground in both themes', async () => {
  const css = await readFile(tokensPath, 'utf8');

  for (const theme of ['light', 'dark']) {
    const tokens = tokensFor(css, theme);
    // --dg-ground is `var(--card)`, so resolve it to the concrete surface.
    const ground = tokens['--card'];
    assert.ok(ground, `${theme}: --card is defined`);

    const roles = Object.keys(tokens).filter((name) => name.startsWith('--dg-'));
    assert.ok(roles.length >= 5, `${theme}: diagram roles are defined`);

    for (const role of roles) {
      // Fills sit behind labels rather than carrying them, so they are held
      // to the 3:1 non-text bar; anything that can carry a label is held to AA.
      const isFill = role.startsWith('--dg-fill');
      const minimum = isFill ? 1.2 : AA;
      const ratio = contrast(tokens[role], ground);
      assert.ok(
        ratio >= minimum,
        `${theme}: ${role} (${tokens[role]}) on --card (${ground}) is ${ratio.toFixed(2)}:1, needs ${minimum}:1`,
      );
    }
  }
});

async function mdxFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const child = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await mdxFiles(child));
    else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.astro')) found.push(child);
  }
  return found;
}

test('inline SVG artwork follows the diagram rules', async () => {
  const files = await mdxFiles(new URL('src/', root).pathname);
  const problems = [];

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const name = file.replace(root.pathname, '');

    for (const [svg] of source.matchAll(/<svg[\s\S]*?<\/svg>/g)) {
      // Numeric HTML entities (&#123;) are not colours. Strip them before the
      // hex check, or escaping a brace in a label trips the colour rule.
      const withoutEntities = svg.replace(/&#\d+;/g, '');
      if (/#[0-9a-fA-F]{3,8}\b/.test(withoutEntities)) problems.push(`${name}: literal colour inside <svg>`);
      if (/rgb\(|hsl\(/.test(svg)) problems.push(`${name}: literal rgb()/hsl() inside <svg>`);
      if (!/viewBox=/.test(svg)) problems.push(`${name}: <svg> without a viewBox`);

      // fill is an inherited property: a path is covered when its own tag
      // declares one, or when the enclosing <svg> does.
      const svgTag = svg.match(/<svg\b[^>]*>/)?.[0] ?? '';
      const svgDeclaresFill = /\bfill=/.test(svgTag);
      if (!svgDeclaresFill) {
        for (const [tag] of svg.matchAll(/<path\b[^>]*>/g)) {
          if (!/\bfill=/.test(tag)) {
            problems.push(`${name}: <path> inherits no fill, so it paints black: ${tag.slice(0, 56)}`);
          }
        }
      }

      for (const [, fontStack] of svg.matchAll(/font-family=["']([^"']+)["']/g)) {
        if (!/var\(--font-(ui|mono|prose)\)/.test(fontStack)) {
          problems.push(`${name}: <svg> uses an unshipped font stack (${fontStack})`);
        }
      }

      for (const [, label] of svg.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)) {
        if (/[*_]/.test(label)) {
          problems.push(`${name}: markdown emphasis character inside <text>: ${label.trim().slice(0, 40)}`);
        }
        if (/[{}]/.test(label)) {
          problems.push(`${name}: brace inside <text> — MDX reads it as JSX: ${label.trim().slice(0, 40)}`);
        }
      }
    }
  }

  assert.deepEqual(problems, []);
});
