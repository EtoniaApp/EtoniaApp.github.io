import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://etonia.io";
  return ["/", "/support/", "/privacy/", "/terms/"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: p === "/" ? "weekly" : "monthly",
    priority: p === "/" ? 1 : 0.5,
  }));
}
