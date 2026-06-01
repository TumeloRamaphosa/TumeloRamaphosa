---
name: seo-article
description: Research and draft an SEO-optimized article, recipe, or buying guide for studexmeat.com, on-page ready (title, meta, H-structure, internal links, schema). Use to create blog/content that ranks for what meat buyers search.
---

# /seo-article

Create a publish-ready article for the store's blog.

## Steps
1. Load the brand bible (`vault/wiki/brand/studexmeat-brand.md`) for voice + facts.
2. Confirm/ask the target topic + primary keyword. If unknown, suggest 3 from the
   Marketing domain notes or offer to run `/research-job` for keyword research first.
3. Draft with: SEO title (<60 chars), meta description (<155), H1/H2/H3 outline,
   the body, an FAQ, internal-link suggestions, and JSON-LD schema (Article/Recipe).
4. Flag any claim not backed by the brand bible as an assumption to verify.

## Output → `vault/outputs/content/articles/YYYY-MM-DD-<slug>.md`
Front-matter: `title, keyword, meta, status: draft, channel: blog`.

## Rules
- Match brand voice. No invented certifications, prices, or sourcing claims.
- Write for the South African meat buyer; use local terms where the brand bible sets them.
