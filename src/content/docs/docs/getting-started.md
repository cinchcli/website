---
title: Getting Started
description: Install Cinch and send your first clipboard in 30 seconds.
---

## Installation

```bash
curl -fsSL https://cinchcli.com/install.sh | sh
```

This installs the `cinch` CLI binary to `/usr/local/bin`.

### Pair your machines

On the relay (or public instance), generate a pairing token:

```bash
cinch auth pair
```

On each client machine, pair using the token:

```bash
cinch auth pair <TOKEN>
```

## Quick start

### Push

Pipe any command's output to the relay:

```bash
echo "hello from $(hostname)" | cinch push
```

### Pull

On another machine:

```bash
cinch pull
# → hello from my-server
```

### Desktop agent

Run `cinchd` to have incoming clips automatically land in your Mac clipboard:

```bash
cinchd
```
