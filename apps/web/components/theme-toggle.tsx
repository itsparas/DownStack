"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "downstack:theme";

type Theme = "light" | "dark";

/**
 * Flips data-theme on <html>. The initial value is stamped before first
 * paint by the inline script in layout.tsx (stored choice, else system
 * preference), so this component only reads and toggles it.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light"
    );
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — the flip still applies for this page view */
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      title={theme === "dark" ? "Lights on" : "Lights off"}
      className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-chalkdim transition-colors hover:border-chalkfaint hover:text-chalk focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
    >
      <span aria-hidden className="text-[0.85rem] leading-none">
        {theme === null ? "◐" : theme === "dark" ? "☀" : "☾"}
      </span>
    </button>
  );
}
