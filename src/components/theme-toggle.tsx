"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

type Theme = "light" | "dark";

/**
 * Stamps `data-theme` on <html>, which our tokens let win over the OS
 * preference in both directions. The initial paint is handled by the inline
 * script in the root layout, so there is no flash before this mounts.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("hb-theme") as Theme | null;
    const initial =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("hb-theme", next);
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex size-8 items-center justify-center rounded-[var(--radius)] border border-transparent text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

/** Runs before paint so a stored theme never flashes the wrong colours. */
export const themeScript = `(function(){try{var t=localStorage.getItem('hb-theme');if(t){document.documentElement.dataset.theme=t}}catch(e){}})()`;
