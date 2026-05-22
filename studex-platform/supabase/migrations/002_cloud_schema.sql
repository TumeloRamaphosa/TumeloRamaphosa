-- StudExClaw Cloud — multi-tenant VM + agent hosting schema
-- Adds the tables the Agentic Cloud product reads/writes. Rendered from mock
-- data today (src/lib/cloud.ts); flip the API routes to these tables in Phase 2.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers / tenants
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'builder', 'scale', 'enterprise')),
  auth_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Virtual machines / sandboxes
CREATE TABLE IF NOT EXISTS vms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'provisioning' CHECK (status IN ('running', 'provisioning', 'stopped', 'error')),
  region TEXT NOT NULL DEFAULT 'jnb1' CHECK (region IN ('jnb1', 'cpt1', 'eu-central')),
  ip TEXT,
  os TEXT NOT NULL DEFAULT 'Ubuntu 24.04 LTS',
  cpu INTEGER NOT NULL DEFAULT 2,
  ram_gb INTEGER NOT NULL DEFAULT 8,
  disk_gb INTEGER NOT NULL DEFAULT 40,
  agent_runtime TEXT NOT NULL DEFAULT 'openclaw' CHECK (agent_runtime IN ('openclaw', 'hermes', 'claude-code', 'none')),
  -- Provider backing this VM (mock | coolify | orgo | proxmox | hetzner ...)
  provider TEXT NOT NULL DEFAULT 'mock',
  provider_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent runs / activities (the command-center Kanban board)
CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vm_id UUID REFERENCES vms(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  runtime TEXT NOT NULL CHECK (runtime IN ('openclaw', 'hermes', 'claude-code', 'none')),
  task TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'review', 'done', 'failed')),
  runtime_seconds INTEGER DEFAULT 0,
  cost_zar NUMERIC(10,2) DEFAULT 0,
  tokens INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

-- Usage metering (for billing in Phase 4)
CREATE TABLE IF NOT EXISTS usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vm_id UUID REFERENCES vms(id) ON DELETE SET NULL,
  metric TEXT NOT NULL,            -- vcpu_hours | ram_gb_hours | gb_egress | agent_tokens
  quantity NUMERIC(14,4) NOT NULL DEFAULT 0,
  unit_cost_zar NUMERIC(10,6) NOT NULL DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Signup / waitlist leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  source TEXT DEFAULT 'cloud-landing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vms_customer ON vms(customer_id);
CREATE INDEX IF NOT EXISTS idx_vms_status ON vms(status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_vm ON agent_runs(vm_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_usage_customer ON usage(customer_id);

-- Row Level Security: tenants only see their own resources
ALTER TABLE vms ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants read own vms" ON vms
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Tenants read own runs" ON agent_runs
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Tenants read own usage" ON usage
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );
