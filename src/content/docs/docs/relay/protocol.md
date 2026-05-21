---
title: Relay Protocol
description: HTTP and WebSocket API specification for the Cinch relay server.
---

This page documents the wire protocol used between Cinch clients (the `cinch` CLI, the desktop app) and the relay server. Wire DTOs are defined as Protocol Buffers in [`cinchcli/cinch`'s `crates/client-core/proto/cinch/v1/`](https://github.com/cinchcli/cinch/tree/main/crates/client-core/proto/cinch/v1) and shared verbatim across Rust and Go via generated bindings + a JSON wire-vector gate. The relay consumes the same bindings from the [`go/cinch/v1/`](https://github.com/cinchcli/cinch/tree/main/go/cinch/v1) module path.

## Authentication

The relay does **not** use a shared bearer token. Each device authenticates with its own per-device token issued through the [device-code flow](#device-code-flow) (or via OAuth on the browser sign-in page).

Every authenticated HTTP request carries:

```
Authorization: Bearer <per-device-token>
```

WebSocket connections authenticate the same way at upgrade time, or by exchanging the token for a short-lived ticket (`POST /ws/ticket`) and connecting with `?ticket=...` (used by browsers that cannot set custom upgrade headers).

In addition, all authenticated requests should send the client's version so the relay can populate `devices.client_version` / `devices.client_type`:

```
X-Cinch-Client-Version: 0.1.10
X-Cinch-Client-Type: cli           # "cli" | "desktop"
```

WebSocket clients send the same info as the first frame after auth via the `client_hello` action (see below).

## HTTP endpoints

### Clips

| Method | Path | Description |
|---|---|---|
| `POST` | `/clips` | Push a new text-style clip (text / code / url). Body is a `PushClipRequest` JSON. Returns the assigned clip ID + retention info. |
| `POST` | `/clips/binary` | Push an image / binary clip. `multipart/form-data` upload; payload streamed to the media backend. |
| `GET` | `/clips/latest` | Get the latest clip for the caller's account. Optional `?source=` / `?exclude_source=` / `?exclude_image=` / `?exclude_text=` filters. |
| `GET` | `/clips` | List clips with `?limit=` and `?since=` cursor. |
| `GET` | `/clips/{id}/media` | Fetch raw bytes for a binary clip. |
| `POST` | `/clips/{id}/pin` | Pin or unpin a clip. Broadcast to other devices via WS. |
| `DELETE` | `/clips/{id}` | Delete a clip. Creates a tombstone for offline devices. |
| `GET` | `/tombstones` | List deletion tombstones since a timestamp (offline sync). |
| `POST` | `/pull` | Request the latest clip from another device (server-initiated WS round-trip). Used by `cinch pull --from`. |

### Device-code flow

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/device-code` | none | Issue a new device-code (start of `cinch auth login`). Returns a `user_code` + verification URL. |
| `GET` | `/auth/device-code/poll` | none | Poll for completion of a device-code. Returns the device token once approved. |
| `POST` | `/auth/device-code/complete` | bearer | Approve a pending device-code from this signed-in device (`cinch auth approve`). |
| `GET` | `/auth/browser` | none | Browser sign-in page (OAuth or self-host username form). |
| `GET` | `/auth/providers` | none | Lists configured OAuth providers for the sign-in UI. |

### Key exchange (E2EE)

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/device/public-key` | Register this device's X25519 public key + fingerprint. |
| `POST` | `/auth/key-bundle` | Post an encrypted user-key bundle to another device. |
| `GET` | `/auth/key-bundle` | Retrieve the bundle posted to this device. |
| `POST` | `/auth/key-bundle/retry` | Ask another paired device to re-share the user key (`cinch auth retry-key`). |

### Devices

| Method | Path | Description |
|---|---|---|
| `GET` | `/devices` | List devices on the caller's account (includes `client_version`, `client_type`, `last_push_at`). |
| `PUT` | `/devices/{id}/nickname` | Rename a device. |
| `PUT` | `/devices/self/retention` | Set the calling device's local retention preference. |
| `POST` | `/auth/device/revoke` | Revoke another device. |

### Admin (invite-only relays)

Requires a bearer token belonging to a user where `users.is_admin = true`.

| Method | Path | Description |
|---|---|---|
| `POST` | `/admin/invites` | Mint a new invite token. |
| `GET` | `/admin/invites` | List invites. |
| `DELETE` | `/admin/invites/{hash}` | Revoke an invite. |
| `GET` | `/admin/users` | List users. |
| `DELETE` | `/admin/users/{id}` | Delete a user (revokes all their devices + clips). |

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `200 OK` with a JSON status payload. No auth required. |

## WebSocket endpoint

### `GET /ws`

Upgrade to WebSocket for real-time clip delivery and bidirectional control messages. Every frame is a JSON-encoded `WSMessage` envelope.

**Upgrade request**

```
GET /ws HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Authorization: Bearer <per-device-token>
```

For browser clients that cannot set custom upgrade headers, first call `POST /ws/ticket` to mint a short-lived ticket and connect with `wss://relay/ws?ticket=<ticket>`.

### `WSMessage` envelope

```jsonc
{
  "action": "new_clip",                  // see action vocabulary below
  "clip": { /* cinch.v1.Clip */ },       // new_clip / clip_deleted
  "pull_id": "...",                      // send_clipboard / clipboard_content correlation
  "content": "...",                      // clipboard_content payload (encrypted ciphertext)
  "error": "...",                        // error frames
  "reason": "...",                       // revoked: why
  "token": "...",                        // token_rotated: new per-device token
  "device_id": "...",                    // token_rotated / context
  "hostname": "...",                     // token_rotated / device_code_pending
  "device_key_fingerprint": "...",       // key_exchange_requested: fingerprint to confirm
  "user_code": "...",                    // device_code_pending: code shown to approver
  "requested_at": 1714000000,            // device_code_pending: unix seconds
  "source_region": "fra",                // device_code_pending: best-effort GeoIP
  "client_hello": {                      // client_hello: agent → relay
    "version": "0.1.10",
    "type": "cli"                        // "cli" | "desktop"
  }
}
```

The Go definition lives in [`relay/internal/protocol/ws.go`](https://github.com/cinchcli/relay/blob/main/internal/protocol/ws.go); the Rust counterpart is in `cinchcli-core`'s `protocol.rs`. Both are gated by `testdata/wire-vectors.json` for byte-equal round-trip.

### Action vocabulary

| `action` | Direction | Purpose |
|---|---|---|
| `client_hello` | agent → relay | First frame after auth. Reports binary version + client type. |
| `new_clip` | relay → agent | A new clip is available. Carries `clip`. |
| `clip_deleted` | relay → agent | A clip was deleted. Carries `clip` (with ID only). |
| `clip_pinned` | relay → agent | A clip's pin state changed. |
| `send_clipboard` | relay → agent | Server-initiated pull request. Carries `pull_id`. |
| `clipboard_content` | agent → relay | Response to `send_clipboard`. Carries `pull_id` + `content`. |
| `ping` / `pong` | both | Keepalive. |
| `revoked` | relay → agent | This device has been revoked. Carries `reason`. |
| `token_rotated` | relay → agent | New per-device credentials issued (migration from legacy master token). |
| `key_exchange_requested` | relay → agent | A new device is requesting the user-key bundle. Carries `device_key_fingerprint` for out-of-band verification. |
| `device_code_pending` | relay → desktop | Push-approval notification for a remote `cinch auth login`. Carries `user_code`, `hostname`, `requested_at`, `source_region`. |

**Keepalive.** The relay sends a WebSocket ping every 30 seconds. Clients that do not respond within 10 seconds are disconnected. The desktop app and the CLI reconnect automatically with exponential back-off (initial 1s, max 60s).

:::note
The WebSocket connection is authenticated at upgrade time. Tokens are not re-validated on each frame.
:::

## Content types

Clips carry one of exactly four canonical `content_type` strings. The wire vocabulary is fixed; adding a value is a coordinated proto + cinch-core publish + version-bump cycle.

| Value | When emitted |
|---|---|
| `image` | Magic-byte sniff matched PNG / JPEG / GIF / WebP, or the client explicitly forced `--type image/*`. |
| `text` | Default for any non-image input. |
| `url` | The whole payload parsed as a single URL. |
| `code` | Matched a shebang, JSON shape, or code heuristic in `client_core::classify::detect`. |

There are **no MIME-style strings on the wire**. Producers run `classify::detect` and emit the 4-string value; consumers trust it. Both the relay (`relay/internal/protocol`) and `cinchcli-core` enforce this constant set.
