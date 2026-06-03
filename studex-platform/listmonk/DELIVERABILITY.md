# Deliverability checklist — get into the inbox, not spam

This is the part that makes or breaks a same-day blast. Listmonk sends the mail;
**your DNS + sending reputation decide whether it lands.** Do this for *each*
sending domain (`studexmeat.com` and your platform/agent domain).

## Free + open-source sending options

Listmonk stays open-source. The sending leg is **pluggable** — point it at
whatever SMTP your domain is authenticated with.

| Option | Cost | Deliverability | Notes |
|--------|------|----------------|-------|
| **Resend** (recommended) | Free tier: 100/day, 3,000/month; cheap thereafter | Excellent | One key powers Listmonk SMTP *and* the cold-outreach Resend SDK in the app. |
| Your agent mailbox SMTP | Free | OK for small/warm lists | Watch the provider's daily limit; fine to start. |
| Self-hosted (Postal, Mailcow) | Server only | Needs warm-up + clean IP | Most control, most work. |

Whichever you pick, it plugs into **Listmonk → Settings → SMTP**. You can switch
later without changing any code.

### Resend → Listmonk SMTP (preferred)

Settings → SMTP → Add:

```
Host:       smtp.resend.com
Port:       465 (SSL/TLS)  OR  587 (STARTTLS)
Username:   resend
Password:   <your RESEND_API_KEY — keep in env, not in screenshots>
From email: hello@studexmeat.com   (or your studex.dev mailbox)
```

The same API key drives the cold-outreach pipeline in the Next.js app (set
`RESEND_API_KEY` in `.env.local`). Verify your sending domain in the Resend
dashboard and add the SPF/DKIM records they show you — those are the only DNS
changes you need.

> Security note: if a Resend key is ever exposed in chat, screenshots, commits,
> or a public log, **revoke it in the dashboard immediately** and generate a new
> one. Keys never go into source code or `.env.example`.

## 1. SPF — authorise who can send for your domain

Add a TXT record on the root domain. Use the value your sending provider gives you.
Examples:

```
# If sending through your own mail host:
studexmeat.com.   TXT   "v=spf1 mx ~all"

# If relaying through a provider, include theirs, e.g.:
studexmeat.com.   TXT   "v=spf1 include:spf.theprovider.com ~all"
```

Only **one** SPF record per domain — merge includes if you have several senders.

## 2. DKIM — cryptographically sign your mail

Your SMTP/relay provider generates a DKIM key and gives you a TXT record like:

```
selector._domainkey.studexmeat.com.   TXT   "v=DKIM1; k=rsa; p=MIGfMA0G...long-public-key..."
```

Add it exactly as given. (Self-hosting? Postal/Mailcow generate the key for you.)

## 3. DMARC — tell inboxes what to do + get reports

Start in monitoring mode (`p=none`), then tighten to `quarantine`/`reject` once
SPF+DKIM pass consistently:

```
_dmarc.studexmeat.com.   TXT   "v=DMARC1; p=none; rua=mailto:dmarc@studexmeat.com; fo=1"
```

## 4. Verify before you send

- Send a test to a Gmail address → open **Show original** → confirm
  `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS`.
- Or use a seed-test tool (mail-tester.com) → aim for 9–10/10.

## 5. List hygiene + warm-up (protects reputation)

- **Double opt-in** on both lists (already the default in our setup).
- Never send to bought/scraped addresses — one spam-trap hit can blacklist you.
- **Warm up:** day 1 send to your most-engaged subscribers; ramp volume over a
  few days rather than blasting a cold list of thousands at once.
- Honour unsubscribes instantly — the `{{ UnsubscribeURL }}` is built into both
  templates; keep it there (it's also legally required under POPIA/CAN-SPAM).
- Watch Listmonk's bounce/complaint stats; prune hard bounces.

## 6. Reverse DNS (only if self-hosting SMTP)

Set PTR for your sending IP to match your mail hostname, or providers will
distrust it. Skip this if you relay through a provider.

---

**Same-day reality:** templates, import, and the website hook can all be done in
an hour. DNS records (SPF/DKIM/DMARC) usually propagate in minutes to a couple of
hours — so a real send today is doable *if* you add the DNS records early and let
them verify before the big push.
