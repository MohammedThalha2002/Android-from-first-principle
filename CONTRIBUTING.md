# Contributing

Fixes, failure modes, figures, translations and whole lessons are all welcome.
One contribution per pull request keeps reviews quick.

Everything you need is in this file, [LESSON_TEMPLATE.md](LESSON_TEMPLATE.md)
and [AGENTS.md](AGENTS.md). You do not need to read the site code to write a
lesson.

## Where things live

```text
src/content/courses/<course>/
  course.md                              the course contract and who it is for
  <NN-chapter>/
    chapter.md                           what the chapter proves, plus its question round
    <NN-lesson>/
      lesson.mdx                         the page
      quiz.json                          6 questions: 1 pre, 3 check, 2 post
      figures/hero.svg                   the stepped figure
      figures/hero.steps.json            its steps
src/content/posts/                       first-generation long-form drafts, not published
src/                                     the site: layouts, components, styles, tests
LESSON_TEMPLATE.md                       the skeleton every lesson copies
```

Folder names carry the order and the slug: `02-boot/03-zygote/`. The number
orders it, the rest is the URL. Slugs do not change after publishing.

## Ways to contribute

**Fix something.** A typo, a wrong claim, a dead link, a clumsy sentence. Open a
pull request. If you are correcting a technical claim, say in the description
how you checked it.

**Add a failure mode.** The "When it breaks" section of each lesson lists real
symptoms with the exact text a reader will see. If you have hit one this course
does not mention, that is one of the most valuable contributions there is.
Include the error string exactly, package prefix and all.

**Improve a figure.** Rules are below. A figure that shows the mechanism moving
beats three paragraphs.

**Write a lesson.** Open an issue first so we can agree where it sits in the
order. Then follow the rest of this file.

## The shape of a lesson

Every lesson uses the same sections, in this order. Skip an optional one rather
than padding it. Never add a section.

```text
## You will                        4 to 6 objectives, verb first
## The question                    the situation, the wrong belief, two chains
## What is actually happening      the mechanism; the figure lives here
   <Check n={1} />
## Connect it to your code         the same mechanism in everyday Kotlin
   <Check n={2} />
## See it on your phone (optional) OPTIONAL. one short command block
## When it breaks                  2 to 4 real symptoms with exact text
   <Check n={3} />
## Your notes                      one screen, copyable
## Interview questions             5 to 8, with folded model answers
## Words you met                   term, what people say, what it means
## Go deeper                       links, then "What to skip for now"
## Where this goes next            one or two sentences
```

**Open on the question, never on a command.** Name a situation the reader
recognises, quote the belief most developers hold about it, then show two
chains: what people picture, and what actually happens.

**The reader has no device.** Every load-bearing idea is understandable by
reading. Commands live only in the optional section, at most three lines, with
no flag the lesson has not explained. No quiz or interview answer may depend on
running anything.

**One idea per lesson.** Three or four new terms. Between 1,500 and 2,500 words
that a reader actually reads, counting the interview answers and not the code.

**Nothing is used before it is taught.** Before you write, list the words your
mechanism depends on and check each one is taught in an earlier lesson or
defined on the spot. This is the single check that matters most. A lesson that
explains copy-on-write without having introduced pages is not a rough draft, it
is unreadable.

## Nothing invented

This is the rule that cannot bend.

- Every transcript was run on the device named in the lesson's `verifiedOn`.
- Every error string was copied from a real crash or log.
- Every URL was opened. Never build one from memory by pattern.
- Every API name, adb flag, system property and file path was run or read in
  the source.

Anything you could not check gets an HTML comment right above it,
`<!-- VERIFY: ... -->`, and the lesson stays at `stage: draft`. Flagging an
unverified detail is fine. A confident wrong one is not, because a reader will
trust the page over their own screen.

Sources, in order of trust: `developer.android.com`, `source.android.com`,
`cs.android.com`, `kotlinlang.org`, the Android Developers blog, the issue
tracker for a known bug, a Google talk when nothing else explains a decision.
Never a content farm or a blog that restates the docs.

## Writing rules

**Voice.** Second person, present tense, plain and calm. "I" only when it
carries evidence, never "we". Say when something is hard. No praise for the
reader, no sign-off.

**Sentences.** One idea each, averaging under 20 words, active voice, the point
first. Repeat a term rather than reaching for a synonym. No em dashes. No
rhetorical questions outside "The question".

**Banned words.** simply, just (as in "just add"), obviously, of course,
clearly, trivially, easy, straightforward, seamless, powerful, robust as
filler, leverage, utilize, delve, dive in, deep dive, unlock, journey,
landscape, ecosystem as filler, crucial, essential as filler, it is worth
noting, in modern Android development, happy coding, hope this helps.

**Define by job, not by category.** Not "Zygote is a daemon process in the
Android system architecture" but "Zygote is a process that starts at boot,
loads the framework once, and then waits, so no app pays for that loading
again."

**One analogy per concept, and break-test it in the same paragraph.** Say where
it stops being true, or do not use it.

## Code, commands and diagrams

- Kotlin for app code, with the file path as a comment on the first line and
  real names from the course's example app. Comments say why, not what.
- Every fenced block has a language tag: `bash` for commands, `console` for
  output, and never both in one block. Also `kotlin`, `xml`, `json`, `text`,
  `mermaid`.
- **Chains** are the house diagram for a sequence: one node per line, an arrow
  between, under 40 characters wide, inside a `text` fence, with a lead-in
  sentence naming what it shows.
- **No boxed ASCII art**, no multi-column art, no hand-drawn tables. Those break
  at phone width and read as noise to a screen reader.
- **The hero figure** is hand-drawn SVG with three to eight steps. Colours come
  only from the `--dg-*` tokens, fonts only from `var(--font-ui)` or
  `var(--font-mono)`, every `<svg>` has a `viewBox`, every `<path>` has an
  explicit `fill`, and no `*`, `_`, `{` or `}` appears inside a `<text>`
  element. Each `show` id in `hero.steps.json` must exist as a
  `data-part` group in `hero.svg`.
- Mermaid is allowed for supporting flowcharts and sequence diagrams, with no
  colour or style directives, at most two per lesson.

## Questions

**The quiz** is exactly six questions in `quiz.json`, in this order: one `pre`,
three `check`, two `post`. Four options each, one correct, `correct` is a
zero-based index. Every explanation is at least two sentences and teaches
something to a reader who answered correctly. No "all of the above". Do not put
the correct answer at the same index three times in a row. The three `check`
questions render at the `<Check n={1..3} />` markers, in order.

**The interview questions** are five to eight open questions at the end, marked
Easy through Senior, never multiple choice. Each has a folded `<details>` model
answer containing a "Hit these points" list and one line on what a weak answer
sounds like. The last item is always the four-sentence challenge: explain the
idea to an interviewer in four sentences, with a four-sentence model answer.

## Before you open a pull request

- [ ] One lesson folder touched
- [ ] Sections present, in the template order
- [ ] `<Check n={1} />`, `<Check n={2} />`, `<Check n={3} />` present in order
- [ ] `quiz.json` valid: six questions, right order, four options, explanations
- [ ] Five to eight interview questions, folded answers, four-sentence challenge last
- [ ] "Your notes" fits one phone screen
- [ ] Figure present, or its spec written and the lesson left at `draft`
- [ ] Every fence tagged; no mixed command and output blocks
- [ ] No banned words; no em dashes
- [ ] Every claim run or read; anything else marked `VERIFY` and `stage: draft`
- [ ] `npm test && npm run test:unit && npm run typecheck && npm run build` green

Commit subject: `feat(<course>/<chapter.lesson>): <slug>`, under 72 characters.
The body says why, not what.

## What the tests enforce

| Test | Asserts |
|---|---|
| `npm test` | frontmatter is sane, no duplicate ids, reading paths resolve, every `<Snippet>` target exists, theme tokens are complete, diagram rules hold, no literal colour outside `tokens.css` |
| `npm run test:unit` | snippet extraction and section counting |
| `npm run typecheck` | the site code and the content schemas |

CI runs all four on every push and pull request.

## Code of conduct

Be kind, be specific, assume good faith. Review comments are about the work.
