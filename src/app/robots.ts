import type { MetadataRoute } from "next";
import { APP } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/profile", "/trips", "/setup", "/auth", "/welcome", "/map", "/pocket", "/safety", "/move", "/join"] }], sitemap: `${APP.url}/sitemap.xml` };
}
