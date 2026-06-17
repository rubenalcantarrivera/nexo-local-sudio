#!/usr/bin/env python3
"""Manually verify whether public business numbers exist on WhatsApp.

This opens wa.me/[number] without a prefilled message. It never sends messages.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import sys
import webbrowser
from pathlib import Path


DEFAULT_LIMIT = 5
MAX_LIMIT = 20
VALID_INPUTS = {
    "y": "exists_on_whatsapp",
    "n": "not_on_whatsapp",
    "w": "wrong_number",
    "s": "needs_review",
}


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return list(reader.fieldnames or []), list(reader)


def write_csv(path: Path, headers: list[str], rows: list[dict[str, str]]) -> None:
    for extra in ["verification_notes", "verified_at"]:
        if extra not in headers:
            headers.append(extra)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("verification_csv")
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()

    path = Path(args.verification_csv)
    if not path.exists():
        print(f"Verification queue not found: {path}", file=sys.stderr)
        return 1
    limit = args.limit
    if limit > MAX_LIMIT:
        print(f"Requested limit {limit} is too high. Capping at {MAX_LIMIT}.")
        limit = MAX_LIMIT
    if limit < 1:
        print("Limit must be at least 1.", file=sys.stderr)
        return 1

    headers, rows = read_csv(path)
    checked = 0
    for row in rows:
        if checked >= limit:
            break
        if row.get("verification_status") != "pending_manual_check":
            continue

        print("\nBusiness:", row.get("business_name", ""))
        print("Phone:", row.get("normalized_phone", ""))
        print("Source:", row.get("phone_source", ""))
        print("Google Maps:", row.get("google_maps_url", ""))
        print("wa.me check URL:", row.get("wa_check_url", ""))
        print("No message will be sent. Inspect WhatsApp manually.")

        webbrowser.open(row.get("wa_check_url", ""))
        answer = input("Did WhatsApp open a valid chat for this business? [y] yes / [n] no / [w] wrong / [s] skip / [q] quit: ").strip().lower()
        if answer == "q":
            print("Stopped. Progress saved.")
            break
        if answer not in VALID_INPUTS:
            print("Unrecognized answer; marking as needs_review.")
            answer = "s"

        row["verification_status"] = VALID_INPUTS[answer]
        row["verified_at"] = dt.datetime.now().isoformat(timespec="seconds")
        note = input("Optional note (Enter to skip): ").strip()
        if note:
            row["verification_notes"] = note
        write_csv(path, headers, rows)
        checked += 1

    print(f"Verified this run: {checked}")
    print("No messages were sent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
