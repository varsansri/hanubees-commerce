import type { Currency } from "./types";

const SYMBOLS: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const LOCALES: Record<Currency, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

/** Money is stored in minor units (paise/cents) everywhere. */
export function money(minor: number, currency: Currency = "INR"): string {
  return new Intl.NumberFormat(LOCALES[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: minor % 100 === 0 ? 0 : 2,
  }).format(minor / 100);
}

/** Compact form for stat tiles, where column width is tight. */
export function moneyCompact(minor: number, currency: Currency = "INR"): string {
  const major = minor / 100;
  const s = SYMBOLS[currency];
  if (major >= 10_000_000) return `${s}${(major / 10_000_000).toFixed(2)}Cr`;
  if (major >= 100_000) return `${s}${(major / 100_000).toFixed(2)}L`;
  if (major >= 1_000) return `${s}${(major / 1_000).toFixed(1)}k`;
  return `${s}${major.toFixed(0)}`;
}

export function number(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function percent(fraction: number, digits = 1): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

/** Signed change, e.g. "+12.4%" — pairs with an up/down colour. */
export function delta(fraction: number): string {
  const sign = fraction > 0 ? "+" : "";
  return `${sign}${(fraction * 100).toFixed(1)}%`;
}

export function date(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function dateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date(iso);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}
