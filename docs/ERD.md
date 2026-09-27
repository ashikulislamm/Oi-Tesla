# Oi Tesla — Entity-Relationship Diagram (ERD)

This document visualizes the complete database schema and relational constraints.

For architectural decisions, refer to [ARCHITECTURE.md](../ARCHITECTURE.md#3-data-model-erd).

---

## Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ RIDE_REQUESTS : "makes (as passenger)"
    USERS ||--o| TESLAS : "owns (as driver)"
    TESLAS ||--o{ POOLS : "serves"
    POOLS ||--o{ RIDE_REQUESTS : "contains"
    RIDE_REQUESTS ||--o| FARES : "has (1:1)"
    RIDE_REQUESTS ||--o{ STATUS_HISTORY : "logs"
    POOLS ||--o{ STATUS_HISTORY : "logs"

    USERS {
        uuid id PK
        string name
        string email UK
        string password_hash
        enum role "passenger | driver"
        timestamp created_at
    }

    TESLAS {
        uuid id PK
        uuid driver_id FK "UK (1 driver = 1 tesla)"
        string plate_or_name
        int capacity "CHECK > 0"
        bool is_online
        timestamp created_at
    }

    POOLS {
        uuid id PK
        uuid tesla_id FK
        enum status "OPEN | FULL | IN_PROGRESS | COMPLETED | CANCELLED"
        int seats_taken
        string pickup_zone
        timestamp created_at
        timestamp updated_at
    }

    RIDE_REQUESTS {
        uuid id PK
        uuid passenger_id FK
        uuid pool_id FK "nullable until matched"
        string pickup_zone
        string destination_zone
        int seats_requested
        enum status "REQUESTED | MATCHED | DRIVER_ARRIVED | STARTED | COMPLETED | CANCELLED"
        timestamp requested_at
        timestamp updated_at
    }

    FARES {
        uuid id PK
        uuid ride_request_id FK "UK"
        int base_fare_paisa
        int distance_charge_paisa
        int pool_discount_paisa
        int total_fare_paisa
        enum payment_method "CASH | TESLAPAY"
        bool paid
    }

    STATUS_HISTORY {
        uuid id PK
        uuid ride_request_id FK "nullable"
        uuid pool_id FK "nullable"
        string from_status
        string to_status
        timestamp changed_at
        string note
    }
```

---

## Invariant Rules Enforced in Schema
1. **Integer Paisa Currency:** All monetary columns (`base_fare_paisa`, `distance_charge_paisa`, `pool_discount_paisa`, `total_fare_paisa`) are stored strictly as integers.
2. **Capacity Bounds:** `TESLAS.capacity > 0`. `POOLS.seats_taken <= TESLAS.capacity` guarded via transactional locking (`SELECT ... FOR UPDATE`).
3. **Audit Immutability:** `STATUS_HISTORY` records every state transition with timestamps and actor/system notes.
