"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The isometric world, actually in three dimensions.
 *
 * Everywhere else on this site the extruded side face is faked with a hard
 * offset shadow. Here the solids are real.
 *
 * The camera is ORTHOGRAPHIC and sits on the (1, 1, 1) diagonal. That is what
 * makes it isometric — parallel edges stay parallel, and a cube shows three
 * equal faces. A perspective camera would throw the design language away, so
 * don't switch it.
 *
 * There are no lights. Each face carries its own flat colour — top at full
 * strength, the two visible sides stepped down — so the palette on screen is
 * exactly the palette in the tokens, with no renderer between the two. That is
 * also what keeps it identical to the flat blocks on the rest of the page.
 * Every solid carries black edge lines, because the outline belongs to this
 * world as much as the fill does.
 */

const INK = "#221a14";
const YELLOW = "#f0b000";
const SKY = "#90d0f0";
const WHITE = "#ffffff";

/**
 * Six face materials in BoxGeometry's own order: +X, -X, +Y, -Y, +Z, -Z.
 * From this camera the eye sees +X, +Y and +Z, so those three carry the step.
 * Dark blocks step up towards white instead of down into mud.
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

    const side = step(l < 0.28 ? 0.2 : 0.16);
    const front = step(l < 0.28 ? 0.1 : 0.07);
    const top = step(0);
    return [side, side, top, top, front, front];
  }, [hex]);

  // These were made by hand, so React Three Fiber does not own them and will
  // not free them. Three distinct materials per block adds up on a remount.
  useEffect(() => () => faces.forEach((m) => m.dispose()), [faces]);

  return faces;
}

type BlockSpec = {
  size: [number, number, number];
  position: [number, number, number];
  color: string;
  /** Phase offset, so the cluster breathes instead of pulsing as one. */
  phase: number;
  bob?: number;
};

/** The little town: a slab, three platforms, and loose cubes. */
const BLOCKS: BlockSpec[] = [
  { size: [7, 0.6, 7], position: [0, -0.3, 0], color: WHITE, phase: 0, bob: 0 },
  { size: [2, 1.3, 2], position: [-1.7, 0.65, 1.4], color: YELLOW, phase: 0.6 },
  { size: [1.8, 2.6, 1.8], position: [1.5, 1.3, -1.1], color: SKY, phase: 1.4 },
  { size: [1.3, 0.9, 1.3], position: [1.9, 0.45, 1.9], color: INK, phase: 2.2 },
  { size: [0.7, 0.7, 0.7], position: [-2.4, 0.35, -1.6], color: SKY, phase: 3 },
  { size: [0.5, 0.5, 0.5], position: [-0.4, 0.25, -2.4], color: YELLOW, phase: 3.8 },
];

function Edges({ size }: { size: [number, number, number] }) {
  const geometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)),
    [size],
  );
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={INK} toneMapped={false} />
    </lineSegments>
  );
}

function Block({ spec }: { spec: BlockSpec }) {
  const group = useRef<THREE.Group>(null);
  const faces = useFaces(spec.color);
  const geometry = useMemo(() => new THREE.BoxGeometry(...spec.size), [spec.size]);
  const amplitude = spec.bob ?? 0.09;

  useFrame(({ clock }) => {
    if (!group.current || amplitude === 0) return;
    group.current.position.y =
      spec.position[1] + Math.sin(clock.elapsedTime * 0.7 + spec.phase) * amplitude;
  });

  return (
    <group ref={group} position={spec.position}>
      <mesh geometry={geometry} material={faces} />
      <Edges size={spec.size} />
    </group>
  );
}

/** The screen standing over the tall platform — the thing being built. */
const SCREEN: [number, number, number] = [2.6, 1.8, 0.16];

function Screen() {
  const group = useRef<THREE.Group>(null);
  const faces = useFaces(WHITE);
  const barFaces = useFaces(YELLOW);
  const body = useMemo(() => new THREE.BoxGeometry(...SCREEN), []);
  const bar = useMemo(() => new THREE.BoxGeometry(2.6, 0.34, 0.18), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.position.y = 3.6 + Math.sin(t * 0.7 + 1.4) * 0.09;
    group.current.rotation.y = Math.sin(t * 0.3) * 0.08;
  });

  return (
    <group ref={group} position={[1.5, 3.6, -1.1]}>
      <mesh geometry={body} material={faces} />
      <mesh geometry={bar} material={barFaces} position={[0, 0.73, 0.02]} />
      <Edges size={SCREEN} />
    </group>
  );
}

/** The parcel, hanging over the town and turning. */
const PARCEL: [number, number, number] = [1.15, 1.15, 1.15];

function Parcel() {
  const group = useRef<THREE.Group>(null);
  const faces = useFaces(YELLOW);
  const bandFaces = useFaces(INK);
  const box = useMemo(() => new THREE.BoxGeometry(...PARCEL), []);
  const band = useMemo(() => new THREE.BoxGeometry(1.2, 0.18, 1.2), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.y = t * 0.3;
    group.current.position.y = 3.95 + Math.sin(t * 0.9) * 0.22;
    group.current.rotation.z = Math.sin(t * 0.9) * 0.05;
  });

  return (
    <group ref={group} position={[-1.5, 3.95, 1.2]}>
      <mesh geometry={box} material={faces} />
      <mesh geometry={band} material={bandFaces} />
      <Edges size={PARCEL} />
    </group>
  );
}

/**
 * The town leans towards the pointer and turns a little as the page scrolls.
 * Both are damped towards a target rather than set outright, so a flicked
 * cursor glides instead of snapping, and the damping is frame-rate independent.
 */
function Town({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!group.current) return;
    const damp = 1 - Math.exp(-4 * delta);
    const targetY = pointer.x * 0.22 + scrollRef.current * 0.7;
    const targetX = -pointer.y * 0.1;
    group.current.rotation.y += (targetY - group.current.rotation.y) * damp;
    group.current.rotation.x += (targetX - group.current.rotation.x) * damp;
  });

  return (
    <group ref={group} position={[0, -0.6, 0]}>
      {BLOCKS.map((spec, i) => (
        <Block key={i} spec={spec} />
      ))}
      <Screen />
      <Parcel />
    </group>
  );
}

/**
 * Keeps the whole town inside the frame at any canvas size.
 *
 * Under this projection the scene measures about 10 units across the diagonal
 * and 7.4 tall, so the zoom is whichever axis runs out first, with a margin.
 * Without this the slab is cropped on a phone, where the canvas is narrow.
 */
function Fit() {
  const applied = useRef(0);

  useFrame(({ camera, size }) => {
    const zoom = Math.max(12, Math.min(size.width / 11, size.height / 8.4));
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
