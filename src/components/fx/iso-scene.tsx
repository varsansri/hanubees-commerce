"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { DoubleSide, MathUtils } from "three";

/**
 * The Hanubees isometric world.
 *
 * Rendered through an **orthographic** camera at a fixed 45°/35° angle, which
 * is what makes it read as true isometric rather than as a perspective 3D
 * render — the same projection the logo itself is drawn in. Parallel edges stay
 * parallel, so the scene sits in the same visual language as the mark.
 *
 * The world is a small workbench: a plinth, the winged parcel above it, stacked
 * crates, and a counter. Scrolling turns the whole stage rather than moving the
 * camera, so the composition never breaks.
 */

/* Brand primaries: yellow, black, white, sky blue. Deep yellow is shading only. */
const YELLOW = "#f0b000";
const BLACK = "#221a14";
const SKY = "#90d0f0";
const WHITE = "#ffffff";

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

function Wing({ side }: { side: 1 | -1 }) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = side * (0.35 + Math.sin(clock.elapsedTime * 10) * 0.28);
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

/** The mark itself: a parcel with stripes and a taped lid, hovering. */
function Parcel() {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.y = 1.5 + Math.sin(clock.elapsedTime * 1.1) * 0.1;
  });

  return (
    <group ref={group}>
      <RoundedBox args={[1.3, 1.3, 1.3]} radius={0.07} smoothness={4}>
        <meshStandardMaterial color={YELLOW} roughness={0.4} metalness={0.15} />
      </RoundedBox>

      {/* Stripes */}
      {[0.32, -0.32].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.22, 1.33, 1.33]} />
          <meshStandardMaterial color={BLACK} roughness={0.55} />
        </mesh>
      ))}

      {/* Tape across the lid */}
      <mesh position={[0, 0.665, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.26, 1.32]} />
        <meshStandardMaterial color={BLACK} roughness={0.6} side={DoubleSide} />
      </mesh>

      <Wing side={1} />
      <Wing side={-1} />
    </group>
  );
}

/** Everything the parcel flies above. */
function Bench() {
  return (
    <group>
      {/* Plinth */}
      <RoundedBox
        args={[4.6, 0.45, 4.6]}
        radius={0.08}
        smoothness={3}
        position={[0, -0.6, 0]}
      >
        <meshStandardMaterial color={WHITE} roughness={0.85} />
      </RoundedBox>

      {/* Shadow patch under the parcel — grounds the float */}
      <mesh position={[0, -0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.72, 32]} />
        <meshStandardMaterial color={BLACK} transparent opacity={0.14} />
      </mesh>

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

      {/* A parcel already shipped, sitting on the counter */}
      <Crate position={[1.45, 0.87, 0.9]} size={0.5} color={YELLOW} />
    </group>
  );
}

/* ----------------------------------------------------------------- stage */

function Stage({ spin }: { spin: number }) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    // Chase the scroll target rather than snapping to it, so the turn keeps
    // moving for a beat after the scroll stops.
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      spin,
      3.5,
      delta,
    );
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
      // 45° round, 35.26° up: the true isometric viewing angle.
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
