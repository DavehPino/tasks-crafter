# Tasks Crafter

Internal task management tool for live commerce session preparation.

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, TypeScript |
| Frontend | React, Vite, TypeScript |
| Validation | Zod (backend + frontend) |
| Data fetching | TanStack Query, Axios |
| Styling | Tailwind CSS v4 |
| Dev tooling | ts-node-dev, concurrently |

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/tasks` | List tasks (paginated, 5 per page) |
| `GET` | `/api/tasks/:id` | Fetch a single task |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update task title |
| `PATCH` | `/api/tasks/:id/complete` | Mark task as completed |
| `DELETE` | `/api/tasks/:id` | Delete a task |

Request bodies are validated with Zod and return structured `400` errors on failure.

### Query Parameters

- `GET /api/tasks` accepts optional `page` (default: 1) and `limit` (default: 5, max: 100) parameters for pagination.

## Setup

**Requirements:** Node.js 18+

```bash
# 1. Clone the repository
git clone https://github.com/DavehPino/tasks-crafter.git
cd tasks-crafter

# 2. Install all dependencies
npm install
npm install --prefix backend
npm install --prefix frontend

# 3. Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Start both servers
npm run dev
```

| Service | URL |
|---------|-----|
| Backend | http://localhost:3001 |
| Frontend | http://localhost:5173 |
| Health check | http://localhost:3001/health |

## Project Structure

```
tasks-crafter/
├── backend/
│   └── src/
│       ├── controllers/   # Request handlers
│       ├── middlewares/   # Zod validation middleware
│       ├── models/        # Task type definitions
│       ├── routes/        # Express routers
│       ├── schemas/       # Zod schemas and DTOs
│       └── index.ts       # Entry point
└── frontend/
    └── src/
        ├── api/           # Axios functions (queryFn / mutationFn)
        ├── schemas/       # Zod schemas and inferred types
        └── main.tsx       # QueryClientProvider setup
```

---

## Assumptions

- A single internal operator uses the tool at a time — no concurrency handling required.
- In-memory storage is sufficient for the POC; data does not need to persist across restarts.
- Authentication and authorization are out of scope for this phase.
- Task status is binary: `pending` or `completed`. No priority or assignment fields are needed.

## Deliberately Not Implemented

- **Persistence** — no database; state lives in memory.
- **Authentication** — no login or session management.
- **Filtering** — no search, status filters, or sorting.
- **Optimistic updates** — mutations wait for server confirmation before updating the UI.
- **Error boundary UI** — API errors surface as console output during this POC phase.

## Engineering Notes: Pagination

**Pagination is implemented but unnecessary for this POC.** A live commerce session typically involves 5–10 setup tasks max, so pagination is overkill. However, it's included to demonstrate:

- API design best practices (RESTful query parameters)
- Pagination patterns with metadata (page, limit, total, totalPages)
- Frontend state management with page tracking
- Scalability awareness (if the system were to grow beyond the POC scope)

In production, this would be the foundation for handling thousands of tasks. For this POC, it's purely an engineering bonus.

## What Would Be Required to Productionize

- Replace in-memory store with a database (e.g., PostgreSQL via Prisma).
- Add authentication (e.g., JWT or session-based).
- Add structured logging (e.g., `pino`) and centralized error handling middleware.
- Containerize with Docker and add a `docker-compose.yml` for local parity.
- Set up a CI/CD pipeline with automated tests (unit + integration).
- Add rate limiting, helmet, and other security middleware to Express.
- Configure environment-specific builds and a proper secrets manager.

## Known Technical Risks and Limitations

- **No persistence** — all task data is lost on server restart.
- **No input sanitization beyond Zod** — XSS or injection vectors are not addressed.
- **Single-process** — the Express server has no clustering; a crash takes down the entire API.
- **CORS is open to localhost only** — needs a proper allowlist for staging/production environments.
