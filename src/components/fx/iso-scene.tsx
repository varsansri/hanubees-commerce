"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The isometric world, actually in three dimensions.
 *
 * The camera is ORTHOGRAPHIC and sits on the (1, 1, 1) diagonal. That is what
 * makes it isometric — parallel edges stay parallel, and a cube shows three
 * equal faces. A perspective camera would throw the design language away.
 *
 * No lights. Each box carries six flat face materials — top at full strength,
 * the two visible sides stepped down, dark blocks stepping up towards white
 * instead of into mud — so the palette on screen is the palette in the tokens.
 * Silhouettes are drawn by a slightly larger black box rendered back-faces-only
 * behind each solid, which gives the heavy outer contour the flat blocks have;
 * interior edges stay hairline, the way isometric illustration draws them.
 *
 * Motion is ONE authored moment, not scattered fidgeting: the town builds
 * itself once, from the ground up, and afterwards only turns — slowly enough
 * that you notice it has moved rather than watching it move. Blocks that bob
 * independently read as loose toys, so nothing bobs except the parcel, which is
 * meant to be in the air.
 */

const INK = "#221a14";
const YELLOW = "#f0b000";
const SKY = "#90d0f0";
const SKY_DEEP = "#6bb4dd";
const WHITE = "#ffffff";

/** Exponential ease-out: fast off the mark, settles without a bounce. */
const easeOut = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));

/**
 * Six face materials in BoxGeometry's own order: +X, -X, +Y, -Y, +Z, -Z.
 * From this camera the eye sees +X, +Y and +Z, so those three carry the step.
 */
function useFaces(hex: string) {
  const faces = useMemo(() => {
    const base = new THREE.Color(hex);
    const { l } = base.getHSL({ h: 0, s: 0, l: 0 });
    const towards = new THREE.Color(l < 0.28 ? "#ffffff" : "#000000");
    const step = (amount: number) =>
      new THREE.MeshBasicMaterial({
        color: base.clone().lerp(towards, amount),
        toneMapped: false,
      });

    const side = step(l < 0.28 ? 0.22 : 0.17);
    const front = step(l < 0.28 ? 0.11 : 0.075);
    const top = step(0);
    return [side, side, top, top, front, front];
  }, [hex]);

  // Made by hand, so React Three Fiber does not own them and will not free them.
  useEffect(() => () => faces.forEach((m) => m.dispose()), [faces]);

  return faces;
}

type Vec3 = [number, number, number];

/** How far below its resting place a solid starts, before it rises in. */
const DROP = 5.5;
const RISE_SECONDS = 1.15;

function Solid({
  size,
  position,
  color,
  delay = 0,
  hover = 0,
  spin = 0,
  children,
}: {
  size: Vec3;
  position: Vec3;
  color: string;
  /** Seconds after mount before this one starts rising. */
  delay?: number;
  /** Amplitude of the idle hover, in world units. Only things in the air get one. */
  hover?: number;
  /** Radians per second about Y, once it has arrived. */
  spin?: number;
  children?: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const faces = useFaces(color);
  const geometry = useMemo(() => new THREE.BoxGeometry(...size), [size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  // The outline is a shell: the same box, grown by a constant thickness in
  // world units, drawn back-faces-only so only its silhouette survives.
  const shellScale = useMemo<Vec3>(() => {
    const t = 0.05;
    return [1 + (2 * t) / size[0], 1 + (2 * t) / size[1], 1 + (2 * t) / size[2]];
  }, [size]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const p = Math.min(1, Math.max(0, (t - delay) / RISE_SECONDS));
    const eased = easeOut(p);

    g.position.y = position[1] - DROP * (1 - eased) + Math.sin(t * 0.75) * hover * eased;
    if (spin) g.rotation.y = t * spin * eased;
  });

  return (
    <group ref={group} position={position}>
      <mesh geometry={geometry} scale={shellScale}>
        <meshBasicMaterial color={INK} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <mesh geometry={geometry} material={faces} />
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={INK} toneMapped={false} />
      </lineSegments>
      {children}
    </group>
  );
}

/** Small inset panels on a tower's two visible faces — windows, in effect. */
function Windows({
  size,
  rows,
  columns,
}: {
  size: Vec3;
  rows: number;
  columns: number;
}) {
  const panel = useMemo(() => new THREE.BoxGeometry(0.3, 0.22, 0.04), []);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: INK, toneMapped: false }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < columns; c += 1) {
      const y = size[1] / 2 - 0.45 - r * 0.5;
      const x = (c - (columns - 1) / 2) * 0.52;
      cells.push(
        <mesh key={`z${r}${c}`} geometry={panel} material={material} position={[x, y, size[2] / 2 + 0.01]} />,
        <mesh
          key={`x${r}${c}`}
          geometry={panel}
          material={material}
          position={[size[0] / 2 + 0.01, y, x]}
          rotation={[0, Math.PI / 2, 0]}
        />,
      );
    }
  }
  return <>{cells}</>;
}

const SLAB: Vec3 = [7.4, 0.6, 7.4];
const TOWER: Vec3 = [1.8, 2.9, 1.8];
const SCREEN: Vec3 = [2.3, 1.5, 0.16];

function Town({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useThree((s) => s.pointer);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const damp = 1 - Math.exp(-3.5 * delta);
    // A turntable slow enough to read as stillness that happens to change.
    const drift = state.clock.elapsedTime * 0.045;
    const targetY = drift + pointer.x * 0.18 + scrollRef.current * 0.35;
    const targetX = -pointer.y * 0.07;
    g.rotation.y += (targetY - g.rotation.y) * damp;
    g.rotation.x += (targetX - g.rotation.x) * damp;
  });

  return (
    <group ref={group} position={[0, -1.1, 0]}>
      {/* the ground — the grid is its child, so it rides up with it */}
      <Solid size={SLAB} position={[0, -0.3, 0]} color={SKY}>
        <gridHelper
          args={[7.4, 14, INK, INK]}
          position={[0, SLAB[1] / 2 + 0.002, 0]}
          material-transparent
          material-opacity={0.13}
        />
      </Solid>

      {/* the skyline, rising left to right */}
      <Solid size={[2, 1.4, 2]} position={[-2, 0.7, 1.5]} color={YELLOW} delay={0.1} />
      <Solid size={[1.2, 2, 1.2]} position={[-0.9, 1, -0.9]} color={SKY_DEEP} delay={0.24} />
      <Solid size={TOWER} position={[1.5, 1.45, -1.3]} color={WHITE} delay={0.38}>
        <Windows size={TOWER} rows={3} columns={2} />
      </Solid>
      <Solid size={[1.4, 1, 1.4]} position={[2.3, 0.5, 1.9]} color={INK} delay={0.52} />
      <Solid size={[0.8, 0.8, 0.8]} position={[-2.6, 0.4, -1.5]} color={WHITE} delay={0.62} />
      <Solid size={[0.6, 0.6, 0.6]} position={[-0.2, 0.3, -2.7]} color={YELLOW} delay={0.7} />

      {/* the thing being built, standing on the tall tower */}
      <Solid size={[0.3, 0.5, 0.3]} position={[1.5, 3.15, -1.3]} color={INK} delay={0.9} />
      <Solid size={SCREEN} position={[1.5, 4.15, -1.3]} color={WHITE} delay={1.02}>
        <mesh position={[0, 0.52, 0.09]}>
          <boxGeometry args={[2.3, 0.3, 0.02]} />
          <meshBasicMaterial color={YELLOW} toneMapped={false} />
        </mesh>
        <mesh position={[-0.55, 0.05, 0.09]}>
          <boxGeometry args={[1.1, 0.12, 0.02]} />
          <meshBasicMaterial color={SKY_DEEP} toneMapped={false} />
        </mesh>
        <mesh position={[-0.75, -0.25, 0.09]}>
          <boxGeometry args={[0.7, 0.12, 0.02]} />
          <meshBasicMaterial color={SKY_DEEP} toneMapped={false} />
        </mesh>
      </Solid>

      {/* the parcel, the only thing in the air and so the only thing hovering */}
      <Solid
        size={[1.05, 1.05, 1.05]}
        position={[-2, 2.9, 1.5]}
        color={YELLOW}
        delay={1.18}
        hover={0.16}
        spin={0.22}
      >
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.1, 0.16, 1.1]} />
          <meshBasicMaterial color={INK} toneMapped={false} />
        </mesh>
      </Solid>
    </group>
  );
}

/**
 * Keeps the whole town in frame at any canvas size — without this the slab is
 * cropped on a phone, where the canvas is narrow.
 */
function Fit() {
  const applied = useRef(0);

  useFrame(({ camera, size }) => {
    const zoom = Math.max(10, Math.min(size.width / 11.6, size.height / 9.2));
    if (Math.abs(zoom - applied.current) < 0.01) return;
    applied.current = zoom;
    const cam = camera as THREE.OrthographicCamera;
    cam.zoom = zoom;
    cam.updateProjectionMatrix();
  });

  return null;
}

/** Feeds page scroll into the scene without re-rendering any React. */
function ScrollBinding({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  useFrame(() => {
    scrollRef.current = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
  });
  return null;
}

export function IsoScene({ quality }: { quality: "lite" | "full" }) {
  const scroll = useRef(0);

  return (
    <Canvas
      orthographic
      // On the (1, 1, 1) diagonal: isometric in the literal sense.
      camera={{ position: [14, 14, 14], zoom: 46, near: -100, far: 100 }}
      dpr={quality === "lite" ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true }}
      // `flat` turns off tone mapping: the colours on screen are the tokens.
      flat
      style={{ position: "absolute", inset: 0 }}
    >
      <Fit />
      <ScrollBinding scrollRef={scroll} />
      <Town scrollRef={scroll} />
    </Canvas>
  );
}
