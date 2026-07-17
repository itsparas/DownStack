import type { Depth, Lesson, Module, Topic } from "./types";
import { databases } from "./topics/databases";
import { javascriptRuntime } from "./topics/javascript-runtime";
import { postgres } from "./topics/postgres";

export * from "./types";
export { glossary, getGlossaryEntry } from "./glossary";
export type { GlossaryEntry } from "./glossary";

/** The catalog. Order here is display order. */
export const topics: Topic[] = [databases, postgres, javascriptRuntime];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export interface LessonRef {
  topic: Topic;
  module: Module;
  lesson: Lesson;
  /** 1-based position among ALL lessons in the topic, for the sheet number. */
  number: number;
}

export function flattenLessons(topic: Topic): LessonRef[] {
  const refs: LessonRef[] = [];
  let n = 0;
  for (const module of topic.modules) {
    for (const lesson of module.lessons) {
      n += 1;
      refs.push({ topic, module, lesson, number: n });
    }
  }
  return refs;
}

export function getLesson(
  topicSlug: string,
  lessonSlug: string,
): LessonRef | undefined {
  const topic = getTopic(topicSlug);
  if (!topic) return undefined;
  return flattenLessons(topic).find((r) => r.lesson.slug === lessonSlug);
}

/** Previous / next *ready* lessons, for reader navigation. */
export function getNeighbors(topicSlug: string, lessonSlug: string) {
  const topic = getTopic(topicSlug);
  if (!topic) return { prev: undefined, next: undefined };
  const ready = flattenLessons(topic).filter(
    (r) => r.lesson.status === "ready",
  );
  const i = ready.findIndex((r) => r.lesson.slug === lessonSlug);
  return {
    prev: i > 0 ? ready[i - 1] : undefined,
    next: i >= 0 && i < ready.length - 1 ? ready[i + 1] : undefined,
  };
}

export function countLessons(topic: Topic) {
  const all = flattenLessons(topic);
  return {
    total: all.length,
    ready: all.filter((r) => r.lesson.status === "ready").length,
  };
}

export function totalMinutes(topic: Topic): number {
  return flattenLessons(topic).reduce((sum, r) => sum + r.lesson.minutes, 0);
}

export const depthOrder: Depth[] = [
  "intuition",
  "mechanics",
  "internals",
  "field",
];
