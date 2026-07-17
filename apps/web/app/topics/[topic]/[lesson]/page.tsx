import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  topics,
  flattenLessons,
  getLesson,
  getNeighbors,
  countLessons,
  DEPTHS,
} from "@downstack/content";
import { TitleBlock, DepthBadge } from "@downstack/ui";
import { LessonRenderer } from "@/components/lesson-renderer";
import { SheetIndex } from "@/components/toc";
import { CompleteButton } from "@/components/progress";

export function generateStaticParams() {
  return topics
    .filter((t) => t.status === "ready")
    .flatMap((t) =>
      flattenLessons(t)
        .filter((r) => r.lesson.status === "ready")
        .map((r) => ({ topic: t.slug, lesson: r.lesson.slug }))
    );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; lesson: string }>;
}): Promise<Metadata> {
  const { topic, lesson } = await params;
  const ref = getLesson(topic, lesson);
  return {
    title: ref ? `${ref.lesson.title} — ${ref.topic.title}` : "Lesson",
    description: ref?.lesson.hook,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ topic: string; lesson: string }>;
}) {
  const { topic: topicSlug, lesson: lessonSlug } = await params;
  const ref = getLesson(topicSlug, lessonSlug);
  if (!ref || ref.lesson.status !== "ready") notFound();

  const { topic, module: mod, lesson, number } = ref;
  const { total } = countLessons(topic);
  const { prev, next } = getNeighbors(topicSlug, lessonSlug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      {/* Header */}
      <header className="mb-12">
        <nav className="mb-6 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-chalkfaint">
          <Link
            href="/topics"
            className="transition-colors hover:text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
          >
            Topics
          </Link>
          <span aria-hidden className="mx-2 opacity-50">
            /
          </span>
          <Link
            href={`/topics/${topic.slug}`}
            className="transition-colors hover:text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
          >
            {topic.title}
          </Link>
        </nav>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <DepthBadge depth={lesson.depth} />
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-chalkfaint">
            {mod.title}
          </span>
        </div>
        <h1 className="mb-4 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-chalk sm:text-5xl">
          {lesson.title}
        </h1>
        <p className="mb-8 max-w-2xl font-serif text-[1.15rem] italic leading-[1.7] text-chalkdim">
          {lesson.hook}
        </p>
        <TitleBlock
          rows={[
            {
              label: "Sheet",
              value: `${String(number).padStart(2, "0")} of ${String(
                total
              ).padStart(2, "0")}`,
            },
            { label: "Scale / depth", value: DEPTHS[lesson.depth].label },
            { label: "Est. time", value: `${lesson.minutes} min` },
            { label: "Rev", value: "A" },
          ]}
        />
      </header>

      {/* Body + sheet index */}
      <div className="flex gap-12">
        <article className="min-w-0 max-w-3xl flex-1">
          <LessonRenderer blocks={lesson.blocks} />

          {/* Footer nav */}
          <footer className="mt-16 border-t border-line/70 pt-8">
            <div className="mb-8 flex justify-center">
              <CompleteButton topic={topic.slug} lesson={lesson.slug} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/topics/${topic.slug}/${prev.lesson.slug}`}
                  className="group rounded-sm border border-line bg-panel/50 p-5 transition-colors hover:border-amber/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
                >
                  <div className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-chalkfaint">
                    ← Previous sheet
                  </div>
                  <div className="font-display text-[1.02rem] font-semibold text-chalk transition-colors group-hover:text-amber">
                    {prev.lesson.title}
                  </div>
                </Link>
              ) : (
                <div aria-hidden />
              )}
              {next ? (
                <Link
                  href={`/topics/${topic.slug}/${next.lesson.slug}`}
                  className="group rounded-sm border border-line bg-panel/50 p-5 text-right transition-colors hover:border-amber/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
                >
                  <div className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-chalkfaint">
                    Next sheet →
                  </div>
                  <div className="font-display text-[1.02rem] font-semibold text-chalk transition-colors group-hover:text-amber">
                    {next.lesson.title}
                  </div>
                </Link>
              ) : (
                <div className="rounded-sm border border-dashed border-line/70 p-5 text-right">
                  <div className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-chalkfaint">
                    Next sheet
                  </div>
                  <div className="font-serif text-[0.95rem] italic text-chalkfaint">
                    In drafting — more sheets on the way
                  </div>
                </div>
              )}
            </div>
          </footer>
        </article>

        <SheetIndex blocks={lesson.blocks} />
      </div>
    </div>
  );
}
