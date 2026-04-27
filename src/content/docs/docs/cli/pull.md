---
title: cinch pull
description: Pull clipboard content from the relay server.
---

`cinch pull` retrieves the latest clip from the relay and writes it to stdout.

## Usage

```bash
cinch pull
```

## Examples

```bash
# Pull to stdout
cinch pull

# Pull and pipe
cinch pull | pbcopy
cinch pull | xargs open
cinch pull | jq .
```
