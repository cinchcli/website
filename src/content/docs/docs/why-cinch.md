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
| SSH inside tmux | Broken — tmux intercepts the sequence |
| SSH inside GNU screen | Broken |
| Docker exec / docker attach | Broken — no terminal escape passthrough |
| CI/CD runner (GitHub Actions, etc.) | Broken — non-interactive, no PTY |
| Older SSH servers (OpenSSH < 7.2) | Broken — clipboard support not enabled |
| Nested SSH hops | Broken at the first hop |
| VS Code Remote SSH | Works sometimes, broken in others |

:::tip
If you have a single SSH session in a modern terminal and no tmux, OSC 52 is fine. Use it.
Cinch is for when that's not your world.
:::

## How Cinch is different

Cinch doesn't use terminal escape sequences at all. It's just HTTP:

1. `cinch push` sends the clip to a relay server over HTTPS.
2. The relay holds the clip in SQLite until it is pulled.
3. `cinch pull` (or `cinchd`) retrieves it over WebSocket for real-time delivery.

Because it's HTTP, it works everywhere:

- In non-interactive shells (no PTY required)
- Inside Docker containers (just needs outbound HTTPS)
- In CI runners (GitHub Actions, GitLab CI, etc.)
- Across tmux, screen, and any multiplexer
- Through any number of SSH hops

## Bidirectional

OSC 52 is push-only. Cinch supports both directions:

```bash
cinch push   # local → relay → remote
cinch pull   # relay → local clipboard
```

Push from a script running on a remote box. Pull the result on your laptop. Or the reverse — push from your laptop, pull inside a container.

## Self-hosted by default

Cinch is designed to be self-hosted. The relay is a single Go binary (or a Docker image) you run on any server. Your clips never leave infrastructure you control unless you opt into the hosted relay.

The protocol is documented in [Relay Protocol](/docs/relay/protocol/). Anyone can inspect what the relay stores and for how long.
