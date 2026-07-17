import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start px-6 py-28">
      <div className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-redline">
        Sheet not found — 404
      </div>
      <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-chalk">
        This drawing isn&rsquo;t in the set.
      </h1>
      <p className="mb-8 font-serif text-[1.05rem] leading-[1.8] text-chalkdim">
        Either the sheet was never issued, or it&rsquo;s still on the drafting
        table. The index of drawings has everything that exists.
      </p>
      <Link
        href="/topics"
        className="rounded-sm border border-amber bg-amber/10 px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.15em] text-amber transition-colors hover:bg-amber/20"
      >
        Back to the index →
      </Link>
    </div>
  );
}
