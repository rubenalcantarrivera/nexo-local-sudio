# Workflow diario de WhatsApp

## Preparación obligatoria

1. Auditar teléfonos fuente:

```bash
python3 outreach/scripts/audit_phone_sources.py outreach/verified_no_website_prospects.csv outreach/phone_source_audit.csv
```

2. Normalizar teléfonos:

```bash
python3 outreach/scripts/normalize_phone_numbers.py outreach/verified_no_website_prospects.csv outreach/whatsapp_manual_channels.csv
```

3. Crear cola de verificación de WhatsApp:

```bash
python3 outreach/scripts/create_whatsapp_verification_queue.py outreach/whatsapp_manual_channels.csv outreach/whatsapp_number_verification_queue.csv
```

4. Verificar manualmente los primeros 5 números:

```bash
python3 outreach/scripts/manual_verify_whatsapp_numbers.py outreach/whatsapp_number_verification_queue.csv --limit 5
```

El script abre `https://wa.me/[number]` sin mensaje. Tú confirmas:

- `y`: existe en WhatsApp.
- `n`: no existe en WhatsApp.
- `w`: número equivocado.
- `s`: necesita revisión.
- `q`: salir.

No se envía ningún mensaje.

## Generar outreach después de verificar

1. Aplicar verificación:

```bash
python3 outreach/scripts/apply_whatsapp_verification.py outreach/whatsapp_number_verification_queue.csv outreach/whatsapp_manual_channels.csv outreach/whatsapp_verified_channels.csv
```

2. Generar cola de mensajes solo con números verificados:

```bash
python3 outreach/scripts/generate_whatsapp_queue.py outreach/whatsapp_verified_channels.csv outreach/whatsapp_outreach_queue.csv
```

3. Validar cola:

```bash
python3 outreach/scripts/validate_whatsapp_queue.py outreach/whatsapp_outreach_queue.csv
```

4. Abrir mensajes manualmente:

```bash
python3 outreach/scripts/open_whatsapp_batch.py outreach/whatsapp_outreach_queue.csv --limit 5
```

El abridor solo acepta filas con:

- `status = ready_to_review`
- `whatsapp_verification_status = exists_on_whatsapp`
- `url_validation_status = url_valid`
- teléfono válido
- número diferente a `525545609027`

## Link del primer mensaje

El primer mensaje debe mandar a la galería general de ejemplos:

```text
https://nexo-local-studio-public.vercel.app/demos
```

No usar demos individuales como `/demos/dental`, `/demos/restaurante` o similares en el primer contacto. Esos links pueden enviarse después si el prospecto pide un ejemplo específico.

## Verificación real de números de WhatsApp

Un teléfono público puede ser fijo, conmutador o línea sin WhatsApp. Por eso `valid_format_only` no es suficiente para contactar.

Solo deben pasar a outreach los números marcados como `exists_on_whatsapp`. No contactar:

- `not_on_whatsapp`
- `wrong_number`
- `needs_review`
- `pending_manual_check`
- `agency_number_error`
- `baja`
- `do_not_contact`

## Seguimiento

Después de enviar manualmente:

1. Cambia `status` a `sent_manual`.
2. Agrega `last_contacted = YYYY-MM-DD`.
3. Si no responde después de 48 horas, marca `status = no_response`.
4. Ejecuta:

```bash
python3 outreach/scripts/update_followups.py outreach/whatsapp_outreach_queue.csv
```

No enviar más de dos seguimientos.

## Límites diarios

- Día 1: verificar 5 números y enviar máximo 5 mensajes.
- Día 2: verificar 10 números y enviar 10 si no hubo señales negativas.
- Después: 10-20 diarios.
- No mandar 100 de golpe.
