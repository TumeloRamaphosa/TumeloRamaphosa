---
name: vault-cleanup
description: Promote durable findings from raw/ to wiki/, dedupe, fix links, and update the master index. Use weekly (after the Friday review) or when raw/ gets messy. Keeps the OS memory clean so /kb-query stays sharp.
---

# /vault-cleanup

Tend the brain. *Raw is allowed to be messy; wiki is not.*

## Steps
1. Scan `vault/raw/` (incl. `inbox/done/`) for notes worth keeping.
2. For each keeper: clean it, add a `source:`, give it a clear title, and move/rewrite it
   into the right `vault/wiki/...` folder (domain or playbook). One concept per note.
3. Add `[[wiki-links]]` to connect it to related notes.
4. Remove duplicates and dead/stale raw files (summarize what you removed).
5. Update `vault/_master-index.md` and any domain `_index.md` touched.

## Rules
- Don't delete anything you can't summarize. List removals at the end for review.
- Never promote an unsourced claim into `wiki/` — leave it in `raw/` flagged instead.
