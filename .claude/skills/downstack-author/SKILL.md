---
name: downstack-author
description: Author topics, modules, and lessons for the Downstack learning app and wire them into the site. Use this skill whenever the user asks to add, write, expand, restructure, or edit learning content in this repo — a new topic ("add a Rust topic", "teach the whole React"), new lessons or modules, turning notes/outlines into lessons, splitting a big topic into a modularised layout, or adding a new lesson block type. Also use it before touching anything in packages/content or the lesson-rendering pipeline, even if the user doesn't say the word "lesson".
---

# Downstack Author

Downstack teaches engineering topics the way a senior mentor would: down the **Depth Ladder** (intuition → mechanics → internals → field) using the **Mentor Method** (predict-before-reveal, war stories, redlined pitfalls, named mental models). Both are enforced *structurally*: a lesson is not markdown, it is typed data, and the block types are the pedagogy.

**The golden rule: content is data; pages are data-driven.** Adding a topic, module, or lesson never requires touching `apps/web`. If you find yourself editing a page component to add content, stop — you're doing it wrong. You only touch `apps/web` or `packages/ui` when adding a *new block type* (see "Extending the system").

## Read these before writing anything

1. `packages/content/src/types.ts` — the block schema. The doc comments are the authoring spec.
2. `packages/content/src/topics/databases.ts` — the flagship lesson ("A database in two shell functions"). This is the quality and voice bar. Match it.
3. `packages/content/src/index.ts` — the registry. A topic exists when it's imported here and added to `topics[]`.

## The pedagogy contract

Every lesson has a `depth` tag. A topic is only complete when its modules cover all four depths, in ladder order — intuition modules first, field modules last.

A lesson with `status: "ready"` MUST contain, somewhere in its blocks:

- At least one `predict` block (the single highest-leverage move — force a commitment before the reveal; the question must be answerable from what the reader has seen so far).
- At least one `quiz` with a per-option `explanation` for **every** option, including wrong ones (each wrong answer diagnoses a specific broken mental model — say which).
- A closing `takeaways` block whose items are phrased as things the reader *can now say out loud*, not chapter summaries.
- A `mentor`, `warstory`, `pitfall`, or `model` block wherever the topic has a classic trap or a production lesson — but only where earned. If every lesson deploys every block type on a fixed rhythm, the moves become wallpaper.

Lessons that are planned but unwritten get `status: "soon"` and `blocks: []`. Ship the map before the territory — stubs render as "in drafting" throughout the UI and are excluded from routing, progress, and prev/next navigation automatically.

### Voice rules (for all `md` strings)

Write like one specific senior engineer talking to one person across a whiteboard. First person allowed; opinions allowed and flagged as opinions; rhetorical questions and dry humor encouraged. Forbidden: hedging, passive voice, encyclopedic throat-clearing ("In this lesson we will..."), and bullet lists doing the work prose should do. War stories must be time-boxed, concrete, and end with the transferable lesson stated plainly — no fables.

**Simple English is the house register.** Write so a smart newcomer can follow without rereading: short sentences over stacked clauses, everyday words over rare ones, one idea per sentence. Simple is not shallow — the technical content stays exact; only the language gets plainer.

**Glossary marks.** When a genuinely difficult technical word is unavoidable, mark its *first meaningful use per lesson* as `[[word]]` (or `[[displayed form|key]]` when they differ — plurals, capitalisation). Every key you use must exist in `packages/content/src/glossary.ts` with a 1–3 sentence plain-English definition (rules are in that file's header). Marked words render as clickable terms that open the explanation in place, with a web-search button. Never nest `[[...]]` inside bold/italic/backticks/links — the parser is flat. Don't mark everyday words, and don't re-mark the same term throughout a lesson.

Inline `md` supports **only** `**bold**`, `*italic*`, `` `code` ``, `[links](url)`, and `[[term]]`. Paragraphs are separated by blank lines. Nothing else renders — no headings-in-md, no lists, no HTML. Headings are their own block type. Glossary marks only work in `md`-typed fields (prose, callouts, predict/quiz questions and explanations, takeaways, captions) — not in titles, hooks, heading text, or quiz option `text`.

**Originality:** write your own code examples and stories. Never reproduce passages from books, docs, or courses. Stories may be true-shaped composites; keep them plausible and don't attribute them to named real companies or people.

## Workflow: adding or expanding a topic

**Step 1 — Plan on paper first.** Produce: (a) 3–6 `outcomes` written as capabilities ("Explain what a re-render actually does to the DOM"), never chapter names; (b) a module map covering all four depths; (c) a lesson list with `slug`, `title`, one-sentence `hook`, `depth`, `minutes` (10–30), `status`. Show the plan to the user before writing lesson prose if the topic is new.

**Step 2 — Choose the file layout by size.**

- Small topic (≤ ~10 lessons, ≤ 3 modules): one file, `packages/content/src/topics/<slug>.ts`, exporting `const <camelSlug>: Topic`. See `networking.ts`.
- Big topic ("teach the whole React", 10+ lessons or 4+ modules): a directory with one file per module. **Read `references/big-topics.md` in this skill before proceeding** — it has the layout, a worked decomposition method, and points at the live example in `packages/content/src/topics/react/`.

**Step 3 — Write the flagship first.** Every new topic ships with exactly one fully-written `ready` lesson (its best "intuition" lesson) and the rest as `soon` stubs. The flagship proves the topic's voice; stubs prove its scope.

**Step 4 — Register.** Import the topic in `packages/content/src/index.ts` and add it to the `topics[]` array (array order = display order). Nothing else. Routes, catalog cards, overview page, reader, prev/next nav, and `/api/topics` all derive from the registry.

**Step 5 — Verify.** From the repo root:

```bash
pnpm typecheck && pnpm build
```

The build output lists every generated route. Confirm your topic appears under `/topics/[topic]` and each `ready` lesson appears under `/topics/[topic]/[lesson]`. A `soon` lesson appearing as a route, or a `ready` lesson missing, means a status field is wrong.

## Slug rules

Kebab-case. Lesson slugs must be unique **within their topic across all modules** — routes are flat (`/topics/<topic>/<lesson>`), so two modules cannot both contain a lesson slugged `basics`. Prefer descriptive slugs (`what-jsx-compiles-to`) that stay meaningful if the lesson moves between modules. Never change a slug after a lesson has shipped `ready` — it breaks links and stored progress.

## Extending the system (new block type)

Only when an authoring need genuinely doesn't fit existing blocks:

1. Add the interface to the `Block` union in `packages/content/src/types.ts`, with a doc comment stating the pedagogical purpose (if you can't state one, it's not a block type).
2. Add the component to `packages/ui/src/` and export it from `packages/ui/src/index.ts`. Mark it `"use client"` only if it holds state. Follow the existing annotation-label + accent-color conventions in `callouts.tsx` (colors carry meaning: amber=intuition/mentor, copper=mechanics/warstory, trace=internals/deepdive/quiz, fieldgreen=field/model, redline=pitfall only).
3. Wire it into the `switch` in `apps/web/components/lesson-renderer.tsx`. If it contains code, render code on the server and pass it as `children` (see how `deepdive` does it).

Then update the pedagogy contract in this SKILL.md if the new block changes what a `ready` lesson must contain.

## Quality checklist before finishing

Run through this for every `ready` lesson you wrote: depth tag matches the actual content level; ≥1 predict, answerable from prior context; quiz explanations exist for every option; takeaways are "can now say" statements; every code block runs as written (mentally execute it — better, actually run it); hooks are one sentence and specific; total `minutes` is honest; the language passes the simple-English bar and every difficult word is `[[marked]]` with a glossary entry that exists; `pnpm typecheck && pnpm build` pass; new routes appear in build output.
