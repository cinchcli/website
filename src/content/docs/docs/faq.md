---
title: FAQ
description: Frequently asked questions about Cinch.
---

## General

### What is the maximum clip size?

The hosted relay accepts text clips up to **1 MB** and binary clips up to **20 MB**. Self-hosted relays inherit the same defaults; raising them is a code change in `relay/internal/relay/handler.go`.

### Which platforms does Cinch support?

The CLI (`cinch copy` / `cinch send` / `cinch pull` / `cinch auth`) runs on:

- macOS (Apple Silicon)
- Linux (x86_64, ARM64)
- Windows (x86_64)

The [desktop app](https://cinchcli.com/download/) (macOS, Apple Silicon) receives clips automatically and copies them to your clipboard. Install with `brew install --cask cinchcli/tap/cinchcli`. Linux and Windows users get the CLI only — `cinch pull` polls or subscribes via WebSocket.

### Does Cinch support binary data and images?

Yes. `cinch copy` and `cinch send` read raw bytes from stdin and classify each clip into one of four canonical content types (`image`, `text`, `url`, `code`). PNG / JPEG / GIF / WebP images are detected by magic bytes; the rest is classified by URL / shebang / JSON heuristics. See [Content types](/docs/relay/protocol/#content-types).

```bash
cat screenshot.png | cinch send
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

The hosted relay deletes clips after **7 days** by default. It is a free, best-effort onboarding surface with fair-use and abuse limits and a lower uptime expectation than a self-hosted deployment you control. Self-hosted relays inherit the same default unless you configure a different policy.

### Is the hosted relay a paid plan?

No. Hosted relay access is free and best-effort. It is not a paid personal plan. Commercial support is for self-hosting setup help, migration support, deployment guidance, and support agreement discussions.

### Does Cinch send clipboard history to AI providers?

Only when you explicitly run `cinch ai ...` without `--no-send` and have configured a provider. `cinch copy`, `cinch send`, `cinch pull`, desktop sync, and `cinch mcp` do not call AI providers. `cinch mcp` is read-only, and local-only by default (fleet-scoped reads require `CINCH_MCP_FLEET=1`).

### Is the connection encrypted?

Two layers:

1. **Transport (TLS)**: All HTTP and WebSocket traffic runs over HTTPS / WSS. The hosted relay enforces TLS. If you self-host, terminate TLS at a reverse proxy (Caddy, nginx, Cloudflare Tunnel).
2. **End-to-end (AES-256-GCM)**: Independently of TLS, every clip is encrypted on the sending device with a key the server never sees, and decrypted on the receiving device. Even an operator with full access to the relay database sees only ciphertext.

---

## CI / Automation

### How do I use Cinch in GitHub Actions or other CI systems?

Set `CINCH_TOKEN` and `CINCH_RELAY_URL` as environment variables. The CLI reads them automatically — no config file needed.

Because `cinch send` is end-to-end encrypted, the runner also needs your encryption key — a token alone can authenticate but not encrypt. Provision it with `cinch auth recovery restore` or a pre-seeded `~/.cinch/config.json` before sending from CI. (If you only need output captured on the box itself, `cinch copy` is local-only and needs no key.)

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install cinch
        run: curl -fsSL https://cinchcli.com/install.sh | sh

      - name: Send build status
        env:
          CINCH_TOKEN: ${{ secrets.CINCH_TOKEN }}
          CINCH_RELAY_URL: ${{ vars.CINCH_RELAY_URL }}
        run: echo "Build ${{ github.run_number }} passed" | cinch send --label "ci"
```

Get your token from `cinch auth status`. To add a new machine in one step, use `cinch fleet add <ssh-target>` from a signed-in device — see [`cinch auth & cinch fleet add`](/docs/cli/auth/).

---

## Troubleshooting

### `cinch send` hangs

This usually means the relay is unreachable. Check:

1. Is your relay running? Try `curl https://your-relay/health`.
2. Is `CINCH_RELAY_URL` set correctly?
3. Is port 8080 (or your configured port) open in the firewall?

### `cinch pull` returns nothing

The relay has no recent clip to return. Send something first, or check `cinch auth status` to confirm the device is paired.

### Authentication fails after re-installing

Run `cinch auth logout`, then sign in fresh with `cinch auth login` (or use `cinch fleet add <ssh-target>` from another signed-in machine to provision this one over SSH).
