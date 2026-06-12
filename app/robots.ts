import type { MetadataRoute } from "next";

// Temporary Vercel production URL. Replace with https://nexolocalstudio.com when the custom domain is connected.
const baseUrl = "https://nexo-local-studio.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${baseUrl}/sitemap.xml` };
}
