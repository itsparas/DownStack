import { NextResponse } from "next/server";
import { topics, countLessons, totalMinutes } from "@downstack/content";

/**
 * GET /api/topics — the catalog as JSON.
 *
 * Next.js is the backend too: route handlers live beside the pages and share
 * the same @downstack/content package, so the API can never drift from the UI.
 * A future mobile client or CLI reads this same endpoint.
 */
export function GET() {
  const catalog = topics.map((t) => {
    const { total, ready } = countLessons(t);
    return {
      slug: t.slug,
      title: t.title,
      tagline: t.tagline,
      status: t.status,
      lessons: { total, ready },
      estimatedMinutes: totalMinutes(t),
      modules: t.modules.map((m) => ({
        slug: m.slug,
        title: m.title,
        lessons: m.lessons.map((l) => ({
          slug: l.slug,
          title: l.title,
          hook: l.hook,
          depth: l.depth,
          minutes: l.minutes,
          status: l.status,
        })),
      })),
    };
  });

  return NextResponse.json({ topics: catalog });
}
