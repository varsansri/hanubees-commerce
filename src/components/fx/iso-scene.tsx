"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { DoubleSide, MathUtils, Shape } from "three";

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

/* Brand primaries: yellow, black, white, sky blue.
   SHADE is the brown on the logo's top and right faces — the box's own shaded
   sides, sampled from the artwork. It is face shading, not a fifth theme
   colour, and it appears nowhere in the UI. */
const YELLOW = "#f0b000";
const SHADE = "#804000";
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
 * An angular wing, matching the artwork: a flat stepped hexagon, splayed
 * almost horizontal rather than standing upright.
 */
function Wing({ side }: { side: 1 | -1 }) {
  const ref = useRef<Mesh>(null);

  const shape = useMemo(() => {
    const s = new Shape();
    s.moveTo(0, 0);
    s.lineTo(0.5, 0.16);
    s.lineTo(1.15, 0.1);
    s.lineTo(1.45, -0.06);
    s.lineTo(1.1, -0.24);
    s.lineTo(0.42, -0.2);
    s.lineTo(0, 0);
    return s;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const e = effortAt(t);
    const beat = Math.sin(t * (10 + e * 16)) * (0.3 + e * 0.18);
    // Beats about the long axis, staying splayed out like the artwork.
    ref.current.rotation.y = side * (0.15 + beat * 0.4);
    ref.current.rotation.z = 0.12 + beat;
    ref.current.scale.setScalar(1 + e * 0.1);
  });

  return (
    <mesh
      ref={ref}
      geometry={undefined}
      position={[side * 0.52, 0.62, side * 0.1]}
      rotation={[-1.15, 0, 0]}
      scale={[side, 1, 1]}
    >
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        color={SKY}
        side={DoubleSide}
        transparent
        opacity={0.92}
        roughness={0.3}
        flatShading
      />
    </mesh>
  );
}

/** The bee's face, sitting on the unstriped left panel as it does in the logo. */
function Face() {
  const x = -0.663; // just proud of the -X face

  return (
    <group position={[x, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Eyes: black block with a sky inset at the base */}
      {[-0.3, 0.22].map((ex, i) => (
        <group key={ex} position={[ex, -0.16 - i * 0.12, 0]}>
          <mesh>
            <planeGeometry args={[0.24, 0.44]} />
            <meshStandardMaterial color={BLACK} side={DoubleSide} />
          </mesh>
          <mesh position={[0, -0.1, 0.002]}>
            <planeGeometry args={[0.14, 0.16]} />
            <meshStandardMaterial color={SKY} side={DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Brow marks and the stub antenna on the panel edge */}
      <mesh position={[-0.26, 0.3, 0]}>
        <planeGeometry args={[0.2, 0.12]} />
        <meshStandardMaterial color={BLACK} side={DoubleSide} />
      </mesh>
      <mesh position={[0.02, 0.16, 0]}>
        <planeGeometry args={[0.22, 0.12]} />
        <meshStandardMaterial color={BLACK} side={DoubleSide} />
      </mesh>
      <mesh position={[-0.55, 0.42, 0]} rotation={[0, 0, 0.2]}>
        <planeGeometry args={[0.26, 0.1]} />
        <meshStandardMaterial color={BLACK} side={DoubleSide} />
      </mesh>

      {/* The small white highlight from the artwork */}
      <mesh position={[0.3, 0.02, 0]} rotation={[0, 0, 0.12]}>
        <planeGeometry args={[0.16, 0.07]} />
        <meshStandardMaterial color={WHITE} side={DoubleSide} />
      </mesh>
    </group>
  );
}

/**
 * The mark itself, running the animation cycle.
 *
 * Hard-edged box, not a rounded one — the artwork is flat and pixel-cut, and a
 * bevel reads as a different, softer product. Faces are coloured individually
 * so the top and right sit in the artwork's brown while the front panels stay
 * yellow; that per-face split is what makes it read as the logo rather than as
 * a generic yellow cube.
 */
function Parcel() {
  const group = useRef<Group>(null);
  const lid = useRef<Mesh>(null);

  // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
  const faces = useMemo(
    () => [SHADE, YELLOW, SHADE, SHADE, YELLOW, SHADE],
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    const e = effortAt(t);

    // Slow look left and right, so the face stays toward the viewer instead of
    // turning away. A full spin would hide the eyes for half of every cycle.
    const look = Math.sin(t * 0.55) * 0.42;

    // Wings drive a figure-eight drift, the way a hovering insect never holds
    // still — the horizontal term runs at half the vertical rate.
    const driftX = Math.sin(t * 0.9) * 0.07;
    const driftZ = Math.sin(t * 0.45) * 0.05;

    group.current.rotation.y = FACING + look + e * 0.22;
    // Tips into the hop, and banks slightly into the direction of the look.
    group.current.rotation.z = -look * 0.16 - e * 0.12;
    group.current.rotation.x = e * 0.1;

    group.current.position.x = driftX;
    group.current.position.z = driftZ;
    group.current.position.y = 1.5 + Math.sin(t * 1.4) * 0.06 + e * 0.42;

    // The lid lifts on the hop, as if the box is carrying something.
    if (lid.current) lid.current.position.y = 0.667 + e * 0.08;
  });

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[1.3, 1.3, 1.3]} />
        {faces.map((c, i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            color={c}
            roughness={0.62}
            metalness={0.04}
            flatShading
          />
        ))}
      </mesh>

      {/* Bee stripes: bands wrapping the box over the top and down the front,
          exactly as they wrap in the artwork. */}
      {[0.3, -0.34].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.2, 1.315, 1.315]} />
          <meshStandardMaterial color={BLACK} roughness={0.6} flatShading />
        </mesh>
      ))}

      {/* Tape seam across the lid */}
      <mesh ref={lid} position={[0, 0.667, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.22, 1.3]} />
        <meshStandardMaterial color={BLACK} roughness={0.6} side={DoubleSide} />
      </mesh>

      <Face />
      <Wing side={1} />
      <Wing side={-1} />
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
