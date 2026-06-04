---
title: cinch send
description: Encrypt stdin and send it to your whole fleet through the relay.
---

`cinch send` reads from stdin, encrypts the content end-to-end, and broadcasts it to every device on your account through the relay. Unlike [`cinch copy`](/docs/cli/copy/) (local-only), `send` contacts the relay.

Encryption is always on: the clip is encrypted with your AES-256 key on this machine before it leaves, so the relay only ever stores ciphertext.

## Usage

```bash
<command> | cinch send [flags]
```

`send` is **stdin-only** and **broadcast-only** — it has no `--to` / `--target` flag and no positional clip reference. Every send goes to your whole fleet; pick a specific machine on the read side with [`cinch pull --from <device>`](/docs/cli/pull/).

## Examples

```bash
# Send text
echo "meeting notes" | cinch send

# Send file contents
cat report.csv | cinch send

# Send a git diff
git diff HEAD~1 | cinch send

# Send a label-tagged clip (visible in desktop history)
cat error.log | cinch send --label "build error"

# CI: send using env vars instead of stored credentials
echo "artifact url" | cinch send  # needs CINCH_TOKEN + CINCH_RELAY_URL + the encryption key
```

On success it prints (to stderr):

```text
✓ Sent to your fleet (E2EE)
```

If the relay is unreachable, the clip is written to the local queue and retried on the next `cinch` command:

```text
⚠ Queued offline — will retry on next cinch command (id=…)
```

## Encryption key required

`cinch send` needs the AES master key on this machine — a token alone is not enough. The key arrives when you `cinch auth login` (or is shared from a paired device). On a headless box, provision it with `cinch auth recovery restore` or a pre-seeded `~/.cinch/config.json`.

If the key is missing, `send` fails fast (exit `5`) rather than silently queuing a never-encrypted clip. If you signed in but a paired device hasn't shared the key yet, it exits `6` — run `cinch auth retry-key`.

## Flags

| Flag | Short | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--label` | `-l` | string | — | Label for this clip (shown in desktop history). |
| `--silent` | `-s` | bool | `false` | Suppress the success line. A queued-offline warning still prints. |
| `--type` | | string | — | Force content type. Accepts `image` or any `image/*` MIME to override the image-vs-text decision. Text subtypes (`text` / `url` / `code`) are derived automatically and cannot be forced. |
| `--text` | | bool | `false` | Force text mode, skip image auto-detection. |
| `--require-online` | | bool | `false` | Treat an offline-queued clip as a failure (exit `3`) instead of exit `0`. Use in CI where a queued-but-unsent clip means the box died with the clip still local. |
| `--token` | | string | — | Override auth token (for CI/automation; prefer `CINCH_TOKEN` env var). |
| `--relay` | | string | — | Override relay URL (prefer `CINCH_RELAY_URL` env var). |

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
| `0` | Success (sent, or queued offline without `--require-online`). |
| `1` | Generic error — empty stdin, oversize (> 20 MB), or unsupported media. |
| `2` | Authentication failure — run `cinch auth login`. |
| `3` | Network error — relay unreachable (also returned for a queued clip when `--require-online` is set). |
| `4` | Relay error — server-side failure. |
| `5` | Encryption key missing — run `cinch auth login`, or provision the key on headless boxes. |
| `6` | Encryption key pending from a paired device — run `cinch auth retry-key`. |
