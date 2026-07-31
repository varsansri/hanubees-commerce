"use client";

import dynamic from "next/dynamic";
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
  if (tier === "off") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-20" aria-hidden>
      <BeeScene quality={tier} />
    </div>
  );
}
