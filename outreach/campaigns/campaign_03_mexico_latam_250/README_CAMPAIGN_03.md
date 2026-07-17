# Campaign 03 - Mexico/LATAM 250

Campaña de WhatsApp manual para Nexo Local Studio.

Esta campaña no envía mensajes automáticamente. Los scripts sólo abren enlaces `wa.me`; la revisión y el envío ocurren manualmente en WhatsApp.

## Archivos principales

- `qualified_prospects.csv`: 250 prospectos deduplicados con teléfono público y problema web observado en fuente pública.
- `whatsapp_number_verification_queue.csv`: enlaces `wa.me/[numero]` sin mensaje para verificar si el chat existe.
- `whatsapp_outreach_queue.csv`: cola de mensajes. Antes de verificar, queda bloqueada como `blocked_not_verified`.
- `whatsapp_sent_log.csv`: registro de mensajes enviados manualmente.
- `whatsapp_suppression_list.csv`: bajas/no contactar.

## Verificar números

```bash
python3 outreach/scripts/campaign03_verify_whatsapp.py --campaign outreach/campaigns/campaign_03_mexico_latam_250 --limit 250
```

Atajos:

- Enter = el chat existe en WhatsApp.
- `n` = no existe en WhatsApp / inválido.
- `w` = número equivocado.
- `s` = saltar / revisar después.
- `q` = salir.

## Generar cola después de verificar

```bash
python3 outreach/scripts/campaign03_generate_queue.py --campaign outreach/campaigns/campaign_03_mexico_latam_250
```

Sólo los números marcados `exists_on_whatsapp` quedan en `ready_to_send`.

## Abrir mensajes directo, sin verificar

Si quieres saltarte la verificación y abrir los chats con mensaje prellenado:

```bash
python3 outreach/scripts/campaign03_open_unverified_now.py --campaign outreach/campaigns/campaign_03_mexico_latam_250 --limit 250 --delay 1.2
```

También puedes correr:

```bash
./outreach/campaigns/campaign_03_mexico_latam_250/abrir_mensajes_ahora.sh
```

En Mac también puedes abrir `ABRIR_MENSAJES_AHORA.command` con doble click. Esto no envía mensajes: sólo abre enlaces `wa.me` con texto prellenado.

## Enviar mensajes verificados

```bash
python3 outreach/scripts/campaign03_send_whatsapp.py --campaign outreach/campaigns/campaign_03_mexico_latam_250 --limit 250
```

El script abre un chat con mensaje prellenado. Tú presionas Send manualmente en WhatsApp y luego Enter en terminal.

## Menú corto

```bash
./outreach/campaigns/campaign_03_mexico_latam_250/run_campaign_03.sh
```

## Mensaje usado

El mensaje no incluye nombre del negocio, no usa “landing page”, habla en plural como Nexo Local Studio y menciona el asistente con IA.

## Nota de datos

La fuente principal de esta campaña es OpenStreetMap/Overpass. OpenStreetMap no ofrece ratings ni reseñas. El estado `No website found` significa que el registro público consultado no contiene sitio web oficial. Antes de contactar masivamente, conviene verificar por muestreo los mejores prospectos.
