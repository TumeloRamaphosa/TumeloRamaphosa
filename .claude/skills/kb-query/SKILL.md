---
name: kb-query
description: Answer a question from the StudEx vault (RAG over wiki/ and outputs/). Use when the user asks something the OS may already know — past research, brand facts, what content performed, competitor prices. Cites the vault files it used.
---

# /kb-query

Answer from the vault's memory, not from guesses.

## Steps
1. Restate the question.
2. Search `vault/wiki/` and `vault/outputs/` (and `vault/raw/` only if needed) for relevant notes — use Grep/Glob across markdown.
3. Synthesize a direct answer.
4. Cite the exact vault files used (path + section).
5. If the vault doesn't have it, say so and offer to run `/research-job` to find out.

## Rules
- Never fabricate. "Not in the vault yet" is a valid answer.
- Prefer `wiki/` (codified) over `raw/` (unverified) when they conflict, and flag the conflict.
