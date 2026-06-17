#!/usr/bin/env python3
"""Normalize public business phone numbers for manual WhatsApp verification.

Important: `valid_format_only` means the phone format is plausible. It does not
mean the number exists on WhatsApp.
"""

from __future__ import annotations

import csv
import re
import sys
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PHONE_REPORT_PATH = ROOT / "outreach" / "phone_verification_report.csv"
AGENCY_WHATSAPP = "525545609027"
EXTENSION_RE = re.compile(r"(?:\bext\.?|\bextension\b|\bextensión\b|\bx)\s*\d+.*$", re.IGNORECASE)

COLUMNS = [
    "priority", "score", "business_name", "niche", "city", "zone", "rating", "reviews_count",
    "website_status", "problem_detected", "phone", "original_phone", "normalized_phone",
    "phone_status", "normalization_notes", "is_agency_number", "is_duplicate",
    "recommended_action", "instagram", "google_maps_url", "demo_url", "homepage_url",
    "contact_person", "status", "notes",
]
REPORT_COLUMNS = [
    "business_name", "original_phone", "normalized_phone", "phone_status", "reason",
    "duplicate_group", "is_agency_number", "recommended_action",
]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]], columns: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def strip_extension(phone: str) -> tuple[str, str]:
    original = (phone or "").strip()
    stripped = EXTENSION_RE.sub("", original).strip()
    if stripped != original:
        return stripped, "Se detectó y removió una extensión del teléfono original."
    return stripped, ""


def clean_digits(phone: str) -> tuple[str, str]:
    no_extension, extension_note = strip_extension(phone)
    digits = re.sub(r"\D+", "", no_extension)
    notes = [extension_note] if extension_note else []
    if digits.startswith("00"):
        digits = digits[2:]
        notes.append("Se removió prefijo internacional 00.")
    return digits, " ".join(notes)


def normalize_mx_phone(phone: str) -> tuple[str, str, str]:
    digits, notes = clean_digits(phone)
    if not digits:
        return "", "missing_phone", "No hay teléfono público en la fila."
    if len(digits) < 10:
        return "", "invalid_phone", "El teléfono tiene menos de 10 dígitos después de limpiar formato."
    if len(digits) > 13:
        return "", "needs_manual_review", "El teléfono tiene más de 13 dígitos; puede contener extensión o datos extra."
    if len(digits) == 10:
        return "52" + digits, "valid_format_only", (notes + " " if notes else "") + "Teléfono mexicano de 10 dígitos convertido a 52 + número."
    if len(digits) == 12 and digits.startswith("52"):
        return digits, "valid_format_only", (notes + " " if notes else "") + "Teléfono ya estaba en formato 52 + 10 dígitos."
    if len(digits) == 13 and digits.startswith("521"):
        return "52" + digits[-10:], "valid_format_only", (notes + " " if notes else "") + "Formato móvil antiguo 521 convertido a 52 + últimos 10 dígitos."
    return "", "needs_manual_review", "No se pudo normalizar con confianza como número mexicano."


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python3 outreach/scripts/normalize_phone_numbers.py INPUT.csv outreach/whatsapp_manual_channels.csv", file=sys.stderr)
        return 2
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    rows = read_csv(input_path)
    normalized_counts: dict[str, int] = defaultdict(int)
    normalized_cache: list[tuple[dict[str, str], str, str, str]] = []
    for row in rows:
        normalized, phone_status, reason = normalize_mx_phone(row.get("phone", ""))
        if normalized:
            normalized_counts[normalized] += 1
        normalized_cache.append((row, normalized, phone_status, reason))

    output_rows: list[dict[str, str]] = []
    report_rows: list[dict[str, str]] = []
    for row, normalized, phone_status, reason in normalized_cache:
        duplicate_group = ""
        is_duplicate = bool(normalized and normalized_counts[normalized] > 1)
        is_agency_number = normalized == AGENCY_WHATSAPP
        recommended_action = "Pasar a verificación manual de WhatsApp."

        if is_duplicate and phone_status == "valid_format_only":
            duplicate_group = normalized
            phone_status = "duplicate_phone"
            reason = "El mismo teléfono aparece en más de una fila."
            recommended_action = "Revisar duplicado antes de verificar WhatsApp."
        if is_agency_number:
            phone_status = "agency_number_error"
            reason = "El número normalizado coincide con el WhatsApp de Nexo Local Studio."
            recommended_action = "No usar como destinatario; revisar fuente del teléfono."
        elif phone_status in {"missing_phone", "invalid_phone", "needs_manual_review"}:
            recommended_action = "No incluir en cola; revisar o buscar teléfono público correcto."

        status = row.get("status", "").strip() or ("ready_for_whatsapp_verification" if phone_status == "valid_format_only" else "manual_review")
        notes = row.get("verification_notes", "") or row.get("notes", "")
        if phone_status != "valid_format_only":
            notes = (notes + " | " if notes else "") + reason

        output_rows.append({
            "priority": row.get("priority", ""),
            "score": row.get("score", ""),
            "business_name": row.get("business_name", ""),
            "niche": row.get("niche", ""),
            "city": row.get("city", ""),
            "zone": row.get("zone", ""),
            "rating": row.get("rating", ""),
            "reviews_count": row.get("reviews_count", ""),
            "website_status": row.get("website_status", ""),
            "problem_detected": row.get("problem_detected", ""),
            "phone": row.get("phone", ""),
            "original_phone": row.get("phone", ""),
            "normalized_phone": normalized,
            "phone_status": phone_status,
            "normalization_notes": reason,
            "is_agency_number": "yes" if is_agency_number else "no",
            "is_duplicate": "yes" if is_duplicate else "no",
            "recommended_action": recommended_action,
            "instagram": row.get("instagram", ""),
            "google_maps_url": row.get("google_maps_url", ""),
            "demo_url": row.get("demo_url", ""),
            "homepage_url": row.get("homepage_url", ""),
            "contact_person": row.get("contact_person", ""),
            "status": status,
            "notes": notes,
        })
        report_rows.append({
            "business_name": row.get("business_name", ""),
            "original_phone": row.get("phone", ""),
            "normalized_phone": normalized,
            "phone_status": phone_status,
            "reason": reason,
            "duplicate_group": duplicate_group,
            "is_agency_number": "yes" if is_agency_number else "no",
            "recommended_action": recommended_action,
        })

    write_csv(output_path, output_rows, COLUMNS)
    write_csv(PHONE_REPORT_PATH, report_rows, REPORT_COLUMNS)
    valid_format = sum(1 for row in output_rows if row["phone_status"] == "valid_format_only")
    invalid = sum(1 for row in output_rows if row["phone_status"] in {"invalid_phone", "missing_phone", "needs_manual_review"})
    agency_errors = sum(1 for row in output_rows if row["phone_status"] == "agency_number_error")
    duplicates = sum(1 for row in output_rows if row["phone_status"] == "duplicate_phone")
    print(f"Processed: {len(output_rows)}")
    print(f"Valid format only: {valid_format}")
    print(f"Invalid/missing/needs review: {invalid}")
    print(f"Agency-number errors: {agency_errors}")
    print(f"Duplicate phones: {duplicates}")
    print(f"Wrote: {output_path}")
    print(f"Phone report: {PHONE_REPORT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
