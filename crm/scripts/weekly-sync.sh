#!/bin/bash
# Weekly sync: pull new Clerk users into the "All Clerk Users" group, then
# remove opted-out emails from the Clerk group and the "All Users" master list.
# Emails are normalized (Gmail +aliases and dots) and deduplicated on insert.
#
# Usage:
#   ./scripts/weekly-sync.sh              # against localhost:4000
#   ./scripts/weekly-sync.sh https://emails.rebyte.ai   # against production
#
# Schedule with cron (every Monday 9am):
#   0 9 * * 1 cd /path/to/emails && ./scripts/weekly-sync.sh

set -euo pipefail

BASE_URL="${1:-http://localhost:4000}"
GROUP_ID=12  # "All Clerk Users" (dynamic, preset=all_users)

# Emails excluded from Weekly / Product Updates. Removed from the groups below
# after every sync. To opt someone out, add their address here.
EXCLUDE=(
  "ninghu@gmail.com"
  "ning.hu@gmail.com"
)
EXCLUDE_FROM_GROUPS=(12 13)  # All Clerk Users, All Users (master)

echo "=== Weekly Sync — $(date) ==="
echo "Target: ${BASE_URL}/api/groups/${GROUP_ID}/sync"

RESPONSE=$(curl -sf -X POST "${BASE_URL}/api/groups/${GROUP_ID}/sync" \
  -H "Content-Type: application/json")

MEMBER_COUNT=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['member_count'])")
SYNCED_AT=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['last_synced_at'])")

echo "Synced. Members: ${MEMBER_COUNT}, Synced at: ${SYNCED_AT}"

echo "Removing ${#EXCLUDE[@]} excluded email(s) from groups: ${EXCLUDE_FROM_GROUPS[*]}"
for email in "${EXCLUDE[@]}"; do
  for gid in "${EXCLUDE_FROM_GROUPS[@]}"; do
    # DELETE by email; 404 (already absent) is fine, so no -f here.
    curl -s -X DELETE "${BASE_URL}/api/groups/${gid}/members" \
      -H "Content-Type: application/json" \
      -d "{\"email\": \"${email}\"}" > /dev/null
    echo "  removed ${email} from group ${gid}"
  done
done

echo "Done."
