---
title: cinch pull
description: Pull clipboard content from the relay server.
---

`cinch pull` retrieves the latest clip from the relay and writes it to stdout.

## Usage

```bash
cinch pull [flags]
```

## Examples

```bash
# Pull to stdout
cinch pull

# Pull and pipe to macOS clipboard
cinch pull | pbcopy

# Pull and open (e.g. a URL)
cinch pull | xargs open

# Pull latest clip from a specific machine
cinch pull --from prod-server

# Pull latest clip from a machine, text clips only
cinch pull --from staging --text-only

# Pull an image clip to a file
cinch pull --from prod > screenshot.png

# Pull an image directly to the Mac clipboard (TTY only)
cinch pull --from prod --copy
```

## Flags

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--from` | string | — | Pull the latest clip pushed from this device (by nickname or hostname) |
| `--text-only` | bool | `false` | Skip image clips, return the latest text clip only |
| `--copy` | bool | `false` | Copy an image clip to the system clipboard (TTY only, macOS) |

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Generic error |
| `2` | Authentication failure — run `cinch auth login` |
| `3` | Network error — relay unreachable |
| `4` | Relay error — server-side failure |
