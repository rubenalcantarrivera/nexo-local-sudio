#!/usr/bin/env python3
"""Validate WhatsApp outreach queue before opening any chats."""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SUPPRESSION_PATH = ROOT / "outreach" / "whatsapp_suppression_list.csv"
VALID_STATUSES = {
    "ready_to_review", "opened_for_manual_send", "sent_manual", "replied", "interested",
    "proposal_sent", "closed", "no_response", "follow_up_due", "follow_up_1_sent",
    "follow_up_2_sent", "not_interested", "do_not_contact", "baja",
}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def ensure_suppression_list() -> None:
    if SUPPRESSION_PATH.exists():
        return
    with SUPPRESSION_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["normalized_phone", "business_name", "reason", "date_added"])
        writer.writeheader()


def suppressed_numbers() -> set[str]:
    ensure_suppression_list()
    return {row.get("normalized_phone", "").strip() for row in read_csv(SUPPRESSION_PATH) if row.get("normalized_phone", "").strip()}


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python3 outreach/scripts/validate_whatsapp_queue.py outreach/whatsapp_outreach_queue.csv", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    if not path.exists():
        print(f"Queue file not found: {path}", file=sys.stderr)
        return 1

    rows = read_csv(path)
    suppressed = suppressed_numbers()
    seen: dict[str, str] = {}
    report = {
        "rows": len(rows),
        "missing_business_name": 0,
        "missing_phone": 0,
        "invalid_phone": 0,
        "missing_message": 0,
        "missing_demo_url": 0,
        "invalid_whatsapp_url": 0,
        "invalid_status": 0,
        "duplicate_phone_same_business": 0,
        "suppressed": 0,
        "do_not_contact_rows": 0,
        "ready_to_review": 0,
    }
    for row in rows:
        business = row.get("business_name", "").strip()
        phone = row.get("normalized_phone", "").strip()
        status = row.get("status", "").strip()
        if not business:
            report["missing_business_name"] += 1
        if not phone:
            report["missing_phone"] += 1
        elif not re.fullmatch(r"\d{11,15}", phone) or not phone.startswith("52"):
            report["invalid_phone"] += 1
        if not row.get("message", "").strip():
            report["missing_message"] += 1
        if not row.get("demo_url", "").strip():
            report["missing_demo_url"] += 1
        if not row.get("whatsapp_url", "").startswith("https://wa.me/"):
            report["invalid_whatsapp_url"] += 1
        if status not in VALID_STATUSES:
            report["invalid_status"] += 1
        if phone in suppressed:
            report["suppressed"] += 1
        if status in {"do_not_contact", "baja"}:
            report["do_not_contact_rows"] += 1
        if status == "ready_to_review":
            report["ready_to_review"] += 1
        if phone:
            previous = seen.get(phone)
            if previous and previous == business:
                report["duplicate_phone_same_business"] += 1
            seen[phone] = business

    print(json.dumps(report, ensure_ascii=False, indent=2))
    errors = sum(value for key, value in report.items() if key not in {"rows", "ready_to_review"})
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
