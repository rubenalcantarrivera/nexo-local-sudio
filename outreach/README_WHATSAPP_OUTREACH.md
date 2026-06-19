# WhatsApp outreach seguro - Nexo Local Studio

Este sistema ayuda a preparar outreach por WhatsApp sin automatizar envíos. No usa bots, no controla WhatsApp Web, no presiona Send y no usa APIs no oficiales.

## Principios

- Solo usar teléfonos públicos de negocio.
- Un teléfono con formato válido no significa que exista en WhatsApp.
- Antes de generar mensajes, cada número debe verificarse manualmente con `wa.me/[number]` sin mensaje.
- Solo los números marcados como `exists_on_whatsapp` entran a la cola de outreach.
- El número de Nexo Local Studio `525545609027` nunca debe usarse como destinatario.
- Tú revisas cada mensaje y tú presionas Send manualmente.
- Respeta bajas inmediatamente.

## Verificación real de números de WhatsApp

La verificación abre un link sin texto prellenado:

```text
https://wa.me/[normalized_phone]
```

Esto permite confirmar manualmente si WhatsApp abre un chat válido. No envía mensajes. No enumera números de forma masiva. No debe usarse para automatizar ni evadir límites.

Estados posibles:

- `pending_manual_check`: pendiente de revisar.
- `exists_on_whatsapp`: sí abre un chat válido.
- `not_on_whatsapp`: WhatsApp indica que el número no existe.
- `wrong_number`: abre, pero no corresponde al negocio.
- `needs_review`: requiere revisión manual adicional.

No contactes números con estado `not_on_whatsapp`, `wrong_number`, `needs_review` o `pending_manual_check`.

## Flujo recomendado

### Modo directo sin verificación

Para abrir todos los chats de una campaña rápidamente, sin verificar antes y sin preguntas por cada fila:

```bash
python3 outreach/scripts/open_all_whatsapp_now.py --campaign outreach/campaigns/campaign_02_50_prospects --limit 50
```

Este modo:

- Abre links de WhatsApp con mensaje prellenado.
- No envía automáticamente.
- No verifica números antes.
- Algunos números pueden no existir en WhatsApp; si pasa, cierra esa pestaña y sigue.
- Tú presionas Send manualmente dentro de WhatsApp.
- El mensaje no incluye el nombre del negocio.
- El mensaje habla en plural como Nexo Local Studio.
- El primer mensaje incluye solo la homepage principal.

### Flujo estricto con verificación

```bash
python3 outreach/scripts/audit_phone_sources.py outreach/verified_no_website_prospects.csv outreach/phone_source_audit.csv
python3 outreach/scripts/normalize_phone_numbers.py outreach/verified_no_website_prospects.csv outreach/whatsapp_manual_channels.csv
python3 outreach/scripts/create_whatsapp_verification_queue.py outreach/whatsapp_manual_channels.csv outreach/whatsapp_number_verification_queue.csv
python3 outreach/scripts/manual_verify_whatsapp_numbers.py outreach/whatsapp_number_verification_queue.csv --limit 5
python3 outreach/scripts/apply_whatsapp_verification.py outreach/whatsapp_number_verification_queue.csv outreach/whatsapp_manual_channels.csv outreach/whatsapp_verified_channels.csv
python3 outreach/scripts/generate_whatsapp_queue.py outreach/whatsapp_verified_channels.csv outreach/whatsapp_outreach_queue.csv
python3 outreach/scripts/validate_whatsapp_queue.py outreach/whatsapp_outreach_queue.csv
python3 outreach/scripts/open_whatsapp_batch.py outreach/whatsapp_outreach_queue.csv --limit 5
```

El verificador manual abre un número a la vez y te pregunta si el chat existe. El abridor final solo abre filas `ready_to_review` que ya fueron verificadas como `exists_on_whatsapp`.

## Mensajes

El modo directo usa solo la homepage principal:

```text
https://nexo-local-studio-public.vercel.app
```

El mensaje no incluye nombre de negocio, no usa `/demos/`, habla en plural como Nexo Local Studio y se codifica con `urllib.parse.quote(message, safe="")`.

## Estados de la cola

- `ready_to_review`: listo para abrir manualmente porque el número existe en WhatsApp.
- `blocked_not_verified`: bloqueado porque no tiene verificación `exists_on_whatsapp`.
- `blocked`: bloqueado por teléfono, encoding, longitud, agencia o supresión.
- `opened_for_manual_send`: abierto en navegador; pendiente marcar si se envió.
- `sent_manual`: enviado manualmente por ti.
- `replied`: respondió.
- `interested`: mostró interés.
- `proposal_sent`: propuesta enviada.
- `closed`: cerrado.
- `no_response`: sin respuesta.
- `follow_up_due`: seguimiento listo.
- `not_interested`: no interesado.
- `do_not_contact`: no contactar.
- `baja`: pidió baja.
- `suppressed`: bloqueado por lista de supresión.

## Si alguien pide baja

Agrega el número a `outreach/whatsapp_suppression_list.csv`:

```csv
normalized_phone,business_name,reason,date_added
525500000000,Nombre del negocio,baja,2026-06-16
```

Los scripts saltan números suprimidos.

## Límites recomendados

- Verificación: 5 números por tanda al inicio.
- Outreach: 5 mensajes el primer día.
- Después: 10-20 diarios si no hay reportes ni respuestas negativas.
- No mandar 100 de golpe.
