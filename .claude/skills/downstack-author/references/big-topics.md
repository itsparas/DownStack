# Big topics: the modularised layout

Read this when a topic is planned at 10+ lessons or 4+ modules — "teach the whole React", "all of Postgres", "Linux from scratch". A single `topics/<slug>.ts` file at that scale becomes a multi-thousand-line wall that's painful to edit, review, and merge. The fix is a directory: one file per module, an `index.ts` that assembles the Topic.

Nothing outside `packages/content` changes. The registry import resolves to the directory's `index.ts`, and every page (catalog card, topic overview with its per-module lesson tables, reader, prev/next, `/api/topics`) is derived from the data. **The "modularised page" is free** — the topic overview already renders one section per module; a big topic simply renders more sections.

## Layout

```
packages/content/src/topics/react/
├── index.ts            # Topic metadata + assembles modules in ladder order
└── modules/
    ├── mental-model.ts # export const mentalModel: Module
    ├── rendering.ts
    ├── hooks.ts
    ├── fiber.ts
    └── in-the-field.ts
```

`index.ts` shape:

```ts
import type { Topic } from "../../types";
import { mentalModel } from "./modules/mental-model";
import { rendering } from "./modules/rendering";
// ...

export const react: Topic = {
  slug: "react",
  title: "React: from JSX to Fiber",
  // tagline, description, status, outcomes...
  modules: [mentalModel, rendering, hooks, fiber, inTheField],
};
```

Module file shape:

```ts
import type { Module } from "../../../types"; // note: modules/ is one level deeper than index.ts

export const rendering: Module = {
  slug: "rendering",
  title: "Rendering & reconciliation",
  description: "The diff, the commit, and the tree in between.",
  lessons: [ /* Lesson objects, exactly as in a single-file topic */ ],
};
```

If one lesson grows huge (a 25-block flagship), it may get its own file next to its module (`modules/rendering.what-is-a-rerender.ts` exporting a `Lesson`, imported by the module file). Don't pre-split; do it when a module file passes ~600 lines.

**A live example of this layout exists in the repo: `packages/content/src/topics/react/`.** Copy its structure.

## Decomposing a "whole X" topic

The Depth Ladder is the decomposition method. Walk it top to bottom and ask, at each stratum, "what must the reader be able to do here?" — those answers become modules:

1. **Intuition module(s):** the problem X solves, rebuilt from first principles — usually by making the reader build (or watch collapse) the naive alternative. One module, first in the list.
2. **Mechanics module(s):** observable daily-driver behavior. Often 2 modules for big topics — split along the topic's own major seams (for React: rendering vs. hooks; for Postgres: queries vs. transactions).
3. **Internals module:** below the API line. The data structures, the scheduler, the disk format.
4. **Field module:** production. Profiling, failure modes, the 3 a.m. version. Always last, always present — a "whole X" topic that ends at internals teaches a machine nobody operates.

Sizing rules: 3–6 lessons per module (split a module that hits 7); 10–30 minutes per lesson (split a lesson that needs more — a "part 1 / part 2" pair beats a 50-minute slog); each module `description` is one sentence in the mentor voice. Order modules strictly in ladder order; within a module, order lessons so each one's `predict` blocks are answerable from what came before.

## Worked example: "the whole React"

The decomposition that produced `topics/react/` — use it as the template for other whole-X requests:

| Module (depth) | Lessons |
| --- | --- |
| The mental model *(intuition)* | UI as a function of state · What JSX actually compiles to |
| Rendering & reconciliation *(mechanics)* | A re-render is not a DOM update · Keys: identity, not uniqueness · State updates and batching |
| Hooks, rebuilt from scratch *(mechanics)* | Rebuild useState in 40 lines · useEffect and the lifecycle that isn't · Stale closures: the classic |
| Fiber & scheduling *(internals)* | Fiber: rendering as interruptible work · Lanes: how updates get priorities · What concurrent rendering interrupted |
| React in the field *(field)* | Profiling real waste · memo, useMemo, and superstition · Suspense and server components in production |

14 lessons, 5 modules, full ladder coverage. Flagship = "A re-render is not a DOM update" (the topic's biggest misconception, so the highest-leverage intuition/mechanics lesson).

## Converting an existing single-file topic

1. `mkdir packages/content/src/topics/<slug>` and create `modules/`.
2. Move each `Module` object literal into its own `modules/<module-slug>.ts` with a named export.
3. Create `index.ts` assembling them; keep the same exported const name if the slug is unchanged, so the registry import only changes its path (or not at all — `"./topics/<slug>"` resolves to the directory's index).
4. Delete the old file. Run `pnpm typecheck && pnpm build`; the route list in the build output must be identical to before the move (unless you also renamed slugs — see slug rules in SKILL.md).
