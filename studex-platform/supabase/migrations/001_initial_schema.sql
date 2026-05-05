-- StudEx Cognitive Brain - Initial Schema
-- Requires pgvector extension for RAG embeddings

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgvector";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  codename TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'processing')),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  tasks_completed INTEGER DEFAULT 0,
  current_task TEXT,
  avatar_color TEXT DEFAULT '#00f0ff',
  system_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  user_id UUID,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  agent_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Embeddings table for RAG (pgvector)
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB DEFAULT '{}',
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rocket launches log
CREATE TABLE IF NOT EXISTS rocket_launches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target TEXT NOT NULL,
  machine_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'launching', 'launched', 'failed')),
  gpu_info TEXT,
  steps JSONB DEFAULT '[]',
  launched_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_embeddings_agent ON embeddings(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);

-- Create vector similarity search index (IVFFlat for performance)
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Function: search similar embeddings
CREATE OR REPLACE FUNCTION search_embeddings(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10,
  filter_agent_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  agent_id UUID,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.content,
    e.metadata,
    e.agent_id,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM embeddings e
  WHERE
    (filter_agent_id IS NULL OR e.agent_id = filter_agent_id)
    AND 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Seed initial agents
INSERT INTO agents (name, codename, role, status, tasks_completed, current_task, avatar_color, system_prompt)
VALUES
  ('Charlie', 'CHARLIE-OPS', 'Client Operations & Voice AI', 'online', 1247, 'Processing studexmeat.com orders', '#ff2d78',
   'You are Charlie, the StudEx AI consultant specializing in studexmeat.com operations, voice AI integration, and client support.'),
  ('Robusca', 'ROBUSCA-GLOBAL', 'Global Markets & Tencent/Nvidia Partnerships', 'online', 892, 'Analyzing Tencent Cloud JNB1 latency metrics', '#00f0ff',
   'You are Robusca, the StudEx AI consultant for Global Markets, Tencent Cloud partnerships, and Nvidia technology integration.'),
  ('Naledi', 'NALEDI-CREATIVE', 'Marketing & YouTube R&D & NotebookLM', 'processing', 634, 'Generating YouTube content brief for GTC 2026', '#ff00ff',
   'You are Naledi, the StudEx AI consultant for Marketing, YouTube R&D, and NotebookLM content summarization.')
ON CONFLICT (name) DO NOTHING;

-- Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow authenticated users to read their own data)
CREATE POLICY "Users can read own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read messages in own conversations" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations" ON messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

-- Public read access for embeddings (RAG search)
CREATE POLICY "Anyone can search embeddings" ON embeddings
  FOR SELECT USING (true);
