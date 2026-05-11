---
title: FAQ
description: Frequently asked questions about Cinch.
---

## General

### What is the maximum clip size?

By default, the hosted relay accepts clips up to **20 MB**. Self-hosted relays can raise this limit with the `MAX_BODY_MB` environment variable (up to whatever your server's RAM allows).

### Which platforms does Cinch support?

The CLI (`cinch push` / `cinch pull` / `cinch auth`) runs on:

- macOS (Apple Silicon)
- Linux (x86_64, ARM64)
- Windows (x86_64)

The [desktop app](https://github.com/cinchcli/desktop) (macOS) receives clips automatically and copies them to your clipboard. Linux and Windows builds are planned.

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

Only devices that share your encryption key. Clips are encrypted with **AES-256-GCM on your device** before they leave — the relay receives and stores ciphertext only. Your encryption key is generated at `cinch auth login` and stored locally (macOS Keychain on macOS, Secret Service on Linux, plaintext config fallback if no keyring is available).

This means Cinch staff operate the hosted relay infrastructure but have **no ability to decrypt your clips** — the key never touches the server.

For an additional layer of control, you can also self-host the relay so the ciphertext itself stays on your hardware — see [Self-hosting](/docs/relay/self-hosting/).

### How long are clips kept?

The hosted relay deletes clips after **7 days**. Self-hosted relays default to 7 days and can be configured with `RETENTION_DAYS`.

### Is the connection encrypted?

Two layers:

1. **Transport (TLS)**: All HTTP and WebSocket traffic runs over HTTPS / WSS. The hosted relay enforces TLS. If you self-host, terminate TLS at a reverse proxy (Caddy, nginx, Cloudflare Tunnel).
2. **End-to-end (AES-256-GCM)**: Independently of TLS, every clip is encrypted on the sending device with a key the server never sees, and decrypted on the receiving device. Even an operator with full access to the relay database sees only ciphertext.

---

## CI / Automation

### How do I use Cinch in GitHub Actions or other CI systems?

Set `CINCH_TOKEN` and `CINCH_RELAY_URL` as environment variables. The CLI reads them automatically — no config file needed.

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install cinch
        run: curl -fsSL https://cinchcli.com/install.sh | sh

      - name: Push build status
        env:
          CINCH_TOKEN: ${{ secrets.CINCH_TOKEN }}
          CINCH_RELAY_URL: ${{ vars.CINCH_RELAY_URL }}
        run: echo "Build ${{ github.run_number }} passed" | cinch push --label "ci"
```

Get your token from `cinch auth status` or generate a dedicated one with `cinch auth regenerate-pair-token`.

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
