#!/usr/bin/env python3
"""Create a manual WhatsApp existence verification queue.

The generated wa_check_url contains no message. It is only for checking whether
WhatsApp opens a valid chat for the business number.
"""

from __future__ import annotations

import csv
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SUPPRESSION_PATH = ROOT / "outreach" / "whatsapp_suppression_list.csv"
OUTPUT_COLUMNS = [
    "verification_status", "business_name", "niche", "city", "zone", "original_phone",
    "normalized_phone", "wa_check_url", "google_maps_url", "phone_source",
    "source_confidence", "notes", "verified_at", "verification_notes",
]
SKIP_STATUSES = {"do_not_contact", "baja", "suppressed"}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=OUTPUT_COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def suppressed_numbers() -> set[str]:
    if not SUPPRESSION_PATH.exists():
        return set()
    return {row.get("normalized_phone", "").strip() for row in read_csv(SUPPRESSION_PATH) if row.get("normalized_phone", "").strip()}


def existing_statuses(path: Path) -> dict[tuple[str, str], dict[str, str]]:
    if not path.exists():
        return {}
    existing: dict[tuple[str, str], dict[str, str]] = {}
    for row in read_csv(path):
        key = (row.get("business_name", "").strip(), row.get("normalized_phone", "").strip())
        if key[0] and key[1]:
            existing[key] = row
    return existing


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python3 outreach/scripts/create_whatsapp_verification_queue.py outreach/whatsapp_manual_channels.csv outreach/whatsapp_number_verification_queue.csv", file=sys.stderr)
        return 2
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    suppressed = suppressed_numbers()
    existing = existing_statuses(output_path)
    output_rows: list[dict[str, str]] = []
    skipped = 0
    for row in read_csv(input_path):
        phone = row.get("normalized_phone", "").strip()
        status = row.get("status", "").strip()
        if row.get("phone_status") != "valid_format_only":
            skipped += 1
            continue
        if not phone or phone in suppressed or status in SKIP_STATUSES:
            skipped += 1
            continue

        key = (row.get("business_name", "").strip(), phone)
        previous = existing.get(key, {})
        verification_status = previous.get("verification_status", "").strip() or "pending_manual_check"
        output_rows.append({
            "verification_status": verification_status,
            "business_name": row.get("business_name", ""),
            "niche": row.get("niche", ""),
            "city": row.get("city", ""),
            "zone": row.get("zone", ""),
            "original_phone": row.get("original_phone", "") or row.get("phone", ""),
            "normalized_phone": phone,
            "wa_check_url": f"https://wa.me/{phone}",
            "google_maps_url": row.get("google_maps_url", ""),
            "phone_source": "public_business_phone_field",
            "source_confidence": "medium",
            "notes": row.get("notes", ""),
            "verified_at": previous.get("verified_at", ""),
            "verification_notes": previous.get("verification_notes", ""),
        })

    write_csv(output_path, output_rows)
    print(f"Verification rows generated: {len(output_rows)}")
    print(f"Skipped rows: {skipped}")
    print(f"Wrote: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
