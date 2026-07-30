import type { ReactNode } from "react";

export type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-text-2 border-line",
  success: "bg-success-soft text-success border-transparent",
  warning: "bg-warning-soft text-warning border-transparent",
  danger: "bg-danger-soft text-danger border-transparent",
  info: "bg-info-soft text-info border-transparent",
  accent: "bg-accent-soft text-accent-text border-accent-border",
};

export function Badge({
  tone = "neutral",
  children,
  dot = false,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-5 ${TONES[tone]}`}
    >
      {dot ? (
        <span className="size-1.5 rounded-full bg-current opacity-80" />
      ) : null}
      {children}
    </span>
  );
}

/* Status vocabularies live next to the badge so tone choices stay consistent
   across every table and detail page. */

export const PAYMENT_TONE: Record<string, Tone> = {
  paid: "success",
  pending: "warning",
  refunded: "neutral",
  partially_refunded: "neutral",
};

export const FULFILLMENT_TONE: Record<string, Tone> = {
  fulfilled: "success",
  unfulfilled: "warning",
  partial: "info",
};

export const PRODUCT_TONE: Record<string, Tone> = {
  active: "success",
  draft: "neutral",
  archived: "neutral",
};

export const DISCOUNT_TONE: Record<string, Tone> = {
  active: "success",
  scheduled: "info",
  expired: "neutral",
};

export function label(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
