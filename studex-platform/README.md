# StudExClaw — Cognitive Brain + Agentic Force for Africa

> The most visually dominant and technically powerful agentic SaaS platform in Africa.

## Architecture

```
┌──────────────────────────────────────────────┐
│              STUDEXCLAW PLATFORM             │
├──────────────┬──────────────┬────────────────┤
│  OpenClaw    │  NemoClaw    │  StudExClaw    │
│  (NVIDIA)    │  (NeMo)      │  (Tencent)     │
├──────────────┴──────────────┴────────────────┤
│         Central Cognitive Brain              │
│    ┌─────────┬──────────┬──────────┐         │
│    │ Charlie │ Robusca  │ Naledi   │         │
│    └─────────┴──────────┴──────────┘         │
├──────────────────────────────────────────────┤
│  Supabase (Auth + Postgres + pgvector + RT)  │
│  Vertex AI (Claude 3.5 + Gemini 2.0)        │
│  Tencent Cloud (JNB1 Region)                 │
└──────────────────────────────────────────────┘
```

## Tech Stack

- **Framework**: Next.js 15 App Router + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **3D**: Three.js + React Three Fiber
- **Database**: Supabase (Postgres + pgvector + Auth + Realtime)
- **AI**: Google Vertex AI (Gemini 2.0 + Claude 3.5 Sonnet)
- **Deployment**: Vercel (Edge optimized, JNB1 region)

## Deployment

### 1. Supabase Setup

```bash
# Create a new Supabase project at https://supabase.com
# Run the migration:
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/001_initial_schema.sql
```

### 2. Vertex AI Setup

```bash
# Create a GCP project and enable Vertex AI API
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
# Or set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON
```

### 3. Environment Variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 4. Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

### 5. Vercel Deploy

```bash
# Connect your GitHub repo to Vercel
# Set environment variables in Vercel dashboard
# Deploy with:
vercel --prod
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Hero landing with 3D scene, Jensen Stack, pricing, AI consultants, dev hub |
| `/brain` | Central Cognitive Brain dashboard (protected) |

## Agents

| Agent | Codename | Role |
|-------|----------|------|
| Charlie | CHARLIE-OPS | Client Operations, studexmeat.com, Voice AI |
| Robusca | ROBUSCA-GLOBAL | Global Markets, Tencent/Nvidia Partnerships |
| Naledi | NALEDI-CREATIVE | Marketing, YouTube R&D, NotebookLM |

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Chat with AI agents via Vertex AI |
| `/api/agents` | GET | Get agent status |
| `/api/rocket` | POST | Trigger hardware scripts |
| `/api/github` | POST | GitHub commit + push |

## Cost Savings

- **60-75%** lower TCO vs AWS/Azure/GCP equivalent
- Tencent Cloud JNB1 region optimized for African latency
- Edge-first architecture on Vercel

---

Built by StudEx. Powered by Tencent Cloud, NVIDIA, and Google Vertex AI.
