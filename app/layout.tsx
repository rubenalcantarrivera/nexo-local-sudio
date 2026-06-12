import type { Metadata } from "next";
import "./globals.css";

// Production domain placeholder. Replace after connecting the final domain in Vercel.
const siteUrl = "https://nexolocalstudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexo Local Studio | Landing pages para negocios locales",
    template: "%s | Nexo Local Studio"
  },
  description: "Landing pages premium, mobile-first y conectadas a WhatsApp para negocios locales en México y LATAM.",
  keywords: ["landing pages", "negocios locales", "WhatsApp", "SEO local", "páginas web para negocios"],
  openGraph: {
    title: "Nexo Local Studio",
    description: "Landing pages rápidas, claras y orientadas a contacto para negocios locales.",
    type: "website",
    locale: "es_MX",
    siteName: "Nexo Local Studio"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans">{children}</body>
    </html>
  );
}
