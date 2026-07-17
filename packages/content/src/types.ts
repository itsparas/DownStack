/**
 * Downstack content schema.
 *
 * The whole teaching philosophy lives in this file. A lesson is not a wall of
 * markdown — it is a sequence of typed blocks, and the block types ARE the
 * pedagogy. Every lesson automatically gets the shape of a great mentor's
 * explanation: narrative prose, moments where the reader must predict before
 * they're told, war stories from production, named mental models, redlined
 * pitfalls, and optional dives below the floorboards.
 */

/** Where a lesson sits on the depth ladder. */
export type Depth = "intuition" | "mechanics" | "internals" | "field";

export const DEPTHS: Record<
  Depth,
  { label: string; blurb: string }
> = {
  intuition: {
    label: "Intuition",
    blurb: "Why this exists, built from first principles you already have.",
  },
  mechanics: {
    label: "Mechanics",
    blurb: "How it actually behaves — the moving parts and their rules.",
  },
  internals: {
    label: "Internals",
    blurb: "Below the API line: memory, disk, wire, scheduler.",
  },
  field: {
    label: "In the field",
    blurb: "How real teams run it in production, and where it bites.",
  },
};

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

/**
 * Inline markup inside `md` strings supports a deliberately tiny grammar:
 * **bold**, *italic*, `code`, [links](https://…), and [[term]] for glossary
 * words. Paragraphs are separated with blank lines. Nothing else —
 * constraints keep the voice in the writing, not the formatting.
 *
 * The simple-English rule: write so a smart newcomer can follow. When a
 * genuinely difficult word is unavoidable, mark its first meaningful use
 * per lesson as `[[word]]` (or `[[displayed form|key]]` when they differ)
 * and make sure the key exists in glossary.ts with a plain-English
 * explanation. Readers click the word to get the explanation and a
 * web-search button — nobody should lose a paragraph to one unknown word.
 */
export type Md = string;

export interface ProseBlock {
  type: "prose";
  md: Md;
}

/** Section heading. Rendered with an anchor and picked up by the sheet index (TOC). */
export interface HeadingBlock {
  type: "heading";
  text: string;
}

export interface CodeBlock {
  type: "code";
  language: string;
  code: string;
  filename?: string;
  caption?: Md;
}

/** A short aside in the mentor's own voice — the thing they'd say leaning back from the whiteboard. */
export interface MentorBlock {
  type: "mentor";
  md: Md;
}

/** A true-shaped story from production. Concrete, time-boxed, with a lesson inside it. */
export interface WarStoryBlock {
  type: "warstory";
  title: string;
  md: Md;
}

/** A redlined mistake: what people get wrong, why it feels right, what it costs. */
export interface PitfallBlock {
  type: "pitfall";
  title: string;
  md: Md;
}

/** A named mental model the reader can carry out of the lesson. */
export interface ModelBlock {
  type: "model";
  title: string;
  md: Md;
}

/**
 * Pause-and-predict. The single highest-leverage teaching move:
 * force a prediction before the reveal, so the reader finds the edge
 * of their own model. Rendered as an interactive card.
 */
export interface PredictBlock {
  type: "predict";
  question: Md;
  reveal: Md;
}

/** Collapsible descent one level deeper than the lesson needs. Optional by design. */
export interface DeepDiveBlock {
  type: "deepdive";
  title: string;
  md: Md;
  code?: {
    language: string;
    code: string;
    filename?: string;
  };
}

export interface QuizOption {
  text: string;
  correct?: boolean;
  /** Shown after answering — explains why this option is right or wrong. */
  explanation: Md;
}

export interface QuizBlock {
  type: "quiz";
  question: Md;
  options: QuizOption[];
}

/** What the reader should be able to say out loud after the lesson. */
export interface TakeawaysBlock {
  type: "takeaways";
  items: Md[];
}

export interface DividerBlock {
  type: "divider";
}

export type Block =
  | ProseBlock
  | HeadingBlock
  | CodeBlock
  | MentorBlock
  | WarStoryBlock
  | PitfallBlock
  | ModelBlock
  | PredictBlock
  | DeepDiveBlock
  | QuizBlock
  | TakeawaysBlock
  | DividerBlock;

/* ------------------------------------------------------------------ */
/* Structure                                                           */
/* ------------------------------------------------------------------ */

export type LessonStatus = "ready" | "soon";

export interface Lesson {
  slug: string;
  title: string;
  /** One-sentence hook — the question this lesson answers. */
  hook: string;
  depth: Depth;
  minutes: number;
  status: LessonStatus;
  blocks: Block[];
}

export interface Module {
  slug: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Topic {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  status: "ready" | "soon";
  /** "After this topic you can…" — written as capabilities, not chapter names. */
  outcomes: string[];
  modules: Module[];
}
