# Bazzite setup — AI dev hub, talking agents, and this home-automation app

For a Bazzite install on any of the three devices in your fleet (Lenovo
laptop, Legion Go handheld, MSI Claw 8 AI+). One recipe, one mental model.

## The one thing to understand first

Bazzite is **immutable**. The base OS is read-only (`rpm-ostree`). That's
why gaming distros stay stable — but it means the way you install software
is different. Four lanes:

| Kind of thing | Lane | Command |
|---|---|---|
| GUI apps (Chrome, VS Code, GNOME Boxes) | **Flatpak** | Discover app store or `flatpak install …` |
| CLI tools (node, python, gh, ripgrep) | **Homebrew** (pre-installed) | `brew install …` |
| A whole dev environment with `apt`/`dnf` | **Distrobox** | `distrobox create …` then `distrobox enter …` |
| System-level (drivers, kernel modules) | `rpm-ostree install` (last resort) | requires reboot |

Bazzite also ships `ujust` — one-liners for common setup (`ujust
setup-decky`, `ujust install-obs-studio-portable`, etc.). Run `ujust` alone
to browse.

## 1. First-boot

```bash
sudo hostnamectl set-hostname legion-go       # or -claw / -laptop
ujust                                          # skim what's available
brew update
```

Handheld only (Legion Go / MSI Claw): install the **`bazzite-deck`** image
variant, not the desktop one. `rpm-ostree rebase` to the right branch — the
Bazzite install guide has the exact ref for your device.

NVIDIA laptops/desktops only: install the **`bazzite-nvidia`** variant, not
the base one. Driver handling is different.

## 2. Core dev stack (Homebrew)

```bash
brew install node python@3.12 gh ripgrep fzf jq uv git-delta
npm install -g @anthropic-ai/claude-code
claude login                                   # opens a browser
```

Optional but nice:
```bash
brew install starship zoxide bat eza          # shell QoL
```

## 3. Talking-agent stack (local, offline models)

```bash
# Ollama — runs Llama 3.2 / Qwen 2.5 / DeepSeek locally
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:3b                        # small, fast
ollama pull qwen2.5:7b                         # bigger, smarter

# Open WebUI — ChatGPT-style front end for Ollama AND for API keys
podman run -d --name open-webui -p 3080:8080 \
  -v open-webui:/app/backend/data \
  --add-host=host.containers.internal:host-gateway \
  --restart always \
  ghcr.io/open-webui/open-webui:main
# open http://localhost:3080

# Whisper.cpp — offline speech-to-text
brew install whisper-cpp

# Piper — offline text-to-speech (voices)
brew install piper-tts
```

Add your API keys inside Open WebUI (Settings → Connections) — it can speak
to **Ollama (local) and Anthropic/OpenAI/Groq (online) at once**, so one
interface, both worlds.

## 4. Distrobox — a real Ubuntu shell when you need `apt`

Bazzite's immutable base won't let you `apt install`. Distrobox spins up an
Ubuntu container that shares your home directory:

```bash
distrobox create --name dev --image ubuntu:24.04
distrobox enter dev
# now you're in Ubuntu — apt works, gcc works, everything.
```

Use this for the home-auto project's `deploy/setup.sh` (it expects apt) and
any Python/Node work that fights with rpm-ostree.

## 5. Podman — for containers

Bazzite ships Podman (Docker-compatible). Runs the home-auto Dockerfile:

```bash
cd studex-platform
podman build -t studex-dashboard .
podman run --rm -p 3000:3000 --env-file .env.local studex-dashboard
```

## 6. Running this project on the Legion Go / laptop

```bash
git clone https://github.com/TumeloRamaphosa/TumeloRamaphosa
cd TumeloRamaphosa
git checkout claude/home-automation-hub-9eCxW

# option A: distrobox (recommended — deploy/setup.sh assumes apt)
distrobox enter dev
bash deploy/setup.sh
cd studex-platform && npm run start                # :3000

# in another shell — connector in demo mode
cd hub-connector && . .venv/bin/activate && python3 connector.py --seed-only
```

Open Firefox on the host: `http://localhost:3000/devices`.

## 7. Handhelds: gaming ↔ desktop

Legion Go and MSI Claw on Bazzite Deck boot into **Game Mode** (Steam UI)
by default. To get to the desktop for dev work:

- **Steam button → Power → Switch to Desktop.**
- Back to gaming: launch **Return to Game Mode** from the desktop.

Steam and Proton work out of the box. Non-Steam games via **Heroic Launcher**
(`flatpak install flathub com.heroicgameslauncher.hgl`).

## 8. Fleet aliases

Same on every machine (drop in `~/.bashrc` or `~/.zshrc`):

```bash
alias dev='distrobox enter dev'
alias hub='cd ~/TumeloRamaphosa && distrobox enter dev'
alias llm='ollama run qwen2.5:7b'
alias webui='open http://localhost:3080'
alias claude-hub='cd ~/TumeloRamaphosa && claude'
```

## 9. Cross-device shortlist

| Device | Bazzite image | Extra |
|---|---|---|
| Lenovo laptop | `bazzite` (or `bazzite-nvidia` if applicable) | already set |
| Legion Go | `bazzite-deck-legion-go` | RGB tweaks via `ujust` |
| MSI Claw 8 AI+ | `bazzite-deck-msi-claw` | Intel NPU is Windows-only for now |
| Big Linux desktop (later) | Pop!_OS if NVIDIA · Bazzite Desktop if AMD · Omakub if pure dev | |

## 10. What NOT to install

- ❌ `sudo dnf install` random packages — you'll fight rpm-ostree forever.
- ❌ VS Code direct RPM — use `flatpak install flathub com.visualstudio.code`.
- ❌ Docker Desktop — Podman is already there and native.
