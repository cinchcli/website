#!/bin/sh
set -e

# Cinch CLI installer
# Usage: curl -fsSL https://package.jinmu.me/install.sh | sudo sh -s cinch-cli
#    or: curl -fsSL https://cinch.jinmu.me/install.sh | sh -s -- --pair <TOKEN>

PAIR_TOKEN=""
while [ $# -gt 0 ]; do
  case "$1" in
    --pair)
      PAIR_TOKEN="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  SUDO="sudo"
fi

curl -fsSL https://package.jinmu.me/install.sh | $SUDO sh -s cinch-cli

if [ -n "$PAIR_TOKEN" ]; then
  echo ""
  cinch auth pair "$PAIR_TOKEN"
fi
