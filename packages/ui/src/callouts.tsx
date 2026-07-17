import type { ReactNode } from "react";
import { Prose, inline } from "./inline-md";

/* ------------------------------------------------------------------ */
/* Depth badge                                                         */
/* ------------------------------------------------------------------ */

export const DEPTH_STYLE: Record<
  string,
  { label: string; text: string; dot: string; border: string }
> = {
  intuition: {
    label: "Intuition",
    text: "text-amber",
    dot: "bg-amber",
    border: "border-amber/40",
  },
  mechanics: {
    label: "Mechanics",
    text: "text-copper",
    dot: "bg-copper",
    border: "border-copper/40",
  },
  internals: {
    label: "Internals",
    text: "text-trace",
    dot: "bg-trace",
    border: "border-trace/40",
  },
  field: {
    label: "In the field",
    text: "text-fieldgreen",
    dot: "bg-fieldgreen",
    border: "border-fieldgreen/40",
  },
};

export function DepthBadge({ depth }: { depth: string }) {
  const s = DEPTH_STYLE[depth] ?? DEPTH_STYLE.intuition!;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border ${s.border} px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Annotation label — the drafting-callout eyebrow with a leader line  */
/* ------------------------------------------------------------------ */

export function AnnotationLabel({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mb-3 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] ${color}`}
    >
      <span aria-hidden className="inline-block h-px w-6 bg-current opacity-70" />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Callouts                                                            */
/* ------------------------------------------------------------------ */

export function MentorNote({ md }: { md: string }) {
  return (
    <aside className="my-9 border-l-2 border-amber/70 bg-amber/[0.04] py-4 pl-5 pr-4 sm:pl-6">
      <AnnotationLabel color="text-amber">Mentor&rsquo;s note</AnnotationLabel>
      <Prose md={md} className="!text-[1.02rem] text-chalkdim" />
    </aside>
  );
}

export function WarStory({ title, md }: { title: string; md: string }) {
  return (
    <aside className="my-9 rounded-sm border border-copper/30 bg-panel/70 p-5 sm:p-6">
      <AnnotationLabel color="text-copper">
        Field report — incident record
      </AnnotationLabel>
      <h4 className="mb-3 font-display text-lg font-semibold text-chalk">
        {title}
      </h4>
      <div className="space-y-4">
        <Prose md={md} className="!text-[1.02rem]" />
      </div>
    </aside>
  );
}

export function Pitfall({ title, md }: { title: string; md: string }) {
  return (
    <aside className="relative my-9 rounded-sm border border-dashed border-redline/50 bg-redline/[0.05] p-5 sm:p-6">
      <AnnotationLabel color="text-redline">Redline — common error</AnnotationLabel>
      <h4 className="mb-3 font-display text-lg font-semibold text-chalk">
        {title}
      </h4>
      <div className="space-y-4">
        <Prose md={md} className="!text-[1.02rem]" />
      </div>
    </aside>
  );
}

export function MentalModel({ title, md }: { title: string; md: string }) {
  return (
    <aside className="my-9 border-l-2 border-fieldgreen/70 bg-fieldgreen/[0.04] py-4 pl-5 pr-4 sm:pl-6">
      <AnnotationLabel color="text-fieldgreen">
        Mental model — keep this one
      </AnnotationLabel>
      <h4 className="mb-2 font-display text-lg font-semibold text-chalk">
        {title}
      </h4>
      <div className="space-y-4">
        <Prose md={md} className="!text-[1.02rem]" />
      </div>
    </aside>
  );
}

export function Takeaways({ items }: { items: string[] }) {
  return (
    <section className="my-10 rounded-sm border border-line bg-panel/70 p-5 sm:p-7">
      <AnnotationLabel color="text-amber">
        Field notes — what you can now say
      </AnnotationLabel>
      <ul className="space-y-3.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span
              aria-hidden
              className="mt-[0.55em] h-[7px] w-[7px] shrink-0 rotate-45 border border-amber/80"
            />
            <span className="font-serif text-[1.02rem] leading-relaxed text-chalkdim">
              {inline(item)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Divider() {
  return (
    <div aria-hidden className="my-12 flex items-center gap-3 text-line">
      <span className="h-px flex-1 bg-line/70" />
      <span className="font-mono text-[0.6rem] tracking-[0.3em] text-chalkfaint">
        ///
      </span>
      <span className="h-px flex-1 bg-line/70" />
    </div>
  );
}
