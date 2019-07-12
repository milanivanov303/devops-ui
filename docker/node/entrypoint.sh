#!/usr/bin/env bash

set -e

ENV=${APP_ENV:-local}

if [ ${ENV} = "local" ]; then

    echo "Running the vue ui..."
    vue ui --host 0.0.0.0 --port 8000 --headless

fi
