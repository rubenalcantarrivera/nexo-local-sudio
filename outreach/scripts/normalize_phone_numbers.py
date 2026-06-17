#!/usr/bin/env python3
"""Normalize public business phone numbers for manual WhatsApp outreach.

This script does not send messages. It only prepares phone data for human-reviewed
wa.me links.
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
COLUMNS = [
    "priority", "score", "business_name", "niche", "city", "zone", "rating", "reviews_count",
    "website_status", "problem_detected", "phone", "normalized_phone", "phone_status",
    "instagram", "google_maps_url", "demo_url", "homepage_url", "contact_person", "status", "notes",
]
REPORT_COLUMNS = [
    "business_name", "original_phone", "normalized_phone", "phone_status", "reason",
    "duplicate_group", "is_agency_number", "recommended_action",
]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def write_phone_report(rows: list[dict[str, str]]) -> None:
    PHONE_REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with PHONE_REPORT_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=REPORT_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def clean_digits(phone: str) -> str:
    return re.sub(r"\D+", "", phone or "")


def normalize_mx_phone(phone: str) -> tuple[str, str, str]:
    digits = clean_digits(phone)
    if not digits:
        return "", "missing_phone", "No hay teléfono público en la fila."
    if len(digits) == 10:
        return "52" + digits, "valid", "Teléfono mexicano de 10 dígitos convertido a formato internacional."
    if len(digits) == 12 and digits.startswith("52"):
        return digits, "valid", "Teléfono ya estaba en formato internacional mexicano."
    if len(digits) == 13 and digits.startswith("521"):
        return "52" + digits[3:], "valid", "Teléfono mexicano antiguo con 521 normalizado a 52."
    return "", "invalid_phone", "El teléfono no coincide con formato mexicano de 10 dígitos o 52 + 10 dígitos."


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
    normalized_businesses: dict[str, list[str]] = defaultdict(list)
    normalized_cache: list[tuple[dict[str, str], str, str, str]] = []
    for row in rows:
        normalized, phone_status, reason = normalize_mx_phone(row.get("phone", ""))
        if normalized:
            normalized_counts[normalized] += 1
            normalized_businesses[normalized].append(row.get("business_name", "").strip())
        normalized_cache.append((row, normalized, phone_status, reason))

    output_rows: list[dict[str, str]] = []
    report_rows: list[dict[str, str]] = []
    for row, normalized, phone_status, reason in normalized_cache:
        duplicate_group = ""
        is_agency_number = normalized == AGENCY_WHATSAPP
        recommended_action = "Usar en cola de revisión manual."
        if phone_status == "valid" and normalized_counts[normalized] > 1:
            duplicate_group = normalized
            phone_status = "duplicate_phone"
            reason = "El mismo teléfono aparece en más de una fila."
            recommended_action = "Revisar duplicado antes de contactar."
        if is_agency_number:
            phone_status = "agency_number_error"
            reason = "El número normalizado coincide con el WhatsApp de Nexo Local Studio."
            recommended_action = "No usar como destinatario; revisar fuente del teléfono."
        elif phone_status in {"missing_phone", "invalid_phone"}:
            recommended_action = "No incluir en cola; buscar teléfono público o contactar por otro canal."

        status = row.get("status", "").strip() or ("ready_for_queue" if phone_status == "valid" else "manual_review")
        notes = row.get("verification_notes", "")
        if phone_status != "valid":
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
            "normalized_phone": normalized,
            "phone_status": phone_status,
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

    write_csv(output_path, output_rows)
    write_phone_report(report_rows)
    valid = sum(1 for row in output_rows if row["phone_status"] == "valid")
    invalid = len(output_rows) - valid
    agency_errors = sum(1 for row in output_rows if row["phone_status"] == "agency_number_error")
    duplicates = sum(1 for row in output_rows if row["phone_status"] == "duplicate_phone")
    print(f"Processed: {len(output_rows)}")
    print(f"Valid phones: {valid}")
    print(f"Invalid/missing phones: {invalid}")
    print(f"Agency-number errors: {agency_errors}")
    print(f"Duplicate phones: {duplicates}")
    print(f"Wrote: {output_path}")
    print(f"Phone report: {PHONE_REPORT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
