"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { DoubleSide, MathUtils } from "three";

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

/* Brand primaries: yellow, black, white, sky blue. */
const YELLOW = "#f0b000";
const BLACK = "#221a14";
const SKY = "#90d0f0";
const WHITE = "#ffffff";

/** Seconds per beat of the logo cycle. */
const BEAT = 4.6;
/** Fraction of a beat spent turning; the remainder idles. */
const TURN = 0.34;

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
 * Wings beat fast while hovering and tuck in during the turn — the way a real
 * wing loads up before a change of direction.
 */
function Wing({ side }: { side: 1 | -1 }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const e = effortAt(t);
    const beat = Math.sin(t * (10 + e * 16)) * (0.28 + e * 0.16);
    ref.current.rotation.z = side * (0.35 - e * 0.22 + beat);
    ref.current.scale.setScalar(1 + e * 0.12);
  });

  return (
    <mesh ref={ref} position={[side * 0.62, 0.66, 0]} rotation={[0.35, 0, side * 0.3]}>
      <planeGeometry args={[1.25, 0.5]} />
      <meshStandardMaterial
        color={SKY}
        side={DoubleSide}
        transparent
        opacity={0.9}
        roughness={0.2}
      />
    </mesh>
  );
}

/** The mark itself, running the animation cycle. */
function Parcel() {
  const group = useRef<Group>(null);
  const lid = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;

    const beats = t / BEAT;
    const step = Math.floor(beats);
    const phase = beats - step;

    const p = Math.min(phase / TURN, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const e = Math.sin(p * Math.PI);

    group.current.rotation.y = (step + eased) * (Math.PI / 2) + e * 0.075;
    group.current.rotation.z = -e * 0.13;
    group.current.rotation.x = e * 0.06;
    group.current.position.y = 1.5 + Math.sin(t * 1.15) * 0.07 + e * 0.34;

    if (lid.current) lid.current.position.y = 0.665 + e * 0.07;
  });

  return (
    <group ref={group}>
      <RoundedBox args={[1.3, 1.3, 1.3]} radius={0.07} smoothness={4}>
        <meshStandardMaterial color={YELLOW} roughness={0.38} metalness={0.18} />
      </RoundedBox>

      {/* Stripes */}
      {[0.32, -0.32].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.22, 1.33, 1.33]} />
          <meshStandardMaterial color={BLACK} roughness={0.55} />
        </mesh>
      ))}

      {/* Tape across the lid — lifts a little on each beat */}
      <mesh ref={lid} position={[0, 0.665, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.26, 1.32]} />
        <meshStandardMaterial color={BLACK} roughness={0.6} side={DoubleSide} />
      </mesh>

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

export default function IsoScene({ scrollSpin = true }: { scrollSpin?: boolean }) {
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
      dpr={[1, 1.6]}
      camera={{ position: [8, 6.5, 8], zoom: 78, near: -50, far: 100 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 9, 5]} intensity={2.2} />
      <directionalLight position={[-6, 3, -4]} intensity={0.6} color={SKY} />
      <directionalLight position={[0, -4, 3]} intensity={0.3} color={YELLOW} />
      <Stage spin={spin} />
    </Canvas>
  );
}
