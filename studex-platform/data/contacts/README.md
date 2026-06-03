# `data/contacts/` — prospect spreadsheets (gitignored)

Drop CSV / JSON files here for the import script to pick up. Files in this
folder are **not committed** (see `.gitignore`) — keep them off git so
proprietary scoring and prospect intel don't leak through repo access.

## What goes here

- `AFRICA_B2B_FULL_SCRAPE.csv` — scraped Africa B2B contacts
- `AFRICA_B2B_MASTER_LIST.csv` — master list with product + priority
- `SA_HOTELS_RESTAURANTS_TIER_LIST.csv` — tiered SA hotels + restaurants
- `SA_HOTELS_RESTOS_B2B_FULL.csv` — full SA B2B sheet with scoring
- `hotelemailsscraped.json` — scraped hotel emails

The import script accepts any CSV with at least a `name` column — it normalises
the rest from a header-tolerant mapping (see `src/lib/contacts.ts`).

## Run the import

```bash
# from studex-platform/
node --env-file=.env scripts/import-contacts.mjs --dry-run   # preview
node --env-file=.env scripts/import-contacts.mjs             # write to Supabase
```

`--dry-run` prints a summary without touching the database. Without it the
script upserts into `contacts` (dedup by email, falling back to name+website).
