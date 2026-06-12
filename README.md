# Nexo Local Studio — Landing Page Demo System

Reusable Next.js application for creating premium mobile-first landing pages for local businesses from TypeScript configuration files.

## Brand identity

- **Name:** Nexo Local Studio
- **Tagline:** Convertimos búsquedas locales en mensajes, citas y cotizaciones.
- **Positioning:** Landing pages y sistemas de captación por WhatsApp para negocios locales.
- **Tone:** premium, sober, direct, local-business focused.
- **Palette:** `#F8F5EF`, `#1F2933`, `#667085`, `#183B56`, `#B88A44`, `#EFE3D0`, `#FFFFFF`, `#E5E0D8`
- **Typography:** system sans stack for body and Georgia/Cambria stack for editorial headings. This avoids external font fetches during build.

## Included routes

- `/`
- `/demos`
- `/demos/optica`
- `/demos/dental`
- `/demos/estetica`
- `/demos/fisioterapia`
- `/demos/psicologia`
- `/demos/nutricion`
- `/demos/abogado-migratorio`
- `/demos/arquitectura`
- `/demos/restaurante`
- `/demos/academia-idiomas`
- `/demos/veterinaria`

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React
- No paid dependencies
- No backend required

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## File structure

```text
nexo-local-studio/
├── app/
│   ├── demos/
│   │   ├── [slug]/page.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── AgencyCTA.tsx
│   ├── AuditBanner.tsx
│   ├── BenefitsGrid.tsx
│   ├── ButtonLink.tsx
│   ├── ContactForm.tsx
│   ├── DemoCard.tsx
│   ├── FAQ.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── LandingPage.tsx
│   ├── LocationSection.tsx
│   ├── PricingCards.tsx
│   ├── ProcessSteps.tsx
│   ├── SectionHeader.tsx
│   ├── ServicesGrid.tsx
│   ├── Testimonials.tsx
│   ├── TrustBar.tsx
│   └── WhatsAppStickyButton.tsx
├── data/
│   ├── agency.ts
│   ├── landingConfigs.ts
│   └── types.ts
├── lib/
│   ├── utils.ts
│   └── whatsapp.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## How the landing engine works

Every demo is defined in `data/landingConfigs.ts` using the `LandingConfig` type in `data/types.ts`. The route `/demos/[slug]` uses `generateStaticParams()` to create one page per config and `generateMetadata()` to set SEO metadata per landing page.

## Add a new niche demo

1. Open `data/landingConfigs.ts`.
2. Duplicate one existing config object.
3. Change `slug`, `niche`, `businessName`, `tagline`, `location`, `phone`, `whatsappMessage` and `seo`.
4. Replace `services`, `benefits`, `testimonials`, `faqs` and `locationSection`.
5. Optionally change `colors.primary` and `colors.accent`.
6. Visit `/demos/your-new-slug`.

No route file is needed for each demo.

## Add a new client demo in 10 minutes

1. Pick the closest niche demo from `/demos`.
2. Duplicate its object in `data/landingConfigs.ts`.
3. Set `slug`, for example `clinica-aurora`.
4. Replace:
   - `businessName`
   - `location`
   - `phone`
   - `whatsappMessage`
   - `hero.headline`
   - `hero.subheadline`
   - `services`
   - `benefits`
   - `locationSection.address`
5. Replace SEO fields:
   - `seo.title`
   - `seo.description`
   - `seo.keywords`
6. Use the map helper:

```ts
mapEmbed("Clínica Aurora Guadalajara")
```

7. Run locally and open:

```text
/demos/clinica-aurora
```

## Customize for a real client

Replace all demo content with verified data:

- Legal business name
- Real services
- Address or service area
- Real phone number with country code
- Real WhatsApp message
- Real testimonials or Google reviews with permission
- Real map embed
- Accurate disclaimers for legal, health, psychology, nutrition, veterinary or medical-adjacent niches

Avoid overclaims. Do not guarantee medical outcomes, legal outcomes, SEO rankings, leads or sales.

## Change WhatsApp number

Each demo has its own `phone` field:

```ts
phone: "525500000001"
```

Use international format without symbols:

```text
52 + area code + number
```

Example for Mexico:

```text
525512345678
```

The link is generated in `lib/whatsapp.ts`:

```ts
https://wa.me/[phone]?text=[encoded message]
```

Change the default agency WhatsApp in `data/agency.ts`.

## Update SEO metadata

- Agency homepage metadata: `app/page.tsx`
- Demos index metadata: `app/demos/page.tsx`
- Individual demo metadata: `data/landingConfigs.ts`

## Contact form

The contact form is UI-only by default. In `components/ContactForm.tsx`, replace the form action with Formspree, HubSpot, Make, Zapier, a custom API route or a CRM endpoint. Change the button from `type="button"` to `type="submit"` after connecting an endpoint.

## Deploy to Vercel

1. Push the project to GitHub.
2. Create a new project in Vercel.
3. Select the repository.
4. Keep framework preset as Next.js.
5. Build command: `npm run build`.
6. Leave output directory as default.
7. Deploy.
8. Add your custom domain.
9. Update `metadataBase` in `app/layout.tsx` and `baseUrl` in `app/sitemap.ts`.

## Suggested next improvements

- Add real image support with `next/image` and per-demo photo config.
- Add Open Graph images per niche.
- Add analytics events for WhatsApp clicks, phone clicks and form interactions.
- Add a real Formspree or CRM integration.
- Add a `ClientConfig` template file for fast prospect demos.
- Add a “client mode” toggle to hide the `AuditBanner` when sending demos to real prospects.
