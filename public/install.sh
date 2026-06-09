#!/bin/sh
set -eu

# Cinch CLI installer.
#
# Usage:
#   curl -fsSL https://cinchcli.com/install.sh | sh
#   curl -fsSL https://cinchcli.com/install.sh | sh -s -- --prefix=$HOME/.local
#
# Downloads the latest signed CLI archive from cinchcli/cinch releases on
# GitHub, verifies the SHA-256 against the published checksum, and installs
# `cinch` into <prefix>/bin (default: /usr/local).
#
# After install, `cinch update` keeps the binary fresh (downloads from
# the same release URL and atomically swaps).
#
# On macOS the recommended install is Homebrew; this script prints the
# canonical commands and exits.

REPO="cinchcli/cinch"
RELEASE_BASE="https://github.com/${REPO}/releases/latest/download"
PREFIX="/usr/local"

while [ $# -gt 0 ]; do
  case "$1" in
    --prefix=*) PREFIX="${1#--prefix=}"; shift ;;
    --prefix)   PREFIX="$2"; shift 2 ;;
    -h|--help)
      sed -n '3,16p' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) printf 'install.sh: unknown argument: %s\n' "$1" >&2; exit 2 ;;
  esac
done

info() { printf '\033[1;34m::\033[0m %s\n' "$*"; }
err()  { printf '\033[1;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

run_root() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
  elif command -v sudo >/dev/null 2>&1; then
    sudo "$@"
  else
    err "This installer needs to write to ${PREFIX}/bin. Re-run as root, install sudo, or pass --prefix=\$HOME/.local."
  fi
}

# Map (uname -s, uname -m) → cinch-cli release asset (Rust target triple).
detect_triple() {
  os="$(uname -s)"
  arch="$(uname -m)"
  case "${os}_${arch}" in
    Linux_x86_64|Linux_amd64)
      echo "x86_64-unknown-linux-gnu.tar.gz" ;;
    Linux_aarch64|Linux_arm64)
      echo "aarch64-unknown-linux-gnu.tar.gz" ;;
    Darwin_arm64|Darwin_aarch64)
      echo "aarch64-apple-darwin.tar.gz" ;;
    *)
      err "Unsupported platform: ${os}/${arch}. Cinch CLI is published for Linux x86_64, Linux arm64, macOS arm64, and Windows x86_64." ;;
  esac
}

case "$(uname -s)" in
  Darwin)
    cat <<EOF
Cinch on macOS — Homebrew is recommended:

  Desktop app (with embedded CLI on PATH):
    brew install --cask cinchcli/tap/cinchcli

  CLI only:
    brew install cinchcli/tap/cinchcli

To install the standalone CLI tarball anyway, re-run with FORCE_TARBALL=1:

  curl -fsSL https://cinchcli.com/install.sh | FORCE_TARBALL=1 sh

EOF
    if [ "${FORCE_TARBALL:-0}" != "1" ]; then
      exit 0
    fi
    ;;
esac

ASSET_SUFFIX="$(detect_triple)"
ASSET="cinch-cli-${ASSET_SUFFIX}"
URL="${RELEASE_BASE}/${ASSET}"
SHA_URL="${URL}.sha256"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

info "Downloading ${ASSET}..."
curl -fsSL --proto '=https' --tlsv1.2 -o "$WORK/$ASSET"            "$URL"
curl -fsSL --proto '=https' --tlsv1.2 -o "$WORK/${ASSET}.sha256"   "$SHA_URL"

info "Verifying SHA-256..."
# Both `shasum -a 256 -c` (macOS, busybox) and `sha256sum -c` (Linux) accept
# the same "<hex>  <filename>" format the workflow emits.
cd "$WORK"
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum -c "${ASSET}.sha256"
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 -c "${ASSET}.sha256"
else
  err "Neither sha256sum nor shasum found; cannot verify download."
fi
cd - >/dev/null

info "Extracting..."
tar -xzf "$WORK/$ASSET" -C "$WORK"
[ -f "$WORK/cinch" ] || err "Archive did not contain a 'cinch' binary."
chmod +x "$WORK/cinch"

info "Installing to ${PREFIX}/bin/cinch..."
run_root mkdir -p "${PREFIX}/bin"
run_root mv "$WORK/cinch" "${PREFIX}/bin/cinch"

# Short alias: link `ci` → cinch. Idempotent on re-runs — our own symlink is
# left in place — but a foreign `ci` (RCS check-in or the user's own) is never
# clobbered.
if [ -L "${PREFIX}/bin/ci" ] && [ "$(readlink "${PREFIX}/bin/ci")" = "cinch" ]; then
  info "'ci' alias already points to cinch."
elif command -v ci >/dev/null 2>&1 || [ -e "${PREFIX}/bin/ci" ]; then
  info "Skipping 'ci' alias — a different 'ci' command already exists. Use 'cinch'."
else
  run_root ln -s cinch "${PREFIX}/bin/ci"
  info "Also linked 'ci' as a short alias for 'cinch'."
fi

info "Installed $("${PREFIX}/bin/cinch" --version 2>/dev/null || echo cinch)."
cat <<EOF

Next steps:
  ${PREFIX}/bin/cinch auth login         # authenticate this machine
  ${PREFIX}/bin/cinch --help             # see all subcommands
  ${PREFIX}/bin/cinch update             # upgrade later (no need to re-run this installer)

If ${PREFIX}/bin isn't on your PATH, add it to your shell's rc file:
  export PATH="${PREFIX}/bin:\$PATH"
EOF
