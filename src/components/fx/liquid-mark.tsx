"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Logo } from "../logo";
import { useEffectsEnabled, useInView } from "./use-effects-enabled";

/**
 * The Hanubees mark in liquid metal.
 *
 * The shader is fed a solid silhouette of the parcel rather than the full
 * artwork: a metal treatment reads shape, and the logo's stripes, eyes, and
 * wings only turn to noise inside it.
 *
 * Runs the LiquidMetal shader from @paper-design/shaders-react — the engine
 * behind paper-design/liquid-logo, which is itself a demo app rather than a
 * publishable package. The mark is the one place on the marketing site that
 * gets an effect of this weight: it is the brand moment, seen once at the top
 * of the page, which is exactly the frequency that earns real motion.
 *
 * The flat mark renders underneath and is what ships in the prerendered HTML,
 * so the identity is never dependent on WebGL.
 */

const LiquidMetal = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.LiquidMetal),
  { ssr: false },
);

export function LiquidMark({ size = 132 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useEffectsEnabled();
  const inView = useInView(ref);

  return (
    <div
      ref={ref}
      className="relative mx-auto"
      style={{ width: size, height: size }}
      aria-label="Hanubees"
      role="img"
    >
      <span className="absolute inset-0 flex items-center justify-center">
        <Logo size={size} priority />
      </span>

      {enabled && inView ? (
        <LiquidMetal
          image="/bee-silhouette.png"
          className="absolute inset-0 size-full"
          colorBack="#00000000"
          colorTint="#e8a93c"
          repetition={2.2}
          softness={0.22}
          shiftRed={0.18}
          shiftBlue={-0.18}
          contour={1}
          distortion={0.12}
          speed={0.5}
          angle={0.3}
        />
      ) : null}
    </div>
  );
}
