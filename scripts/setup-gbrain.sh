#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# setup-gbrain.sh — install gbrain and load our brain/ into a local PGLite DB.
#
# Idempotent: safe to re-run. Free to run — initialises with embedding
# deferred so NO API keys and NO cost are required to get a working, queryable
# brain. To enable synthesis (`gbrain think`) and vector search, export an
# embedding key (see docs/gbrain.md) before running, or set it later.
#
# Usage:  scripts/setup-gbrain.sh
# ---------------------------------------------------------------------------
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRAIN_DIR="$REPO_ROOT/brain"

log() { printf '\033[1;33m[gbrain]\033[0m %s\n' "$*"; }

# 1) Ensure Bun is available (gbrain's runtime).
if ! command -v bun >/dev/null 2>&1; then
  log "Installing Bun runtime…"
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
export PATH="$HOME/.bun/bin:$PATH"

# 2) Install (or update) the gbrain CLI.
if ! command -v gbrain >/dev/null 2>&1; then
  log "Installing gbrain CLI from GitHub…"
  bun install -g github:garrytan/gbrain
fi
log "gbrain $(gbrain --version)"

# 3) Initialise a local PGLite brain (no server). We prefer OpenAI embeddings
#    (chosen for this project); fall back to other providers, else defer (free).
if [ -n "${OPENAI_API_KEY:-}" ]; then
  log "OpenAI key found — embedding with text-embedding-3-large."
  gbrain init --pglite --embedding-model openai:text-embedding-3-large || true
elif [ -n "${ZEROENTROPY_API_KEY:-}${VOYAGE_API_KEY:-}" ]; then
  gbrain init --pglite || true
else
  log "No embedding key set — initialising with embedding deferred (free)."
  gbrain init --pglite --no-embedding || true
fi

# 4) Load our markdown system-of-record into the brain and wire the graph.
log "Importing brain/ …"
gbrain import "$BRAIN_DIR" --no-embed || true
# Resolve bare [[wikilinks]] by basename (our pages live in subfolders).
gbrain config set link_resolution.global_basename true || true
log "Extracting wiki-link graph edges (no LLM)…"
gbrain extract links --source db || true

# 5) If an embedding key is present, embed the stale chunks for vector search
#    and set the (lowest-cost) search mode for synthesis.
if [ -n "${ZEROENTROPY_API_KEY:-}${OPENAI_API_KEY:-}${VOYAGE_API_KEY:-}" ]; then
  log "Embedding pages…"
  gbrain embed --stale || true
  gbrain config set search.mode conservative || true
fi

# 6) Skills are committed in skills/. Re-scaffold any the bundle adds later.
if [ -d "$REPO_ROOT/skills" ]; then
  GBRAIN_SRC="$(dirname "$(readlink -f "$(command -v gbrain)")")/.."
  ( cd "$GBRAIN_SRC" 2>/dev/null && gbrain skillpack scaffold --all --workspace "$REPO_ROOT" ) || true
fi

log "Health check:"
gbrain doctor --fast || true

cat <<'EOF'

[gbrain] Ready.
  gbrain query "what are we building?"     # hybrid search (free)
  gbrain think "open threads on Aviar?"    # synthesis + gap analysis (needs key)
  gbrain sync --repo brain                 # re-sync after editing brain/
EOF
