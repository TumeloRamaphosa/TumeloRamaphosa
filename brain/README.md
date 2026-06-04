# brain/ — our agent memory (gbrain system of record)

This directory is the **system of record** for [gbrain](https://github.com/garrytan/gbrain),
the memory layer our AI agents read from and write to. gbrain treats a folder
of markdown files (this one) as the source of truth and syncs it into a local
**PGLite** database for hybrid search + a self-wiring knowledge graph.

**Git is the source of truth, the database is derived.** Edit/commit markdown
here; `gbrain sync` re-embeds and re-links. Deleting a file becomes a
soft-delete in the DB.

## Layout
```
brain/
  people/    persons (e.g. the owner)
  projects/  what we're building
  places/    locations referenced by projects
```

## Conventions
- One page per file, with YAML frontmatter (`type`, `title`, `tags`, …).
- Link related pages with wiki syntax: `[[slug]]`. Auto-linking turns these
  into typed graph edges on every write — **no LLM calls**, pure pattern match.
- Keep pages short and factual; let the graph connect them.

## Operate it
```bash
scripts/setup-gbrain.sh        # install gbrain + init local brain + sync this dir
gbrain query "what are we building?"   # hybrid search over this brain
gbrain think "open threads on Aviar?"  # synthesized answer + gap analysis (needs API key)
gbrain sync --repo brain               # re-sync after edits
```

See `docs/gbrain.md` for the full picture, costs, and how the agent uses it.
