#!/usr/bin/env python3
"""Apply manual WhatsApp existence verification to outreach channel data."""

from __future__ import annotations

import csv
import sys
from pathlib import Path


EXCLUDE_STATUSES = {
    "not_on_whatsapp", "wrong_number", "needs_review", "pending_manual_check",
    "agency_number_error", "suppressed", "do_not_contact", "baja",
}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    if len(sys.argv) != 4:
        print("Usage: python3 outreach/scripts/apply_whatsapp_verification.py outreach/whatsapp_number_verification_queue.csv outreach/whatsapp_manual_channels.csv outreach/whatsapp_verified_channels.csv", file=sys.stderr)
        return 2
    verification_path = Path(sys.argv[1])
    channels_path = Path(sys.argv[2])
    output_path = Path(sys.argv[3])
    if not verification_path.exists():
        print(f"Verification file not found: {verification_path}", file=sys.stderr)
        return 1
    if not channels_path.exists():
        print(f"Channels file not found: {channels_path}", file=sys.stderr)
        return 1

    verification_rows = read_csv(verification_path)
    channel_rows = read_csv(channels_path)
    verification_by_key = {
        (row.get("business_name", "").strip(), row.get("normalized_phone", "").strip()): row
        for row in verification_rows
    }

    output_rows: list[dict[str, str]] = []
    for row in channel_rows:
        key = (row.get("business_name", "").strip(), row.get("normalized_phone", "").strip())
        verification = verification_by_key.get(key, {})
        verification_status = verification.get("verification_status", "").strip() or "pending_manual_check"
        if verification_status != "exists_on_whatsapp":
            continue
        if row.get("phone_status") not in {"valid_format_only", "valid"}:
            continue
        if row.get("status") in EXCLUDE_STATUSES:
            continue

        merged = dict(row)
        merged["whatsapp_verification_status"] = verification_status
        merged["whatsapp_verified_at"] = verification.get("verified_at", "")
        merged["whatsapp_verification_notes"] = verification.get("verification_notes", "")
        output_rows.append(merged)

    fieldnames = list(channel_rows[0].keys()) if channel_rows else []
    for extra in ["whatsapp_verification_status", "whatsapp_verified_at", "whatsapp_verification_notes"]:
        if extra not in fieldnames:
            fieldnames.append(extra)
    write_csv(output_path, output_rows, fieldnames)
    print(f"Verified WhatsApp channels: {len(output_rows)}")
    print(f"Wrote: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
