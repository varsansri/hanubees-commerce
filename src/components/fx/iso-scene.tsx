"use client";

import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { PROJECTS } from "@/lib/site";

/**
 * The isometric city, and the map you can move around in it.
 *
 * The camera is ORTHOGRAPHIC and sits on the (1, 1, 1) diagonal. That is what
 * makes it isometric — parallel edges stay parallel, and a cube shows three
 * equal faces. A perspective camera would throw the design language away.
 *
 * No lights. Each box carries six flat face materials — top at full strength,
 * the two visible sides stepped down, dark blocks stepping up towards white
 * instead of into mud — so the palette on screen is the palette in the tokens.
 * Silhouettes come from a slightly larger black box drawn back-faces-only.
 *
 * Four of the buildings are projects. Tapping one names it; tapping the same
 * one again opens its case study, which is also reachable from a link inside
 * the label. A 3D canvas cannot be tabbed into, so the same four destinations
 * are repeated as ordinary links for keyboard and screen reader users.
 *
 * Gestures follow the rule every map on a phone follows: one finger belongs to
 * the page, two fingers belong to the map. Otherwise the hero would swallow
 * the scroll and strand the reader.
 */

const INK = "#221a14";
const YELLOW = "#f0b000";
const SKY = "#90d0f0";
const SKY_DEEP = "#6bb4dd";
const WHITE = "#ffffff";

/** Exponential ease-out: fast off the mark, settles without a bounce. */
const easeOut = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));

/**
 * The longest frame any animation here is allowed to believe in.
 *
 * This scene parks its renderer when it scrolls away, and a backgrounded tab
 * stops requesting frames at all. Either way the first frame back reports the
 * whole absence as one delta, so every animation accumulates its own time from
 * clamped steps and a parked scene resumes exactly where it stopped.
 */
const MAX_STEP = 1 / 30;

/** The screen's own axes under this camera: a drag right moves along RIGHT. */
const RIGHT = new THREE.Vector3(1, 0, -1).normalize();
const UP = new THREE.Vector3(-1, 2, -1).normalize();

/**
 * Defined once, outside render.
 *
 * As an inline literal this is a new object every render, and React Three
 * Fiber re-applies camera props when they change — which quietly resets
 * anything written to the camera in between. Nothing here writes to the camera
 * except the fit, but the trap is worth closing permanently.
 */
const CAMERA = { position: [14, 14, 14] as const, zoom: 46, near: -100, far: 100 };

const ZOOM_MIN = 0.75;
const ZOOM_MAX = 3.2;
const PAN_LIMIT = 5;

type Vec3 = [number, number, number];

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

  useEffect(() => () => faces.forEach((m) => m.dispose()), [faces]);
  return faces;
}

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
  lifted = false,
  onSelect,
  register,
  children,
}: {
  size: Vec3;
  position: Vec3;
  color: string;
  /** Seconds after mount before this one starts rising. */
  delay?: number;
  /** Amplitude of the idle hover. Only things in the air get one. */
  hover?: number;
  /** Radians per second about Y, once it has arrived. */
  spin?: number;
  /** Raised and ringed because it is the chosen building. */
  lifted?: boolean;
  onSelect?: () => void;
  /** Hands the mesh back up, so a label can be pinned above it. */
  register?: (object: THREE.Object3D | null) => void;
  children?: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const faces = useFaces(color);
  const geometry = useMemo(() => new THREE.BoxGeometry(...size), [size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);
  const time = useRef(0);
  const raise = useRef(0);

  const shellScale = useMemo<Vec3>(() => {
    const t = 0.05;
    return [
      1 + (2 * t) / size[0],
      1 + (2 * t) / size[1],
      1 + (2 * t) / size[2],
    ];
  }, [size]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const step = Math.min(delta, MAX_STEP);
    time.current += step;
    const t = time.current;
    const p = Math.min(1, Math.max(0, (t - delay) / RISE_SECONDS));
    const eased = easeOut(p);

    const want = lifted ? 0.45 : 0;
    raise.current += (want - raise.current) * (1 - Math.exp(-9 * step));

    g.position.y =
      position[1] -
      DROP * (1 - eased) +
      raise.current +
      Math.sin(t * 0.75) * hover * eased;
    if (spin) g.rotation.y = t * spin * eased;
  });

  const interactive = Boolean(onSelect);

  return (
    <group ref={group} position={position}>
      <mesh geometry={geometry} scale={shellScale} raycast={() => null}>
        <meshBasicMaterial
          color={INK}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>
      <mesh
        ref={register}
        geometry={geometry}
        material={faces}
        onClick={
          interactive
            ? (e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                onSelect?.();
              }
            : undefined
        }
        onPointerOver={
          interactive
            ? (e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }
            : undefined
        }
        onPointerOut={
          interactive ? () => (document.body.style.cursor = "") : undefined
        }
      />
      <lineSegments geometry={edges} raycast={() => null}>
        <lineBasicMaterial color={INK} toneMapped={false} />
      </lineSegments>
      {lifted ? (
        <mesh
          position={[0, -size[1] / 2 - 0.32, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          raycast={() => null}
        >
          <ringGeometry args={[size[0] * 0.8, size[0] * 0.8 + 0.1, 40]} />
          <meshBasicMaterial
            color={YELLOW}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : null}
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
        <mesh
          key={`z${r}${c}`}
          geometry={panel}
          material={material}
          position={[x, y, size[2] / 2 + 0.01]}
          raycast={() => null}
        />,
        <mesh
          key={`x${r}${c}`}
          geometry={panel}
          material={material}
          position={[size[0] / 2 + 0.01, y, x]}
          rotation={[0, Math.PI / 2, 0]}
          raycast={() => null}
        />,
      );
    }
  }
  return <>{cells}</>;
}

const SLAB: Vec3 = [7.4, 0.6, 7.4];
const TOWER: Vec3 = [1.8, 2.9, 1.8];

/** Which building is which project, read as a skyline from left to right. */
const PLOTS: {
  slug: string;
  size: Vec3;
  position: Vec3;
  color: string;
  delay: number;
}[] = [
  {
    slug: "annam",
    size: [2, 1.4, 2],
    position: [-2, 0.7, 1.5],
    color: YELLOW,
    delay: 0.1,
  },
  {
    slug: "gs-cosmatics",
    size: [1.2, 2, 1.2],
    position: [-0.9, 1, -0.9],
    color: SKY_DEEP,
    delay: 0.24,
  },
  {
    slug: "hanubees-commerce",
    size: TOWER,
    position: [1.5, 1.45, -1.3],
    color: WHITE,
    delay: 0.38,
  },
  {
    slug: "reaching-dreams",
    size: [1.4, 1, 1.4],
    position: [2.3, 0.5, 1.9],
    color: INK,
    delay: 0.52,
  },
];

type View = { zoom: number; panX: number; panY: number };

function Town({
  scrollRef,
  viewRef,
  draggingRef,
  selected,
  onSelect,
  registerAnchor,
}: {
  scrollRef: React.RefObject<number>;
  viewRef: React.RefObject<View>;
  draggingRef: React.RefObject<boolean>;
  selected: string | null;
  onSelect: (slug: string) => void;
  registerAnchor: (slug: string, object: THREE.Object3D | null) => void;
}) {
  const pan = useRef<THREE.Group>(null);
  const town = useRef<THREE.Group>(null);
  const pointer = useThree((s) => s.pointer);
  const drift = useRef(0);
  const offset = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const g = town.current;
    const p = pan.current;
    if (!g || !p) return;
    const step = Math.min(delta, MAX_STEP);
    const damp = 1 - Math.exp(-3.5 * step);

    // The turntable accumulates its angle rather than reading a clock, so
    // parking the renderer pauses the turn instead of banking it up. It also
    // holds still while a finger is down: the reader is steering, not watching.
    if (!draggingRef.current) drift.current += step * 0.045;

    const lean = draggingRef.current ? 0 : pointer.x * 0.18;
    const targetY = drift.current + lean + scrollRef.current * 0.35;
    const targetX = draggingRef.current ? 0 : -pointer.y * 0.07;
    g.rotation.y += (targetY - g.rotation.y) * damp;
    g.rotation.x += (targetX - g.rotation.x) * damp;

    // Panning runs along the screen's own axes, so a drag to the right moves
    // the city right rather than along a world axis the reader cannot see.
    //
    // Zoom is a scale on this same group, not a change to the camera. Under an
    // orthographic camera the two are equivalent, and doing it here keeps the
    // camera a fixed, known thing — one projection, set once, never fought over
    // by a resize handler or a frustum update.
    const view = viewRef.current;
    offset
      .set(0, 0, 0)
      .addScaledVector(RIGHT, view.panX)
      .addScaledVector(UP, view.panY);
    const ease = 1 - Math.exp(-9 * step);
    p.position.lerp(offset, ease);
    const scale = p.scale.x + (view.zoom - p.scale.x) * ease;
    p.scale.setScalar(scale);
  });

  return (
    <group ref={pan}>
      <group ref={town} position={[0, 0.35, 0]}>
        {/* the ground — the grid is its child, so it rides up with it */}
        <Solid size={SLAB} position={[0, -0.3, 0]} color={SKY}>
          <gridHelper
            args={[7.4, 14, INK, INK]}
            position={[0, SLAB[1] / 2 + 0.002, 0]}
            material-transparent
            material-opacity={0.13}
            raycast={() => null}
          />
        </Solid>

        {PLOTS.map((plot) => (
          <Solid
            key={plot.slug}
            size={plot.size}
            position={plot.position}
            color={plot.color}
            delay={plot.delay}
            lifted={selected === plot.slug}
            onSelect={() => onSelect(plot.slug)}
            register={(object) => registerAnchor(plot.slug, object)}
          >
            {plot.slug === "hanubees-commerce" ? (
              <Windows size={TOWER} rows={3} columns={2} />
            ) : null}
          </Solid>
        ))}

        {/* decoration: not a project, so not clickable */}
        <Solid
          size={[0.8, 0.8, 0.8]}
          position={[-2.6, 0.4, -1.5]}
          color={WHITE}
          delay={0.62}
        />
        <Solid
          size={[0.6, 0.6, 0.6]}
          position={[-0.2, 0.3, -2.7]}
          color={YELLOW}
          delay={0.7}
        />

        {/* the parcel, the only thing in the air and so the only thing hovering */}
        <Solid
          size={[1.05, 1.05, 1.05]}
          position={[-2, 2.9, 1.5]}
          color={YELLOW}
          delay={1.18}
          hover={0.16}
          spin={0.22}
        >
          <mesh raycast={() => null}>
            <boxGeometry args={[1.1, 0.16, 1.1]} />
            <meshBasicMaterial color={INK} toneMapped={false} />
          </mesh>
        </Solid>
      </group>
    </group>
  );
}

/**
 * Fits the city to the canvas, and nothing else.
 *
 * The reader's own zoom lives on the town's scale instead, so this runs only
 * when the canvas actually changes size. Two things writing to one camera is
 * how a zoom silently loses to a resize.
 */
function Camera() {
  const applied = useRef(0);

  useFrame(({ camera, size }) => {
    const fit = Math.max(10, Math.min(size.width / 11.2, size.height / 8.2));
    if (Math.abs(fit - applied.current) < 0.01) return;
    applied.current = fit;
    const cam = camera as THREE.OrthographicCamera;
    cam.zoom = fit;
    cam.updateProjectionMatrix();
  });

  return null;
}

/**
 * Projects the chosen building into screen space every frame and hands the
 * result to whoever owns the label. It reports rather than writes: the element
 * belongs to the component that created it, and moving the label there keeps
 * this one free of anything it does not own.
 */
function Pin({
  anchor,
  place,
}: {
  anchor: React.RefObject<THREE.Object3D | null>;
  place: (x: number, y: number) => void;
}) {
  const position = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }) => {
    const object = anchor.current;
    if (!object) return;
    object.getWorldPosition(position);
    position.project(camera);
    place(
      (position.x * 0.5 + 0.5) * size.width,
      (-position.y * 0.5 + 0.5) * size.height,
    );
  });

  return null;
}

/** Feeds page scroll into the scene without re-rendering any React. */
function ScrollBinding({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  useFrame(() => {
    scrollRef.current = Math.min(
      1,
      window.scrollY / Math.max(1, window.innerHeight),
    );
  });
  return null;
}

export function IsoScene({
  quality,
  active,
}: {
  quality: "lite" | "full";
  /** False once the hero has scrolled away — the renderer parks rather than
      burning frames behind the reader, leaving the bee as the only live one. */
  active: boolean;
}) {
  const router = useRouter();
  const scroll = useRef(0);
  const view = useRef<View>({ zoom: 1, panX: 0, panY: 0 });
  const dragging = useRef(false);
  const anchor = useRef<THREE.Object3D | null>(null);
  const label = useRef<HTMLDivElement>(null);
  const anchors = useRef(new Map<string, THREE.Object3D>());

  const [selected, setSelected] = useState<string | null>(null);
  // How far the pointer travelled since it went down. A drag that happens to
  // finish on a building is steering, not a tap, and must not select it.
  const travel = useRef(0);
  const project = selected
    ? PROJECTS.find((p) => p.slug === selected)
    : undefined;

  // Written straight to the node each frame: a label that followed React
  // state would re-render the whole scene sixty times a second to move a
  // box three pixels.
  const place = useCallback((x: number, y: number) => {
    const el = label.current;
    if (el)
      el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y - 24}px)`;
  }, []);

  const registerAnchor = useCallback(
    (slug: string, object: THREE.Object3D | null) => {
      if (object) anchors.current.set(slug, object);
      else anchors.current.delete(slug);
    },
    [],
  );

  // Tap once to name the building; tap the same one again to open it.
  const handleSelect = useCallback(
    (slug: string) => {
      if (travel.current > 10) return;
      if (selected === slug) {
        router.push(`/work/${slug}`);
        return;
      }
      anchor.current = anchors.current.get(slug) ?? null;
      setSelected(slug);
    },
    [router, selected],
  );

  /* ------------------------------------------------------------- gestures */

  const points = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef(0);
  const zoomAtPinch = useRef(1);

  const clampPan = (value: number) =>
    Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, value));
  const clampZoom = (value: number) =>
    Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, value));

  function onPointerDown(event: React.PointerEvent) {
    points.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    travel.current = 0;

    // A mouse may drag on one button. A finger may not: one finger belongs to
    // the page's scroll, and taking it would strand the reader inside the hero.
    if (points.current.size === 1 && event.pointerType === "mouse") {
      dragging.current = true;
    }
    if (points.current.size === 2) {
      dragging.current = true;
      const [a, b] = [...points.current.values()];
      pinch.current = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAtPinch.current = view.current.zoom;
    }
  }

  function onPointerMove(event: React.PointerEvent) {
    const previous = points.current.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    points.current.set(event.pointerId, next);
    travel.current += Math.hypot(next.x - previous.x, next.y - previous.y);
    if (!dragging.current) return;

    if (points.current.size >= 2) {
      const [a, b] = [...points.current.values()];
      const spread = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current > 0) {
        setZoom(zoomAtPinch.current * (spread / pinch.current));
      }
      return;
    }

    // Zoomed in, the same finger travel should cover less ground.
    const scale = 0.02 / view.current.zoom;
    view.current.panX = clampPan(
      view.current.panX + (next.x - previous.x) * scale,
    );
    view.current.panY = clampPan(
      view.current.panY - (next.y - previous.y) * scale,
    );
  }

  function endPointer(event: React.PointerEvent) {
    points.current.delete(event.pointerId);
    if (points.current.size < 2) pinch.current = 0;
    if (points.current.size === 0) dragging.current = false;
  }

  function onWheel(event: React.WheelEvent) {
    // A plain wheel belongs to the page. Ctrl-wheel is the zoom gesture every
    // map uses, and is what a trackpad pinch already sends.
    if (!event.ctrlKey) return;
    event.preventDefault();
    setZoom(view.current.zoom * (1 - event.deltaY * 0.01));
  }

  // Gestures write to the ref sixty times a second and must not re-render.
  // Anything that lands as a single discrete change also updates this, so the
  // readout on the button always shows the zoom the scene is heading for — and
  // a press that registers is visible even before the city has moved.
  const [shown, setShown] = useState(1);

  const setZoom = (next: number) => {
    view.current.zoom = clampZoom(next);
    setShown(view.current.zoom);
  };

  const stepZoom = (factor: number) => setZoom(view.current.zoom * factor);

  const reset = () => {
    view.current = { zoom: 1, panX: 0, panY: 0 };
    setShown(1);
    setSelected(null);
  };

  // A cursor set on a building must not outlive the scene.
  useEffect(() => () => void (document.body.style.cursor = ""), []);

  return (
    <>
      <div
        className="absolute inset-0"
        // One finger scrolls the page; the browser keeps that gesture.
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={endPointer}
        onWheel={onWheel}
      >
        <Canvas
          orthographic
          // On the (1, 1, 1) diagonal: isometric in the literal sense.
          camera={CAMERA}
          dpr={quality === "lite" ? [1, 1.5] : [1, 2]}
          frameloop={active ? "always" : "never"}
          gl={{ antialias: true, alpha: true }}
          // `flat` turns off tone mapping: the colours on screen are the tokens.
          flat
          style={{ position: "absolute", inset: 0 }}
          onPointerMissed={() => setSelected(null)}
        >
          <Camera />
          <ScrollBinding scrollRef={scroll} />
          <Pin anchor={anchor} place={place} />
          <Town
            scrollRef={scroll}
            viewRef={view}
            draggingRef={dragging}
            selected={selected}
            onSelect={handleSelect}
            registerAnchor={registerAnchor}
          />
        </Canvas>
      </div>

      {/* The label, pinned above whichever building was tapped. */}
      <div
        ref={label}
        className={`pointer-events-none absolute top-0 left-0 z-10 ${
          project ? "" : "hidden"
        }`}
      >
        {project ? (
          <a
            href={`/work/${project.slug}`}
            className="iso-block-sm iso-press pointer-events-auto flex flex-col bg-bg px-3 py-2 text-left"
          >
            <span className="text-[13px] font-bold tracking-tight">
              {project.name}
            </span>
            <span className="text-[11px] text-text-2">{project.kind}</span>
            <span className="mt-1 text-[11px] font-semibold text-iso-sky-text">
              Tap again to open →
            </span>
          </a>
        ) : null}
      </div>

      {/* For anyone who would rather press a button than pinch. */}
      <div className="absolute right-3 bottom-3 z-10 flex gap-1.5 sm:right-4 sm:bottom-4">
        <button
          type="button"
          onClick={() => stepZoom(1 / 1.3)}
          className="iso-block-sm iso-press size-9 bg-bg text-[16px] leading-none font-bold text-text"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => stepZoom(1.3)}
          className="iso-block-sm iso-press size-9 bg-bg text-[16px] leading-none font-bold text-text"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={reset}
          className="iso-block-sm iso-press nums h-9 min-w-[3.75rem] bg-bg px-2 text-[12px] font-semibold text-text"
          aria-label="Reset the view"
        >
          {Math.round(shown * 100)}%
        </button>
      </div>

      {/* A canvas cannot be tabbed into, so the same four destinations exist
          here as ordinary links for keyboard and screen reader users. */}
      <nav className="sr-only" aria-label="Projects in the city">
        <ul>
          {PROJECTS.map((p) => (
            <li key={p.slug}>
              <a href={`/work/${p.slug}`}>{p.name} case study</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
