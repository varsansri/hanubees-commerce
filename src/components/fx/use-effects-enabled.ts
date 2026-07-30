"use client";

import { useEffect, useState } from "react";

/**
 * Whether this visitor should get the WebGL effects at all.
 *
 * Three gates, all of them real: reduced-motion is a stated preference, a
 * coarse pointer on a narrow screen usually means a phone GPU and a metered
 * connection, and no WebGL means no effect regardless. Every effect renders
 * over a static fallback, so a `false` here costs the visitor nothing but the
 * animation.
 */
export function useEffectsEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 640px)");

    const evaluate = () => {
      if (motion.matches || small.matches) return setEnabled(false);

      // Cheap capability probe — a lost context here means the effect would
      // have failed anyway.
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl");
      setEnabled(Boolean(gl));
    };

    evaluate();
    motion.addEventListener("change", evaluate);
    small.addEventListener("change", evaluate);
    return () => {
      motion.removeEventListener("change", evaluate);
      small.removeEventListener("change", evaluate);
    };
  }, []);

  return enabled;
}

/** True once the element has been near the viewport at least once. */
export function useInView(ref: React.RefObject<HTMLElement | null>): boolean {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen]);

  return seen;
}
