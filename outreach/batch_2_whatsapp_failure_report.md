# Reporte de fallo - WhatsApp batch 2

Fecha: 2026-06-17

## Qué pasó

El lote 2 fue generado con teléfonos públicos encontrados en OpenStreetMap. Esos números tenían formato telefónico válido, pero no estaban verificados como cuentas existentes de WhatsApp.

El usuario confirmó después que los números no existen en WhatsApp. Por lo tanto, el lote queda bloqueado y no debe usarse para outreach.

## Origen de los datos

- Fuente: OpenStreetMap mediante consulta pública.
- Filtro usado: negocios con campo `phone` público y sin `website` o `contact:website` registrado.
- Error operativo: se permitió generar cola con `--allow-unverified`, tratando teléfonos de formato válido como si fueran aptos para abrir chat.

## Corrección aplicada

- `outreach/whatsapp_outreach_queue_batch_2.csv` quedó con `status = blocked_not_verified`.
- `whatsapp_verification_status = not_on_whatsapp`.
- Se removieron los `wa.me` de las filas del lote 2.
- `outreach/scripts/open_batch_2_whatsapp.sh` ahora se detiene y muestra aviso en lugar de abrir chats.

## Regla nueva

No usar teléfonos tomados solo de OpenStreetMap como destinatarios de WhatsApp.

Para futuros lotes, solo usar números que cumplan una de estas condiciones:

- El negocio publica explícitamente un enlace `wa.me`.
- El negocio publica un botón o texto de WhatsApp en su sitio oficial.
- El perfil social oficial dice explícitamente WhatsApp.
- El número fue verificado manualmente abriendo `https://wa.me/[numero]` sin mensaje y confirmando que el chat existe.

## Estado

Batch 2 no es usable para WhatsApp outreach.

