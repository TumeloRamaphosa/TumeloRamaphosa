# CLAUDE.md

Project guidance for Claude Code working in this repository.

## Skills registry

Reusable skills live under `.claude/skills/<name>/`. Current skills:

| Skill | What it does | When it fires |
|-------|--------------|---------------|
| `youtube-transcript` | Pulls captions/transcript from a YouTube video (optional timestamps) via `youtube-transcript-api`. | User asks for a transcript/subtitles/captions and gives a YouTube URL or ID. |
| `skill-creator` | Scaffolds, writes, and refines new skills; keeps the registry healthy. | User wants a new skill/automation, or a repeated workflow should be captured. |

> Note: `youtube-transcript` needs outbound access to YouTube. In remote/sandboxed
> sessions where YouTube/Google domains are blocked by the network policy, run its
> script from a machine with normal internet access.

## Working agreement: skills & automations

These are standing instructions for how Claude works with the team:

1. **Suggest proactively.** When a task gets repeated or is clearly a time-sink,
   propose turning it into a skill or automation (via `skill-creator`) instead of
   just doing it again silently.
2. **Daily skills report.** At the start of each working day (or first session of
   the day), tell the user what new skills/automations were added or changed since
   the last report. Source of truth is `.claude/SKILLS-LOG.md`.
3. **Keep the docs in sync.** Whenever a skill is added, changed, or removed:
   - update the table above,
   - append a dated entry to `.claude/SKILLS-LOG.md`,
   - commit and push so the record lives on GitHub.
4. **One source of truth on GitHub.** `.claude/SKILLS-LOG.md` is the durable,
   GitHub-hosted log Claude updates whenever these `.md` files change. Read it to
   produce the daily report.

## Git

- Develop on branch `claude/video-transcription-6xscyn`.
- Commit with clear messages; push with `git push -u origin <branch>`.
- Do not open pull requests unless explicitly asked.
