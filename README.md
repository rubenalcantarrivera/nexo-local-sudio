# Nexo Local Studio - Sistema de páginas web de ejemplo

Aplicación Next.js para crear páginas web profesionales, adaptables a celular y conectadas a WhatsApp para negocios locales.

## Brand identity

- **Name:** Nexo Local Studio
- **Tagline:** Convertimos búsquedas locales en mensajes, citas y cotizaciones.
- **Positioning:** Páginas web profesionales para negocios locales, conectadas a WhatsApp.
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

## Precios de lanzamiento

- **Página Local Inicial:** $2,500 MXN
- **Página Local Plus:** $4,500 MXN
- **Página Local Premium:** $6,500 MXN

Estos precios son de lanzamiento para los primeros proyectos de Nexo Local Studio. El precio final puede variar según alcance, materiales e integraciones requeridas.

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

## How the page system works

Cada ejemplo se define en `data/landingConfigs.ts` usando el tipo `LandingConfig` de `data/types.ts`. La ruta `/demos/[slug]` usa `generateStaticParams()` para crear una página por configuración y `generateMetadata()` para definir metadata SEO por página web.

## Agregar un nuevo ejemplo por nicho

1. Open `data/landingConfigs.ts`.
2. Duplicate one existing config object.
3. Change `slug`, `niche`, `businessName`, `tagline`, `location`, `phone`, `whatsappMessage` and `seo`.
4. Replace `services`, `benefits`, `testimonials`, `faqs` and `locationSection`.
5. Optionally change `colors.primary` and `colors.accent`.
6. Visit `/demos/your-new-slug`.

No necesitas crear un archivo de ruta por cada ejemplo.

## Agregar un ejemplo para cliente en 10 minutos

1. Elige el ejemplo de nicho más cercano desde `/demos`.
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

Reemplaza todo el contenido de ejemplo con datos verificados:

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

Cada ejemplo tiene su propio campo `phone`:

```ts
phone: "525545609027"
```

Use international format without symbols:

```text
52 + area code + number
```

Example for Mexico:

```text
525545609027
```

The link is generated in `lib/whatsapp.ts`:

```ts
https://wa.me/[phone]?text=[encoded message]
```

Change the default agency WhatsApp in `data/agency.ts`.

## Update SEO metadata

- Agency homepage metadata: `app/page.tsx`
- Metadata de la galería de ejemplos: `app/demos/page.tsx`
- Metadata de cada ejemplo individual: `data/landingConfigs.ts`

## Logo system

The Nexo Local Studio logo lives in `components/Logo.tsx`.

- `LogoMark` renders the abstract geometric N route mark.
- `LogoWordmark` renders the typographic wordmark.
- `Logo` combines mark and wordmark for header/footer usage.
- `app/icon.svg` is the favicon/icon version.

Edit the SVG paths and colors in `components/Logo.tsx` if the brand mark evolves. Keep client demo pages white-label: do not render the Nexo logo inside `/demos/[slug]` by default.

## Image system

Images are committed locally under:

```text
public/images/agency/
public/images/demos/
```

Las referencias de imagen viven en `data/landingConfigs.ts` dentro del mapa `demoVisuals`. Esto evita pérdida de imágenes en Vercel por archivos no incluidos, URLs remotas fallidas o dominios no configurados en `next/image`.

Before publishing a real client page:

- Replace local stock `.jpg` images with real client photography.
- Keep image files inside `public/images/...`.
- Update `src` and `alt` in `data/landingConfigs.ts`.
- Check desktop and mobile crops.
- Run `npm run build` before deployment.

Use normal `<img>` tags for this project unless there is a clear reason to switch to `next/image`. If switching to `next/image`, configure `next.config.mjs` remote patterns and verify production rendering.

## Visual system

The visual system uses:

- Custom SVG logo.
- Hero y tarjetas de ejemplo con imágenes locales.
- CSS-only paper, grid and dark-grain textures in `app/globals.css`.
- Editorial typography with system serif headings.
- Premium card treatments and image frames.
- CSS hover transitions only; no heavy animation library.
- Páginas de cliente white-label por defecto.

Las páginas de agencia (`/` y `/demos`) pueden mencionar Nexo, precios y ejemplos. Las páginas de cliente (`/demos/[slug]`) deben sentirse como el sitio del negocio ficticio y no incluir lenguaje comercial de Nexo.

## Contact form

The contact form is UI-only by default. In `components/ContactForm.tsx`, replace the form action with Formspree, HubSpot, Make, Zapier, a custom API route or a CRM endpoint. Change the button from `type="button"` to `type="submit"` after connecting an endpoint.

## Pre-deployment visual checklist

- Images load from `public/images`.
- No empty image frames.
- No decorative circles or pills that look clickable.
- WhatsApp buttons use `525545609027` for agency/example previews.
- Agency email is `nexo.local.studio@gmail.com`.
- Client example pages do not show Nexo pitch language by default.
- Mobile hero, CTA and sticky WhatsApp are usable.
- `npm run typecheck` passes.
- `npm run build` passes.

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

- Replace stock images with real approved client photography.
- Add Open Graph images per niche.
- Add analytics events for WhatsApp clicks, phone clicks and form interactions.
- Add a real Formspree or CRM integration.
- Add a `ClientConfig` template file for fast prospect examples.
- Add real case studies after getting client permission.
