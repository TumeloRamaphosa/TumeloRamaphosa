# Cloudflare Email & Mass Sending Setup
**Status:** Ready to configure  
**Purpose:** Enable mass email sending from studex.cloud domain  
**Date:** 2026-07-16

---

## CLOUDFLARE SETUP CHECKLIST

### Step 1: Domain Configuration
```
Domain: studex.cloud
Nameservers: Point to Cloudflare
Status: [Need to verify with you]
```

**What you need to do:**
- Go to https://dash.cloudflare.com
- Add domain: studex.cloud
- Update nameservers at your domain registrar
- Wait 24-48 hours for propagation

---

### Step 2: Email Routing (Free Plan)
```
Enable Cloudflare Email Routing:
1. Dashboard → studex.cloud → Email
2. Click "Enable Email Routing"
3. Add catch-all: * → your-inbox@gmail.com
4. Verify with TXT record (Cloudflare provides)
```

**Then you can receive mail at:**
- agents@studex.cloud
- naledi@studex.cloud
- charlie@studex.cloud
- claude.assistant@studex.cloud
- Any user@studex.cloud

---

### Step 3: SMTP Setup (for sending)
```
Provider: Cloudflare Email (limited)
OR
Recommended: SendGrid via Cloudflare Workers

Email sending limit: 300 emails/day (Email Routing)
Better: Use SendGrid (50,000+/day)
```

**Option A: Cloudflare Email Routing (Free)**
```
SMTP Server: mail.studex.cloud
Port: 587 or 465
Username: noreply@studex.cloud
Password: [auto-generated token]
Limit: 300/day
```

**Option B: SendGrid via Cloudflare (Recommended)**
```
1. Sign up: SendGrid.com
2. Get API key
3. Configure in Cloudflare:
   Dashboard → studex.cloud → Email → SendGrid integration
4. Send limit: 50,000/day (free tier)
```

---

### Step 4: SPF/DKIM/DMARC Records

For **Email Reputation** (reduce spam folder):

```
Add these DNS records in Cloudflare:

1. SPF Record:
   Type: TXT
   Name: studex.cloud
   Value: v=spf1 include:sendgrid.net include:agentmail.to ~all

2. DKIM Record:
   Type: CNAME
   Name: sendgrid._domainkey.studex.cloud
   Value: [SendGrid provides]

3. DMARC Record:
   Type: TXT
   Name: _dmarc.studex.cloud
   Value: v=DMARC1; p=quarantine; rua=mailto:reports@studex.cloud
```

---

### Step 5: Agent Mail Integration

**Connect Agent Mail to Cloudflare:**

1. Agent Mail dashboard → Integrations → Cloudflare
2. Paste Cloudflare API key: ${CLOUDFLARE_API_TOKEN}
3. Domain: studex.cloud
4. SMTP settings: Auto-configured
5. Test send: Check ✓

**Agent Mail will use studex.cloud domain for:**
- Outbound campaigns
- Customer notifications
- Agent-to-agent emails
- Response tracking

---

### Step 6: Mass Email Setup (TODAY)

**For sending today's Dark Factory launch:**

```
Volume: How many emails? [You tell me]
Recipients: [List or CSV]
Content: [Draft in Notion first]
Sending time: [Specific time or spread throughout day]
```

**Rate limiting (to avoid spam folder):**
- Don't send >1,000/hour to same domain
- Space sends 1-2 hours apart
- Monitor bounce rates (accept <2%)

**Steps:**
1. Draft email in Google Docs
2. Move to Notion "Email Drafts" database
3. Get Tumelo approval
4. Export recipient list to CSV
5. Upload to SendGrid / Agent Mail
6. Schedule send via Cloudflare Worker (I can build this)
7. Monitor delivery rate in real-time

---

## CONFIGURATION NEEDED FROM YOU

**Paste these into the form below:**

```
❓ What is your Cloudflare account email?
❓ What is your Cloudflare API token? (Settings → API Tokens)
❓ Is studex.cloud already configured in Cloudflare?
   If yes: Are SPF/DKIM/DMARC records set up?
❓ Do you have a SendGrid account? If yes, paste API key
❓ Agent Mail API key: Do you have it, or need to generate new one?
```

---

## QUICK START (If Everything is Ready)

**To send mass email TODAY:**

1. **Draft email** → Write in Google Docs
2. **Get approval** → Notion draft board → Tumelo reviews
3. **Upload list** → CSV with emails
4. **Schedule send** → Agent Mail dashboard
5. **Monitor** → Track opens/clicks in real-time
6. **Sync results** → Notion database updated automatically

**Expected setup time: 15-30 minutes**
**First send time: 1-2 hours from now**

---

## EMAIL ADDRESSES YOU NOW HAVE

```
noreply@studex.cloud           ← General sending
agents@studex.cloud            ← Agent Mail inbox
naledi@studex.cloud            ← Naledi's email
charlie@studex.cloud           ← Charlie's email
claude.assistant@studex.cloud  ← OpenCode's email
support@studex.cloud           ← Customer support
payments@studex.cloud          ← Payment notifications
[any-name]@studex.cloud        ← Unlimited catch-all
```

All receive → forward to your Gmail inbox

---

## LIVE DASHBOARD

Once configured, you can monitor:
- Sent: X emails
- Delivered: Y emails (%)
- Opened: Z emails (%)
- Clicked: A emails (%)
- Bounced: B emails (%)
- Spam complaints: C emails (%)

**Access:** Cloudflare dashboard → Email → Analytics

---

## NEXT STEPS

1. **Paste your Cloudflare details** (see form above)
2. **Confirm Agent Mail is ready** (key rotated?)
3. **Provide email list** (who to send to?)
4. **Draft message** (what to say?)
5. **Get Tumelo approval** (final sign-off)
6. **Send** (I'll execute via Worker/SendGrid)

**Timeline: 1 hour to go live**

---

**Managed by OpenCode · Authority: Tumelo Ramaphosa**
