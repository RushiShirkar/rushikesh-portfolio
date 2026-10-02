#!/bin/sh
# Point every absolute URL at a new domain.
# Usage: sh tools/set-domain.sh https://www.example.com/
set -e
OLD="${2:-https://rushishirkar.com/}"
NEW="$1"
[ -n "$NEW" ] || { echo "usage: sh tools/set-domain.sh https://new-domain/ [old-domain/]"; exit 1; }
case "$NEW" in */) ;; *) NEW="$NEW/";; esac
cd "$(dirname "$0")/.."
for f in index.html robots.txt sitemap.xml llms.txt 404.html; do
  sed -i.bak "s|$OLD|$NEW|g" "$f" && rm "$f.bak"
done
echo "Updated to $NEW. Remember to update lastmod in sitemap.xml."
