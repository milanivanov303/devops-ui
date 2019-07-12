#!/usr/bin/env bash

set -e

ENV=${APP_ENV:-local}

echo "Starting ssh deamon..."
sudo /etc/init.d/ssh start

if [ ${ENV} = "local" ]; then

    echo "Running the vue ui..."
    exec vue ui --host 0.0.0.0 --port 8000 --headless

fi

exec "$@"
