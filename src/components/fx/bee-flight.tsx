"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useEffectTier } from "./use-effects-enabled";

/**
 * The bee, flying the whole page.
 *
 * Fixed over the viewport and click-through, so it can cross anything without
 * ever intercepting a tap. It sits below the header's layer, which means it
 * passes behind the sticky bar rather than over it — the header is the one
 * thing on the page that must always be readable.
 *
 * It is decoration with no meaning to convey, so it is hidden from assistive
 * technology entirely, and a reader who has asked for reduced motion, or a
 * device without WebGL, simply never has it.
 */

const BeeScene = dynamic(() => import("./bee-scene").then((m) => m.BeeScene), {
  ssr: false,
});

export function BeeFlight() {
  const tier = useEffectTier();

  // `?bee=debug` outlines the layer and prints the tier it resolved to. There
  // is no browser in the environment this was built in, so this is how the
  // difference between "never mounted", "mounted but empty" and "drawing
  // off-screen" gets established. No visitor reaches it without typing it.
  const [debug, setDebug] = useState(false);
  useEffect(() => {
    setDebug(new URLSearchParams(window.location.search).get("bee") === "debug");
  }, []);

  return (
    <>
      {debug ? (
        <div className="fixed top-24 left-4 z-50 bg-red-600 px-2 py-1 font-mono text-[12px] text-white">
          tier={tier} layer={tier === "off" ? "none" : "mounted"}
        </div>
      ) : null}

      {tier === "off" ? null : (
        <div
          className={`pointer-events-none fixed inset-0 z-20 ${
            debug ? "outline-4 outline-red-600" : ""
          }`}
          aria-hidden
        >
          <BeeScene quality={tier} />
        </div>
      )}
    </>
  );
}
