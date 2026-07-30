"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Store } from "@/lib/types";
import {
  AnalyticsIcon,
  BeeMark,
  ChevronIcon,
  CloseIcon,
  CustomersIcon,
  DiscountsIcon,
  HomeIcon,
  OrdersIcon,
  ProductsIcon,
  SettingsIcon,
  StorefrontIcon,
} from "../icons";

const NAV = [
  { href: "", label: "Home", Icon: HomeIcon },
  { href: "/orders", label: "Orders", Icon: OrdersIcon },
  { href: "/products", label: "Products", Icon: ProductsIcon },
  { href: "/customers", label: "Customers", Icon: CustomersIcon },
  { href: "/analytics", label: "Analytics", Icon: AnalyticsIcon },
  { href: "/discounts", label: "Discounts", Icon: DiscountsIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

/** Shared id: the header's trigger label and the drawer's peer checkbox. */
export const NAV_TOGGLE_ID = "hb-nav-toggle";

/**
 * Renders the fixed desktop rail and the mobile drawer.
 *
 * The drawer is driven by a checkbox in the layout rather than React state, so
 * the trigger can live in the server-rendered header without a shared client
 * context between them.
 */
export function Sidebar({ store, stores }: { store: Store; stores: Store[] }) {
  const pathname = usePathname();
  const base = `/admin/${store.handle}`;

  const body = (
    <div className="flex h-full flex-col gap-4 py-4">
      <StoreSwitcher store={store} stores={stores} />

      <nav className="flex flex-col gap-0.5 px-3">
        {NAV.map(({ href, label, Icon }) => {
          const full = `${base}${href}`;
          const active = href === "" ? pathname === base : pathname.startsWith(full);
          return (
            <Link
              key={label}
              href={full}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-[var(--radius)] px-2.5 py-2 text-[13px] font-medium transition-colors ${
                active
                  ? "bg-accent-soft text-accent-text"
                  : "text-text-2 hover:bg-surface-2 hover:text-text"
              }`}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3">
        <Link
          href={`/store/${store.handle}`}
          className="flex items-center gap-2.5 rounded-[var(--radius)] border border-line px-2.5 py-2 text-[13px] text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
        >
          <StorefrontIcon />
          View storefront
        </Link>
        <p className="mt-3 px-1 text-[11px] text-text-3">
          {store.plan[0].toUpperCase() + store.plan.slice(1)} plan · Hanubees
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-line bg-surface lg:block">
        {body}
      </aside>

      {/* Mobile drawer — hidden until the peer checkbox is checked */}
      <div className="invisible fixed inset-0 z-50 opacity-0 transition-[opacity,visibility] peer-checked:visible peer-checked:opacity-100 peer-checked:[&_[data-panel]]:translate-x-0 lg:hidden">
        <label
          htmlFor={NAV_TOGGLE_ID}
          className="absolute inset-0 bg-black/40"
          aria-label="Close navigation"
        />
        {/* Panel slides in from the checkbox state reached via the overlay above */}
        <div
          data-panel
          className="absolute inset-y-0 left-0 w-64 -translate-x-full border-r border-line bg-surface transition-transform"
        >
          <label
            htmlFor={NAV_TOGGLE_ID}
            className="absolute right-2 top-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-[var(--radius)] text-text-2 hover:bg-surface-2"
            aria-label="Close navigation"
          >
            <CloseIcon />
          </label>
          {body}
        </div>
      </div>
    </>
  );
}

function StoreSwitcher({ store, stores }: { store: Store; stores: Store[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative px-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 rounded-[var(--radius)] border border-line px-2.5 py-2 text-left transition-colors hover:bg-surface-2"
        aria-expanded={open}
      >
        <span className="text-accent">
          <BeeMark className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold">{store.name}</span>
          <span className="block truncate text-[11px] text-text-3">
            {store.customDomain ?? `${store.handle}.hanubees.com`}
          </span>
        </span>
        <ChevronIcon
          className={`size-4 shrink-0 text-text-3 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open ? (
        <div className="absolute left-3 right-3 top-full z-20 mt-1 overflow-hidden rounded-[var(--radius)] border border-line bg-surface shadow-[var(--shadow-lg)]">
          {stores.map((s) => (
            <Link
              key={s.id}
              href={`/admin/${s.handle}`}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 text-[13px] transition-colors hover:bg-surface-2 ${
                s.id === store.id ? "text-accent-text" : "text-text-2"
              }`}
            >
              {s.name}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="block border-t border-line px-3 py-2 text-[13px] text-text-2 transition-colors hover:bg-surface-2"
          >
            All stores
          </Link>
        </div>
      ) : null}
    </div>
  );
}
