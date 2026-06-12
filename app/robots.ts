import type { MetadataRoute } from "next";

// Production domain placeholder. Replace after connecting the final domain in Vercel.
const baseUrl = "https://nexolocalstudio.com";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${baseUrl}/sitemap.xml` };
}
