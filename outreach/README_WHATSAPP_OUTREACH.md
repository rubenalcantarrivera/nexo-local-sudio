# WhatsApp outreach seguro - Nexo Local Studio

Este sistema ayuda a preparar mensajes de WhatsApp para prospectos verificados. No envía automáticamente, no usa bots, no controla WhatsApp Web y no presiona Send.

## Principios

- Solo genera links `wa.me` con texto prellenado.
- Tú debes revisar cada mensaje.
- Tú debes presionar Send manualmente.
- Usa lotes pequeños.
- Respeta bajas inmediatamente.

## Flujo recomendado

```bash
python3 outreach/scripts/normalize_phone_numbers.py outreach/verified_no_website_prospects.csv outreach/whatsapp_manual_channels.csv
python3 outreach/scripts/generate_whatsapp_queue.py outreach/whatsapp_manual_channels.csv outreach/whatsapp_outreach_queue.csv
python3 outreach/scripts/validate_whatsapp_queue.py outreach/whatsapp_outreach_queue.csv
python3 outreach/scripts/open_whatsapp_batch.py outreach/whatsapp_outreach_queue.csv --limit 5
```

El último comando abre hasta 5 chats con mensaje prellenado. No envía. Revisa manualmente y manda solo si el mensaje es correcto.

## Lotes recomendados

- Primer lote: 5 mensajes.
- Día 1: máximo 5.
- Día 2: 10.
- Después: 10-20 diarios si no hay reportes ni respuestas negativas.
- No mandes 100 de golpe.

## Estados de la cola

- `ready_to_review`: listo para abrir manualmente.
- `opened_for_manual_send`: abierto en navegador; pendiente marcar si se envió.
- `sent_manual`: enviado manualmente por ti.
- `replied`: respondió.
- `interested`: mostró interés.
- `proposal_sent`: propuesta enviada.
- `closed`: cerrado.
- `no_response`: sin respuesta.
- `follow_up_due`: seguimiento listo.
- `follow_up_1_sent`: primer seguimiento enviado manualmente.
- `follow_up_2_sent`: segundo seguimiento enviado manualmente.
- `not_interested`: no interesado.
- `do_not_contact`: no contactar.
- `baja`: pidió baja.

## Cómo actualizar después de enviar

Después de enviar manualmente un mensaje:

1. Abre `outreach/whatsapp_outreach_queue.csv`.
2. Cambia `status` a `sent_manual`.
3. Agrega `last_contacted` en formato `YYYY-MM-DD`.
4. Si no responde después de 48 horas, marca `status` como `no_response`.
5. Ejecuta:

```bash
python3 outreach/scripts/update_followups.py outreach/whatsapp_outreach_queue.csv
```

## Si alguien pide baja

Agrega el número a `outreach/whatsapp_suppression_list.csv`:

```csv
normalized_phone,business_name,reason,date_added
525500000000,Nombre del negocio,baja,2026-06-16
```

Los scripts saltan números suprimidos.

## Si no hay teléfono

- Usa Instagram público manualmente si existe.
- Llama manualmente si tiene teléfono alternativo.
- Si no hay canal claro, salta el prospecto.
- No inventes números.

## Helper para Mac

Puedes abrir el siguiente lote de 5 con:

```bash
outreach/scripts/open_next_whatsapp.sh
```

Recuerda: abrir no es enviar. Tú revisas y presionas Send.
