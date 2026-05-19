---
title: Self-hosting the Relay
description: Run your own Cinch relay server.
---

The relay server is a single Go binary that handles HTTP push and WebSocket delivery, backed by **Postgres** for clip rows and a configurable media store (local disk or S3-compatible) for binary clips.

## What you need

- A Postgres database (any 14+ release; managed services like Supabase, Neon, RDS work).
- A persistent directory or S3-compatible bucket for binary media.
- At least one OAuth provider (GitHub or Google) **or** the self-host username form fallback. Without OAuth credentials, sign-in still works via the username form on the browser page.
- A reverse proxy terminating TLS (Caddy, nginx, Cloudflare Tunnel). The relay itself speaks plain HTTP.

## Docker Compose (recommended)

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
      # Optional — enable OAuth sign-in:
      GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
      GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET}
    restart: unless-stopped

volumes:
  cinch-db:
  cinch-media:
```

See [Relay Configuration](/docs/relay/configuration/) for the full list of environment variables.

## Bootstrapping the first admin

A fresh relay has no users. To mint the first invite without an existing admin, set `RELAY_BOOTSTRAP_INVITE_CODE` on the relay container at first boot:

```bash
docker run -d ... \
  -e RELAY_BOOTSTRAP_INVITE_CODE='one-shot-code' \
  ghcr.io/cinchcli/relay:latest
```

The code is consumed once on startup and recorded as an invite. The first user to sign in with that invite becomes the admin. Remove the env var on the next deploy.

To gate sign-ups behind invites afterward, use the `relay invite` / `relay user` subcommands on the binary, or the `cinch admin invite` / `cinch admin user` CLI commands once you have an admin device.

## S3-compatible media backend

For multi-instance deployments, store media in S3-compatible object storage instead of a local volume:

```yaml
environment:
  DATABASE_URL: postgres://...
  MEDIA_BACKEND: s3
  MEDIA_ENDPOINT: fra1.digitaloceanspaces.com
  MEDIA_BUCKET: cinch-media
  MEDIA_REGION: fra1
  MEDIA_ACCESS_KEY_ID: ${SPACES_KEY}
  MEDIA_SECRET_ACCESS_KEY: ${SPACES_SECRET}
```

Works with AWS S3, DigitalOcean Spaces, Cloudflare R2, MinIO, etc. Set `MEDIA_USE_SSL=false` for plain-HTTP endpoints during local testing.

## Build from source

```bash
git clone https://github.com/cinchcli/relay.git
cd relay
make build
DATABASE_URL=postgres://localhost/cinch ./dist/relay
```
