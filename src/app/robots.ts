import type { MetadataRoute } from "next";
import { APP } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/profile", "/trips", "/start"] }], sitemap: `${APP.url}/sitemap.xml` };
}
