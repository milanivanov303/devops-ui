#!/usr/bin/env bash

# Check for changed files last 20 seconds
MODIFIED=$(find /usr/local/apache2/conf/proxy/ -mmin -0.30 | wc -l)

# If there are changed files reload apache configuration
if [ ${MODIFIED} -gt 0 ]; then
  /usr/local/apache2/bin/apachectl -k graceful
fi

