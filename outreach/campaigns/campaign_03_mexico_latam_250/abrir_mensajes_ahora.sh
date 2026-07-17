#!/usr/bin/env bash
set -euo pipefail

cd /Users/rubenalcantar/Downloads/nexo-local-studio
python3 outreach/scripts/campaign03_open_unverified_now.py \
  --campaign outreach/campaigns/campaign_03_mexico_latam_250 \
  --limit 250 \
  --delay 1.2
