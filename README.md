# Oi Tesla — EV Ride-Pooling MVP

> Purpose-built electric vehicle (EV) ride-pooling platform for Dhaka commuters.

---

## 1. Overview & Problem Statement

Nusrat wants to travel from Banani to Mohakhali. Rafiq wants to travel from Banani to Gulshan 1 roughly two minutes later. Jashim drives **Bullet**, a 3-seat electric Tesla. Rather than booking two separate vehicles, Oi Tesla enables passengers along compatible corridors to share a single Tesla ride, dynamically allocating capacity, ensuring zero overbooking under high concurrency, calculating deterministic fares, and maintaining an append-only audit trail of the ride lifecycle.

### The Cast
* **Jashim** — Driver operating **Bullet** (fixed capacity: 3 seats).
* **Nusrat** — Passenger traveling Banani $\rightarrow$ Mohakhali ($4.5\text{ km}$, pooled).
* **Rafiq** — Passenger traveling Banani $\rightarrow$ Gulshan 1 ($3.0\text{ km}$, pooled).
* **Shirin** — Passenger attempting to claim the remaining seat concurrently.

---

## 2. System Architecture & ERD

* **System Overview:** [docs/ARCHITECTURE_DIAGRAM.md](docs/ARCHITECTURE_DIAGRAM.md) and [ARCHITECTURE.md](ARCHITECTURE.md)
* **Data Model & Schema:** [docs/ERD.md](docs/ERD.md)
* **Design System & Palette:** [DESIGN.md](DESIGN.md)

---

## 3. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4 | SSR/routing, clean client architecture, responsive mobile-first UI down to $360\text{px}$ |
| **Backend** | Node.js, Express.js 5, TypeScript | Minimal ceremony, clear layer boundaries, easily explainable interview code |
| **Database** | PostgreSQL 16 via Prisma ORM | Relational integrity, foreign keys, row-level locking (`SELECT ... FOR UPDATE`) |
| **DevOps** | Docker Compose | Single-command multi-container deployment (`backend`, `frontend`, `db`) |

---

## 4. Project Directory Structure

```
.
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── app/              # Config, middlewares, modules (routes/controllers/services)
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server entrypoint (Port 5000)
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # Next.js App Router frontend
│   ├── app/                  # App Router pages and layout (Port 3000)
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docs/                     # Visual architecture and ERD documentation
│   ├── ARCHITECTURE_DIAGRAM.md
│   └── ERD.md
├── docker-compose.yml        # Orchestration for backend, frontend, and db
├── .env.example              # Environment variables template
├── ARCHITECTURE.md           # Architecture specification
├── DESIGN.md                 # Design system specification
├── PHASES.md                 # Phased build roadmap
├── REQUIREMENTS.md           # Product and MVP requirements
├── RULES.md                  # Workflow, commit, and testing rules
└── README.md
```

---

## 5. Getting Started

### Prerequisites
* Node.js $\ge 20$
* Docker & Docker Compose (optional for containerized run)
* PostgreSQL 16 (if running locally without Docker)

### Environment Configuration
Copy the template to `.env` in the root:
```bash
cp .env.example .env
```

### Option A: Running with Docker Compose
```bash
docker compose up --build
```
* Frontend: `http://localhost:3000`
* Backend API: `http://localhost:5000`
* PostgreSQL: `localhost:5432`

### Option B: Running Locally for Development
1. Install dependencies:
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

---

## 6. Fare Calculation Model (Hand-Worked Example)

All currency is calculated in **integer paisa** ($1\text{ BDT} = 100\text{ paisa}$) to eliminate floating-point rounding errors.

$$\text{passengerFare} = \text{baseFare} + (\text{distanceChargePerKm} \times \text{distanceKm}) - \text{poolDiscount}$$

* **Base Fare:** $30\text{ BDT} = 3000\text{ paisa}$
* **Distance Rate:** $15\text{ BDT/km} = 1500\text{ paisa/km}$
* **Pool Discount:** $20\%$ flat discount when $2+$ passengers share a vehicle.

### Baseline Calculations
* **Nusrat** (Banani $\rightarrow$ Mohakhali, $4.5\text{ km}$, pooled):
  $$3000 + (1500 \times 4.5) - 20\% = 9750 - 1950 = 7800\text{ paisa } (78\text{ BDT})$$
* **Rafiq** (Banani $\rightarrow$ Gulshan 1, $3.0\text{ km}$, pooled):
  $$3000 + (1500 \times 3.0) - 20\% = 7500 - 1500 = 6000\text{ paisa } (60\text{ BDT})$$

---

## 7. AI Usage Disclosure

Per [RULES.md §3](RULES.md#3-ai-usage-policy):
* **Tools used:** Antigravity AI coding assistant for project scaffolding, schema definition, and architectural alignment.
* **Accepted suggestion:** Transaction-based row-level locking (`SELECT ... FOR UPDATE`) over naive in-memory or check-then-write checks for seat race prevention.
* **Changed suggestion:** Preserved the separate `/backend` and `/frontend` directory layout established by the human developer, adapting configuration and documentation to match.
