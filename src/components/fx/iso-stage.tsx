"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Bee2D } from "./bee-2d";
import { useEffectTier, useInView } from "./use-effects-enabled";

/**
 * The hero stage.
 *
 * The bee is animated in 2D from the artwork's own layers, so it renders and
 * animates on every device — phone included — with no WebGL, no canvas, and no
 * gating. The 3D build was abandoned: it only ran where WebGL did, and the
 * model it was based on shipped without any colour data, so it could never
 * carry the logo's real colours.
 *
 * The ShaderGradient behind it stays as a progressive enhancement. If it does
 * not run, the stage is a flat white panel and the bee still animates.
 */

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradientCanvas),
  { ssr: false },
);
const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradient),
  { ssr: false },
);

export function IsoStage({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useEffectTier();
  const inView = useInView(ref);
  const gradient = tier !== "off" && inView;

  return (
    <div
      ref={ref}
      className={`iso-block relative overflow-hidden bg-iso-white ${className}`}
    >
      {gradient ? (
        <div className="absolute inset-0" aria-hidden>
          <ShaderGradientCanvas
            style={{ position: "absolute", inset: 0 }}
            pixelDensity={tier === "lite" ? 0.75 : 1}
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

      <div className="relative flex aspect-[4/3] w-full items-center justify-center p-6 sm:aspect-[16/11]">
        <Bee2D size={340} priority className="max-w-[78%]" />
      </div>

      <span className="iso-block-sm absolute bottom-3 left-3 flex items-center gap-2 bg-iso-white/85 px-2.5 py-1.5 text-[13px] font-semibold tracking-tight text-iso-black backdrop-blur-sm sm:bottom-4 sm:left-4">
        Hanubees
      </span>
    </div>
  );
}
