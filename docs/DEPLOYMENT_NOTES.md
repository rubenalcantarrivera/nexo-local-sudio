# Notas de despliegue

## Estado del proyecto

- Contacto real configurado:
  - Correo: nexo.local.studio@gmail.com
  - Teléfono visible: 55 4560 9027
  - WhatsApp para links: 525545609027
- Build validado con `npm run typecheck` y `npm run build`.
- Listo para Vercel.
- URL pública pendiente: reemplazar `PUBLIC_URL` cuando Vercel publique el commit actual.

Nota operativa: el deploy por CLI puede quedar en `UNKNOWN` si el proyecto de Vercel no tiene acceso correcto al repositorio de GitHub o si la configuración del proyecto queda inconsistente. En ese caso, importa manualmente el repo desde Vercel y autoriza la GitHub App para `rubenalcantarrivera/nexo-local-sudio`.

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

## Nexo Chat Agent deployment

- App commit verificado: `fb951dd` (`Polish Nexo Chat Agent UX and safety`).
- GitHub repo: `https://github.com/rubenalcantarrivera/nexo-local-sudio`.
- Proyecto Vercel localmente vinculado: `nexo-local-studio-public`.
- URL de producción esperada: `https://nexo-local-studio-public.vercel.app`.

Rutas a probar después de cada deploy:

- `/chat-agent`
- `/chat-agent/demos`
- `/chat-agent/demos/dental`
- `/chat-agent/demos/estetica`
- `/chat-agent/demos/restaurante`

Variables de entorno:

- `OPENAI_API_KEY` es opcional para modo AI real.
- `OPENAI_MODEL` es opcional y por defecto usa `gpt-5-mini`.
- `LEADS_WEBHOOK_URL` es opcional para enviar leads a un webhook.
- El modo demo/mock funciona sin API key y no debe romper build ni deploy.

Si los cambios no aparecen en producción:

1. Revisar Vercel → Deployments y confirmar que el último commit de `main` está construyendo.
2. Confirmar que la rama de producción es `main`.
3. Confirmar que el root directory del proyecto Vercel apunta a la raíz del repo.
4. Hacer redeploy del último commit.
5. Si el proyecto no está conectado al repo, conectar `https://github.com/rubenalcantarrivera/nexo-local-sudio` en Settings → Git.

## Checklist después del deploy

- Abrir homepage.
- Abrir `/demos`.
- Abrir ejemplo dental.
- Abrir `/chat-agent`.
- Abrir `/chat-agent/demos`.
- Abrir `/chat-agent/demos/dental`.
- Probar WhatsApp.
- Probar email.
- Revisar móvil.
- Revisar `/sitemap.xml`.
- Revisar `/robots.txt`.
- Revisar que los ejemplos de cliente no muestren pitch de Nexo.
