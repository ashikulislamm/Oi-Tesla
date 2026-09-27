# AGENTS.md — Guidance for AI Coding Agents Working in This Repo

This file is for any AI agent (Claude Code, Copilot, Cursor, etc.) operating on this codebase. Human contributors: see ARCHITECTURE.md, REQUIREMENTS.md, PHASES.md, RULES.md for the full spec — this file only adds agent-specific operating rules.

---

## 1. Source of Truth

Before making changes, read in this order:
1. `REQUIREMENTS.md` — what must exist and why (features, MVP scope, mandated stack)
2. `ARCHITECTURE.md` — how it's built (data model, fare model, concurrency handling, stack justification)
3. `PHASES.md` — the order of work and which feature branch a change belongs on
4. `RULES.md` — git workflow, commit format, testing bar, AI-usage disclosure requirements
5. `DESIGN.md` — this is where we keep design decisions and ideas. Read this to understand the design decisions and ideas behind the project.

If a requested change conflicts with these files, flag the conflict rather than silently resolving it — the human owner must be able to explain every decision in an interview, so silent architectural drift is a real cost here, not a convenience.

---

## 2. Repo Structure (expected)

```
/backend      Express.js backend (routes, controllers, services, prisma schema/migrations)
/frontend     Next.js frontend (App Router)
/docs         architecture diagram, ERD, any exported images
docker-compose.yml
.env.example
README.md
```

Do not restructure this layout without updating ARCHITECTURE.md's diagram references.

---

## 3. Non-Negotiable Constraints

- **Stack is fixed:** Next.js, Express.js, PostgreSQL. Do not swap in a different framework/DB "for convenience."
- **No premature infra:** no microservices, Kafka, Kubernetes, Redis, or queues in the MVP build. If a task seems to need one of these, stop and note it belongs in the PHASES.md bonus/scaling section instead, not in the running app.
- **Money is integer paisa**, never float/decimal, anywhere fare math happens.
- **Seat capacity enforcement must go through a transaction with row-level locking** (`SELECT ... FOR UPDATE`), not a check-then-write race. See ARCHITECTURE.md §5. Never "fix" the concurrency test by adding an artificial delay or mock — the fix must be the real transactional guard.
- **State transitions** must go through the single state-machine function/module — never update `status` directly from a route handler.
- **Cast consistency:** seed data, fixtures, and tests use Jashim/Bullet/Nusrat/Rafiq/Shirin. Do not introduce `user1`/`driver1`-style placeholders.

---

## 4. Git & Commit Conventions (enforced)

- Work on the correct `feature/*` branch for the phase in PHASES.md — do not commit multiple unrelated features to one branch.
- Commit format: `<type>(<scope>): <short description>` (`feat`/`fix`/`refactor`/`test`/`docs`/`chore`/`build`). One commit = one logical change. Never generate commits like "update", "fix stuff", "final", "wip".
- Never squash away the history of a fix (e.g. the naive-check → transactional-fix sequence in pooling) — that sequence is intentionally part of the evaluation story.
- Do not merge to `master` with failing tests.

---

## 5. Testing Bar

Any change touching pooling, fares, or auth must keep these passing (see RULES.md §4):
1. Capacity never exceeded
2. Invalid state transitions rejected
3. Pooled fares match the hand-worked Nusrat/Rafiq example
4. Cross-user access denied
5. Cancellation rules enforced
6. Concurrent seat claims don't corrupt capacity (real concurrent integration test, not mocked)

If an agent-generated change would require weakening or deleting one of these tests to pass, stop and surface that instead of editing the test.

---

## 6. Disclosure Requirement

Every AI-assisted change of consequence should be traceable: when generating a non-trivial chunk of logic (matching rule, fare calc, concurrency guard, state machine), leave the human a short note (commit body or PR description) of what was generated vs. hand-modified, so the README's "AI Usage" section (one accepted suggestion, one rejected/changed suggestion) can be written accurately. The human, not the agent, must be able to defend every line live — do not generate code the stated owner hasn't reviewed and understood.

---

## 7. What Not to Build

- No real map/routing integration — zone lookup table only.
- No real payment gateway — cash or simulated TeslaPay flag only.
- No ratings, admin dashboards, or WebSocket layer unless explicitly requested beyond MVP (see REQUIREMENTS.md §7 "Nice-to-have").
- No speculative scaling infrastructure in the running app — that reasoning belongs in PHASES.md's bonus section, as a written design, not code.
