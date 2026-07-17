import type { Module } from "../../../types";

/** Intuition — SQL as a language for questions. Lessons being written. */
export const speakingSql: Module = {
  slug: "speaking-sql",
  title: "Speaking SQL",
  description:
    "SQL is not a programming language, it's a way of asking questions — learn the four shapes almost every question takes.",
  lessons: [
    {
      slug: "select-asking-questions",
      title: "SELECT: asking questions",
      hook: "WHERE, ORDER BY and LIMIT — the anatomy of almost every question you will ever ask a database.",
      depth: "intuition",
      minutes: 20,
      status: "soon",
      blocks: [],
    },
    {
      slug: "joins-are-matching",
      title: "Joins are just matching",
      hook: "A JOIN is two lists and a matching rule — the scary diagrams are hiding something simple.",
      depth: "intuition",
      minutes: 20,
      status: "soon",
      blocks: [],
    },
    {
      slug: "null-the-third-truth",
      title: "NULL: the third truth value",
      hook: "NULL is not zero, not empty, not equal to itself — and it silently eats rows from your results.",
      depth: "intuition",
      minutes: 15,
      status: "soon",
      blocks: [],
    },
    {
      slug: "group-by-to-windows",
      title: "From GROUP BY to window functions",
      hook: "Collapse rows to summarize them — or keep the rows and let each one peek at its neighbors.",
      depth: "intuition",
      minutes: 25,
      status: "soon",
      blocks: [],
    },
  ],
};
