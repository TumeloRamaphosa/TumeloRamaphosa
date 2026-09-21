-- Daily AI-Tools Digest (Phase 4 add-on)
-- A cron-refreshed inventory of "what shipped in AI today" pulled from
-- GitHub, Hacker News, and Hugging Face. Read server-side via the same
-- service-role API pattern as devices.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS ai_digest (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  digest_date DATE NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('github', 'hn', 'huggingface')),
  rank INTEGER NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  author TEXT,
  description TEXT,
  score INTEGER,
  language TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (digest_date, source, rank)
);

CREATE INDEX IF NOT EXISTS idx_digest_date        ON ai_digest(digest_date DESC);
CREATE INDEX IF NOT EXISTS idx_digest_source_date ON ai_digest(source, digest_date DESC);

ALTER TABLE ai_digest ENABLE ROW LEVEL SECURITY;
-- Same discipline as devices: no anon/public policy; reads go through the
-- server-side service-role /api/digest route.
