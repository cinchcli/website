---
title: Self-hosting the Relay
description: Run your own Cinch relay server.
---

The relay server is a single Go binary that handles HTTP push and WebSocket delivery, backed by **Postgres** for clip rows and a configurable media store (local disk or S3-compatible) for binary clips.

The Cinch-hosted relay is free while the project grows, but it is best-effort infrastructure for onboarding and demos. Self-host when you need your own uptime target, private network boundary, custom retention, or operational control.

## What you need

- A Postgres database (any 14+ release; managed services like Supabase, Neon, RDS work).
- A persistent directory or S3-compatible bucket for binary media.
- At least one OAuth provider (GitHub or Google) **or** the self-host username form fallback. Without OAuth credentials, sign-in still works via the username form on the browser page.
- A TLS terminator in front of the relay (Caddy, nginx, Cloudflare Tunnel), or a tailnet-only front door via Tailscale Serve. The relay itself speaks plain HTTP.

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

## Optional: Cloudflare Tunnel

Cloudflare Tunnel is a good fit when the relay runs on a home server, lab box, or private VM without an inbound public port.

1. Bind the relay to localhost:

```yaml
ports:
  - "127.0.0.1:8080:8080"
```

2. Run `cloudflared` on the same machine and point a hostname at the relay:

```bash
cloudflared tunnel create cinch-relay
cloudflared tunnel route dns cinch-relay relay.example.com
cloudflared tunnel run cinch-relay --url http://127.0.0.1:8080
```

3. Set the relay `BASE_URL` to the public hostname and log in against it:

```bash
cinch auth login --relay https://relay.example.com
```

If you enable OAuth, add the generated callback URLs for your hostname:

- `https://relay.example.com/auth/oauth/github/callback`
- `https://relay.example.com/auth/oauth/google/callback`

## Optional: Fly.io

Fly.io works well for a small public relay with managed Postgres.

```bash
fly launch --name cinch-relay --no-deploy
fly postgres create --name cinch-db
fly postgres attach --app cinch-relay cinch-db
fly secrets set BASE_URL=https://cinch-relay.fly.dev
fly deploy
```

For binary media, use an S3-compatible backend instead of instance-local disk if you run more than one instance.

## Move from hosted to self-hosted

1. Deploy your relay and confirm `https://your-relay.example.com/health` returns OK.
2. Sign in against the new relay:

```bash
cinch auth login --relay https://your-relay.example.com
```

3. Add your other machines again with `cinch fleet add user@host` or `cinch auth login --relay ...`.
4. Keep the old hosted relay configured on one device until any clips you still need have been pulled locally.

Hosted relay retention remains 7 days by default, so treat migration as a re-pairing flow, not a durable hosted archive export.

## Optional: Tailscale (tailnet-only)

If you already use Tailscale, you can keep the relay off the public internet and still serve HTTPS by putting it behind `tailscale serve` on a node in your tailnet.

1) Bind the relay to localhost so it is not publicly reachable. With Docker Compose, bind the port to `127.0.0.1`:

```yaml
ports:
  - "127.0.0.1:8080:8080"
```

2) Configure Tailscale to terminate TLS and proxy to the relay at `http://127.0.0.1:8080`.

3) Set `BASE_URL` to your MagicDNS hostname:

```yaml
environment:
  BASE_URL: https://relay.<your-tailnet>.ts.net
```

4) Point clients at the same URL:

```bash
cinch auth login --relay https://relay.<your-tailnet>.ts.net

# For non-interactive usage:
CINCH_RELAY_URL=https://relay.<your-tailnet>.ts.net cinch send
```

OAuth redirect URIs are derived from `BASE_URL`. If you enable OAuth, allow these callbacks:

- `https://relay.<your-tailnet>.ts.net/auth/oauth/github/callback`
- `https://relay.<your-tailnet>.ts.net/auth/oauth/google/callback`

Notes:

- The browser you use during sign-in must be connected to the same tailnet (otherwise it cannot reach the relay URL).
- Google OAuth commonly requires domain verification; if `.ts.net` blocks you, use GitHub OAuth or the username fallback sign-in.

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
