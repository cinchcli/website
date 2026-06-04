---
title: cinch copy
description: Save stdin to your local clip history. Local-only — never contacts the relay.
---

`cinch copy` reads from stdin and saves it to your **local** clip history. It is local-only: the relay is never contacted, and the clip is never encrypted or sent anywhere. To share a clip across machines, use [`cinch send`](/docs/cli/send/).

Think of it as the pbcopy-shaped half of Cinch — capture terminal output, diffs, and snippets into a searchable local history, then read the latest back with `cinch paste` or browse it with `cinch history`.

## Usage

```bash
<command> | cinch copy [flags]
```

## Examples

```bash
# Save command output
cargo test 2>&1 | cinch copy

# Save a file's contents
cat report.csv | cinch copy

# Save a screenshot (classified as an image)
cat screenshot.png | cinch copy
```

On success it prints (to stderr):

```text
✓ Saved 2.1 KB to local history (id=…) · 3 ms — not sent. Use `cinch send` to share.
```

The reminder is deliberate: `copy` keeps the clip on this machine. Nothing leaves until you `cinch send`.

## Flags

| Flag | Short | Type | Default | Description |
|------|-------|------|---------|-------------|
| `--label` | `-l` | string | — | Label for this clip (shown in history). |
| `--silent` | `-s` | bool | `false` | Suppress the success line. |
| `--type` | | string | — | Force content type. Accepts `image` or any `image/*` MIME to override the image-vs-text decision. Text subtypes (`text` / `url` / `code`) are derived automatically and cannot be forced. |
| `--text` | | bool | `false` | Force text mode, skip image auto-detection. |
| `--token` | | string | — | Override auth token. Ignored in local-only mode — present so the same flags work across `copy` and `send`. |
| `--relay` | | string | — | Override relay URL. Ignored in local-only mode. |

## Content types

Same canonical 4-string vocabulary as [`cinch send`](/docs/cli/send/#content-types): `image`, `url`, `code`, `text`. Images (PNG / JPEG / GIF / WebP) are detected by magic bytes; everything else is classified by `client_core::classify::detect`. Video files are rejected.

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success. |
| `1` | Generic error — empty stdin, oversize (> 20 MB), unsupported video, or a local store failure. |
| `2` | Authentication failure in the stateless path (CI / no `~/.cinch`) when every credential source is empty — run `cinch auth login`. |
