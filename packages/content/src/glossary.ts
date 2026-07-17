/**
 * The plain-English glossary.
 *
 * Downstack's house rule: lessons are written in simple English, and any
 * genuinely difficult word gets marked in `md` strings as `[[word]]` (or
 * `[[display text|key]]` when the displayed form differs from the key —
 * plurals, capitalisation, tense). Marked words render as clickable terms:
 * the reader taps one and gets a small card with the explanation below,
 * plus a button to search the web for more.
 *
 * Writing rules for `simple`:
 *  - One to three short sentences. Everyday words only — a definition may
 *    never need its own glossary entry.
 *  - Explain it the way you would to a smart friend who doesn't code.
 *  - It's fine to include one tiny concrete example.
 *
 * Keys are lowercase, singular, kebab-free ("page cache", not "Page-Caches").
 */

export interface GlossaryEntry {
  /** The word in its canonical form, as a reader would say it. */
  term: string;
  /** The plain-English explanation. */
  simple: string;
  /** Optional: a better web-search query than the bare term. */
  search?: string;
}

function normalize(key: string): string {
  return key.trim().toLowerCase();
}

export function getGlossaryEntry(key: string): GlossaryEntry | undefined {
  return glossary[normalize(key)];
}

export const glossary: Record<string, GlossaryEntry> = {
  /* ---------------------------------------------------------------- */
  /* Absolute basics                                                   */
  /* ---------------------------------------------------------------- */
  "sql": {
    term: "SQL",
    simple:
      "The language used to talk to most databases — usually said “sequel”. You write what you want (“give me every user named Ada”) and the database figures out how to get it.",
    search: "what is SQL explained simply",
  },
  "server": {
    term: "server",
    simple:
      "A program that runs all the time and answers requests from other programs. The programs asking are called clients.",
    search: "client server model explained simply",
  },
  "docker": {
    term: "Docker",
    simple:
      "A tool that runs a program inside a sealed box with everything it needs packed in. Great for trying software: one command starts it, one command throws the whole box away.",
    search: "what is Docker explained simply",
  },
  "constraint": {
    term: "constraint",
    simple:
      "A rule you attach to a table that the database enforces on every row, forever — like “this column can never be empty” or “no two users may share an email”. Rows that break the rule are rejected.",
    search: "database constraint explained simply",
  },
  "primary key": {
    term: "primary key",
    simple:
      "The column that uniquely identifies each row in a table — usually an id number. No two rows can share it, and it can never be empty.",
    search: "primary key explained simply",
  },
  "foreign key": {
    term: "foreign key",
    simple:
      "A column that points at a row in another table — like an order storing the id of the user who placed it. The database guarantees the pointer is always real: no order can reference a user that doesn't exist.",
    search: "foreign key explained simply",
  },

  /* ---------------------------------------------------------------- */
  /* Storage & databases                                               */
  /* ---------------------------------------------------------------- */
  "append": {
    term: "append",
    simple:
      "To add something at the end. Appending to a file means writing new data after everything that's already there, without touching what came before.",
  },
  "byte offset": {
    term: "byte offset",
    simple:
      "A position inside a file, counted in bytes from the start. Like saying “the word begins at character 4,096” — it lets a program jump straight to the right spot instead of reading from the beginning.",
  },
  "b-tree": {
    term: "B-tree",
    simple:
      "A way of organising data on disk shaped like an upside-down tree. It keeps everything sorted so a database can find any record in a few hops instead of scanning millions of rows.",
    search: "B-tree data structure explained simply",
  },
  "index": {
    term: "index",
    simple:
      "A lookup table a database keeps on the side so it can find rows fast — like the index at the back of a book. It speeds up reads, but every write now has to update the book *and* the index.",
    search: "database index explained simply",
  },
  "page cache": {
    term: "page cache",
    simple:
      "Memory the operating system uses to hold recently-used pieces of files. Writes often land here first and reach the physical disk a little later — fast, but risky if the power dies in between.",
    search: "operating system page cache explained",
  },
  "fsync": {
    term: "fsync",
    simple:
      "A command a program gives the operating system meaning: “don't just say you'll write this to disk — actually do it, now, and don't return until it's really there.”",
    search: "fsync system call explained",
  },
  "durability": {
    term: "durability",
    simple:
      "The promise that once a database says “saved”, the data survives anything — a crash, a power cut, a reboot. If it can still be lost, it wasn't durable.",
    search: "durability in databases ACID",
  },
  "write-ahead log": {
    term: "write-ahead log",
    simple:
      "A safety notebook a database keeps: before changing any real data, it first writes down what it's *about* to do. After a crash it replays the notebook to recover.",
    search: "write-ahead log WAL explained",
  },
  "compaction": {
    term: "compaction",
    simple:
      "A cleanup pass over stored data: old, overwritten, or deleted entries get thrown out and the survivors get rewritten tightly together, freeing space and speeding up reads.",
    search: "log compaction databases explained",
  },
  "range scan": {
    term: "range scan",
    simple:
      "Reading all records between two values in order — “every user from A to F”, “all orders from March”. Easy when data is sorted, painful when it isn't.",
  },
  "transaction": {
    term: "transaction",
    simple:
      "A group of database changes that succeed or fail as one unit. Either every step happens, or none of them do — never half.",
    search: "database transaction explained simply",
  },
  "migration": {
    term: "migration",
    simple:
      "A scripted change to a database's structure — adding a column, creating an index. Teams run migrations to evolve the database without rebuilding it.",
    search: "database schema migration explained",
  },
  "sequential write": {
    term: "sequential write",
    simple:
      "Writing data in one continuous run, end to end, the way a tape records. Disks are dramatically faster at this than at jumping around to scattered places.",
  },
  "hash map": {
    term: "hash map",
    simple:
      "A structure that stores key→value pairs and can jump straight to any key in one step, like a coat-check ticket taking you straight to your coat.",
    search: "hash map explained simply",
  },

  "key-value store": {
    term: "key-value store",
    simple:
      "A database that works like labelled boxes: you save a value under a key, and later hand back the key to get the value. No tables, no query language — just put and get.",
    search: "key-value store explained simply",
  },
  "o(n)": {
    term: "O(n)",
    simple:
      "A way of saying the work grows in step with the amount of data. Twice as many records means roughly twice as long.",
    search: "Big O notation O(n) explained simply",
  },
  "o(1)": {
    term: "O(1)",
    simple:
      "A way of saying something takes the same time no matter how much data there is. Finding one entry among a million costs the same as among ten.",
    search: "Big O notation O(1) explained simply",
  },
  "seek": {
    term: "seek",
    simple:
      "Moving to the right spot on a disk before reading or writing. On a spinning disk this is a physical movement of the read arm — the slowest thing a disk does.",
    search: "disk seek time explained simply",
  },
  "append-only log": {
    term: "append-only log",
    simple:
      "A file that only ever grows at the end. Old entries are never changed or erased — an update just adds a newer entry after the old one.",
    search: "append-only log storage explained",
  },
  "storage engine": {
    term: "storage engine",
    simple:
      "The part of a database that actually puts bytes on disk and finds them again. Everything else — the query language, the network layer — is built on top of it.",
    search: "database storage engine explained simply",
  },
  "immutability": {
    term: "immutability",
    simple:
      "The rule that a thing, once written, is never changed — you make a new version instead. Never rewriting old data makes crashes and sharing much safer.",
  },
  "dirty page": {
    term: "dirty page",
    simple:
      "A chunk of file data that has been changed in memory but not yet saved to disk. If the power dies before the save, that change is gone.",
    search: "dirty page in OS page cache explained",
  },
  "ack": {
    term: "ack",
    simple:
      "Short for acknowledgement — the reply that says “got it, done.” When a database acks a write, it is telling the client the data is safely stored.",
    search: "acknowledgement ack in computing explained",
  },
  "commit": {
    term: "commit",
    simple:
      "The moment a database makes a set of changes final. Once a commit succeeds, the database has promised those changes will not be lost.",
    search: "database commit explained simply",
  },
  "segment": {
    term: "segment",
    simple:
      "One of the smaller files a growing log is split into. When the current file gets big enough, it is closed and a fresh one is started; closed segments are never written to again.",
    search: "log segment storage engine explained",
  },
  "atomic": {
    term: "atomic",
    simple:
      "All-or-nothing. An atomic step either happens completely or not at all — nothing can ever see it half-done.",
    search: "atomic operation explained simply",
  },
  "tombstone": {
    term: "tombstone",
    simple:
      "A special “this key is deleted” marker added to a log. You can't erase old entries from a log, so you append a note saying the key is dead; a later cleanup removes both.",
    search: "tombstone record in databases explained",
  },
  "lsm-tree": {
    term: "LSM-tree",
    simple:
      "A way of storing data that takes writes into a log and memory first, then merges them into sorted files on disk in the background. It handles heavy write traffic very well — Cassandra and RocksDB use it.",
    search: "LSM-tree explained simply",
  },
  "page": {
    term: "page",
    simple:
      "A fixed-size block of data — often 8KB — that a database or operating system reads and writes as one unit. They move whole pages, never single bytes.",
    search: "database page explained simply",
  },
  "point lookup": {
    term: "point lookup",
    simple:
      "Fetching one record by its exact key — “give me user 42.” The opposite of a scan, which reads through many records.",
    search: "point lookup vs range scan databases",
  },
  "torn write": {
    term: "torn write",
    simple:
      "A write that a crash cut off partway, leaving a mix of old and new data. The dangerous kind sits in the middle of a file with nothing to flag it as broken.",
    search: "torn write databases explained",
  },
  "acid": {
    term: "ACID",
    simple:
      "A famous shorthand for four promises a database makes about a group of changes: they happen all-or-nothing, keep the data valid, don't trample other users' work, and stay saved once confirmed.",
    search: "ACID database properties explained simply",
  },
  "group commit": {
    term: "group commit",
    simple:
      "A speed trick: instead of saving each write to disk one at a time, the database gathers writes that arrive close together and saves them in one go. One disk wait gets shared by many writes.",
    search: "group commit databases explained",
  },
  "concurrency": {
    term: "concurrency",
    simple:
      "Many things happening at the same time — like a thousand users writing to one database at once. Most of the hardest bugs come from two actions overlapping in ways nobody planned.",
    search: "concurrency in programming explained simply",
  },

  /* ---------------------------------------------------------------- */
  /* Runtime & operating systems                                       */
  /* ---------------------------------------------------------------- */
  "call stack": {
    term: "call stack",
    simple:
      "The runtime's to-do pile of function calls. Each call goes on top; when it finishes it comes off. Whatever is on top right now is the only thing actually running.",
    search: "call stack explained simply",
  },
  "event loop": {
    term: "event loop",
    simple:
      "The traffic controller inside JavaScript. It runs one task at a time and, whenever the current task finishes, picks the next waiting one — timers, clicks, network replies.",
    search: "JavaScript event loop explained simply",
  },
  "callback": {
    term: "callback",
    simple:
      "A function you hand to some other code with the instruction “run this later, when you're ready” — for example, when the download finishes.",
  },
  "task queue": {
    term: "task queue",
    simple:
      "The waiting line where finished background work (a timer firing, a click, a network reply) sits until the event loop is free to run it.",
    search: "JavaScript task queue microtask macrotask",
  },
  "microtask": {
    term: "microtask",
    simple:
      "A small piece of follow-up work (like a promise's .then) that runs immediately after the current code finishes — before any timers or clicks get their turn.",
    search: "JavaScript microtask vs macrotask",
  },
  "promise": {
    term: "promise",
    simple:
      "An object standing in for a value that isn't ready yet — “I owe you the answer”. You attach code to it that runs when the answer arrives (or when it fails).",
    search: "JavaScript promise explained simply",
  },
  "syscall": {
    term: "syscall",
    simple:
      "Short for “system call” — the formal way a program asks the operating system to do something only it can do: open a file, send network data, start a process.",
    search: "system call explained simply",
  },
  "scheduler": {
    term: "scheduler",
    simple:
      "The part of the operating system that decides which program gets the CPU next, and for how long. It switches between programs so fast that everything looks simultaneous.",
    search: "OS scheduler explained simply",
  },
  "thread": {
    term: "thread",
    simple:
      "One independent line of execution inside a program. A program with several threads can genuinely do several things at once on a multi-core machine.",
    search: "thread vs process explained simply",
  },
  "heap": {
    term: "heap",
    simple:
      "The big open area of a program's memory where objects live. Unlike the neat call stack, things here are created and freed in any order.",
    search: "stack vs heap memory explained",
  },
  "garbage collection": {
    term: "garbage collection",
    simple:
      "The runtime's automatic cleanup: it finds objects your program can no longer reach and frees their memory, so you don't have to do it by hand.",
    search: "garbage collection explained simply",
  },
  "kernel": {
    term: "kernel",
    simple:
      "The core of the operating system. It controls the hardware — disks, memory, network — and every program must go through it to use them.",
    search: "operating system kernel explained simply",
  },

  "single-threaded": {
    term: "single-threaded",
    simple:
      "Able to do only one thing at a time. A single-threaded program works through its jobs one after another, like one cashier serving a queue — nothing runs side by side.",
  },
  "synchronous": {
    term: "synchronous",
    simple:
      "Happening right now, in order, with everything else waiting its turn. Synchronous code must finish completely before the next thing can start.",
  },
  "runtime": {
    term: "runtime",
    simple:
      "The program that runs your program. For JavaScript that's the browser or Node.js — it reads your code, executes it, and provides things like timers and memory management.",
  },
  "i/o": {
    term: "I/O",
    simple:
      "Short for input/output — any time a program talks to the world outside itself: reading a file, sending a network request, waiting for a keystroke. I/O is slow compared to pure computation, so programs often do other work while waiting for it.",
  },
  "starvation": {
    term: "starvation",
    simple:
      "When one piece of work hogs the system so completely that other waiting work never gets a turn. The starved work isn't broken — it just never gets picked.",
    search: "event loop starvation explained",
  },
  "node.js": {
    term: "Node.js",
    simple:
      "A program that runs JavaScript outside the browser, usually on servers. It lets the same language that powers web pages also power the backend behind them.",
    search: "what is Node.js explained simply",
  },
  "p99 latency": {
    term: "p99 latency",
    simple:
      "The response time that 99 out of 100 requests beat — only the slowest 1% take longer. Teams watch it because averages hide the painful slow cases real users hit.",
    search: "p99 latency percentile explained simply",
  },
  "endpoint": {
    term: "endpoint",
    simple:
      "One specific address a server answers at, usually doing one job — like /login or /orders. An API is basically a collection of endpoints.",
    search: "API endpoint explained simply",
  },
  "orchestrator": {
    term: "orchestrator",
    simple:
      "Software that manages a fleet of running services automatically: starting them, checking they're healthy, and replacing ones that seem dead. Kubernetes is the famous example.",
    search: "container orchestrator Kubernetes explained simply",
  },
  "serialization": {
    term: "serialization",
    simple:
      "Turning data that lives in a program's memory into a flat format — like JSON text — that can be saved to disk or sent over a network. The reverse, reading it back in, is deserialization.",
    search: "serialization explained simply",
  },
  "worker thread": {
    term: "worker thread",
    simple:
      "An extra line of execution you can start so heavy work runs beside your main code instead of blocking it. The main program and the worker talk by passing messages to each other.",
    search: "worker threads JavaScript explained",
  },
  "process": {
    term: "process",
    simple:
      "One running program, as the operating system sees it: its own memory, its own permissions, its own life. Two processes can't touch each other's memory — that's what keeps one crashing app from taking others down.",
  },

  /* ---------------------------------------------------------------- */
  /* Networks & distributed systems                                    */
  /* ---------------------------------------------------------------- */
  "latency": {
    term: "latency",
    simple:
      "How long one round trip takes — from asking to getting the answer. Low latency feels instant; high latency feels laggy.",
  },
  "throughput": {
    term: "throughput",
    simple:
      "How much work gets done per second — requests handled, bytes moved. A system can have great throughput and still feel slow if each individual request has high latency.",
  },
  "replication": {
    term: "replication",
    simple:
      "Keeping live copies of the same data on several machines, so one machine dying doesn't lose data or take the service down.",
    search: "database replication explained simply",
  },
  "consensus": {
    term: "consensus",
    simple:
      "The problem of getting several machines to agree on one value even when some of them crash or messages get lost. Famous algorithms: Raft, Paxos.",
    search: "consensus algorithm Raft explained simply",
  },
  "idempotent": {
    term: "idempotent",
    simple:
      "Safe to repeat. An idempotent operation gives the same result whether you run it once or five times — like setting the volume to 7, versus turning it up by one.",
    search: "idempotent operation explained simply",
  },
  "race condition": {
    term: "race condition",
    simple:
      "A bug where the outcome depends on which of two things happens to finish first. It works in testing, then fails randomly in production when the timing changes.",
    search: "race condition explained simply",
  },

  /* ---------------------------------------------------------------- */
  /* React & UI                                                        */
  /* ---------------------------------------------------------------- */
  "render": {
    term: "render",
    simple:
      "In React, a render is React calling your component function to ask “what should the screen look like now?”. It produces a description of the UI — it does not itself touch the screen.",
    search: "what does render mean in React",
  },
  "reconciliation": {
    term: "reconciliation",
    simple:
      "React comparing the new description of your UI with the previous one to work out the smallest set of real changes to apply to the page.",
    search: "React reconciliation explained simply",
  },
  "virtual dom": {
    term: "virtual DOM",
    simple:
      "A lightweight in-memory copy of the page structure that React edits first. Comparing two copies in memory is much cheaper than touching the real page.",
    search: "virtual DOM explained simply",
  },
  "hydration": {
    term: "hydration",
    simple:
      "Waking up server-sent HTML: the browser already has the page's text, and React attaches the event handlers and state to make it interactive.",
    search: "React hydration explained simply",
  },
};
