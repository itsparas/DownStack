import Link from "next/link";
import { topics, DEPTHS, depthOrder } from "@downstack/content";
import { MentorNote, Pitfall, Predict, DEPTH_STYLE } from "@downstack/ui";
import { TopicCard } from "@/components/topic-card";

/* ------------------------------------------------------------------ */
/* Depth ladder as a cross-section drawing                             */
/* ------------------------------------------------------------------ */

/* CSS variables, not hexes — the drawing retints itself in dark mode. */
const STRATA_COLORS: Record<string, string> = {
  intuition: "var(--color-amber)",
  mechanics: "var(--color-copper)",
  internals: "var(--color-trace)",
  field: "var(--color-fieldgreen)",
};

function DepthLadder() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <svg
        viewBox="0 0 640 360"
        role="img"
        aria-label="Cross-section drawing of the four depth levels: intuition, mechanics, internals, in the field"
        className="w-full"
      >
        <rect
          x="1"
          y="1"
          width="638"
          height="358"
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="1.5"
        />
        {depthOrder.map((d, i) => {
          const y = 40 + i * 75;
          const c = STRATA_COLORS[d]!;
          return (
            <g key={d}>
              <path
                d={`M 40 ${y} C 160 ${y - 14}, 300 ${y + 14}, 440 ${y} S 580 ${y - 10}, 600 ${y}`}
                fill="none"
                stroke={c}
                strokeWidth="2"
                className={`strata-line strata-line-${i + 1}`}
              />
              <circle cx="40" cy={y} r="3" fill={c} />
              <text
                x="40"
                y={y + 24}
                fill={c}
                fontSize="13"
                fontFamily="var(--font-mono)"
                letterSpacing="0.14em"
              >
                {String(i + 1).padStart(2, "0")} · {DEPTHS[d].label.toUpperCase()}
              </text>
              <text
                x="40"
                y={y + 44}
                fill="var(--color-chalkfaint)"
                fontSize="12"
                fontFamily="var(--font-mono)"
              >
                {DEPTHS[d].blurb}
              </text>
            </g>
          );
        })}
        <text
          x="600"
          y="345"
          textAnchor="end"
          fill="var(--color-chalkfaint)"
          fontSize="11"
          fontFamily="var(--font-mono)"
          letterSpacing="0.12em"
        >
          FIG. 1 — SECTION VIEW, NOT TO SCALE
        </text>
      </svg>

      <div>
        <h2 className="mb-5 font-display text-3xl font-bold tracking-tight text-chalk">
          Every topic descends the same four strata
        </h2>
        <div className="space-y-4 font-serif text-[1.05rem] leading-[1.8] text-chalkdim">
          <p>
            Documentation starts at the API and stays there. A good mentor
            starts <em className="italic">before</em> the API — with the problem
            that forced the thing to exist — and doesn&rsquo;t stop until
            you&rsquo;ve seen the disk, the wire, or the scheduler underneath
            it.
          </p>
          <p>
            Downstack encodes that path as a ladder. You climb from{" "}
            <span className="text-amber">why it exists</span>, to{" "}
            <span className="text-copper">how it behaves</span>, to{" "}
            <span className="text-trace">what it&rsquo;s made of</span>, to{" "}
            <span className="text-fieldgreen">how it fails at 3&nbsp;a.m.</span>{" "}
            Nothing is hand-waved as &ldquo;advanced&rdquo; — advanced just
            means lower in the section view.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mentor method — dogfooded with the real components                  */
/* ------------------------------------------------------------------ */

function MentorMethod() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div className="lg:sticky lg:top-24">
        <div className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber">
          <span aria-hidden className="inline-block h-px w-6 bg-current opacity-70" />
          The mentor method
        </div>
        <h2 className="mb-5 font-display text-3xl font-bold tracking-tight text-chalk">
          Taught like a mentor,
          <br />
          not a manual
        </h2>
        <div className="space-y-4 font-serif text-[1.05rem] leading-[1.8] text-chalkdim">
          <p>
            Lessons here aren&rsquo;t walls of markdown. They&rsquo;re built
            from typed blocks, and the block types <em>are</em> the pedagogy:
            you&rsquo;re asked to predict before you&rsquo;re told, warned
            where everyone slips, handed named mental models you can reuse,
            and told the production stories that make it stick. And every
            lesson is written in plain English — when a hard word is
            unavoidable, it&rsquo;s underlined: click it for a simple
            explanation and a web search, without losing your place.
          </p>
          <p className="text-chalkfaint">
            These aren&rsquo;t mockups — they&rsquo;re the actual components,
            live. Try the one on the right.
          </p>
        </div>
      </div>

      <div>
        <MentorNote md="Anyone can show you the `CREATE INDEX` syntax. My job is to make sure you can feel the cost of that [[index]] every time a write happens — because one day a [[migration]] will time out in production and you'll know exactly why." />
        <Predict
          question="You append every write to the end of a single file, and keep an in-memory map from key to byte offset. **What just got fast, and what stayed slow?**"
          reveal="Writes are now sequential appends — the fastest thing a disk can do — and reads are one hash lookup plus one seek. What stayed slow: *starting up* (you must rebuild the map) and *range scans* (the map knows nothing about order). Congratulations, you've re-derived the trade-off behind Bitcask — and the reason B-trees still exist."
        />
        <Pitfall
          title="Durability theater"
          md="Calling `write()` and assuming the bytes are on disk. They're in the [[page cache]]. Power fails before [[fsync]], and your database quietly forgets the last few hundred commits — while having *acknowledged every one of them*."
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const ready = topics.filter((t) => t.status === "ready");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="blueprint-grid blueprint-fade absolute inset-0"
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
          <div className="mb-6 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-chalkfaint">
            <span aria-hidden className="inline-block h-px w-6 bg-current opacity-60" />
            An engineering school for the layer beneath
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-chalk sm:text-6xl lg:text-7xl">
            Most courses teach you the API.
            <br />
            <span className="text-amber">Downstack teaches you the machine.</span>
          </h1>
          <p className="mt-7 max-w-2xl font-serif text-lg leading-[1.8] text-chalkdim">
            Databases, runtimes, operating systems, networks — taught the way a
            senior engineer would teach them across a whiteboard: from first
            principles, down to the internals, with the production scars to
            prove it.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/topics/databases/a-database-in-two-functions"
              className="rounded-sm border border-amber bg-amber/10 px-6 py-3 font-mono text-[0.75rem] uppercase tracking-[0.15em] text-amber transition-colors hover:bg-amber/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
            >
              Start lesson 01 →
            </Link>
            <Link
              href="/topics"
              className="rounded-sm border border-line px-6 py-3 font-mono text-[0.75rem] uppercase tracking-[0.15em] text-chalkdim transition-colors hover:border-chalkfaint hover:text-chalk focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
            >
              Browse the drawing set
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-chalkfaint">
            {depthOrder.map((d) => {
              const s = DEPTH_STYLE[d]!;
              return (
                <span key={d} className="inline-flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Depth ladder */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <DepthLadder />
      </section>

      {/* Mentor method */}
      <section className="border-y border-line/60 bg-panel/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <MentorMethod />
        </div>
      </section>

      {/* Topics */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-chalkfaint">
              <span aria-hidden className="inline-block h-px w-6 bg-current opacity-60" />
              The drawing set
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-chalk">
              Topics
            </h2>
          </div>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-chalkfaint">
            {ready.length} issued · {topics.length - ready.length} in drafting
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t, i) => (
            <TopicCard key={t.slug} topic={t} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
