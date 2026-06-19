# Campaign 02 - WhatsApp outreach manual

Esta campaña contiene 50 prospectos nuevos para Nexo Local Studio.

## Qué contiene

- `qualified_prospects.csv`: 50 prospectos calificados con teléfono público.
- `phone_source_audit.csv`: auditoría de fuente y normalización de teléfono.
- `whatsapp_number_verification_queue.csv`: links `wa.me` sin mensaje para verificar si el número existe en WhatsApp.
- `whatsapp_outreach_queue.csv`: mensajes prellenados, bloqueados hasta verificación manual.
- `whatsapp_suppression_list.csv`: números que no deben contactarse.
- `run_campaign_next.sh`: menú interactivo.

## Menú principal

```bash
cd /Users/rubenalcantar/Downloads/nexo-local-studio
./outreach/campaigns/campaign_02_50_prospects/run_campaign_next.sh
```

## Modo directo sin verificación

Comando principal para abrir los 50 chats sin menú, sin verificación previa y sin preguntas por cada prospecto:

```bash
cd /Users/rubenalcantar/Downloads/nexo-local-studio
python3 outreach/scripts/open_all_whatsapp_now.py --campaign outreach/campaigns/campaign_02_50_prospects --limit 50
```

Opcional con pausa de 1 segundo:

```bash
python3 outreach/scripts/open_all_whatsapp_now.py --campaign outreach/campaigns/campaign_02_50_prospects --limit 50 --delay 1
```

Este modo abre links de WhatsApp con mensaje prellenado. No manda nada automáticamente. Si WhatsApp dice que el número no existe, cierra esa pestaña y sigue.

El mensaje no incluye el nombre del negocio, habla en plural como Nexo Local Studio y usa solo la homepage principal.

## Verificar primeros 5 números

```bash
cd /Users/rubenalcantar/Downloads/nexo-local-studio
python3 outreach/scripts/run_next_whatsapp_campaign.py --campaign outreach/campaigns/campaign_02_50_prospects --mode verify --limit 5
```

El modo `verify` abre `https://wa.me/[numero]` sin mensaje. Tú debes confirmar si WhatsApp abre un chat real.

## Regenerar cola después de verificar

```bash
python3 outreach/scripts/run_next_whatsapp_campaign.py --campaign outreach/campaigns/campaign_02_50_prospects --mode regenerate
```

Solo los números marcados como `exists_on_whatsapp` pasan a `ready_to_review`.

## Abrir primeros 5 mensajes

```bash
python3 outreach/scripts/run_next_whatsapp_campaign.py --campaign outreach/campaigns/campaign_02_50_prospects --mode send --limit 5
```

El script abre un chat a la vez con mensaje prellenado. No manda nada. Después de revisar y enviar manualmente, presiona Enter en terminal para registrar `sent_manual`.

## Fast send sin verificación previa

Si quieres avanzar más rápido y marcar durante el flujo si el número existe o no, usa:

```bash
python3 outreach/scripts/run_next_whatsapp_campaign.py --campaign outreach/campaigns/campaign_02_50_prospects --mode fast-send --limit 50
```

Este modo abre un chat a la vez con mensaje prellenado. No manda nada automáticamente. Después de revisar WhatsApp:

- Enter: lo marcaste como enviado manualmente.
- `n`: el número no existe en WhatsApp.
- `w`: número equivocado o negocio equivocado.
- `s`: saltar.
- `b`: baja / no contactar.
- `r`: respondió o mostró interés inmediatamente.
- `q`: salir.

## Marcar baja

Si responden baja, no contactar, stop o similar, usa la opción `[b]` en el flujo de envío o agrega el número a `whatsapp_suppression_list.csv`.

## Seguimiento

Después de 48 horas, usa:

```bash
python3 outreach/scripts/run_next_whatsapp_campaign.py --campaign outreach/campaigns/campaign_02_50_prospects --mode followup --limit 5
```

## Límites recomendados

- Día 1: 5 mensajes.
- Día 2: 10 mensajes.
- Luego: 10-20 diarios máximo.

## Si WhatsApp dice que el número no existe

Marca `[n]` en verificación. Ese negocio no entrará a la cola de envío.

## Por qué no se automatiza el envío

Para mantener revisión humana, respetar bajas y evitar comportamiento de spam. El sistema solo acelera preparación, verificación y registro.
