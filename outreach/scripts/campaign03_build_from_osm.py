#!/usr/bin/env python3
"""Build Campaign 03 candidate files from public OpenStreetMap data.

This script uses Overpass API as a public source. It does not scrape private
profiles, does not use WhatsApp APIs, and does not invent phone numbers.

Important limitation: OpenStreetMap does not provide Google ratings/reviews.
Rows included as "No website found" mean no website/contact:website URL was
present in the public OSM business record. The verification notes disclose this.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
import time
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path

from campaign03_common import (
    CAMPAIGN_COLUMNS,
    DEDUPE_COLUMNS,
    EXCLUDED_COLUMNS,
    HOMEPAGE_URL,
    VERIFICATION_COLUMNS,
    first_message,
    normalize_phone,
    slug_text,
    today_iso,
    wa_check_url,
    write_csv,
)


ROOT = Path(__file__).resolve().parents[2]
OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

TARGET_TOTAL = 250
PHONE_AUDIT_COLUMNS = [
    "business_name",
    "niche",
    "country",
    "city",
    "zone",
    "original_phone",
    "normalized_phone",
    "phone_status",
    "phone_source",
    "source_confidence",
    "source_url",
    "google_maps_url",
    "website_status",
    "source_issue",
    "recommended_action",
]

ZONES = [
    ("Mexico", "Ciudad de México", "Lomas/Bosques/Polanco/Nápoles/San Ángel/Pedregal", 19.32, -99.27, 19.48, -99.12),
    ("Mexico", "Huixquilucan", "Interlomas/Zona Esmeralda", 19.36, -99.34, 19.45, -99.25),
    ("Mexico", "San Pedro Garza García", "San Pedro/Valle Oriente/Centrito", 25.62, -100.43, 25.72, -100.28),
    ("Mexico", "Monterrey", "San Jerónimo/Cumbres", 25.66, -100.43, 25.78, -100.32),
    ("Mexico", "Zapopan", "Andares/Puerta de Hierro/Valle Real", 20.67, -103.46, 20.77, -103.34),
    ("Mexico", "Guadalajara", "Providencia/Chapalita/Americana", 20.64, -103.42, 20.72, -103.32),
    ("Mexico", "Querétaro", "Juriquilla/Jurica/Álamos/Centro Sur", 20.56, -100.48, 20.74, -100.32),
    ("Mexico", "Puebla", "Angelópolis/Zavaleta/La Paz", 18.98, -98.28, 19.08, -98.18),
    ("Mexico", "Mérida", "Mérida Norte/Altabrisa/Montebello/Temozón", 20.98, -89.68, 21.10, -89.55),
    ("Mexico", "Cancún", "Zona Hotelera/Cumbres/Av. Bonampak", 21.08, -86.88, 21.20, -86.75),
    ("Mexico", "Tijuana", "Zona Río/Chapultepec", 32.49, -117.08, 32.55, -116.98),
    ("Mexico", "León", "Campestre/Gran Jardín/Punta del Este", 21.10, -101.75, 21.20, -101.62),
    ("Mexico", "Metepec", "Metepec/Toluca premium", 19.22, -99.66, 19.31, -99.55),
    ("Colombia", "Bogotá", "Chicó/Usaquén/Chapinero/Parque 93/Rosales", 4.62, -74.09, 4.74, -74.02),
    ("Colombia", "Bogotá", "Santa Bárbara/Cedritos/Colina", 4.66, -74.08, 4.78, -74.00),
    ("Colombia", "Medellín", "El Poblado/Provenza/Laureles/Envigado", 6.15, -75.62, 6.28, -75.53),
    ("Colombia", "Medellín", "Envigado/Sabaneta premium", 6.12, -75.60, 6.20, -75.54),
    ("Colombia", "Cali", "Granada/Ciudad Jardín", 3.35, -76.57, 3.47, -76.50),
    ("Peru", "Lima", "Miraflores/San Isidro/Surco/La Molina/Barranco", -12.18, -77.08, -12.02, -76.90),
    ("Peru", "Lima", "San Borja/Magdalena/Pueblo Libre", -12.12, -77.10, -12.04, -76.98),
    ("Chile", "Santiago", "Las Condes/Vitacura/Providencia/Ñuñoa", -33.48, -70.64, -33.34, -70.50),
    ("Chile", "Santiago", "La Reina/Peñalolén/Lo Barnechea", -33.42, -70.60, -33.32, -70.42),
    ("Argentina", "Buenos Aires", "Palermo/Recoleta/Belgrano/Puerto Madero/Núñez", -34.62, -58.48, -34.54, -58.35),
    ("Argentina", "Buenos Aires", "Caballito/Villa Urquiza/Colegiales", -34.62, -58.53, -34.55, -58.43),
    ("Panama", "Ciudad de Panamá", "Costa del Este/Punta Pacífica/Obarrio/Marbella", 8.96, -79.55, 9.04, -79.46),
    ("Panama", "Ciudad de Panamá", "El Cangrejo/Clayton/Albrook", 8.97, -79.58, 9.08, -79.50),
    ("Costa Rica", "San José/Escazú", "Escazú/Santa Ana/Rohrmoser/Curridabat", 9.88, -84.18, 9.98, -84.00),
    ("Costa Rica", "San José", "Heredia/Belén/Lindora", 9.96, -84.20, 10.05, -84.08),
    ("Dominican Republic", "Santo Domingo", "Piantini/Naco/Serrallés/Bella Vista", 18.43, -69.98, 18.50, -69.88),
    ("Dominican Republic", "Santo Domingo", "Arroyo Hondo/Ensanche Paraíso", 18.47, -70.02, 18.53, -69.90),
    ("Ecuador", "Quito", "Cumbayá/La Carolina/González Suárez", -0.23, -78.55, -0.12, -78.42),
    ("Ecuador", "Guayaquil", "Samborondón/Urdesa", -2.20, -79.95, -2.06, -79.84),
    ("Uruguay", "Montevideo", "Pocitos/Punta Carretas/Carrasco", -34.93, -56.18, -34.86, -56.03),
    ("Paraguay", "Asunción", "Villa Morra/Carmelitas", -25.32, -57.62, -25.25, -57.53),
]

NICHES = [
    ("Dental", ['node["amenity"="dentist"]', 'way["amenity"="dentist"]', 'node["healthcare"="dentist"]', 'way["healthcare"="dentist"]']),
    ("Clínica estética", ['node["healthcare"="clinic"]', 'way["healthcare"="clinic"]', 'node["shop"="beauty"]', 'way["shop"="beauty"]']),
    ("Abogado migratorio", ['node["office"="lawyer"]', 'way["office"="lawyer"]']),
    ("Fisioterapia", ['node["healthcare"="physiotherapist"]', 'way["healthcare"="physiotherapist"]']),
    ("Veterinaria", ['node["amenity"="veterinary"]', 'way["amenity"="veterinary"]']),
    ("Óptica/Oftalmología premium", ['node["shop"="optician"]', 'way["shop"="optician"]', 'node["healthcare"="optometrist"]', 'way["healthcare"="optometrist"]']),
    ("Arquitectura/interiorismo", ['node["office"="architect"]', 'way["office"="architect"]', 'node["shop"="interior_decoration"]', 'way["shop"="interior_decoration"]']),
    ("Psicología premium", ['node["healthcare"="psychotherapist"]', 'way["healthcare"="psychotherapist"]']),
    ("Restaurante boutique", ['node["amenity"="restaurant"]', 'way["amenity"="restaurant"]']),
    ("Academia privada", ['node["amenity"="language_school"]', 'way["amenity"="language_school"]', 'node["amenity"="music_school"]', 'way["amenity"="music_school"]']),
]

SOCIAL_HOSTS = ("instagram.com", "facebook.com", "wa.me", "whatsapp.com", "linktr.ee", "beacons.ai", "bio.site")


def overpass_query(country: str, city: str, zone: str, bbox: tuple[float, float, float, float]) -> str:
    south, west, north, east = bbox
    clauses: list[str] = []
    for _, selectors in NICHES:
        for selector in selectors:
            clauses.append(f'{selector}["name"]["phone"]({south},{west},{north},{east});')
            clauses.append(f'{selector}["name"]["contact:phone"]({south},{west},{north},{east});')
    return "[out:json][timeout:45];(\n" + "\n".join(clauses) + "\n);out center tags;"


def fetch_overpass(query: str) -> list[dict]:
    data = query.encode("utf-8")
    last_error: Exception | None = None
    for url in OVERPASS_URLS:
        try:
            req = urllib.request.Request(url, data=data, headers={"User-Agent": "NexoLocalStudioCampaign03/1.0"})
            with urllib.request.urlopen(req, timeout=55) as response:
                payload = json.load(response)
            return payload.get("elements", [])
        except Exception as exc:  # noqa: BLE001 - log and try next public mirror
            last_error = exc
            time.sleep(2)
    raise RuntimeError(f"Overpass request failed: {last_error}")


def niche_for(tags: dict[str, str]) -> str:
    amenity = tags.get("amenity", "")
    healthcare = tags.get("healthcare", "")
    shop = tags.get("shop", "")
    office = tags.get("office", "")
    if amenity == "dentist" or healthcare == "dentist":
        return "Dental"
    if office == "lawyer":
        return "Abogado migratorio"
    if healthcare == "physiotherapist":
        return "Fisioterapia"
    if amenity == "veterinary":
        return "Veterinaria"
    if shop == "optician" or healthcare == "optometrist":
        return "Óptica/Oftalmología premium"
    if office == "architect" or shop == "interior_decoration":
        return "Arquitectura/interiorismo"
    if healthcare == "psychotherapist":
        return "Psicología premium"
    if amenity == "restaurant":
        return "Restaurante boutique"
    if amenity in {"language_school", "music_school"}:
        return "Academia privada"
    if healthcare == "clinic" or shop == "beauty":
        return "Clínica estética"
    return ""


def website_info(tags: dict[str, str]) -> tuple[str, str, str]:
    website = tags.get("website") or tags.get("contact:website") or tags.get("url") or ""
    website = website.strip()
    if not website:
        return "No website found", "", "El registro público de OpenStreetMap no incluye sitio web oficial."
    lower = website.lower()
    if any(host in lower for host in SOCIAL_HOSTS):
        return "Only Instagram/Facebook", website, "El enlace público del registro apunta a red social/perfil, no a sitio web propio."
    return "Modern/official website found", website, "El registro público incluye un sitio web oficial; se excluye para evitar negocios con web moderna."


def score_for(row: dict[str, str]) -> tuple[int, str]:
    score = 0
    status = row["website_status"]
    if status in {"No website found", "No website on Maps/Places"}:
        score += 6
    elif status == "Only Instagram/Facebook":
        score += 5
    elif status in {"Broken website link", "Expired domain"}:
        score += 5
    elif status == "Weak/outdated website":
        score += 4
    elif status == "Website lacks clear WhatsApp/contact CTA":
        score += 3

    niche = row["niche"]
    score += {
        "Dental": 4,
        "Clínica estética": 4,
        "Abogado migratorio": 4,
        "Fisioterapia": 3,
        "Veterinaria": 3,
        "Óptica/Oftalmología premium": 3,
        "Arquitectura/interiorismo": 3,
        "Nutrición premium": 2,
        "Psicología premium": 2,
        "Restaurante boutique": 1,
        "Academia privada": 1,
    }.get(niche, 0)

    affluent = ("San Pedro", "Valle", "Andares", "Puerta", "Angelópolis", "Lomas", "Bosques", "Vitacura", "Las Condes", "Miraflores", "San Isidro", "Escazú", "Piantini", "Cumbayá")
    strong = ("Providencia", "Juriquilla", "Chicó", "Usaquén", "Chapinero", "Poblado", "Palermo", "Recoleta", "Costa del Este", "Santa Ana")
    zone = row.get("zone", "")
    if any(term in zone for term in affluent):
        score += 4
    elif any(term in zone for term in strong):
        score += 3
    else:
        score += 2

    score += 1  # public phone visible
    if score >= 18:
        priority = "A+"
    elif score >= 14:
        priority = "A"
    else:
        priority = "B"
    return score, priority


def maps_search_url(name: str, city: str, country: str) -> str:
    query = urllib.parse.quote(f"{name} {city} {country}")
    return f"https://www.google.com/maps/search/?api=1&query={query}"


def osm_source_url(element: dict) -> str:
    return f"https://www.openstreetmap.org/{element.get('type')}/{element.get('id')}"


def build_dedupe_index(root: Path, campaign_dir: Path) -> tuple[list[dict[str, str]], set[str], set[str], set[str], set[str]]:
    rows: list[dict[str, str]] = []
    phones: set[str] = set()
    names: set[str] = set()
    maps: set[str] = set()
    websites: set[str] = set()
    for path in sorted((root / "outreach").rglob("*.csv")):
        if campaign_dir in path.parents:
            continue
        try:
            with path.open(encoding="utf-8-sig", newline="") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    name = row.get("business_name", "")
                    normalized_name = slug_text(name)
                    phone = row.get("normalized_phone") or row.get("phone", "")
                    normalized_phone = "".join(ch for ch in phone if ch.isdigit())
                    google_maps_url = row.get("google_maps_url", "")
                    website_url = row.get("website_url", "")
                    instagram = row.get("instagram", "")
                    if not any([name, normalized_phone, google_maps_url, website_url, instagram]):
                        continue
                    rows.append({
                        "source_file": str(path),
                        "business_name": name,
                        "normalized_business_name": normalized_name,
                        "phone": phone,
                        "normalized_phone": normalized_phone,
                        "google_maps_url": google_maps_url,
                        "website_url": website_url,
                        "instagram": instagram,
                    })
                    if normalized_phone:
                        phones.add(normalized_phone)
                    if normalized_name:
                        names.add(normalized_name)
                    if google_maps_url:
                        maps.add(google_maps_url)
                    if website_url:
                        websites.add(website_url.rstrip("/").lower())
        except Exception:
            continue
    return rows, phones, names, maps, websites


def target_country_ok(country: str, counts: Counter) -> bool:
    target = {
        "Mexico": 130,
        "Colombia": 70,
        "Peru": 45,
        "Chile": 45,
        "Panama": 30,
        "Costa Rica": 30,
        "Argentina": 30,
        "Ecuador": 25,
        "Dominican Republic": 20,
        "Uruguay": 15,
        "Paraguay": 15,
    }
    return counts[country] < target.get(country, 10)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--campaign", default="outreach/campaigns/campaign_03_mexico_latam_250")
    parser.add_argument("--target", type=int, default=TARGET_TOTAL)
    args = parser.parse_args()

    campaign_dir = Path(args.campaign)
    campaign_dir.mkdir(parents=True, exist_ok=True)

    dedupe_rows, existing_phones, existing_names, _, existing_websites = build_dedupe_index(ROOT, campaign_dir)
    write_csv(campaign_dir / "deduplication_index.csv", dedupe_rows, DEDUPE_COLUMNS)

    raw_rows: list[dict[str, str]] = []
    excluded_rows: list[dict[str, str]] = []
    duplicate_rows: list[dict[str, str]] = []
    qualified_rows: list[dict[str, str]] = []
    phone_audit_rows: list[dict[str, str]] = []
    verification_rows: list[dict[str, str]] = []
    seen_campaign_phones: set[str] = set()
    seen_campaign_names: set[str] = set()
    country_counts: Counter = Counter()
    message = first_message(HOMEPAGE_URL)

    for country, city, zone, south, west, north, east in ZONES:
        print(f"Querying {country} / {city} / {zone}...", flush=True)
        query = overpass_query(country, city, zone, (south, west, north, east))
        try:
            elements = fetch_overpass(query)
        except Exception as exc:  # noqa: BLE001
            excluded_rows.append({
                "business_name": f"{city} query",
                "country": country,
                "city": city,
                "zone": zone,
                "reason": f"Overpass query failed: {exc}",
                "matched_existing_record": "",
                "matched_source_file": "",
                "source_url": "",
            })
            continue
        print(f"  elements: {len(elements)}", flush=True)

        for element in elements:
            tags = element.get("tags", {})
            name = tags.get("name", "").strip()
            if not name:
                continue
            niche = niche_for(tags)
            if not niche:
                continue
            phone = tags.get("phone") or tags.get("contact:phone") or ""
            normalized_phone, phone_status, phone_note = normalize_phone(phone, country)
            website_status, website_url, website_note = website_info(tags)
            source_url = osm_source_url(element)
            normalized_name = slug_text(name)
            google_maps_url = maps_search_url(name, city, country)
            raw_rows.append({
                "business_name": name,
                "niche": niche,
                "country": country,
                "city": city,
                "zone": zone,
                "phone": phone,
                "normalized_phone": normalized_phone,
                "phone_status": phone_status,
                "website_status": website_status,
                "website_url": website_url,
                "source_url": source_url,
            })

            duplicate_reason = ""
            if normalized_phone and normalized_phone in existing_phones:
                duplicate_reason = "same normalized phone as previous campaign"
            elif normalized_name and normalized_name in existing_names:
                duplicate_reason = "same normalized business name as previous campaign"
            elif website_url and website_url.rstrip("/").lower() in existing_websites:
                duplicate_reason = "same website URL as previous campaign"
            elif normalized_phone and normalized_phone in seen_campaign_phones:
                duplicate_reason = "same normalized phone inside campaign 03"
            elif normalized_name and normalized_name in seen_campaign_names:
                duplicate_reason = "same normalized business name inside campaign 03"

            if duplicate_reason:
                duplicate_rows.append({
                    "business_name": name,
                    "city": city,
                    "zone": zone,
                    "reason": duplicate_reason,
                    "matched_existing_record": normalized_phone or normalized_name,
                    "matched_source_file": "deduplication_index.csv",
                })
                continue
            if phone_status != "valid_format_only":
                excluded_rows.append({
                    "business_name": name,
                    "country": country,
                    "city": city,
                    "zone": zone,
                    "reason": phone_note,
                    "matched_existing_record": "",
                    "matched_source_file": "",
                    "source_url": source_url,
                })
                continue
            if website_status == "Modern/official website found":
                excluded_rows.append({
                    "business_name": name,
                    "country": country,
                    "city": city,
                    "zone": zone,
                    "reason": website_note,
                    "matched_existing_record": website_url,
                    "matched_source_file": "",
                    "source_url": source_url,
                })
                continue
            if not target_country_ok(country, country_counts):
                excluded_rows.append({
                    "business_name": name,
                    "country": country,
                    "city": city,
                    "zone": zone,
                    "reason": "Country quota already filled for campaign mix.",
                    "matched_existing_record": "",
                    "matched_source_file": "",
                    "source_url": source_url,
                })
                continue

            row = {
                "business_name": name,
                "niche": niche,
                "country": country,
                "city": city,
                "zone": zone,
                "rating": "",
                "reviews_count": "",
                "website_status": website_status,
                "website_url": website_url,
                "google_maps_url": google_maps_url,
                "source_url": source_url,
                "phone": phone,
                "normalized_phone": normalized_phone,
                "phone_status": phone_status,
                "instagram": website_url if "instagram.com" in website_url.lower() else "",
                "email": "",
                "contact_person": "No público",
                "problem_detected": website_note,
                "verification_notes": f"{website_note} Fuente: OpenStreetMap. Rating/reseñas no disponibles en esta fuente.",
                "homepage_url": HOMEPAGE_URL,
                "first_message": message,
                "last_checked": today_iso(),
            }
            score, priority = score_for(row)
            row["score"] = str(score)
            row["priority"] = priority
            qualified_rows.append(row)
            verification_rows.append({
                "verification_status": "pending_manual_check",
                "business_name": name,
                "niche": niche,
                "country": country,
                "city": city,
                "zone": zone,
                "original_phone": phone,
                "normalized_phone": normalized_phone,
                "wa_check_url": wa_check_url(normalized_phone),
                "google_maps_url": google_maps_url,
                "source_url": source_url,
                "phone_source": "OpenStreetMap public phone/contact:phone tag",
                "source_confidence": "medium",
                "notes": f"{phone_note} {website_note}",
                "verified_at": "",
            })
            phone_audit_rows.append({
                "business_name": name,
                "niche": niche,
                "country": country,
                "city": city,
                "zone": zone,
                "original_phone": phone,
                "normalized_phone": normalized_phone,
                "phone_status": phone_status,
                "phone_source": "OpenStreetMap phone/contact:phone tag",
                "source_confidence": "medium",
                "source_url": source_url,
                "google_maps_url": google_maps_url,
                "website_status": website_status,
                "source_issue": "valid_format_only; WhatsApp existence not yet verified",
                "recommended_action": "Run campaign03_verify_whatsapp.py before sending.",
            })
            country_counts[country] += 1
            seen_campaign_phones.add(normalized_phone)
            seen_campaign_names.add(normalized_name)

            if len(qualified_rows) >= args.target:
                break
        print(f"  qualified so far: {len(qualified_rows)}", flush=True)
        if len(qualified_rows) >= args.target:
            break
        time.sleep(1)

    write_csv(campaign_dir / "raw_candidates.csv", raw_rows, ["business_name", "niche", "country", "city", "zone", "phone", "normalized_phone", "phone_status", "website_status", "website_url", "source_url"])
    write_csv(campaign_dir / "excluded_candidates.csv", excluded_rows, EXCLUDED_COLUMNS)
    write_csv(campaign_dir / "duplicate_exclusions.csv", duplicate_rows, ["business_name", "city", "zone", "reason", "matched_existing_record", "matched_source_file"])
    write_csv(campaign_dir / "qualified_prospects.csv", qualified_rows, CAMPAIGN_COLUMNS)
    write_csv(campaign_dir / "phone_source_audit.csv", phone_audit_rows, PHONE_AUDIT_COLUMNS)
    write_csv(campaign_dir / "whatsapp_number_verification_queue.csv", verification_rows, VERIFICATION_COLUMNS)
    write_csv(campaign_dir / "whatsapp_sent_log.csv", [], ["sent_at", "business_name", "normalized_phone", "status", "notes"])
    write_csv(campaign_dir / "whatsapp_suppression_list.csv", [], ["normalized_phone", "business_name", "reason", "date_added"])

    print(f"Raw candidates: {len(raw_rows)}")
    print(f"Duplicate exclusions: {len(duplicate_rows)}")
    print(f"Excluded candidates: {len(excluded_rows)}")
    print(f"Qualified prospects: {len(qualified_rows)}")
    print(f"Campaign: {campaign_dir}")
    if len(qualified_rows) < args.target:
        print(f"WARNING: only {len(qualified_rows)} qualified prospects found from public OSM data; target was {args.target}.", file=sys.stderr)
        return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
