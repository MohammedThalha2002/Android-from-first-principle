# AGENTS.md

Rules for AI agents working in this repository. Humans should read
[CONTRIBUTING.md](CONTRIBUTING.md) first; everything there applies here too.
This file adds what an agent gets wrong that a person usually does not.

## What this repo is

Open-source Android courses that explain the platform one layer below the API,
for an engineer about a year in. The lessons are the product. The Astro site is
how they are read.

A lesson is a folder: `lesson.mdx`, `quiz.json`, and `figures/hero.svg` with
`figures/hero.steps.json`. The shape of the page and every writing rule are in
CONTRIBUTING.md, and the skeleton to copy is in LESSON_TEMPLATE.md.

## The five rules an agent breaks

**1. Nothing invented.** Do not write a command transcript, an error string, a
log line, a number, an API name or a URL that you have not run or read. This is
not a style preference. A reader trusts the page over their own screen, so a
plausible fabrication is the one mistake that cannot be walked back.

When you cannot check something, write the claim, put
`<!-- VERIFY: what needs checking -->` directly above it, leave the lesson at
`stage: draft`, and list it as an open item in your report. Never quietly
upgrade a guess into a fact, and never advance a `stage` to make a summary look
finished.

**2. Nothing used before it is taught.** Before drafting, list every word the
mechanism depends on. Check each one against the earlier lessons in the course.
If a word is not taught earlier and you are not defining it on the spot, the
lesson is broken however good the prose is.

This repo has already shipped this bug once: a lesson explained copy-on-write
using "page" eight times, in a chapter that never introduced virtual memory. It
needed a rebuild, not an edit.

**3. Open on the question, never on a command.** The first section names a
situation the reader recognises, quotes the belief most developers hold, and
shows two chains. A lesson that opens with `adb shell ...` has put a wall in
front of the idea.

**4. The reader has no device.** Everything load-bearing is readable. Commands
go in one optional section after the mechanism, three lines at most, with no
unexplained flags, and nothing in the quiz or the interview questions may depend
on running them.

**5. One lesson per run, one lesson per commit.** A chapter is five to seven
separate pieces of work. Batching them produces a chapter that drifts in the
middle.

## Scope

Change the lesson folder you were asked to change, plus the chapter or course
file if the work genuinely changed it. Do not reorganise the site, rename
slugs, or rewrite neighbouring lessons because they now look inconsistent.
Raise that instead.

## Styling trap

An Astro `<style>` block only applies to the component that declares it.
Borrowing a class name from another layout gives you the markup and none of the
rules, and it fails silently: the page renders with no padding rather than
erroring. A class used by more than one page belongs in `src/styles/base.css`.

After a change that touches layout, build and confirm every class in the built
HTML has a matching rule in `dist/_astro/*.css` or in that page's inlined
`<style>`.

## MDX traps

All three have broken this build.

- Bare angle brackets in prose are JSX. Put `Response<T>` in backticks.
- Braces in prose are JSX expressions. Use `&#123;` and `&#125;` or reword.
- `*` and `_` inside an SVG `<text>` element end SVG foreign content and
  silently break the rest of the page. Write "system server", not the
  underscored form.

## Reporting

When you finish a lesson, report in this order: the verification table showing
how each claim was checked, what remains marked `VERIFY`, the confusion audit
of places a beginner would stop, and the checklist from CONTRIBUTING.md with a
pass or fail per line. Say what you did not do.

## Before you finish

```bash
npm test && npm run test:unit && npm run typecheck && npm run build
```

All four must pass.
