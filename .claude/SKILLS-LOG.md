# Skills & Automations Log

Durable, GitHub-hosted record of every skill/automation added, changed, or
removed in this repo. Claude updates this whenever the project's `.md` files or
skills change, and reads it to produce the **daily skills report**.

Format: newest entries on top. Each entry is dated `YYYY-MM-DD`.

---

## 2026-06-25

- **Added `youtube-transcript` skill** (`.claude/skills/youtube-transcript/`).
  Pulls a YouTube video's captions via `youtube-transcript-api`, with optional
  timestamps. Sourced from the gist by `@intellectronica`
  (github.com/intellectronica/agent-skills). Fires when the user asks for a
  transcript/subtitles/captions of a YouTube URL or ID.
  - Caveat: needs outbound YouTube access; blocked in sandboxes where Google/
    YouTube domains are filtered by the network policy.
- **Added `skill-creator` skill** (`.claude/skills/skill-creator/`).
  Scaffolds, writes, and refines new skills and keeps the registry/log healthy.
  Fires when the user wants a new skill/automation or when a repeated workflow
  should be captured.
- **Added `CLAUDE.md`** with the skills registry table and the standing working
  agreement: suggest skills proactively, give a daily skills report, and keep
  the registry + this log in sync on GitHub.
- **Established this log** (`.claude/SKILLS-LOG.md`) as the single source of
  truth for the daily report.
