# RULES.md — Workflow, Commit & Testing Rules

## 1. Git Workflow

Long-lived branches: `master`, `pre-release`, `release/<version>`.
Feature work: `feature/*` (e.g. `feature/passenger-auth`, `feature/tesla-pooling`, `feature/driver-flow`).

Flow:
1. Build one logical change on its feature branch, with incremental commits.
2. Merge into `master` when it works.
3. Once MVP features are integrated, cut `pre-release` for integration fixes, docs, and deployment checks.
4. Cut `release/v1.0.0` from `pre-release` — this is the version shown in the demo video/deployment.

The history is inspected as part of the evaluation: a perfect final repo with a meaningless history scores **weaker** than a good repo showing a real engineering journey. Do not squash the story away.

---

## 2. Commit Message Rules

Format: `<type>(<scope>): <short description>`

Types: `feat` / `fix` / `refactor` / `test` / `docs` / `chore` / `build`

One commit = one understandable logical change. Avoid vague messages ("update", "changes", "fix", "final", "latest", "working now", "asdf") and avoid fifty meaningless micro-commits just to satisfy the rule — the goal is a useful history, not git theatre.

Examples:
```
feat(auth): add passenger login endpoint
feat(pool): enforce Bullet's seat capacity
fix(pool): prevent overbooking available seats
build(docker): add compose setup for api and postgres
```

---

## 3. AI Usage Policy

AI tools (ChatGPT, Claude, Copilot, Cursor, documentation, Stack Overflow, etc.) are explicitly allowed and normal engineering tools — do not hide their use. Scoring is on engineering understanding, not "least AI used."

**Non-negotiable:** if AI writes it, you still own it. Be ready to explain, debug, redesign, or modify any part live — what the code does, why the architecture/database look the way they do, how auth and pooling/capacity are enforced, how the app fails, and how you'd change it.

**README AI Usage section must include:**
- Which tools were used, and for what
- One accepted suggestion
- One rejected/changed suggestion, and why

---

## 4. Testing Requirements

Meaningful tests, not coverage-chasing. Must cover:

1. Bullet's capacity can never be exceeded
2. Invalid state transitions are rejected
3. Nusrat's and Rafiq's pooled fares calculate correctly (matches the hand-worked example in ARCHITECTURE.md §4)
4. Users can't modify another user's ride
5. Cancellation rules hold
6. Two concurrent requests can't corrupt pool capacity (the Nusrat/Shirin seat race — run as a real concurrent-request integration test, not a unit-mocked stand-in)

### The Concurrency Problem (must be reasoned through, not just tested)

Bullet has 1 seat left. Nusrat and Shirin both try to claim it at nearly the same instant, and both initially see one seat available. The MVP doesn't need a distributed solution, but the design must consider data consistency: document how it's handled now (see ARCHITECTURE.md §5 — row-level locking transaction), and what would change at larger scale (see PHASES.md — bonus scaling section). Expect this in the interview.

---

## 5. README Must Cover (minimum)

- Summary, problem statement, features implemented, screenshots/GIFs
- Architecture diagram and ERD/database diagram
- Tech stack, project structure, prerequisites
- Environment variables (`.env.example`, never real secrets)
- Local setup, Docker instructions, migration/seed instructions
- How to run frontend/backend and tests; demo credentials
- Deployment URL, API overview, key decisions/trade-offs, known limitations, next improvements
- AI Usage section and demo video link

---

## 6. Why the Details Matter (keep the cast consistent)

Seed data, tests, and the demo must all use the same cast (Jashim/Bullet/Nusrat/Rafiq/Shirin, or an equivalent cast used the same way throughout) — this is a deliberate design in the brief to make it hard to fake end-to-end understanding. A git history that jumps from an empty repo straight to a finished app doesn't match the process this document lays out. Be ready to talk through your own choices — schema, state transitions, the concurrency handling — in the demo video and, if it gets that far, in an interview.
