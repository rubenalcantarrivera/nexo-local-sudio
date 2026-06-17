#!/usr/bin/env python3
"""Prepare a safe mail-merge CSV from reviewed outreach rows."""

from __future__ import annotations

import csv
import re
import sys
from pathlib import Path


EMAIL_RE = re.compile(r"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$", re.I)
OUTPUT_COLUMNS = ["email", "business_name", "subject", "email_body", "demo_url", "homepage_url", "status"]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]], columns: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def valid_email(email: str) -> bool:
    return bool(EMAIL_RE.fullmatch((email or "").strip()))


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python3 outreach/scripts/prepare_mailmerge_csv.py outreach/ready_to_draft.csv outreach/mailmerge_ready.csv", file=sys.stderr)
        return 2
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    if not input_path.exists():
        print(f"File not found: {input_path}", file=sys.stderr)
        return 1

    rows = read_csv(input_path)
    output_rows = []
    for row in rows:
        if row.get("status") != "ready_to_review":
            continue
        email = row.get("email", "").strip().lower()
        if not email or not valid_email(email):
            continue
        if row.get("email_status") != "public_email_found":
            continue
        output_rows.append({
            "email": email,
            "business_name": row.get("business_name", ""),
            "subject": row.get("subject", ""),
            "email_body": row.get("email_body", ""),
            "demo_url": row.get("demo_url", ""),
            "homepage_url": row.get("homepage_url", ""),
            "status": row.get("status", ""),
        })

    write_csv(output_path, output_rows, OUTPUT_COLUMNS)
    print(f"Mail merge rows: {len(output_rows)}")
    print(f"Wrote: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
