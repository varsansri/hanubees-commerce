"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The bee that travels the page with you.
 *
 * The camera is orthographic at zoom 1, so ONE WORLD UNIT IS ONE PIXEL. Every
 * measurement below is therefore in pixels, and the outline shells come out at
 * exactly the 2px the rest of the site draws its borders at. Changing the zoom
 * breaks that correspondence, so don't.
 *
 * The bee is oriented into the isometric three-quarter view by a fixed inner
 * rotation, and steered by an outer group that rotates in the screen plane. It
 * follows a designed curve rather than a formula — eight waypoints placed to
 * weave down the page beside the content, ending near the closing call to
 * action — and it follows that curve with damping, so it chases the scroll
 * instead of being welded to it.
 */

const INK = "#221a14";
const YELLOW = "#f0b000";
const WHITE = "#ffffff";

/** Face materials in BoxGeometry order: +X, -X, +Y, -Y, +Z, -Z. */
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

  useEffect(() => () => faces.forEach((m) => m.dispose()), [faces]);
  return faces;
}

/** A solid in the world's language: flat faces, hairline edges, heavy outline. */
function Solid({
  size,
  position = [0, 0, 0],
  rotation,
  color,
  outline = 2,
}: {
  size: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  /** Outline weight in pixels. Zero for parts that sit inside another solid. */
  outline?: number;
}) {
  const faces = useFaces(color);
  const geometry = useMemo(() => new THREE.BoxGeometry(...size), [size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  const shell = useMemo<[number, number, number]>(
    () => [
      1 + (2 * outline) / size[0],
      1 + (2 * outline) / size[1],
      1 + (2 * outline) / size[2],
    ],
    [size, outline],
  );

  return (
    <group position={position} rotation={rotation}>
      {outline > 0 ? (
        <mesh geometry={geometry} scale={shell}>
          <meshBasicMaterial
            color={INK}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>
      ) : null}
      <mesh geometry={geometry} material={faces} />
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={INK} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

/**
 * One wing. The pivot sits where the wing meets the body, so the joint stays
 * put while the tip travels — the way a real wing hinges.
 */
function Wing({ side, beat }: { side: 1 | -1; beat: React.RefObject<number> }) {
  const pivot = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.BoxGeometry(30, 3, 15), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: WHITE,
        transparent: true,
        opacity: 0.92,
        toneMapped: false,
      }),
    [],
  );
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    if (!pivot.current) return;
    // The body runs along X and the wings sit out along ±Z, so the flap is a
    // rotation about X. Mirroring by `side` keeps the pair moving together
    // rather than scissoring. Sweep and foreshorten come along with it: a wing
    // gets shorter as it turns edge-on.
    pivot.current.rotation.x = Math.sin(beat.current) * 0.85 * side;
    pivot.current.rotation.z = Math.cos(beat.current) * 0.16 * side;
    pivot.current.scale.x = 0.88 + Math.abs(Math.cos(beat.current)) * 0.12;
  });

  return (
    <group ref={pivot} position={[-2, 9, side * 9]}>
      <group position={[0, 0, side * 8]}>
        <mesh geometry={geometry} material={material} />
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={INK} toneMapped={false} />
        </lineSegments>
      </group>
    </group>
  );
}

/** Waypoints as fractions of the viewport, walked from the top of the page. */
const PATH: [number, number][] = [
  [0.36, 0.3],
  [-0.3, 0.08],
  [0.28, -0.2],
  [-0.26, 0.2],
  [0.31, 0.04],
  [-0.29, -0.18],
  [0.2, 0.22],
  [0.0, -0.24],
];

function Bee() {
  const steer = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const size = useThree((s) => s.size);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        PATH.map(
          ([x, y]) => new THREE.Vector3(x * size.width, y * size.height, 0),
        ),
        false,
        "catmullrom",
        0.4,
      ),
    [size.width, size.height],
  );

  const flight = useRef({ progress: 0, x: 0, y: 0, angle: 0, speed: 0, time: 0 });
  const beat = useRef(0);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const group = steer.current;
    const body = tilt.current;
    if (!group || !body) return;

    const f = flight.current;
    // A backgrounded tab stops asking for frames; the first one back reports
    // the whole absence. Clamp it, and keep our own time from those clamped
    // steps, so the idle drift resumes rather than teleporting.
    const step = Math.min(delta, 1 / 30);
    f.time += step;
    const t = f.time;

    // Where the reader is, from 0 at the top of the document to 1 at the end.
    const scrollable = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const target = Math.min(1, Math.max(0, window.scrollY / scrollable));
    f.progress += (target - f.progress) * (1 - Math.exp(-5 * step));

    curve.getPoint(f.progress, point);
    // An idle drift, so a bee that has arrived is still alive.
    const wantX = point.x + Math.sin(t * 0.9) * 12;
    const wantY = point.y + Math.cos(t * 1.25) * 9;

    const follow = 1 - Math.exp(-4.5 * step);
    const dx = (wantX - f.x) * follow;
    const dy = (wantY - f.y) * follow;
    f.x += dx;
    f.y += dy;

    const velocity = Math.hypot(dx, dy) / step;
    f.speed += (velocity - f.speed) * (1 - Math.exp(-6 * step));

    // Point along the direction of travel, but only once actually travelling —
    // below that the heading is noise, and a bee spinning on the spot is wrong.
    if (velocity > 12) {
      const heading = Math.atan2(dy, dx);
      let turn = heading - f.angle;
      turn = Math.atan2(Math.sin(turn), Math.cos(turn));
      f.angle += turn * (1 - Math.exp(-7 * step));
    }

    group.position.set(f.x, f.y, 0);
    // Bank into the turn, capped so it never rolls past readable.
    group.rotation.z =
      f.angle * 0.55 + Math.max(-0.5, Math.min(0.5, dy / step / 900));

    // A hover bob that fades out as the bee picks up speed.
    const settled = Math.max(0, 1 - f.speed / 220);
    body.position.y = Math.sin(t * 2.4) * 3.5 * settled;

    // Wings: lazy at rest, frantic when the page is flung.
    beat.current += step * (34 + Math.min(f.speed, 900) * 0.06);
  });

  return (
    <group ref={steer}>
      <group ref={tilt}>
        {/* The fixed three-quarter rotation that makes it read isometric. */}
        <group rotation={[0.62, -0.79, 0]} scale={size.width < 640 ? 0.72 : 1}>
          <Solid size={[46, 30, 30]} color={YELLOW} />
          {/* stripes */}
          <Solid
            size={[8, 32, 32]}
            position={[-4, 0, 0]}
            color={INK}
            outline={0}
          />
          <Solid
            size={[8, 32, 32]}
            position={[10, 0, 0]}
            color={INK}
            outline={0}
          />
          {/* head and stinger */}
          <Solid size={[14, 20, 20]} position={[28, 0, 0]} color={INK} />
          <Solid size={[10, 8, 8]} position={[-26, 0, 0]} color={INK} />
          <Wing side={1} beat={beat} />
          <Wing side={-1} beat={beat} />
        </group>
      </group>
    </group>
  );
}

export function BeeScene({ quality }: { quality: "lite" | "full" }) {
  return (
    <Canvas
      orthographic
      // zoom 1: one world unit is one pixel. See the note at the top.
      camera={{ position: [0, 0, 400], zoom: 1, near: 1, far: 2000 }}
      dpr={quality === "lite" ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true }}
      flat
      style={{ position: "absolute", inset: 0 }}
    >
      <Bee />
    </Canvas>
  );
}
