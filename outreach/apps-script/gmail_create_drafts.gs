/**
 * Nexo Local Studio - Gmail draft creator.
 *
 * Cómo usar:
 * 1. Sube outreach/mailmerge_ready.csv a Google Sheets.
 * 2. Abre Extensions > Apps Script.
 * 3. Pega este archivo.
 * 4. Ejecuta createDrafts().
 * 5. Revisa manualmente los borradores en Gmail antes de enviar.
 * 6. Si alguien responde "baja", agrégalo de inmediato a suppression_list.csv.
 *
 * Este script crea borradores. No envía correos por defecto.
 */

const CREATE_DRAFTS_ONLY = true;
const MAX_DRAFTS_PER_RUN = 20;

function createDrafts() {
  if (!CREATE_DRAFTS_ONLY) {
    throw new Error("CREATE_DRAFTS_ONLY debe permanecer true para este flujo.");
  }

  const sheet = SpreadsheetApp.getActiveSheet();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return;

  const headers = values[0].map(String);
  const indexes = indexHeaders_(headers);
  ensureStatusColumns_(sheet, headers, indexes);

  let drafted = 0;
  for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
    if (drafted >= MAX_DRAFTS_PER_RUN) break;

    const row = values[rowIndex];
    const status = String(row[indexes.status] || "").trim();
    const email = String(row[indexes.email] || "").trim();
    const subject = String(row[indexes.subject] || "").trim();
    const body = String(row[indexes.email_body] || "").trim();

    if (status !== "ready_to_review") continue;
    if (!email || !subject || !body) continue;
    if (["do_not_contact", "suppressed", "sent", "replied", "no_public_email", "needs_manual_verification"].includes(status)) continue;

    GmailApp.createDraft(email, subject, body);
    sheet.getRange(rowIndex + 1, indexes.status + 1).setValue("drafted");
    sheet.getRange(rowIndex + 1, indexes.drafted_at + 1).setValue(new Date());
    drafted++;
  }
}

function sendApprovedDrafts() {
  /**
   * Intencionalmente no implementado para envío automático.
   * Si se agrega envío en el futuro, debe:
   * - procesar únicamente filas con status = approved_to_send;
   * - respetar suppression_list.csv;
   * - registrar sent_at;
   * - ejecutarse manualmente, nunca por trigger.
   */
  throw new Error("Envío automático deshabilitado. Revisa y envía manualmente desde Gmail.");
}

function indexHeaders_(headers) {
  const required = ["email", "business_name", "subject", "email_body", "status"];
  const indexes = {};
  headers.forEach((header, index) => {
    indexes[header] = index;
  });
  required.forEach((header) => {
    if (indexes[header] === undefined) {
      throw new Error("Falta columna requerida: " + header);
    }
  });
  return indexes;
}

function ensureStatusColumns_(sheet, headers, indexes) {
  if (indexes.drafted_at !== undefined) return;
  const nextCol = headers.length + 1;
  sheet.getRange(1, nextCol).setValue("drafted_at");
  indexes.drafted_at = nextCol - 1;
}
