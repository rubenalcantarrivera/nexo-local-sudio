# Email enrichment y outreach seguro - Nexo Local Studio

Este sistema toma una lista de prospectos verificados, busca correos públicos de negocio cuando existen, genera mensajes personalizados y prepara archivos para revisión manual. No envía correos automáticamente.

## 1. Cómo funciona

1. **Input prospects:** usa `outreach/verified_no_website_prospects.csv`.
2. **Email enrichment:** `find_public_emails.py` intenta encontrar correos públicos en fuentes de negocio.
3. **Validation:** `validate_outreach_data.py` valida formato, duplicados y lista de supresión.
4. **Email generation:** `generate_outreach_emails.py` crea mensajes solo para correos públicos confirmados.
5. **Mail merge CSV:** `prepare_mailmerge_csv.py` genera `outreach/mailmerge_ready.csv`.
6. **Gmail drafts:** `gmail_create_drafts.gs` crea borradores, no envía.

## 2. Comandos

```bash
python3 outreach/scripts/find_public_emails.py outreach/verified_no_website_prospects.csv outreach/enriched_prospects.csv
python3 outreach/scripts/validate_outreach_data.py outreach/enriched_prospects.csv
python3 outreach/scripts/generate_outreach_emails.py outreach/enriched_prospects.csv outreach/ready_to_draft.csv
python3 outreach/scripts/prepare_mailmerge_csv.py outreach/ready_to_draft.csv outreach/mailmerge_ready.csv
```

## 3. Apps Script para Gmail Drafts

1. Sube `outreach/mailmerge_ready.csv` a Google Sheets.
2. Abre `Extensions > Apps Script`.
3. Pega `outreach/apps-script/gmail_create_drafts.gs`.
4. Ejecuta `createDrafts()`.
5. Revisa cada borrador en Gmail.
6. Envía manualmente solo los correos aprobados.

El script usa:

```js
const CREATE_DRAFTS_ONLY = true;
const MAX_DRAFTS_PER_RUN = 20;
```

No cambies esto salvo que tengas un proceso de aprobación explícito.

## 4. Revisión antes de enviar

- Abre el perfil de Google Maps del prospecto.
- Confirma que el negocio sigue activo.
- Confirma que el correo es público y pertenece al negocio.
- Confirma que el demo link corresponde al nicho.
- Revisa tono y personalización.
- No envíes a correos con `needs_manual_verification`.
- No envíes a filas marcadas como `suppressed`, `do_not_contact`, `sent` o `replied`.

## 5. Si no hay email

No inventes correos.

Usa canales manuales:

- WhatsApp público.
- Instagram público.
- Llamada.
- Google Maps como referencia.

El archivo `outreach/manual_channels.csv` contiene mensajes breves para contacto manual. No automatices WhatsApp.

## 6. Límites recomendados

- Empieza con 10-20 emails diarios.
- Máximo 30 diarios al principio.
- Revisa respuestas antes de escalar.
- No mandes campañas grandes desde una cuenta de Gmail nueva.
- Mantén una cadencia humana y cuidadosa.

## 7. Compliance operativo

- Identifica claramente a Nexo Local Studio.
- Incluye contacto visible.
- Incluye opción de baja.
- No uses asuntos engañosos.
- No prometas ventas, leads, rankings o resultados garantizados.
- Respeta bajas inmediatamente.
- Agrega bajas a `outreach/suppression_list.csv`.

## 8. Archivos principales

- `outreach/enriched_prospects.csv`: prospectos con estado de email.
- `outreach/email_research_log.csv`: bitácora de investigación.
- `outreach/ready_to_draft.csv`: emails listos para revisión.
- `outreach/mailmerge_ready.csv`: CSV para Google Sheets/mail merge.
- `outreach/manual_channels.csv`: mensajes para WhatsApp/Instagram/manual.
- `outreach/suppression_list.csv`: bajas y no contactar.
