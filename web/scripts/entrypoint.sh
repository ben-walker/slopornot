#!/bin/sh

{
  echo "window.__config__ = {"
  env | grep "^APP_" | while IFS='=' read -r key value; do
    name="${key#APP_}"
    echo "  ${name}: \"${value}\","
  done
  echo "};"
} > /usr/share/nginx/html/config.js

VERSION="${RAILWAY_GIT_COMMIT_SHA:-${RAILWAY_DEPLOYMENT_ID:-dev}}"
echo "{\"version\":\"${VERSION}\"}" > /usr/share/nginx/html/version.json

exec nginx -g "daemon off;"
