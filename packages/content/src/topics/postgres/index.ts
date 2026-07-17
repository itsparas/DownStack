import type { Topic } from "../../types";
import { firstContact } from "./modules/first-contact";
import { speakingSql } from "./modules/speaking-sql";
import { howItRuns } from "./modules/how-it-runs";
import { powerTools } from "./modules/power-tools";
import { floorboards } from "./modules/floorboards";
import { lockingTheDoors } from "./modules/locking-the-doors";
import { inTheField } from "./modules/in-the-field";

/**
 * PostgreSQL, zero to production — the modularised layout (one file per
 * module, see .claude/skills/downstack-author/references/big-topics.md).
 * Modules are assembled in depth-ladder order: intuition first, field last.
 */
export const postgres: Topic = {
  slug: "postgres",
  title: "PostgreSQL: zero to production",
  tagline: "From your first psql prompt to the 3 a.m. pager.",
  description:
    "Postgres is the database most of the internet quietly runs on, and almost nobody is taught it — people copy a connection string and pray. We start at absolute zero (what a database even is), learn to speak SQL properly, watch Postgres run your queries, descend into pages, MVCC and the WAL, and finish where it counts: production, where the pager lives.",
  status: "ready",
  outcomes: [
    "Create a schema, query it with joins and aggregates, and explain what Postgres did with every statement you ran",
    "Read an EXPLAIN ANALYZE plan and say why the planner chose it — and when it's lying to you",
    "Explain MVCC out loud: where dead rows come from, why readers never block writers, and what VACUUM actually deletes",
    "Design indexes that earn their keep, and name who pays for each one",
    "Lock the database down: roles with least privilege, and row-level security that holds even when app code forgets",
    "Run production Postgres: pool connections, replicate, take backups you've actually restored, and triage a slow database at 3 a.m.",
  ],
  modules: [
    firstContact,
    speakingSql,
    howItRuns,
    powerTools,
    floorboards,
    lockingTheDoors,
    inTheField,
  ],
};
