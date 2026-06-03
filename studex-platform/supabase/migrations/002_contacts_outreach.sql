-- StudEx Contacts CRM + Outreach
-- Unified contacts table for B2B prospects, newsletter subscribers, and customers.
-- Drives the launch list (Listmonk) and the cold-outreach pipeline.

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  name TEXT NOT NULL,
  email TEXT,                          -- nullable: many B2B prospects have website only
  website TEXT,

  -- Categorisation (from the imported B2B sheets)
  business_type TEXT,                  -- Hotel, Lodge, Restaurant, Gym, Restaurant Chain...
  tier TEXT CHECK (tier IN ('A','B','C','D')),
  region TEXT,
  country TEXT,
  product_interest TEXT[] DEFAULT '{}', -- {Biltong, Oats, Coffee, Snacks, ...}

  -- Scoring + lifecycle
  priority INTEGER,
  biltong_score INTEGER,
  website_score INTEGER,
  status TEXT NOT NULL DEFAULT 'lead'
    CHECK (status IN ('lead','ready','contacted','responded','customer','rejected','unsubscribed','bounced')),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Provenance
  source TEXT[] DEFAULT '{}',          -- which CSV/scrape/form this came from
  listmonk_subscriber_id INTEGER,

  -- Engagement
  contacted_at TIMESTAMPTZ,
  last_opened_at TIMESTAMPTZ,
  last_clicked_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique by email when present (case-insensitive); name+website as fallback identity
CREATE UNIQUE INDEX IF NOT EXISTS contacts_email_unique
  ON contacts (lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS contacts_name_website_unique
  ON contacts (lower(name), lower(website)) WHERE email IS NULL AND website IS NOT NULL;

CREATE INDEX IF NOT EXISTS contacts_tier_idx ON contacts (tier);
CREATE INDEX IF NOT EXISTS contacts_country_idx ON contacts (country);
CREATE INDEX IF NOT EXISTS contacts_status_idx ON contacts (status);
CREATE INDEX IF NOT EXISTS contacts_priority_idx ON contacts (priority DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS contacts_product_idx ON contacts USING GIN (product_interest);
CREATE INDEX IF NOT EXISTS contacts_tags_idx ON contacts USING GIN (tags);
CREATE INDEX IF NOT EXISTS contacts_source_idx ON contacts USING GIN (source);

-- updated_at auto-touch
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS contacts_touch_updated ON contacts;
CREATE TRIGGER contacts_touch_updated
  BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Outreach log: every cold-outreach send recorded for audit + dedup
CREATE TABLE IF NOT EXISTS outreach_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email','linkedin','whatsapp','manual')),
  template TEXT,                       -- listmonk template id or local key
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','sent','failed','bounced','replied')),
  error TEXT,
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS outreach_contact_idx ON outreach_log (contact_id, created_at DESC);
CREATE INDEX IF NOT EXISTS outreach_status_idx ON outreach_log (status);

-- RLS: contacts/outreach are admin-only (service role bypasses RLS).
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_log ENABLE ROW LEVEL SECURITY;
-- No public policies -> only service-role writes/reads. Admin UI uses service role server-side.

-- Segmented views for fast list slicing
CREATE OR REPLACE VIEW contacts_tier_a AS SELECT * FROM contacts WHERE tier = 'A';
CREATE OR REPLACE VIEW contacts_tier_b AS SELECT * FROM contacts WHERE tier = 'B';
CREATE OR REPLACE VIEW contacts_with_email AS SELECT * FROM contacts WHERE email IS NOT NULL;
CREATE OR REPLACE VIEW contacts_ready_for_outreach AS
  SELECT * FROM contacts
  WHERE email IS NOT NULL AND status IN ('lead','ready')
  ORDER BY priority DESC NULLS LAST, biltong_score DESC NULLS LAST;
