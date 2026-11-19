import type { MetadataRoute } from "next";
import { APP } from "@/lib/site";

// Lets people "Add to Home Screen" and use Aviora like an app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP.name,
    short_name: APP.name,
    description: APP.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0b1026",
    theme_color: "#0b1026",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
