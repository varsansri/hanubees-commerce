"use client";

import dynamic from "next/dynamic";
import { useRef, type ReactNode } from "react";
import { LiquidGlass } from "./liquid-glass";
import { useEffectsEnabled, useInView } from "./use-effects-enabled";

/**
 * The marketing hero: shader gradient, a real 3D parcel, and a glass card,
 * composed as one scene.
 *
 * Laid out as an asymmetric split — copy held left, the object right — rather
 * than a centred headline floating on a full-bleed mesh, which is the house
 * style of every AI-generated landing page. The gradient is bounded inside a
 * panel, so it reads as a stage the product sits on instead of wallpaper.
 *
 * Everything here is enhancement. The static ramp and the plain copy are what
 * get prerendered and what a phone or a reduced-motion visitor keeps.
 */

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradientCanvas),
  { ssr: false },
);
const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradient),
  { ssr: false },
);
const ParcelScene = dynamic(() => import("./parcel-scene"), { ssr: false });

export function LandingHero({
  children,
  aside,
}: {
  /** Headline, subhead, CTAs — rendered inside the glass card. */
  children: ReactNode;
  /** Shown in the object slot when WebGL is unavailable. */
  aside: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const enabled = useEffectsEnabled();
  const inView = useInView(ref);
  const live = enabled && inView;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl border border-line"
      style={{
        // Honey, not the AI-default violet. Also the no-WebGL backdrop.
        background:
          "radial-gradient(120% 120% at 15% 0%, #fdf3e0 0%, #f2d9a8 38%, #d9a441 72%, #a06912 100%)",
      }}
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
              uSpeed={0.12}
              uStrength={1.9}
              uDensity={1.2}
              uFrequency={5.5}
              color1="#a06912"
              color2="#f2c46b"
              color3="#fdf3e0"
              cDistance={3.4}
              cPolarAngle={110}
              cAzimuthAngle={190}
              positionY={0.4}
              rotationX={48}
              lightType="3d"
              brightness={1.15}
              reflection={0.12}
            />
          </ShaderGradientCanvas>
        </div>
      ) : null}

      <div className="relative grid items-center gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-10 lg:p-10">
        {live ? (
          <LiquidGlass sourceRef={gradientRef} borderRadius={22} tintOpacity={0.14}>
            <div className="p-6 sm:p-9">{children}</div>
          </LiquidGlass>
        ) : (
          <div className="p-2 sm:p-4">{children}</div>
        )}

        <div className="relative aspect-square w-full max-w-sm justify-self-center lg:max-w-none">
          {live ? <ParcelScene /> : aside}
        </div>
      </div>
    </div>
  );
}
