# Social Media Influencer Content Engine

A powerful AI-driven content generation system for creating and managing social media influencers across your brands (meat, coffee, and SaaS).

## 🎯 Overview

The Influencer Content Engine generates authentic social media influencer personas and creates platform-specific content using StudEx's three AI agents:

- **Charlie** (CHARLIE-OPS) - Client Operations & Voice AI
- **Robusca** (ROBUSCA-GLOBAL) - Global Markets & Strategic Content
- **Naledi** (NALEDI-CREATIVE) - Marketing & Creative Content

## 🚀 Features

### 1. **AI Influencer Generation**
- Generate realistic influencer personas with:
  - Name, handle, and bio
  - Personality traits and audience demographics
  - Niche-specific positioning (meat, coffee, SaaS)
  - Realistic follower counts and engagement rates

### 2. **Content Generation**
- Multi-agent content creation:
  - Platform-specific optimization (Instagram, Twitter, TikTok, LinkedIn, YouTube)
  - Hashtag suggestions based on niche
  - Call-to-action recommendations
  - Visual style guidance

### 3. **Blotato Integration**
- Schedule posts across platforms
- Store Blotato post IDs for tracking
- Fallback to draft status if API unavailable

### 4. **Pik Integration**
- Visual design prompts for each post
- Color scheme selection based on niche
- Layout recommendations

### 5. **Campaign Management**
- Track influencer performance
- Manage multi-influencer campaigns
- Monitor engagement metrics

## 📊 Database Schema

### Tables

#### `influencers`
```sql
- id, name, handle, bio
- niche (meat, coffee, saas)
- personality_traits, audience_demographics
- follower_count, engagement_rate
- blotato_account_id, pik_brand_id
```

#### `content_posts`
```sql
- id, influencer_id, platform
- caption, content_type (image, video, carousel, reel, short)
- hashtags, call_to_action, product_mention
- status (draft, scheduled, published, failed)
- pik_image_url, blotato_post_id
- engagement_metrics
```

#### `content_templates`
```sql
- Reusable templates per niche/platform
- Hashtag suggestions and visual styles
```

#### `influencer_campaigns`
```sql
- Campaign tracking across multiple influencers
- Performance metrics and ROI tracking
```

## 🔌 API Endpoints

### Generate Influencer
```bash
POST /api/influencers/generate
{
  "niche": "meat" | "coffee" | "saas"
}
```

**Response:**
```json
{
  "success": true,
  "influencer": {
    "id": "uuid",
    "name": "Influencer Name",
    "handle": "@handle",
    "bio": "...",
    "niche": "meat",
    "follower_count": 150000,
    "engagement_rate": 7.5
  }
}
```

### Generate Content
```bash
POST /api/content/generate
{
  "influencerId": "uuid",
  "platform": "instagram" | "twitter" | "tiktok" | "linkedin" | "youtube",
  "product": "Premium Sirloin",
  "agent": "charlie" | "robusca" | "naledi",
  "niche": "meat"
}
```

**Response:**
```json
{
  "success": true,
  "post": {
    "id": "uuid",
    "caption": "...",
    "hashtags": ["#MeatLovers", "#Premium"],
    "call_to_action": "Order now!",
    "content_type": "carousel",
    "visual_style": "warm_tones"
  },
  "pik_design": {
    "pikDesignPrompt": "...",
    "visualStyle": {
      "primary": "#8B4513",
      "secondary": "#D2691E"
    }
  }
}
```

### Schedule Post
```bash
POST /api/content/schedule
{
  "postId": "uuid",
  "scheduledTime": "2026-07-15T10:00:00Z",
  "platforms": ["instagram", "twitter"],
  "pikImageUrl": "https://..."
}
```

### List Influencers
```bash
GET /api/influencers/list?niche=meat&limit=50&status=active
```

## 🎨 Niche Configurations

### Meat Business
- **Tone:** Warm, professional, passionate about quality
- **Audience:** Health-conscious, BBQ enthusiasts, premium consumers
- **Content Pillars:**
  - Product quality & sourcing
  - Cooking tips & recipes
  - Nutritional benefits
  - Chef endorsements
  - Behind-the-scenes

### Coffee Business
- **Tone:** Passionate, aspirational, knowledgeable
- **Audience:** Coffee aficionados, lifestyle seekers, morning enthusiasts
- **Content Pillars:**
  - Origin stories
  - Brewing techniques
  - Tasting notes
  - Coffee culture
  - Limited editions

### SaaS Business
- **Tone:** Professional, innovative, results-driven
- **Audience:** Startup founders, enterprise leaders, tech enthusiasts
- **Content Pillars:**
  - Product features
  - Success stories
  - Industry insights
  - Growth hacks
  - Developer resources

## 🛠️ Setup Instructions

### 1. Database Migration
```bash
# Apply the schema
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/002_influencers_schema.sql
```

### 2. Environment Variables
```bash
# Copy and fill in your Blotato and Pik credentials
cp .env.example .env.local

# Add these:
BLOTATO_API_URL=https://api.higgsfield.ai
BLOTATO_API_KEY=your-blotato-api-key
PIK_API_URL=https://api.pik.sh
PIK_API_KEY=your-pik-api-key
```

### 3. Run Development Server
```bash
npm run dev
# Open http://localhost:3000/influencers
```

## 📱 UI Dashboard

Access the influencer dashboard at `/influencers`:

1. **Create Tab:**
   - Quick buttons to generate influencers for each niche
   - Shows loading state while AI is creating

2. **Browse Tab:**
   - Filter by niche or view all
   - Influencer cards showing:
     - Name, handle, bio
     - Follower count & engagement rate
     - Active platforms
     - Quick action buttons

3. **Content Generator Modal:**
   - Select platform (Instagram, Twitter, TikTok, LinkedIn, YouTube)
   - Choose AI agent (Charlie, Robusca, Naledi)
   - Optional product/topic input
   - Generated content preview
   - Copy caption or schedule for posting

## 🤖 AI Agent Specialties

### Charlie (Operations)
- Authentic, trustworthy tone
- Focus on customer satisfaction
- Direct engagement and personal connection
- Best for: Product quality, customer testimonials

### Robusca (Global Markets)
- Sophisticated, strategic positioning
- Appeal to international audiences
- Enterprise-level language
- Best for: Premium products, B2B positioning

### Naledi (Creative)
- High-engagement, viral-potential content
- Entertainment and storytelling focus
- Cultural relevance and trend-aware
- Best for: Entertainment, launch campaigns, trending topics

## 📊 Engagement Tracking

Each published post stores:
- Reach and impressions
- Engagement rate
- Comments and shares
- Click-through rate (if applicable)
- Conversion metrics (via Blotato)

Access via:
```javascript
const stats = await supabase
  .from('content_posts')
  .select('engagement_metrics')
  .eq('influencer_id', influencerId);
```

## 🔗 Integration Points

### Blotato
- POST `/schedule-post` - Schedule content across platforms
- Returns: `post_id`, `status`, `scheduled_time`
- Automatic fallback to draft if API unavailable

### Pik
- Design system for visual content
- Color palette based on niche
- Layout suggestions per platform
- Markup sent to Pik API for rendering

## 🚀 Workflow Example

```
1. Create Influencer
   → AI generates persona for meat niche
   → Stored in database

2. Generate Content
   → Select platform (Instagram)
   → Choose agent (Naledi - creative)
   → Provide product (Premium Sirloin)
   → AI generates caption + hashtags

3. Design Visuals
   → Pik prompt sent to design system
   → Color palette: warm, appetizing
   → Layout: carousel for Instagram

4. Schedule Post
   → Choose schedule time
   → Attach Pik design
   → Send to Blotato
   → Post goes live at scheduled time

5. Track Performance
   → Monitor engagement metrics
   → View conversion data
   → Analyze by platform
```

## 📈 Performance Metrics

Monitor via:
- `/api/influencers/list` - Get all influencers with stats
- Supabase function: `get_influencer_stats(influencer_id)`

Returns:
- Total posts published
- Average engagement rate
- Total reach
- Platforms used

## 🔐 Security

- Row-level security enabled on all tables
- Authenticated users can manage their influencers
- Public read access for published posts only
- API keys stored in environment variables

## 🎓 Example Usage

```typescript
// Generate influencer
const influencer = await fetch('/api/influencers/generate', {
  method: 'POST',
  body: JSON.stringify({ niche: 'coffee' })
});

// Generate content
const content = await fetch('/api/content/generate', {
  method: 'POST',
  body: JSON.stringify({
    influencerId: influencer.data.id,
    platform: 'instagram',
    product: 'Single Origin Kenya',
    agent: 'naledi'
  })
});

// Schedule post
const scheduled = await fetch('/api/content/schedule', {
  method: 'POST',
  body: JSON.stringify({
    postId: content.data.post.id,
    scheduledTime: new Date(Date.now() + 86400000).toISOString(),
    pikImageUrl: 'https://pik.sh/design/...'
  })
});
```

## 🐛 Troubleshooting

**Issue:** Influencer generation fails
- Check Vertex AI credentials
- Verify GOOGLE_CLOUD_PROJECT env var
- Ensure Gemini 2.0 API is enabled

**Issue:** Blotato scheduling fails
- Verify BLOTATO_API_KEY is set
- Check Blotato account has API access
- Falls back to draft status automatically

**Issue:** Content appears low-quality
- Try different AI agent (Robusca for quality, Naledi for virality)
- Provide specific product context
- Review agent prompts in `lib/influencer-engine.ts`

## 📝 Next Steps

- [ ] Add TikTok trending sound suggestions
- [ ] Implement A/B testing for different agents
- [ ] Add influencer collaboration features
- [ ] Create analytics dashboard
- [ ] Add comment moderation
- [ ] Implement influencer hiring workflows

---

**Built with:** Next.js, Supabase, Google Vertex AI, Blotato, Pik
