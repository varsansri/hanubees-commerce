import type { ReactNode } from "react";

/**
 * Table primitives. Wide tables scroll inside their own container so the page
 * body never scrolls sideways on a phone.
 */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-line bg-surface shadow-[var(--shadow-sm)]">
      {children}
    </div>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return <table className="w-full min-w-[640px] border-collapse text-sm">{children}</table>;
}

export function Th({
  children,
  align = "left",
  className = "",
}: {
  children?: ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  return (
    <th
      className={`border-b border-line px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-text-3 ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"
      } ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  align = "left",
  className = "",
}: {
  children?: ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  return (
    <td
      className={`border-b border-line px-4 py-3 align-middle ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"
      } ${className}`}
    >
      {children}
    </td>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="transition-colors last:[&>td]:border-0 hover:bg-surface-2">{children}</tr>;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-surface-2 text-lg">
        ◦
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-sm text-[13px] text-text-2">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
