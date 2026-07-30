import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-white border-transparent hover:bg-accent-hover shadow-[var(--shadow-sm)]",
  secondary:
    "bg-surface text-text border-line-strong hover:bg-surface-2 shadow-[var(--shadow-sm)]",
  ghost: "bg-transparent text-text-2 border-transparent hover:bg-surface-2 hover:text-text",
  danger: "bg-danger text-white border-transparent hover:opacity-90",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
};

function classes(variant: Variant, size: Size, className?: string) {
  return [
    "inline-flex items-center justify-center rounded-[var(--radius)] border font-medium",
    "transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    VARIANTS[variant],
    SIZES[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

interface Common {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}: Common & ComponentProps<"button">) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={classes(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
