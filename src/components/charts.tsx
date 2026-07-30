"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* --------------------------------------------------------------------------
   Charts.

   Every chart here plots ONE measure, so color does no identity work: marks are
   a single honey hue (validated >= 3:1 against both the light and dark chart
   surface) and magnitude is carried by length or position. Deltas are the only
   place status color appears, and they always ship an arrow glyph alongside so
   the meaning never rests on color alone.
   -------------------------------------------------------------------------- */

export interface Point {
  date: string;
  value: number;
}

/* ---------------------------------------------------------------- sparkline */

/** Axis-free trend line for stat tiles. No text, so it scales without distortion. */
export function Sparkline({ data, className = "" }: { data: Point[]; className?: string }) {
  if (data.length < 2) return null;

  const w = 100;
  const h = 28;
  const max = Math.max(...data.map((d) => d.value), 1);
  const step = w / (data.length - 1);
  const y = (v: number) => h - 2 - (v / max) * (h - 4);

  const line = data.map((d, i) => `${i * step},${y(d.value)}`).join(" ");
  const area = `M0,${h} L${line.replace(/ /g, " L")} L${w},${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={`h-7 w-full ${className}`}
      aria-hidden
    >
      <path d={area} fill="var(--accent)" opacity="0.1" />
      <polyline
        points={line}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ------------------------------------------------------------- area + hover */

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width] as const;
}

/**
 * Single-series trend with a crosshair + tooltip. An HTML chart is interactive
 * by default, so the hover layer ships with it rather than as an enhancement.
 */
export function TrendChart({
  data,
  formatValue,
  height = 260,
}: {
  data: Point[];
  formatValue: (v: number) => string;
  height?: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const pad = { top: 16, right: 8, bottom: 28, left: 56 };
  const plotW = Math.max(width - pad.left - pad.right, 10);
  const plotH = height - pad.top - pad.bottom;

  const max = Math.max(...data.map((d) => d.value), 1);
  // Round the axis top to something a person would choose.
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const niceMax = Math.ceil(max / magnitude) * magnitude;

  const x = (i: number) => (i / Math.max(data.length - 1, 1)) * plotW;
  const y = (v: number) => plotH - (v / niceMax) * plotH;

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = e.clientX - rect.left - pad.left;
      const idx = Math.round((px / plotW) * (data.length - 1));
      setHover(idx >= 0 && idx < data.length ? idx : null);
    },
    [data.length, plotW, pad.left],
  );

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");
  const areaPath = `${linePath} L${x(data.length - 1)},${plotH} L0,${plotH} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => niceMax * t);
  const active = hover !== null ? data[hover] : null;

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height }}
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      {width > 0 ? (
        <svg width={width} height={height} role="img" aria-label="Revenue over time">
          <g transform={`translate(${pad.left},${pad.top})`}>
            {/* Recessive horizontal grid only — no vertical rules */}
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={0}
                  x2={plotW}
                  y1={y(t)}
                  y2={y(t)}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                <text
                  x={-10}
                  y={y(t)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="var(--text-3)"
                  fontSize={11}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {formatValue(t)}
                </text>
              </g>
            ))}

            <path d={areaPath} fill="var(--accent)" opacity={0.12} />
            <path
              d={linePath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Date labels: first, middle, last — enough to orient, no collisions */}
            {[0, Math.floor(data.length / 2), data.length - 1].map((i) => (
              <text
                key={i}
                x={x(i)}
                y={plotH + 18}
                textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
                fill="var(--text-3)"
                fontSize={11}
              >
                {new Date(data[i].date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </text>
            ))}

            {active && hover !== null ? (
              <g>
                <line
                  x1={x(hover)}
                  x2={x(hover)}
                  y1={0}
                  y2={plotH}
                  stroke="var(--border-strong)"
                  strokeWidth={1}
                />
                {/* 2px surface ring keeps the marker readable over the area fill */}
                <circle
                  cx={x(hover)}
                  cy={y(active.value)}
                  r={5}
                  fill="var(--accent)"
                  stroke="var(--surface)"
                  strokeWidth={2}
                />
              </g>
            ) : null}
          </g>
        </svg>
      ) : null}

      {active && hover !== null ? (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-[var(--radius)] border border-line bg-surface px-2.5 py-1.5 text-xs shadow-[var(--shadow-lg)]"
          style={{
            left: Math.min(Math.max(pad.left + x(hover), 60), width - 60),
            top: pad.top + y(active.value) - 52,
          }}
        >
          <div className="text-text-3">
            {new Date(active.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </div>
          <div className="nums font-semibold">{formatValue(active.value)}</div>
        </div>
      ) : null}
    </div>
  );
}

/* ----------------------------------------------------------------- bar list */

export interface BarItem {
  label: string;
  value: number;
  /** Rendered at the row end — the direct label. */
  display: string;
  meta?: string;
}

/**
 * Horizontal bars in HTML rather than SVG: text stays crisp and selectable, the
 * layout is responsive for free, and every row is directly labelled.
 */
export function BarList({ items }: { items: BarItem[] }) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="group">
          <div className="flex items-baseline justify-between gap-4 text-[13px]">
            <span className="truncate text-text">{item.label}</span>
            <span className="nums shrink-0 font-medium text-text">{item.display}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${Math.max((item.value / max) * 100, 2)}%` }}
              />
            </div>
            {item.meta ? (
              <span className="nums w-14 shrink-0 text-right text-[11px] text-text-3">
                {item.meta}
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
