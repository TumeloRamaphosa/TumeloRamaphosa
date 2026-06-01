---
name: video-pipeline
description: Turn a topic into a short-form video package for Reels/TikTok/YouTube Shorts — hook, full script, voiceover lines, on-screen subtitle timing, shot list, and BGM/style notes. Modeled on the MoneyPrinterTurbo flow. Use for daily short-form video.
---

# /video-pipeline

Produce a one-click-ready short video package (15–45s).

## Steps
1. Load the brand bible + the social post/topic this video supports.
2. Build the package:
   - **Hook** (first 2s, must stop the scroll)
   - **Script** (spoken, conversational, ~120–160 wpm)
   - **Voiceover lines** broken into subtitle-sized chunks with rough timing
   - **Shot list / B-roll** (what to film or which stock/store footage)
   - **On-screen text** + **BGM/style** + **CTA**
   - **Caption + hashtags** for the platform
3. Note aspect ratio 9:16 and platform (Reels/TikTok/Shorts).

## Output → `vault/outputs/video/YYYY-MM-DD-<slug>.md`

## Rules
- Hook first. Keep it tight — short-form lives or dies in the first 2 seconds.
- If the user wants full auto-generation (TTS voice + rendered video), that runs on the
  Mac mini via a MoneyPrinterTurbo-style tool — produce this package as its input and say so.
