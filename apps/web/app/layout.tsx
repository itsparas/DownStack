import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: {
    default: "Downstack — learn down the stack",
    template: "%s · Downstack",
  },
  description:
    "Engineering topics taught the way a senior engineer would teach them: from first principles, down to the internals, with the scars to prove it.",
};

/**
 * Runs before first paint: stamps data-theme from the stored choice, else
 * the system preference — so neither theme ever flashes into the other.
 */
const THEME_INIT = `(function(){try{var t=localStorage.getItem("downstack:theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <SiteNav />
        <main>{children}</main>
        <footer className="mt-24 border-t border-line/60">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-chalkfaint sm:flex-row sm:items-center sm:justify-between">
            <span>Downstack — learn down the stack</span>
            <span>Drawn, not generated · Rev B</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
