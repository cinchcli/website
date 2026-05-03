---
title: Relay Configuration
description: Environment variables and configuration options for the Cinch relay server.
---

The relay server is configured entirely through environment variables. There is no config file.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | HTTP port to listen on |
| `DB_PATH` | `/data/relay.db` | Path to the SQLite database |
| `RETENTION_DAYS` | `7` | How long to keep clips before deleting them |
| `MAX_BODY_MB` | `20` | Maximum clip size in megabytes |
| `AUTH_TOKEN` | — | If set, all requests must include `Authorization: Bearer <token>` |
| `CORS_ORIGINS` | `*` | Allowed CORS origins (comma-separated) |
| `LOG_LEVEL` | `info` | Log level: `debug`, `info`, `warn`, `error` |

## Docker example with all options

```bash
docker run -d \
  -p 8080:8080 \
  -v cinch-data:/data \
  -e RETENTION_DAYS=14 \
  -e MAX_BODY_MB=50 \
  -e AUTH_TOKEN=your-secret-token \
  -e LOG_LEVEL=info \
  ghcr.io/cinchcli/relay:latest
```

## Docker Compose example

```yaml
services:
  relay:
    image: ghcr.io/cinchcli/relay:latest
    ports:
      - "8080:8080"
    volumes:
      - cinch-data:/data
    environment:
      RETENTION_DAYS: "14"
      MAX_BODY_MB: "50"
      AUTH_TOKEN: "${CINCH_TOKEN}"
    restart: unless-stopped

volumes:
  cinch-data:
```

## Pointing the CLI at your relay

After deploying, authenticate against your relay:

```bash
cinch auth login --relay https://relay.example.com
```

Or set the environment variable before running any `cinch` command:

```bash
export CINCH_RELAY_URL=https://relay.example.com
```

:::note
If `AUTH_TOKEN` is set on the relay, pass it as `CINCH_TOKEN` on each client machine:
```bash
export CINCH_TOKEN=your-secret-token
```
:::

## SQLite database

The relay uses a single SQLite file. Its schema is minimal:

```sql
CREATE TABLE clips (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  payload    BLOB    NOT NULL,
  mime_type  TEXT    NOT NULL DEFAULT 'text/plain',
  created_at INTEGER NOT NULL,  -- Unix timestamp
  expires_at INTEGER NOT NULL   -- Unix timestamp
);
```

Clips are deleted by a background goroutine that runs every hour and removes rows where `expires_at < now()`.

The database is safe to back up with a standard SQLite copy while the relay is running — SQLite's WAL mode is enabled by default.
