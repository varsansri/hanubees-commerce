import type { MetadataRoute } from "next";
import { PROJECTS, SERVICES, SITE } from "@/lib/site";

/**
 * The company site only. Storefronts live on their own subdomains and get their
 * own sitemaps; the admin is behind a login and has no business being indexed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  });

  return [
    page("", 1),
    page("/services", 0.9),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.8)),
    page("/work", 0.9),
    ...PROJECTS.map((p) => page(`/work/${p.slug}`, 0.7)),
    page("/process", 0.7),
    page("/about", 0.7),
    page("/contact", 0.9),
    page("/commerce", 0.6),
    page("/privacy", 0.3),
    page("/terms", 0.3),
  ];
}
