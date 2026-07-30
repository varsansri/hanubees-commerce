"use client";

import dynamic from "next/dynamic";
import { useRef, type ReactNode } from "react";
import { Logo } from "../logo";
import { useEffectsEnabled, useInView } from "./use-effects-enabled";

/**
 * The stage the isometric world sits on.
 *
 * A ShaderGradient supplies the light behind the scene — kept low-contrast and
 * cream/honey so the blocks stay readable against it. Without WebGL the same
 * area is a flat cream panel with the flat logo, which is a complete
 * composition rather than a hole where an effect should be.
 */

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradientCanvas),
  { ssr: false },
);
const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradient),
  { ssr: false },
);
const IsoScene = dynamic(() => import("./iso-scene"), { ssr: false });

export function IsoStage({
  className = "",
  children,
}: {
  className?: string;
  /** Optional overlay content, e.g. labels pinned to the stage. */
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useEffectsEnabled();
  const inView = useInView(ref);
  const live = enabled && inView;

  return (
    <div
      ref={ref}
      className={`iso-block relative overflow-hidden bg-iso-white ${className}`}
    >
      {live ? (
        <div className="absolute inset-0" aria-hidden>
          <ShaderGradientCanvas
            style={{ position: "absolute", inset: 0 }}
            pixelDensity={1}
            fov={40}
          >
            <ShaderGradient
              type="waterPlane"
              animate="on"
              uSpeed={0.1}
              uStrength={1.4}
              uDensity={1.1}
              uFrequency={5}
              color1="#ffffff"
              color2="#f0b000"
              color3="#90d0f0"
              cDistance={3.6}
              cPolarAngle={112}
              cAzimuthAngle={190}
              positionY={0.3}
              rotationX={45}
              lightType="3d"
              brightness={1.2}
              reflection={0.1}
            />
          </ShaderGradientCanvas>
        </div>
      ) : null}

      <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
        {live ? (
          <IsoScene />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Logo size={150} priority />
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
