#!/bin/bash

set -e

source "$(dirname "$0")/load-env.sh"

docker compose up -d --wait
drizzle-kit push
tsx "$(dirname "$0")/db-seed.ts"
tsx watch ./src/main.ts
