# Workflow diario de WhatsApp

## Preparación

1. Revisar prospectos.
2. Confirmar que tienen teléfono público de negocio.
3. Normalizar teléfonos y generar reporte:

```bash
python3 outreach/scripts/normalize_phone_numbers.py outreach/verified_no_website_prospects.csv outreach/whatsapp_manual_channels.csv
```

Este paso también crea `outreach/phone_verification_report.csv`.

4. Generar mensajes y links:

```bash
python3 outreach/scripts/generate_whatsapp_queue.py outreach/whatsapp_manual_channels.csv outreach/whatsapp_outreach_queue.csv
```

El primer mensaje usa solo la página principal de Nexo Local Studio. No incluye links de demos por nicho. Los demos pueden enviarse después de forma manual si el prospecto pide ejemplos.

5. Validar cola:

```bash
python3 outreach/scripts/validate_whatsapp_queue.py outreach/whatsapp_outreach_queue.csv
```

La validación revisa:

- teléfono normalizado y numérico;
- que el número del prospecto no sea `525545609027`, que es el WhatsApp de Nexo;
- que el texto decodificado desde `wa.me` coincida exactamente con el mensaje original;
- que no haya mensajes con `/demos/`;
- que no haya placeholders como `YOUR-VERCEL-URL`;
- que el mensaje no exceda 360 caracteres;
- que la URL no exceda 650 caracteres;
- que el mensaje sea de una sola línea para evitar truncamientos en WhatsApp o apps de hojas de cálculo.

## Día 1

1. Abrir 5 chats:

```bash
python3 outreach/scripts/open_whatsapp_batch.py outreach/whatsapp_outreach_queue.csv --limit 5
```

2. Revisar la vista previa en terminal.
3. Confirmar solo si todo se ve correcto.
4. Revisar cada chat en WhatsApp.
5. Enviar manualmente si está correcto.
6. Marcar `status = sent_manual`.
7. Registrar `last_contacted = YYYY-MM-DD`.

El script solo abre links `wa.me`; no envía mensajes, no usa bots y no presiona Send.

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

Los seguimientos también usan la página principal de Nexo Local Studio, no links de demos.

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
- blocked
- suppressed

## Límites diarios

- Día 1: 5 mensajes.
- Día 2: 10 mensajes.
- Después: 10-20 mensajes diarios si no hay reportes ni respuestas negativas.
- No mandar 100 de golpe.
