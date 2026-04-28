---
title: cinch push
description: Push clipboard content to the relay server.
---

`cinch push` reads from stdin and sends the content to the relay server.

## Usage

```bash
<command> | cinch push [flags]
```

## Examples

```bash
# Push text
echo "meeting notes" | cinch push

# Push file contents
cat report.csv | cinch push

# Push git diff
git diff HEAD~1 | cinch push

# Push to a specific device
echo "hello" | cinch push --to devbox

# Push with a label (visible in desktop app history)
cat error.log | cinch push --label "build error"

# CI: push using env vars instead of stored credentials
echo "artifact url" | cinch push  # with CINCH_TOKEN + CINCH_RELAY_URL set
```

## Flags

| Flag | Short | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--label` | `-l` | string | — | Label for this clip (shown in desktop history) |
| `--ttl` | `-t` | int | `0` | Auto-delete after N seconds (`0` = no expiry) |
| `--silent` | `-s` | bool | `false` | Suppress success output |
| `--type` | | string | — | Force MIME type (e.g. `image/png`) |
| `--text` | | bool | `false` | Force text mode, skip binary auto-detection |
| `--to` | | string | — | Send only to the device with this nickname |
| `--token` | | string | — | Override auth token (for CI/automation; prefer `CINCH_TOKEN` env var) |
| `--relay` | | string | — | Override relay URL (prefer `CINCH_RELAY_URL` env var) |

## Environment variables

| Variable | Description |
|----------|-------------|
| `CINCH_TOKEN` | Auth token. Overrides stored credentials — useful in CI without touching disk. |
| `CINCH_RELAY_URL` | Relay URL. Overrides the value in `~/.cinch/config.json`. |

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Generic error |
| `2` | Authentication failure — run `cinch auth login` |
| `3` | Network error — relay unreachable |
| `4` | Relay error — server-side failure |
