"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./icons";

type Theme = "light" | "dark";

const EVENT = "hb-theme-change";

/**
 * The theme lives on `<html data-theme>`, not in React state — the inline
 * script in the root layout sets it before first paint. This component reads
 * that external value with useSyncExternalStore rather than mirroring it into
 * state, so there is no cascading render on mount and no flash.
 */
function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function getSnapshot(): Theme {
  const stamped = document.documentElement.dataset.theme;
  if (stamped === "light" || stamped === "dark") return stamped;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** The server can't know the viewer's preference; tokens handle it in CSS. */
const getServerSnapshot = (): Theme => "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("hb-theme", next);
    } catch {
      // Private mode — the toggle still works for this session.
    }
    window.dispatchEvent(new Event(EVENT));
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
export const themeScript = `(function(){try{var t=localStorage.getItem('hb-theme');if(t){document.documentElement.dataset.theme=t}}catch(e){}try{if(location.search.indexOf('fx=on')>-1){document.documentElement.dataset.fx='on'}}catch(e){}})()`;
