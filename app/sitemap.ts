import type { MetadataRoute } from "next";
import { getAllChatAgentSlugs } from "@/data/chatAgentConfigs";
import { landingConfigs } from "@/data/landingConfigs";

// Production domain placeholder. Replace after connecting the final domain in Vercel.
const baseUrl = "https://nexolocalstudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "monthly" as const, priority: 1 },
    { url: `${baseUrl}/demos`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    ...landingConfigs.map((demo) => ({ url: `${baseUrl}/demos/${demo.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${baseUrl}/chat-agent`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/chat-agent/demos`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/chat-agent/embed-demo`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    ...getAllChatAgentSlugs().map((slug) => ({ url: `${baseUrl}/chat-agent/demos/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }))
  ];
}
