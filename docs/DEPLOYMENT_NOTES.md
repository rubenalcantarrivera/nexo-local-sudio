# Notas de despliegue

## Estado del proyecto

- Contacto real configurado:
  - Correo: nexo.local.studio@gmail.com
  - Teléfono visible: 55 4560 9027
  - WhatsApp para links: 525545609027
- Build validado con `npm run typecheck` y `npm run build`.
- Listo para Vercel.
- URL actual de Vercel: https://nexo-local-studio.vercel.app

## Archivos clave antes de producción

- `data/agency.ts`
- `data/landingConfigs.ts`
- `app/layout.tsx`
- `app/sitemap.ts`
- `app/robots.ts`

## Qué cambiar cuando haya dominio real

Cuando `https://nexolocalstudio.com` esté conectado como dominio final:

- Cambiar `siteUrl` en `app/layout.tsx`.
- Cambiar `baseUrl` en `app/sitemap.ts`.
- Cambiar `baseUrl` en `app/robots.ts`.
- Actualizar el dominio en `README.md` si aparece.
- Actualizar links comerciales en `docs/LINKS_TO_SEND.md`.

## Cómo desplegar por GitHub + Vercel

1. Crear o usar el repo GitHub.
2. Hacer push:

```bash
git push -u origin main
```

3. En Vercel, Add New Project.
4. Importar el repositorio GitHub.
5. Framework: Next.js.
6. Build command:

```bash
npm run build
```

7. Deploy.

## Cómo desplegar por CLI

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## Checklist después del deploy

- Abrir homepage.
- Abrir `/demos`.
- Abrir demo dental.
- Probar WhatsApp.
- Probar email.
- Revisar móvil.
- Revisar `/sitemap.xml`.
- Revisar `/robots.txt`.
- Revisar que client demos no muestren pitch de Nexo.
