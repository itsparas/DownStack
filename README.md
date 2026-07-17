# Downstack

**Learn down the stack.** An engineering school that teaches topics the way a senior engineer would across a whiteboard — from first principles, down to the internals, with the production scars to prove it.

Built as a Turborepo monorepo with Next.js serving as both frontend and backend.

## Quickstart

```bash
corepack enable        # activates pnpm (declared in package.json)
pnpm install
pnpm dev               # → http://localhost:3000
```

Other commands: `pnpm build` (production build of everything via Turbo), `pnpm typecheck`.

## Structure

```
downstack/
├── apps/
│   └── web/                  # Next.js 15 (App Router) — pages, reader, /api routes
│       ├── app/              # routes: /, /topics, /topics/[topic]/[lesson], /api/topics
│       └── components/       # code-block (shiki), lesson-renderer, nav, progress, toc
├── packages/
│   ├── content/              # @downstack/content — the courseware, as typed data
│   │   └── src/
│   │       ├── types.ts      # the block schema (the pedagogy lives here)
│   │       └── topics/       # one file per topic
│   ├── ui/                   # @downstack/ui — mentor components (callouts, predict, quiz…)
│   └── typescript-config/    # shared tsconfig bases
├── turbo.json
└── DESIGN.md                 # the full design document
```

## How teaching works here

A lesson is **not markdown** — it's a sequence of typed blocks, and the block types encode the mentor method: `predict` forces a commitment before the reveal, `warstory` carries a production incident, `pitfall` redlines the classic mistake, `model` names a reusable mental model, `deepdive` descends one optional level, `quiz` checkpoints understanding.

Lessons are written in **simple English**. When a difficult word is unavoidable, mark it inline as `[[word]]` and give it a plain-English entry in `packages/content/src/glossary.ts` — readers click the word to get the explanation in place, plus a web-search button. See the `Md` doc comment in `types.ts` for the full inline grammar.

Authoring a lesson means writing data in `packages/content/src/topics/`:

```ts
{
  slug: "settimeout-is-a-lie",
  title: "setTimeout is a lie",
  hook: "Why '0 milliseconds' can take 4 seconds.",
  depth: "intuition",          // intuition | mechanics | internals | field
  minutes: 20,
  status: "ready",
  blocks: [
    { type: "prose", md: "Run this and **predict the order** before reading on." },
    { type: "code", language: "js", filename: "puzzle.js", code: "…" },
    { type: "predict", question: "What prints first?", reveal: "…because the call stack…" },
    { type: "pitfall", title: "Blocking the loop", md: "…" },
    { type: "takeaways", items: ["…"] },
  ],
}
```

Add the topic to the registry in `packages/content/src/index.ts` and every page — catalog, overview, reader, prev/next nav, the `/api/topics` endpoint — picks it up automatically.

## Status

Two topics have issued sheets (Databases, JavaScript runtime); four more are outlined ("in drafting"). Progress is stored in `localStorage` for now. See `DESIGN.md` for the pedagogy, the visual language, the architecture, and the roadmap (auth + DB progress, embedded playgrounds, AI mentor).

## Authoring with Claude

The repo ships a project skill at `.claude/skills/downstack-author/` — open the repo in Claude Code and ask for content ("write the B-trees lesson", "add a Rust topic", "teach the whole Kubernetes") and Claude follows the house pedagogy, file layouts, and verification steps automatically. Big topics get the modularised directory layout documented in the skill's `references/big-topics.md`; `packages/content/src/topics/react/` is the live example.
