import type { Module } from "../../../types";

/** Field — production Postgres. All lessons in drafting. */
export const inTheField: Module = {
  slug: "in-the-field",
  title: "Postgres in the field",
  description:
    "The production floor: connection pools, replicas, backups you have actually restored, and what to type when everything is slow.",
  lessons: [
    {
      slug: "connections-are-expensive",
      title: "Connections are expensive",
      hook: "Every Postgres connection is a whole operating-system process — which is why your serverless app just took the database down.",
      depth: "field",
      minutes: 15,
      status: "soon",
      blocks: [],
    },
    {
      slug: "race-conditions-for-real",
      title: "Race conditions, for real",
      hook: "Two checkouts, one seat left: SELECT FOR UPDATE, unique constraints as mutexes, and idempotency keys.",
      depth: "field",
      minutes: 25,
      status: "soon",
      blocks: [],
    },
    {
      slug: "where-the-ram-goes",
      title: "Where the RAM and CPU go",
      hook: "work_mem times connections equals an OOM kill — a tour of shared_buffers, spilled sorts, and the four knobs that actually matter.",
      depth: "field",
      minutes: 25,
      status: "soon",
      blocks: [],
    },
    {
      slug: "replication-and-failover",
      title: "Replication and the failover drill",
      hook: "Streaming the WAL to a second machine is easy; deciding when to promote it is the part that pages you.",
      depth: "field",
      minutes: 25,
      status: "soon",
      blocks: [],
    },
    {
      slug: "backups-that-restore",
      title: "A backup is a restore you haven't tested",
      hook: "pg_dump, base backups and PITR — and the team that discovered, live, that their nightly backup had been empty for a year.",
      depth: "field",
      minutes: 20,
      status: "soon",
      blocks: [],
    },
    {
      slug: "three-am-triage",
      title: "3 a.m. triage: the slow database",
      hook: "pg_stat_activity, pg_stat_statements, and a calm ten-minute checklist for when everything is on fire.",
      depth: "field",
      minutes: 25,
      status: "soon",
      blocks: [],
    },
  ],
};
