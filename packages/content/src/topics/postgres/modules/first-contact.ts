import type { Module } from "../../../types";

/** Intuition — absolute zero. What a database is, and your first conversation. */
export const firstContact: Module = {
  slug: "first-contact",
  title: "First contact",
  description:
    "Absolute zero: what a database even is, why files weren't enough, and your first conversation with the program that never lets your data lie.",
  lessons: [
    {
      slug: "why-not-just-a-file",
      title: "Why not just a file?",
      hook: "Your app could write JSON to disk — until the day two users click save at the same time.",
      depth: "intuition",
      minutes: 15,
      status: "ready",
      blocks: [
        {
          type: "prose",
          md: `Let me open with a claim the textbooks skip: you don't need a database. Not at first. Your app can keep its data in one [[JSON|json]] file on disk, and it will work — really work, for longer than the textbooks admit.

So that's where we'll start: with the version that works. Because everything a database does is an answer to a specific way that file eventually betrays you. Meet the betrayals first, and "database" stops being a vocabulary word — it becomes obvious.

Say you're building a small shop. Orders have to survive restarts, so you write them to a file:`,
        },
        {
          type: "code",
          language: "javascript",
          filename: "db.js",
          code: `const fs = require("fs");
const FILE = "orders.json";

function load() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function save(orders) {
  fs.writeFileSync(FILE, JSON.stringify(orders, null, 2));
}

function addOrder(order) {
  const orders = load();   // 1. read the whole file
  orders.push(order);      // 2. change the list in memory
  save(orders);            // 3. write the whole file back
}`,
          caption:
            "A dozen lines and you have [[persistence]]: data that survives restarts. Every save is read-everything, change-in-memory, write-everything-back.",
        },
        {
          type: "prose",
          md: `And this *works*. You can restart the app and the orders are still there. You can open \`orders.json\` in an editor and fix a typo by hand. For a to-do app, a config file, a weekend project — a file is the right call, and nobody should shame you for it.

The catch is that four separate disasters are waiting inside those twelve lines, and each one stays invisible until the app starts to matter. Let's meet them in order of how much sleep they'll cost you.`,
        },
        { type: "heading", text: "Disaster one: two writers, one file" },
        {
          type: "prose",
          md: `Your shop grows. Two customers now click *place order* in the same second — maybe your [[server]] handles requests side by side, maybe you run two copies of the app. Either way, two [[processes|process]] can now be inside \`addOrder\` at the same moment.

Look at the function again. It reads the file, changes the list in memory, writes everything back. Three steps — and nothing anywhere says the two callers have to take turns.`,
        },
        {
          type: "predict",
          question: `At noon the file holds one order. Request A starts running \`addOrder\` for Ada; request B starts a millisecond behind it, for Bo. Both read, both push, both write.

Commit to an answer before revealing: when the dust settles, does the file hold three orders, two, or something worse?`,
          reveal: `Two — and nothing tells you. Both requests read the same one-order list. A writes back a list with the old order and Ada's. B never saw Ada's, so it writes back the old order and Bo's — and because B finishes last, B's version *is* the file now. Ada's order is gone. No error, no crash, no log line. She gets a confirmation email for an order that does not exist.

Engineers call this a **lost update**, and it's the textbook [[race condition]]: the final state depends on who happens to finish last. And this is the *polite* failure — if the two writes land close enough together, their bytes can interleave and leave a file no parser will ever read again.

Sit with what makes it nasty: the file isn't broken, neither request hit a bug, and the app keeps running. The data is simply wrong, silently, forever.`,
        },
        {
          type: "pitfall",
          title: "Just add a lock",
          md: `The instinct here is a lock: some flag that says *I'm writing — everyone else wait*. It feels like the fix because it names the exact collision you just watched.

But now the lock is yours to get right. What happens when the process holding it crashes — who unlocks? Does the cleanup script your coworker writes next year know the lock exists? What about two machines sharing the file over a network? Correct locking — for every writer, across crashes, forever — is genuinely hard engineering. It *has* been done; the people who did it called the result a database. Every do-it-yourself fix in this lesson has that same punchline, so watch for it.`,
        },
        { type: "heading", text: "Disaster two: the plug" },
        {
          type: "prose",
          md: `The second disaster doesn't need a second writer. It needs one write and bad timing.

\`save()\` looks like a single action. Underneath, it isn't: the old file gets emptied first, then the new bytes stream out in chunks — and between any two chunks, the process can die. A crash, a power cut, a deploy that kills it, a disk that fills up. Stop the write halfway and the file holds the front half of your data, and then just... ends.`,
        },
        {
          type: "code",
          language: "text",
          filename: "orders.json — after the crash",
          code: `[
  { "id": 1, "email": "ada@example.com", "total": 49.99 },
  { "id": 2, "email": "bo@example.com",  "tot`,
          caption:
            "Ends mid-word. Not the old data, not the new data — a third thing that is neither.",
        },
        {
          type: "prose",
          md: `Here's what makes it brutal: you didn't lose the order being written. You lost *all of them*, because the file is only useful if the whole thing parses. \`JSON.parse\` throws, the app can't even start, and it's 3 a.m. One interrupted write held every previous order hostage.

What you needed was a guarantee the filesystem never offered: a save that either fully happens or fully doesn't. The word for that property is [[atomic]], and you'll meet it again and again in this topic.`,
        },
        {
          type: "deepdive",
          title: "The rename trick — and why it isn't enough",
          md: `There is a real fix for the torn file, and databases use a cousin of it internally: write the new content to a temporary file, then *rename* it over the old one. On most systems a rename swaps the whole file in one un-splittable step, so a reader sees the old version or the new version — never a mixture.

So why not stop there? Because the rename fixes exactly one of our four disasters. Two writers still overwrite each other — they just leave cleaner corpses. Questions still require reading the whole file. Junk data still walks in through the front door. Every patch from here on has this shape: it solves one disaster and leaves three.`,
          code: {
            language: "javascript",
            filename: "db.js",
            code: `function save(orders) {
  fs.writeFileSync(FILE + ".tmp", JSON.stringify(orders, null, 2));
  fs.renameSync(FILE + ".tmp", FILE); // old file or new file — never half
}`,
          },
        },
        { type: "heading", text: "Disaster three: one question, the whole file" },
        {
          type: "prose",
          md: `Two years pass. \`orders.json\` is 2 GB, and marketing asks a small question: *which orders were over $50?*

A flat file gives you exactly one way to answer anything:`,
        },
        {
          type: "code",
          language: "python",
          filename: "report.py",
          code: `import json

with open("orders.json") as f:
    orders = json.load(f)        # read and parse ALL 2 GB

big = [o for o in orders if o["total"] > 50]   # keep 0.1% of it`,
          caption:
            "Read all of it, parse all of it, hold all of it in memory — to keep a sliver. Every question starts with \"read everything we have ever stored\": one order by id, yesterday's sales, one customer's history.",
        },
        {
          type: "prose",
          md: `The file has no idea what's *in* it. It's a scroll, not a book — no table of contents, no [[index]] at the back, nothing to jump to. A database's core trade is keeping data organized so that "orders over $50" reads thousands of bytes instead of billions.

How it pulls that off is its own lesson later in this topic. For now, just feel the gap between *scanning everything* and *looking something up*.`,
        },
        { type: "heading", text: "Disaster four: nobody checks" },
        {
          type: "prose",
          md: `The last disaster is the quiet one. A file accepts any bytes, from anyone, no questions asked. Your app validates orders carefully today. But six months from now there's also a refund script, a support tool, and a one-off fix somebody ran at midnight — all writing to the same file, none sharing your validation code.`,
        },
        {
          type: "code",
          language: "text",
          filename: "orders.json — six months later",
          code: `{ "id": 208, "email": "ada@example.com", "total": 49.99 }
{ "id": 209, "email": null,              "total": -3 }
{ "id": "210-A",                         "total": "eleven" }`,
          caption:
            "A negative total, a missing email, an id that turned into a string. The file stored all of it without a murmur — and every report that reads this data must now defend itself against it.",
        },
        {
          type: "prose",
          md: `Notice where the rules actually live: in code, as habits. A habit protects only the code paths that practice it. Nothing about the *storage itself* says "a total is a number and never negative" — so one day, one isn't.`,
        },
        {
          type: "quiz",
          question:
            "A teammate says: *\"Easy fix — we write one `validateOrder()` function and make sure everything calls it before saving.\"* Which of the four disasters does that actually address?",
          options: [
            {
              text: "All four — bad data is the root cause of the other problems too.",
              explanation:
                "This is the \"bugs are just bad input\" mental model, and it misses that three of the four disasters have nothing to do with *values*. Two writers colliding, a crash tearing the file, and a 2 GB read per question are about *how* the file is written and read — perfectly valid orders trigger all three.",
            },
            {
              text: "Only the junk-data one — and only for the code paths that remember to call it.",
              correct: true,
              explanation:
                "Right, on both counts. It shrinks disaster four without eliminating it: the rule lives in code, so it protects exactly the writers that opt in — the refund script written next quarter isn't forced to call it. And the other three disasters are untouched, because they're about timing, crashes, and size, not values.",
            },
            {
              text: "None — validating in application code is pointless.",
              explanation:
                "This over-corrects into \"only storage-level rules count.\" Application-side checks catch mistakes early, give users friendly error messages, and stop obvious garbage at the edge. They're a courtesy worth having — they're just not *enforcement*, because nothing makes every writer run them.",
            },
          ],
        },
        { type: "heading", text: "Name the job" },
        {
          type: "model",
          title: "Four promises",
          md: `Flip each disaster over and you get the job description of a database, in four promises. Many writers at once, and nobody's update is silently lost — safe [[concurrency]]. A crash in the middle of a save, and you get all of the change or none of it — never a torn file. Questions get answered by looking things up, not by re-reading everything ever stored. And the rules live in the storage itself, enforced on every write, from every program, forever.

Hold onto this list. Whenever a database feature seems fussy or ceremonial later, trace it back — it is almost always one of these four promises being kept.`,
        },
        {
          type: "prose",
          md: `A database, then, isn't a smarter file. It's a separate, always-running program that owns your data files and makes those four promises about them. Your app stops touching the files and instead hands data over and asks questions. Building such a program well takes decades — which is exactly why you shouldn't build it, and should be picky about which one you trust.

This topic teaches **PostgreSQL** — everyone says Postgres — free, thirty years in the making, and famously hard to lie to. In the next lesson you'll start one on your own machine, hand it some data, and try to catch it breaking a promise. You'll fail. The ways you fail are the whole point.`,
        },
        {
          type: "takeaways",
          items: [
            "A JSON file on disk is real persistence, and for a small single-writer app it's an honest choice — I can defend that.",
            "Read–change–write against a shared file loses updates silently: both writers read the same past, and the last one to finish wins.",
            "A file write can die halfway, and one torn write can take every previous record with it — I need saves that are all-or-nothing.",
            "A flat file can only answer a question by reading and parsing everything; a database is organized to look the answer up.",
            "Validation in application code is a habit, not a guarantee — it protects only the code paths that remember to run it.",
            "A database is a program making four promises about my data: safe concurrent writes, all-or-nothing saves, fast questions at any size, and rules enforced in the storage itself.",
          ],
        },
      ],
    },
    {
      slug: "postgres-in-one-conversation",
      title: "Postgres in one conversation",
      hook: "Create a table, break its rules on purpose, and meet the bouncer that never lets your data lie.",
      depth: "intuition",
      minutes: 22,
      status: "ready",
      blocks: [
        {
          type: "prose",
          md: `Close your app and its variables vanish. Turn off your laptop and its memory empties. Every useful program eventually faces the same question: *where does the data live when I'm not running?* A database is a program whose entire job is answering that question well — it keeps data safe when everything else is off, and it answers questions about that data fast.

PostgreSQL — everyone says Postgres — is one such program, and it might be the most trusted piece of infrastructure on the internet. It's been in development since the 1980s, it's free, and it is very hard to lie to. That last part is the theme of this lesson.

You need zero background for this. If you've never typed a line of [[SQL|sql]], you're exactly who this sheet is for.`,
        },
        { type: "heading", text: "A program you can talk to" },
        {
          type: "prose",
          md: `The first thing to understand is almost embarrassingly simple: Postgres is *just a program*. It runs on a computer, it owns a folder of files, and it sits there listening. You don't open your data the way you open a document — you send Postgres a message, it does the work, and it sends an answer back.

Any program that talks to it is called a client. Your future web app is a client. The dashboard your company uses is a client. And the one we'll use today is \`psql\` — a chat window with your database, where you type messages by hand. This client/[[server]] split is the whole architecture: one program guards the data, everyone else asks politely.`,
        },
        {
          type: "code",
          language: "bash",
          filename: "terminal",
          code: `# Start a throwaway Postgres in one line (safe to break, easy to delete):
docker run -d --name learn-pg -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres:17

# Open the chat window:
docker exec -it learn-pg psql -U postgres

# You'll land at a prompt that looks like this:
# postgres=#`,
          caption:
            "One [[Docker|docker]] command gives you a real Postgres you can safely destroy. The `postgres=#` prompt means: connected, listening, go ahead.",
        },
        { type: "heading", text: "Your first table" },
        {
          type: "prose",
          md: `Postgres keeps data in **tables**. A table looks like a spreadsheet — rows and columns — but treating it like one is the first mistake everyone makes. A spreadsheet accepts anything you type into any cell. A table is a **contract**: every column declares what kind of value it holds and what rules it obeys, *before any data exists*.

Let's write one. Type this into \`psql\`, semicolon and all — the semicolon is how you say "message finished, go":`,
        },
        {
          type: "code",
          language: "sql",
          filename: "psql",
          code: `CREATE TABLE users (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text NOT NULL UNIQUE,
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);`,
          caption:
            "Four columns, and every line past the column name is a rule: `id` numbers itself and is the [[primary key]]; `email` must exist and never repeat; `created_at` stamps itself if you don't.",
        },
        {
          type: "prose",
          md: `Read that again as a set of promises, not a layout. *No user without an email. No two users with the same email. Every user has an id that Postgres itself assigns, so it can never clash.* Each of these rules is called a [[constraint]], and you have just hired an enforcer for them.

Now put a row in, and ask for it back:`,
        },
        {
          type: "code",
          language: "sql",
          filename: "psql",
          code: `INSERT INTO users (email, name) VALUES ('ada@example.com', 'Ada');

SELECT * FROM users;

--  id |      email      | name |          created_at
-- ----+-----------------+------+-------------------------------
--   1 | ada@example.com | Ada  | 2026-07-17 09:14:02.113+00
-- (1 row)`,
          caption:
            "You never mentioned `id` or `created_at` — Postgres filled both, exactly as the contract said it would.",
        },
        {
          type: "predict",
          question: `Now run the insert **again**, exactly as written: \`INSERT INTO users (email, name) VALUES ('ada@example.com', 'Ada');\`

Commit to an answer before you scroll: does Postgres create a second Ada, silently ignore you, or something else?`,
          reveal: `Something else — it refuses, loudly:

\`ERROR: duplicate key value violates unique constraint "users_email_key"\`

No second row was created. Nothing was half-created. The \`UNIQUE\` rule you declared on \`email\` isn't a suggestion or a warning — Postgres checked the incoming row against it and rejected the whole thing.

Here's the mindset shift: **that error is the product.** You will meet developers who see database errors as failures to be avoided. They're the opposite — each one is a bug that just got stopped at the door instead of moving into your data and living there.`,
        },
        {
          type: "model",
          title: "The bouncer at the door",
          md: `A table is a club with a dress code, and constraints are the bouncer. The bouncer checks *everyone*, every time, no matter which client sent the row — your app, a coworker's script, an intern in \`psql\` at 6 p.m. on a Friday. Code paths can forget to validate; the bouncer cannot.

Carry this question into every schema you ever design: *what should be impossible in this data?* Then write that impossibility down as a constraint, and it becomes physics instead of policy.`,
        },
        { type: "heading", text: "Types are promises too" },
        {
          type: "prose",
          md: `The column types are enforced with the same attitude. \`email\` is \`text\`, \`id\` is a number, \`created_at\` is a timestamp with a timezone — and Postgres will not quietly stuff the wrong shape of value into any of them:`,
        },
        {
          type: "code",
          language: "sql",
          filename: "psql",
          code: `INSERT INTO users (email, name, created_at)
VALUES ('bo@example.com', 'Bo', 'yesterday-ish');

-- ERROR:  invalid input syntax for type timestamp with time zone: "yesterday-ish"`,
          caption:
            "A spreadsheet would have happily stored the string. Postgres rejected the row before it touched disk.",
        },
        { type: "heading", text: "Tables that point at each other" },
        {
          type: "prose",
          md: `Real data is connected: orders belong to users, comments belong to posts. Postgres is a *relational* database — its superpower is declaring those connections so they can be enforced like everything else.

An orders table shouldn't hold a copy of the user's name and email. It should hold the user's \`id\` — a pointer — and declare that the pointer must be real. That declaration is called a [[foreign key]]:`,
        },
        {
          type: "code",
          language: "sql",
          filename: "psql",
          code: `CREATE TABLE orders (
  id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users (id),
  total   numeric(10,2) NOT NULL CHECK (total >= 0)
);

INSERT INTO orders (user_id, total) VALUES (1, 49.99);   -- Ada exists: accepted

INSERT INTO orders (user_id, total) VALUES (999, 12.00);
-- ERROR:  insert or update on table "orders" violates foreign key constraint
-- DETAIL: Key (user_id)=(999) is not present in table "users".`,
          caption:
            "`REFERENCES users (id)` means: this number must be a real user, forever. The `CHECK` rule bans negative totals while we're at it.",
        },
        {
          type: "quiz",
          question:
            "Ada (user id 1) has one order. You run `DELETE FROM users WHERE id = 1;`. What happens?",
          options: [
            {
              text: "Ada is deleted; her order stays, pointing at a user that no longer exists.",
              explanation:
                "This is the spreadsheet mental model — delete a row here, forget the rows over there. It's exactly the broken state foreign keys exist to prevent, and Postgres will not allow it.",
            },
            {
              text: "Postgres refuses the DELETE with a foreign key error.",
              correct: true,
              explanation:
                "Right. Her order still points at her, so deleting her would break the promise `REFERENCES` made. The bouncer works in both directions: it blocks bad rows coming in *and* deletions that would orphan existing rows. (If you *want* deletes to sweep away the orders too, you declare that up front with `ON DELETE CASCADE` — it's opt-in, never a surprise.)",
            },
            {
              text: "Postgres deletes Ada and her orders in one go, automatically.",
              explanation:
                "That behavior exists — `ON DELETE CASCADE` — but you must ask for it when declaring the foreign key. Making mass deletion the *default* would let one innocent-looking DELETE silently destroy data across the database. Postgres defaults to refusing.",
            },
          ],
        },
        {
          type: "warstory",
          title: "The rows that validated themselves",
          md: `A team I knew ran two services against one database. Service A validated everything in application code — required fields, sane amounts — and the team was proud of it. Service B was a "quick internal tool" that wrote to the same tables and skipped all of that. Nobody noticed for four months, because both services *read* mostly their own rows.

Then finance ran a quarterly report across the whole table and found orders with no user, totals of \`-3\`, and empty emails — thousands of them, aged like wine. Cleaning it up took two engineers most of a sprint; the fix that prevented it forever took twenty minutes: \`NOT NULL\`, a \`CHECK\`, and a foreign key.

The transferable lesson: **application-side validation is a courtesy; database constraints are the law.** Any table more than one code path can write to will eventually be written to by the path without the manners.`,
        },
        { type: "heading", text: "Kill it and come back" },
        {
          type: "prose",
          md: `One last move, and it's the whole point of the species. Stop the database — the hard way — and start it again:

\`docker restart learn-pg\`

Reconnect, run \`SELECT * FROM users;\`, and Ada is still there. Obvious? It shouldn't be. Between those two commands the Postgres process *died with everything in memory*. The reason your row survived is a piece of machinery called the write-ahead log, and getting [[durability]] right — being allowed to say "saved" and never take it back — is some of the hardest engineering in the field. That's the floor below this one, and we'll pull it up in the internals module.

So here's the map of where you now stand. You can talk to Postgres and make it keep promises. Next you learn to *ask real questions* (that's SQL, and it's a nicer language than its reputation), then how Postgres actually runs those questions, then the machinery underneath, then the production floor where the pager lives.`,
        },
        {
          type: "deepdive",
          title: "What one INSERT sets in motion",
          md: `Your one-line INSERT triggered a small parade. Postgres **parsed** the SQL into a structure it can reason about, **planned** how to execute it, checked every constraint you declared, wrote the change to the [[write-ahead log]] and made sure it reached disk, updated the table's pages in memory, and only *then* told you \`INSERT 0 1\`. Every stage of that parade is a lesson later in this topic — by the end, none of it will be mysterious.`,
        },
        {
          type: "takeaways",
          items: [
            "A database is a program that owns your data files and answers messages — my app is just one client among many.",
            "A table is a contract, not a spreadsheet: types and constraints are rules Postgres enforces on every row, from every client, every time.",
            "A constraint error is the system working — a bug stopped at the door instead of stored.",
            "A foreign key makes connections between tables real: no order can point at a user who isn't there, and no delete may orphan it.",
            "Validation in app code is a courtesy; constraints in the database are the law.",
            "Postgres survives being killed mid-flight — and the machinery that makes that true (the write-ahead log) is a floor below, waiting.",
          ],
        },
      ],
    },
    {
      slug: "a-postgres-to-break",
      title: "Get a Postgres you can break",
      hook: "Docker, psql survival commands, and a sandbox where every mistake is free.",
      depth: "intuition",
      minutes: 12,
      status: "ready",
      blocks: [
        {
          type: "prose",
          md: `Last lesson you ran one \`docker run\` command on faith and got a working Postgres. This one makes the sandbox *yours*: how to pause it, resume it, wipe it back to clean, and move around inside \`psql\` without feeling lost. Nothing here is deep — but it's exactly the stuff that decides whether you experiment freely or tiptoe.

And you should experiment freely. This database holds nothing anyone cares about. Later in this topic you'll see how careful engineers are around production databases; the way to earn that carefulness is to be cheerfully reckless here first.`,
        },
        { type: "heading", text: "The sandbox lifecycle" },
        {
          type: "code",
          language: "bash",
          filename: "terminal",
          code: `docker stop learn-pg       # pause the sandbox (data stays)
docker start learn-pg      # resume it — tables and rows intact
docker ps                  # what's running right now?
docker ps -a               # ...including the stopped ones

docker rm -f -v learn-pg   # destroy it: container AND its data, gone`,
          caption:
            "`stop` and `start` are a pause button. `rm -f -v` is the shredder.",
        },
        {
          type: "prose",
          md: `Two ideas to hold. First, the [[container]] is the running box, and \`docker stop\` just closes the lid — the process ends, the files stay. \`docker start\` lifts the lid and everything is where you left it.

Second, your data does *not* live in your project folder. The Postgres image quietly keeps its data files in a Docker [[volume|docker volume]] — a piece of disk that Docker manages on the side. That's why the \`-v\` in the destroy command matters: without it, deleting the container leaves the volume behind as an orphan. \`docker volume ls\` shows any strays; \`docker volume prune\` sweeps them up.`,
        },
        {
          type: "predict",
          question: `You run \`docker rm -f -v learn-pg\`, then re-run the exact \`docker run\` one-liner from last lesson, reconnect with \`psql\`, and type \`SELECT * FROM users;\`.

Commit before revealing: is Ada still there?`,
          reveal: `No — and it's more thorough than you might have guessed: \`ERROR: relation "users" does not exist\`. The *table* is gone, not just her row. \`rm -f -v\` shredded the container and its data volume, and the fresh \`docker run\` built a brand-new Postgres with an empty data directory. Compare that with last lesson, where Ada survived \`docker restart\` — restarting reuses the same volume; destroying removes it.

That asymmetry is your reset button. Whenever the sandbox gets weird — half-finished experiments, tables you regret — burn it down and re-run the one-liner. Ten seconds later you're clean. Knowing you can reset this fast is what makes every experiment below feel safe, because it is.`,
        },
        { type: "heading", text: "The psql survival kit" },
        {
          type: "prose",
          md: `\`psql\` speaks two languages, and telling them apart un-confuses most beginner sessions. SQL statements go to the *database*, and they only run when you end them with a semicolon. Backslash commands go to *psql itself*, run the instant you press enter, and need no semicolon. You can live comfortably on about five of them:`,
        },
        {
          type: "code",
          language: "text",
          filename: "psql",
          code: `\\dt         -- list the tables you've created
\\d users    -- describe one table: columns, types, rules
\\d          -- list everything Postgres is keeping for you
\\x          -- toggle expanded output (for rows too wide to read)
\\q          -- quit psql (the database keeps running)`,
          caption:
            "Backslash commands are questions to psql, not to the database — no semicolon, instant answer.",
        },
        {
          type: "prose",
          md: `Run \`\\dt\` now and you'll see \`users\` and \`orders\` from last lesson. Then \`\\d users\` — that's the contract you wrote, read back to you: every column, every type, every rule, plus a couple of [[indexes|index]] Postgres built on its own to enforce the primary key and the unique email. \`\\d tablename\` is the single command you'll type most in your career; it answers "what am I actually dealing with here?"

Two comfort features round out the kit. The up arrow replays your previous commands, just like your shell — most real psql work is up-arrow, change one word, enter. And \`\\x\` saves you the first time a \`SELECT\` sprays a wide row across three screen lines: toggle it and each row prints as a neat label-and-value list instead.`,
        },
        {
          type: "pitfall",
          title: "The prompt that swallowed your query",
          md: `You type \`SELECT * FROM users\` and press enter. Nothing happens. The prompt changes from \`postgres=#\` to \`postgres-#\` and just sits there. Every beginner hits this inside the first ten minutes, and half of them decide the database is frozen.

It isn't. That dash is psql saying *your sentence isn't finished* — it's still collecting the statement, waiting for the semicolon. Type \`;\` and press enter, and the query runs immediately. From then on, read the prompt like a face: \`=#\` means "ready for a new statement", \`-#\` means "still listening to the last one".`,
        },
        { type: "heading", text: "Break it on purpose" },
        {
          type: "prose",
          md: `Now the homework, and I mean it: hurt this database. Run \`DROP TABLE orders;\` and watch a whole table vanish in one line, no confirmation asked. Try \`DELETE FROM users;\` with no WHERE — but guess first whether the bouncer from last lesson allows it while orders still point at users. Insert junk. Misspell keywords and read what comes back, because Postgres error messages are unusually good and learning their shape is a real skill.

When the wreckage stops being interesting: \`docker rm -f -v learn-pg\`, re-run the one-liner, clean slate.`,
        },
        {
          type: "mentor",
          md: `The respect senior engineers show a production database looks like fear from the outside, but it wasn't learned by being careful. It was learned by breaking things somewhere cheap and remembering the shape of the wreckage. That's what this sandbox is for. Nobody really learns what \`DROP TABLE\` means from a manual — they learn it from the small jolt of watching a table they liked disappear. Collect those jolts here, where they cost nothing, and they'll be instincts by the time you're near data that matters.`,
        },
        {
          type: "quiz",
          question:
            "You ran `docker stop learn-pg` yesterday and shut your laptop. Today you want your `users` table back. What's the state of things?",
          options: [
            {
              text: "The data is gone — a stopped container loses its contents.",
              explanation:
                "This treats a container like RAM: power off, contents vanish. Wrong model — `stop` only ends the *process*. The container's filesystem and its data volume stay on your disk untouched. Only `rm` deletes the container, and only `-v` (or a volume command) deletes the data.",
            },
            {
              text: "The data is safe on your disk; `docker start learn-pg` brings the whole database back.",
              correct: true,
              explanation:
                "Right. Stop and start are a pause button. Postgres shut down cleanly when you stopped it, the data volume sat untouched overnight, and `start` boots the same database against the same files. Then `docker exec -it learn-pg psql -U postgres` and you're back at the prompt, tables and all.",
            },
            {
              text: "The data survived, but Postgres rebuilds the tables by re-running your command history at startup.",
              explanation:
                "This is the \"database as replayed script\" model — as if tables only exist because commands get run again. Nothing replays. Your `CREATE TABLE` changed real files in the data volume the moment it ran; those files *are* the database, and `start` simply opens them.",
            },
          ],
        },
        {
          type: "takeaways",
          items: [
            "My sandbox has a lifecycle I control: `stop` and `start` are a pause button, and `docker rm -f -v` plus the original `docker run` line is a ten-second reset to clean.",
            "Postgres's data lives in a Docker volume, not in my project folder — destroying the container without `-v` leaves that data behind as an orphan.",
            "Inside psql, backslash commands talk to psql and run instantly; SQL talks to the database and waits for a semicolon.",
            "`\\dt` lists my tables, `\\d users` reads a table's contract back to me, `\\x` fixes unreadable wide rows, and `\\q` gets me out.",
            "A `postgres-#` prompt means psql is still waiting for my semicolon — nothing is frozen.",
            "Mistakes in this sandbox are free: the right place to learn a database's edges is here, by running everything and breaking everything, not in production.",
          ],
        },
      ],
    },
  ],
};
