# Tasks Crafter

A proof-of-concept task management tool for live commerce session preparation. Built with a focus on API usability, delivery completeness, and production-aware design patterns.

**Status:** ✅ Fully functional POC | **Development time:** ~3 hours | **Repository:** [DavehPino/tasks-crafter](https://github.com/DavehPino/tasks-crafter)

---

## 📋 Functional Requirements — All Complete

| Requirement             | Status | Details                                                  |
| ----------------------- | ------ | -------------------------------------------------------- |
| Create new tasks        | ✅     | Via template selector or custom text; validated with Zod |
| Update task title       | ✅     | Inline edit with double-click behavior or edit button    |
| Mark tasks as completed | ✅     | Via checkmark button; tasks display with strikethrough   |
| Delete tasks            | ✅     | Individual delete or batch delete with "select all"      |
| View all tasks          | ✅     | Paginated list (5 per page) with full task details       |

---

## 🧭 Stack Decision

### Why not Next.js + Hono?

Next.js with its built-in API routes + Hono (lightweight, edge-ready framework) would have been the more modern choice:

- **Hono** is faster than Express, has native TypeScript support, and runs on edge runtimes.
- **Next.js API routes** eliminate the need for a separate backend server — everything lives in one project.
- **Deployment simplicity:** One repo, one platform (Vercel), zero CORS issues.

### Why Vite + Express instead?

Given the 4–5 hour time constraint and POC scope, we chose pragmatism over novelty:

| Factor | Vite + Express | Next.js + Hono |
|--------|---------------|----------------|
| **Setup speed** | Scaffolds in seconds, zero config | Requires understanding App Router, API routes, edge vs Node runtime |
| **Decoupling** | Backend and frontend are fully independent services | Tightly coupled in a single Next.js project |
| **Team familiarity** | Express is universally known; Vite is the React standard | Hono is newer; Next.js API routes have quirks (edge runtime, middleware, route handlers) |
| **Deployment flexibility** | Backend and frontend can deploy anywhere independently | Tied to Vercel (or similar) for full functionality |
| **Time to first working feature** | ~30 min to have CRUD API + SPA talking to each other | ~1–2h to nail down routing, middleware, and deployment config |

**Bottom line:** For a POC where speed and clarity matter more than architectural elegance, separating concerns with Vite (frontend) and Express (backend) was the faster, safer bet. Next.js + Hono would shine in a production system with edge requirements — but that's not this project.

---

## 🏗️ Stack

| Layer             | Technology                       | Rationale                                                 |
| ----------------- | -------------------------------- | --------------------------------------------------------- |
| **Backend**       | Node.js 18+, Express, TypeScript | Fast iteration, type safety, minimal boilerplate          |
| **Frontend**      | React 18, Vite, TypeScript       | Quick HMR, modern tooling, familiar ecosystem             |
| **Validation**    | Zod                              | Type-safe, schema-driven validation on both client/server |
| **Data Fetching** | TanStack Query, native Fetch     | Automatic caching, refetch, sync across browser tabs      |
| **Styling**       | Tailwind CSS v4                  | Utility-first, rapid UI iteration, design tokens          |
| **Storage**       | In-memory (Map)                  | Suitable for POC scope; no external dependencies          |

---

## 🚀 Quick Start

**Requirements:** Node.js 18+

```bash
# Clone and setup
git clone https://github.com/DavehPino/tasks-crafter.git
cd tasks-crafter

# Install all dependencies (root + backend + frontend)
npm install
npm install --prefix backend
npm install --prefix frontend

# Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start both servers (backend:3001 + frontend:5173)
npm run dev
```

**Available commands:**

```bash
npm run dev              # Start both backend and frontend
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only
```

**Verify setup:**

- Backend health check: `curl http://localhost:3001/health`
- Frontend: Open `http://localhost:5173` in your browser

---

## 🧪 Tests

66 tests across backend and frontend, all passing.

| Suite                 | Tests | Coverage                                 |
| --------------------- | ----- | ---------------------------------------- |
| Backend (Jest)        | 40    | Store, schemas, helpers, controllers     |
| Frontend (Jest + RTL) | 26    | Schemas, TaskCreator, TaskItem, TaskList |

```bash
npm test              # Run all tests (backend + frontend)
npm run test:watch    # Watch mode for both
```

---

## 📡 API Reference

### Endpoints

| Method   | Route                     | Description            | Request Body             |
| -------- | ------------------------- | ---------------------- | ------------------------ |
| `GET`    | `/api/tasks`              | List tasks (paginated) | Query: `?page=1&limit=5` |
| `GET`    | `/api/tasks/:id`          | Fetch single task      | —                        |
| `POST`   | `/api/tasks`              | Create task            | `{ "title": "string" }`  |
| `PUT`    | `/api/tasks/:id`          | Update task title      | `{ "title": "string" }`  |
| `PATCH`  | `/api/tasks/:id/complete` | Mark as completed      | —                        |
| `DELETE` | `/api/tasks/:id`          | Delete task            | —                        |

### Response Format

**Paginated response (GET /api/tasks):**

```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Setup Live Shopping Environment",
      "status": "pending",
      "createdAt": "2026-08-06T10:37:14.000Z",
      "updatedAt": "2026-08-06T10:37:14.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 12,
    "totalPages": 3
  }
}
```

**Error response (400):**

```json
{
  "errors": [{ "field": "title", "message": "Title is too long" }]
}
```

All request bodies are validated with Zod. Invalid requests return `400` with structured error messages. Missing tasks return `404`.

---

## 🏗️ Project Structure

```
tasks-crafter/
├── package.json                    # Root monorepo config with concurrently
├── README.md
│
├── backend/
│   ├── src/
│   │   ├── index.ts               # Express app setup, CORS, health check
│   │   ├── controllers/           # Request handlers (CRUD logic)
│   │   ├── routes/                # Route definitions
│   │   ├── models/                # Task type definitions
│   │   ├── schemas/               # Zod schemas + inferred DTO types
│   │   ├── store/                 # In-memory task store (Map)
│   │   ├── helpers/               # parseBody validation helper
│   │   └── middlewares/           # (unused validate middleware)
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── main.tsx               # React entry + QueryClientProvider
    │   ├── App.tsx                # Main app (state, mutations, pagination)
    │   ├── index.css              # Tailwind + Terrific brand theme tokens
    │   ├── api/                   # Fetch functions with PaginatedResponse
    │   ├── components/
    │   │   ├── TaskCreator.tsx    # Template selector + task creation
    │   │   ├── TaskList.tsx       # Task list with "select all" checkbox
    │   │   └── TaskItem.tsx       # Individual task row (edit, complete, delete)
    │   ├── constants/             # Task templates for live shopping
    │   └── schemas/               # Zod schemas (Task, CreateTaskDTO)
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

## 🎨 UI/UX Features

- **Task Templates:** 10 pre-built live commerce setup task templates to accelerate workflow
- **Inline Editing:** Click edit button to modify task titles without leaving the page
- **Batch Operations:** "Select all" checkbox + delete selected for bulk task removal
- **Pagination Controls:** Previous/Next navigation (5 tasks per page)
- **Completion Tracking:** Visual strikethrough + progress counter ("X / Y completed")
- **Brand Theming:** Terrific orange-pink gradient applied consistently via Tailwind tokens
- **Responsive Design:** Works on desktop; mobile not tested

---

## 🚀 Future Improvements

If this project were to evolve beyond a POC, these upgrades would be the natural next steps:

### UI Layer
- **Component library:** Replace raw HTML/Tailwind with a modern library like [shadcn/ui](https://ui.shadcn.com/) or [Radix Primitives](https://www.radix-ui.com/) for accessible, composable components out of the box.
- **Form handling:** Integrate [React Hook Form](https://react-hook-form.com/) + Zod resolver for type-safe form validation, better UX (field-level errors, dirty states), and less boilerplate.

### React Patterns
- **Suspense:** Wrap async data fetching in `<Suspense>` boundaries for granular loading states instead of a single `isLoading` flag.
- **Error Boundaries:** Add `<ErrorBoundary>` components to gracefully handle rendering errors and API failures without crashing the entire app.
- **Server Components / Server Actions:** If migrated to Next.js, leverage React Server Components to reduce client-side JavaScript and simplify data fetching.

### Architecture
- **Database:** Replace in-memory Map with PostgreSQL (Prisma) or SQLite (Drizzle) for real persistence.
- **Auth:** Add JWT or session-based auth for multi-user support.
- **API improvements:** Pagination cursor-based, filtering by status, batch endpoints.

---

## 📝 Assumptions

1. **Single operator:** Tool is used by one internal operator at a time; no multi-user sync required.
2. **Session duration:** Tasks exist only during a live commerce session; no data persistence needed.
3. **Scope:** ~5–10 tasks per session (pagination is a bonus, not a necessity).
4. **No auth:** Internal tool; authentication is out of scope for this POC.
5. **Simple status:** Only two states: `pending` and `completed`; no priority/assignment/urgency fields.

---

## 🚫 Deliberately Not Implemented

| Feature                              | Why                                                  | Trade-off                                    |
| ------------------------------------ | ---------------------------------------------------- | -------------------------------------------- |
| **Database persistence**             | In-memory storage is sufficient for session lifetime | All data lost on server restart              |
| **Authentication/authorization**     | Internal use case; assumed single operator           | No multi-user audit trail                    |
| **Filtering & search**               | Low task volume (~5-10 per session)                  | Can't search or filter by status             |
| **Optimistic updates**               | Adds complexity; mutations are fast enough           | Brief loading states on each action          |
| **Error UI components**              | POC doesn't need polish; errors are logged           | Errors don't display in UI; check console    |
| **Input sanitization (beyond Zod)**  | Zod handles basic validation; XSS is low risk        | No DomPurify; assumes trusted internal users |
| **Rate limiting / security headers** | POC running on localhost                             | No helmet, no rate limiting                  |

---

## 🚀 Production Readiness — What's Needed

To deploy this system to production, the following changes are **mandatory:**

### Storage & Data

- [ ] **Database:** Replace in-memory Map with PostgreSQL/MySQL via Prisma ORM
- [ ] **Migrations:** Schema versioning and rollback capability
- [ ] **Backups:** Automated daily backups with recovery testing

### Security

- [ ] **Authentication:** JWT or session-based auth; multi-user support
- [ ] **Authorization:** Role-based access control (e.g., operator, admin, viewer)
- [ ] **Input sanitization:** DomPurify on frontend; additional server-side escaping
- [ ] **CORS:** Proper allowlist (not hardcoded `localhost`)
- [ ] **Security headers:** helmet middleware for CSP, X-Frame-Options, HSTS, etc.
- [ ] **Rate limiting:** express-rate-limit to prevent abuse
- [ ] **HTTPS:** TLS/SSL in production

### Observability & Operations

- [ ] **Structured logging:** pino or winston for machine-readable logs
- [ ] **Metrics:** Prometheus-compatible endpoints for request counts, latencies, errors
- [ ] **Error tracking:** Sentry or similar for production bug detection
- [ ] **Health checks:** Liveness and readiness probes for Kubernetes/load balancers

### Testing & CI/CD

- [ ] **Integration tests:** Supertest for API endpoints with real request/response flow
- [ ] **E2E tests:** Playwright or Cypress for user workflows
- [ ] **CI/CD:** GitHub Actions (or similar) for linting, testing, building, deploying
- [ ] **Code coverage:** Aim for >80% coverage

### Infrastructure & Deployment

- [ ] **Containerization:** Docker images for backend and frontend
- [ ] **Orchestration:** docker-compose or Kubernetes manifests
- [ ] **Load balancing:** Reverse proxy (nginx) for multiple backend instances
- [ ] **CDN:** Cloudflare or similar for static asset caching
- [ ] **Monitoring:** Uptime monitors and alerting (PagerDuty, OpsGenie)
- [ ] **Scaling:** Horizontal scaling strategy for concurrent users
- [ ] **Env management:** Secrets vault (AWS Secrets Manager, HashiCorp Vault)

### Performance

- [ ] **Caching strategy:** Redis for session/task caching; HTTP cache headers
- [ ] **Database indexing:** Indexes on frequently queried fields
- [ ] **API optimization:** GraphQL (or REST filtering) to reduce over-fetching
- [ ] **Frontend optimization:** Code splitting, lazy loading, image optimization

---

## ⚠️ Known Technical Risks & Limitations

| Risk                                       | Severity    | Mitigation in Prod                        |
| ------------------------------------------ | ----------- | ----------------------------------------- |
| **All data lost on restart**               | High        | Implement database + persistent storage   |
| **Single-process** — no clustering         | High        | Use process manager (PM2) or Kubernetes   |
| **No query validation on params**          | Medium      | Add query param schema validation         |
| **CORS hardcoded to localhost**            | Medium      | Use env-based allowlist                   |
| **No request logging**                     | Medium      | Add morgan (Express) logging middleware   |
| **TypeScript strict mode disabled**        | Low         | Enable `strict: true` in tsconfig.json    |
| **Fetch-based API calls (no error retry)** | Low         | Add exponential backoff to request helper |
| **No database connection pooling**         | N/A for POC | Critical for Postgres in production       |
| **In-memory store not thread-safe**        | Low         | Database handles concurrency              |

---

## 📊 Scope & Delivery Assessment

This POC was delivered within the 4–5 hour constraint while maintaining:

- ✅ **API usability:** Clean REST interface with consistent error responses
- ✅ **Delivery completeness:** All functional requirements met (CRUD + view all)
- ✅ **Ease of setup:** Single `npm run dev` command; no database config needed
- ✅ **Clarity of implementation:** Well-organized code with clear separation of concerns
- ✅ **Production awareness:** Documented gaps, risks, and migration path to production
- ✅ **Appropriate scoping:** POC stays simple; no premature optimization or over-engineering

---

## 🔗 Repository

**GitHub:** [github.com/DavehPino/tasks-crafter](https://github.com/DavehPino/tasks-crafter)

Clone it, run it, deploy it:

```bash
git clone https://github.com/DavehPino/tasks-crafter.git
cd tasks-crafter && npm install && npm run dev
```

Feedback and contributions are welcome. This is a starting point for a production task management system for live commerce operators.
