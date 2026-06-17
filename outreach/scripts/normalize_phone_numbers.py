#!/usr/bin/env python3
"""Normalize public business phone numbers for manual WhatsApp outreach.

This script does not send messages. It only prepares phone data for human-reviewed
wa.me links.
"""

from __future__ import annotations

import csv
import re
import sys
from pathlib import Path


COLUMNS = [
    "priority", "score", "business_name", "niche", "city", "zone", "rating", "reviews_count",
    "website_status", "problem_detected", "phone", "normalized_phone", "phone_status",
    "instagram", "google_maps_url", "demo_url", "homepage_url", "contact_person", "status", "notes",
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


def clean_digits(phone: str) -> str:
    return re.sub(r"\D+", "", phone or "")


def normalize_mx_phone(phone: str) -> tuple[str, str]:
    digits = clean_digits(phone)
    if not digits:
        return "", "missing_phone"
    if len(digits) == 10:
        return "52" + digits, "valid_phone"
    if len(digits) == 12 and digits.startswith("52"):
        return digits, "valid_phone"
    if len(digits) == 13 and digits.startswith("521"):
        return "52" + digits[3:], "valid_phone"
    return "", "invalid_phone"


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
    output_rows: list[dict[str, str]] = []
    for row in rows:
        normalized, phone_status = normalize_mx_phone(row.get("phone", ""))
        status = row.get("status", "").strip() or ("ready_for_queue" if phone_status == "valid_phone" else "manual_review")
        notes = row.get("verification_notes", "")
        if phone_status != "valid_phone":
            notes = (notes + " | " if notes else "") + "No se normalizó teléfono público para WhatsApp."
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

    write_csv(output_path, output_rows)
    valid = sum(1 for row in output_rows if row["phone_status"] == "valid_phone")
    invalid = len(output_rows) - valid
    print(f"Processed: {len(output_rows)}")
    print(f"Valid phones: {valid}")
    print(f"Invalid/missing phones: {invalid}")
    print(f"Wrote: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
