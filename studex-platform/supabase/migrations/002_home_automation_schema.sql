-- Home Automation Hub - Device schema (Phase 1)
-- A "hub" is the always-on machine at home (e.g. the Mac mini) running the
-- Hub Connector. It discovers devices on the local network / USB / BLE and
-- pushes them here. The dashboard reads them back (server-side, service role).

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hubs: one row per always-on home machine running the connector
CREATE TABLE IF NOT EXISTS hubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID,
  name TEXT NOT NULL,
  platform TEXT,                       -- 'darwin' | 'linux' | 'win32'
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Devices: unified inventory across all discovery sources
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hub_id UUID NOT NULL REFERENCES hubs(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('wifi', 'usb', 'ble', 'ha')),
  external_id TEXT NOT NULL,           -- stable per source: MAC (wifi), vendor:product:serial (usb)
  name TEXT,
  type TEXT,
  manufacturer TEXT,
  model TEXT,
  ip_address TEXT,
  mac_address TEXT,
  capabilities JSONB DEFAULT '{}',
  online BOOLEAN NOT NULL DEFAULT TRUE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (hub_id, source, external_id)
);

-- Latest known state per device (controllable attributes)
CREATE TABLE IF NOT EXISTS device_state (
  device_id UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
  state JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Command queue the connector consumes to drive devices (Phase 2+)
CREATE TABLE IF NOT EXISTS commands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  hub_id UUID NOT NULL REFERENCES hubs(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  params JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'done', 'failed')),
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Append-only event log (device online/offline, discoveries, command outcomes)
CREATE TABLE IF NOT EXISTS device_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
  device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
  kind TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devices_hub ON devices(hub_id);
CREATE INDEX IF NOT EXISTS idx_devices_source ON devices(source);
CREATE INDEX IF NOT EXISTS idx_devices_online ON devices(online);
CREATE INDEX IF NOT EXISTS idx_commands_status ON commands(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_commands_hub ON commands(hub_id);
CREATE INDEX IF NOT EXISTS idx_events_hub ON device_events(hub_id);
CREATE INDEX IF NOT EXISTS idx_events_created ON device_events(created_at DESC);

-- Keep updated_at fresh on devices
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_devices_touch ON devices;
CREATE TRIGGER trg_devices_touch
  BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Row Level Security.
-- The connector writes with the service role key (bypasses RLS).
-- The dashboard reads server-side via the service role API route, so no
-- anon/public policies are exposed here. Owner-scoped policies are included
-- for when Supabase Auth is wired up (Phase 2) to enable client realtime.
ALTER TABLE hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners read own hubs" ON hubs;
CREATE POLICY "Owners read own hubs" ON hubs
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners read own devices" ON devices;
CREATE POLICY "Owners read own devices" ON devices
  FOR SELECT USING (
    hub_id IN (SELECT id FROM hubs WHERE owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Owners read own device_state" ON device_state;
CREATE POLICY "Owners read own device_state" ON device_state
  FOR SELECT USING (
    device_id IN (
      SELECT d.id FROM devices d
      JOIN hubs h ON h.id = d.hub_id
      WHERE h.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners manage own commands" ON commands;
CREATE POLICY "Owners manage own commands" ON commands
  FOR ALL USING (
    hub_id IN (SELECT id FROM hubs WHERE owner_id = auth.uid())
  ) WITH CHECK (
    hub_id IN (SELECT id FROM hubs WHERE owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Owners read own events" ON device_events;
CREATE POLICY "Owners read own events" ON device_events
  FOR SELECT USING (
    hub_id IN (SELECT id FROM hubs WHERE owner_id = auth.uid())
  );
