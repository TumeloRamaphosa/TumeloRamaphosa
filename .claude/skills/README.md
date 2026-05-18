# Skills

Claude Code skills available to this project. They auto-activate in Claude
Code (web, CLI, IDE) when a task matches their description.

## Installed (skill-formatted)

| Prefix / name | Source | Use |
|---|---|---|
| `remotion` | remotion-dev/skills | In-app video creation in React (NotebookLM-style overviews, promo clips) |
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill | Design intelligence — styles, colour, type, charts (wrapper SKILL.md added) |
| `graphify` | safishamsi/graphify | Turn code/docs/media into a knowledge graph; answer codebase questions |
| `goal` | jthack/claude-goal | Persistent long-running `/goal` objectives |
| `sp-*` (15) | obra/superpowers | Brainstorming, writing/executing plans, code review, TDD, debugging |
| `gstack-*` (47) | garrytan/gstack | Deploy, review, QA, design-review, planning workflow pack |

## Not installed (not skill-format — documented for context)

- **kyegomez/OpenMythos** — a Python agent-framework library, not a Claude
  skill. Integrate as a dependency in agent code, not via `.claude/skills`.
- **supermemoryai/openclaw-supermemory** — an OpenClaw memory layer
  (`commands/` + `hooks/`), wired as a plugin/hooks, not a SKILL.md skill.
- **21st-dev** — repo path `21st-dev/21st` 404'd; 21st.dev ships as a
  Claude marketplace plugin (`/plugin marketplace add ...`), not a clone.

## Note

Adding skills to the repo makes them available to **future** Claude Code
sessions and the team. They do not hot-load into an already-running
session.
