# REQUIREMENTS.md — Oi Tesla Ride-Pooling MVP

**Cast (kept consistent across seed data, tests, demo):**
- **Jashim** — driver, owns **Bullet** (3-seat battery Tesla)
- **Nusrat** — passenger, Banani → Mohakhali
- **Rafiq** — passenger, Banani → Gulshan 1 (books ~2 min after Nusrat, overlapping route)
- **Shirin** — passenger, tries to grab the last seat 30s later (drives the concurrency test)

---

## 1. Product Problem

Nusrat wants Banani → Mohakhali. Rafiq wants Banani → Gulshan 1. Jashim's Bullet has 3 seats. Passengers should be able to request a ride and, when it makes sense, share a Tesla with someone else. The driver needs to see who's assigned and what stage the ride is at. Each passenger sees only their own fare/status. Completed rides retain enough history to explain what happened.

No real routing (no Google Maps rebuild) — this is an evaluation of engineering judgment, not mapping.

---

## 2. Features by Actor

### Passenger
- Sign up / sign in
- Request ride: pickup, destination, seats
- See estimated fare before confirming
- Track status: `waiting → matched → in progress → completed/cancelled`
- View ride history
- Cancel while status allows it

### Driver / Tesla
- Sign in; go online / offline
- Own a Tesla with fixed capacity
- See relevant (compatible) pending requests
- Accept a ride / pool
- Mark arrival, start trip, complete trip
- See current passengers/seats and ride history

### Pool / Ride-Split (system logic)
- Multiple requests may share one Tesla
- Occupied seats never exceed capacity
- Each passenger gets an individual fare
- Clear lifecycle; obvious pool membership to all parties

---

## 3. Lifecycle (suggested — may be adjusted if justified)

```
REQUESTED → MATCHED/ACCEPTED → DRIVER_ARRIVED → STARTED → COMPLETED (+ CANCELLED)
```

---

## 4. Geography (kept simple)

- Predefined list of Dhaka areas: Banani, Gulshan, Mohakhali, Dhanmondi, Mirpur, Uttara, Farmgate, Bashundhara, etc.
- Plain lat/long points or a lightweight free map — no paid map API.
- Matching rule must be invented and documented (e.g. same pickup zone or compatible routes), applied consistently to Nusrat/Rafiq's overlapping-but-not-identical trip (see ARCHITECTURE.md §4).

---

## 5. Fare Model (must be hand-testable)

```
passengerFare = baseFare + distanceCharge - poolDiscount
```

- Optional additions: traffic/weather/vehicle rules — but the evaluator must be able to verify the calculation by hand on Nusrat/Rafiq's trip.
- Money storage: integer paisa/poysha vs. decimal — decision and rationale must be documented (see ARCHITECTURE.md §3).
- Payment: cash or simulated TeslaPay wallet. No real payment gateway.

---

## 6. Mandated Technical Scope

| Layer | Requirement | Notes |
|---|---|---|
| Frontend | React or Next.js | Next.js (App Router) recommended for routing/SSR |
| Backend | Node.js | Express, NestJS, Fastify, or other — justify the pick |
| Database | Candidate's choice | Relational (Postgres/MySQL/SQLite) recommended given pooling/capacity needs — justify it |
| Other tooling | Candidate's choice | ORM, validation, auth, test framework, hosting — all justified in README |

**Chosen for this build:** Next.js, Express.js, PostgreSQL (see ARCHITECTURE.md §2 for justification table).

Backend scope: API/resource design, auth, validation, business-logic placement, error handling, ride state transitions, pool capacity enforcement, data consistency, code organization, logging, basic security.

Frontend scope: correct flows/states, clear loading/error/empty states, reasonable component organization, API integration, usability — a simple, clean interface is enough.

Database scope: design schema (users, Teslas/vehicles+capacity, ride requests, pools, pool membership, status/history, fare, optional payment/rating/audit); proper relationships, constraints, indexes, types; be ready to explain every table.

Docker: must run via `docker compose up` — app container(s), DB container, `.env.example`, migrations, seed data (Jashim/Nusrat/Rafiq/Shirin), health checks if possible.

Deployment: free/free-tier only. If no free backend hosting is available, document the constraint and give a reproducible Docker deployment instead. Public deployment preferred.

---

## 7. MVP Definition — What "Done" Means for v1.0.0

Must-have:
1. Auth (passenger + driver roles), JWT
2. Passenger: request ride, fare estimate, live status, history, cancel
3. Driver: online/offline toggle, view/accept requests, advance lifecycle, view pool
4. Pooling: matching rule, capacity enforcement, concurrency-safe seat claim, per-passenger fare
5. Full status-history audit log
6. Dockerized (compose up: backend + frontend + postgres + migrations + seed with the cast)
7. README with architecture diagram, ERD, fare model worked example, AI usage section
8. Tests covering the six required scenarios (see RULES.md §Testing)
9. Public deployment (or documented Docker-only fallback)

Nice-to-have / stretch (not required for MVP): ratings, TeslaPay simulated wallet balance, WebSocket live updates, admin view, map visualization of zones.

---

## 8. Assumptions to Document in README

Section 17 of the brief explicitly allows and expects assumptions where requirements are underspecified. Document each one, implement consistently, and be ready to explain why. Starting list (adjust as you build):

- Distance between zones is a fixed lookup table, not computed.
- Pool matching rule is "same pickup zone + compatible destination corridor" (state the exact rule used).
- One driver = one Tesla (no multi-vehicle drivers in MVP).
- Cancellation allowed up to STARTED, not after.
- Pool discount is a flat percentage, applied only when 2+ occupants share a pool.
- Payment is simulated only — no ledger reconciliation beyond a boolean/amount.

Each assumption should be restated in the demo video with a one-line "why."
