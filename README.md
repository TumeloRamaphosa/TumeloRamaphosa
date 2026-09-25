# StudEx Group

Agentic operating systems, and the businesses we run on top of them.

## The asset register

The register is an **Obsidian vault**. You work in the vault; everything else is generated from it.

```
vault/                    ← source of truth. Open this in Obsidian.
  00 Index.md             dashboard: stage split, backlog, restricted list
  Lines/                  one note per business line
  Assets/                 one note per asset — frontmatter is data, body is yours
  Meta/Register.md        the register's own settings
        │
        │  npm run sync
        ▼
assets.json               generated — machine-readable register for agents
        │
        ├─ WORKSPACE-INDEX.md                          register as Markdown
        ├─ index.html                                  searchable page
        └─ studex-platform/src/data/workspace-assets.json   the /workspace route
```

40 assets across 7 lines: Coffee, Meat, StudBot Super Agents, Operations, Agent OS,
Capital & Pitch, Content & Brand.

## Working in it

Open `vault/` as a vault in Obsidian, then:

```bash
npm run sync            # vault -> assets.json -> every generated view
npm run vault:scaffold  # create notes for entries that don't have one yet
npm run check:sync      # CI: fail if the generated files have drifted
```

To add an asset, create a note in `vault/Assets/` with the same frontmatter keys as
its neighbours and run `npm run sync`. A bad stage, an unknown line or a duplicate id
stops the sync and names the file rather than quietly dropping the asset.

`npm run vault:scaffold` is strictly additive — it never rewrites or deletes a note
you have edited.

### What is safe to edit

| | |
| --- | --- |
| `vault/Assets/*.md` | **Yours.** Frontmatter is the data; the body is free-form and no generator touches it. |
| `vault/Lines/*.md` | Yours above the `BEGIN GENERATED` marker. Below it is rebuilt each sync. |
| `vault/00 Index.md` | Generated in full. Don't write here. |
| `assets.json`, `WORKSPACE-INDEX.md`, `index.html` | Generated. Edits are overwritten. |

### Front end

The vault is plain Markdown with YAML frontmatter, so it is not locked to one app.
Tables ship twice — a Dataview block for Obsidian, and a static table in a collapsed
callout that renders correctly in **Logseq**, **SilverBullet**, **Foam**, VS Code and
on GitHub.

Worth knowing: Obsidian is free for personal use but needs a paid **Commercial
licence** for company use. The open-source alternatives above read this same vault.

## A note on what is not here

Most assets live on the operator workstation under `/workspace`, not in this
repository — the `Where` field says which is which.

Entries tagged `studex/restricted` are listed so they are accounted for. Their
contents are deliberately not indexed and must never be committed to a public
repository. `/workspace/TOOLS.md` is the credential vault and is the clearest
example: it is named in the register precisely so the rule travels with it.
