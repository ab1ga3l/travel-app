import type { MetadataRoute } from "next";
import { COUNTRIES } from "@/lib/countries";
import { GEMS } from "@/lib/gems";
import { APP } from "@/lib/site";

const FROM = ["ng", "gh", "ke", "za", "ug", "cm", "et", "eg", "zw", "sn"];
const TO = ["fr", "de", "es", "it", "pt", "nl", "gb", "us", "ca", "ae", "tr", "th", "rw", "ke"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (p: string) => ({ url: `${APP.url}${p}`, lastModified: now });
  return [
    ...["", "/discover", "/visa", "/community", "/deals", "/about", "/partners"].map(u),
    ...COUNTRIES.map((c) => u(`/discover/${c.slug}`)),
    ...GEMS.map((g) => u(`/gems/${g.id}`)),
    ...FROM.flatMap((f) => TO.filter((t) => t !== f).map((t) => u(`/visa/${f}/${t}`))),
  ];
}
