---
title: Privacy & Retention
description: How Cinch captures clips, what it skips, and how long clips are kept on this Mac.
---

Cinch captures every text or image clip you copy on this Mac and keeps it in a local history you can search and re-use. This page explains what gets captured, what gets skipped, and how long clips live.

## Retention

By default, Cinch keeps local clips for **30 days**. Older clips are deleted automatically by a background sweep that runs once per hour.

Cinch also tracks a separate **remote retention** setting for clips synced through the relay server. In this release the remote retention slider saves your preference locally; the relay honours the server-side value in the next release.

### Local retention

Open the Settings pane (the gear icon in the top bar). You can choose from discrete retention windows: 7, 14, 30, 60, or 90 days. Lowering a retention value deletes clips older than the new window after you confirm the change.

You can also clear every local clip in one action. The Settings pane's **Clear local history** button opens a confirmation dialog with the current clip count.

## What Cinch skips

Cinch never saves:

- Clips from known password managers: 1Password (`com.1password.1password`, `com.agilebits.onepassword7`), Bitwarden (`com.bitwarden.desktop`), LastPass (`com.lastpass.LastPass`), and Keychain Access (`com.apple.keychainaccess`).
- Any clip whose NSPasteboard type includes `org.nspasteboard.ConcealedType` or `org.nspasteboard.TransientType`. These are the conventional macOS signals that a clipboard item is confidential (passwords) or momentary (2FA codes).

If you copy a password from a supported password manager and do not see it in Cinch's history, that is the exclusion working as intended.

## Where clips are stored

Local clips live in a SQLite database under `~/Library/Application Support/com.cinch.app/clips.db`. Cinch relies on macOS FileVault (the built-in disk encryption that most Macs enable by default) for at-rest protection of the database. Turn FileVault on in System Settings if it is not already.

## macOS-only in this release

The Cinch desktop app ships for macOS only in this release. If you use Linux or Windows, install the `cinch` CLI instead:

```bash
curl -fsSL https://cinchcli.com/install.sh | sh
```

The CLI supports push and pull on all three platforms. A Linux and Windows desktop build returns in a follow-up release.
