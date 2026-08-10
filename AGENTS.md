# AGENTS.md

# Main instructions

Do not commit and push unless is asked by the user.

## Project Context

Internal task management tool for live commerce session preparation. Used by operators during session setup.

**Key Technical Decision:** Using Vercel serverless functions (API) + React (app) with TypeScript.

---

## Core Requirements

### Functional

- Create new tasks from templates or custom text
- Update task titles inline
- Mark tasks as completed
- Delete individual or multiple tasks
- View all tasks with pagination

### Technical

- Backend: Node.js + Vercel Serverless Functions + TypeScript
- Frontend: React + Vite + TypeScript
- API-first design; all operations exposed via endpoints
- App consumes API (no direct DB access)
- Validation: Zod (shared schemas)
- Data fetching: TanStack Query
- Styling: Tailwind CSS v4
- Storage: In-memory (POC scope)

---

## Evaluation Criteria

| Criterion             | Focus                                 |
| --------------------- | ------------------------------------- |
| API Usability         | RESTful design, clear error responses |
| Delivery Completeness | All CRUD operations functional        |
| Ease of Setup         | Single `npm run dev` command          |
| Clarity               | Clean separation of concerns          |
| Production Awareness  | Documented gaps and scaling path      |
| Scoping               | POC-appropriate, no over-engineering  |

---

## API Endpoints

| Method   | Route                     | Description      |
| -------- | ------------------------- | ---------------- |
| `GET`    | `/api/tasks`              | List (paginated) |
| `GET`    | `/api/tasks/:id`          | Fetch single     |
| `POST`   | `/api/tasks`              | Create           |
| `PUT`    | `/api/tasks/:id`          | Update title     |
| `PATCH`  | `/api/tasks/:id/complete` | Mark completed   |
| `DELETE` | `/api/tasks/:id`          | Delete           |

**Validation:** Zod schemas validate `POST` and `PUT` bodies. Returns `400` with structured errors.

---

## Constraints

- **Time:** 4–5 hour development window
- **Users:** Limited internal users (no multi-user sync)
- **Auth:** Not required for POC
- **Persistence:** In-memory; data resets on restart
- **Scope:** ~5–10 tasks per session

---

## Project Structure

```
tasks-crafter/
├── api/
│   └── tasks/         # Serverless function handlers
├── app/
│   └── src/
│       ├── api/           # Fetch functions
│       ├── components/    # React components
│       ├── constants/     # Task templates
│       └── schemas/       # Zod + types
```

---

## What's Deliberately NOT Implemented

| Feature               | Why Not                                    |
| --------------------- | ------------------------------------------ |
| Database persistence  | In-memory is sufficient for POC            |
| Authentication        | Internal tool; single operator assumed     |
| Filtering/search      | Low task volume (~5-10)                    |
| Optimistic UI updates | Mutations are fast enough                  |
| Error UI components   | Console logging acceptable                 |
| Security hardening    | Localhost only; trust boundary is internal |

---

## Production Requirements (If Deployed)

### Must-have

- [ ] Database (PostgreSQL + Prisma)
- [ ] Authentication (JWT)
- [ ] Authorization (roles)
- [ ] Error tracking (Sentry)
- [ ] Request logging (pino)
- [ ] HTTPS

### Should-have

- [ ] Rate limiting
- [ ] CORS allowlist
- [ ] Security headers (helmet)
- [ ] Unit/integration tests
- [ ] CI/CD pipeline

### Nice-to-have

- [ ] Docker containerization
- [ ] Redis caching
- [ ] E2E tests
- [ ] Monitoring/alerts

---

## Technical Risks

| Risk                 | Impact                  |
| -------------------- | ----------------------- |
| Data loss on restart | High (expected in POC)  |
| Single-process       | High (no clustering)    |
| No auth              | Medium (internal use)   |
| CORS hardcoded       | Medium (localhost only) |
