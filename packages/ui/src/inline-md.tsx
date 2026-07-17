import type { ReactNode } from "react";
import { getGlossaryEntry } from "@downstack/content";
import { Term } from "./term";

/**
 * Deliberately tiny inline grammar: **bold**, *italic*, `code`, [text](url),
 * and [[term]] for glossary words. The constraint is pedagogical — lesson
 * voice should live in the words, not the formatting.
 *
 * `[[term]]` marks a difficult word. It renders as a clickable term that
 * opens a plain-English explanation card (see term.tsx). Use
 * `[[display text|key]]` when the displayed form differs from the glossary
 * key — e.g. `[[indexes|index]]`.
 */
const TOKEN =
  /(\[\[([^\]]+)\]\])|(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;

export function inline(md: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of md.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(md.slice(last, i));
    if (m[1]) {
      const [display = "", lookup] = m[2]!.split("|").map((s) => s.trim());
      const entry = getGlossaryEntry(lookup ?? display);
      out.push(<Term key={key++} display={display} info={entry} />);
    } else if (m[3]) {
      out.push(
        <a
          key={key++}
          href={m[5]}
          className="text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber"
        >
          {m[4]}
        </a>
      );
    } else if (m[6]) {
      out.push(
        <strong key={key++} className="font-semibold text-chalk">
          {m[7]}
        </strong>
      );
    } else if (m[8]) {
      out.push(
        <em key={key++} className="italic">
          {m[9]}
        </em>
      );
    } else if (m[10]) {
      out.push(
        <code
          key={key++}
          className="rounded border border-line/70 bg-raised/70 px-[0.35em] py-[0.1em] font-mono text-[0.82em] text-trace"
        >
          {m[11]}
        </code>
      );
    }
    last = i + m[0].length;
  }
  if (last < md.length) out.push(md.slice(last));
  return out;
}

/** Multi-paragraph prose. Blank lines separate paragraphs. */
export function Prose({
  md,
  className = "",
}: {
  md: string;
  className?: string;
}) {
  const paragraphs = md.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={`font-serif text-[1.075rem] leading-[1.85] text-chalkdim ${className}`}
        >
          {inline(p)}
        </p>
      ))}
    </>
  );
}
