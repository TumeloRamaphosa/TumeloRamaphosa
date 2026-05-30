#!/usr/bin/env bash
# One-shot setup for a fresh Ubuntu container (Manus, EC2, etc.).
# Installs Node 22, Python 3, project deps, builds the dashboard, and prints
# the next-step commands. Idempotent.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "▸ Working from: $REPO_ROOT"

# ── 1. System packages ──────────────────────────────────────────────
if [ "$(id -u)" -eq 0 ]; then SUDO=""; else SUDO="sudo"; fi

if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -c2-3)" -lt 22 ]; then
  echo "▸ Installing Node 22 (NodeSource)"
  curl -fsSL https://deb.nodesource.com/setup_22.x | $SUDO -E bash -
  $SUDO apt-get install -y nodejs
else
  echo "▸ Node $(node -v) already present"
fi

if ! command -v python3 >/dev/null 2>&1; then
  $SUDO apt-get install -y python3 python3-pip python3-venv
fi

# ── 2. Dashboard build ──────────────────────────────────────────────
echo "▸ Installing dashboard dependencies"
cd "$REPO_ROOT/studex-platform"
npm ci --no-audit --no-fund

if [ ! -f .env.local ] && [ ! -f .env ]; then
  cp .env.example .env.local
  echo "▸ Created studex-platform/.env.local — fill in Supabase keys before running."
fi

echo "▸ Building Next.js (production)"
NEXT_TELEMETRY_DISABLED=1 npm run build

# ── 3. Connector setup ──────────────────────────────────────────────
echo "▸ Installing connector dependencies"
cd "$REPO_ROOT/hub-connector"
if [ ! -d .venv ]; then python3 -m venv .venv; fi
. .venv/bin/activate
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

if [ ! -f .env ]; then
  cp .env.example .env
  echo "▸ Created hub-connector/.env — fill in Supabase keys + HUB_ID before running."
fi

# ── 4. Next steps ───────────────────────────────────────────────────
cat <<EOF

──────────────────────────────────────────────────────────
  Setup complete. Two things still need real values:
    • studex-platform/.env.local   (Supabase URL + keys)
    • hub-connector/.env           (Supabase + HUB_ID)

  Generate a HUB_ID once:
    python3 -c "import uuid; print(uuid.uuid4())"

  Run the dashboard:
    cd studex-platform && npm run start    # http://0.0.0.0:3000

  Run the connector in DEMO mode (no home LAN needed):
    cd hub-connector && . .venv/bin/activate && \\
    python3 connector.py --seed-only

  Run the connector for real (Mac mini at home):
    cd hub-connector && . .venv/bin/activate && \\
    python3 connector.py

──────────────────────────────────────────────────────────
EOF
