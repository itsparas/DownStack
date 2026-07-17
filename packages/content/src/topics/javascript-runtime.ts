import type { Topic } from "../types";

export const javascriptRuntime: Topic = {
  slug: "javascript-runtime",
  title: "JavaScript: the runtime",
  tagline: "One thread, two queues, and everything that follows.",
  description:
    "Not the language — the machine it runs on. The event loop, microtasks, the illusion of concurrency, what V8 does to your objects, and why one slow endpoint can take down every endpoint.",
  status: "ready",
  outcomes: [
    "Predict the exact output order of mixed timers, promises, and sync code — and explain why",
    "Diagnose event-loop starvation in production from symptoms alone",
    "Decide when work belongs on the main thread, in a worker, or in another process",
    "Explain what `await` compiles into, and what that costs",
  ],
  modules: [
    {
      slug: "event-loop",
      title: "The event loop",
      description:
        "The scheduler you've been using without a contract. What runs, when, and who gets starved.",
      lessons: [
        {
          slug: "settimeout-is-a-lie",
          title: "setTimeout(fn, 0) is a lie",
          hook: "If JavaScript is single-threaded, who's watching the timer while your code runs?",
          depth: "intuition",
          minutes: 15,
          status: "ready",
          blocks: [
            {
              type: "prose",
              md: `You've been told JavaScript is [[single-threaded]]. You've also written \`setTimeout\`, watched network requests resolve while your code kept running, and animated a spinner during a fetch. Both things can't be casually true — if there's one thread, *who is watching the clock* while your function runs?

The answer is a scheduling machine called the **event loop**, and it has an exact, learnable contract. Most JS developers use it for years on vibes. You're going to learn the contract, because every mysterious ordering bug, every frozen server, every "why does my UI not update until the loop finishes" — they're all just clauses in this contract you haven't read yet.`,
            },
            { type: "heading", text: "The four-line interview question" },
            {
              type: "code",
              language: "javascript",
              filename: "puzzle.js",
              code: `console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

console.log("D");`,
            },
            {
              type: "predict",
              question:
                "Commit to an answer before revealing — say it out loud. What order do A, B, C, D print in? And the real question: *why would C and B differ at all?* Both are 'async, delay zero'.",
              reveal: `**A, D, C, B.**

A and D are [[synchronous]] — the current run of your script finishes *entirely* before anything scheduled gets a turn. That's rule one: the loop never interrupts running code.

C beats B because the [[runtime]] has **two different waiting rooms**. [[Promise|promise]] callbacks go into the *microtask queue*; timer callbacks go into the *task queue* (you'll hear "macrotask"). And the contract says: after the current script finishes, drain **all** [[microtasks|microtask]] before touching even one task. \`setTimeout(fn, 0)\` never meant "now." It means "in a future turn of the loop, after every microtask has gone first." It is a polite fiction.`,
            },
            { type: "heading", text: "One thread, two queues" },
            {
              type: "prose",
              md: `Here's the whole machine, small enough to hold in your head. There is one [[call stack]] — the [[thread]]. There is a **task queue** for "big" [[callbacks|callback]]: timers, [[I/O|i/o]] completions, clicks. And there is a **microtask queue** for "urgent follow-ups": promise reactions, \`queueMicrotask\`.

The loop's contract, in order: run one task to completion → drain the *entire* microtask queue (including microtasks queued by other microtasks) → in browsers, maybe render → take the next task. That's it. Everything else follows from that.

Notice the sharp edge inside "drain the entire microtask queue": if microtasks keep scheduling microtasks, the loop *never gets back* to tasks. Rendering, timers, incoming requests — all of it waits.`,
            },
            {
              type: "model",
              title: "The kitchen with one chef",
              md: `One chef (your thread) works tickets from a rail (the task queue). But stuck to the current ticket are sticky notes (microtasks) — "sauce on the side," "extra garnish" — and the house rule is: **finish every sticky note before taking the next ticket.** Sticky notes can spawn more sticky notes. A ticket that keeps generating them starves the whole rail — and the diners (your users) don't know about the notes; they just know their food never came. Every event-loop problem you'll ever debug is either a *ticket that's too big* or *sticky notes that never end*.`,
            },
            {
              type: "code",
              language: "javascript",
              filename: "starvation.js",
              code: `function starve() {
  Promise.resolve().then(starve);  // each microtask schedules another
}
starve();

setTimeout(() => console.log("I will never, ever run"), 0);
// The microtask queue never empties, so the loop never
// advances to the task queue. No error. No warning. Just silence.`,
              caption:
                "[[Starvation|starvation]] is silent — no exception, no log line, just a program that stops responding while burning 100% CPU.",
            },
            {
              type: "pitfall",
              title: "One slow endpoint is every slow endpoint",
              md: `In a [[Node|node.js]] server, the [[event loop]] is shared by **every request in the process**. Synchronous work — a huge \`JSON.parse\`, a tight loop over a million rows, a sync file read — doesn't slow down *that* request. It freezes *all of them*, plus your timers, plus your health checks. The [[p99 latency]] of your entire service can never be better than the single longest synchronous task anywhere in the codebase. "But that [[endpoint]] is rarely called" is not a defense — it just schedules the incident for later.`,
            },
            {
              type: "warstory",
              title: "The health check that lied",
              md: `A Node service starts failing health checks under load — the [[orchestrator]] sees timeouts on \`/health\`, declares instances dead, restarts them, and the restarts pile more load on the survivors. Cascade, page, war room. The team stares at \`/health\` for an hour; it's four lines and does nothing.

The culprit was a reporting endpoint three files away that \`JSON.stringify\`'d a ~300MB object graph — 9 to 15 seconds of synchronous work on the loop. Every request behind it, including the innocent health check, sat frozen in the [[task queue]]. The fix was boring: stream the report and move the [[serialization]] into a [[worker thread]]. The lesson was not boring: **in an event-loop runtime you don't debug the endpoint that's slow, you debug the process that's busy.** The health check wasn't lying after all — it was reporting, with perfect accuracy, that the loop was jammed.`,
            },
            {
              type: "deepdive",
              title: "Under Node: libuv phases and the nextTick jump-queue",
              md: `The browser story ("task queue") is a simplification Node makes concrete. Node's loop — implemented by **libuv** — cycles through named phases: *timers* (your \`setTimeout\`s), *pending callbacks*, *poll* (where it blocks waiting for I/O), *check* (\`setImmediate\` lives here), and *close callbacks*. Between every callback, Node drains two microtask lanes — and here's the trap: \`process.nextTick\` has its **own** queue that drains *before* promise microtasks. It's the jump-queue's jump-queue.

Ordering after sync code: nextTick callbacks → promise callbacks → then timers or immediates. And a genuinely cursed detail for your next code review: plain \`setTimeout(fn, 0)\` vs \`setImmediate(fn)\` at top level can fire in **either order** — the timer's 1ms floor may or may not have elapsed when the loop reaches the timers phase. Inside an I/O callback, though, \`setImmediate\` always wins, because *check* comes right after *poll*. If ordering matters, encode it in code, never in queue trivia.`,
              code: {
                language: "javascript",
                filename: "node-ordering.js",
                code: `setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));

// Always: nextTick, promise   (microtask lanes, in priority order)
// Then:   timeout / immediate (order not guaranteed at top level!)`,
              },
            },
            {
              type: "quiz",
              question:
                "In Node, after the current synchronous code finishes, which callback runs FIRST?",
              options: [
                {
                  text: "process.nextTick(cb)",
                  correct: true,
                  explanation:
                    "Right — the nextTick queue drains before promise microtasks, and both drain before any timer, immediate, or I/O callback gets a turn.",
                },
                {
                  text: "setTimeout(cb, 0)",
                  explanation:
                    "Timers are tasks — they wait until every microtask (nextTick and promises) has drained, and then only run when the loop reaches the timers phase.",
                },
                {
                  text: "Promise.resolve().then(cb)",
                  explanation:
                    "Close — promises are microtasks and beat all tasks. But in Node, the nextTick queue is drained before the promise queue. Second place.",
                },
                {
                  text: "setImmediate(cb)",
                  explanation:
                    "setImmediate runs in the check phase — after all microtasks, and after the loop cycles to that phase. Last of these four here.",
                },
              ],
            },
            {
              type: "takeaways",
              items: [
                "The loop never interrupts running code — sync code always finishes before *anything* scheduled runs.",
                "Two waiting rooms: microtasks (promises) drain **completely** after every task; tasks (timers, I/O) run one per turn.",
                "`setTimeout(fn, 0)` means 'a future turn, after all microtasks' — it is a floor, never a deadline.",
                "Microtasks that spawn microtasks starve the loop silently; long sync tasks freeze every request in the [[process]], not just their own.",
                "In Node: nextTick → promises → phases (timers, poll, check). If correctness depends on queue trivia, restructure the code.",
              ],
            },
            {
              type: "mentor",
              md: `Here's what changes now that you've read the contract: async bugs stop being spooky. Next time an ordering surprises you, don't rerun it and shrug — narrate the loop out loud. "Script finishes… microtasks drain… timers phase…" You will find the bug mid-sentence, most of the time. Next lesson we watch what \`await\` actually compiles into, and the contract will do most of the work for us.`,
            },
          ],
        },
        {
          slug: "what-await-compiles-to",
          title: "What await actually compiles into",
          hook: "Every await is a return statement in disguise. Let's read the disguise.",
          depth: "mechanics",
          minutes: 18,
          status: "soon",
          blocks: [],
        },
        {
          slug: "workers-and-the-escape-hatch",
          title: "Workers: the escape hatch from one thread",
          hook: "When the answer is 'get off the loop' — and what message-passing really costs.",
          depth: "field",
          minutes: 20,
          status: "soon",
          blocks: [],
        },
      ],
    },
    {
      slug: "v8-internals",
      title: "Inside V8",
      description:
        "Hidden classes, inline caches, and the optimizing/deoptimizing dance your objects are secretly in.",
      lessons: [
        {
          slug: "hidden-classes",
          title: "Hidden classes: why property order matters",
          hook: "V8 is building C-style structs behind your back. Help it or fight it.",
          depth: "internals",
          minutes: 24,
          status: "soon",
          blocks: [],
        },
        {
          slug: "garbage-collection",
          title: "GC: the generational bargain",
          hook: "Why most objects die young, and how V8 bets its pause times on it.",
          depth: "internals",
          minutes: 22,
          status: "soon",
          blocks: [],
        },
      ],
    },
  ],
};
