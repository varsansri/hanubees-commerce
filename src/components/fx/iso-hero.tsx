"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Bee2D } from "./bee-2d";
import { useEffectTier, useInView, useOnScreen } from "./use-effects-enabled";

/**
 * The hero stage, 3D first.
 *
 * The real scene is WebGL — solids lit from one side, seen through an
 * orthographic camera on the isometric diagonal. It loads only once the stage
 * is near the viewport, and only where WebGL exists.
 *
 * Where it does not — no WebGL, or a reader who has asked for reduced motion —
 * the stage falls back to the 2D mark, which is a finished composition rather
 * than an apology. Nothing about the page depends on the canvas arriving.
 */

const IsoScene = dynamic(() => import("./iso-scene").then((m) => m.IsoScene), {
  ssr: false,
});

export function IsoHero({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useEffectTier();
  const inView = useInView(ref);
  const onScreen = useOnScreen(ref);
  const three = tier !== "off" && inView;

  return (
    <div className={className}>
      <div
        ref={ref}
        className="iso-block relative overflow-hidden bg-iso-white"
      >
        {/* The ground the town sits on, so the canvas never floats on nothing. */}
        <span
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,#eaf5fc_0%,#ffffff_60%)]"
          aria-hidden
        />

        <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
          {three ? (
            <IsoScene
              quality={tier === "lite" ? "lite" : "full"}
              active={onScreen}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-6">
              <Bee2D size={340} priority className="max-w-[78%]" />
            </div>
          )}
        </div>

        <span className="iso-block-sm absolute bottom-3 left-3 flex items-center gap-2 bg-iso-white/85 px-2.5 py-1.5 text-[13px] font-semibold tracking-tight text-iso-black backdrop-blur-sm sm:bottom-4 sm:left-4">
          Hanubees
        </span>
      </div>

      {/* Nobody taps a picture. Saying it is a map is what makes it one. */}
      {three ? (
        <p className="mt-3 text-[13px] leading-relaxed text-text-3">
          Every building is a project — tap one to see which, tap it again to
          open it. Drag to move around, two fingers to zoom.
        </p>
      ) : null}
    </div>
  );
}
