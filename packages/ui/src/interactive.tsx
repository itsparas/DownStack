"use client";

import { useState, type ReactNode } from "react";
import { Prose } from "./inline-md";
import { AnnotationLabel } from "./callouts";

/* ------------------------------------------------------------------ */
/* Pause & predict — commit to an answer before the reveal             */
/* ------------------------------------------------------------------ */

export function Predict({
  question,
  reveal,
}: {
  question: string;
  reveal: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="my-10 rounded-sm border border-amber/35 bg-raised/50 p-5 sm:p-7">
      <AnnotationLabel color="text-amber">
        Stop — predict before you scroll
      </AnnotationLabel>
      <div className="space-y-4">
        <Prose md={question} className="!text-chalk" />
      </div>
      {open ? (
        <div className="mt-6 space-y-4 border-l-2 border-amber/60 pl-4 sm:pl-5">
          <Prose md={reveal} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 rounded-sm border border-amber/50 bg-amber/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-amber transition-colors hover:bg-amber/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
        >
          I&rsquo;ve committed — reveal
        </button>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Checkpoint quiz                                                     */
/* ------------------------------------------------------------------ */

export interface QuizOptionProps {
  text: string;
  correct?: boolean;
  explanation: string;
}

export function Quiz({
  question,
  options,
}: {
  question: string;
  options: QuizOptionProps[];
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <section className="my-10 rounded-sm border border-line bg-panel/70 p-5 sm:p-7">
      <AnnotationLabel color="text-trace">Checkpoint</AnnotationLabel>
      <div className="mb-5 space-y-4">
        <Prose md={question} className="!text-chalk" />
      </div>
      <div className="space-y-2.5">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const showState = answered && (isPicked || opt.correct);
          const stateClass = !answered
            ? "border-line/80 hover:border-chalkfaint hover:bg-raised/60"
            : opt.correct
              ? "border-fieldgreen/60 bg-fieldgreen/[0.07]"
              : isPicked
                ? "border-redline/60 bg-redline/[0.07]"
                : "border-line/50 opacity-55";
          return (
            <div key={i}>
              <button
                type="button"
                disabled={answered}
                onClick={() => setPicked(i)}
                className={`w-full rounded-sm border px-4 py-3 text-left font-serif text-[0.98rem] leading-relaxed text-chalkdim transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-trace ${stateClass}`}
              >
                <span className="mr-3 font-mono text-xs text-chalkfaint">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt.text}
                {answered && opt.correct && (
                  <span className="ml-2 font-mono text-xs uppercase tracking-wider text-fieldgreen">
                    ✓ correct
                  </span>
                )}
                {answered && isPicked && !opt.correct && (
                  <span className="ml-2 font-mono text-xs uppercase tracking-wider text-redline">
                    ✗ your pick
                  </span>
                )}
              </button>
              {showState && (
                <div className="mb-1 mt-2 space-y-3 border-l border-line pl-4 pr-2">
                  <Prose md={opt.explanation} className="!text-[0.95rem]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Deep dive — one level below the lesson, opt-in                      */
/* ------------------------------------------------------------------ */

export function DeepDive({
  title,
  md,
  children,
}: {
  title: string;
  md: string;
  /** Optional pre-rendered code block (server-highlighted), passed as children. */
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="my-10 rounded-sm border border-trace/30 bg-panel/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-baseline gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-trace sm:px-6"
      >
        <span
          aria-hidden
          className="font-mono text-sm text-trace transition-transform"
        >
          {open ? "−" : "+"}
        </span>
        <span>
          <span className="mr-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-trace">
            Deep dive
          </span>
          <span className="font-display text-[1.05rem] font-semibold text-chalk">
            {title}
          </span>
        </span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-trace/20 px-5 pb-6 pt-5 sm:px-6">
          <Prose md={md} />
          {children}
        </div>
      )}
    </section>
  );
}
