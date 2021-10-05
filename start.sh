#!/bin/bash

PARENT_COMMAND=$(ps -o comm= $PPID)

# Install dependencies
$PARENT_COMMAND npm install

# Start development server
$PARENT_COMMAND npm run serve
