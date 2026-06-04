---
title: cinch auth & cinch fleet add
description: Authentication, adding machines to your fleet, and encryption-key recovery commands.
---

## `cinch auth login`

Sign in to Cinch via the browser-based device-code flow. The relay shows a GitHub / Google OAuth page (or a self-host username form on relays without OAuth configured). Once you approve in the browser, a per-device token is written to `~/.cinch/config.json` (mode `0600`) and the AES-256 encryption key lands in the system keyring.

```bash
cinch auth login
```

To target a self-hosted relay:

```bash
cinch auth login --relay https://your-relay.example.com
```

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--relay` | string | `api.cinchcli.com` | Override relay URL (skips the interactive relay-URL prompt). |
| `--force` | bool | `false` | Force a fresh sign-in even when this machine is already authenticated. |
| `--headless` | bool | `false` | Do not auto-open a browser. Emits a single-line stdout marker with the device-code URL so an orchestrator (e.g. `cinch fleet add` over SSH) can pick it up programmatically. All other output goes to stderr. |
| `--user <EMAIL>` | string | — | Hint your account email so any signed-in device (e.g. the Cinch.app desktop) receives a push approval prompt instead of you having to copy the code by hand. |

---

## `cinch auth status`

Show current authentication state: user ID, relay URL, hostname, and per-device token info.

```bash
cinch auth status
```

---

## `cinch auth logout`

Remove stored credentials locally and revoke this device on the relay.

```bash
cinch auth logout
```

---

## `cinch auth approve <user-code>`

Approve a remote device-code login from this signed-in machine. After the remote machine prints a user code (during `cinch auth login --headless` or the manual `cinch auth login` flow), paste it here to grant the new device access to your account.

```bash
cinch auth approve ABCD-1234
```

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--relay` | string | — | Override relay URL if the remote login is using a different relay. |

---

## `cinch auth retry-key`

Ask another paired device to re-share the encryption key bundle. Use this if the desktop app (or another CLI device) was offline during pairing and the new device never received the user key.

```bash
cinch auth retry-key
```

---

## `cinch auth recovery`

Back up or restore the AES-256 encryption key as a 24-word [BIP39](https://en.bitcoin.it/wiki/BIP_0039) phrase. Without a recovery code, losing every signed-in device makes encrypted clips on the relay unrecoverable.

### `cinch auth recovery show`

Print the encryption key as 24 BIP39 words. Record the phrase somewhere only you can reach (password manager, paper backup).

```bash
cinch auth recovery show
```

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `-y`, `--yes` | bool | `false` | Skip the interactive confirmation prompt. Required when piping or redirecting output. |

### `cinch auth recovery restore <phrase>`

Restore the encryption key on this device from a 24-word phrase. Run after `cinch auth login` on a new machine.

```bash
cinch auth recovery restore "word1 word2 word3 ... word24"
```

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `-y`, `--yes` | bool | `false` | Skip the overwrite confirmation when a key is already stored on this device. |

### `cinch auth recovery verify <phrase>`

Check a 24-word phrase against the currently stored key without changing anything. Useful for confirming a backup before relying on it.

```bash
cinch auth recovery verify "word1 word2 word3 ... word24"
```

---

## `cinch fleet add <ssh-target>`

**The fast path for remote machines.** SSHes into the target, installs cinch if needed, runs `cinch auth login --headless` on the remote, and approves the device from this local machine — all in one command. No manual steps on the remote end. (Was `cinch pair`; the old name still works as a hidden alias.)

```bash
# Basic
cinch fleet add user@remotehost

# SSH alias (configured in ~/.ssh/config)
cinch fleet add devbox

# Skip install if cinch is already on the remote
cinch fleet add user@remotehost --skip-install

# Use a custom relay on the remote machine
cinch fleet add user@remotehost --relay-url https://custom-relay.example.com
```

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--skip-install` | bool | `false` | Skip cinch binary installation on the remote. |
| `--relay-url` | string | — | Override the relay URL configured on the remote machine. |

The SSH target can be anything `ssh <target>` accepts. For non-standard ports or jump hosts, configure them in `~/.ssh/config` and pass the alias as the target.
