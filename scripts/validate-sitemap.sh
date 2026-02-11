#!/usr/bin/env bash
set -euo pipefail

SITE_URL="${SITE_URL:-https://booz.bar}"
SITEMAP="./.output/public/sitemap.xml"

if [ ! -f "$SITEMAP" ]; then
  echo "ERROR: Sitemap not found at $SITEMAP"
  exit 1
fi

if ! grep -q "$SITE_URL" "$SITEMAP"; then
  echo "ERROR: Sitemap does not contain expected site URL: $SITE_URL"
  exit 1
fi

if grep -q '<loc>/' "$SITEMAP"; then
  echo "ERROR: Sitemap contains relative <loc> entries. Expected absolute URLs including $SITE_URL."
  exit 1
fi

echo "Sitemap checks passed (contains $SITE_URL and no relative <loc> entries)."
