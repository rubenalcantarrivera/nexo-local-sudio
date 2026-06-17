#!/usr/bin/env python3
"""Validate enriched outreach data before drafting emails."""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SUPPRESSION_PATH = ROOT / "outreach" / "suppression_list.csv"
EMAIL_RE = re.compile(r"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$", re.I)
OUTPUT_COLUMNS = [
    "priority", "score", "business_name", "niche", "city", "zone", "rating", "reviews_count",
    "website_status", "website_url", "google_maps_url", "phone", "email", "instagram",
    "contact_person", "problem_detected", "demo_url", "homepage_url", "email_status",
    "email_source_url", "recommended_channel", "verification_notes", "last_checked",
]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]], columns: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def ensure_suppression_list() -> None:
    if SUPPRESSION_PATH.exists():
        return
    SUPPRESSION_PATH.parent.mkdir(parents=True, exist_ok=True)
    with SUPPRESSION_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["email", "business_name", "reason", "date_added"])
        writer.writeheader()


def suppression_emails() -> set[str]:
    ensure_suppression_list()
    rows = read_csv(SUPPRESSION_PATH)
    return {row.get("email", "").strip().lower() for row in rows if row.get("email", "").strip()}


def valid_email(email: str) -> bool:
    return bool(EMAIL_RE.fullmatch((email or "").strip()))


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python3 outreach/scripts/validate_outreach_data.py outreach/enriched_prospects.csv", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    if not path.exists():
        print(f"File not found: {path}", file=sys.stderr)
        return 1

    rows = read_csv(path)
    suppressed = suppression_emails()
    seen_emails: set[str] = set()
    report = {
        "rows": len(rows),
        "missing_business_name": 0,
        "missing_demo_url": 0,
        "missing_homepage_url": 0,
        "invalid_format": 0,
        "suppressed": 0,
        "duplicate_email": 0,
        "public_email_found": 0,
        "needs_manual_verification": 0,
        "no_public_email": 0,
        "ready_for_drafting": 0,
    }

    changed = False
    for row in rows:
        email = row.get("email", "").strip().lower()
        status = row.get("email_status", "").strip() or "no_public_email"
        if not row.get("business_name", "").strip():
            report["missing_business_name"] += 1
        if not row.get("demo_url", "").strip():
            report["missing_demo_url"] += 1
        if not row.get("homepage_url", "").strip():
            report["missing_homepage_url"] += 1
        if email:
            if not valid_email(email):
                row["email_status"] = "invalid_format"
                report["invalid_format"] += 1
                changed = True
                continue
            if email in suppressed:
                row["email_status"] = "suppressed"
                report["suppressed"] += 1
                changed = True
                continue
            if email in seen_emails:
                row["email_status"] = "duplicate_email"
                report["duplicate_email"] += 1
                changed = True
                continue
            seen_emails.add(email)
        if row.get("email_status") == "public_email_found":
            report["public_email_found"] += 1
            if email and valid_email(email):
                report["ready_for_drafting"] += 1
        elif row.get("email_status") == "needs_manual_verification":
            report["needs_manual_verification"] += 1
        elif row.get("email_status") == "no_public_email":
            report["no_public_email"] += 1

    if changed:
        write_csv(path, rows, OUTPUT_COLUMNS)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if report["missing_business_name"] or report["missing_demo_url"] or report["missing_homepage_url"]:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
