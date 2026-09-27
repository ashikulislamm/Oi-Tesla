# PHASES.md — Build Plan for Oi Tesla Ride-Pooling MVP

Branches: `master`, `pre-release`, `release/v1.0.0`, plus `feature/*`. Each phase = one or more feature branches merged into `master` with incremental, conventionally-typed commits. See RULES.md for commit message format and branch rules.

---

## Phase 0 — Setup

- `feature/project-scaffold`
- Monorepo structure (`/backend`, `/frontend`), Docker Compose skeleton, `.env.example`, README stub, architecture diagram + ERD committed as docs (link to ARCHITECTURE.md).
- Sample commit: `feat(scaffold): initialize monorepo with Next.js, Express, Postgres`
- Merge → `master`

## Phase 1 — Auth

- `feature/passenger-auth`, `feature/driver-auth`
- Signup/login endpoints, JWT middleware, role-based access (passenger vs driver).
- Sample commits: `feat(auth): add passenger login endpoint`, `feat(auth): add JWT middleware`
- Tests: unauthorized access rejected; a user can't touch another user's ride.
- Merge → `master`

## Phase 2 — Core Ride Request Flow

- `feature/ride-request`
- Passenger creates ride request; fare-estimate endpoint; zone/distance lookup table (REQUIREMENTS.md §4).
- Sample commit: `feat(ride): add ride request creation with fare estimate`
- Merge → `master`

## Phase 3 — Driver & Tesla

- `feature/driver-flow`
- Tesla model, online/offline toggle, view pending compatible requests.
- Sample commit: `feat(driver): add online/offline toggle and request feed`
- Merge → `master`

## Phase 4 — Pooling & Capacity

- `feature/tesla-pooling`
- Matching rule, pool creation/join, capacity enforcement, transaction-based seat claim (ARCHITECTURE.md §5 — the Nusrat/Shirin race fix).
- Sample commits: `feat(pool): enforce Bullet's seat capacity`, `fix(pool): prevent overbooking available seats`
- This is the natural place to show a real "before/after" in the git history: an initial naive check-then-write implementation, followed by the transactional fix.
- Merge → `master`

## Phase 5 — Lifecycle & Fare Finalization

- `feature/ride-lifecycle`
- State machine transitions, status-history logging, per-passenger fare finalization on completion.
- Sample commit: `feat(ride): add status transition state machine`
- Merge → `master`

## Phase 6 — Frontend Integration

- `feature/passenger-ui`, `feature/driver-ui`
- Next.js pages/components wired to the API; loading/error/empty states for every flow.
- Sample commit: `feat(web): add passenger request and tracking flow`
- Merge → `master`

## Phase 7 — Docker & Deployment

- `feature/dockerize`
- Compose file for backend/frontend/db, health checks, seed script (Jashim/Bullet/Nusrat/Rafiq/Shirin).
- Sample commit: `build(docker): add compose setup for backend, frontend, and postgres`
- Merge → `master`
- Cut **`pre-release`**: integration fixes, doc polish, deployment config.
- Sample commits: `fix(deploy): correct env var loading in production build`, `docs(readme): add architecture, ERD, fare example, AI usage section`

## Phase 8 — Release

- Cut `release/v1.0.0` from `pre-release`.
- Tag the release; record the demo video against this exact tag; deploy this exact commit.

---

## Bonus Reasoning: Scaling to 1M Passengers / 100k Drivers

Not built — reasoned through only, per the brief. Include a short write-up (and optional diagram) in the README covering:

- **Load balancing / horizontal scaling:** stateless API behind a load balancer; JWT auth avoids sticky sessions.
- **DB:** read replicas for history/search queries; indexes on `(pickup_zone, status)`, `(driver_id)`, `(passenger_id, status)`; partition `status_history` by month.
- **Caching:** cache the zone-distance lookup table and "online drivers per zone" in Redis.
- **Geospatial search:** replace the zone list with PostGIS or a geohash index once real coordinates matter.
- **Queues/events:** matching becomes async (publish ride-requested event → matching worker) instead of synchronous request/response.
- **Real-time:** WebSocket/SSE gateway replaces polling for status + driver location.
- **Rate limiting/idempotency:** idempotency keys on ride-request creation; per-user rate limits.
- **Observability:** structured logs, request tracing, metrics (matching latency, seat-claim contention rate).
- **Seat contention at scale:** move from row-lock transactions to a reservation service (Redis atomic INCR with TTL, or a sharded lock) to avoid Postgres hot-row contention.
- **Deployment:** managed k8s/ECS with autoscaling; blue/green releases matching the branch strategy already in place.
