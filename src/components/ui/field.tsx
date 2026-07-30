import type { ComponentProps, ReactNode } from "react";

const CONTROL =
  "w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3 text-sm text-text placeholder:text-text-3 " +
  "transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-text">{label}</span>
      {children}
      {hint ? <span className="text-xs text-text-3">{hint}</span> : null}
    </label>
  );
}

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input className={`${CONTROL} h-9 ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return <textarea className={`${CONTROL} min-h-24 py-2 ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }: ComponentProps<"select">) {
  return (
    <select className={`${CONTROL} h-9 cursor-pointer pr-8 ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Toggle({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3">
      <span className="min-w-0">
        <span className="block text-[13px] font-medium">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-text-2">{description}</span>
        ) : null}
      </span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="peer sr-only"
        aria-label={label}
      />
      {/* The knob is a descendant, not a sibling, of the checkbox — so the
          checked variant has to reach into it from the track. */}
      <span className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-surface-3 transition-colors peer-checked:bg-accent peer-checked:[&>span]:translate-x-4 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-[var(--shadow-sm)] transition-transform" />
      </span>
    </label>
  );
}
