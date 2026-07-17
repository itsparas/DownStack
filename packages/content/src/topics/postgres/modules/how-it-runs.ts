import type { Module } from "../../../types";

/** Mechanics — what Postgres does with your statements. Lessons being written. */
export const howItRuns: Module = {
  slug: "how-it-runs",
  title: "How Postgres runs your query",
  description:
    "The observable machine: transactions that keep promises, indexes that charge rent, and the planner whose mind you can read.",
  lessons: [
    {
      slug: "transactions-all-or-nothing",
      title: "Transactions: all or nothing",
      hook: "BEGIN, COMMIT, ROLLBACK — how Postgres makes five statements behave like one, even when the power dies on statement three.",
      depth: "mechanics",
      minutes: 20,
      status: "soon",
      blocks: [],
    },
    {
      slug: "indexes-earn-their-keep",
      title: "An index must earn its keep",
      hook: "An index turns a million-row scan into a few hops — and quietly charges every INSERT for the privilege.",
      depth: "mechanics",
      minutes: 20,
      status: "soon",
      blocks: [],
    },
    {
      slug: "reading-explain",
      title: "EXPLAIN: reading the planner's mind",
      hook: "Postgres will tell you exactly how it plans to run your query — most people never ask.",
      depth: "mechanics",
      minutes: 25,
      status: "soon",
      blocks: [],
    },
    {
      slug: "schema-design-constraints",
      title: "Schema design: constraints as teammates",
      hook: "Foreign keys, CHECK and NOT NULL are not red tape — they're the only code reviewer that never sleeps.",
      depth: "mechanics",
      minutes: 20,
      status: "soon",
      blocks: [],
    },
  ],
};
