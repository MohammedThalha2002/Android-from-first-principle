## What this changes

<!-- One sentence. -->

## Kind of change

- [ ] Fix to an existing lesson
- [ ] New failure mode, with the real error text
- [ ] Figure
- [ ] New lesson
- [ ] Site code, tooling or docs

## How you checked it

<!-- For any technical claim: the device and Android version you ran it on, or
the page you read. Anything you could not check should be marked VERIFY in the
file and named here. -->

## Checklist

- [ ] One lesson folder touched
- [ ] Sections in the template order, `<Check n={1..3} />` present in order
- [ ] `quiz.json` valid; interview questions end with the four-sentence challenge
- [ ] Every fence tagged; no mixed command and output blocks
- [ ] No banned words, no em dashes
- [ ] `npm test && npm run test:unit && npm run typecheck && npm run build` green
