# Oi Tesla — Architecture & System Overview

This document provides visual references and diagrams for the Oi Tesla platform architecture.

For full technical specifications, see [ARCHITECTURE.md](../ARCHITECTURE.md).

---

## High-Level System Architecture

```mermaid
flowchart LR
    subgraph Client ["Client Layer"]
        Browser["User Browser\n(Desktop & Mobile 360px+)"]
    end

    subgraph Frontend ["Next.js App Router (Port 3000)"]
        PassengerApp["Passenger Flow\n(Request, Fare, Live Tracking)"]
        DriverApp["Driver Flow\n(Feed, Accept, Pool Status)"]
        AuthPages["Shared Auth Pages\n(JWT in HTTP-only/Storage)"]
    end

    subgraph Backend ["Express.js API (Port 5000)"]
        AuthMW["JWT & RBAC Middleware"]
        RideCtrl["Ride Request & Fare Service"]
        PoolMgr["Pooling & Corridor Matcher"]
        LockGuard["Concurrency Guard\n(SELECT ... FOR UPDATE)"]
        StateEngine["Ride Lifecycle State Machine"]
    end

    subgraph DataStore ["PostgreSQL Database (Port 5432)"]
        UserTable[(USERS)]
        TeslaTable[(TESLAS)]
        PoolTable[(POOLS)]
        RequestTable[(RIDE_REQUESTS)]
        FareTable[(FARES)]
        AuditTable[(STATUS_HISTORY)]
    end

    Browser -->|HTTPS / UI Interaction| Frontend
    Frontend -->|REST / JSON (Polling 3-5s)| Backend
    Backend -->|Prisma Client / Transactions| DataStore
```

---

## Core System Boundaries & Responsibilities

| Subsystem | Boundary | Primary Responsibility |
|---|---|---|
| `/frontend` | Next.js App Router, React 19, Tailwind CSS v4 | User flows (Passenger booking, Driver controls), 60/30/10 design system, state polling |
| `/backend` | Node.js, Express.js 5, TypeScript | Auth validation, matching logic, row-level locking, fare calculation, state machine |
| Database | PostgreSQL 16 | Relational consistency, foreign keys, row locking, append-only history audit trail |
