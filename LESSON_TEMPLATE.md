# Lesson template

Copy this folder shape and this `lesson.mdx` skeleton for every lesson. The
rules behind each section are in
[CONTRIBUTING.md](CONTRIBUTING.md); the short version is in the comments
below. Delete the comments before committing.

## Folder

```text
src/content/courses/<course>/<NN-chapter>/<NN-lesson>/
├── lesson.mdx            the page
├── quiz.json             exactly 6 questions: 1 pre, 3 check, 2 post
└── figures/
    ├── hero.svg          stepped figure, --dg-* tokens only, data-part ids
    └── hero.steps.json   3 to 8 steps, each: show[] and one-sentence note
```

Folder names carry a two-digit order prefix and a stable slug:
`02-boot/03-zygote/`. The URL uses only the slug.

The artifact the reader keeps is the **Your notes** block inside the lesson.
Lessons do not ship shell scripts.

## The three rules that decide whether a lesson works

1. **Open on the reader's question, never on a command.** Name the belief most
   developers hold, quoted, then correct it.
2. **The reader has no device.** Everything load-bearing is readable. Commands
   live in one optional section after the mechanism.
3. **End with something they can say out loud.** A one-screen notes block and
   five to eight interview questions with folded answers.

## lesson.mdx

````mdx
---
title: "Zygote: the pre-warmed template"
motto: "Every app is a copy of one process that already did the slow part."
course: android-internals
chapter: 2
lesson: 3
type: mechanism                 # mechanism | tooling | build
minutes: 25
prerequisites: ["1.4"]          # lesson ids that must come earlier
objectives:                     # 4 to 6, verb first, each testable
  - "Explain why Android does not start a fresh runtime for every app"
  - "Say what a forked copy shares with its parent, and when the sharing ends"
  - "Answer an interviewer who asks why app startup is fast"
terms: ["Zygote", "preloading", "copy-on-write"]   # 3 or 4
verifiedOn: "pending first device run"
stage: outline                  # outline | draft | verified | published
sources: []                     # optional: old post sections this lesson was built from
---

{/* No h1: the layout renders the title and the motto from frontmatter. */}
{/* The pre-lesson quiz question renders here automatically from quiz.json. */}

## You will

- Explain why Android does not start a fresh runtime for every app
- ...

## The question

{/* 1. A situation the reader recognises, concrete, no API names. */}
{/* 2. The wrong belief, quoted as a developer would say it. */}
{/* 3. Two chains: what most developers picture, what actually happens. */}

Most developers explain it this way:

> The quoted belief, in a developer's own voice.

What most developers picture:

```text
Your app
   ↓
open  or  closed
```

What actually happens:

```text
Your app
   ↓
a process, created when needed
   ↓
ended when the system wants the memory
```

## What is actually happening

{/* Two or three claim sub-headings. Under 450 words. Name it last. */}

### A claim in plain words

Short paragraphs.

<Figure src="hero" caption="One sentence stating the finding, not the medium." />

One sentence tying the mechanism to the symptom it explains later.

<Check n={1} />

## Connect it to your code

{/* Start from code the reader has written. Then the rule, as a block quote. */}

```kotlin
// data/SessionCache.kt
object SessionCache {
    var userId: String? = null
}
```

> The rule of thumb, in one sentence.

<Check n={2} />

## See it on your phone (optional)

{/* OMIT this section when there is nothing worth running. */}
{/* At most three one-line commands. No unexplained flags. bash for the */}
{/* command, console for the output, never mixed. */}

You can skip this. The rest of the lesson does not depend on it.

```bash
adb shell ps -A | grep firstprinciples
```

```console
u0_a412  9871  1284  dev.firstprinciples.android
```

One sentence on what to look at.

## When it breaks

{/* 2 to 4 real symptoms, exact strings, plus one wrong way of testing it. */}

**The symptom, named.**

```console
kotlin.UninitializedPropertyAccessException: lateinit property userId has not been initialized
```

Why it happens and what to do.

<Check n={3} />

## Your notes

{/* One phone screen. A chain plus 4 to 6 single-line bullets. No prose. */}

```text
PROGRAM on disk
      ↓
PROCESS 9871
      ↓
process ends
      ↓
PROCESS 10203
```

- One sentence that survives on its own.
- ...

## Interview questions

{/* 5 to 8, Easy to Senior, each with a folded answer, ending with the */}
{/* four-sentence challenge. Rules: references/interview-questions.md */}

**1. (Easy)** The question, phrased the way a person says it.

<details>
<summary>Model answer</summary>

**Hit these points**

- ...
- ...

**A weak answer** stops at "...", which misses ...
</details>

## Words you met

| Term | What people say | What it actually means |
|---|---|---|
| Zygote | "the parent of all apps" | A process started at boot that loads the framework once and then waits; every app is a copy of it. [Docs](…) |

## Go deeper

- [Title](url): why it is worth the reader's time.

**What to skip for now**

- Something a curious reader will find, and the lesson that covers it.

## Where this goes next

{/* One or two sentences. Not a recap. */}
````

## quiz.json

```json
{
  "lesson": "2.3",
  "title": "Zygote: the pre-warmed template",
  "questions": [
    { "stage": "pre",   "question": "", "options": ["", "", "", ""], "correct": 0, "explanation": "" },
    { "stage": "check", "question": "", "options": ["", "", "", ""], "correct": 0, "explanation": "" },
    { "stage": "check", "question": "", "options": ["", "", "", ""], "correct": 0, "explanation": "" },
    { "stage": "check", "question": "", "options": ["", "", "", ""], "correct": 0, "explanation": "" },
    { "stage": "post",  "question": "", "options": ["", "", "", ""], "correct": 0, "explanation": "" },
    { "stage": "post",  "question": "", "options": ["", "", "", ""], "correct": 0, "explanation": "" }
  ]
}
```

Rules are in [CONTRIBUTING.md](CONTRIBUTING.md). No check question may depend
on the optional command section.

## figures/hero.steps.json

```json
{
  "title": "Zygote forks an app process",
  "desc": "One drawing of Zygote, its preloaded framework and two app processes copied from it.",
  "steps": [
    { "show": ["zygote"], "note": "At boot, Zygote starts and loads the framework once." },
    { "show": ["zygote", "fork-1", "app-1"], "note": "A tap on an icon: Zygote forks, the kernel copies the process." }
  ]
}
```

Every `show` id is a `<g data-part="…">` in `hero.svg`. Drawing rules are in
[CONTRIBUTING.md](CONTRIBUTING.md).

## Allowed components in lesson.mdx

| Component | Use |
|---|---|
| `<Figure src caption label? />` | the stepped hero figure, once per lesson |
| `<Check n={1..3} />` | where the three check questions render |
| `<details><summary>` | folded interview answers and optional detours; plain HTML so GitHub renders it too |
| `<Callout kind="note\|good\|warn\|danger" title?>` | an aside, sparingly |
| `<ApiLevel min\|changedIn\|removedIn />` | a version-gated API, at the point of use |
| `<CodeTabs labels>` | Kotlin/Java or Compose/Views, only when the second tab teaches |
| `<Snippet file region />` | code pulled from a lab module at build time |
| ```` ```mermaid ```` | a support flowchart or sequence diagram, at most two |

Anything else is plain markdown. Every fence has a language tag: `bash` for
commands, `console` for output, `kotlin`, `xml`, `json`, `text`, `mermaid`.

## Before you commit

Run the checklist in [CONTRIBUTING.md](CONTRIBUTING.md), then
`npm test && npm run test:unit && npm run typecheck && npm run build`.
One lesson per pull request, subject `feat(<course>/<chapter.lesson>): <slug>`.
