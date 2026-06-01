---
name: customer-followup
description: Draft customer/lead messages for studexmeat.com — order follow-ups, abandoned-cart nudges, review requests, and win-back campaigns (email / WhatsApp / Instagram DM). Use to turn orders into repeat customers.
---

# /customer-followup

Draft on-brand outbound messages that convert and retain.

## Steps
1. Load the brand bible for voice + offers.
2. Confirm the scenario (order thank-you, abandoned cart, review ask, win-back, launch) and channel.
3. Draft 2–3 variants per channel, each short, warm, and with one clear CTA.
4. Include subject lines (email) and note any merge fields ({{first_name}}, {{order_id}}).

## Output → `vault/outputs/content/messages/YYYY-MM-DD-<scenario>.md`

## Rules
- **POPIA**: only message people with a lawful basis (existing customers/opt-ins). Add an
  opt-out line. Never scrape or message cold contacts.
- No invented discounts — only offers confirmed in the brand bible or by the user.
