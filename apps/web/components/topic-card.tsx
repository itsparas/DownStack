import Link from "next/link";
import type { Topic } from "@downstack/content";
import { countLessons, totalMinutes } from "@downstack/content";

export function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const { total, ready } = countLessons(topic);
  const minutes = totalMinutes(topic);
  const soon = topic.status === "soon";

  const inner = (
    <article
      className={`group relative flex h-full flex-col rounded-sm border bg-panel/60 p-6 transition-colors ${
        soon
          ? "border-line/60"
          : "border-line hover:border-amber/50 hover:bg-panel"
      }`}
    >
      <div className="mb-4 flex items-baseline justify-between font-mono text-[0.65rem] uppercase tracking-[0.18em] text-chalkfaint">
        <span>Dwg {String(index + 1).padStart(2, "0")}</span>
        {soon ? (
          <span className="rounded-sm border border-line px-2 py-0.5">
            In drafting
          </span>
        ) : (
          <span className="text-fieldgreen">
            {ready} of {total} sheets issued
          </span>
        )}
      </div>
      <h3
        className={`mb-2 font-display text-xl font-bold tracking-tight ${
          soon ? "text-chalkdim" : "text-chalk group-hover:text-amber"
        } transition-colors`}
      >
        {topic.title}
      </h3>
      <p className="mb-5 font-serif text-[0.95rem] leading-relaxed text-chalkfaint">
        {topic.tagline}
      </p>
      <div className="mt-auto flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.14em] text-chalkfaint">
        <span>
          {total} lessons · ~{Math.round(minutes / 60)}h
        </span>
        {!soon && (
          <span
            aria-hidden
            className="text-amber transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        )}
      </div>
    </article>
  );

  if (soon) return inner;
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
    >
      {inner}
    </Link>
  );
}
