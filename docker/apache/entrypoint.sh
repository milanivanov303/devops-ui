#!/usr/bin/env bash

set -e

echo "Starting ssh deamon..."
/etc/init.d/ssh start

echo "Starting cron ..."
cron

echo "Starting apache ..."
httpd-foreground
