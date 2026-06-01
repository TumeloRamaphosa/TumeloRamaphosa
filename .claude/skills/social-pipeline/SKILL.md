---
name: social-pipeline
description: Generate a week of platform-native social content for studexmeat.com (Instagram, Facebook, TikTok, YouTube Shorts) — hooks, captions, hashtags, and a posting calendar. Use for the weekly social sprint or a campaign push.
---

# /social-pipeline

Produce a week of ready-to-post social content.

## Steps
1. Load the brand bible + this week's `/weekly-review` plan (theme + product focus).
2. Pull any winning hooks/formats from the Social domain note.
3. For each channel, create the week's posts:
   - **IG/FB**: caption, 5–10 hashtags, CTA, suggested visual/format (reel/carousel/static).
   - **TikTok / YT Shorts**: hook line + 1-line concept → hand off to `/video-pipeline` for scripts.
4. Lay them on a 7-day calendar with best-guess post times (refine from GA4/Meta data later).

## Output → `vault/outputs/content/social/YYYY-Www.md`

## Rules
- Platform-native (don't copy-paste one caption across all). Hook in the first line.
- Every post ties to a product, offer, or story from the brand bible. No invented claims.
- Mark which posts should become videos so `/video-pipeline` can pick them up.
