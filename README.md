# StudEx Group

Agentic operating systems, and the businesses we run on top of them.

## Where things are

| | |
| --- | --- |
| **[WORKSPACE-INDEX.md](WORKSPACE-INDEX.md)** | Canonical asset register — 40 assets across 7 business lines. Start here. |
| **[assets.json](assets.json)** | The same register as machine-readable data, for agents and automations. |
| **[index.html](index.html)** | Browsable, searchable version of the register. Self-contained, opens anywhere. |
| **[studex-platform/](studex-platform/)** | The StudEx platform — Next.js app, cognitive brain, agent APIs. Serves the register at `/workspace`. |

## Updating the register

`assets.json` is the single source of truth. Everything else is generated.

```bash
# 1. edit assets.json
# 2. regenerate the Markdown, HTML and platform data file
npm run build:index
```

`WORKSPACE-INDEX.md`, `index.html` and `studex-platform/src/data/workspace-assets.json`
are all written by `scripts/build-index.mjs`. Edit them directly and your changes are
gone on the next build.

To verify in CI that the generated files are in sync with the manifest:

```bash
npm run check:index
```

## A note on what is not here

Most assets in the register live on the operator workstation under `/workspace`,
not in this repository — the `Where` column says which is which.

Entries marked 🔒 are listed so they are accounted for. Their contents are
deliberately not indexed and must never be committed to a public repository.
`/workspace/TOOLS.md` is the credential vault and is the clearest example: it is
named in the register precisely so that the rule travels with it.
