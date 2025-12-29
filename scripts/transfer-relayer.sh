#!/usr/bin/env bash
# Wrapper to securely prompt for the old private key and run the Node transfer script.
set -euo pipefail

# Change to home to avoid repo-sensitive directories
cd "$HOME"

if [ -z "${RPC_URL-}" ]; then
  read -p "RPC_URL: " RPC_URL
fi

if [ -z "${DEST-}" ]; then
  read -p "DEST (recipient address): " DEST
fi

read -s -p "Private key (0x...): " OLD_PK; echo

export RPC_URL DEST OLD_PK

node "$(dirname "$0")/transfer-relayer.mjs"

unset OLD_PK

echo "Done."
