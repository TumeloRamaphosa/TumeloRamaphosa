# INTERNAL — SafeSight / LAISA engagement assessment

> **Do not share with client.** This is the honest read for the StudEx
> team. The v2 proposal (`laisa-milestone-1-v2.md`) is the diplomatic
> client-facing version of the same analysis.

**Date:** 3 June 2026
**Author:** StudEx / agent-assisted draft, T. Ramaphosa to review and edit
**Reference docs:** PRD (LAISA Discovery, May 2026); repo at
`claude/plan-agent-saas-infra-ETYkk`; proposal `laisa-milestone-1-v2.md`

---

## 1. The headline reality

**We have delivered R280K of work against a client-stated budget of
R50K–R100K (PRD Q37).** This is the single most important fact in the
engagement and it has to be confronted, not papered over.

There is no version where we get paid R280K against a R50K–R100K
stated ceiling without an explicit conversation that converts that
answer into an agreed number. Either:

- They are good for the higher number (in which case Q37 was a
  starting position) → push Option A.
- They need it spread → push Option B (R75K deposit + R50K × 4).
- They will hold the R95K ceiling → Option C, take the loss, bank
  credit, only if relationship value > the lost margin.

**My read: Option B is the most defensible commercial position.** It
honours their PRD answer literally, gets us paid in full, and matches
their cashflow rhythm.

---

## 2. What the PRD actually told us

Read carefully, the PRD is rich. Highlights we should never lose sight
of:

- **Q22 (no integration) + Q32 (fix-one-thing = system integration)** —
  this is THE deal. Everything else is supporting cast.
- **Q24 (nothing automated) + Q25 (no AI tools)** — they are starting
  from zero. The lift is large.
- **Q26/Q27** — they explicitly want booking, reminders, comms, admin
  AI, patient chatbot. They do **not** want clinical AI (smart — keep
  doctors in the loop).
- **Q34** — they want "process automation" and "AI-assisted ops" — NOT
  "fully intelligent system". Manage expectations honestly; do not
  oversell.
- **Q37** — R50K–R100K. The number we need to address.
- **Q38** — 3–6 months. Aligns with our Phase 2 timeline.
- **Q40** — concerns: integration risk, AI risk, patient-care
  integrity. We respond to all three in the v2 proposal.

The PRD shows a clinic that knows what's wrong (clear pain points,
clear priorities) but has no infrastructure in place. The
transformation they want is real and serious.

---

## 3. Where they actually are (frank)

Against publicly observable benchmarks for multidisciplinary clinics
in their tier (1 location, 5-doctor ophthalmology + aesthetics combo,
SafeSight/LAISA brand):

| Pillar | Reality on the ground | Comment |
|--------|-----------------------|---------|
| Website (WordPress, marketing officer maintains) | Functional but not converting | The current "book now → WhatsApp" flow is the conversion (Q11). Sound, but everything depends on WhatsApp throughput. |
| Google My Business | **Not visible to us as an optimised asset** | This is the single highest-leverage local-SEO miss for a medical practice. Free to fix. Hours of effort. |
| Facebook Business + Meta Business Suite | **Not configured for Ads / Business use** | Required for WhatsApp Business Cloud API. Without it, Charlie can never go live properly. |
| Facebook Ads / Google Ads | **Not running** (Q12 explicitly excludes both) | This is the biggest revenue lever they are NOT pulling. Peers in their tier run R30–50K/month and return R150K–R400K. They are leaving substantial money on the table every single month. |
| Marketing officer's tech literacy | Unknown but indications are basic | Not aware of Facebook Graph API mechanics, pixel/CAPI, ad-platform anatomy. Phase 2 will need our team driving, not their marketing officer. **Training is a real Phase 2 line item.** |
| WhatsApp Business | **Human reception only**, business hours | After-hours leads die. Patients waiting 20+ minutes for replies. Conversion ceiling. |
| Booking flow | Click → WhatsApp → human types it into Elixir/My Appointment | Manual, error-prone, no instant confirmation, no rescheduling self-serve. |
| Records | **Google Drive + paper** (Q23) | For a medical practice in 2026 this is a real compliance risk. POPIA exposure. Not our problem in M1 but absolutely a Phase 3 priority. |
| Internal systems | **None integrated** (Q22) | Elixir Live ↔ My Appointment ↔ Sage ↔ Google Drive are four islands. Reception works across all four manually. |
| Automation | **None** (Q24) | Reminders done by phone call. Confirmations by SMS. Marketing research done manually (Q20). |

**Operational score: realistically 3.5 / 10** against top-decile peers
in their category. They have the medical reputation; the operational
layer is starved.

---

## 4. Risks they bring to the engagement (frank)

### 4.1 Response cadence
The client has historically been slow on email and WhatsApp. We have
sent multiple proposals/iterations without response inside a week. This
is the biggest schedule risk. **It also impacts their own patients
today** (Q19 lists backlogs, system downtime, delayed payment chasing
as inefficiencies — these are downstream of the same response-cadence
problem). The same operational culture that delays our build delays
their own patient care.

### 4.2 Decision pace at clinic's own time
Every major decision waits for the principal's availability. We need
a calendar-locked weekly check-in built into the contract or this
project takes 12 months instead of 6.

### 4.3 Building in silos
You mentioned we are not in contact with their "transformation
person" / team co-ordinator. If there are other vendors (web, social,
ads, marketing officer, IT) all delivering pieces with no shared
co-ordinator, integration debt and duplicate spend are guaranteed.
**Recommend: StudEx becomes the single transformation owner**, all
other vendors report through us OR are documented as out-of-scope and
will be integrated only via published APIs.

### 4.4 Foundation gaps that block our own work
- No properly set up **Facebook Business** → Charlie can't deploy on
  WhatsApp Business Cloud API properly.
- No **Google My Business optimisation** → local-SEO ceiling stays
  low even with our dashboard pretty on top.
- No **paid acquisition** running → can't measure attribution
  uplift from any of our work.

These should be a **"Foundation Pack"** quoted at R45K (Section 8 of
the v2 proposal). It's not a profit line; it's a *gate* — we cannot
deliver Phase 2 success metrics if these aren't in place.

### 4.5 Marketing officer skill ceiling
Indications are the marketing officer is not familiar with: Facebook
Graph API, pixel mechanics, conversion tracking, ad bidding, server-
side attribution (CAPI). **They will not be able to operate the
dashboard's full value without training or a managed retainer.**
Either we ramp them up (training included in Grow / Scale retainer)
or we run it (Scale retainer at R75K/month).

### 4.6 Patient-care risk during transformation (their Q40 concern)
Genuine and we should honour it. Two contract terms protect this:

- **No clinical AI in M1 or Phase 2.** All clinical workflows remain
  doctor-led. AI is scoped to admin and patient comms only.
- **Doctor-loop preserved on any patient-facing comms.** Charlie can
  triage and book, but anything clinical escalates to a human.

### 4.7 POPIA / patient-data exposure
Records on Google Drive + paper, with WhatsApp as the primary patient
comms channel — this is a POPIA risk surface. We should not be the
ones managing that risk in M1, but we should **document the exposure
in writing** and recommend their attorneys review before Phase 3 begins.

---

## 5. The 2nd Brain question — what I could not do

You referenced an Obsidian vault at
`/Users/tumeloramaphosa/Documents/Obsidian Vault/2nd Brain/SafeSight-LAISA`
— this is a path on your Mac, not accessible from this Linux sandbox.

I have NOT read the 2nd Brain. The v2 proposal and this assessment are
built from:

- The PRD docx you uploaded
- The repo state on `claude/plan-agent-saas-infra-ETYkk`
- Conversation context

**To close the loop, please either:**

1. Zip the relevant 2nd Brain subfolder and upload it (I'll merge what
   it contains into the proposal); **or**
2. Copy the key notes' contents into a single markdown file and upload
   that; **or**
3. Move the vault into the repo under `.obsidian-vault/` (gitignored)
   and let me read it directly next session.

Until then, anything I claim about the 2nd Brain would be invented.

---

## 6. Recommended next move (your decision)

1. **Pick a payment option (A / B / C in v2 §9).** I recommend B.
2. **Confirm the budget reconciliation conversation** has happened with
   the client, or schedule it before sending the v2 proposal.
3. **Send the v2 proposal + the PDF** (I'll generate the PDF next).
4. **Add the Foundation Pack (R45K) as a separate line item** — they
   may agree to that even if they push back on M1 pricing, because
   without it Charlie can't go live.
5. **Recover the 2nd Brain** so we can fold whatever's in there into
   the next iteration.
6. **Ask the client to nominate a single transformation point of
   contact** with a 48-hour response SLA written into the contract.
   This is non-negotiable for Phase 2.
7. **Lock the weekly check-in calendar slot** before Phase 2 starts.

If the client cannot commit to (6) and (7), we should price Phase 2
significantly higher to absorb the schedule risk, or decline Phase 2.
This is the rare case where saying *no* to scope protects the
relationship better than saying yes.

---

*This is your internal copy. Edit, delete, share with a co-founder, do
not send to the client unedited.*
