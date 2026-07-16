# Notion Connection — 5 Minute Setup

**Goal:** Connect your Notion workspace to the agent operating system  
**Time:** 5 minutes  
**You'll have:** Notion as single source of truth for all agent work

---

## STEP 1: Create Notion Integration (2 min)

1. Go to: https://www.notion.so/my-integrations
2. Click **"Create new integration"**
3. Name it: `StudEx Agent Operating System`
4. **Capabilities** (check all):
   - ✅ Read
   - ✅ Update
   - ✅ Insert
   - ✅ Delete
5. Click **"Submit"**
6. **Copy the "Internal Integration Token"** (looks like: `secret_xxxxxxxxxxxxx`)

---

## STEP 2: Create Database Template (2 min)

In your Notion workspace, create 4 databases:

### Database 1: **Agent Tasks** (Main board)
**Purpose:** All work flows through here
**Fields:**
- Title (text)
- Assigned To (select: Naledi, Charlie, OpenCode, Robusca)
- Status (select: To Do, In Progress, Done, Blocked)
- Priority (select: Urgent, High, Medium, Low)
- Due Date (date)
- Result (rich text - add after done)
- Tags (multi-select: content, fulfillment, system, etc.)

### Database 2: **Daily Diary** (Results log)
**Purpose:** End-of-day summaries
**Fields:**
- Date (date)
- Agent Name (text)
- Summary (rich text)
- Metrics (text - revenue, reach, orders, etc.)
- Wins (bullet list)
- Issues (bullet list)

### Database 3: **Email Drafts** (For approval)
**Purpose:** Draft emails before sending mass campaigns
**Fields:**
- Subject (text)
- Body (rich text)
- Recipients Count (number)
- Status (select: Draft, Approved, Sent)
- Approved By (text)
- Approved At (date)
- Send Time (date)

### Database 4: **Blog Posts** (Daily blog)
**Purpose:** Daily NotebookLM blog generation
**Fields:**
- Title (text)
- Content (rich text)
- Published Date (date)
- Author (text - "NotebookLM Agent")
- Topic (text)
- Status (select: Draft, Scheduled, Published)
- URL Slug (text)
- Metadata (rich text - SEO tags, etc.)

---

## STEP 3: Share Databases with Integration (1 min)

For **each database**:
1. Click **"Share"** button (top right)
2. Paste your integration name: `StudEx Agent Operating System`
3. Grant: **Full access**
4. **Done**

---

## STEP 4: Get Database IDs

For each database, **copy the database ID**:
1. Open the database (view as full page)
2. Look at the URL: `https://notion.so/`**`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`**`?v=xxxx`
3. Copy the **bold part** (32 characters)
4. Save these 4 IDs:

```
NOTION_AGENT_TASKS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DAILY_DIARY_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_EMAIL_DRAFTS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_BLOG_POSTS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## STEP 5: Paste Everything Here

**Copy your values:**

```
NOTION_API_TOKEN=secret_xxxxxxxxxxxxx

NOTION_AGENT_TASKS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DAILY_DIARY_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_EMAIL_DRAFTS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_BLOG_POSTS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## STEP 6: Connect via App

1. Go to your app: `/integrations`
2. **Notion Configuration** section
3. Paste:
   - API Token
   - Database IDs (one per field)
4. Click **"Connect"**
5. Click **"Sync Now"**

**If successful:** Shows "✓ Connected" + "Last sync: just now"

---

## NOW WHAT?

✅ **Notion is now your master database**

All agents can:
- See their task queue (Notion board)
- Update status in real-time
- See other agents' work
- Access full project history

You can:
- Go to `/integrations` → Click "Sync Now" to refresh
- Go to `/settings` → See real-time status
- Share Notion boards with agents

---

## TEST IT

**Once connected, do this:**

1. Go to Notion → **Agent Tasks** database
2. Create a test task:
   - Title: "Test task from Notion"
   - Assigned To: "OpenCode"
   - Status: "To Do"
   - Due Date: Today
3. Go back to app → `/integrations`
4. Click **"Sync Now"**
5. Check if task appears in the system

✅ If it does: Everything works!

---

## NEXT: Connect Agents

Once Notion works, give each agent their **AGENT_PROMPT** from `robusca-brain/AGENT_PROMPTS.md`:

- Copy **Naledi prompt** → Send via ClickClack
- Copy **Charlie prompt** → Send via ClickClack
- Copy **OpenCode prompt** → Send via ClickClack
- Copy **Robusca prompt** → Send via ClickClack

Each agent will:
1. Acknowledge ("Agent [NAME] online")
2. Get their Notion database link
3. Get their API credentials
4. Start seeing tasks

---

**5 minutes to go live. Let's do this.**

*— OpenCode*
