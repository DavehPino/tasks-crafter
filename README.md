# Tasks Crafter

A comprehensive live commerce session preparation platform with integrated task management, product discovery, and real-time session simulation. Built with modern full-stack architecture combining serverless functions with containerized microservices.

**Status:** ✅ Production-Ready POC | **Architecture:** Vercel Serverless + Railway Docker | **Type Safety:** End-to-End TypeScript + Zod | **UI Framework:** React 18 + Vite

---

## 🎯 Overview

Tasks Crafter streamlines the preparation workflow for live commerce sessions by providing:

- **Session Preparation**: Mandatory task checklists before going live
- **Product Management**: Browse and filter products from external API
- **Live Shopping Simulator**: Real-time video streaming interface with product showcase
- **Task Management**: Create, update, complete, and bulk delete tasks with persistence per session
- **Session State Tracking**: Automatic session identification with Redis persistence

The platform is designed for internal operators who need to quickly prepare and validate live commerce events before broadcasting.

---

## 🏗️ Architecture Overview

### Deployment Strategy

```
┌────────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend + Tasks API)                │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │   Frontend (React)   │    │  Tasks API Functions │          │
│  │   - Session Prep     │◄──►│  - /api/tasks        │          │
│  │   - Live Simulator   │    │  - /api/tasks/[id]   │          │
│  │   - Products Page    │    │  - /api/tasks/bulk   │          │
│  │   - Task Manager     │    │  - /api/tasks/mandatory          │
│  └──────────────────────┘    └──────────────────────┘          │
│         (5173)                      (Serverless)                │
└────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────┐
│              RAILWAY (Products API - Containerized)             │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────┐            │
│  │   Products API (Express + TypeScript)          │            │
│  │   - Docker containerized                       │            │
│  │   - GET /products                              │            │
│  │   - GET /products/:id                          │            │
│  │   - GET /products/categories                   │            │
│  │   - Health checks with auto-restart            │            │
│  │                                                 │            │
│  │   Port: 3002 | Memory: In-memory store        │            │
│  └────────────────────────────────────────────────┘            │
│         (Railway Container)                                     │
└────────────────────────────────────────────────────────────────┘
                        ▲
                        │ (uses Upstash Redis)
                        ▼
              ┌──────────────────┐
              │  Upstash Redis   │
              │  Session Store   │
              └──────────────────┘
```

### Why This Architecture?

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Frontend Hosting** | Vercel | CDN distribution, zero-config Git integration, serverless functions in same deployment |
| **Tasks API** | Vercel Functions | Co-located with frontend, no CORS issues, auto-scaling, free tier |
| **Products API** | Railway + Docker | Separation of concerns, independent scaling, simpler containerization workflow |
| **Session Storage** | Upstash Redis | Distributed session state, survives API restarts, supports multi-instance |
| **Validation** | Zod | Runtime type safety across frontend/backend boundary |

---

## 📦 Technology Stack

### Core Infrastructure
- **Deployment**: Vercel (Frontend + Tasks API) + Railway (Products API)
- **Container Runtime**: Docker with multi-stage builds
- **Session Management**: Upstash Redis (serverless)

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (sub-1s HMR)
- **Styling**: Tailwind CSS v4 with component system
- **Data Fetching**: TanStack React Query (caching, sync, refetching)
- **Animation**: Motion (Framer Motion alternative)
- **UI Components**: Radix UI primitives + shadcn/ui

### Backend Stack
- **API Layer**: Node.js Express (Products API) + Vercel Functions (Tasks API)
- **Language**: TypeScript 6.0
- **Validation**: Zod with shared schemas
- **HTTP Client**: Fetch API (no external dependencies)
- **Testing**: Jest with 101 passing tests (components, schemas, integration)

---

## 🌐 Try It Now

**Live Demo:** https://tasks-crafter.vercel.app

> 🎬 No setup required! Access the full application instantly. Create tasks, browse products, and simulate a live shopping session.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (with npm)
- Docker + Docker Compose (for Products API locally)
- Vercel CLI (optional, for simulating production locally)

### Option 1: Local Development (Recommended for Development)

```bash
# Clone repository
git clone https://github.com/DavehPino/tasks-crafter.git
cd tasks-crafter

# Install dependencies (monorepo root)
npm install

# Start Products API in background (Docker)
docker-compose up -d

# Start development server
npm run dev
# Opens http://localhost:5173
# Frontend automatically proxies to http://localhost:3002 for products
```

**What's running:**
- Frontend: `http://localhost:5173` (Vite dev server with HMR)
- Tasks API: `http://localhost:5173/api` (proxied)
- Products API: `http://localhost:3002` (Docker container)

### Option 2: Simulate Production Locally

```bash
# Install Vercel CLI globally
npm install -g vercel

# Start Docker container for Products API
docker-compose up -d

# Run with Vercel Functions simulation
vercel dev
# Opens http://localhost:3000 (simulates deployment environment)
```

### Option 3: Deploy to Production

```bash
# Automatically deploys via GitHub Actions on push
git push origin main

# Frontend + Tasks API → Vercel (automatic)
# Products API → Railway (requires manual connection to Railway project)

# View live app
# https://tasks-crafter.vercel.app
```

---

## 🎨 Features & User Flows

### Session Preparation Page
**Entry point for operators**

1. **Mandatory Tasks Panel** (Left side)
   - Pre-loaded critical checklist items
   - Cannot be deleted; must complete before going live
   - Examples: "Setup Live Shopping Environment", "Configure Payment Gateway"
   - Visual indicator when all mandatory tasks are complete

2. **Product Selector** (Center)
   - Browse all products from Products API
   - Filter by category
   - Select multiple products for session
   - Each selected product auto-generates associated tasks

3. **Session Metrics** (Right side)
   - Real-time count of selected products
   - Task completion progress
   - Estimated revenue based on selected inventory
   - "Ready to Go Live" status indicator

4. **Product Timeline**
   - Visual sequence of products to be featured
   - Drag-to-reorder for session flow
   - Quick preview with product images and pricing

### Live Shopping Simulator
**Triggered when all mandatory tasks complete**

Features:
- **Simulated broadcast interface** with video preview
- **Camera integration** (with user permission)
- **Audio controls** (mute toggle)
- **Product carousel** (next/previous navigation)
- **Live metrics** (fake viewer count, engagement indicators)
- **Broadcasting controls** (start/end stream)

### Products Catalog Page
**Browse available products**

- List all products from Products API
- Category filtering (Men's Clothing, Women's Clothing, Electronics, Jewelry)
- Product cards with images, prices, ratings
- Real-time product count

### Task Management
**Full CRUD operations**

- Create tasks from templates or custom text
- Inline editing of task titles
- Mark as completed with visual feedback (strikethrough)
- Individual or batch deletion
- Pagination (5 tasks per page)
- Mandatory vs. optional task distinction

---

## 📡 API Reference

### Tasks API (Vercel Serverless Functions)

All endpoints require `X-Session-Id` header (auto-included by client).

#### List Tasks
```
GET /api/tasks?page=1&limit=100
```

**Response:**
```json
{
  "tasks": [
    {
      "id": "uuid-1234",
      "title": "Setup Live Shopping Environment",
      "status": "pending",
      "isMandatory": true,
      "productId": null,
      "createdAt": "2026-08-10T10:37:14.000Z",
      "updatedAt": "2026-08-10T10:37:14.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 12,
    "totalPages": 1
  }
}
```

#### Create Task
```
POST /api/tasks
Content-Type: application/json
X-Session-Id: <session-id>

{
  "title": "Custom task name",
  "isMandatory": false,
  "productId": null
}
```

#### Update Task
```
PUT /api/tasks/:id
Content-Type: application/json
X-Session-Id: <session-id>

{
  "title": "Updated title"
}
```

#### Mark Task Complete
```
PATCH /api/tasks/:id
X-Session-Id: <session-id>
```

#### Delete Task
```
DELETE /api/tasks/:id
X-Session-Id: <session-id>
```

#### Bulk Create Tasks (from Products)
```
POST /api/tasks/bulk
Content-Type: application/json
X-Session-Id: <session-id>

{
  "products": [
    {
      "id": 1,
      "title": "Product Name",
      "category": "electronics"
    }
  ]
}
```

**Response:**
```json
{
  "tasks": [ /* array of created tasks */ ],
  "count": 3
}
```

#### Mandatory Tasks Initialization
```
POST /api/tasks/mandatory
X-Session-Id: <session-id>
```

Creates initial mandatory task checklist on first request per session.

**Response:**
```json
{
  "tasks": [ /* mandatory tasks */ ],
  "alreadyInitialized": false
}
```

#### Get Mandatory Status
```
GET /api/tasks/mandatory
X-Session-Id: <session-id>
```

**Response:**
```json
{
  "mandatoryTasks": [ /* filtered mandatory tasks */ ],
  "total": 5,
  "completed": 3,
  "allCompleted": false,
  "canGoLive": false
}
```

---

### Products API (Railway Container)

Serves FakeStore API compatible products. No authentication required.

#### List Products
```
GET /products
```

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Maximum results (default: all)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Fjallraven Backpack",
    "price": 109.95,
    "description": "...",
    "category": "men's clothing",
    "image": "https://...",
    "rating": {
      "rate": 3.9,
      "count": 120
    }
  }
]
```

#### Get Single Product
```
GET /products/:id
```

#### List Categories
```
GET /products/categories
```

**Response:**
```json
[
  "men's clothing",
  "women's clothing",
  "electronics",
  "jewelery"
]
```

#### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "products-api",
  "products": 20
}
```

---

## 📂 Project Structure

```
tasks-crafter/
│
├── api/                                 ← Vercel Serverless Functions
│   ├── tasks/
│   │   ├── index.ts                    # POST/GET /api/tasks
│   │   ├── [id].ts                     # PUT/PATCH/DELETE /api/tasks/:id
│   │   ├── bulk.ts                     # POST /api/tasks/bulk
│   │   └── mandatory.ts                # POST/GET /api/tasks/mandatory
│   ├── health.ts                       # GET /api/health
│   ├── store/                          # Session-based in-memory stores
│   │   ├── tasks.ts                    # Task storage with session key
│   │   └── sessions.ts                 # Session/state management
│   ├── models/                         # TypeScript interfaces
│   │   ├── task.ts
│   │   └── session.ts
│   ├── schemas/                        # Zod validation schemas
│   │   └── task.ts
│   ├── lib/                            # Utilities
│   │   └── redis.ts                    # Upstash Redis client
│   └── helpers/                        # Formatting, validation
│       └── task.ts
│
├── app/                                 ← Vite React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SessionPrepPage.tsx     # Main session prep workflow
│   │   │   └── ProductsPage.tsx        # Products catalog browser
│   │   │
│   │   ├── components/
│   │   │   ├── LiveShoppingDialog.tsx  # Live streaming simulator
│   │   │   ├── SessionMetrics.tsx      # Session KPIs display
│   │   │   ├── ProductSelector.tsx     # Product multi-select
│   │   │   ├── ProductTimeline.tsx     # Drag-to-reorder products
│   │   │   ├── TaskList.tsx            # Task list with pagination
│   │   │   ├── TaskItem.tsx            # Individual task row
│   │   │   ├── TaskCreator.tsx         # Create new task form
│   │   │   ├── ProductCard.tsx         # Product preview card
│   │   │   ├── StatusBadge.tsx         # Status indicator
│   │   │   ├── ui/                     # Shadcn/Radix primitives
│   │   │   └── skeletons/              # Loading states
│   │   │
│   │   ├── api/
│   │   │   ├── tasks.ts                # Task API client (Vercel Functions)
│   │   │   └── products.ts             # Products API client (Railway)
│   │   │
│   │   ├── schemas/
│   │   │   ├── task.ts                 # Zod task schema + types
│   │   │   └── product.ts              # Zod product schema + types
│   │   │
│   │   ├── lib/
│   │   │   ├── sessionId.ts            # Session ID management
│   │   │   └── utils.ts                # Utility functions
│   │   │
│   │   ├── constants/
│   │   │   └── templates.ts            # Pre-built task templates
│   │   │
│   │   ├── App.tsx                     # Main app component with routing
│   │   ├── main.tsx                    # React entry point
│   │   └── index.css                   # Global styles
│   │
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── products-api/                       ← Express API (Railway Container)
│   ├── src/
│   │   ├── index.ts                    # Server entry point
│   │   ├── app.ts                      # Express app setup
│   │   ├── schemas/
│   │   │   └── product.ts              # Zod validation
│   │   └── data/
│   │       └── products.ts             # Fake product data
│   │
│   ├── Dockerfile                      # Multi-stage container build
│   ├── railway.toml                    # Railway deployment config
│   ├── jest.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml                  # Local development orchestration
├── vercel.json                         # Vercel deployment config
├── .env.example                        # Environment variables template
├── .vercelignore                       # Files to exclude from Vercel build
├── .vercel/                            # Vercel metadata
├── package.json                        # Monorepo root (scripts)
├── tsconfig.json                       # Root TypeScript config
└── README.md                           # This file
```

---

## 🛠️ Development

### Local Setup

```bash
# Install all dependencies
npm install

# Start Products API container
docker-compose up -d

# Start development server (http://localhost:5173)
npm run dev

# Run tests
npm test

# Watch mode for tests
npm run test:watch

# Build for production
npm run build
```

### Environment Variables

Create `.env.local` (or copy from `.env.example`):

```bash
# Frontend API endpoints
VITE_API_URL=/api                              # Tasks API (proxied in dev)
VITE_PRODUCTS_API_URL=http://localhost:3002    # Products API URL

# For production:
# VITE_PRODUCTS_API_URL=https://products-api.up.railway.app
```

### Key Scripts

```bash
# Development
npm run dev              # Start Vite dev server

# Building
npm run build           # Compile TypeScript + bundle with Vite

# Testing
npm test               # Run all tests with coverage
npm run test:watch     # Watch mode

# Linting
npm run lint           # Run oxlint on TypeScript
```

### Testing

**Test Coverage:**
- **Backend:** 40 tests (store, schemas, helpers)
- **Frontend:** 61 tests covering:
  - Components: TaskInput, TaskCreator, TaskItem, TaskList, ProductCard, ProductSelector, ProductTimeline, SessionMetrics, StatusBadge, LiveShoppingDialog
  - Skeletons: PageSkeleton, ProductCardSkeleton, TaskListSkeleton (100% coverage)
  - Schemas: Task schema validation
- **Total: 101 passing tests** ✅
- **Overall Coverage:** ~45% statements, ~38% branches, ~31% functions

**Test Breakdown by Component:**
| Component | Tests | Coverage |
|-----------|-------|----------|
| TaskInput | 9 | 91.66% |
| TaskCreator | 5 | 96% |
| TaskItem | 8 | 56.25% |
| ProductCard | 1 | 100% |
| ProductSelector | 7 | 82.35% |
| ProductTimeline | 1 | 100% |
| SessionMetrics | 9 | 100% |
| StatusBadge | 3 | 100% |
| LiveShoppingDialog | 8 | 53.73% |
| Skeletons (3) | 9 | 100% |
| Task Schema | 1 | 100% |

Run tests:
```bash
npm test                  # Single run with coverage report
npm run test:watch        # Watch mode (re-run on file change)
```

**What's Tested:**
- ✅ Component rendering and visibility
- ✅ User interactions (click, type, submit)
- ✅ State management and callbacks
- ✅ Conditional rendering based on props
- ✅ Loading and error states
- ✅ Zod schema validation

---

## 🚀 Deployment

### Frontend + Tasks API → Vercel

1. **Connect GitHub repository**
   ```
   Visit https://vercel.com/new → Select repository
   ```

2. **Vercel auto-detects configuration** from `vercel.json`:
   - Builds frontend: `npm run build --prefix app`
   - Deploys `/api` folder as serverless functions
   - Serves `app/dist` as static assets

3. **Deploy** (automatic on push to main)
   ```bash
   git push origin main
   # Vercel builds and deploys in ~2 minutes
   # App live at https://tasks-crafter.vercel.app
   ```

4. **Set environment variables** in Vercel dashboard:
   ```
   VITE_PRODUCTS_API_URL=https://products-api.up.railway.app
   ```

### Products API → Railway

1. **Prepare Railway project**
   ```bash
   npm install -g railway
   railway link                    # Connect to Railway project
   ```

2. **Deploy** (automatic on GitHub push if connected)
   ```bash
   railway up                      # Manual push (one-time setup)
   ```

   Or connect GitHub repo to Railway for automatic deployments.

3. **Railway uses configuration** from `products-api/railway.toml`:
   ```toml
   [build]
   builder = "dockerfile"
   
   [deploy]
   startCommand = "node dist/index.js"
   healthcheckPath = "/health"
   restartPolicyType = "on_failure"
   ```

4. **Get your Products API URL** from Railway dashboard
   - Set `VITE_PRODUCTS_API_URL` in Vercel environment variables

### Health Checks & Monitoring

Both deployments include health check endpoints:

```bash
# Tasks API health
curl https://tasks-crafter.vercel.app/api/health

# Products API health
curl https://products-api.up.railway.app/health
```

Railway automatically restarts Products API if health checks fail (configurable in `railway.toml`).

---

## 💾 Data Persistence & State Management

### Session State (Tasks)

- **Storage**: Upstash Redis (for production) + in-memory Map (for development)
- **Key**: `session:{sessionId}:{entity}`
- **Lifetime**: Per-session (survives API restarts if using Redis)
- **Scalability**: Distributed, supports multi-instance deployments

```typescript
// Tasks are stored per session
const sessionKey = `session:${sessionId}:tasks`;
// Allows isolation between concurrent sessions
```

### Products

- **Storage**: In-memory (Products API)
- **Data source**: Hardcoded FakeStore dataset (20 products, 4 categories)
- **Persistence**: N/A (read-only catalog)

### Future: Database

For production persistence, replace in-memory stores:

```typescript
import { db } from './db';  // PostgreSQL, Firebase, etc.

export const getTasks = (sessionId: string) => 
  db.tasks.findMany({ where: { sessionId } });
```

Recommended options:
- **PostgreSQL** (Vercel Postgres, Railway)
- **Firebase** (real-time, managed)
- **Supabase** (managed Postgres with REST API)

---

## 🔐 Security & Compliance

### Current Implementation (POC)

- ✅ Session-based isolation (X-Session-Id header)
- ✅ Type safety at runtime (Zod validation)
- ✅ No sensitive data in tasks
- ⚠️ CORS open to all (acceptable for internal POC)
- ❌ No authentication/authorization (expected for POC)

### Production Roadmap

- [ ] JWT authentication with expiration
- [ ] RBAC (operator roles, permissions)
- [ ] CORS allowlist (specific domains)
- [ ] Rate limiting (Vercel Rate Limit API)
- [ ] Request logging & audit trail
- [ ] HTTPS enforcement (automatic on Vercel/Railway)
- [ ] Security headers (CSP, X-Frame-Options)
- [ ] Database encryption at rest

---

## 📊 Performance & Metrics

### Benchmarks

| Metric | Value | Notes |
|--------|-------|-------|
| Cold start (serverless) | ~500ms | Vercel caches warm instances |
| API response time | 50-100ms | In-memory, no DB |
| Frontend build | ~537ms | Vite with TypeScript |
| Page load (Vercel CDN) | <100ms | Global edge network |
| Concurrent sessions | ~100 | Limited by in-memory store |

### Capacity

- **Requests/min**: ~1000 (serverless limit with scaling)
- **Concurrent users**: ~100 with in-memory store
- **Task volume**: 5-10 per session (design target)
- **Products**: 20 static products

### Optimization Opportunities

1. **Caching** – Add Redis for Products API responses
2. **Compression** – Gzip for API responses
3. **Code splitting** – Already done with lazy-loaded pages
4. **Image optimization** – WebP + responsive srcsets for products
5. **Database indexing** – When adding persistence layer

---

## ⚠️ Known Limitations & Trade-offs

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| Data lost if Redis unavailable | Medium | Add fallback to PostgreSQL |
| No real-time multi-user sync | Low | Expected for single-operator POC |
| Cold start on first request | Low | Vercel caches warm instances |
| Products API must be externally hosted | Low | Auto-restart via health checks |
| No offline support | Low | Operators have reliable connectivity |
| Session expires if not used | Medium | Implement refresh token logic |

---

## 🎯 Feature Roadmap

### Phase 1: Current (Complete)
- ✅ Session preparation workflow
- ✅ Task management (CRUD)
- ✅ Product discovery & filtering
- ✅ Live shopping simulator
- ✅ Mandatory task validation
- ✅ Bulk task generation

### Phase 2: Next Sprint
- [ ] Analytics dashboard (tasks completed, session duration)
- [ ] Product search with text index
- [ ] Operator notes & annotations
- [ ] Session history & replay
- [ ] Email notifications (pre-session reminder)

### Phase 3: Production
- [ ] Multi-operator collaboration (real-time sync)
- [ ] Database persistence (PostgreSQL)
- [ ] Authentication (JWT + OAuth)
- [ ] Advanced filtering & sorting
- [ ] API rate limiting & quotas
- [ ] Error tracking (Sentry)
- [ ] APM & observability (Datadog)

### Phase 4: Scale
- [ ] Mobile app (React Native)
- [ ] International localization (i18n)
- [ ] A/B testing framework
- [ ] Recommendation engine (ML)
- [ ] Third-party integrations (Shopify, TiendaNube)

---

## 🧪 Testing

### Test Structure

```
api/                       # Serverless function tests
├── __tests__/
│   ├── store.test.ts      # Session store operations
│   ├── schemas.test.ts    # Validation logic
│   └── helpers.test.ts    # Utility functions

app/src/                   # Frontend tests
├── __tests__/
│   ├── schemas.test.ts    # Zod validation
│   └── components/        # Component tests
```

### Running Tests

```bash
npm test                   # Full suite with coverage
npm run test:watch         # Watch mode
npm test -- --testPathPattern="schema"  # Single file
```

### Coverage Goals

- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >85%
- **Lines**: >80%

---

## 🤝 Development Workflow

### Making Changes

#### Frontend Changes
```bash
# 1. Edit files in app/src/
# 2. Vite HMR reloads automatically at http://localhost:5173
# 3. Run tests
npm test

# 4. Build & verify production bundle
npm run build
npm run preview
```

#### API Changes (Vercel Functions)
```bash
# 1. Edit files in api/
# 2. Use Vercel Functions locally
vercel dev    # Opens http://localhost:3000

# 3. Or rebuild and test with mock requests
npm run build
```

#### Products API Changes
```bash
# 1. Edit files in products-api/src/
# 2. Rebuild Docker image
docker-compose down
docker-compose up -d

# 3. Test endpoints
curl http://localhost:3002/products
```

### Commit Message Convention

```
feat: Add live shopping simulator
fix: Handle missing product category
refactor: Simplify task store logic
docs: Update API endpoints
test: Add session store tests
```

---

## 🔗 Useful Links

- **Live App**: https://tasks-crafter.vercel.app
- **GitHub**: https://github.com/DavehPino/tasks-crafter
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Upstash Console**: https://console.upstash.com

### Documentation Files
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** – Detailed deployment procedures
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** – System design & decision log
- **[AGENTS.md](./AGENTS.md)** – Development guidelines

---

## 📝 License

This project is provided as-is for evaluation purposes. All rights reserved.

---

## 👨‍💻 About This Project

**Built for**: Live commerce session preparation at scale  
**Team**: Single developer  
**Timeline**: 4-5 hour development window  
**Context**: Full-stack TypeScript engineer evaluation

This project demonstrates:
- ✅ Full-stack API design (serverless + containerized)
- ✅ Modern frontend architecture (React, TanStack Query, Tailwind)
- ✅ Type safety end-to-end (TypeScript + Zod)
- ✅ Production-grade deployment strategy (Vercel + Railway)
- ✅ Session-based state isolation with Redis
- ✅ Comprehensive testing & error handling
- ✅ UI/UX polish with accessibility considerations
- ✅ Clear documentation & architectural decisions

---

**Last Updated:** August 10, 2026  
**Version:** 1.0.0  
**Status:** Production-Ready POC
