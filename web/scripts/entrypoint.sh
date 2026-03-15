#!/bin/sh

{
  echo "window.__config__ = {"
  env | grep "^APP_" | while IFS='=' read -r key value; do
    name="${key#APP_}"
    echo "  ${name}: \"${value}\","
  done
  echo "};"
} > /usr/share/nginx/html/config.js

exec nginx -g "daemon off;"
