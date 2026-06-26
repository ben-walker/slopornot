#!/bin/sh

{
  echo "window.__config__ = {"
  env | grep "^APP_" | while IFS='=' read -r key value; do
    name="${key#APP_}"
    echo "  ${name}: \"${value}\","
  done
  echo "};"
} > /usr/share/nginx/html/config.js

echo "version: $RAILWAY_GIT_COMMIT_SHA"
echo "version2: $RAILWAY_DEPLOYMENT_ID"

exec nginx -g "daemon off;"
