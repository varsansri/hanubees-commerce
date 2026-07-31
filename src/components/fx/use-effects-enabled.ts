"use client";

import { useEffect, useState } from "react";

/**
 * How much of the hero's WebGL this device should run.
 *
 *   "off"   reduced motion, or no WebGL at all → static composition
 *   "lite"  phones and coarse pointers → the logo animation only
 *   "full"  everything: animation, glass badge, liquid metal
 *
 * The logo animation is the point of the hero, so it runs on phones too. What
 * "lite" drops is the *extra* WebGL contexts — the glass badge uploads a
 * texture every frame and liquid metal is a third context, and three at once on
 * a mid-range phone is where it stops being worth it.
 */
export type EffectTier = "off" | "lite" | "full";

export function useEffectTier(): EffectTier {
  const [tier, setTier] = useState<EffectTier>("off");

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 640px)");
    const coarse = window.matchMedia("(pointer: coarse)");

    // `?fx=on` overrides the reduced-motion preference for this page view only.
    // It exists so the site's own authors can see what a visitor with motion
    // enabled sees, from a device that has it switched off system-wide. It is
    // never sticky and never the default: a stated preference still wins for
    // everyone who has not deliberately typed this into the address bar.
    const forced = new URLSearchParams(window.location.search).get("fx") === "on";

    const evaluate = () => {
      // A stated preference always wins.
      if (motion.matches && !forced) return setTier("off");

      // Cheap capability probe — no context here means the effect would fail.
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl");
      if (!gl) return setTier("off");

      setTier(small.matches || coarse.matches ? "lite" : "full");
    };

    evaluate();
    for (const q of [motion, small, coarse])
      q.addEventListener("change", evaluate);
    return () => {
      for (const q of [motion, small, coarse])
        q.removeEventListener("change", evaluate);
    };
  }, []);

  return tier;
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

/**
 * True while the element is on screen — unlike `useInView`, which latches once
 * and stays true. Used to park a renderer that has scrolled away.
 */
export function useOnScreen(ref: React.RefObject<HTMLElement | null>): boolean {
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      {
        rootMargin: "120px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return onScreen;
}
