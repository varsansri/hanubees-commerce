import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CartIcon, SearchIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { getStore } from "@/lib/data";

/**
 * Storefront chrome. The merchant's accent is injected as a scoped custom
 * property, so every storefront reuses the same components while looking like
 * its own brand — admin chrome keeps the Hanubees honey regardless.
 */
export default async function StorefrontLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const store = await getStore(handle);
  if (!store) notFound();

  const base = `/store/${store.handle}`;

  return (
    <div
      className="flex min-h-full flex-col"
      style={{ ["--accent" as string]: store.theme.accent }}
    >
      <div className="bg-text px-4 py-2 text-center text-[12px] text-text-inverse">
        Free shipping on orders over ₹5,000 · Ships across India
      </div>

      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link href={base} className="min-w-0">
            <span className="block truncate text-[15px] font-semibold tracking-tight">
              {store.name}
            </span>
            <span className="hidden truncate text-[11px] text-text-3 sm:block">
              {store.tagline}
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-5 text-[13px] text-text-2 md:flex">
            <Link href={base} className="transition-colors hover:text-text">
              Shop all
            </Link>
            <Link href={`${base}#new`} className="transition-colors hover:text-text">
              New in
            </Link>
            <Link href={`${base}#about`} className="transition-colors hover:text-text">
              About
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              className="inline-flex size-9 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <ThemeToggle />
            <Link
              href={`${base}/cart`}
              className="inline-flex size-9 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
              aria-label="Cart"
            >
              <CartIcon />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
          <div>
            <p className="text-[15px] font-semibold tracking-tight">{store.name}</p>
            <p className="mt-1 max-w-xs text-[13px] text-text-2">{store.tagline}</p>
          </div>
          <div className="text-[13px]">
            <p className="font-medium">Help</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-text-2">
              <li>Shipping &amp; returns</li>
              <li>Track an order</li>
              <li>Contact us</li>
            </ul>
          </div>
          <div className="text-[13px]">
            <p className="font-medium">Stay in touch</p>
            <form className="mt-2 flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="h-9 min-w-0 flex-1 rounded-[var(--radius)] border border-line-strong bg-surface px-3 text-sm placeholder:text-text-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
              <button
                type="button"
                className="h-9 shrink-0 rounded-[var(--radius)] bg-accent px-3 text-sm font-medium text-white"
              >
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-[12px] text-text-3">
            <span>
              © {new Date().getFullYear()} {store.name}
            </span>
            <span>
              Powered by{" "}
              <Link href="/" className="text-text-2 hover:text-text">
                Hanubees
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
