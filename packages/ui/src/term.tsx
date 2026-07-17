"use client";

import { useEffect, useRef, useState } from "react";
import { AnnotationLabel } from "./callouts";

/**
 * A difficult word, made friendly. Authors mark a word in `md` as `[[word]]`
 * and it renders as this: a gently underlined term that opens a small card
 * with a plain-English explanation and a "search the web" escape hatch.
 * The pedagogy: never let one unknown word cost the reader the paragraph.
 */

export interface TermInfo {
  term: string;
  simple: string;
  search?: string;
}

export function Term({ display, info }: { display: string; info?: TermInfo }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  const searchQuery =
    info?.search ?? `${info?.term ?? display} meaning in programming`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        title={`What does “${info?.term ?? display}” mean?`}
        className="inline cursor-help border-b border-dotted border-amber/70 text-inherit transition-colors hover:border-amber hover:bg-amber/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
      >
        {display}
        <span aria-hidden className="ml-[0.15em] align-super text-[0.6em] text-amber">
          ?
        </span>
      </button>

      {open && (
        <span
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 bg-chalk/30 backdrop-blur-[2px]"
            onMouseDown={close}
          />
          <span
            role="dialog"
            aria-modal="true"
            aria-label={`Meaning of ${info?.term ?? display}`}
            className="relative block w-full max-w-md rounded-sm border border-line bg-ink p-6 shadow-2xl sm:p-7"
          >
            <AnnotationLabel color="text-amber">In plain English</AnnotationLabel>
            <span className="mb-3 block font-display text-2xl font-semibold tracking-tight text-chalk">
              {info?.term ?? display}
            </span>
            <span className="block font-serif text-[1.02rem] leading-[1.75] text-chalkdim">
              {info?.simple ??
                "We haven't written a simple explanation for this word yet — the web search below is your best bet."}
            </span>
            <span className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-amber/60 bg-amber/10 px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-amber transition-colors hover:bg-amber/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
              >
                Search the web ↗
              </a>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="rounded-sm border border-line px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-chalkdim transition-colors hover:border-chalkfaint hover:text-chalk focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
              >
                Got it
              </button>
            </span>
          </span>
        </span>
      )}
    </>
  );
}
