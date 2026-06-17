# Workflow diario de WhatsApp

## Preparación

1. Revisar prospectos.
2. Confirmar que tienen teléfono público.
3. Normalizar teléfonos:

```bash
python3 outreach/scripts/normalize_phone_numbers.py outreach/verified_no_website_prospects.csv outreach/whatsapp_manual_channels.csv
```

4. Generar mensajes y links:

```bash
python3 outreach/scripts/generate_whatsapp_queue.py outreach/whatsapp_manual_channels.csv outreach/whatsapp_outreach_queue.csv
```

5. Validar cola:

```bash
python3 outreach/scripts/validate_whatsapp_queue.py outreach/whatsapp_outreach_queue.csv
```

## Día 1

1. Abrir 5 chats:

```bash
python3 outreach/scripts/open_whatsapp_batch.py outreach/whatsapp_outreach_queue.csv --limit 5
```

2. Revisar mensaje.
3. Enviar manualmente si está correcto.
4. Marcar `status = sent_manual`.
5. Registrar `last_contacted = YYYY-MM-DD`.

## Día 2

1. Revisar respuestas.
2. Agregar bajas a `whatsapp_suppression_list.csv`.
3. Enviar 10 mensajes nuevos si no hubo señales negativas.

## Seguimiento

1. Si no respondieron después de 48 horas, marcar `status = no_response`.
2. Ejecutar:

```bash
python3 outreach/scripts/update_followups.py outreach/whatsapp_outreach_queue.csv
```

3. Abrir manualmente los `follow_up_due`.
4. No enviar más de dos seguimientos.

## Estados sugeridos

- ready_to_review
- opened_for_manual_send
- sent_manual
- replied
- interested
- proposal_sent
- closed
- no_response
- follow_up_due
- follow_up_1_sent
- follow_up_2_sent
- not_interested
- do_not_contact
- baja

## Límites diarios

- Día 1: 5 mensajes.
- Día 2: 10 mensajes.
- Después: 10-20 mensajes diarios si no hay reportes ni respuestas negativas.
- No mandar 100 de golpe.
