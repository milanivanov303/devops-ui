#!/usr/bin/env sh
set -e

/usr/local/bin/reload &

exec "$@"
