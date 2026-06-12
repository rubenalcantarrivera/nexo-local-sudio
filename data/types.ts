export type LandingConfig = {
  slug: string;
  niche: string;
  businessName: string;
  tagline: string;
  location: string;
  phone: string;
  whatsappMessage: string;
  seo: { title: string; description: string; keywords: string[] };
  hero: { eyebrow: string; headline: string; subheadline: string; primaryCta: string; secondaryCta: string };
  trust: string[];
  services: { title: string; description: string }[];
  benefits: { title: string; description: string }[];
  process: { step: string; title: string; description: string }[];
  testimonials: { quote: string; name: string; detail: string }[];
  faqs: { question: string; answer: string }[];
  locationSection: { title: string; description: string; address: string; mapEmbedUrl?: string };
  colors?: { primary: string; accent: string };
};

export type Package = { name: string; price: string; description: string; includes: string[]; highlighted?: boolean };
