import type { Block } from "@downstack/content";
import { slugify } from "@/lib/slug";

/** "Sheet index" — the drawing-set term for a TOC. Desktop-only right rail. */
export function SheetIndex({ blocks }: { blocks: Block[] }) {
  const headings = blocks.filter(
    (b): b is Extract<Block, { type: "heading" }> => b.type === "heading"
  );
  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Sheet index"
      className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] w-52 shrink-0 overflow-y-auto xl:block"
    >
      <div className="mb-4 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-chalkfaint">
        <span aria-hidden className="inline-block h-px w-5 bg-current opacity-60" />
        Sheet index
      </div>
      <ol className="space-y-2.5 border-l border-line/70 pl-4">
        {headings.map((h, i) => (
          <li key={i}>
            <a
              href={`#${slugify(h.text)}`}
              className="block font-mono text-[0.72rem] leading-snug text-chalkfaint transition-colors hover:text-amber"
            >
              <span className="mr-2 text-chalkfaint/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
