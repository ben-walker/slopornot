#!/bin/bash

set -e

source "$(dirname "$0")/load-env.sh"

npx drizzle-kit migrate
