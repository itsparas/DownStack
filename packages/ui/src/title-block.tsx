import type { ReactNode } from "react";

/**
 * The signature element: an engineering-drawing title block.
 * Used on lesson headers — sheet number, scale (depth), revision, time.
 */
export function TitleBlock({
  rows,
}: {
  rows: { label: string; value: ReactNode }[];
}) {
  return (
    <div className="inline-grid grid-cols-2 overflow-hidden rounded-sm border border-line font-mono text-[0.7rem] sm:grid-cols-4">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex min-w-0 flex-col gap-1 border-line bg-panel/80 px-3.5 py-2.5 [&:not(:first-child)]:border-l max-sm:[&:nth-child(3)]:border-l-0 max-sm:[&:nth-child(n+3)]:border-t"
        >
          <span className="uppercase tracking-[0.18em] text-chalkfaint text-[0.58rem]">
            {row.label}
          </span>
          <span className="truncate text-chalkdim">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
