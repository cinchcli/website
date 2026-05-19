---
title: Relay Configuration
description: Environment variables and configuration options for the Cinch relay server.
---

The relay server is configured entirely through environment variables. There is no config file.

## Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string. The relay refuses to start without it. Example: `postgres://cinch:secret@db:5432/cinch?sslmode=disable`. |

## Server

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | HTTP port to listen on. Also overridable via `--port`. |
| `BASE_URL` | — | Public HTTPS root of this relay (e.g. `https://api.cinchcli.com`). Used to build OAuth callback URLs and absolute links in emails / device-code pages. |
| `CORS_ORIGINS` | — | Comma-separated list of extra allowed CORS origins for self-hosters. The hosted relay's own demo origin is allowed automatically. |
| `RELAY_PUBLIC_URL` | `BASE_URL` | Override the public HTTPS URL advertised to clients (useful behind a CDN). |
| `RELAY_PUBLIC_WS_URL` | derived | Override the public `wss://` URL advertised to clients. |
| `RELAY_REGION` | — | Optional region tag returned in `/health` for HA deployments. |

## Authentication (OAuth + invites)

The relay does not use a shared bearer token. Each device authenticates with its own per-device token issued by `cinch auth login`. Sign-in goes through GitHub or Google OAuth, optionally gated by invite codes.

| Variable | Default | Description |
|---|---|---|
| `GITHUB_CLIENT_ID` | — | GitHub OAuth app client ID. Required to enable "Sign in with GitHub". |
| `GITHUB_CLIENT_SECRET` | — | Companion secret for the GitHub OAuth app. |
| `GOOGLE_CLIENT_ID` | — | Google OAuth client ID. Required to enable "Sign in with Google". |
| `GOOGLE_CLIENT_SECRET` | — | Companion secret for the Google OAuth client. |
| `RELAY_BOOTSTRAP_INVITE_CODE` | — | One-shot invite code burned in at boot. Use this on a fresh self-host deployment to mint the first invite without an existing admin. |

If no OAuth provider is configured, the relay falls back to a self-host username form on the browser sign-in page.

## Media storage

Binary clips (images, large payloads) are stored in a media backend. Text clips remain in Postgres.

| Variable | Default | Description |
|---|---|---|
| `MEDIA_BACKEND` | `local` | `local` (filesystem) or `s3` (S3-compatible object store). |
| `MEDIA_LOCAL_DIR` | `media` | Filesystem directory for `MEDIA_BACKEND=local`. Mount a persistent volume here. |
| `MEDIA_ENDPOINT` | — | S3 endpoint URL (S3 backend only). Examples: `s3.amazonaws.com`, `fra1.digitaloceanspaces.com`, `localhost:9000`. |
| `MEDIA_BUCKET` | — | S3 bucket name. |
| `MEDIA_REGION` | — | S3 region. |
| `MEDIA_ACCESS_KEY_ID` | — | S3 access key. |
| `MEDIA_SECRET_ACCESS_KEY` | — | S3 secret. |
| `MEDIA_USE_SSL` | `true` | Set to `false` for plain-HTTP S3 endpoints (e.g. local MinIO). |

## Telemetry & internal endpoints

| Variable | Default | Description |
|---|---|---|
| `TELEMETRY_URL` | — | Forward client telemetry events to this URL. Telemetry is silently disabled when unset. |
| `TELEMETRY_API_KEY` | — | API key sent with telemetry events. |
| `INTERNAL_SERVICE_SECRET` | — | Shared secret required by `/internal/*` endpoints (e.g. the billing service's quota updates). |

## Docker example

A minimal self-host deployment needs Postgres, a media volume, and at least one OAuth provider:

```bash
docker run -d \
  -p 8080:8080 \
  -v cinch-media:/var/lib/cinch/media \
  -e DATABASE_URL='postgres://cinch:secret@db:5432/cinch?sslmode=disable' \
  -e BASE_URL='https://relay.example.com' \
  -e MEDIA_LOCAL_DIR='/var/lib/cinch/media' \
  -e GITHUB_CLIENT_ID='Ov23...' \
  -e GITHUB_CLIENT_SECRET='...' \
  ghcr.io/cinchcli/relay:latest
```

## Docker Compose example

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: cinch
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: cinch
    volumes:
      - cinch-db:/var/lib/postgresql/data
    restart: unless-stopped

  relay:
    image: ghcr.io/cinchcli/relay:latest
    depends_on: [db]
    ports:
      - "8080:8080"
    volumes:
      - cinch-media:/var/lib/cinch/media
    environment:
      DATABASE_URL: postgres://cinch:secret@db:5432/cinch?sslmode=disable
      BASE_URL: https://relay.example.com
      MEDIA_LOCAL_DIR: /var/lib/cinch/media
      GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
      GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET}
    restart: unless-stopped

volumes:
  cinch-db:
  cinch-media:
```

## Pointing the CLI at your relay

After deploying, authenticate against your relay:

```bash
cinch auth login --relay https://relay.example.com
```

This opens a browser, signs you in via OAuth (or the self-host username form), and writes the device token to `~/.cinch/config.json`. Subsequent `cinch` commands pick it up automatically.

For CI and other non-interactive contexts, pass the token and URL via environment variables instead:

```bash
export CINCH_TOKEN=...        # per-device token from `cinch auth status`
export CINCH_RELAY_URL=https://relay.example.com
```

## Database schema

The relay manages a multi-table Postgres schema (`users`, `clips`, `devices`, `device_codes`, `clip_tombstones`, `user_capabilities`, and a few support tables). Schema is applied automatically on boot via `CREATE TABLE IF NOT EXISTS` statements in `internal/relay/store.go`. There is no separate migration tool; bring-up against a fresh database is idempotent.

Standard Postgres backups (`pg_dump`, managed snapshots) work without special handling. Binary media lives under `MEDIA_LOCAL_DIR` (or the configured S3 bucket) and should be backed up alongside the database.
