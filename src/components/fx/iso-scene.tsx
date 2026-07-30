"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group, Mesh, MeshStandardMaterial, Texture } from "three";
import { DoubleSide, MathUtils, NearestFilter, SRGBColorSpace } from "three";

/**
 * The Hanubees isometric world, and the logo animation at the centre of it.
 *
 * Rendered through an **orthographic** camera at the true 45°/35° isometric
 * angle — the same projection the logo is drawn in, so parallel edges stay
 * parallel. Do not swap this for a perspective camera; the projection is the
 * whole point.
 *
 * The parcel runs a repeating beat rather than a passive float: it winds up,
 * snaps a quarter turn, and lands, then idles until the next one. The turn is
 * eased out with a small overshoot so it reads as a physical object being set
 * down. Quarter turns mean it always lands square to the isometric grid.
 */

/* Brand primaries for the scenery. The parcel itself is textured from the
   artwork, so its cardboard brown lives in the texture files rather than here
   — it is face shading, not a fifth theme colour, and appears nowhere in the
   UI. */
const YELLOW = "#f0b000";
const BLACK = "#302020";
const SKY = "#90d0f0";
const WHITE = "#ffffff";

/** Seconds per beat of the logo cycle. */
const BEAT = 3.8;
/** Fraction of a beat spent in the hop; the remainder hovers. */
const TURN = 0.42;

/**
 * Facing that puts the bee's face toward the camera at rest.
 *
 * The face sits on the box's -X panel, whose normal is (-1,0,0). The camera
 * looks in from (8, 6.5, 8), so the panel has to swing round to point at
 * roughly (+0.707, 0, +0.707) — a 135° turn — less the 0.5 rad the stage is
 * already rotated by.
 */
const FACING = (Math.PI * 3) / 4 - 0.5;

/** Effort curve for the current time: 0 at rest, 1 at the peak of the turn. */
function effortAt(t: number) {
  const phase = (t / BEAT) % 1;
  return Math.sin(Math.min(phase / TURN, 1) * Math.PI);
}

/* ---------------------------------------------------------------- pieces */

function Crate({
  position,
  size = 0.8,
  color = WHITE,
}: {
  position: [number, number, number];
  size?: number;
  color?: string;
}) {
  return (
    <RoundedBox args={[size, size, size]} radius={0.05} smoothness={3} position={position}>
      <meshStandardMaterial color={color} roughness={0.65} metalness={0.05} />
    </RoundedBox>
  );
}

/**
 * A wing, cut straight out of the artwork as an alpha sprite rather than
 * approximated with geometry — the stepped silhouette is too specific to
 * redraw by hand.
 */
function Wing({
  map,
  side,
  size,
  position,
}: {
  map: Texture;
  side: 1 | -1;
  size: [number, number];
  position: [number, number, number];
}) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const e = effortAt(t);
    const beat = Math.sin(t * (11 + e * 15)) * (0.22 + e * 0.16);
    ref.current.rotation.z = side * (0.1 + beat);
    ref.current.rotation.x = -1.32 + beat * 0.25;
  });

  return (
    <mesh ref={ref} position={position} rotation={[-1.32, 0, 0]}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={map}
        transparent
        side={DoubleSide}
        alphaTest={0.35}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * The mark itself.
 *
 * Every surface is a texture measured off the artwork rather than modelled by
 * hand: the head panel with its eyes and brow strokes, the top and side with
 * the bee's body wrapping across them and cardboard showing beyond, and the
 * wings as alpha sprites. Nearest filtering keeps the flat, hard-cut edges the
 * logo is drawn with — bilinear softens them into something else.
 *
 * The camera sits at +X +Y +Z, so the head panel goes on +Z (screen left), the
 * striped side on +X (screen right), and the wrapped top on +Y. The three
 * hidden faces are plain cardboard.
 */
function Parcel() {
  const group = useRef<Group>(null);

  const [head, top, sideTex, plain, wingBack, wingFront, antenna] = useTexture([
    "/face-left.png",
    "/face-top.png",
    "/face-right.png",
    "/face-plain.png",
    "/wing-back.png",
    "/wing-front.png",
    "/antenna.png",
  ]);

  useMemo(() => {
    for (const t of [head, top, sideTex, plain, wingBack, wingFront, antenna]) {
      t.magFilter = NearestFilter;
      t.minFilter = NearestFilter;
      t.generateMipmaps = false;
      t.colorSpace = SRGBColorSpace;
    }
  }, [head, top, sideTex, plain, wingBack, wingFront, antenna]);

  // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
  const faces = [sideTex, plain, top, plain, head, plain];

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    const e = effortAt(t);

    // Looks left and right rather than spinning — a full turn would hide the
    // eyes for half of every cycle.
    const look = Math.sin(t * 0.55) * 0.42;

    group.current.rotation.y = FACING + look + e * 0.22;
    group.current.rotation.z = -look * 0.16 - e * 0.12;
    group.current.rotation.x = e * 0.1;

    // Wings drive a figure-eight drift; the horizontal term runs at half the
    // vertical rate, the way a hovering insect never holds still.
    group.current.position.x = Math.sin(t * 0.9) * 0.07;
    group.current.position.z = Math.sin(t * 0.45) * 0.05;
    group.current.position.y = 1.5 + Math.sin(t * 1.4) * 0.06 + e * 0.42;
  });

  return (
    <group ref={group}>
      <mesh>
        {/* Not a cube. Measured off the artwork: the head panel is 291px
            wide, the box stands 288px, and it runs 325px deep — about 12%
            deeper than it is wide. */}
        <boxGeometry args={[1.3, 1.29, 1.45]} />
        {faces.map((tex, i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            map={tex}
            roughness={0.68}
            metalness={0.02}
          />
        ))}
      </mesh>

      {/* Sprite aspects come from the extracted files: 1.30 and 2.38 */}
      <Wing map={wingBack} side={1} size={[1.5, 1.15]} position={[-0.18, 0.74, -0.7]} />
      <Wing map={wingFront} side={-1} size={[1.85, 0.78]} position={[0.78, 0.6, 0.34]} />

      {/* The antenna sticks out past the box silhouette, so it can never be
          part of a face texture — it is its own sprite on the head's edge. */}
      <mesh position={[-0.62, 0.34, 0.735]} rotation={[0, 0.2, 0.22]}>
        <planeGeometry args={[0.42, 0.4]} />
        <meshBasicMaterial
          map={antenna}
          transparent
          side={DoubleSide}
          alphaTest={0.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Contact shadow that shrinks as the parcel climbs — this is what sells the lift. */
function Shadow() {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const e = effortAt(clock.elapsedTime);
    const s = 1 - e * 0.3;
    ref.current.scale.set(s, s, s);
    (ref.current.material as MeshStandardMaterial).opacity = 0.15 - e * 0.06;
  });

  return (
    <mesh ref={ref} position={[0, -0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.72, 32]} />
      <meshStandardMaterial color={BLACK} transparent opacity={0.15} />
    </mesh>
  );
}

/** Everything the parcel flies above. */
function Bench() {
  return (
    <group>
      <RoundedBox
        args={[4.6, 0.45, 4.6]}
        radius={0.08}
        smoothness={3}
        position={[0, -0.6, 0]}
      >
        <meshStandardMaterial color={WHITE} roughness={0.85} />
      </RoundedBox>

      <Shadow />

      {/* Stacked crates: the catalogue */}
      <Crate position={[-1.5, -0.02, -1.1]} color={WHITE} />
      <Crate position={[-1.5, 0.78, -1.1]} size={0.66} color={SKY} />
      <Crate position={[-1.45, -0.05, 0.2]} size={0.7} color={YELLOW} />

      {/* Counter: the storefront */}
      <RoundedBox
        args={[1.7, 0.9, 0.9]}
        radius={0.06}
        smoothness={3}
        position={[1.45, 0.07, 0.9]}
      >
        <meshStandardMaterial color={BLACK} roughness={0.7} />
      </RoundedBox>
      <RoundedBox
        args={[1.8, 0.12, 1.0]}
        radius={0.04}
        smoothness={3}
        position={[1.45, 0.56, 0.9]}
      >
        <meshStandardMaterial color={SKY} roughness={0.35} />
      </RoundedBox>

      <Crate position={[1.45, 0.87, 0.9]} size={0.5} color={YELLOW} />
    </group>
  );
}

/* ----------------------------------------------------------------- stage */

function Stage({ spin }: { spin: number }) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Chases the scroll target so the stage keeps turning for a beat after the
    // scroll stops, instead of snapping to it.
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, spin, 3.5, delta);
  });

  return (
    <group ref={group} rotation={[0, 0.5, 0]}>
      <Bench />
      <Parcel />
    </group>
  );
}

export default function IsoScene({
  scrollSpin = true,
  lite = false,
}: {
  scrollSpin?: boolean;
  /** Phone tier: fewer pixels and one less light, same animation. */
  lite?: boolean;
}) {
  const [spin, setSpin] = useState(0.5);

  useEffect(() => {
    if (!scrollSpin) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const reach = window.innerHeight * 1.6;
        const p = Math.min(window.scrollY / reach, 1);
        setSpin(0.5 + p * Math.PI * 0.9);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [scrollSpin]);

  return (
    <Canvas
      orthographic
      dpr={lite ? [1, 1.25] : [1, 1.6]}
      camera={{ position: [8, 6.5, 8], zoom: 78, near: -50, far: 100 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 9, 5]} intensity={2.2} />
      <directionalLight position={[-6, 3, -4]} intensity={0.6} color={SKY} />
      {lite ? null : (
        <directionalLight position={[0, -4, 3]} intensity={0.3} color={YELLOW} />
      )}
      <Stage spin={spin} />
    </Canvas>
  );
}
