import type { Module } from "../../../types";

/** Mechanics — the constructs teams actually reach for once SQL is fluent. */
export const powerTools: Module = {
  slug: "power-tools",
  title: "The power tools",
  description:
    "The constructs real teams reach for daily: CTEs that make queries readable, views that make them reusable, and the sharp tools — triggers and stored procedures — that cut both ways.",
  lessons: [
    {
      slug: "ctes-name-your-steps",
      title: "CTEs: name your steps",
      hook: "WITH turns a nested monster query into a pipeline you read top to bottom — and sometimes changes how it runs.",
      depth: "mechanics",
      minutes: 20,
      status: "soon",
      blocks: [],
    },
    {
      slug: "views-saved-questions",
      title: "Views: questions with names",
      hook: "Name a query and it becomes infrastructure — plus materialized views, the cache you must remember to refresh.",
      depth: "mechanics",
      minutes: 18,
      status: "soon",
      blocks: [],
    },
    {
      slug: "triggers-automatic-invisible",
      title: "Triggers: automatic and invisible",
      hook: "Code that runs on every INSERT whether the next engineer knows it or not — audit logs, counter caches, and the debugging sessions they cause.",
      depth: "mechanics",
      minutes: 20,
      status: "soon",
      blocks: [],
    },
    {
      slug: "functions-and-procedures",
      title: "Functions and stored procedures",
      hook: "Sometimes logic should live where the data lives — PL/pgSQL, and the judgment call teams get wrong in both directions.",
      depth: "mechanics",
      minutes: 22,
      status: "soon",
      blocks: [],
    },
  ],
};
