"use client";

import dynamic from "next/dynamic";
import { useRef, type ReactNode } from "react";
import { LiquidGlass } from "./liquid-glass";
import { useEffectsEnabled, useInView } from "./use-effects-enabled";

/**
 * The storefront hero.
 *
 * A merchant's accent drives an animated ShaderGradient (@shadergradient/react,
 * on @react-three/fiber) instead of a flat CSS ramp, so every store on the
 * platform gets a living hero in its own colour rather than a stock backdrop.
 *
 * Deliberately not used behind the marketing hero: a centred headline over an
 * animated mesh is the house style of every AI-built landing page, and the
 * platform site should not look like one.
 *
 * The gradient is a progressive enhancement. The static ramp below it is what
 * gets prerendered, what a phone sees, and what a reduced-motion visitor keeps.
 */

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradientCanvas),
  { ssr: false },
);
const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradient),
  { ssr: false },
);

/** Two supporting stops derived from the merchant's accent. */
function ramp(accent: string): [string, string, string] {
  const hex = accent.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const mix = (t: number, target: [number, number, number]) =>
    "#" +
    [r, g, b]
      .map((c, i) => Math.round(c + (target[i] - c) * t).toString(16).padStart(2, "0"))
      .join("");
  // Toward warm light, and toward a deep shade — a tonal family, not a rainbow.
  return [accent, mix(0.55, [255, 246, 230]), mix(0.45, [26, 20, 12])];
}

export function StoreHero({
  accent,
  fallback,
  children,
}: {
  accent: string;
  /** CSS background used until (or instead of) the shader. */
  fallback: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const enabled = useEffectsEnabled();
  const inView = useInView(ref);
  const [c1, c2, c3] = ramp(accent);
  const live = enabled && inView;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-line px-6 py-16 sm:px-12 sm:py-24"
      style={{ background: fallback }}
    >
      {live ? (
        <div ref={gradientRef} className="absolute inset-0" aria-hidden>
          <ShaderGradientCanvas
            style={{ position: "absolute", inset: 0 }}
            pixelDensity={1}
            fov={40}
          >
            <ShaderGradient
              type="waterPlane"
              animate="on"
              uSpeed={0.14}
              uStrength={1.6}
              uDensity={1.3}
              uFrequency={5.5}
              color1={c1}
              color2={c2}
              color3={c3}
              cDistance={3.2}
              cPolarAngle={115}
              cAzimuthAngle={180}
              positionY={0.6}
              rotationX={45}
              lightType="3d"
              brightness={1.1}
              reflection={0.1}
            />
          </ShaderGradientCanvas>
        </div>
      ) : null}

      {/* The copy sits behind glass only when there is a live gradient for it
          to refract; otherwise it is plain text on the static ramp. */}
      {live ? (
        <LiquidGlass
          sourceRef={gradientRef}
          className="max-w-lg"
          borderRadius={20}
          tintOpacity={0.16}
        >
          <div className="p-6 sm:p-8">{children}</div>
        </LiquidGlass>
      ) : (
        <div className="relative max-w-lg">{children}</div>
      )}
    </div>
  );
}
