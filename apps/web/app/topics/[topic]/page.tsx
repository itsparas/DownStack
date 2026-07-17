import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  topics,
  getTopic,
  flattenLessons,
  countLessons,
  totalMinutes,
} from "@downstack/content";
import { TitleBlock, DepthBadge } from "@downstack/ui";
import { TopicProgress } from "@/components/progress";

export function generateStaticParams() {
  return topics
    .filter((t) => t.status === "ready")
    .map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getTopic(slug);
  return { title: topic?.title ?? "Topic", description: topic?.tagline };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  const topic = getTopic(slug);
  if (!topic || topic.status !== "ready") notFound();

  const { total, ready } = countLessons(topic);
  const minutes = totalMinutes(topic);
  const readySlugs = flattenLessons(topic)
    .filter((r) => r.lesson.status === "ready")
    .map((r) => r.lesson.slug);

  // Running lesson number across modules, matching the reader's sheet numbers.
  let n = 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-chalkfaint">
        <span aria-hidden className="inline-block h-px w-6 bg-current opacity-60" />
        Topic overview
      </div>
      <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-chalk sm:text-5xl">
        {topic.title}
      </h1>
      <p className="mb-8 max-w-2xl font-serif text-[1.1rem] leading-[1.8] text-chalkdim">
        {topic.description}
      </p>

      <div className="mb-6">
        <TitleBlock
          rows={[
            { label: "Sheets", value: `${ready} issued / ${total}` },
            { label: "Est. time", value: `~${Math.round(minutes / 60)} hours` },
            { label: "Modules", value: topic.modules.length },
            { label: "Rev", value: "A" },
          ]}
        />
      </div>

      <div className="mb-12">
        <TopicProgress topic={topic.slug} lessonSlugs={readySlugs} />
      </div>

      <section className="mb-14 rounded-sm border border-line bg-panel/50 p-6 sm:p-7">
        <div className="mb-4 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fieldgreen">
          <span aria-hidden className="inline-block h-px w-6 bg-current opacity-70" />
          After this topic you can
        </div>
        <ul className="space-y-3">
          {topic.outcomes.map((o, i) => (
            <li
              key={i}
              className="flex gap-3 font-serif text-[1rem] leading-relaxed text-chalkdim"
            >
              <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-fieldgreen/80" />
              {o}
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-12">
        {topic.modules.map((mod, mi) => (
          <section key={mod.slug}>
            <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-chalkfaint">
              Module {String(mi + 1).padStart(2, "0")}
            </div>
            <h2 className="mb-2 font-display text-2xl font-bold tracking-tight text-chalk">
              {mod.title}
            </h2>
            <p className="mb-6 max-w-2xl font-serif text-[0.98rem] leading-relaxed text-chalkfaint">
              {mod.description}
            </p>
            <ol className="divide-y divide-line/60 rounded-sm border border-line bg-panel/40">
              {mod.lessons.map((lesson) => {
                n += 1;
                const num = String(n).padStart(2, "0");
                const soon = lesson.status === "soon";
                const row = (
                  <div className="flex items-start gap-4 px-5 py-4 sm:items-center">
                    <span className="font-mono text-sm text-chalkfaint">
                      {num}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`font-display text-[1.05rem] font-semibold tracking-tight ${
                          soon ? "text-chalkfaint" : "text-chalk group-hover:text-amber"
                        } transition-colors`}
                      >
                        {lesson.title}
                      </div>
                      <div className="mt-0.5 font-serif text-[0.9rem] leading-snug text-chalkfaint">
                        {lesson.hook}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                      <DepthBadge depth={lesson.depth} />
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-chalkfaint">
                        {soon ? "In drafting" : `${lesson.minutes} min`}
                      </span>
                    </div>
                  </div>
                );
                return (
                  <li key={lesson.slug}>
                    {soon ? (
                      <div className="opacity-60">{row}</div>
                    ) : (
                      <Link
                        href={`/topics/${topic.slug}/${lesson.slug}`}
                        className="group block transition-colors hover:bg-raised/40 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber"
                      >
                        {row}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
