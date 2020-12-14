#!/usr/bin/env sh

export NGINX_RELOADED_FILE=/var/run/nginx.reloaded

echo 0 > $NGINX_RELOADED_FILE

while true
do

  # Check for changed files since last reload
  export NGINX_MODIFIED=$(find /etc/nginx/conf.d/proxy/ -newer $NGINX_RELOADED_FILE | wc -l)

  # If there are changed files reload nginx configuration
  if [ ${NGINX_MODIFIED} -gt 0 ]; then
    nginx -s reload
    echo 1 > $NGINX_RELOADED_FILE
  fi

  sleep 10

done
