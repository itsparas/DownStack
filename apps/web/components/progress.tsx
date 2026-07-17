"use client";

/**
 * Progress lives in localStorage for now — the honest v1. The key shape
 * (`downstack:done:{topic}/{lesson}`) is deliberately flat so a future
 * DB-backed sync can migrate it with one loop. See DESIGN.md, roadmap.
 */

import { useEffect, useState } from "react";

const key = (topic: string, lesson: string) => `downstack:done:${topic}/${lesson}`;

function readDone(topic: string, lesson: string): boolean {
  try {
    return localStorage.getItem(key(topic, lesson)) === "1";
  } catch {
    return false;
  }
}

export function CompleteButton({
  topic,
  lesson,
}: {
  topic: string;
  lesson: string;
}) {
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDone(readDone(topic, lesson));
    setMounted(true);
  }, [topic, lesson]);

  function toggle() {
    const next = !done;
    setDone(next);
    try {
      if (next) localStorage.setItem(key(topic, lesson), "1");
      else localStorage.removeItem(key(topic, lesson));
    } catch {
      /* private mode etc. — state still toggles for the session */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`rounded-sm border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.15em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-fieldgreen ${
        done
          ? "border-fieldgreen/60 bg-fieldgreen/10 text-fieldgreen"
          : "border-line text-chalkfaint hover:border-chalkfaint hover:text-chalkdim"
      }`}
      aria-pressed={done}
    >
      {mounted && done ? "✓ Marked complete" : "Mark complete"}
    </button>
  );
}

export function TopicProgress({
  topic,
  lessonSlugs,
}: {
  topic: string;
  /** Slugs of READY lessons only — soon lessons don't count against you. */
  lessonSlugs: string[];
}) {
  const [doneCount, setDoneCount] = useState<number | null>(null);

  useEffect(() => {
    setDoneCount(lessonSlugs.filter((s) => readDone(topic, s)).length);
  }, [topic, lessonSlugs]);

  if (doneCount === null || lessonSlugs.length === 0) return null;
  const pct = Math.round((doneCount / lessonSlugs.length) * 100);

  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1 w-36 overflow-hidden rounded-full bg-raised"
      >
        <div
          className="h-full rounded-full bg-fieldgreen transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-chalkfaint">
        {doneCount}/{lessonSlugs.length} complete
      </span>
    </div>
  );
}
