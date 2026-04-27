---
title: cinch push
description: Push clipboard content to the relay server.
---

`cinch push` reads from stdin and sends the content to the relay server.

## Usage

```bash
<command> | cinch push
```

## Examples

```bash
# Push text
echo "meeting notes" | cinch push

# Push file contents
cat report.csv | cinch push

# Push git diff
git diff HEAD~1 | cinch push

# Push command output
hostname | cinch push
```
