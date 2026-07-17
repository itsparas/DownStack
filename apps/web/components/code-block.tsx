import { codeToHtml } from "shiki";
import { Prose } from "@downstack/ui";

/**
 * Server component. Highlights once at build/render time — zero client JS.
 * The chrome (border, filename tab) is ours; token colors come from shiki,
 * dual-themed: warm "vitesse-light" on the paper theme, "vesper" when the
 * lights are off (globals.css swaps them via the --shiki-dark variables).
 */
const SHIKI_THEMES = { light: "vitesse-light", dark: "vesper" } as const;
export async function CodeBlock({
  language,
  code,
  filename,
  caption,
}: {
  language: string;
  code: string;
  filename?: string;
  caption?: string;
}) {
  let html: string;
  try {
    html = await codeToHtml(code, { lang: language, themes: SHIKI_THEMES });
  } catch {
    // Unknown language — fall back to plaintext rather than failing the build.
    html = await codeToHtml(code, { lang: "text", themes: SHIKI_THEMES });
  }

  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-sm border border-line bg-panel/80">
        <div className="flex items-center justify-between border-b border-line/80 bg-raised/40 px-4 py-2">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-chalkfaint">
            {filename ?? language}
          </span>
          <span
            aria-hidden
            className="font-mono text-[0.68rem] text-chalkfaint/60"
          >
            ///
          </span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      {caption && (
        <figcaption className="mt-2.5 border-l border-line pl-3">
          <Prose md={caption} className="!text-[0.88rem] !leading-relaxed text-chalkfaint" />
        </figcaption>
      )}
    </figure>
  );
}
