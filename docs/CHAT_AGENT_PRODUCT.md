# Nexo Chat Agent

Nexo Chat Agent es un asistente inteligente para páginas web de negocios locales. Responde preguntas frecuentes, explica servicios, captura datos básicos y guía al cliente hacia WhatsApp con un mensaje prellenado.

No reemplaza al equipo humano. Funciona como primera atención para reducir fricción y preparar una conversación más clara.

## Cómo funciona

1. El usuario abre el chat en la página.
2. El asistente responde con base en la configuración del negocio.
3. Si detecta intención de cita, cotización, urgencia o una pregunta sensible, muestra un CTA a WhatsApp.
4. El negocio confirma disponibilidad, precios y siguientes pasos por WhatsApp.

## Configurar un nuevo negocio

1. Agrega una configuración en `data/chatAgentConfigs.ts`.
2. Define `slug`, nombre, nicho, ubicación, teléfono, servicios, FAQs, disclaimers y reglas de escalamiento.
3. Usa el widget:

```tsx
<ChatWidget businessSlug="dental" />
```

4. Crea una demo en `/chat-agent/demos/[slug]` si el slug está en `getAllChatAgentSlugs()`.

## Variables de entorno

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-mini
LEADS_WEBHOOK_URL=
NEXT_PUBLIC_SITE_URL=https://nexolocalstudio.com
```

`OPENAI_API_KEY` queda solo del lado servidor. Si no existe, el producto funciona en modo demo con respuestas determinísticas.

## Ejecutar localmente

```bash
npm install
npm run dev
npm run test:chat-agent
```

## Mock mode

Sin `OPENAI_API_KEY`, `/api/chat-agent` usa reglas locales para responder sobre servicios, horarios, ubicación, precios desconocidos, emergencias y handoff a WhatsApp. Esto permite vender y probar el producto sin credenciales.

## OpenAI mode

Con `OPENAI_API_KEY`, `lib/ai/openaiClient.ts` usa la API Responses del SDK oficial de OpenAI. El prompt obliga salida JSON y reglas de seguridad por nicho. Si la respuesta no parsea como JSON, vuelve a fallback seguro.

## WhatsApp handoff

`lib/ai/chatAgentWhatsApp.ts` crea un enlace `wa.me` con resumen de la conversación, servicio de interés y datos capturados. No envía mensajes automáticamente.

## Seguridad

El asistente:

- No inventa precios, horarios, disponibilidad ni stock.
- No promete ventas, leads, resultados médicos, resultados legales o ranking en Google.
- No diagnostica.
- No da asesoría legal definitiva.
- Escala a humano en casos sensibles.
- Recomienda emergencia cuando aplica.

## Pricing

- Chat Inicial: $1,500 MXN setup + $499/mes.
- Chat Plus: $3,500 MXN setup + $999/mes.
- Chat Premium: $6,500 MXN setup + $1,900/mes.

Costos de API no incluidos si el volumen de uso crece significativamente.

## Cómo venderlo

Posicionamiento:

> Además de la página, podemos integrar un asistente inteligente que responde preguntas frecuentes, explica servicios y prepara al cliente para escribir por WhatsApp. No reemplaza al equipo; funciona como primera atención.

No prometas ventas garantizadas, diagnósticos, asesoría legal definitiva ni automatización total de WhatsApp.

## Futuro

Se puede conectar a panel de cliente, CRM, analítica y WhatsApp Business Platform oficial. No usar bots no oficiales ni automatización de WhatsApp Web.
