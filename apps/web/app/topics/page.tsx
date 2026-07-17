import type { Metadata } from "next";
import { topics } from "@downstack/content";
import { TopicCard } from "@/components/topic-card";

export const metadata: Metadata = {
  title: "Topics",
  description: "The Downstack drawing set — every topic, every depth.",
};

export default function TopicsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-chalkfaint">
        <span aria-hidden className="inline-block h-px w-6 bg-current opacity-60" />
        Index of drawings
      </div>
      <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-chalk">
        Topics
      </h1>
      <p className="mb-12 max-w-2xl font-serif text-[1.05rem] leading-[1.8] text-chalkdim">
        Each topic is a full descent: intuition first, then mechanics, then the
        internals, then how it behaves in production. Topics marked{" "}
        <span className="font-mono text-[0.85rem] uppercase tracking-wider text-chalkfaint">
          in drafting
        </span>{" "}
        have their outline pinned to the board but no sheets issued yet.
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t, i) => (
          <TopicCard key={t.slug} topic={t} index={i} />
        ))}
      </div>
    </div>
  );
}
