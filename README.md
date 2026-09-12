# First Principles

Open-source Android courses, explained one layer below the API.

> **Live site:** https://blogs.mabuilds.in

Most Android material teaches the API. You learn `ViewModel`, you learn
`WorkManager`, and then something happens that no API page explains: a value is
empty when the user comes back, a release build crashes where debug did not, a
list stutters on a cheap phone. The answer is never in the API you were using.
It is one layer below it.

These courses walk that layer, in order, with nothing used before it is taught.

## Who it is for

An Android engineer about a year in. You write Kotlin and Compose daily. You
have typed `adb` once, when a tutorial told you to. You have never read the
Android source, and you have never needed to.

**You do not need a device plugged in.** Every lesson is complete as reading.
Each one has a single optional section where you can confirm the mechanism on a
phone if you have one to hand.

## Start here

**Android Internals: from power button to pixel.** Six chapters, thirty-one
lessons planned, seven written.

Begin at `src/content/courses/android-internals/01-process/01-your-app-is-a-process/`,
or open the course on the site and press the first lesson.

| Chapter | Lessons | Status |
|---|---|---|
| 1. The Linux underneath your app | 7 | written |
| 2. Boot: from power button to launcher | 4 | planned |
| 3. The runtime: from Kotlin to running code | 5 | planned |
| 4. Binder: how processes talk | 4 | planned |
| 5. Launch: from a tap to onResume | 5 | planned |
| 6. Frames: from a value to a pixel | 6 | planned |

**One thing to know.** The optional "See it on your phone" sections show the
shape of each command's output rather than a capture from a specific device.
Process ids, memory figures and core counts differ on every phone, and the
lessons say so where it matters. Everything else, including every error string,
is checked.

## The shape of a lesson

Every lesson is the same seven beats, so you learn the shape once and never
spend attention on navigation again.

```text
The question                what you already wonder, and the answer most
                            developers give, which is usually wrong
What is actually happening  the mechanism, with one stepped figure
Connect it to your code     the same mechanism in the Kotlin you write
See it on your phone        optional, one short command
When it breaks              the real symptoms, with the real error text
Your notes                  one screen, built to copy into your notes app
Interview questions         five to eight, with model answers folded away
```

Three rules hold it together. One idea per lesson. Nothing is used before it is
taught. Nothing is invented: every command, every error string and every link is
run or read before it ships, and anything unverified is marked on the page.

## Run it locally

```bash
npm install
npm run dev
```

Then open the address it prints. Other commands:

```bash
npm run build        # static site into dist/
npm test             # content and theme rules
npm run test:unit    # unit tests
npm run typecheck
```

`npm run build` reads `SITE_URL` for canonical links and the sitemap, and falls
back to localhost. Set it in your deploy environment.

To deploy the static output to Cloudflare, set `SITE_URL` and run
`npm run deploy`. Wrangler uploads `dist/` as static assets; no Cloudflare
runtime adapter is needed.

## Contributing

Every lesson is a folder of plain files: the page, its questions and its
figure. Fixing a sentence, adding a failure mode with the real error text, or
writing a whole lesson all work the same way.

Read [CONTRIBUTING.md](CONTRIBUTING.md). The skeleton to copy is in
[LESSON_TEMPLATE.md](LESSON_TEMPLATE.md). If you are using an AI agent,
[AGENTS.md](AGENTS.md) holds the rules it needs.

## Licence

Code is [MIT](LICENSE). The course content, meaning the prose, figures and
questions under `src/content/`, is
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/): use it, adapt
it, credit it, and share adaptations under the same terms.
