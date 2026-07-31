import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Tenant resolution and session refresh.
 *
 * Two jobs on every request:
 *
 * 1. `acme.hanubees.com/x` is rewritten to `/store/acme/x`, so storefront
 *    routes stay ordinary path segments. Vercel needs `*.hanubees.com`
 *    attached to the project for this to receive traffic.
 * 2. The Supabase session cookie is refreshed. Without this the access token
 *    expires mid-session and Server Components start seeing a signed-out user.
 *
 * The `/admin` gate here is a cheap redirect for signed-out visitors, not the
 * security boundary. The real boundary is Row Level Security in Postgres: even
 * with a forged cookie, a user's queries only ever return their own rows.
 */

const ROOT_DOMAIN = "hanubees.com";
const RESERVED = new Set(["www", "admin", "api", "app", "assets", "cdn", "shop"]);

function tenantFrom(host: string): string | null {
  const hostname = host.split(":")[0].toLowerCase();
  if (hostname.endsWith(".localhost")) {
    const label = hostname.replace(".localhost", "");
    return RESERVED.has(label) ? null : label;
  }
  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) return null;
  const label = hostname.slice(0, -(ROOT_DOMAIN.length + 1));
  if (!label || label.includes(".") || RESERVED.has(label)) return null;
  return label;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(toSet) {
          for (const { name, value } of toSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of toSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    });

    // Touching getUser() is what performs the refresh — do not remove it.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    if (!user && pathname.startsWith("/admin")) {
      const to = request.nextUrl.clone();
      to.pathname = "/login";
      to.searchParams.set("next", pathname);
      return NextResponse.redirect(to);
    }
    if (user && pathname === "/login") {
      const to = request.nextUrl.clone();
      to.pathname = "/admin";
      to.search = "";
      return NextResponse.redirect(to);
    }
  }

  const tenant = tenantFrom(request.headers.get("host") ?? "");
  if (!tenant) return response;

  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/store/") || pathname.startsWith("/admin")) return response;

  const rewritten = request.nextUrl.clone();
  rewritten.pathname = `/store/${tenant}${pathname === "/" ? "" : pathname}`;
  rewritten.search = search;
  return NextResponse.rewrite(rewritten);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
};
