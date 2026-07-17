import type { Module } from "../../../types";

/** Internals — below the SQL line. All lessons in drafting. */
export const floorboards: Module = {
  slug: "floorboards",
  title: "Under the floorboards",
  description:
    "Below the SQL line: how a table actually lives on disk, why readers never wait, and the log that is more real than the tables.",
  lessons: [
    {
      slug: "a-table-on-disk",
      title: "What a table looks like on disk",
      hook: "Your million-row table is a folder of 8KB pages — and that explains half of Postgres performance.",
      depth: "internals",
      minutes: 25,
      status: "soon",
      blocks: [],
    },
    {
      slug: "mvcc-nobody-waits",
      title: "MVCC: why readers never block writers",
      hook: "Postgres never updates a row in place — it writes a new version and lets the old one haunt the table.",
      depth: "internals",
      minutes: 25,
      status: "soon",
      blocks: [],
    },
    {
      slug: "vacuum-pays-the-bill",
      title: "VACUUM: paying the MVCC bill",
      hook: "Every UPDATE leaves a corpse; VACUUM is the cleanup crew, and ignoring it ends in a full-table lockout.",
      depth: "internals",
      minutes: 20,
      status: "soon",
      blocks: [],
    },
    {
      slug: "wal-is-the-database",
      title: "The WAL is the database",
      hook: "The tables are a cache; the write-ahead log is the truth — and replication, backups and crash recovery all fall out of that one idea.",
      depth: "internals",
      minutes: 25,
      status: "soon",
      blocks: [],
    },
    {
      slug: "locks-queues-in-disguise",
      title: "Locks: queues in disguise",
      hook: "That ALTER TABLE isn't slow — it's waiting politely behind a SELECT from a dashboard nobody closed.",
      depth: "internals",
      minutes: 20,
      status: "soon",
      blocks: [],
    },
  ],
};
