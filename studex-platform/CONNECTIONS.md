# StudEx Platform — Connections Brief
> For Claude Code. All API flows, IDs, and integration notes.
> Last updated: 2026-06-03 by Perplexity Computer (Tumelo's AI orchestrator)

---

## Architecture Overview

| Layer | Service | Purpose |
|-------|---------|---------|
| Web app + dashboard | Vercel (Next.js) | Frontend, API routes, dashboard |
| Always-on agents | Fly.io `datanetics-app` (JNB region) | CashClaw revenue agent, background jobs |
| Workflow automation | n8n `studex-n8n-runner` on Fly.io | QuickBooks sync, order flows |
| Local LLMs | Manus VM `35.196.24.245` | Ollama: hermes3:8b, qwen3:30b |
| Database | Supabase | Multi-user persistent data |
| E-commerce | Shopify `studexmeat.myshopify.com` | Orders, products, inventory |

---

## Meta (Facebook + Instagram)

### IDs
- **Facebook Page ID:** `108934711902801`
- **Instagram Business Account ID:** `17841403538967823`
- **Ad Account ID:** `act_560666565541381`
- **App ID:** `1649681979685968` (Studex Content Analyser)
- **Graph API version:** `v20.0`

### Two tokens — use the right one
| Token | Env var | Use for |
|-------|---------|---------|
| Page token | `META_PAGE_TOKEN` | FB posts, IG posts, page insights |
| User token | `META_USER_TOKEN` | Ads API only — expires daily (short-lived) |

### Facebook post flow (image)
```
1. POST /v20.0/{PAGE_ID}/photos
   Form: source=<file>, published=false, access_token=META_PAGE_TOKEN
   → returns { id: "photo_id" }

2. POST /v20.0/{PAGE_ID}/feed
   Form: message="caption", attached_media=[{"media_fbid":"photo_id"}], access_token=META_PAGE_TOKEN
   → returns { id: "page_post_id" }
```

### Instagram post flow (image)
```
1. POST /v20.0/{IG_ID}/media
   Form: image_url="public_url", caption="text", access_token=META_PAGE_TOKEN
   → returns { id: "container_id" }

2. GET /v20.0/{container_id}?fields=status_code&access_token=META_PAGE_TOKEN
   Poll until status_code === "FINISHED" (usually instant, retry 5x with 3s delay)

3. POST /v20.0/{IG_ID}/media_publish
   Form: creation_id="container_id", access_token=META_PAGE_TOKEN
   → returns { id: "ig_post_id" }
```

### Instagram Reels flow (video)
Same as image but Step 1 uses:
`media_type=REELS`, `video_url="public_url"` (not image_url)

### Facebook Ads flow
```
1. Upload image to ad library:
   POST /v20.0/{AD_ACCOUNT}/adimages
   Form: filename=<file>, access_token=META_USER_TOKEN
   → returns { images: { filename: { hash: "image_hash" } } }

2. Create campaign:
   POST /v20.0/{AD_ACCOUNT}/campaigns
   Fields: name, objective=OUTCOME_TRAFFIC, status=PAUSED, special_ad_categories=[]

3. Create adset:
   POST /v20.0/{AD_ACCOUNT}/adsets
   Fields: name, campaign_id, daily_budget (cents), billing_event=IMPRESSIONS,
           optimization_goal=LINK_CLICKS, bid_strategy=LOWEST_COST_WITHOUT_CAP,
           start_time (ISO8601), status=PAUSED, targeting (JSON)
   ⚠️ targeting must include: geo_locations, age_min, age_max

4. Create creative:
   POST /v20.0/{AD_ACCOUNT}/adcreatives
   Fields: name, object_story_spec (page_id + link_data with image_hash),
           instagram_actor_id=INSTAGRAM_ACCOUNT_ID  ← REQUIRED for IG placement
   ⚠️ Missing instagram_actor_id was causing "Ad Incomplete" error

5. Create ad:
   POST /v20.0/{AD_ACCOUNT}/ads
   Fields: name, adset_id, creative={creative_id}, status=PAUSED

6. Activate: PATCH status=ACTIVE on campaign + adset + ad
```

---

## Shopify

- **Store:** `studexmeat.myshopify.com`
- **Connector:** `source_id: shopify` (already authenticated in Perplexity)
- **Key products with negative stock (FIX URGENTLY):**
  - Wagyu Burger Patties: -248 units
  - Luxury Biltong 1kg: -218 units
  - Tomahawk 1kg: -209 units
  - Wagyu Ribeye 1kg: -119 units
  - Wagyu Picanha 1kg: -111 units
- **Confirmed delivered (mark as fulfilled):** Orders #1922, #1930, #1911

### Key API calls
```
# Orders today (SAST = UTC+2)
GET /admin/api/2024-01/orders.json?status=any&created_at_min=2026-06-03T00:00:00+02:00

# Unfulfilled paid orders
GET /admin/api/2024-01/orders.json?financial_status=paid&fulfillment_status=unfulfilled
```

---

## Google Analytics 4
- **Property:** `properties/295728486`
- **Connector:** `source_id: google_analytics__pipedream`

---

## Google Ads
- **Customer ID:** `2234319068`
- **Connector:** `source_id: google_ads__pipedream`

---

## Fly.io
- **Apps:** `datanetics-app` (JNB region), `studex-n8n-runner`
- **Single VM architecture** — everything on ONE machine

---

## n8n
- **URL:** `https://studexgroup.app.n8n.cloud`
- **QuickBooks workflow:** active (keep it)

---

## Dashboard Rules (CRITICAL)
1. Privacy toggle masks all numbers as `••••••` — use React context, NOT localStorage
2. Customer names always shown as initials only (e.g. "T.R.")
3. All monetary values use `font-mono` class
4. Currency: ZAR with `R` prefix
5. Dark theme: bg `#0D0D0D`, cards `#1A1A1A`, gold accent `#C9A84C`, cream text `#F5F0E8`
6. CashClaw is the revenue agent for studexmeat.com

---

## Content Hub — Live Posts
- **Facebook post:** `108934711902801_978017658337352` (Tomahawk Father's Day, Jun 3)
- **Instagram post:** `18050932724593521` (same, Jun 3)
- **Previous FB post:** `108934711902801_977981818340936` (earlier Father's Day teaser)
- **Previous IG post:** `17946060702079700`

---

## Campaigns Built (in Meta Ads Manager)
- **Campaign:** "Father's Day Tomahawk - Jun 2026" ID `120245475014320003`
- **Ad Set:** "JHB Fathers Day - Traffic" ID `120245475048870003`
  - Budget: R100/day | South Africa | Ages 25-55 | Status: PAUSED
  - Image hash in ad library: `3fb5f04658724923dec8265a1bd5a272`
- **Status:** Needs fresh user token + ad creative with `instagram_actor_id` to go live
