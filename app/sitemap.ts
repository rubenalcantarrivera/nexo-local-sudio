import type { MetadataRoute } from "next";
import { landingConfigs } from "@/data/landingConfigs";

// Production domain placeholder. Replace after connecting the final domain in Vercel.
const baseUrl = "https://nexolocalstudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "monthly" as const, priority: 1 },
    { url: `${baseUrl}/demos`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    ...landingConfigs.map((demo) => ({ url: `${baseUrl}/demos/${demo.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 }))
  ];
}
