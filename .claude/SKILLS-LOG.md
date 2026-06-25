# Skills & Automations Log

The durable, GitHub-hosted record of every skill/automation Claude adds, changes,
or removes. Claude updates this file whenever the project's skill `.md` files
change, and reads it to produce the **daily skills report**.

Format: newest entries on top. Each entry is dated `YYYY-MM-DD`.

---

## 2026-06-25

### Added: `youtube-transcript` skill
- Source: gist by `@intellectronica` (`github.com/intellectronica/agent-skills`).
- Extracts YouTube captions/transcript (plain or with timestamps) via
  `youtube-transcript-api`, run as a self-contained `uv` script.
- Files: `.claude/skills/youtube-transcript/SKILL.md`,
  `.claude/skills/youtube-transcript/scripts/get_transcript.py`.
- Caveat: needs outbound YouTube access; blocked in this remote sandbox, runs fine
  on a normal-internet machine.

### Added: `skill-creator` skill
- Built natively (no public "skill-creator" exists in the source repo).
- Scaffolds and refines new skills, defines when to turn a repeated workflow into a
  skill, and enforces registering each skill in `CLAUDE.md` + this log.
- File: `.claude/skills/skill-creator/SKILL.md`.

### Added: working agreement
- `CLAUDE.md` now defines the standing rules: suggest skills/automations
  proactively, give a daily skills report, and keep this log in sync on GitHub.
