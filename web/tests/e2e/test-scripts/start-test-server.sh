#!/bin/bash -eu
set -o pipefail
set -o nounset

# Start the local test server 
# Kill background processes when this script exits.
trap 'kill $(jobs -pr)' EXIT
echo "Building project"
npm run prod:build
echo "Running Test Server."
npm run test:server
