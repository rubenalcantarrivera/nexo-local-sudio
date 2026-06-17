# Prospectos verificados - lote 2

## Estado actualizado: NO USAR PARA WHATSAPP

Este lote queda bloqueado para WhatsApp outreach. Los teléfonos venían de campos públicos de OpenStreetMap, pero el usuario confirmó que no existen en WhatsApp. No abrir ni contactar este lote sin una nueva verificación manual.

Ver: `outreach/batch_2_whatsapp_failure_report.md`.

Fecha de revisión: 2026-06-17

## Resumen

Este segundo lote contiene 30 negocios locales con teléfono público y sin etiqueta de website/contact:website encontrada en OpenStreetMap al momento de la revisión. Se generó una cola de WhatsApp separada para no mezclarla con el primer lote.

Importante: estos números tienen formato telefónico válido, pero no fueron verificados manualmente como cuentas activas de WhatsApp. Antes de enviar, revisar cada chat manualmente. El sistema no envía mensajes automáticamente.

## Método usado

- Fuente pública: OpenStreetMap.
- Filtro principal: negocios con teléfono público y sin website/contact:website registrado.
- Se priorizaron restaurantes boutique, veterinarias y una clínica/centro médico en zonas comerciales fuertes.
- Se generaron enlaces de búsqueda en Google Maps para revisión manual.
- Se creó una cola de WhatsApp con `--allow-unverified` porque el usuario pidió generar el resto sin verificación manual adicional.

## Mensaje usado

El mensaje ya no empieza con el nombre del negocio. Usa una entrada directa y tono plural:

> Hola, vi que su negocio tiene presencia en Google Maps y reputación local.

También usa la galería general de demos de Nexo Local Studio, no demos individuales:

https://nexo-local-studio-public.vercel.app/demos

## Prospectos del lote

| # | Negocio | Nicho | Ciudad | Zona | Teléfono |
|---:|---|---|---|---|---|
| 1 | El Samurai | Restaurante boutique | CDMX | Del Valle | 55 5523 1469 |
| 2 | Konditori | Restaurante boutique | CDMX | Del Valle | +52 55 85000852 |
| 3 | Nagaoka | Restaurante boutique | CDMX | Del Valle | +52 55 55439530 |
| 4 | Frankfurt | Restaurante boutique | CDMX | Roma-Condesa | 55-5256-0767 |
| 5 | Specia | Restaurante boutique | CDMX | Roma-Condesa | 55-5564-1367 |
| 6 | La Tavola | Restaurante boutique | CDMX | Del Valle | +52 55 55437360 |
| 7 | Ruben's Hamburgers Insurgentes | Restaurante boutique | CDMX | Insurgentes | +52 55 56825341 |
| 8 | Deigo | Restaurante boutique | CDMX | Del Valle | +52 55 56056317 |
| 9 | El Rincón del Parque | Restaurante boutique | CDMX | Del Valle | +52 55 56056831 |
| 10 | Garabatos Insurgentes | Restaurante boutique | CDMX | Insurgentes | +52 55 55439448 |
| 11 | El Sheik | Restaurante boutique | CDMX | Del Valle | +52 55 56593311 |
| 12 | COBA FONDA YUCATECA | Restaurante boutique | CDMX | Del Valle | +52 55 6395 9961 |
| 13 | Marina Bistro | Restaurante boutique | CDMX | Del Valle | +52 55 55754014 |
| 14 | Bistro Cheny | Restaurante boutique | CDMX | Del Valle | 55 5523 9908 |
| 15 | Chester's | Restaurante boutique | CDMX | Del Valle | 55 5688 2400 |
| 16 | Ramen-ya | Restaurante boutique | CDMX | Del Valle | 55 5559 1495 |
| 17 | Un Rincon de Chile | Restaurante boutique | CDMX | Del Valle | 55 5524 4039 |
| 18 | Restaurante El Amaranto | Restaurante boutique | CDMX | Del Valle | 55 5539 5074 |
| 19 | Paradiso Gourmet | Restaurante boutique | CDMX | Polanco-Lomas | +52 55 5280 5902 |
| 20 | Angelopolitano | Restaurante boutique | CDMX | Roma-Condesa | 5563912121 |
| 21 | Guzina Oaxaca | Restaurante boutique | CDMX | Polanco | 5552821820 |
| 22 | La Buena Barra | Restaurante boutique | CDMX | Polanco | 5552806699 |
| 23 | Publico | Restaurante boutique | CDMX | Polanco | 5540001288 |
| 24 | Testal | Restaurante boutique | CDMX | Centro-Roma | +525555101358 |
| 25 | Mina la Antigua | Restaurante boutique | Guadalajara | Colonia Americana-Providencia | +52 33 2315 2430 |
| 26 | Alta Fibra | Restaurante boutique | Guadalajara | Colonia Americana-Providencia | +52 33 3124 1510 |
| 27 | Servicios Veterinarios Rodríguez | Veterinaria | CDMX | Cuauhtémoc | +5215555839768 |
| 28 | Centro Veterinario Norte | Veterinaria | CDMX | Peralvillo | +5215555173665 |
| 29 | Caninos & Felinos | Veterinaria | Guadalajara | Zapopan | +52 33 31241227 |
| 30 | Núcleo Médico Copérnico | Clínica estética | Guadalajara | Zapopan | +52 33 36281590 |

## Archivos generados

- `outreach/verified_no_website_prospects_batch_2.csv`
- `outreach/phone_source_audit_batch_2.csv`
- `outreach/whatsapp_manual_channels_batch_2.csv`
- `outreach/phone_verification_report_batch_2.csv`
- `outreach/whatsapp_outreach_queue_batch_2.csv`

## Comandos para abrir chats manualmente

Abrir los primeros 20:

```bash
python3 outreach/scripts/open_whatsapp_batch.py outreach/whatsapp_outreach_queue_batch_2.csv --limit 20 --allow-unverified
```

Después abrir los 10 restantes:

```bash
python3 outreach/scripts/open_whatsapp_batch.py outreach/whatsapp_outreach_queue_batch_2.csv --limit 10 --allow-unverified
```

El script solo abre chats con el mensaje precargado. No presiona Enviar. Revisar cada mensaje y enviar manualmente solo si corresponde.
