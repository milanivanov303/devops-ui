#!/usr/bin/env sh

# Check for changed files last 20 seconds
export MODIFIED=$(find /etc/nginx/conf.d/proxy/ -mmin -1 | wc -l)

# If there are changed files reload nginx configuration
if [ ${MODIFIED} -gt 0 ]; then
  nginx -s reload
fi

