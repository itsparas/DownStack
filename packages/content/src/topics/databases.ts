import type { Topic } from "../types";

export const databases: Topic = {
  slug: "databases",
  title: "Databases from first principles",
  tagline: "From two shell functions to Postgres internals.",
  description:
    "Every database is answering the same two questions: how do I put bytes on disk so I can find them again, and what happens when the power dies mid-answer. We build one from scratch, break it, and then meet B-trees, LSM-trees, WALs, MVCC and query planners as solutions to problems you have personally felt.",
  status: "ready",
  outcomes: [
    "Explain why your database acks a commit only after an fsync — and what it costs",
    "Choose between B-tree and LSM storage for a given write/read mix, with reasons",
    "Read an EXPLAIN plan and predict which index the planner will pick",
    "Debug a slow query by reasoning about pages, not vibes",
  ],
  modules: [
    {
      slug: "storage-engine",
      title: "The storage engine",
      description:
        "The floor of the building. How bytes get onto disk, how they're found again, and how the engine survives losing power at the worst possible byte.",
      lessons: [
        {
          slug: "a-database-in-two-functions",
          title: "A database in two shell functions",
          hook: "If a key-value store can be six lines of bash, what are the other million lines for?",
          depth: "intuition",
          minutes: 18,
          status: "ready",
          blocks: [
            {
              type: "prose",
              md: `Every database you have ever used — Postgres, SQLite, Redis, the ledger your bank runs on — is an answer to two questions: *how do I put bytes on disk so that I can find them again*, and *what happens if the power dies while I'm doing it*. Everything else, the query languages and the [[replication]] and the forty config knobs, is built on top of those two answers.

So before we go anywhere near a real engine, we're going to build the smallest database that could possibly work. Not as a toy — as an x-ray. Every limitation this thing has is a problem some real system solved, and once you've *felt* the problem, the solution stops being trivia and starts being obvious.`,
            },
            { type: "heading", text: "The smallest database that could work" },
            {
              type: "prose",
              md: `Here it is. Two shell functions, one file.`,
            },
            {
              type: "code",
              language: "bash",
              filename: "tinydb.sh",
              code: `put() {                       # put <key> <value>
  echo "$1|$2" >> data.log
}

get() {                       # get <key>
  awk -F'|' -v k="$1" '$1 == k { v = $2 } END { print v }' data.log
}`,
              caption:
                "A [[key-value store]]. `put` [[appends|append]] a line. `get` scans every line and keeps the last value it saw for the key.",
            },
            {
              type: "prose",
              md: `Look carefully at what \`put\` does **not** do. It never searches for an existing record to modify. Updating a key means appending a *new* line; the old one stays in the file forever. \`get\` compensates by scanning the whole file and remembering only the **last** value it saw — last write wins.

This is called an **append-only log**, and it is not a beginner's shortcut. It is a deliberate design that real, serious systems are built on. Hold that thought; first, let's find out what this design buys us and what it charges us.`,
            },
            {
              type: "predict",
              question:
                "You call `put` a million times, so `data.log` has a million lines. Two questions before you scroll: what is the cost of one `get` as the file grows? And why is `put` suspiciously fast no matter how big the file gets?",
              reveal: `\`get\` is [[O(n)|o(n)]]: it must scan every line, because a key's latest value could be anywhere. With a million records you're reading the whole file to answer one lookup — brutal.

\`put\` is [[O(1)|o(1)]], and better than that: it's a [[sequential append|sequential write]], which is the single cheapest thing you can ask a storage device to do. Spinning disks skip the [[seek]] (the physically slow part); SSDs get large, aligned writes their flash controllers love. This imbalance — appends are nearly free, lookups are expensive — is the tension the entire rest of this module resolves.`,
            },
            {
              type: "mentor",
              md: `People assume the [[append-only log]] is a teaching prop. It isn't. Bitcask — the default [[storage engine]] of the Riak database — is essentially this design plus one [[hash map]], and it served production workloads at serious scale. Kafka is an append-only log with a PR team. You are not studying a toy; you are studying the ground floor of the building.`,
            },
            {
              type: "heading",
              text: "An index is a promise you pay for on every write",
            },
            {
              type: "prose",
              md: `Let's fix the O(n) read. The trick is to keep a little cheat sheet in memory: a hash map from each key to the [[byte offset]] where its latest record starts. On \`put\`, append to the file *and* update the map. On \`get\`, ask the map for the offset, seek straight there, read one line. One disk read instead of a full scan.`,
            },
            {
              type: "code",
              language: "python",
              filename: "tinydb.py",
              code: `index = {}  # key -> byte offset of the latest record for that key

def put(key: str, value: str) -> None:
    with open("data.log", "ab") as f:
        offset = f.tell()            # where this record will start
        f.write(f"{key}|{value}\\n".encode())
    index[key] = offset              # the cheat sheet

def get(key: str) -> str | None:
    offset = index.get(key)
    if offset is None:
        return None
    with open("data.log", "rb") as f:
        f.seek(offset)               # jump straight to it
        line = f.readline().decode().rstrip("\\n")
    return line.split("|", 1)[1]`,
              caption:
                "This is, honestly, most of Bitcask. An append-only file plus an in-memory [[hash index|index]].",
            },
            {
              type: "model",
              title: "The index tax",
              md: `An index is a bet: **pay a little on every write to save a lot on some reads.** There is no exception to this. Every index you add to a table is another structure that must be updated on every insert — which is exactly why write-heavy tables groan under their ninth "harmless" index, and why your DBA makes that face. When someone says "just add an index," the professional question is: *who pays, and when?*`,
            },
            { type: "heading", text: "The crash question" },
            {
              type: "prose",
              md: `Now the second founding question. Databases don't get to assume a polite shutdown. Processes get \`kill -9\`'d, [[kernels|kernel]] panic, and power supplies fail — always, somehow, during a write.`,
            },
            {
              type: "predict",
              question:
                "The power dies halfway through an append — the machine wrote `user:42|{\"name\":\"Al` and then the world ended. When the machine comes back: what states can `data.log` be in, and how much of our data is at risk?",
              reveal: `Only the **tail** of the file can be damaged. There may be one partial, garbage record at the very end — but every byte before it is exactly as it was, because an append-only log *never rewrites old data*. Recovery is almost embarrassingly simple: scan forward, find the last complete record, truncate the torn tail.

Compare that with a design that updates records **in place**: a crash mid-overwrite can leave a record half-old, half-new — silently corrupt, in the *middle* of your file, with nothing to flag it. [[Immutability|immutability]] isn't a functional-programming aesthetic here. It's a crash-safety strategy.`,
            },
            {
              type: "deepdive",
              title: "Where your write actually goes: the page cache",
              md: `Here's the uncomfortable part nobody tells you in week one. When \`write()\` returns successfully, your bytes are usually **not on disk**. They've been copied into the kernel's [[page cache]] — RAM — and the OS will flush them to the device "soon," at its convenience. If power fails in that window, the write your program was told succeeded is simply gone.

To force bytes onto the platter you must call \`fsync()\`, and *wait* for it. That wait is real: it's the drive physically committing data, often 0.1–10ms. This is the entire tension of [[durability]] — an [[fsync]] per write makes you honest and slow; batching fsyncs makes you fast and, for a few milliseconds at a time, a liar.

And one more turn of the screw: for years, most software assumed a *failed* fsync could just be retried. On Linux, it couldn't — the kernel could drop the [[dirty pages|dirty page]] and clear the error, so the retry would "succeed" while your data was already lost. Postgres discovered this in 2018, twenty-two years into its life. The lesson isn't "Postgres was sloppy." It's that the floor under your database is subtler than anyone's mental model, including the experts'.`,
              code: {
                language: "python",
                filename: "durable_put.py",
                code: `def durable_put(key: str, value: str) -> None:
    with open("data.log", "ab") as f:
        f.write(f"{key}|{value}\\n".encode())
        f.flush()                 # drain Python's buffer to the OS
        os.fsync(f.fileno())      # force the OS to hit the device. THIS is the D in ACID.
    index[key] = f.tell()`,
              },
            },
            {
              type: "pitfall",
              title: "Durability theater",
              md: `The classic mistake: acknowledging a write to the client after \`write()\` returns but before \`fsync()\` completes. Your service says "saved!", the user closes the tab, the node loses power, and the data never existed. Real databases fsync their log **before** [[acking|ack]] a [[commit]] — that's why commits have [[latency]] floors, and why "why is my insert taking 2ms, it's just a row" is a question with a physics answer. Durability isn't a boolean in a config file. It's a latency budget someone has to consciously spend.`,
            },
            {
              type: "warstory",
              title: "The counters that went backwards",
              md: `A team I worked with kept like-counts in a homegrown append-only store — this exact design, and honestly a decent one. For [[throughput]] they acked writes on \`write()\` and fsynced on a 5-second timer. Fine for months. Then a rack lost power, and after reboot the store recovered cleanly to its last fsync… which meant every counter rolled back about 40 seconds. Users watched their likes *disappear*. Support tickets used the word "haunted."

The fix wasn't heroic: fsync before ack, then claw back the lost throughput with **group commit** — batch the writes that arrive within a millisecond or two and fsync them together, spreading the cost of one disk flush across dozens of commits. That's not a war-story hack, by the way. It's exactly what Postgres and MySQL do under load. The durability knob was always there; the incident just transferred its ownership from "nobody" to "somebody."`,
            },
            {
              type: "heading",
              text: "Compaction: the file can't grow forever",
            },
            {
              type: "prose",
              md: `One more problem hiding in plain sight: we never delete anything. Update a key a thousand times and 999 dead lines sit there taking up disk. The standard move is to break the log into **segments**: when the current file hits a size threshold, close it and start a new one. Closed [[segments|segment]] are immutable — nothing will ever write to them again.

Then a background process **compacts**: it reads old segments, keeps only the newest value for each key, writes the survivors into a fresh segment, and [[atomically|atomic]] swaps it in. Reads keep flowing off the old segments during the whole merge, *because immutable files are safe to read while someone builds their replacement*. Immutability keeps paying rent.

Deletes get one elegant trick: you can't unappend, so deleting a key means appending a special [[tombstone]] record — "this key is dead." The key stops resolving immediately; the corpse is physically removed at the next [[compaction]]. File this pattern away permanently: *deletes are writes*. You'll meet it again in Cassandra, in Kafka's compacted topics, and in git.`,
            },
            {
              type: "heading",
              text: 'The wall: "give me everything between A and B"',
            },
            {
              type: "prose",
              md: `So far the hash-indexed log looks great: O(1) writes, O(1) reads, honest crash recovery, bounded disk. Time to hit the wall.

First crack: the hash index lives in RAM, so *every key must fit in memory*. A billion small keys can be tens of gigabytes of hash map before you store a single value.

Second crack, and it's fatal for general-purpose use: try to answer \`get_range("2024-01-01", "2024-01-31")\`. A hash map **scatters adjacent keys on purpose** — spreading keys out evenly is its whole job. Keys that are neighbors in your problem are strangers in the index, so a [[range query|range scan]] falls back to scanning everything. Yet ranges are everywhere: time windows, pagination, "usernames starting with…", every \`BETWEEN\` in every report.

What we need is a structure that keeps keys **in sorted order**, lives comfortably on disk, and still absorbs writes quickly. There are two great answers, and they split the database world in half: keep the log but keep it *sorted* — the [[LSM-tree|lsm-tree]] (Cassandra, RocksDB, LevelDB) — or abandon the log for fixed-size [[pages|page]] you edit in place — the [[B-tree|b-tree]] (Postgres, MySQL, SQLite). Those are the next two lessons, and you now own every problem they were invented to solve.`,
            },
            {
              type: "quiz",
              question:
                "Your service is 95% writes — an ingest firehose with occasional [[point lookups|point lookup]]. Which property of the append-only log design makes it a strong fit?",
              options: [
                {
                  text: "Sequential appends are the cheapest operation you can ask a disk to do",
                  correct: true,
                  explanation:
                    "Exactly. Append-only turns every write into sequential I/O — no seeks, no read-modify-write — which is why log-structured designs dominate write-heavy workloads.",
                },
                {
                  text: "The hash index makes writes faster",
                  explanation:
                    "Backwards — the index is a *tax* on writes (every put also updates the map) that pays out on reads. Remember who pays, and when.",
                },
                {
                  text: "Log files compress better than other formats",
                  explanation:
                    "Compression is a separate question — it depends on the data, not on append-only-ness. Not the property doing the work here.",
                },
                {
                  text: "Appends are atomic, so torn writes are impossible",
                  explanation:
                    "Tempting, but no — we just watched a torn tail happen. Appends make [[torn writes|torn write]] *recoverable* (truncate the tail), not impossible.",
                },
              ],
            },
            {
              type: "takeaways",
              items: [
                "An append-only log with last-write-wins is a legitimate database core — Bitcask shipped it to production, not just to textbooks.",
                "Every index is the same bet: pay on every write to save on some reads. There are no free indexes.",
                "`write()` returning is not durability. `fsync()` is the D in [[ACID|acid]], it costs real milliseconds, and [[group commit]] is how engines afford it.",
                "Immutability is a crash-safety and [[concurrency]] strategy: torn writes stay at the tail, and compaction can rebuild files nobody is mutating.",
                "Hash indexes cannot answer range queries — that single limitation is why sorted structures (B-trees, LSM-trees) run the database world.",
              ],
            },
            {
              type: "mentor",
              md: `Keep the discomfort of that torn-tail scenario somewhere you can reach it. Every storage engine you will ever meet — every one — is a long, careful answer to the three questions this toy raised: *where do the bytes go, how do I find them again, and what happens when the power dies.* Next lesson we meet the B-tree, a structure old enough to have a mortgage and still under every Postgres table you've ever queried. Bring the questions.`,
            },
          ],
        },
        {
          slug: "b-trees",
          title: "B-trees: the 50-year-old bet under every table",
          hook: "Why does Postgres edit 8KB pages in place when we just proved in-place edits are scary?",
          depth: "mechanics",
          minutes: 22,
          status: "soon",
          blocks: [],
        },
        {
          slug: "lsm-trees",
          title: "LSM-trees: write like a log, read like a tree",
          hook: "How Cassandra and RocksDB keep the append-only dream and still answer range queries.",
          depth: "mechanics",
          minutes: 20,
          status: "soon",
          blocks: [],
        },
        {
          slug: "write-ahead-log",
          title: "The WAL: how databases cheat death",
          hook: "One log to make torn pages, crashed transactions, and replication all survivable.",
          depth: "internals",
          minutes: 24,
          status: "soon",
          blocks: [],
        },
      ],
    },
    {
      slug: "query-execution",
      title: "Query execution",
      description:
        "What actually happens between your SQL string and the bytes coming back — parsing, planning, and why the optimizer sometimes picks the 'wrong' index on purpose.",
      lessons: [
        {
          slug: "sql-to-plan",
          title: "From SQL string to physical plan",
          hook: "Your query is a wish. The planner writes the actual program.",
          depth: "mechanics",
          minutes: 20,
          status: "soon",
          blocks: [],
        },
        {
          slug: "reading-explain",
          title: "EXPLAIN, actually explained",
          hook: "Reading a query plan like the planner wrote it for you — because it did.",
          depth: "field",
          minutes: 25,
          status: "soon",
          blocks: [],
        },
      ],
    },
    {
      slug: "transactions",
      title: "Transactions & concurrency",
      description:
        "MVCC, isolation levels, and the polite lies databases tell so thousands of clients can pretend they're alone.",
      lessons: [
        {
          slug: "mvcc",
          title: "MVCC: reading without locks",
          hook: "How Postgres lets readers and writers ignore each other — and the vacuum bill that follows.",
          depth: "internals",
          minutes: 26,
          status: "soon",
          blocks: [],
        },
        {
          slug: "isolation-levels",
          title: "Isolation levels are a menu of lies",
          hook: "Read committed, repeatable read, serializable: what you're actually buying at each tier.",
          depth: "field",
          minutes: 22,
          status: "soon",
          blocks: [],
        },
      ],
    },
  ],
};
