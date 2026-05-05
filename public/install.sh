#!/bin/sh
set -e

# Cinch CLI installer
# Usage: curl -fsSL https://cinchcli.com/install.sh | sh
#    or: curl -fsSL https://cinchcli.com/install.sh | sh -s cinch

PAIR_TOKEN=""
PKG="cinch"
while [ $# -gt 0 ]; do
  case "$1" in
    --pair)
      PAIR_TOKEN="$2"
      shift 2
      ;;
    -*)
      shift
      ;;
    *)
      PKG="$1"
      shift
      ;;
  esac
done

REPO_URL="https://cinchcli.com"
REPO_NAME="cinchcli"
LEGACY_REPO_NAMES="jinmugo sls"

info() { printf '\033[1;34m::\033[0m %s\n' "$*"; }
err()  { printf '\033[1;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

run_root() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
  elif command -v sudo >/dev/null 2>&1; then
    sudo "$@"
  else
    err "This installer needs root privileges. Re-run as root or install sudo."
  fi
}

detect_distro() {
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    case "$ID $ID_LIKE" in
      *debian*|*ubuntu*) echo "deb" ;;
      *fedora*|*rhel*|*centos*|*rocky*|*alma*|*ol*) echo "rpm" ;;
      *) err "Unsupported distro: $ID" ;;
    esac
  elif command -v apt-get >/dev/null 2>&1; then
    echo "deb"
  elif command -v dnf >/dev/null 2>&1 || command -v yum >/dev/null 2>&1; then
    echo "rpm"
  else
    err "Could not detect package manager"
  fi
}

cleanup_legacy_repos() {
  for name in $LEGACY_REPO_NAMES; do
    if [ "$1" = "deb" ]; then
      run_root rm -f "/etc/apt/keyrings/${name}.gpg"
      run_root rm -f "/etc/apt/sources.list.d/${name}.list"
    elif [ "$1" = "rpm" ]; then
      run_root rm -f "/etc/yum.repos.d/${name}.repo"
    fi
  done
}

setup_deb() {
  info "Setting up cinchcli apt repository..."

  if ! command -v curl >/dev/null 2>&1 || ! command -v gpg >/dev/null 2>&1; then
    run_root apt-get update -qq
    run_root apt-get install -y -qq curl gnupg
  fi

  run_root mkdir -p /etc/apt/keyrings
  curl -fsSL "${REPO_URL}/gpg.key" | gpg --dearmor --yes | run_root tee "/etc/apt/keyrings/${REPO_NAME}.gpg" >/dev/null

  echo "deb [signed-by=/etc/apt/keyrings/${REPO_NAME}.gpg] ${REPO_URL}/deb stable main" \
    | run_root tee "/etc/apt/sources.list.d/${REPO_NAME}.list" >/dev/null
}

setup_rpm() {
  info "Setting up cinchcli yum/dnf repository..."

  run_root mkdir -p /etc/pki/rpm-gpg
  curl -fsSL "${REPO_URL}/gpg.key" | run_root tee "/etc/pki/rpm-gpg/RPM-GPG-KEY-${REPO_NAME}" >/dev/null
  run_root rpm --import "/etc/pki/rpm-gpg/RPM-GPG-KEY-${REPO_NAME}" >/dev/null 2>&1 || true

  cat << EOF | run_root tee "/etc/yum.repos.d/${REPO_NAME}.repo" >/dev/null
[${REPO_NAME}]
name=${REPO_NAME}
baseurl=${REPO_URL}/rpm
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-${REPO_NAME}
EOF
}

install_pkg() {
  if [ "$2" = "deb" ]; then
    info "Installing $1..."
    run_root apt-get update -qq
    run_root apt-get install -y "$1"
  elif [ "$2" = "rpm" ]; then
    info "Installing $1..."
    if command -v dnf >/dev/null 2>&1; then
      run_root dnf install -y "$1"
    else
      run_root yum install -y "$1"
    fi
  fi
}

DISTRO="$(detect_distro)"
cleanup_legacy_repos "$DISTRO"

if [ "$DISTRO" = "deb" ]; then
  setup_deb
elif [ "$DISTRO" = "rpm" ]; then
  setup_rpm
fi

install_pkg "$PKG" "$DISTRO"

if [ -n "$PAIR_TOKEN" ]; then
  echo ""
  cinch auth pair "$PAIR_TOKEN"
fi
