#!/usr/bin/env python3
"""Open a small batch of WhatsApp prefilled links for manual review.

This script never clicks Send. It only opens wa.me links in the default browser.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import random
import sys
import time
import webbrowser
from pathlib import Path


MAX_LIMIT = 20
DEFAULT_LIMIT = 5


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return list(reader.fieldnames or []), list(reader)


def write_csv(path: Path, headers: list[str], rows: list[dict[str, str]]) -> None:
    for extra in ["opened_at"]:
        if extra not in headers:
            headers.append(extra)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("queue_csv")
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()

    path = Path(args.queue_csv)
    if not path.exists():
        print(f"Queue file not found: {path}", file=sys.stderr)
        return 1
    limit = args.limit
    if limit > MAX_LIMIT:
        print(f"Requested limit {limit} is too high. Capping at {MAX_LIMIT}.")
        limit = MAX_LIMIT
    if limit < 1:
        print("Limit must be at least 1.", file=sys.stderr)
        return 1

    headers, rows = read_csv(path)
    opened = 0
    now = dt.datetime.now().isoformat(timespec="seconds")
    for row in rows:
        if opened >= limit:
            break
        if row.get("status") != "ready_to_review":
            continue
        url = row.get("whatsapp_url", "").strip()
        if not url.startswith("https://wa.me/"):
            continue
        print(f"Opening for manual review: {row.get('business_name')} -> {url[:80]}...")
        webbrowser.open(url)
        row["status"] = "opened_for_manual_send"
        row["opened_at"] = now
        opened += 1
        time.sleep(random.uniform(4, 6))

    write_csv(path, headers, rows)
    print(f"Opened {opened} WhatsApp links. You must manually review and press Send.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
