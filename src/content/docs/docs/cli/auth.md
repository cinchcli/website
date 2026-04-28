---
title: cinch auth & cinch pair
description: Authentication and device pairing commands.
---

## `cinch auth login`

Create a new account and sign in. Opens a browser for GitHub or Google sign-in; once complete, credentials are saved to `~/.cinch/config.json`.

```bash
cinch auth login
```

To target a self-hosted relay:

```bash
cinch auth login --relay https://your-relay.example.com
```

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--relay` | string | `api.cinchcli.com` | Override relay URL |

---

## `cinch auth pair <token>`

Exchange a pairing token for a per-device auth token. Run this on a remote machine after generating a token with `cinch auth regenerate-pair-token` (or after `cinch auth login` on the primary device).

```bash
cinch auth pair abc123xyz
```

---

## `cinch auth status`

Show current authentication state: user ID, relay URL, and hostname.

```bash
cinch auth status
```

---

## `cinch auth logout`

Remove stored credentials locally and revoke the device on the relay.

```bash
cinch auth logout
```

---

## `cinch auth regenerate-pair-token`

Mint a new single-use pairing token to add another device without re-logging in.

```bash
cinch auth regenerate-pair-token
```

---

## `cinch auth device-code`

Start the device-code flow explicitly (non-interactive / headless). Useful in scripts where you want the device-code URL printed without the TUI wizard.

```bash
cinch auth device-code
```

---

## `cinch pair <ssh-target>`

**The fast path for remote machines.** Regenerates a pair token, SSHes into the target, installs cinch if needed, and pairs it with your account — all in one command. No manual steps on the remote end.

```bash
# Basic
cinch pair user@remotehost

# SSH alias (configured in ~/.ssh/config)
cinch pair devbox

# Skip install if cinch is already on the remote
cinch pair user@remotehost --skip-install

# Use a custom relay on the remote machine
cinch pair user@remotehost --relay-url https://custom-relay.example.com
```

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--skip-install` | bool | `false` | Skip cinch binary installation on the remote |
| `--relay-url` | string | — | Override the relay URL configured on the remote machine |

The SSH target can be anything `ssh <target>` accepts. For non-standard ports or jump hosts, configure them in `~/.ssh/config` and pass the alias as the target.
