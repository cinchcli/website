---
title: FAQ
description: Frequently asked questions about Cinch.
---

## General

### What is the maximum clip size?

By default, the hosted relay accepts clips up to **20 MB**. Self-hosted relays can raise this limit with the `MAX_BODY_MB` environment variable (up to whatever your server's RAM allows).

### Which platforms does Cinch support?

The CLI (`cinch push` / `cinch pull` / `cinch auth`) runs on:

- macOS (Apple Silicon + Intel)
- Linux (x86_64, ARM64)
- Windows (x86_64)

The desktop agent (`cinchd`) is macOS-only in the current release. Linux and Windows desktop builds are planned.

### Does Cinch support binary data and images?

Yes. `cinch push` reads raw bytes from stdin and auto-detects the MIME type from the first 512 bytes. Binary data, PNG/JPEG images, and arbitrary files are all supported.

```bash
cat screenshot.png | cinch push
cinch pull > screenshot.png
```

### Does the CLI require a GUI or a desktop session?

No. The CLI is fully headless. It works in SSH sessions, Docker containers, CI runners, and cron jobs — anywhere with outbound HTTPS access.

---

## Security

### Who can see my clips?

Only machines paired with the same relay and token. The relay stores clips encrypted at rest (SQLite + filesystem encryption). If you use the hosted relay, Cinch staff have access to the relay infrastructure but not to the content of individual clips.

For maximum privacy, self-host the relay — see [Self-hosting](/docs/relay/self-hosting/).

### How long are clips kept?

The hosted relay deletes clips after **7 days**. Self-hosted relays default to 7 days and can be configured with `RETENTION_DAYS`.

### Is the connection encrypted?

Yes. All HTTP and WebSocket traffic is over TLS (HTTPS / WSS). The hosted relay enforces TLS. If you self-host, terminating TLS at a reverse proxy (Caddy, nginx, Cloudflare Tunnel) is recommended.

---

## Troubleshooting

### `cinch push` hangs

This usually means the relay is unreachable. Check:

1. Is your relay running? Try `curl https://your-relay/health`.
2. Is `CINCH_RELAY_URL` set correctly?
3. Is port 8080 (or your configured port) open in the firewall?

### `cinch pull` returns nothing

The relay has no recent clip to return. Push something first, or check `cinch auth status` to confirm the device is paired.

### Authentication fails after re-installing

Run `cinch auth logout` then re-pair with a fresh token from `cinch auth pair`.
