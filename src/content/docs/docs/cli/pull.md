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

# Fetch a specific clip by ID
cinch pull --id abc123def456

# Fetch raw image bytes for a specific clip
cinch pull --id abc123def456 --raw > image.png

# Pull the latest clip from any device other than this one
cinch pull --exclude-self

# Stream new clips live (Ctrl-C to stop)
cinch pull --watch

# Stream new clips from a specific device
cinch pull --watch --from desktop
```

## Flags

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--from` | string | — | Pull the latest clip pushed from this device (by nickname or hostname) |
| `--id` | string | — | Fetch a specific clip by ID instead of "latest". Incompatible with `--from`, `--watch`, `--exclude-self` |
| `--raw` | bool | `false` | Print raw bytes only; do not write to the system clipboard |
| `--text-only` | bool | `false` | Skip image clips, return the latest text clip only |
| `--copy` | bool | `false` | Copy text content to the system clipboard (TTY only). Ignored when `--raw` is set |
| `--exclude-self` | bool | `false` | Pull the latest clip not authored by this device. Incompatible with `--from` and `--id` |
| `--watch` | bool | `false` | Subscribe to the live clip stream and print each new clip as it arrives. Combine with `--from` to filter to a single device. Incompatible with `--id` and `--exclude-self` |

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Generic error |
| `2` | Authentication failure — run `cinch auth login` |
| `3` | Network error — relay unreachable |
| `4` | Relay error — server-side failure |
