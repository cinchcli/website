---
title: Getting Started
description: Install Cinch and send your first clipboard in 30 seconds.
---

## Installation

**macOS** — [Download the Desktop app](https://cinchcli.com/download) (Apple Silicon, recommended), or install the CLI via Homebrew:

```bash
brew install cinchcli/tap/cinch
```

**Linux** — Debian/Ubuntu and RHEL/Fedora:

```bash
curl -fsSL https://cinchcli.com/install.sh | sh
```

**Windows** — download `cinch_Windows_x86_64.zip` from [GitHub Releases](https://github.com/cinchcli/cinch/releases/latest), extract, and add `cinch.exe` to PATH.

Verify the install:

```bash
cinch --version
```

## Authenticate

Sign in to your Cinch account (or create one):

```bash
cinch auth login
```

This opens a browser window. Sign in with GitHub or Google — once complete, the terminal confirms:

```
✓ Signed in. Proceeding...
```

To use a self-hosted relay instead of the hosted service:

```bash
cinch auth login --relay https://your-relay.example.com
```

## Quick start

### Push

Pipe any command's output to the relay:

```bash
echo "hello from $(hostname)" | cinch push
```

### Pull

On another machine:

```bash
cinch pull
# → hello from my-server
```

### Pair a remote machine

To set up cinch on a remote server in one command — SSH in, install, and pair automatically:

```bash
cinch pair user@remotehost
```

This regenerates a pair token, SSHes in, installs cinch if needed, and pairs the machine with your account. No manual steps on the remote end.

For automatic clipboard receiving on macOS, install the [desktop app](https://github.com/cinchcli/desktop).
