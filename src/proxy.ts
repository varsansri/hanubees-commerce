import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Tenant resolution.
 *
 * `acme.hanubees.com/...` is rewritten to `/store/acme/...` so the storefront
 * routes stay ordinary path segments. The apex and `www` serve the marketing
 * site; `admin.` is reserved for the merchant dashboard.
 *
 * Vercel needs a wildcard domain (`*.hanubees.com`) attached to the project for
 * this to receive traffic — the rewrite alone is not enough.
 */

const ROOT_DOMAIN = "hanubees.com";

/** Subdomains that are the platform itself, never a merchant store. */
const RESERVED = new Set(["www", "admin", "api", "app", "assets", "cdn", "shop"]);

function tenantFrom(host: string): string | null {
  const hostname = host.split(":")[0].toLowerCase();

  // Local development: acme.localhost:3000
  if (hostname.endsWith(".localhost")) {
    const label = hostname.replace(".localhost", "");
    return RESERVED.has(label) ? null : label;
  }

  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) return null;

  const label = hostname.slice(0, -(ROOT_DOMAIN.length + 1));
  // Only single-label subdomains are tenants; ignore deeper nesting.
  if (!label || label.includes(".") || RESERVED.has(label)) return null;

  return label;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const tenant = tenantFrom(host);
  if (!tenant) return NextResponse.next();

  const { pathname, search } = request.nextUrl;

  // Already-rewritten paths and the admin pass through untouched.
  if (pathname.startsWith("/store/") || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/store/${tenant}${pathname === "/" ? "" : pathname}`;
  url.search = search;

  return NextResponse.rewrite(url);
}

export const config = {
  // Skip static assets and image optimisation — nothing to rewrite there.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
};
