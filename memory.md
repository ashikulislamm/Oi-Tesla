# MEMORY.md — Oi Tesla Project State & Decision Ledger

> **Purpose:** Living documentation of project state, technical decisions, architectural invariants, frontend component registry, and progress across phases. Maintained throughout implementation.

---

## 1. Project Overview & Boundaries

* **Product:** Electric Vehicle (EV) ride-pooling platform for Dhaka commuters along the Banani – Gulshan – Mohakhali corridor.
* **Core Cast (Consistent across seed, tests, and demo):**
  * **Jashim** — Driver operating **Bullet** (fixed capacity: 3 passenger seats).
  * **Nusrat** — Passenger traveling Banani $\rightarrow$ Mohakhali ($4.5\text{ km}$, pooled).
  * **Rafiq** — Passenger traveling Banani $\rightarrow$ Gulshan 1 ($3.0\text{ km}$, pooled, requests 2 min after Nusrat).
  * **Shirin** — Passenger attempting to claim the final seat concurrently (triggers seat-race condition test).
* **Stack:**
  * **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4.
  * **Backend:** Node.js, Express.js 5, TypeScript.
  * **Database:** PostgreSQL 16 via Prisma ORM 6.
  * **Orchestration:** Docker Compose (`db`, `backend`, `frontend`).

---

## 2. Phase Execution Status

| Phase | Description | Branch | Status |
|---|---|---|---|
| **Phase 0** | Scaffold (monorepo, Docker Compose, docs, base setup) | `feature/project-scaffold` | ✅ **Completed** |
| **Phase 1** | Auth (Passenger & Driver JWT, RBAC, Password Hashing, UI) | `feature/passenger-auth`, `feature/driver-auth` | ✅ **Completed** |
| **Phase 2** | Core Ride Request (Lookup matrix, fare estimate, ride creation) | `feature/ride-request` | ⏳ **Next Up** |
| **Phase 3** | Driver & Tesla Flow (Online/offline toggle, request feed, pool view) | `feature/driver-flow` | ⏳ Pending |
| **Phase 4** | Pooling & Concurrency (Corridor matching, `SELECT ... FOR UPDATE` seat lock) | `feature/tesla-pooling` | ⏳ Pending |
| **Phase 5** | Lifecycle & Fare Finalization (State machine, `STATUS_HISTORY` audit) | `feature/ride-lifecycle` | ⏳ Pending |
| **Phase 6** | Frontend Integration (Reusable UI components, passenger & driver apps) | `feature/passenger-ui`, `feature/driver-ui` | ⏳ Pending |
| **Phase 7** | Docker & Deployment (`pre-release`, seed script with cast, healthchecks) | `feature/dockerize` | ⏳ Pending |
| **Phase 8** | Release (`release/v1.0.0` tag, demo verification) | `release/v1.0.0` | ⏳ Pending |

---

## 3. Architectural Invariants (Non-Negotiable)

1. **Integer Paisa Currency:** All fares are calculated and stored in integer paisa ($1\text{ BDT} = 100\text{ paisa}$). No floating point math for currency. Division by 100 occurs exclusively at UI presentation boundary.
2. **Seat Capacity & Concurrency Guard:** Capacity is strictly enforced via database transactions with row-level locking (`SELECT ... FOR UPDATE`). No check-then-write race condition allowed.
3. **Ride Lifecycle State Machine:** Status transitions must pass through a single, centralized state-machine service. Endpoints never mutate `status` directly.
4. **Append-Only Audit Trail:** Every lifecycle transition logs an immutable entry to `STATUS_HISTORY`.
5. **No Premature Infrastructure in MVP:** No Redis, Kafka, Kubernetes, or microservices in running code. Scaling strategies are documented in README / architecture docs only.
6. **Strict 60/30/10 Palette & Typography Triad:**
   * 60% Mist Sage (`#F3F5F2`), 30% Deep Harbor (`#123B3D`), 10% Signal Amber (`#E8A33D`).
   * Fraunces (Headings), IBM Plex Sans (Body), Space Grotesk with `tabular-nums` (Data).
   * Zero emojis, no button arrow suffixes (`→`), no decorative pill clusters.

---

## 4. Frontend Component Registry (Reusable & Scalable)

All repetitive UI elements must be encapsulated in reusable, typed components under `frontend/components/ui/`:

| Component | File Path | Props / Variants | Adherence to DESIGN.md |
|---|---|---|---|
| `Button` | `frontend/components/ui/Button.tsx` | `variant`: `'primary' \| 'accent' \| 'secondary' \| 'destructive'`; `size`: `'sm' \| 'md' \| 'lg'`; `loading`, `disabled` | 4px radius, Deep Harbor / Signal Amber / Line border |
| `Input` | `frontend/components/ui/Input.tsx` | `label`, `error`, `helperText`, `id`, standard input HTML props | Sentence case label above field, 4px radius, 1px line border, error red |
| `Heading` | `frontend/components/ui/Heading.tsx` | `level`: `1 \| 2 \| 3 \| 'display'`; `subtitle` | Fraunces 600 for h1/h2, IBM Plex Sans 600 for h3 |
| `StatusDot` | `frontend/components/ui/StatusDot.tsx` | `status`: `'success' \| 'warning' \| 'error' \| 'info'`; `label` | 8px dot + text label, semantic palette colors |
| `SeatBadge` | `frontend/components/ui/SeatBadge.tsx` | `taken`: number, `capacity`: number | Outlined hairline pill (not filled), Space Grotesk tabular figures |
| `Card` | `frontend/components/ui/Card.tsx` | `surface`: `'canvas' \| 'raised'`; `padding`: `'sm' \| 'md' \| 'lg'` | 12px radius, 1px line border, no resting shadow |
| `DataDisplay` | `frontend/components/ui/DataDisplay.tsx` | `value`: string \| number, `label`?: string, `unit`?: string, `size`: `'sm' \| 'lg'` | Space Grotesk with `tabular-nums` |

---

## 5. Backend Module Architecture

```
backend/src/
├── app/
│   ├── config/              # Environment config (Port 5000, JWT, DB URL)
│   ├── middlewares/         # authMiddleware, validateRequest, errorHandler
│   ├── modules/
│   │   ├── auth/            # Auth controller, service, routes, validation schemas
│   │   ├── user/            # User profiles & role queries
│   │   ├── tesla/           # Tesla vehicle status, online/offline toggle
│   │   ├── ride/            # Ride requests, fare estimation, corridor matching
│   │   └── pool/            # Pool management, concurrency seat locking
│   ├── utils/
│   │   ├── prisma.ts        # Singleton Prisma client instance
│   │   ├── fareCalculator.ts# Deterministic integer paisa fare logic
│   │   ├── stateMachine.ts  # Lifecycle validation and transition guards
│   │   └── zoneMatrix.ts    # Fixed Dhaka zone distance lookup table
│   ├── app.ts               # Express configuration & middleware pipeline
│   └── server.ts            # Entrypoint listener
└── tests/                   # Integration and concurrency test suites
```

---

## 6. Implementation Ledger

* **2026-09-27 — Phase 0 Completed:**
  * Configured monorepo workspaces for `backend` and `frontend`.
  * Set up Docker Compose for PostgreSQL 16, backend API (port 5000), frontend Next.js (port 3000).
  * Built complete Prisma schema with all 6 tables, relations, and enums.
  * Verified backend TypeScript compilation and Jest/Supertest suite.
  * Configured Google Fonts (Fraunces, IBM Plex Sans, Space Grotesk) and Tailwind v4 design tokens in `frontend`.
  * Generated architecture diagrams and ERD in `/docs`.
* **2026-09-27 — Phase 1 Completed:**
  * Updated `DESIGN.md` with **Section 10: Reusable Component Standards**.
  * Developed production-ready component suite under `frontend/components/ui/` (`Button`, `Input`, `Heading`, `StatusDot`, `SeatBadge`, `Card`, `DataDisplay`).
  * Implemented backend authentication module (`AuthService`, `AuthController`, `auth.routes`):
    * `POST /api/auth/passenger/signup` — Registers passenger, hashes password with bcrypt, issues JWT.
    * `POST /api/auth/driver/signup` — Transactionally registers driver and creates associated Tesla vehicle (default 3 seats for Bullet).
    * `POST /api/auth/login` — Authenticates credentials, returns JWT with role and vehicle metadata.
    * `GET /api/auth/me` — Protected endpoint returning verified user details.
  * Implemented JWT verification (`verifyToken`) and Role-Based Access Control (`requireRole`).
  * Built test seed script `backend/prisma/seed.ts` featuring the complete cast: Jashim (Bullet), Nusrat, Rafiq, Shirin.
  * Implemented and executed 13 integration tests in `backend/tests/auth.test.ts` (all passed).
  * Developed frontend authentication views at `/login` and `/register` using typed reusable components and DESIGN.md tokens.
  * Created frontend API client & auth storage helper in `frontend/lib/api.ts`.
  * Verified 100% clean production builds for both backend and frontend.
