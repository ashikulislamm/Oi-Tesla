# DESIGN.md — Oi Tesla Design System

This is the single source of truth for visual design decisions across the passenger app, driver app, and any admin/marketing surfaces. It exists so the UI doesn't drift into generic, templated "AI dashboard" territory — every choice below is made *for this product*, not pulled from a default kit.

**Product context this system is grounded in:** an EV ride-pooling app for Dhaka commuters. The visual language should feel like *purpose-built transit infrastructure* — precise, dependable, quietly electric — not like a generic SaaS analytics dashboard with a rideshare logo pasted on.

---

## 1. Design Philosophy

- **Clean, minimal, modern — with a classic backbone.** Favor whitespace, restraint, and a stable grid over decoration. Nothing should look inserted just to fill space.
- **User-friendly first.** Every screen answers "where is my ride, and what happens next" without requiring the user to interpret icons or color-coded chips.
- **No AI-generated tells.** No unnecessary emojis, no decorative badge/pill clusters, no tracked-out ALL-CAPS eyebrow labels, no middle-dot metadata strings, no arrow (→) suffixes on buttons, no identical rounded-card-plus-soft-shadow treatment applied to everything regardless of hierarchy.
- **Spend boldness in one place per screen.** One clear focal point (the live ride status, a fare number, a map) — everything else recedes and stays disciplined.
- **Numbers are content, not decoration.** Fares, ETAs, seat counts, and distances are the actual product; typography and layout exist to make them legible at a glance, not to be "styled."

---

## 2. Color System — 60/30/10

Three brand colors, used in a strict 60% / 30% / 10% ratio across any given screen. This ratio governs **area of use**, not literal pixel-counting — think "what a person's eye rests on most."

| Role | Name | Hex | Ratio | Where it's used |
|---|---|---|---|---|
| **Secondary** | Mist Sage | `#F3F5F2` | **60%** | Page backgrounds, surfaces, cards' resting state — the dominant neutral the whole app sits on |
| **Primary** | Deep Harbor | `#123B3D` | **30%** | Navigation, headers, primary buttons, active states, map chrome, the brand's core identity color |
| **Accent** | Signal Amber | `#E8A33D` | **10%** | Primary CTAs ("Confirm ride", "Accept"), live-status indicators, fare highlight, the *one* thing per screen that should pull the eye |

### Supporting neutrals (not part of the 60/30/10, used for text & structure)

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#1B211F` | Body text (a warm-black with a faint green undertone — never pure `#000` or the generic `#0B0B0B`/`#111`) |
| `--ink-muted` | `#57615D` | Secondary text, captions, timestamps |
| `--line` | `#DDE3DF` | Hairline borders, dividers, table rules |
| `--surface-raised` | `#FFFFFF` | Elevated surfaces (modals, popovers) — used sparingly against Mist Sage, not as the default card color |

### Semantic states (derived from the palette, not arbitrary traffic-light colors)

| State | Hex | Notes |
|---|---|---|
| Success / Completed | `#2E6E4E` | A muted forest green in the same temperature family as Deep Harbor |
| Warning / Driver arriving | `#E8A33D` | Reuses Signal Amber — don't introduce a fourth hue for "warning" |
| Error / Cancelled | `#B23A2E` | A muted brick red, never a saturated pure red |
| Info | `#123B3D` at 70% opacity | Reuses Primary — no separate "info blue" |

### Usage rules

- **Never** use Signal Amber for large fills (backgrounds, full-width banners). It exists to be found instantly at small area — a button, a status dot, a fare figure.
- Deep Harbor is the only color used for interactive chrome (nav bar, active tab, primary button fill). Don't let Mist Sage and Deep Harbor swap roles between screens.
- Status is communicated primarily through **text + a small dot or underline in the semantic color**, not full colored pill badges. If a badge is unavoidable (e.g. seat count), give it a hairline border and no fill, not a saturated color chip.
- Maintain WCAG AA contrast: `--ink` on Mist Sage passes; white text only goes on Deep Harbor or the semantic colors, never on Signal Amber (amber-on-white or ink-on-amber only).

---

## 3. Typography — 3 Fonts

| Role | Typeface | Source | Why this one |
|---|---|---|---|
| **Heading** | **Fraunces** (weights 400, 600, and the "soft" optical variant) | Google Fonts | A serif with real character — gives the brand a "built by a real transit authority, not a generic startup" gravitas without tipping into the cliché warm-cream-and-terracotta editorial look. Reserve italics for emphasis only, never for the default heading style. |
| **Body** | **IBM Plex Sans** (400, 500, 600) | Google Fonts | Engineered, legible, slightly technical personality that suits a mobility product — distinct from the Inter/Poppins default that appears on nearly every generated SaaS UI. Excellent at small sizes for dense data (ride lists, history tables). |
| **Accent (numeric/data)** | **Space Grotesk** (500, tabular figures enabled) | Google Fonts | Used *only* for numerals that matter functionally: fares, distances, seat counts, countdowns, timestamps in the live-status view. Its geometric shapes and true tabular figures make numbers scannable and stable when they update in place. Never used for body copy, labels, or headings — this is a functional choice for a numbers-heavy product, not a decorative flourish. |

### Type scale (major-third-ish, not a default Tailwind scale)

| Token | Size / Line-height | Font | Use |
|---|---|---|---|
| `display` | 40px / 46px | Fraunces 600 | Rare — marketing/landing hero only |
| `h1` | 28px / 34px | Fraunces 600 | Page titles ("Your ride", "Bullet — Jashim") |
| `h2` | 20px / 26px | Fraunces 600 | Section headers within a page |
| `h3` | 16px / 22px | IBM Plex Sans 600 | Card/subsection titles (sans, not serif — keeps dense UI from feeling overwrought) |
| `body` | 15px / 22px | IBM Plex Sans 400 | Default running text |
| `body-sm` | 13px / 18px | IBM Plex Sans 400 | Captions, helper text, timestamps |
| `data-lg` | 32px / 36px | Space Grotesk 500, tabular-nums | The fare total, the big number on a screen |
| `data-sm` | 15px / 20px, tabular-nums | Space Grotesk 500 | Inline numbers — seats left, km, minutes |

### Typography rules

- Two font families for text (Fraunces for headings, IBM Plex Sans for body) plus one functional numeral face. Never introduce a fourth.
- Line length for body text: 80 characters max.
- No all-caps labels. Section labels use normal sentence case at `body-sm` weight 600, not tracked-out caps.
- No single-word-in-the-headline accenting (don't bold or recolor one word in an otherwise plain heading).
- Numbers that update live (fare, ETA countdown) must use `data-lg`/`data-sm` with tabular figures so digits don't jitter the layout as they change.

---

## 4. Spacing & Layout

### Base unit: 8px grid

All spacing, padding, and layout dimensions are multiples of 8 (with 4px allowed only for icon-to-label micro-gaps).

| Token | Value | Use |
|---|---|---|
| `space-1` | 4px | Icon-to-text gap |
| `space-2` | 8px | Tight internal padding (chips, small buttons) |
| `space-3` | 12px | Default gap between related inline elements |
| `space-4` | 16px | Card internal padding, form field gaps |
| `space-6` | 24px | Gap between distinct components |
| `space-8` | 32px | Section padding (top/bottom of a page section) |
| `space-12` | 48px | Major section breaks |
| `space-16` | 64px | Page-level top padding on desktop |

### Layout

- **Container max-width:** 1120px for dashboard/app views; 720px for reading-heavy content (history detail, receipts).
- **Grid:** 12-column on desktop (≥1024px), 4-column on mobile (<640px), 8-column tablet — 24px gutters throughout.
- **Alignment:** left-aligned for all app/dashboard content (this is a functional tool, not a marketing page trying to feel spacious with center alignment). Center alignment is reserved only for empty states and modals.
- **Border radius:** two values only — `4px` for controls (buttons, inputs, small chips) and `12px` for containers (cards, modals). Never apply the same radius to everything regardless of hierarchy — that's the generic "SaaS card kit" tell.
- **Elevation:** one shadow, used sparingly, only on truly floating elements (modals, dropdowns, the "driver arriving" toast): `0 4px 16px rgba(18, 59, 61, 0.12)` — tinted with the Primary color, not a generic grey `rgba(0,0,0,.1)`. Resting cards use a 1px `--line` border instead of a shadow.

---

## 5. Branding

- **Name treatment:** "Oi Tesla" is set in Fraunces 600, Deep Harbor on Mist Sage (or Mist Sage on Deep Harbor in the nav bar) — never a gradient wordmark.
- **Tone of voice:** plain, direct, active voice. Buttons say exactly what happens: "Confirm ride," "Accept," "Cancel ride" — not "Submit" or "Proceed." A button's action word carries through to its confirmation ("Ride confirmed," not a generic "Success!").
- **Iconography:** a single icon set (recommend Phosphor or Lucide, regular weight only — no mixing filled and outline styles). Icons illustrate function (a seat, a pin, a battery) — never decorative or emoji-based. No emoji anywhere in the product UI, including empty states and notifications.
- **Photography/illustration:** if used, real-feeling — Dhaka streets, EVs, not stock "diverse people high-fiving in an office" imagery. For the MVP, prefer no illustration over a generic one.
- **Empty and error states:** written in the interface's voice, stating what happened and what to do next — never an apologetic tone, never a mascot illustration.

---

## 6. Component Rules

- **Buttons:** solid Deep Harbor fill for primary actions, Signal Amber fill reserved for the single highest-priority action on a screen (e.g. "Confirm ride" on the request screen). Secondary buttons are outline-only (1px `--line`, `--ink` text) — never a second solid color.
- **Cards:** Mist Sage or white surface, 1px `--line` border, 12px radius, no shadow at rest. Used for ride history entries, pool member lists — not chopped indiscriminately into everything.
- **Status indicators:** a small 8px dot in the semantic color plus a text label ("Driver arrived") — not a filled pill/badge. Reserve pill badges for the seat-count indicator only (e.g. "2/3 seats"), styled as outline, not filled.
- **Forms:** labels above fields, sentence case, no floating labels (they hurt legibility at a glance for a task-focused app like this). Inline validation messages in Error red, appearing directly under the field.
- **Tables/lists (ride history, driver's passenger list):** IBM Plex Sans for text columns, Space Grotesk tabular figures for numeric columns (fare, distance), right-aligned numbers.
- **Maps/zone visualizations:** Deep Harbor for routes/pins, Signal Amber only for the active/selected pin — not a rainbow of pin colors per status.

---

## 7. Motion

- One deliberate motion moment per flow, not motion on every element. Examples: the fare number animating from estimate to final on ride completion; the status dot pulsing gently while "matched" is pending a driver response.
- No fade-and-slide-up entrance animations on every card/section — this is a generic tell and adds no information here.
- Motion that responds to a person's action (confirming a ride, a seat filling up) is welcome because it shows *what changed*. Motion that just decorates page load is not.
- Respect `prefers-reduced-motion` — all animation must have a static fallback.

---

## 8. Quality Floor (non-negotiable, unannounced)

- Responsive down to a 360px-wide mobile viewport.
- Visible keyboard focus states on every interactive element (2px Deep Harbor outline, offset 2px).
- WCAG AA contrast minimum everywhere text appears.
- Every icon-only control has an accessible label.
- Dark mode is out of scope for the MVP — do not half-implement it.

---

## 9. Explicit Anti-Patterns (do not do these)

- ❌ Warm cream background (`#F4F1EA`-adjacent) with a high-contrast serif and a terracotta accent — the most common AI-generated look; this system deliberately uses a cooler sage neutral and amber, not terracotta, to avoid it.
- ❌ Near-black background with a single neon accent.
- ❌ Identical rounded cards everywhere with the same soft grey drop shadow regardless of hierarchy.
- ❌ Tracked-out ALL-CAPS eyebrow labels above every heading.
- ❌ Meta strings joined with middle dots ("Banani · 3 seats · 12 min").
- ❌ A "→" appended to link/button text.
- ❌ Monospace font used for small data labels (numerals use Space Grotesk, a proportional grotesk, not monospace).
- ❌ Emoji anywhere in product UI.
- ❌ Numbered "01 / 02 / 03" markers unless the content is genuinely a sequence (e.g. the ride lifecycle steps — that's a legitimate use; a features list is not).
- ❌ Badge/pill clusters used decoratively rather than to convey one specific piece of state.

---

## 10. Reusable Component Standards (Production & Scalability Architecture)

To ensure frontend code remains scalable, maintainable, and strictly aligned with this design system, all repeated UI elements must be encapsulated in reusable, typed React components located under `frontend/components/ui/`. Direct ad-hoc styling of raw HTML elements (e.g. ad-hoc `<button>` or `<input>`) across views is prohibited.

### 10.1 Component Catalog & Contracts

#### 1. `<Button>` (`frontend/components/ui/Button.tsx`)
* **Variants:**
  * `primary` (Default): Solid Deep Harbor (`#123B3D`), white text, hover opacity 95%. Used for standard actions.
  * `accent`: Solid Signal Amber (`#E8A33D`), dark `--ink` (`#1B211F`) text. Reserved strictly for the single highest-priority CTA on a view ("Confirm ride", "Accept pool").
  * `secondary`: Outline only (1px `--line` border, transparent background, `--ink` text, hover bg white/60%).
  * `destructive`: Subtle `--status-error` border/text or muted red fill for cancellations.
* **Props:** `variant`, `size ('sm' | 'md' | 'lg')`, `isLoading` (shows accessible spinner, disables clicks), `fullWidth` (boolean), `disabled`.
* **Rules:** `4px` border-radius only; never append arrow suffixes ("→"); text in active voice.

#### 2. `<Input>` & `<Select>` (`frontend/components/ui/Input.tsx`, `Select.tsx`)
* **Structure:** Vertical stack — Sentence-case label above field $\rightarrow$ Control $\rightarrow$ Helper text or inline error message.
* **Styling:** 1px `--line` border, `4px` radius, background `--surface-raised` (`#FFFFFF`), text `--ink`.
* **Focus State:** 2px solid Deep Harbor outline, offset 2px.
* **Error State:** 1px solid `--status-error` (`#B23A2E`) with error text directly underneath in `body-sm`.
* **Rules:** No floating labels. Every input must have an accessible `id` tied to its `<label>`.

#### 3. `<Heading>` (`frontend/components/ui/Heading.tsx`)
* **Variants:**
  * `display`: 40px / 46px, Fraunces 600, Deep Harbor. (Hero sections only).
  * `h1`: 28px / 34px, Fraunces 600, Deep Harbor. (Page titles).
  * `h2`: 20px / 26px, Fraunces 600, Deep Harbor. (Section headers).
  * `h3`: 16px / 22px, IBM Plex Sans 600, Deep Harbor / Ink. (Card and subsection headers).
* **Props:** `level` (`'display' | '1' | '2' | '3'`), `subtitle` (optional secondary text in `--ink-muted`), `as` (optional HTML tag override).
* **Rules:** Never apply tracked-out ALL-CAPS; never recolor or bold a single arbitrary word in a headline.

#### 4. `<StatusDot>` & `<SeatBadge>` (`frontend/components/ui/StatusDot.tsx`, `SeatBadge.tsx`)
* **`<StatusDot>`:** 8px circular dot in semantic color (`--status-success`, `--status-warning`, `--status-error`, `--deep-harbor`) paired with a text label in `body-sm`. Used for ride lifecycle states.
* **`<SeatBadge>`:** Hairline outline pill (1px `--line`), transparent background, displaying `X/Y seats` using Space Grotesk tabular figures. Never filled with solid saturated color.

#### 5. `<Card>` (`frontend/components/ui/Card.tsx`)
* **Styling:** `12px` border radius, 1px `--line` border, background `--surface-raised` or `--mist-sage`.
* **Elevation:** Zero drop shadow at rest. Tinted shadow (`0 4px 16px rgba(18, 59, 61, 0.12)`) reserved strictly for active floating state or popovers.
* **Props:** `surface ('canvas' | 'raised')`, `padding ('sm' | 'md' | 'lg')`, `interactive` (subtle border highlight on hover if clickable).

#### 6. `<DataDisplay>` (`frontend/components/ui/DataDisplay.tsx`)
* **Purpose:** Formatting and rendering numeric product figures (fares, distances, seat counts, durations).
* **Font:** Space Grotesk with `tabular-nums` (`font-data`) to prevent numeric jitter during updates.
* **Props:** `value` (numeric or formatted string), `unit` (e.g. "BDT", "km", "min"), `size ('sm' | 'lg')`, `caption` (optional).

### 10.2 Quality & Code Standards for UI Components
* **Type Safety:** All component props must be fully typed using TypeScript interfaces.
* **Theme Tokens Only:** Components must consume CSS custom properties or `@theme` tokens (`var(--deep-harbor)`, `var(--mist-sage)`), never hardcoded hex codes.
* **Accessibility:** Native keyboard focus indicators (`focus-visible:ring-2 focus-visible:ring-[var(--deep-harbor)]`), WCAG AA contrast, and `aria-live` for updating data.

