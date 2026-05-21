# Deliverability checklist — get into the inbox, not spam

This is the part that makes or breaks a same-day blast. Listmonk sends the mail;
**your DNS + sending reputation decide whether it lands.** Do this for *each*
sending domain (`studexmeat.com` and your platform/agent domain).

## Free + open-source sending options

You asked to stay free/open-source and use your own agent mail address. Realistic paths:

| Option | Cost | Deliverability | Notes |
|--------|------|----------------|-------|
| **Your agent mailbox SMTP** (e.g. agent@studex.dev) | Free (already have it) | OK for small/warm lists | Watch the provider's daily send limit; fine to start. |
| **Self-hosted SMTP** (Postal, Mailcow — both open-source) | Server only | Needs warm-up + clean IP | Most control, most work. Good once volume grows. |
| **Free tier of a transactional relay** (e.g. Brevo/MailerSend free tier) | Free up to a daily cap | High | Easiest deliverability; plug its SMTP into Listmonk. |

Whichever you pick, it plugs into **Listmonk → Settings → SMTP**. You can switch
later without changing any code.

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
