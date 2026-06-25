---
name: skill-creator
description: Create, scaffold, and refine Claude Code skills. Use when the user wants to make a new skill, turn a repeated workflow into a reusable skill, package a script/automation as a skill, or improve an existing skill. Also use proactively when a task is being repeated and would benefit from being captured as a skill.
---

# Skill Creator

This skill helps you author high-quality Claude Code skills and keep the team's
skill library healthy. A "skill" is a folder under `.claude/skills/<name>/`
containing a `SKILL.md` (with YAML frontmatter) plus any supporting scripts,
templates, or reference files.

## When to create a skill

Create a skill when ANY of these are true:
- A task has been done 2+ times the same way (it's a pattern, not a one-off).
- There's a multi-step procedure worth capturing so it runs consistently.
- A script/tool is useful enough to reuse and would otherwise be re-explained.
- The user explicitly asks for a skill or automation.

If it's a genuine one-off, do NOT create a skill — just do the task.

## Anatomy of a skill

```
.claude/skills/<skill-name>/
  SKILL.md            # required: frontmatter + instructions
  scripts/            # optional: runnable helpers (python/bash/node)
  references/         # optional: docs, templates, examples
  assets/             # optional: static files the skill needs
```

### SKILL.md frontmatter (required)

```yaml
---
name: <kebab-case-name>          # must match the folder name
description: <one paragraph>      # WHAT it does + WHEN to use it (triggers)
---
```

The `description` is the most important field — it's how the skill gets
discovered and auto-invoked. Always state both what the skill does AND the
concrete trigger conditions ("Use when the user asks for X / provides Y").

### SKILL.md body

Keep it concise and operational. Recommended sections:
- A one-line summary of the skill.
- `## Usage` — exact commands or steps, copy-pasteable.
- `## Inputs / Outputs` — what it takes, what it produces, defaults.
- `## Notes` — edge cases, requirements, environment caveats.

## Procedure for creating a new skill

1. **Name it.** kebab-case, descriptive, matches the folder.
2. **Write the description first.** Nail the trigger conditions — this is what
   makes it auto-fire at the right time.
3. **Scaffold the folder** under `.claude/skills/<name>/`.
4. **Write SKILL.md** following the structure above. Be specific and terse.
5. **Add scripts/refs** if needed. Prefer `uv run` self-contained scripts for
   Python (inline `# /// script` deps) so they need no separate install.
6. **Test the trigger mentally:** would the description make Claude pick this
   skill for the intended request, and NOT misfire on unrelated ones?
7. **Register it.** Add an entry to the repo `CLAUDE.md` skills table and append
   a dated line to `.claude/SKILLS-LOG.md` (what was added and why).
8. **Commit** with a clear message and push to the working branch.

## Quality checklist

- [ ] `name` matches folder, kebab-case.
- [ ] `description` says what + when (triggers), in one paragraph.
- [ ] Body is operational, not vague; commands are copy-pasteable.
- [ ] Scripts are self-contained / declare their deps.
- [ ] Environment caveats noted (e.g. network access, API keys).
- [ ] Registered in CLAUDE.md and logged in SKILLS-LOG.md.

## Improving an existing skill

Read its SKILL.md, identify the gap (bad trigger, missing step, broken script),
make the minimal change, then update SKILLS-LOG.md noting the revision.
