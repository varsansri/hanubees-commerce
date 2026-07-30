import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { NAV_TOGGLE_ID, Sidebar } from "@/components/admin/sidebar";
import { MenuIcon, SearchIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { getStore, listStores } from "@/lib/data";
import { initials } from "@/lib/format";

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ store: string }>;
}) {
  const { store: handle } = await params;
  const [store, stores] = await Promise.all([getStore(handle), listStores()]);
  if (!store) notFound();

  return (
    <div className="min-h-full lg:pl-60">
      {/* Drives the mobile drawer; the trigger below is its label. */}
      <input id={NAV_TOGGLE_ID} type="checkbox" className="peer sr-only" />
      <Sidebar store={store} stores={stores} />

      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-bg/85 px-4 backdrop-blur-sm lg:px-6">
        <label
          htmlFor={NAV_TOGGLE_ID}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-[var(--radius)] text-text-2 transition-colors hover:bg-surface-2 hover:text-text lg:hidden"
          aria-label="Open navigation"
        >
          <MenuIcon />
        </label>

        <label className="relative max-w-md flex-1">
          <span className="sr-only">Search this store</span>
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-text-3" />
          <input
            placeholder="Search orders, products, customers"
            className="h-9 w-full rounded-[var(--radius)] border border-line bg-surface pl-8 pr-3 text-sm placeholder:text-text-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
          />
        </label>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <span
            className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-text"
            title={store.name}
          >
            {initials(store.name)}
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:px-6">
        {children}
      </main>
    </div>
  );
}
