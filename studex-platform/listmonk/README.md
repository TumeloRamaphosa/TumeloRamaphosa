# StudEx Email Marketing — Listmonk

Self-hosted, open-source email marketing for the two product launches:

- **StudEx Meat** — `studexmeat.com` (consumer)
- **Agent-as-a-Service** — the StudEx platform (B2B / developers)

No per-subscriber fees. You run Listmonk yourself and send through your own
"agent mail" account. See [`DELIVERABILITY.md`](./DELIVERABILITY.md) for the
DNS/SMTP setup that gets you into inboxes.

## 1. Run Listmonk

```bash
cd listmonk
cp .env.example .env          # set strong DB + admin passwords
docker compose up -d          # starts Postgres + Listmonk
```

Open <http://localhost:9000> and log in with the admin user/password from `.env`.
(For production, put it behind a domain + TLS, e.g. `mail.studex.dev` — see DELIVERABILITY.md.)

## 2. Connect your sending account (agent mail)

In the admin UI: **Settings → SMTP → Add**. Enter your agent mailbox details
(host, port `587`, username = the full address, password). Send the test mail.
This is the only place credentials live — nothing is hardcoded.

## 3. Create the two lists

**Lists → New** twice:

| List name      | Type    | Opt-in            | Use for                |
|----------------|---------|-------------------|------------------------|
| StudEx Meat    | Public  | Double (opt-in)   | studexmeat.com buyers  |
| Agent Service  | Public  | Double (opt-in)   | platform / B2B leads   |

Note each list's numeric **ID** — you'll put them in the site's env vars.

## 4. Import your existing email lists

**Subscribers → Import** → upload your CSV (`email`, optional `name`) → pick the
matching list. Use *double opt-in* lists so Listmonk asks people to confirm —
this protects your sender reputation and keeps you POPIA/GDPR-compliant.

## 5. Send the launch campaigns

**Campaigns → New** → Format **Raw HTML** → paste the matching file from
[`templates/`](./templates):

- `templates/studexmeat-launch.html`
- `templates/agent-as-a-service-launch.html`

Replace the `REPLACE_*` placeholders (images, links), send a **test to yourself**,
then schedule or send.

## 6. Auto-grow the lists from the website

The Next.js site has `POST /api/subscribe` wired to Listmonk
(`src/app/api/subscribe/route.ts`) and a signup form in the footer. Set these in
the app's `.env`:

```
LISTMONK_API_URL=https://mail.studex.dev
LISTMONK_API_USER=studex-site          # an API user created in Listmonk → Settings → Users
LISTMONK_API_TOKEN=...
LISTMONK_LIST_MEAT=<meat list id>
LISTMONK_LIST_AGENT=<agent list id>
```

New signups are added with double opt-in, so each person confirms by email.

## Launch-day order of operations

1. `docker compose up -d` and log in.
2. Configure SMTP (agent mail) + send test.
3. Add SPF / DKIM / DMARC DNS records (DELIVERABILITY.md) and verify.
4. Create the two lists, import CSVs.
5. Build both campaigns from the templates, send tests.
6. Warm up: send to your most-engaged subscribers first, then the rest.
7. Set the app env vars so the website form starts collecting new subscribers.
