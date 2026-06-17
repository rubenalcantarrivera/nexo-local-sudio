#!/usr/bin/env python3
"""Audit public phone sources before WhatsApp outreach.

This does not verify WhatsApp existence. It only checks whether the source phone
looks usable enough to enter the manual WhatsApp verification queue.
"""

from __future__ import annotations

import csv
import re
import sys
from collections import defaultdict
from pathlib import Path


AGENCY_WHATSAPP = "525545609027"
EXTENSION_RE = re.compile(r"(?:\bext\.?|\bextension\b|\bextensión\b|\bx)\s*\d+.*$", re.IGNORECASE)
OUTPUT_COLUMNS = [
    "business_name", "niche", "city", "zone", "original_phone", "normalized_phone",
    "phone_source", "google_maps_url", "website_url", "instagram", "source_confidence",
    "source_issue", "recommended_action",
]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=OUTPUT_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def strip_extension(phone: str) -> tuple[str, bool]:
    cleaned = (phone or "").strip()
    without_ext = EXTENSION_RE.sub("", cleaned).strip()
    return without_ext, without_ext != cleaned


def digits_only(phone: str) -> str:
    phone, _ = strip_extension(phone)
    digits = re.sub(r"\D+", "", phone)
    if digits.startswith("00"):
        digits = digits[2:]
    return digits


def normalize_mx_phone(phone: str) -> str:
    digits = digits_only(phone)
    if len(digits) == 10:
        return "52" + digits
    if len(digits) == 12 and digits.startswith("52"):
        return digits
    if len(digits) == 13 and digits.startswith("521"):
        return "52" + digits[-10:]
    return ""


def source_confidence(row: dict[str, str], issue: str, extension_found: bool) -> str:
    if issue in {"missing_phone", "invalid_phone", "agency_number_error", "needs_manual_review"}:
        return "low"
    if extension_found:
        return "medium"
    if row.get("google_maps_url", "").strip() and row.get("phone", "").strip():
        return "high"
    if row.get("website_url", "").strip() or row.get("instagram", "").strip():
        return "medium"
    return "low"


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python3 outreach/scripts/audit_phone_sources.py outreach/verified_no_website_prospects.csv outreach/phone_source_audit.csv", file=sys.stderr)
        return 2

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    rows = read_csv(input_path)
    normalized_counts: dict[str, int] = defaultdict(int)
    prepared: list[tuple[dict[str, str], str, str, bool]] = []
    for row in rows:
        original = row.get("phone", "")
        base_phone, extension_found = strip_extension(original)
        digits = digits_only(original)
        normalized = normalize_mx_phone(original)
        if normalized:
            normalized_counts[normalized] += 1
        prepared.append((row, digits, normalized, extension_found))

    output_rows: list[dict[str, str]] = []
    for row, digits, normalized, extension_found in prepared:
        if not digits:
            issue = "missing_phone"
            action = "Buscar teléfono público antes de verificar WhatsApp."
        elif normalized == AGENCY_WHATSAPP:
            issue = "agency_number_error"
            action = "No usar; coincide con el WhatsApp de Nexo Local Studio."
        elif normalized and normalized_counts[normalized] > 1:
            issue = "duplicate_phone"
            action = "Revisar duplicado antes de verificar WhatsApp."
        elif len(digits) < 10:
            issue = "invalid_phone"
            action = "No usar; faltan dígitos."
        elif len(digits) > 13:
            issue = "needs_manual_review"
            action = "Revisar manualmente; puede incluir extensión o datos extra."
        elif not normalized:
            issue = "needs_manual_review"
            action = "No se pudo normalizar con confianza."
        elif not row.get("google_maps_url", "").strip() and not row.get("website_url", "").strip() and not row.get("instagram", "").strip():
            issue = "needs_manual_review"
            action = "Revisar fuente del teléfono antes de verificar WhatsApp."
        elif extension_found:
            issue = "needs_manual_review"
            action = "Se detectó extensión; confirmar número principal antes de verificar."
        else:
            issue = "valid_format_only"
            action = "Pasar a verificación manual de WhatsApp."

        output_rows.append({
            "business_name": row.get("business_name", ""),
            "niche": row.get("niche", ""),
            "city": row.get("city", ""),
            "zone": row.get("zone", ""),
            "original_phone": row.get("phone", ""),
            "normalized_phone": normalized,
            "phone_source": "public_business_phone_field" if row.get("phone", "").strip() else "",
            "google_maps_url": row.get("google_maps_url", ""),
            "website_url": row.get("website_url", ""),
            "instagram": row.get("instagram", ""),
            "source_confidence": source_confidence(row, issue, extension_found),
            "source_issue": issue,
            "recommended_action": action,
        })

    write_csv(output_path, output_rows)
    print(f"Audited source rows: {len(output_rows)}")
    print(f"Wrote: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
