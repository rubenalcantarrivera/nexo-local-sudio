#!/usr/bin/env python3
"""Find public business emails for Nexo Local Studio outreach.

This script is intentionally conservative:
- It never guesses emails.
- It only records emails found on public pages.
- It marks directory/search discoveries as needing manual verification.
- It does not send email.
"""

from __future__ import annotations

import csv
import datetime as dt
import html
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[2]
OUTREACH_DIR = ROOT / "outreach"
LOG_PATH = OUTREACH_DIR / "email_research_log.csv"
USER_AGENT = "Mozilla/5.0 (compatible; NexoLocalStudioResearch/1.0; public-contact-research)"
TIMEOUT = 10
REQUEST_DELAY_SECONDS = 0.6

EMAIL_RE = re.compile(r"(?<![\w.+-])([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})(?![\w.+-])", re.I)
MAILTO_RE = re.compile(r"mailto:([^\"'?#>\s]+)", re.I)
HREF_RE = re.compile(r"<a\s+[^>]*href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", re.I | re.S)
SCRIPT_STYLE_RE = re.compile(r"<(script|style|noscript)\b.*?</\1>", re.I | re.S)
TAG_RE = re.compile(r"<[^>]+>")

FALSE_EMAIL_PARTS = (
    "example@", "test@", "noreply", "no-reply", "donotreply", "sentry", "cloudflare",
    "wixpress", "wordpress", "mailchimp", "sendgrid", "schema@", "privacy@placeholder",
)
SEARCH_HOST_BLOCKLIST = (
    "bing.com", "microsoft.com", "google.com", "gstatic.com", "youtube.com", "youtu.be",
    "maps.google", "waze.com", "apple.com", "facebook.com/sharer", "twitter.com/share",
)
CONTACT_LINK_HINTS = (
    "contact", "contacto", "about", "nosotros", "ubicacion", "ubicación", "privacidad",
    "privacy", "aviso", "legal",
)

INPUT_COLUMNS = [
    "priority", "score", "business_name", "niche", "city", "zone", "rating", "reviews_count",
    "website_status", "website_url", "google_maps_url", "phone", "email", "instagram",
    "contact_person", "problem_detected", "demo_url", "homepage_url", "first_message",
    "verification_notes", "last_checked",
]
OUTPUT_COLUMNS = [
    "priority", "score", "business_name", "niche", "city", "zone", "rating", "reviews_count",
    "website_status", "website_url", "google_maps_url", "phone", "email", "instagram",
    "contact_person", "problem_detected", "demo_url", "homepage_url", "email_status",
    "email_source_url", "recommended_channel", "verification_notes", "last_checked",
]
LOG_COLUMNS = [
    "business_name", "searched_at", "source_type", "source_url", "result", "note",
]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path: Path, rows: list[dict[str, str]], columns: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def normalize_url(url: str, base: str | None = None) -> str:
    url = (url or "").strip()
    if not url:
        return ""
    url = html.unescape(url)
    if base:
        url = urllib.parse.urljoin(base, url)
    if url.startswith("//"):
        url = "https:" + url
    if not re.match(r"^https?://", url, re.I):
        url = "https://" + url
    return url


def fetch_url(url: str) -> tuple[str, str]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        final_url = response.geturl()
        content_type = response.headers.get("Content-Type", "")
        if "text" not in content_type and "html" not in content_type and "json" not in content_type:
            return final_url, ""
        raw = response.read(900_000)
    return final_url, raw.decode("utf-8", errors="ignore")


def visible_text(markup: str) -> str:
    cleaned = SCRIPT_STYLE_RE.sub(" ", markup)
    cleaned = TAG_RE.sub(" ", cleaned)
    return html.unescape(re.sub(r"\s+", " ", cleaned)).strip()


def valid_email(email: str) -> bool:
    email = email.strip().lower().strip(".,;:()[]{}<>")
    if not EMAIL_RE.fullmatch(email):
        return False
    if any(part in email for part in FALSE_EMAIL_PARTS):
        return False
    if email.endswith((".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg")):
        return False
    return True


def extract_emails(markup: str) -> list[tuple[str, str]]:
    found: list[tuple[str, str]] = []
    for raw in MAILTO_RE.findall(markup):
        email = urllib.parse.unquote(raw).split("?")[0].lower().strip()
        if valid_email(email):
            found.append((email, "mailto"))
    text = visible_text(markup)
    for raw in EMAIL_RE.findall(text):
        email = raw.lower().strip(".,;:()[]{}<>")
        if valid_email(email):
            found.append((email, "visible_text"))
    deduped: list[tuple[str, str]] = []
    seen: set[str] = set()
    for email, source_type in found:
        if email not in seen:
            seen.add(email)
            deduped.append((email, source_type))
    return deduped


def contact_links(markup: str, base_url: str) -> list[str]:
    links: list[str] = []
    for href, label in HREF_RE.findall(markup):
        combined = (href + " " + visible_text(label)).lower()
        if any(hint in combined for hint in CONTACT_LINK_HINTS):
            url = normalize_url(href, base_url)
            if url.startswith("http") and urllib.parse.urlparse(url).netloc == urllib.parse.urlparse(base_url).netloc:
                links.append(url)
    return list(dict.fromkeys(links))[:5]


def business_tokens(name: str) -> set[str]:
    stop = {"de", "del", "la", "el", "y", "en", "mx", "cdmx", "dr", "dra", "clinica", "clínica"}
    tokens = re.findall(r"[a-záéíóúñ0-9]{4,}", name.lower())
    return {t for t in tokens if t not in stop}


def page_mentions_business(markup: str, business_name: str) -> bool:
    text = visible_text(markup).lower()
    tokens = business_tokens(business_name)
    if not tokens:
        return True
    hits = sum(1 for token in tokens if token in text)
    return hits >= max(1, min(2, len(tokens)))


def scan_website(website_url: str, business_name: str, logs: list[dict[str, str]]) -> tuple[str, str, str]:
    start_url = normalize_url(website_url)
    if not start_url:
        return "", "", ""
    urls_to_scan = [start_url]
    try:
        final_url, markup = fetch_url(start_url)
        logs.append(log_row(business_name, "website", final_url, "fetched", "Fetched website URL."))
        for email, _source_type in extract_emails(markup):
            return email, final_url, "public_email_found"
        urls_to_scan.extend(contact_links(markup, final_url))
    except Exception as exc:  # noqa: BLE001
        logs.append(log_row(business_name, "website", start_url, "fetch_error", str(exc)))
        return "", start_url, "no_public_email"

    for url in list(dict.fromkeys(urls_to_scan[1:])):
        time.sleep(REQUEST_DELAY_SECONDS)
        try:
            final_url, markup = fetch_url(url)
            logs.append(log_row(business_name, "website_contact_page", final_url, "fetched", "Fetched contact-like page."))
            for email, _source_type in extract_emails(markup):
                return email, final_url, "public_email_found"
        except Exception as exc:  # noqa: BLE001
            logs.append(log_row(business_name, "website_contact_page", url, "fetch_error", str(exc)))
    return "", start_url, "no_public_email"


def bing_search_urls(query: str) -> Iterable[str]:
    url = "https://www.bing.com/search?q=" + urllib.parse.quote(query)
    try:
        final_url, markup = fetch_url(url)
    except Exception:
        return []
    urls: list[str] = []
    for match in re.findall(r"<a\s+href=\"(https?://[^\"]+)\"", markup, flags=re.I):
        href = html.unescape(match)
        host = urllib.parse.urlparse(href).netloc.lower()
        if any(blocked in host for blocked in SEARCH_HOST_BLOCKLIST):
            continue
        if href not in urls:
            urls.append(href)
    return urls[:4]


def search_public_email(row: dict[str, str], logs: list[dict[str, str]]) -> tuple[str, str, str]:
    business_name = row.get("business_name", "")
    city = row.get("city", "")
    zone = row.get("zone", "")
    queries = [
        f'"{business_name}" correo contacto',
        f'"{business_name}" email',
        f'"{business_name}" "{zone}" contacto',
    ]
    for query in queries:
        logs.append(log_row(business_name, "web_search", "https://www.bing.com/search?q=" + urllib.parse.quote(query), "searched", query))
        for url in bing_search_urls(query):
            time.sleep(REQUEST_DELAY_SECONDS)
            try:
                final_url, markup = fetch_url(url)
            except Exception as exc:  # noqa: BLE001
                logs.append(log_row(business_name, "search_result_page", url, "fetch_error", str(exc)))
                continue
            if not page_mentions_business(markup, business_name):
                logs.append(log_row(business_name, "search_result_page", final_url, "skipped", "Page did not clearly mention business name."))
                continue
            emails = extract_emails(markup)
            if emails:
                email, source_type = emails[0]
                status = "public_email_found" if source_type == "mailto" else "needs_manual_verification"
                logs.append(log_row(business_name, "search_result_page", final_url, status, f"Found {source_type} email."))
                return email, final_url, status
            logs.append(log_row(business_name, "search_result_page", final_url, "no_email", "No public email found on page."))
    return "", "", "no_public_email"


def recommended_channel(row: dict[str, str], email_status: str) -> str:
    if email_status == "public_email_found":
        return "email"
    if (row.get("phone") or "").strip():
        return "WhatsApp/manual phone"
    if (row.get("instagram") or "").strip():
        return "Instagram manual"
    return "Google Maps/manual verification"


def log_row(business_name: str, source_type: str, source_url: str, result: str, note: str) -> dict[str, str]:
    return {
        "business_name": business_name,
        "searched_at": dt.datetime.now().isoformat(timespec="seconds"),
        "source_type": source_type,
        "source_url": source_url,
        "result": result,
        "note": note[:500],
    }


def enrich_row(row: dict[str, str], logs: list[dict[str, str]]) -> dict[str, str]:
    enriched = {column: row.get(column, "") for column in OUTPUT_COLUMNS}
    existing_email = (row.get("email") or "").strip().lower()
    if existing_email and valid_email(existing_email):
        enriched["email"] = existing_email
        enriched["email_status"] = "public_email_found"
        enriched["email_source_url"] = "input_csv"
    elif existing_email:
        enriched["email"] = existing_email
        enriched["email_status"] = "invalid_format"
        enriched["email_source_url"] = "input_csv"
    else:
        email = source_url = status = ""
        if row.get("website_url"):
            email, source_url, status = scan_website(row["website_url"], row.get("business_name", ""), logs)
        if not email:
            email, source_url, status = search_public_email(row, logs)
        enriched["email"] = email
        enriched["email_status"] = status or "no_public_email"
        enriched["email_source_url"] = source_url
    enriched["recommended_channel"] = recommended_channel(enriched, enriched["email_status"])
    if enriched["email_status"] == "no_public_email":
        logs.append(log_row(row.get("business_name", ""), "summary", row.get("google_maps_url", ""), "no_public_email", "No public business email found. Use manual WhatsApp/Instagram/Maps channel."))
    return enriched


def available_csv_files() -> list[str]:
    return [str(path) for path in sorted((ROOT).glob("**/*.csv")) if "node_modules" not in str(path) and ".next" not in str(path)]


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python3 outreach/scripts/find_public_emails.py INPUT.csv outreach/enriched_prospects.csv", file=sys.stderr)
        return 2
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        print("Available CSV files:", file=sys.stderr)
        for csv_path in available_csv_files():
            print(f"- {csv_path}", file=sys.stderr)
        return 1

    rows = read_csv(input_path)
    logs: list[dict[str, str]] = []
    enriched_rows: list[dict[str, str]] = []
    for index, row in enumerate(rows, start=1):
        business_name = row.get("business_name", f"row {index}")
        print(f"[{index}/{len(rows)}] Researching {business_name}...")
        enriched_rows.append(enrich_row(row, logs))
        time.sleep(REQUEST_DELAY_SECONDS)

    write_csv(output_path, enriched_rows, OUTPUT_COLUMNS)
    write_csv(LOG_PATH, logs, LOG_COLUMNS)
    found = sum(1 for row in enriched_rows if row["email_status"] == "public_email_found")
    manual = sum(1 for row in enriched_rows if row["email_status"] == "needs_manual_verification")
    none = sum(1 for row in enriched_rows if row["email_status"] == "no_public_email")
    print(f"Processed: {len(enriched_rows)}")
    print(f"Public emails found: {found}")
    print(f"Needs manual verification: {manual}")
    print(f"No public email: {none}")
    print(f"Wrote: {output_path}")
    print(f"Wrote: {LOG_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
