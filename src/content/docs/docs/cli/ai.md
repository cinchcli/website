---
title: cinch ai
description: Explicit AI workflows over terminal, log, and clipboard context.
---

`cinch ai` is the explicit AI boundary in Cinch. It does not run during `copy`, `send`, `pull`, desktop sync, or `cinch mcp`.

v1 has one workflow:

```bash
cat error.log | cinch ai fix
cinch ai fix latest
cinch ai fix 01HXABCD
```

Use `--no-send` to generate the prompt only:

```bash
cargo test 2>&1 | cinch ai fix --no-send
cinch ai fix latest --no-send
```

Input priority:

1. stdin, when piped
2. `latest`, from the local store
3. a clip ID prefix, from the local store

`--copy` copies the prompt or provider answer back to your system clipboard.

## Provider boundary

If no provider is configured, `cinch ai fix` behaves like `--no-send`: it prints the AI-ready prompt and does not call a provider.

Supported provider names:

| Provider | Use case |
|---|---|
| `hosted-bedrock` | Cinch-operated managed provider for hosted distributions. Requires operator endpoint config. |
| `bedrock-byok` | BYOK AWS Bedrock boundary for self-hosters and developers. The v1 CLI documents the boundary; AWS request signing is not wired into this binary yet. |
| `openai-compatible` | Ollama, LM Studio, llama.cpp servers, or OpenAI-compatible APIs. |

OpenAI-compatible local example:

```bash
export CINCH_AI_PROVIDER=openai-compatible
export CINCH_AI_BASE_URL=http://localhost:11434/v1
export CINCH_AI_MODEL=llama3.1

cargo test 2>&1 | cinch ai fix
```

Hosted provider example:

```bash
export CINCH_AI_PROVIDER=hosted-bedrock
export CINCH_AI_HOSTED_URL=https://api.example.com/ai/fix
export CINCH_AI_HOSTED_TOKEN=...

cinch ai fix latest
```

## Privacy model

- AI provider calls happen only under `cinch ai`.
- `--no-send` does not call an AI provider.
- `cinch mcp` is read-only, and local-only by default; it contacts the relay only for fleet-scoped reads (`CINCH_MCP_FLEET=1`).
- `cinch copy`, `cinch send`, `cinch pull`, and desktop sync do not call AI providers.
- Provider errors print the assembled prompt so the context is not lost.
