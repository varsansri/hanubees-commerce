"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Logo } from "../logo";
import { LiquidGlass } from "./liquid-glass";
import { useEffectTier, useInView } from "./use-effects-enabled";

/**
 * The hero stage — the one place on the site that runs WebGL.
 *
 * All four effect libraries are concentrated here, each doing a different job:
 *
 *   - @shadergradient/react  lights the stage behind the scene
 *   - @react-three/fiber     animates the logo itself, in true isometric
 *   - dashersw/liquid-glass  the badge, refracting the live gradient behind it
 *   - @paper-design/shaders  the flat mark inside that badge, in liquid metal
 *
 * On phones ("lite") the logo animation and its gradient still run — that is
 * the point of the hero — while the glass badge and liquid metal step aside,
 * because each is another WebGL context and the badge re-uploads a texture
 * every frame. The badge is still there, just drawn in plain CSS.
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
const LiquidMetal = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.LiquidMetal),
  { ssr: false },
);

export function IsoStage({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const tier = useEffectTier();
  const inView = useInView(ref);

  const live = tier !== "off" && inView;
  const full = tier === "full" && inView;

  return (
    <div
      ref={ref}
      className={`iso-block relative overflow-hidden bg-iso-white ${className}`}
    >
      {live ? (
        <div ref={gradientRef} className="absolute inset-0" aria-hidden>
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

      <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
        {live ? (
          <IsoScene lite={tier === "lite"} />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Logo size={150} priority />
          </div>
        )}
      </div>

      {/* Badge on the stage floor: real glass with a metal mark on desktop,
          the same badge in plain CSS everywhere else. */}
      <div className="pointer-events-none absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
        {full ? (
          <LiquidGlass sourceRef={gradientRef} borderRadius={14} tintOpacity={0.2}>
            <div className="flex items-center gap-2.5 px-3 py-2">
              <span className="relative size-8 shrink-0">
                <LiquidMetal
                  image="/bee-silhouette.png"
                  className="absolute inset-0 size-full"
                  colorBack="#00000000"
                  colorTint="#f0b000"
                  repetition={2}
                  softness={0.2}
                  shiftRed={0.15}
                  shiftBlue={-0.15}
                  contour={1}
                  distortion={0.1}
                  speed={0.55}
                  angle={0.3}
                />
              </span>
              <span className="text-[13px] font-semibold tracking-tight text-iso-black">
                Hanubees
              </span>
            </div>
          </LiquidGlass>
        ) : (
          <span className="iso-block-sm flex items-center gap-2 bg-iso-white/85 px-2.5 py-1.5 backdrop-blur-sm">
            <Logo size={20} />
            <span className="text-[13px] font-semibold tracking-tight text-iso-black">
              Hanubees
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
