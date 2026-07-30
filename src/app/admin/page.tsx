import Link from "next/link";
import { BeeMark } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { getMetrics, listStores } from "@/lib/data";
import { money, number } from "@/lib/format";

export const metadata = { title: "Your stores" };

export default async function AdminIndex() {
  const stores = await listStores();
  const withMetrics = await Promise.all(
    stores.map(async (s) => ({ store: s, metrics: await getMetrics(s.id) })),
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-accent">
          <BeeMark className="size-7" />
          <span className="text-[15px] font-semibold tracking-tight text-text">
            Hanubees
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <h1 className="mt-10 text-2xl font-semibold tracking-tight">Your stores</h1>
      <p className="mt-1 text-sm text-text-2">
        Pick a store to open its admin, or start a new one.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {withMetrics.map(({ store, metrics }) => (
          <li key={store.id}>
            <Link
              href={`/admin/${store.handle}`}
              className="flex items-center gap-4 rounded-[var(--radius)] border border-line bg-surface p-4 shadow-[var(--shadow-sm)] transition-colors hover:border-line-strong hover:bg-surface-2"
            >
              <span
                className="size-11 shrink-0 rounded-[var(--radius)] border border-line"
                style={{ background: store.theme.heroImage }}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate font-medium">{store.name}</span>
                  <Badge tone="accent">{store.plan}</Badge>
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-text-3">
                  {store.customDomain ?? `${store.handle}.hanubees.com`}
                </span>
              </span>
              <span className="hidden shrink-0 text-right sm:block">
                <span className="nums block text-sm font-medium">
                  {money(metrics.revenue.value, store.currency)}
                </span>
                <span className="block text-xs text-text-3">
                  {number(metrics.orders.value)} orders · 30d
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/"
        className="mt-3 flex items-center justify-center rounded-[var(--radius)] border border-dashed border-line px-4 py-4 text-[13px] text-text-2 transition-colors hover:border-line-strong hover:text-text"
      >
        + Create a new store
      </Link>
    </div>
  );
}
