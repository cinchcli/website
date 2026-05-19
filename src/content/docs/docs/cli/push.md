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
| `--silent` | `-s` | bool | `false` | Suppress success output |
| `--type` | | string | — | Force content type. Accepts `image` or any `image/*` MIME to override the image-vs-text decision. Text subtypes (`text` / `url` / `code`) are derived automatically and cannot be forced. |
| `--text` | | bool | `false` | Force text mode, skip image auto-detection |
| `--to` | | string | — | Send only to the device with this nickname or hostname. Resolved via `GET /devices`. The relay returns `device_offline` if the target is not currently connected. |
| `--token` | | string | — | Override auth token (for CI/automation; prefer `CINCH_TOKEN` env var) |
| `--relay` | | string | — | Override relay URL (prefer `CINCH_RELAY_URL` env var) |

## Content types

Every clip is tagged with one of four canonical `content_type` values, derived on the client by `client_core::classify::detect`:

| Value | When emitted |
|---|---|
| `image` | PNG / JPEG / GIF / WebP magic bytes, or `--type image/*`. |
| `url` | The whole stdin payload parses as a single URL. |
| `code` | Matches a shebang, JSON shape, or code heuristic. |
| `text` | Default for any non-image text payload. |

There are no MIME-style strings (`text/plain`, `image/png`) on the wire — they would create skew with the relay's canonical 4-string vocabulary. See [Relay Protocol → Content types](/docs/relay/protocol/#content-types).

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
