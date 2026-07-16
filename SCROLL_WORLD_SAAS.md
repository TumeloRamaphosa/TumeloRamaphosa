# Scroll-World SaaS Platform

## Overview

Scroll-World SaaS is a premium offering that transforms the Claude Code scroll-world skill into a white-label service for companies looking to create immersive 3D brand experiences. This platform allows clients to generate customized scrollable worlds that showcase their products, services, and brand identity through AI-generated isometric dioramas.

## Key Features

### 1. **Project Management Dashboard**
- Create and manage multiple scroll-world projects per workspace
- Configure company branding (colors, logos, industry)
- Track project status (draft, generating, completed, published, failed)
- Access published worlds and view analytics

### 2. **World Configuration**
- **Scene Builder**: Add multiple scenes with custom descriptions and briefings
- **Aspect Ratio Control**: Support both landscape (16:9) and portrait (9:16) scenes
- **Brand Customization**: Apply company colors, logos, and styling
- **AI Prompting**: Detailed briefing system for fine-tuning AI-generated scenes

### 3. **Generation Engine**
- Integrates with the Claude Code scroll-world skill
- Generates isometric diorama scenes using Higgsfield
- Creates smooth video transitions between scenes
- Automatically optimizes for mobile and desktop
- Estimates credits before generation

### 4. **Publishing & Hosting**
- Generate public URLs for sharing
- Embed tokens for secure access control
- View tracking and analytics
- Custom domain support (Professional/Enterprise)

### 5. **Billing & Credits**
- **Starter Plan**: 1,000 credits/month, 5 projects, basic analytics
- **Professional Plan**: 5,000 credits/month, 25 projects, priority generation, custom domain
- **Enterprise Plan**: Unlimited credits, unlimited projects, dedicated support, API access

### 6. **Team Collaboration**
- Workspace-based organization
- Role-based access control (Owner, Admin, Editor, Viewer)
- Invite team members
- Audit logs for enterprise

### 7. **API Access**
- Create and manage projects programmatically
- Trigger generation via API
- Retrieve asset URLs and metadata
- Enterprise billing integration

## Architecture

### Database Schema

```
workspaces
├── workspace_members (role-based)
├── scroll_world_projects
│   ├── scenes
│   ├── generations
│   └── published_worlds
├── subscriptions
├── scroll_world_usage
└── scroll_world_plans
```

### API Endpoints

#### Projects
- `GET /api/scroll-world/projects?workspace_id=xxx` - List projects
- `POST /api/scroll-world/projects` - Create project
- `GET /api/scroll-world/projects/[projectId]` - Get project details
- `PATCH /api/scroll-world/projects/[projectId]` - Update project
- `DELETE /api/scroll-world/projects/[projectId]` - Delete project

#### Scenes
- `POST /api/scroll-world/projects/[projectId]/scenes` - Add scene
- `PATCH /api/scroll-world/projects/[projectId]/scenes/[sceneId]` - Update scene
- `DELETE /api/scroll-world/projects/[projectId]/scenes/[sceneId]` - Delete scene

#### Generation
- `POST /api/scroll-world/generate` - Trigger generation
- `GET /api/scroll-world/generations/[generationId]` - Get generation status
- `GET /api/scroll-world/projects/[projectId]/generations` - List generations

#### Publishing
- `POST /api/scroll-world/publish/[projectId]` - Publish world
- `GET /api/scroll-world/worlds/[publishedId]` - Get published world metadata
- `POST /api/scroll-world/worlds/[publishedId]/track` - Track view

#### Billing
- `GET /api/scroll-world/usage` - Get current usage
- `GET /api/scroll-world/plans` - List available plans
- `POST /api/scroll-world/subscribe` - Subscribe to plan
- `POST /api/scroll-world/cancel` - Cancel subscription

## Client User Journey

### 1. **Onboarding**
```
Sign up → Create Workspace → Create Project → Add Company Details
     ↓
Apply Brand Colors → Create First Workspace
```

### 2. **World Building**
```
Project Overview → Add Scenes → Configure Each Scene → Review Configuration
     ↓
Generate World (triggers scroll-world skill)
```

### 3. **Generation Process**
```
Select Scenes → Estimate Credits → Start Generation
     ↓
AI generates scenes → Videos created → Mobile optimization
     ↓
Preview → Adjust if needed → Publish
```

### 4. **Publishing & Sharing**
```
Publish World → Generate URL → Share with Stakeholders
     ↓
Track Views → Analytics → Archive
```

## Pricing Model

### Credit System
- 1 Image Generation = ~100 credits
- 1 Video Generation = ~200 credits
- Mobile Optimization = ~50 credits (included in generation)

### Sample Project Costs
- **3-Scene World**: ~1,500 credits ($7.50 equivalent)
- **5-Scene World**: ~2,500 credits ($12.50 equivalent)
- **10-Scene World**: ~5,000 credits ($25 equivalent)

## Technical Implementation

### Frontend Stack
- Next.js 16+ with App Router
- React 19 with TypeScript
- TailwindCSS 4 for styling
- Framer Motion for animations
- Supabase for auth & data

### Backend Stack
- Next.js API Routes
- Supabase PostgreSQL
- Row-Level Security (RLS) for data protection
- Stripe for billing

### Integration Points
- **Claude Code scroll-world skill**: For generation
- **Higgsfield API**: For isometric scene generation
- **Kling/Seedance**: For video generation
- **Stripe**: For billing and subscriptions
- **S3/CDN**: For asset hosting

## Security & Compliance

### Data Protection
- All projects encrypted at rest
- API keys secured in environment variables
- Rate limiting on all endpoints
- CORS protection enabled

### Authentication
- Supabase Auth with JWT tokens
- OAuth support (Google, GitHub)
- Session management
- Multi-factor authentication (Pro/Enterprise)

### Authorization
- Row-Level Security (RLS) on all tables
- Role-based access control (RBAC)
- Workspace isolation
- Audit logging

## Deployment Checklist

- [ ] Set up Supabase project
- [ ] Run database migrations
- [ ] Configure Stripe billing
- [ ] Set up API keys for generation services
- [ ] Configure email notifications
- [ ] Set up analytics tracking
- [ ] Deploy to production
- [ ] Set up monitoring and logging
- [ ] Create support documentation
- [ ] Launch marketing site

## File Structure

```
studex-platform/
├── src/
│   ├── app/
│   │   ├── scroll-world/
│   │   │   ├── page.tsx (Dashboard)
│   │   │   ├── new/page.tsx (Create project)
│   │   │   ├── [projectId]/page.tsx (Project detail)
│   │   │   └── [projectId]/publish/page.tsx (Publish world)
│   │   └── api/
│   │       └── scroll-world/
│   │           ├── projects/route.ts
│   │           ├── projects/[projectId]/route.ts
│   │           ├── generate/route.ts
│   │           ├── publish/route.ts
│   │           └── billing/route.ts
│   ├── components/
│   │   └── scroll-world/
│   │       ├── ProjectCard.tsx
│   │       ├── SceneEditor.tsx
│   │       ├── GenerationStatus.tsx
│   │       └── PublishDialog.tsx
│   └── lib/
│       ├── database.types.ts
│       └── scroll-world-client.ts
├── supabase/
│   └── migrations/
│       └── 001_scroll_world_schema.sql
└── docs/
    ├── API.md
    ├── BILLING.md
    └── DEPLOYMENT.md
```

## Next Steps

1. **Complete API Implementation**
   - Scene CRUD endpoints
   - Publishing endpoints
   - Billing endpoints

2. **Build Frontend Components**
   - Scene editor UI
   - Generation status tracker
   - Analytics dashboard
   - Billing management

3. **Integration Work**
   - Connect to scroll-world skill
   - Set up Stripe billing
   - Configure asset storage (S3/CDN)

4. **Quality Assurance**
   - E2E testing
   - Performance optimization
   - Security audit

5. **Launch Preparation**
   - Marketing materials
   - Support documentation
   - Onboarding flows
   - Success metrics

## Revenue Projections

### Conservative Scenario
- **100 Starter customers** × $29/month = $2,900/month
- **20 Professional customers** × $99/month = $1,980/month
- **5 Enterprise customers** × $499/month = $2,495/month
- **Total**: ~$7,375/month ($88,500/year)

### Growth Scenario (6 months)
- **500 Starter customers** = $14,500/month
- **100 Professional customers** = $9,900/month
- **20 Enterprise customers** = $9,980/month
- **Total**: ~$34,380/month ($412,560/year)

## Success Metrics

- **Monthly Recurring Revenue (MRR)**
- **Customer Acquisition Cost (CAC)**
- **Lifetime Value (LTV)**
- **Churn Rate**
- **Generation Success Rate**
- **Average Project Value**
- **User Engagement**
- **NPS (Net Promoter Score)**

## Support & Documentation

- API Documentation (Swagger/OpenAPI)
- User Guide & Tutorials
- Video Walkthroughs
- FAQ
- Email Support (included)
- Priority Support (Pro/Enterprise)
- Dedicated Account Manager (Enterprise)
