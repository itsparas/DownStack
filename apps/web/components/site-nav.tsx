import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

function StrataGlyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="text-amber"
    >
      <rect
        x="1"
        y="1"
        width="18"
        height="18"
        stroke="currentColor"
        strokeOpacity="0.5"
      />
      <path d="M3 6.5h14" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 10.5h14" stroke="currentColor" strokeOpacity="0.75" />
      <path d="M3 14.5h14" stroke="currentColor" strokeOpacity="0.45" />
    </svg>
  );
}

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
        >
          <StrataGlyph />
          <span className="font-display text-lg font-bold tracking-tight text-chalk">
            Downstack
          </span>
        </Link>
        <nav className="flex items-center gap-7 font-mono text-[0.72rem] uppercase tracking-[0.16em]">
          <Link
            href="/topics"
            className="text-chalkdim transition-colors hover:text-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
          >
            Topics
          </Link>
          <Link
            href="/api/topics"
            className="hidden text-chalkfaint transition-colors hover:text-amber sm:inline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
          >
            API
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
