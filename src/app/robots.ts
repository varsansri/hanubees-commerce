import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Merchant admin and the login screen: nothing to index, and indexing
        // them only surfaces a sign-in page in search results.
        disallow: ["/admin", "/admin/", "/login"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
