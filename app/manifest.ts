import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Etonia",
    short_name: "Etonia",
    description: "Handwritten notes that think with you.",
    start_url: "/",
    display: "browser",
    background_color: "#faf9f7",
    theme_color: "#7761a5",
    icons: [
      { src: "/brand/etonia-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/etonia-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
