---
title: Relay Protocol
description: HTTP and WebSocket API specification for the Cinch relay server.
---

This page documents the wire protocol used between the `cinch` CLI and the relay server. It is stable across patch versions; breaking changes are versioned.

## Authentication

If the relay is configured with `AUTH_TOKEN`, every request must include:

```
Authorization: Bearer <token>
```

Requests without a valid token receive `401 Unauthorized`.

## HTTP endpoints

### `POST /push`

Push a new clip to the relay.

**Request**

```
POST /push HTTP/1.1
Content-Type: text/plain          (or application/octet-stream for binary)
Content-Length: <bytes>
Authorization: Bearer <token>     (if relay requires auth)

<clip payload>
```

**Response**

```json
{
  "id": 42,
  "size": 1024,
  "expires_at": 1714000000
}
```

| Status | Meaning |
|---|---|
| `200 OK` | Clip stored |
| `400 Bad Request` | Missing or malformed body |
| `401 Unauthorized` | Auth token missing or invalid |
| `413 Content Too Large` | Clip exceeds `MAX_BODY_MB` |

### `GET /pull`

Pull the most recent clip and return it in the HTTP response body. This is the non-streaming fallback; prefer the WebSocket endpoint for real-time delivery.

```
GET /pull HTTP/1.1
Authorization: Bearer <token>
```

**Response**

Returns the raw payload bytes with the original `Content-Type`. Returns `404 Not Found` if no clip is available.

### `GET /health`

Returns `200 OK` with `{"status":"ok"}`. No auth required.

## WebSocket endpoint

### `GET /ws`

Upgrade to WebSocket for real-time clip delivery. The relay pushes a message to all connected clients immediately when a new clip arrives via `POST /push`.

**Upgrade request**

```
GET /ws HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Authorization: Bearer <token>
```

**Server-sent message (JSON)**

```json
{
  "id": 42,
  "payload": "<base64-encoded bytes>",
  "mime_type": "text/plain",
  "size": 1024,
  "created_at": 1714000000
}
```

The `payload` field is always base64-encoded regardless of the original MIME type. Clients decode it and write the raw bytes to the local clipboard.

**Keepalive**

The relay sends a WebSocket ping every 30 seconds. Clients that do not respond within 10 seconds are disconnected. `cinchd` and the CLI reconnect automatically with exponential back-off (initial 1s, max 60s).

:::note
The WebSocket connection is authenticated at upgrade time. Tokens are not re-validated on each message.
:::

## MIME types

| Content | `Content-Type` |
|---|---|
| Plain text | `text/plain` |
| Rich text (RTF) | `text/rtf` |
| PNG image | `image/png` |
| JPEG image | `image/jpeg` |
| Arbitrary binary | `application/octet-stream` |

The CLI auto-detects the content type from stdin using the first 512 bytes. You can override with `--mime`:

```bash
cat file.pdf | cinch push --mime application/pdf
```
