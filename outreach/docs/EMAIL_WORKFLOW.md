# Workflow diario de outreach

## Día 1

1. Enriquecer 30 prospectos:

```bash
python3 outreach/scripts/find_public_emails.py outreach/verified_no_website_prospects.csv outreach/enriched_prospects.csv
```

2. Validar datos:

```bash
python3 outreach/scripts/validate_outreach_data.py outreach/enriched_prospects.csv
```

3. Generar emails:

```bash
python3 outreach/scripts/generate_outreach_emails.py outreach/enriched_prospects.csv outreach/ready_to_draft.csv
python3 outreach/scripts/prepare_mailmerge_csv.py outreach/ready_to_draft.csv outreach/mailmerge_ready.csv
```

4. Crear 10 borradores en Gmail con Apps Script.
5. Revisar manualmente cada borrador.
6. Enviar solo los 10 aprobados.

## Día 2

1. Revisar respuestas.
2. Agregar bajas a `outreach/suppression_list.csv`.
3. No insistir a quien responda que no le interesa.
4. Enviar 10-20 emails nuevos si la cuenta mantiene buena respuesta.
5. Preparar follow-ups solo para prospectos sin respuesta.

## Día 3

1. Enviar follow-up 1 a no respondedores después de 48 horas.
2. Continuar prospectando con nuevos negocios verificados.
3. Actualizar notas si algún negocio ya tiene sitio o cambió de contacto.

## Después de 5-7 días

Enviar follow-up 2 solo si:

- no hubo respuesta;
- no hay baja;
- el negocio sigue siendo relevante;
- el correo fue público y validado.

No enviar más de dos seguimientos.
