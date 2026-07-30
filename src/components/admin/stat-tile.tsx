import { Sparkline, type Point } from "../charts";
import { ArrowDownIcon, ArrowUpIcon } from "../icons";
import { delta } from "@/lib/format";

/**
 * A headline number is a stat tile, not a one-bar chart. The change carries an
 * arrow glyph as well as a colour, so direction survives colour-blindness and
 * greyscale printing.
 */
export function StatTile({
  label,
  value,
  change,
  series,
  /** Set when a fall is the good outcome (refunds, cart abandonment). */
  invert = false,
}: {
  label: string;
  value: string;
  change?: number;
  series?: Point[];
  invert?: boolean;
}) {
  const up = (change ?? 0) >= 0;
  const good = invert ? !up : up;

  return (
    <div className="rounded-[var(--radius)] border border-line bg-surface p-4 shadow-[var(--shadow-sm)]">
      <p className="text-[13px] text-text-2">{label}</p>
      <p className="nums mt-1.5 text-2xl font-semibold tracking-tight">{value}</p>

      {change !== undefined ? (
        <p
          className="mt-1 flex items-center gap-1 text-xs font-medium"
          style={{ color: good ? "var(--success)" : "var(--danger)" }}
        >
          {up ? (
            <ArrowUpIcon className="size-3.5" />
          ) : (
            <ArrowDownIcon className="size-3.5" />
          )}
          <span className="nums">{delta(change)}</span>
          <span className="font-normal text-text-3">vs last 30 days</span>
        </p>
      ) : null}

      {series ? (
        <div className="mt-3">
          <Sparkline data={series} />
        </div>
      ) : null}
    </div>
  );
}
