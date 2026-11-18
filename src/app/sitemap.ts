import type { MetadataRoute } from "next";
import { COUNTRIES } from "@/lib/countries";
import { SITE } from "@/lib/site";
import { TOP_ROUTES } from "@/lib/visa";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = ["", "/visa", "/countries", "/agent", "/pricing", "/about"].map((p) => ({ url: `${SITE.url}${p}`, lastModified: now }));
  return [
    ...base,
    ...TOP_ROUTES.map((r) => ({ url: `${SITE.url}/visa/${r}`, lastModified: now })),
    ...COUNTRIES.map((c) => ({ url: `${SITE.url}/countries/${c.slug}`, lastModified: now })),
  ];
}
