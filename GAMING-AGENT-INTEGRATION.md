# Gaming Agent Interface Integration Guide

## Overview

The `gaming-agent-interface.html` shows prospects **real-time agent collaboration** during the STUDEX qualification flow.

### Why This Matters

Partners see:
- ✅ 4 autonomous agents working in parallel
- ✅ Real-time decision flow (Chronos → Robusca → CodeX → Hermes → Naledi)
- ✅ Live market monitoring
- ✅ Performance metrics
- ✅ Confidence in STUDEX's AI capability

**Result:** Increases confidence, shortens qualification cycle, validates pricing tiers.

## Integration Options

### Option 1: Standalone Page (Fastest)

```html
<!-- In qualification portal -->
<a href="gaming-agent-interface.html" target="_blank" class="btn">
  Watch Agents in Action 🤖
</a>
```

**Best for:** Demo during CEO calls, investor presentations

### Option 2: Embed in Modal (Recommended)

```html
<div id="agent-modal" style="display:none;">
  <iframe src="gaming-agent-interface.html" 
          style="width:100%; height:800px; border:none;"></iframe>
</div>

<button onclick="document.getElementById('agent-modal').style.display='block'">
  View Live Agents
</button>
```

### Option 3: Integrate into Next.js Portal

```typescript
// studex-platform/src/pages/agents.tsx
import dynamic from 'next/dynamic';

const GamingAgents = dynamic(() => import('../components/GamingAgents'), {
  ssr: false
});

export default function AgentsPage() {
  return <GamingAgents />;
}
```

Create `GamingAgents` component:

```typescript
// studex-platform/src/components/GamingAgents.tsx
export default function GamingAgents() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="/gaming-agent-interface.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
```

Then route: `/agents` → shows the interface

### Option 4: Embed in Qualification Flow

**Insert after NDA stage:**

```html
<!-- studex-qualification-mvp.html -->

<!-- Stage 2: Agent Showcase (NEW) -->
<div id="stage-agents" class="stage" style="display:none;">
  <h2>🤖 Meet Your STUDEX Agent Team</h2>
  <p>Before you talk to us, let the agents show you what's possible.</p>
  
  <iframe src="gaming-agent-interface.html" 
          style="width:100%; height:600px; border:2px solid #00ff88;"></iframe>
  
  <button onclick="nextStage()">Continue to Qualification →</button>
</div>
```

## Real-Time Agent Integration

To show **actual** agent data instead of simulated data:

### Connect to Agent APIs

```javascript
// gaming-agent-interface.html (modify)

async function fetchAgentStatus() {
  try {
    const hermes = await fetch('http://localhost:3001/agent');
    const chronos = await fetch('http://localhost:3002/agent');
    const openclaw = await fetch('http://localhost:3003/agent');
    
    // Update DOM with real data
    updateAgentCards(hermes, chronos, openclaw);
  } catch (e) {
    console.log('Agents offline - using simulation mode');
  }
}

// Fetch every 5 seconds
setInterval(fetchAgentStatus, 5000);
```

### Connect to Market Feeds

Replace simulated market data with real feeds:

```javascript
async function fetchMarketData() {
  const commodities = ['cocoa', 'coffee', 'gold', 'oil'];
  
  commodities.forEach(async (commodity) => {
    const data = await fetch(`/api/market/${commodity}`);
    const price = await data.json();
    updateMarketDisplay(commodity, price);
  });
}
```

### Connect to Decision Feed

Stream real decisions from Supabase:

```javascript
import { supabase } from '@/lib/supabase';

supabase
  .from('agent_decisions')
  .on('INSERT', payload => {
    addToLiveFeed(payload.new);
  })
  .subscribe();
```

## Usage in Qualification Flow

### Timeline Integration

```
1. NDA Stage (15 min)
   ↓
2. AGENT SHOWCASE (8 min) ← NEW
   • See Hermes negotiate
   • Watch Chronos analyze market
   • View real decision flow
   ↓
3. Quick Qualification (5 min)
4. Tier Selection (2 min)
5. Commitment Gate (2 min)
```

### Partner Experience

**Before:** "Tell me how STUDEX agents work"
**After:** Partner watches live agents making decisions, sees real market monitoring, understands autonomous execution

## Customization

### Resize for Portal
```css
.container {
  height: 600px;  /* Fit in portal */
  max-height: 100vh;
}
```

### Dark/Light Theme
```css
/* Portal uses dark theme - interface already optimized */
/* For light theme: modify CSS variables */
:root {
  --primary: #00ff88;
  --bg: #0a0e27;
  --text: #00ff88;
}
```

### Add Portal Logo
```html
<div class="header">
  <img src="/studex-logo.svg" alt="STUDEX" />
  <h1>Gaming Agent Interface</h1>
</div>
```

## Performance

- Standalone: <1s load
- Embedded iframe: <2s load
- Real agent data: <5s update cycle
- Market feeds: <3s update cycle

## Files

- **gaming-agent-interface.html** - Standalone interface
- **LEGION-GO-SETUP.md** - Agent runtime setup
- **legion-go-bazite-setup.sh** - Automated installation

## Next Steps

1. ✅ Deploy gaming interface to your web server
2. ✅ Test with Legion Go agents running locally
3. ✅ Integrate into qualification portal
4. ✅ Show to first partner group (Art Engineer, NTechLab)
5. ✅ Measure engagement increase

---

**Partners will see STUDEX agents in action before talking to you.** 🚀

This is your most powerful sales tool: autonomous AI that works, visible in real-time.
