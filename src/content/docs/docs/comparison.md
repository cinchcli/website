---
title: Comparison
description: How Cinch compares to OSC 52, Apple Universal Clipboard, KDE Connect, and local clipboard managers.
---

For in-depth comparisons with worked examples and FAQs, see the [Guides](/guides/) section:

- [Cinch vs OSC 52](/guides/cinch-vs-osc-52/) — when OSC 52 breaks and how Cinch handles those cases

---

## Cinch vs OSC 52

OSC 52 is a terminal escape sequence that lets a remote process write to the local clipboard. It works well in some environments and fails silently in others.

| | OSC 52 | Cinch |
|---|---|---|
| Requires interactive PTY | Yes | No |
| Works in tmux / screen | Broken | Yes |
| Works in Docker exec | Broken | Yes |
| Works in CI runners | Broken | Yes |
| Bidirectional (pull) | No | Yes |
| Binary / image support | Limited | Yes (up to 20 MB) |
| Async / scripted use | No | Yes |
| Self-hostable | N/A | Yes |

:::tip
Use OSC 52 if you only use interactive SSH sessions in a modern terminal with no tmux.
Use Cinch for everything else.
:::

## Cinch vs Apple Universal Clipboard

Apple Universal Clipboard (Handoff) syncs the clipboard between Apple devices on the same iCloud account over local network or iCloud relay.

| | Universal Clipboard | Cinch |
|---|---|---|
| Platform support | Apple only | macOS, Linux, Windows |
| Works on Linux / Windows | No | Yes |
| Works on remote servers | No | Yes |
| CLI / pipe interface | No | Yes |
| Self-hostable | No | Yes |
| Works over the internet | Via iCloud | Yes |
| Open source | No | Yes |

## Cinch vs KDE Connect

KDE Connect syncs clipboard content (among other things) between Linux and Android devices on the same local network.

| | KDE Connect | Cinch |
|---|---|---|
| Platform support | Linux, Android | macOS, Linux, Windows |
| Works on macOS | No (GSConnect only) | Yes |
| Works across internet | No (LAN only) | Yes |
| Works on remote servers | No | Yes |
| CLI / pipe interface | Limited | Yes |
| Self-hostable relay | N/A (P2P) | Yes |
| Open source | Yes | Yes |

## Cinch vs local clipboard managers (Maccy, Raycast, etc.)

Local clipboard managers like Maccy, Raycast, and Clipboard Manager store and search your local clipboard history. They are not remote tools.

| | Local clipboard managers | Cinch |
|---|---|---|
| Local clipboard history | Yes | No (relay only) |
| Search & recall | Yes | Via desktop app |
| Remote / cross-machine | No | Yes |
| Works on servers | No | Yes |
| CLI / pipe interface | No | Yes |

:::note
Cinch is not a local clipboard manager replacement. If you need local history and search, use Maccy or Raycast alongside Cinch.
The Cinch desktop app adds a clipboard history view, but its primary value is the remote relay.
:::
