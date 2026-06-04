---
title: Why Cinch
description: When OSC 52 isn't enough and why Cinch takes a different approach.
---

## OSC 52 — good until it isn't

Most modern terminals support clipboard sharing via [OSC 52](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h3-Operating-System-Commands) escape sequences. For interactive SSH sessions in a cooperating terminal, it works well.

But the escape sequence approach breaks in a surprisingly large number of real-world situations:

| Scenario | OSC 52 status |
|---|---|
| Interactive SSH in iTerm2 / Ghostty | Works |
| SSH inside tmux / screen | Broken — multiplexer intercepts the sequence |
| Nested SSH hops | Broken — escape codes rarely survive the jump |
| Docker exec / docker attach | Broken — no terminal escape passthrough |
| Vim / Neovim inside SSH | Often flaky or requires complex config |
| CI/CD runner (GitHub Actions, etc.) | Broken — non-interactive, no PTY |
| Older SSH servers (OpenSSH < 7.2) | Broken — clipboard support not enabled |

:::tip
If you have a single SSH session in a modern terminal and no tmux, OSC 52 is fine. Use it.
Cinch is for when that's not your world.
:::

## How Cinch is different

Cinch is a local-first remote clipboard for developer context. It keeps clipboard history on your machine, gives AI tools a read-only MCP view when you configure it, and syncs through HTTP only when you ask it to move clips across machines:

1. `cinch send` encrypts the clip on your device and sends it to a relay server over HTTPS.
2. The relay holds the ciphertext in Postgres until it is pulled.
3. `cinch pull` (or the Cinch desktop app) retrieves it over WebSocket for real-time delivery.

Because it's HTTP, it works everywhere:

- Across tmux, screen, and any multiplexer
- From inside Vim or Neovim without special terminal config
- Through any number of SSH hops
- In Docker containers or CI runners (outbound HTTPS only)
- In non-interactive shells (no PTY required)

## Bidirectional

OSC 52 is one-way (terminal → clipboard). Cinch supports both directions:

```bash
cinch send   # local → relay → fleet
cinch pull   # relay → local clipboard
```

Send from a script running on a remote box. Pull the result on your laptop. Or the reverse — send from your laptop, pull inside a container.

## Self-hosted by default

Cinch is designed to be self-hosted. The relay is a single Go binary (or a Docker image) you run on any server. Your clips never leave infrastructure you control unless you opt into the hosted relay.

The protocol is documented in [Relay Protocol](/docs/relay/protocol/). Anyone can inspect what the relay stores and for how long.

## AI workflows stay explicit

`cinch mcp` is read-only, and local-only by default (fleet-scoped reads require `CINCH_MCP_FLEET=1`). `cinch ai fix` only sends context to an AI provider when you explicitly run it without `--no-send` and have configured a provider. Ordinary clipboard sync does not call AI providers.
