"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { DoubleSide } from "three";

/**
 * The Hanubees parcel, in real 3D.
 *
 * The logo is drawn as an isometric box, so the honest way to bring it to life
 * is to build it as an actual box rather than to fake depth on a flat image.
 * Geometry, materials, and lighting are all react-three-fiber; the palette is
 * lifted straight from the artwork.
 *
 * Motion is a slow float and a partial turn — it never completes a spin, so it
 * reads as hovering rather than as a loading spinner.
 */

/* Straight from the logo's own pixels. */
const AMBER = "#f0b000";
const BROWN = "#804000";
const INK = "#302020";
const SKY = "#90d0f0";

function Stripe({ x }: { x: number }) {
  return (
    <mesh position={[x, 0, 0]}>
      <boxGeometry args={[0.26, 1.53, 1.53]} />
      <meshStandardMaterial color={INK} roughness={0.55} metalness={0.05} />
    </mesh>
  );
}

function Wing({ side }: { side: 1 | -1 }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // A small, fast flutter — a bee's wing, not a bird's.
    ref.current.rotation.y = side * (0.5 + Math.sin(clock.elapsedTime * 9) * 0.22);
  });

  return (
    <mesh ref={ref} position={[side * 0.55, 0.92, -0.1]} rotation={[0.3, 0, side * 0.35]}>
      {/* Flat quad, drawn both sides so it never disappears mid-flutter */}
      <planeGeometry args={[1.5, 0.62]} />
      <meshStandardMaterial
        color={SKY}
        side={DoubleSide}
        transparent
        opacity={0.85}
        roughness={0.25}
      />
    </mesh>
  );
}

function Parcel() {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.9) * 0.12;
    // Oscillates rather than spins — it never shows the same face twice in a row
    // but never reads as a spinner either.
    group.current.rotation.y = 0.6 + Math.sin(t * 0.35) * 0.45;
    group.current.rotation.x = 0.22 + Math.sin(t * 0.5) * 0.06;
  });

  return (
    <group ref={group}>
      <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.09} smoothness={4}>
        <meshStandardMaterial color={AMBER} roughness={0.42} metalness={0.12} />
      </RoundedBox>

      {/* Tape seam across the lid */}
      <mesh position={[0, 0.76, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 1.52]} />
        <meshStandardMaterial color={BROWN} roughness={0.6} />
      </mesh>

      <Stripe x={0.36} />
      <Stripe x={-0.36} />

      <Wing side={1} />
      <Wing side={-1} />
    </group>
  );
}

export default function ParcelScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.5, 4.4], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 4]} intensity={2.1} />
      <directionalLight position={[-4, 1, -2]} intensity={0.5} color={SKY} />
      {/* No drei <Environment>: its presets fetch an HDR from a CDN, and the
          hero should not depend on a third-party asset to light itself. */}
      <directionalLight position={[0, -3, 2]} intensity={0.35} color={AMBER} />
      <Parcel />
    </Canvas>
  );
}
