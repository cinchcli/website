---
title: Self-hosting the Relay
description: Run your own Cinch relay server.
---

The relay server is a single Go binary that handles HTTP push and WebSocket delivery, backed by SQLite.

## Docker (recommended)

```bash
docker run -d \
  -p 8080:8080 \
  -v cinch-data:/data \
  ghcr.io/cinchcli/relay:latest
```

## Docker Compose

```yaml
services:
  relay:
    image: ghcr.io/cinchcli/relay:latest
    ports:
      - "8080:8080"
    volumes:
      - cinch-data:/data

volumes:
  cinch-data:
```

## Build from source

```bash
git clone https://github.com/cinchcli/relay.git
cd relay
make build
./dist/relay
```
