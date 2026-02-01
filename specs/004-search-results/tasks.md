# Tasks: Search Results - Flight List

**Branch**: `004-search-results` | **Date**: 2025-01-30
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

| Metric | Value |
|--------|-------|
| Total Tasks | 26 |
| User Stories | 4 |
| Parallel Opportunities | 8 tasks |
| Estimated Lines | ~550 |

## User Story Mapping

| Story | Priority | Tasks | Independent Test |
|-------|----------|-------|------------------|
| US1 - View Search Results | P1 | T009-T014 | Navigate to `/search?origin=SFO&destination=NRT`, verify 6 flight cards display with airline, duration, times, stops, price |
| US2 - Modify Search from Results | P1 | T015-T017 | On results page, verify compact search bar shows pre-filled criteria, modify and re-search |
| US3 - Filter Flight Results | P2 | T018-T022 | Click filter dropdowns, apply "Nonstop only" filter, verify only nonstop flights display |
| US4 - Select a Flight | P1 | T023-T024 | Hover over flight card (light purple bg), click to select (purple left border) |

---

## Phase 1: Setup

> Foundation: Create data models, mock data, and update search criteria parsing.

- [x] T001 [P] Create Flight and Airline TypeScript interfaces in `frontend/src/app/models/flight.model.ts`
- [x] T002 [P] Create Filter TypeScript interfaces in `frontend/src/app/models/filter.model.ts`
- [x] T003 [P] Create airlines mock data array in `frontend/src/app/mock-data/airlines.data.ts`
- [x] T004 Add `fromQueryParams` function to `frontend/src/app/models/search-criteria.model.ts`

---

## Phase 2: Foundational Components

> Blocking: Flight card component needed by US1, US4. Search form compact mode needed by US2.

- [x] T005 Generate flight-card component with `npx ng generate component components/flight-card --standalone`
- [x] T006 [P] Implement flight-card component template in `frontend/src/app/components/flight-card/flight-card.component.html`
- [x] T007 [P] Implement flight-card component styles (hover, selected states) in `frontend/src/app/components/flight-card/flight-card.component.scss`
- [x] T008 Implement flight-card component logic (inputs: flight, selected; output: select event) in `frontend/src/app/components/flight-card/flight-card.component.ts`

---

## Phase 3: User Story 1 - View Search Results (P1)

> **Goal**: Display flight results page with list of flight cards showing airline, duration, times, stops, and price.
>
> **Independent Test**: Navigate to `http://localhost:4200/search?origin=SFO&destination=NRT&departureDate=2025-03-15&adults=1`, verify 6 flight cards display with correct info, click "Show all" to see all 10.

- [x] T009 [US1] Create mock flights data array (10 flights) in `frontend/src/app/mock-data/flights.data.ts`
- [x] T010 [US1] Generate search-results page with `npx ng generate component pages/search-results --standalone`
- [x] T011 [US1] Implement search-results page HTML with flight list section in `frontend/src/app/pages/search-results/search-results.component.html`
- [x] T012 [US1] Implement search-results page styles (two-column layout, responsive) in `frontend/src/app/pages/search-results/search-results.component.scss`
- [x] T013 [US1] Implement search-results page logic (load flights, show 6 default, show all toggle) in `frontend/src/app/pages/search-results/search-results.component.ts`
- [x] T014 [US1] Add `/search` route to `frontend/src/app/app.routes.ts`

---

## Phase 4: User Story 2 - Modify Search from Results Page (P1)

> **Goal**: Display compact search bar at top of results with pre-filled criteria from URL params.
>
> **Independent Test**: Navigate to results page, verify search form shows SFO→NRT, modify destination, click search, verify URL updates.

- [x] T015 [US2] Add `compact` input signal to search-form component in `frontend/src/app/components/search-form/search-form.component.ts`
- [x] T016 [US2] Add compact mode styles (horizontal layout) to `frontend/src/app/components/search-form/search-form.component.scss`
- [x] T017 [US2] Update search-results page to include compact search form with pre-filled values from URL in `frontend/src/app/pages/search-results/search-results.component.ts`

---

## Phase 5: User Story 3 - Filter Flight Results (P2)

> **Goal**: Display filter bar with dropdown buttons, filter flights client-side when options selected.
>
> **Independent Test**: Navigate to results page, click "Stops" dropdown, select "Nonstop only", verify only nonstop flights display, clear filter, verify all flights return.

- [x] T018 [US3] Generate filter-bar component with `npx ng generate component components/filter-bar --standalone`
- [x] T019 [US3] Implement filter-bar component template with dropdown buttons in `frontend/src/app/components/filter-bar/filter-bar.component.html`
- [x] T020 [US3] Implement filter-bar component styles (dropdown states, active border) in `frontend/src/app/components/filter-bar/filter-bar.component.scss`
- [x] T021 [US3] Implement filter-bar component logic (filter state, events) in `frontend/src/app/components/filter-bar/filter-bar.component.ts`
- [x] T022 [US3] Integrate filter-bar into search-results page with filtering logic in `frontend/src/app/pages/search-results/search-results.component.ts`

---

## Phase 6: User Story 4 - Select a Flight (P1)

> **Goal**: Flight cards have hover effect and selected state with visual indicator.
>
> **Independent Test**: Hover over flight card (light purple background appears), click card (purple left border appears), click another card (selection moves).
>
> **Scope Note**: US4 Acceptance Scenario 3 ("selected flight retained when proceeding") is out of scope - booking flow (next step) is a future feature. This phase implements visual selection only.

- [x] T023 [US4] Add selection state management to search-results page in `frontend/src/app/pages/search-results/search-results.component.ts`
- [x] T024 [US4] Update flight-card to emit selection and display selected state in `frontend/src/app/components/flight-card/flight-card.component.ts`

---

## Phase 7: Polish & Cross-Cutting

> Final verification, edge cases, and responsive testing.

- [x] T025 Add "No flights found" and "No flights match filters" empty states in `frontend/src/app/pages/search-results/search-results.component.html`
- [x] T026 Verify responsive layout (two-column → single-column at 768px) across all sections

---

## Dependencies

```
T001, T002, T003 (Setup - parallel)
    │
    └──► T004 (fromQueryParams - depends on models)
              │
              └──► T005 → T006, T007 (parallel) → T008 (Flight Card)
                        │
                        └──► T009 → T010 → T011, T012 (parallel) → T013 → T014 (US1)
                                    │
                                    ├──► T015 → T016 → T017 (US2)
                                    │
                                    ├──► T018 → T019, T020 (parallel) → T021 → T022 (US3)
                                    │
                                    └──► T023 → T024 (US4)
                                              │
                                              └──► T025, T026 (Polish)
```

## Parallel Execution Examples

**Phase 1 (Setup)**:
```bash
# Can run in parallel - different files
T001: Create flight.model.ts
T002: Create filter.model.ts
T003: Create airlines.data.ts
```

**Phase 2 (Foundational)**:
```bash
# After T005 generates component, template and styles can be parallel
T006: Implement flight-card template
T007: Implement flight-card styles
```

**Phase 3-6 (User Stories)**:
```bash
# US1 must complete first (creates the page)
# US2, US3, US4 can then work in parallel on different aspects
# But each story's tasks are sequential within the story
```

---

## Implementation Strategy

### MVP Scope (Recommended)

For fastest time-to-demo, implement in this order:

1. **Phase 1-2**: Setup + Foundational (T001-T008)
2. **Phase 3**: US1 - View Search Results (T009-T014) ← MVP Complete

This delivers a working search results page with flight list display.

### Full Implementation

Continue with:
3. **Phase 4**: US2 - Modify Search (T015-T017)
4. **Phase 5**: US3 - Filter Results (T018-T022)
5. **Phase 6**: US4 - Select Flight (T023-T024)
6. **Phase 7**: Polish (T025-T026)

---

## Task Details

### T001: Create Flight Model

**File**: `frontend/src/app/models/flight.model.ts`

```typescript
export interface Airline {
  code: string;
  name: string;
  logo?: string;
}

export interface Layover {
  airport: string;
  duration: string;
}

export interface Flight {
  id: string;
  airline: Airline;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  duration: string;
  stops: number;
  layovers?: Layover[];
  price: number;
}

export function getStopsDisplay(flight: Flight): string {
  if (flight.stops === 0) return 'Nonstop';
  if (flight.stops === 1) return '1 stop';
  return `${flight.stops} stops`;
}

export function getLayoverDisplay(layover: Layover): string {
  return `${layover.duration} in ${layover.airport}`;
}
```

### T002: Create Filter Model

**File**: `frontend/src/app/models/filter.model.ts`

See `data-model.md` for complete FilterState, TimeRange, SeatClass interfaces and constants.

### T008: Flight Card Component Logic

**File**: `frontend/src/app/components/flight-card/flight-card.component.ts`

**Inputs**:
- `flight: Flight` (required)
- `selected: boolean` (default: false)

**Outputs**:
- `select: EventEmitter<string>` (emits flight.id)

**Template**: Airline logo (with fallback), duration, airline name, departure/arrival times, stops display, layover info, price

### T013: Search Results Page Logic

**File**: `frontend/src/app/pages/search-results/search-results.component.ts`

**Features**:
- Read URL query params with ActivatedRoute
- Parse into SearchCriteria using fromQueryParams
- Load mock flights
- Show 6 flights by default, toggle to show all
- Selected flight ID state
- Filter state (Phase 5)

---

## Verification Checklist

After all tasks complete:

- [x] Navigate to `/search` with query params, page loads
- [x] Compact search bar displays with pre-filled values
- [x] Filter bar displays with 6 dropdown buttons
- [x] "Choose a departing flight" title displays
- [x] 6 flight cards display initially
- [x] Each card shows: airline logo, duration, airline name, times, stops, price
- [x] Cards with layovers show layover info (e.g., "2h 45m in HNL")
- [x] Nonstop flights show "Nonstop"
- [x] "Show all X flights" button reveals remaining flights
- [x] Hover over card shows light purple background
- [x] Click card shows purple left border (selected)
- [x] Filter dropdown shows purple border when active
- [x] Selecting filter updates visible flights
- [x] Two-column layout on desktop (768px+)
- [x] Single-column layout on mobile (<768px)
- [x] No console errors
- [x] Build succeeds with `npx ng build`
