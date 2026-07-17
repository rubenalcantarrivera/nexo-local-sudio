#!/usr/bin/env bash
set -euo pipefail

CAMPAIGN="outreach/campaigns/campaign_03_mexico_latam_250"

while true; do
  echo ""
  echo "Campaign 03 - Nexo Local Studio"
  echo "1. Status"
  echo "2. Verify WhatsApp numbers"
  echo "3. Generate queue from verified numbers"
  echo "4. Send verified WhatsApp messages"
  echo "5. Exit"
  read -r -p "> " choice

  case "$choice" in
    1)
      python3 - <<'PY'
import csv, collections
base='outreach/campaigns/campaign_03_mexico_latam_250'
def rows(name):
    try:
        return list(csv.DictReader(open(f'{base}/{name}', encoding='utf-8-sig')))
    except FileNotFoundError:
        return []
q=rows('qualified_prospects.csv')
v=rows('whatsapp_number_verification_queue.csv')
o=rows('whatsapp_outreach_queue.csv')
print(f'Qualified prospects: {len(q)}')
print('Verification:', dict(collections.Counter(r.get('verification_status','') for r in v)))
print('Queue:', dict(collections.Counter(r.get('status','') for r in o)))
PY
      ;;
    2)
      python3 outreach/scripts/campaign03_verify_whatsapp.py --campaign "$CAMPAIGN" --limit 250
      ;;
    3)
      python3 outreach/scripts/campaign03_generate_queue.py --campaign "$CAMPAIGN"
      ;;
    4)
      python3 outreach/scripts/campaign03_send_whatsapp.py --campaign "$CAMPAIGN" --limit 250
      ;;
    5)
      exit 0
      ;;
    *)
      echo "Invalid option"
      ;;
  esac
done
