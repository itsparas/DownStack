# Downstack — Design Document

*Rev B · An engineering school for the layer beneath*

## 1. Vision

Most technical education stops at the API line. It tells you which function to call and what the parameters mean, and when you ask *why* — why does the index slow down writes, why did `setTimeout(fn, 0)` take four seconds, why did the database acknowledge a commit it then forgot — the documentation goes quiet. The engineers who can answer those questions learned the answers the expensive way: from incidents, from mentors, from a decade of being paged.

Downstack's premise is that this mentorship can be designed. Not simulated with a chatbot veneer, but structurally encoded: the moves a great mentor makes — forcing you to predict before revealing, telling the story of the outage that taught them, redlining the mistake everyone makes, naming the mental model so you can carry it out of the room — are identifiable, repeatable moves. Downstack turns those moves into the content format itself.

The name comes from the goal: every topic is taught down the stack, to the layer beneath the one you normally touch. The scope is deliberately ambitious — a "mega" app spanning many engineering topics (databases, language runtimes, operating systems, networking, framework internals, distributed systems), each taught from absolute scratch to production-grade depth. Names considered and set aside: *Bedrock* (taken, many times over), *Substrate* (the Rev A name — right feel, but no available domain), *Understrate*, *Bedplate*, *Machinefloor*. *Downstack* won because it is the thesis in one word, it's two syllables anyone can say and spell, and downstack.dev / downstack.io were verified available (registry RDAP, 2026-07-17 — register before this goes stale).

## 2. Pedagogy: the Mentor Method and the Depth Ladder

Two ideas structure everything else in this document.

### The Depth Ladder

Every topic descends the same four strata, and every lesson is tagged with the stratum it lives in. **Intuition** answers why the thing exists at all, rebuilt from first principles the reader already has — often by having them build a naive version themselves and feel where it breaks. **Mechanics** covers how it actually behaves: the moving parts, their rules, the observable behavior an engineer relies on daily. **Internals** goes below the API line — memory layouts, disk formats, wire protocols, scheduler queues — the "each and every detail" layer. **Field** is how real teams run it in production: operational patterns, failure modes, the 3 a.m. version of the topic.

The ladder does two jobs. For the learner, it makes "advanced" legible: advanced isn't a vibe, it's a position in the section view, and you always know which layer you're standing on. For authors, it's a completeness check: a topic isn't done until it has sheets at every depth. This directly maps the founding requirement — scratch → advanced → real engineering use cases → internals — onto a structure the whole product can render, badge, filter, and navigate.

### The Mentor Method

The difference between documentation and mentorship is not tone; it's a set of concrete moves. Downstack identifies six and makes each one a first-class content type:

**Predict-before-reveal** is the highest-leverage move in all of teaching. When a mentor asks "what do you think happens?" and waits, they force you to run your current mental model to its edge — and the gap between your prediction and reality is where learning actually occurs. Downstack renders these as interactive cards that hide the answer behind an explicit commitment ("I've committed — reveal"). The reader cannot passively scroll past the thinking.

**War stories** ("field reports" in the UI) are how experience transfers. A concrete incident — the health check that lied, the counters that went backwards — carries a lesson in a form the brain is built to retain: narrative, stakes, resolution. Authoring guideline: every story must be time-boxed, specific, and end with the transferable lesson stated plainly. No fables.

**Pitfalls** ("redlines") name the mistake before the reader makes it, and — critically — explain *why the wrong belief feels right*. "Durability theater" isn't just "remember to fsync"; it's an account of why `write()` returning success is such a convincing lie.

**Mental models** are named, portable abstractions ("the index tax," "the kitchen with one chef"). Naming matters: a named model can be recalled under pressure and referenced across lessons.

**Deep dives** keep the internals honest without hazing beginners. They're collapsible descents one level below what the lesson strictly needs — the page cache and fsyncgate under a lesson about append-only logs. Curious readers descend; others keep momentum. This is how one lesson serves both the newcomer and the senior engineer.

**Checkpoints and field notes** close every lesson: a quiz whose wrong answers each get their own explanation (wrong answers are diagnostic — each one reveals a specific broken model worth repairing), and takeaways phrased as things the reader *can now say out loud*, not chapter summaries.

The voice guideline for all prose: write like a specific senior engineer talking to one person across a whiteboard. First person is allowed. Opinions are allowed and flagged as opinions. Rhetorical questions, direct address, and dry humor are encouraged. Hedging, passive voice, and encyclopedic throat-clearing are not.

## 3. Content model

The pedagogy is enforced by types, not by editorial discipline alone. A lesson is a sequence of typed blocks (`prose`, `heading`, `code`, `mentor`, `warstory`, `pitfall`, `model`, `predict`, `deepdive`, `quiz`, `takeaways`, `divider`), defined in `packages/content/src/types.ts`. Structure above the lesson is conventional: a **Topic** has outcomes ("after this topic you can…", written as capabilities, never chapter names) and **Modules**; a module has **Lessons**; each lesson carries a slug, a one-sentence hook, a depth tag, an estimated time, and a status (`ready` or `soon` — outlines ship visibly, marked "in drafting," so the map of the territory is public before every sheet is drawn).

Inline formatting inside prose supports a deliberately tiny grammar — bold, italic, inline code, links, and `[[term]]` glossary marks — and nothing else. The constraint is intentional: it keeps the craft in the writing rather than the formatting, and it makes the custom renderer trivial and safe.

**The simple-English rule.** Lessons are written so a smart newcomer can follow them; jargon is never load-bearing without support. When a genuinely difficult word is unavoidable, its first meaningful use in a lesson is marked `[[like this]]` and defined in the central glossary (`packages/content/src/glossary.ts`) in one to three plain-English sentences. In the reader, marked words render with a dotted underline; clicking one opens a small card with the plain-English explanation and a "search the web" button that opens a pre-filled search in a new tab. The pedagogy: nobody should lose a paragraph to one unknown word, and looking a word up should never mean losing your place.

Content lives as typed TypeScript data in `@downstack/content`. This was chosen over MDX for v1 for three reasons: the type system enforces the pedagogy (you cannot author a lesson the compiler doesn't recognize as one); the data is directly consumable by both the React pages and the JSON API with zero parsing; and refactors to the schema are compiler-guided across all content. The cost is authoring ergonomics at scale — long prose in template strings is workable but not lovely — so the roadmap includes an MDX pipeline that compiles to this same block schema, keeping the types as the contract while improving the writing experience.

Launch catalog: **Databases from first principles** and **JavaScript: the runtime** ship with fully written flagship lessons ("A database in two shell functions"; "setTimeout is a lie") plus outlined modules; **Operating systems**, **Networking**, **React internals**, and **Distributed systems** ship as drafted outlines. The flagship lessons exist to set the quality bar concretely — every future sheet is measured against them.

## 4. Information architecture and reading experience

Four page types, one API. The **landing page** carries the thesis ("Most courses teach you the API. Downstack teaches you the machine."), draws the depth ladder as a literal cross-section figure, and — importantly — demonstrates the mentor method with *live components*, not screenshots: a real mentor note, a real predict card the visitor can click. The product's differentiator is interactive; the pitch for it must be too. The **topics catalog** lists the drawing set. The **topic overview** is the contract page: outcomes, a title block of stats, per-module lesson tables with depth badges and time estimates, and local progress. The **lesson reader** is where the product lives: a title-block header (sheet number, depth, time, revision), the rendered block sequence in a measure capped around 65–70 characters, a "sheet index" rail on wide screens, a mark-complete control, and previous/next navigation that walks only issued sheets.

Reader decisions worth recording: interactivity is opt-in per block (predicts and deep dives are closed by default) so reading momentum belongs to the reader; code is syntax-highlighted at build time on the server, shipping zero highlighting JavaScript; anchors are generated from headings so every section is linkable. Progress is `localStorage` in v1 — honest about its limits (per-device, clearable) and shaped (`downstack:done:{topic}/{lesson}`) for a one-loop migration to accounts later.

The one API route, `GET /api/topics`, returns the full catalog as JSON from the same content package the pages read. It exists to make the architectural point concrete: Next.js is the backend too, and the API cannot drift from the UI because they share a source of truth.

## 5. Visual design language

The aesthetic (Rev B) is **the engineering drawing on warm paper**, in the register of the Claude / Anthropic design language: an ivory ground, near-black ink, a barely-there drafting grid, soft corners, and annotations in the vocabulary of a drawing set. Rev A was a dark blueprint; Rev B keeps every drafting-table signature but moves it onto paper because long-form reading is the product, and warm paper with high-contrast ink is the easiest surface to read on for an hour. The drawing-set metaphor survives intact — it just switched from blueprint to vellum.

The palette: ink `#FAF9F5` (the paper ground), panel `#F1EFE7` and raised `#E8E5D9` (surfaces), line `#DDD8CA` (rules and grid), chalk `#1F1E1C` → chalkdim `#45423B` → chalkfaint `#767268` (a three-step text ramp). Four accent hues are not decoration but *semantics*, mapped one-to-one onto the depth ladder and its associated block types: terracotta amber `#AE5630` (intuition; mentor notes; glossary terms; primary actions — the Claude-coral register), kraft copper `#8A5A2B` (mechanics; field reports), deep trace teal `#1F7A8C` (internals; deep dives; checkpoints), field green `#4E7D45` (in the field; mental models; completion). Redline `#B42318` is reserved for pitfalls and errors — the color literally used for corrections on drawings. All tokens keep their Rev A semantic names, so the entire retheme lives in `@theme` in `globals.css`. A reader learns the color system without being told.

There is also a **dark theme** — the same drafting table with the lights off: warm charcoal ground, ivory ink, the accents brightened one step (amber becomes Claude-coral `#D97757`). It is a straight variable override under `:root[data-theme="dark"]`; a no-flash inline script stamps the attribute before first paint (stored choice, else system preference), a toggle in the nav flips it, and shiki code blocks carry both themes (`vitesse-light` / `vesper`) in one render.

Typography is serif-led, the Claude voice: **Source Serif 4** (variable) for both display and body — headings and prose speak with one voice, and a serif at ~1.075rem with generous leading signals "essay," not "docs"; **JetBrains Mono** for code and for the annotation layer — the small uppercase, letter-spaced labels ("FIELD REPORT — INCIDENT RECORD") that do the drafting-callout work. Code highlighting uses shiki's warm `vitesse-light` theme. Fonts are self-hosted via Fontsource packages.

Signature elements, so the product is recognizable at a glance: the **title block** on every lesson header (sheet no. / scale / est. time / rev), borrowed directly from drawing sets; **annotation labels** with leader lines introducing every callout; the **strata figure** on the landing page, drawn as an animated section view (stroke draw-in, disabled under `prefers-reduced-motion`); the faint **drafting grid** behind heroes; and lesson numbering as "sheets." Motion is minimal and functional — reveals, hovers, one hero animation. Density is editorial: wide margins, a strict measure, whitespace doing the hierarchy work.

## 6. Technical architecture

The repository is a Turborepo monorepo with pnpm workspaces. `apps/web` is a Next.js 15 App Router application — the only deployable — and it is both frontend and backend: pages and route handlers in one process, sharing packages. `packages/content` is the courseware as typed data plus a small query layer (registry, flatteners, neighbor navigation, counting). `packages/ui` holds the mentor components — everything that renders a block — kept framework-app-agnostic (plain React + Tailwind classes) so a future second surface (docs site, embed) reuses them. `packages/typescript-config` shares compiler bases. Turbo's graph (`build` depends on `^build`, dev uncached and persistent) is modest today but is the scaffolding that keeps a growing repo — more apps, a future `packages/mdx-pipeline` — fast and coherent.

Rendering strategy: nearly everything is React Server Components, statically generated. Topic and lesson pages use `generateStaticParams` over ready content, so the whole site prerenders at build time; syntax highlighting (shiki) runs on the server inside an async RSC. Client JavaScript is confined to the four components that need state: predict cards, quizzes, deep-dive toggles, and progress. This keeps the reader fast on the media most lessons will be read on, and it means content updates are deploys, not database writes — the right trade until authoring frequency demands otherwise.

Styling is Tailwind CSS v4, CSS-first: design tokens are declared in `@theme` in `globals.css` (colors, font stacks) and the UI package is included via `@source`, so shared components and app code draw from one token set. Next's `transpilePackages` handles the workspace packages.

Notable decisions and their reasoning, briefly. *Typed TS content over a CMS or MDX*: compiler-enforced pedagogy and zero-infrastructure v1; revisit at authoring scale. *localStorage progress over auth*: accounts are a distraction until content proves out; the key schema is migration-ready. *Server-side shiki over client highlighters*: bytes and correctness. *A real API route even though pages don't need it*: it demonstrates the Next-as-backend requirement and gives future clients a stable read surface.

## 7. Roadmap

**Phase 2 — accounts and memory.** Auth (likely Auth.js) with a small database (SQLite/Turso or Postgres via Drizzle) behind the same Next route handlers; progress sync that imports the localStorage keys; per-lesson notes; spaced-repetition resurfacing of takeaways and missed quiz answers.

**Phase 3 — the lesson as a lab.** Embedded runnable playgrounds where the topic allows it — JS in a worker or WebContainer, SQL against SQLite compiled to WASM — so predicts become experiments the reader runs. Diagram blocks with the same drafting language. Per-heading deep links with share cards.

**Phase 4 — the AI mentor.** A question box inside every lesson, grounded in that lesson's blocks and the topic's mental models, in the mentor voice — useful precisely because the content is structured data an assistant can be pointed at. Also: an MDX authoring pipeline compiling to the block schema, and community field reports (submitted war stories, editorially reviewed).

## 8. Risks and mitigations

The dominant risk is **content cost**: mentor-grade lessons are expensive to write, and the format's promise dies if sheets are thin. Mitigations: the block schema makes quality structural rather than aspirational; flagship lessons set a visible bar; outlines ship as "in drafting" so scope is honest. Second, **voice at scale** — many authors, one mentor register — mitigated by the authoring guidelines in §2 and, eventually, editorial review tooling. Third, **format fatigue**: if every lesson deploys every block type on a fixed rhythm, the moves become wallpaper; guideline is restraint (a war story earns its place or is cut). Fourth, **schema lock-in**: content as code means schema changes touch content; mitigated by keeping blocks additive and letting the compiler drive migrations. Finally, **the interactivity ceiling** — predicts and quizzes are engagement floor, not ceiling; Phase 3 exists because reading about systems is ultimately weaker than poking them.

---

*End of Rev A. The next revision of this document should follow the first ten issued sheets and the first real reader feedback.*
