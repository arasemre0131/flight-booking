# Tasks: Flight Search Form

**Feature**: 002-search-form
**Branch**: `002-search-form`
**Generated**: 2025-01-30
**Total Tasks**: 24

## Summary

| Phase | Description | Task Count |
|-------|-------------|------------|
| Phase 1 | Setup | 3 |
| Phase 2 | Foundational (Models & Services) | 4 |
| Phase 3 | US1+US2: Search Form Core | 7 |
| Phase 4 | US3: Passenger Selector | 3 |
| Phase 5 | US4: Swap Button | 2 |
| Phase 6 | Polish & Integration | 5 |

## Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational: Models, Services)
    ↓
Phase 3 (US1+US2: Search Form) ←────┐
    ↓                               │ US1 & US2 share same core components
Phase 4 (US3: Passenger Selector) ──┘
    ↓
Phase 5 (US4: Swap Button)
    ↓
Phase 6 (Polish)
```

## MVP Scope

**Minimum Viable Product**: Phase 1 + Phase 2 + Phase 3
- Users can search for round-trip and one-way flights
- Form validates and navigates to search results
- Can be tested independently

---

## Phase 1: Setup

**Goal**: Prepare component directories and routing

- [ ] T001 Create components directory structure at `frontend/src/app/components/search-form/`
- [ ] T002 Create pages directory structure at `frontend/src/app/pages/landing/`
- [ ] T003 Add mock airport data file at `frontend/src/assets/data/airports.json`

---

## Phase 2: Foundational

**Goal**: Create shared models and services needed by all components

- [ ] T004 [P] Create Airport interface in `frontend/src/app/models/airport.model.ts`
- [ ] T005 [P] Create SearchCriteria, TripType, PassengerCount interfaces in `frontend/src/app/models/search-criteria.model.ts`
- [ ] T006 Create AirportService with search method in `frontend/src/app/services/airport.service.ts`
- [ ] T007 Add search route to app routes in `frontend/src/app/app.routes.ts`

---

## Phase 3: US1+US2 - Search Form Core (Priority: P1)

**User Stories**:
- US1: Search for Round-Trip Flights (P1)
- US2: Search for One-Way Flights (P1)

**Goal**: Complete search form with trip type toggle, location inputs, date pickers

**Independent Test**: Load landing page → Form visible → Fill fields → Click Search → Navigate to /search with params

### Tasks

- [ ] T008 [P] [US1] Create TripTypeSelectorComponent in `frontend/src/app/components/search-form/trip-type-selector/`
- [ ] T009 [P] [US1] Create LocationInputComponent with autocomplete in `frontend/src/app/components/search-form/location-input/`
- [ ] T010 [P] [US1] Create DatePickerComponent in `frontend/src/app/components/search-form/date-picker/`
- [ ] T011 [US1+US2] Create main SearchFormComponent composing child components in `frontend/src/app/components/search-form/`
- [ ] T012 [US1+US2] Add form validation (required fields, origin != destination, date validation) to SearchFormComponent
- [ ] T013 [US1+US2] Implement search navigation with query params in SearchFormComponent
- [ ] T014 [US1+US2] Create LandingComponent and integrate SearchFormComponent in `frontend/src/app/pages/landing/`

**Checkpoint**: Round-trip and one-way search should work. Test by filling form and clicking Search.

---

## Phase 4: US3 - Passenger Selector (Priority: P2)

**User Story**: US3: Select Number of Passengers

**Goal**: Add passenger count selection with adults/children

**Independent Test**: Click passengers field → Dropdown opens → Adjust counts → Summary updates

### Tasks

- [ ] T015 [P] [US3] Create PassengerSelectorComponent in `frontend/src/app/components/search-form/passenger-selector/`
- [ ] T016 [US3] Add passenger selector styles with dropdown and counter buttons
- [ ] T017 [US3] Integrate PassengerSelectorComponent into SearchFormComponent

**Checkpoint**: Passenger selection should work. Test by clicking passenger field and adjusting counts.

---

## Phase 5: US4 - Swap Button (Priority: P3)

**User Story**: US4: Swap Origin and Destination

**Goal**: Add swap button between origin and destination fields

**Independent Test**: Enter origin/destination → Click swap → Values exchange

### Tasks

- [ ] T018 [US4] Add swap button between origin and destination in SearchFormComponent template
- [ ] T019 [US4] Implement swap logic in SearchFormComponent

**Checkpoint**: Swap button should exchange origin and destination values.

---

## Phase 6: Polish & Integration

**Goal**: Responsive styles, validation polish, final integration

- [ ] T020 Add responsive styles for mobile (<768px) in SearchFormComponent and child components
- [ ] T021 Add validation error messages display in SearchFormComponent template
- [ ] T022 Add loading state for autocomplete in LocationInputComponent
- [ ] T023 Update app.html to use LandingComponent as default route
- [ ] T024 Verify search form display on all viewport sizes, test form submission

---

## Parallel Execution Guide

### After Phase 2 completes:

```
┌─────────────────────────────────┐
│ T008 TripTypeSelector           │
│ T009 LocationInput       [P]    │
│ T010 DatePicker                 │
└─────────────────────────────────┘
```

### Within Phase 3:

```
┌─────────────────────────────────┐
│ T008 + T009 + T010 (parallel)   │
└───────────────┬─────────────────┘
                ↓
┌─────────────────────────────────┐
│ T011 SearchFormComponent        │
│ (depends on child components)   │
└───────────────┬─────────────────┘
                ↓
┌─────────────────────────────────┐
│ T012 + T013 (parallel within    │
│ SearchFormComponent)            │
└───────────────┬─────────────────┘
                ↓
┌─────────────────────────────────┐
│ T014 LandingComponent           │
└─────────────────────────────────┘
```

---

## File Checklist

| File | Created In | Purpose |
|------|------------|---------|
| `frontend/src/assets/data/airports.json` | T003 | Mock airport data |
| `frontend/src/app/models/airport.model.ts` | T004 | Airport interface |
| `frontend/src/app/models/search-criteria.model.ts` | T005 | SearchCriteria, TripType, PassengerCount |
| `frontend/src/app/services/airport.service.ts` | T006 | Airport search service |
| `frontend/src/app/app.routes.ts` | T007 | Updated routes |
| `frontend/src/app/components/search-form/trip-type-selector/*` | T008 | Trip type component |
| `frontend/src/app/components/search-form/location-input/*` | T009 | Location autocomplete |
| `frontend/src/app/components/search-form/date-picker/*` | T010 | Date picker component |
| `frontend/src/app/components/search-form/*` | T011-T013 | Main search form |
| `frontend/src/app/pages/landing/*` | T014 | Landing page |
| `frontend/src/app/components/search-form/passenger-selector/*` | T015-T016 | Passenger selector |

---

## Acceptance Criteria Mapping

| Requirement | Task(s) |
|-------------|---------|
| FR-001: Form on landing page | T014 |
| FR-002: Trip type selection | T008, T011 |
| FR-003: Origin with autocomplete | T009 |
| FR-004: Destination with autocomplete | T009 |
| FR-005: Departure date picker | T010 |
| FR-006: Return date (round-trip) | T010, T011 |
| FR-007: Passenger selector | T015, T016, T017 |
| FR-008: Swap button | T018, T019 |
| FR-009: Required field validation | T012 |
| FR-010: Origin != destination | T012 |
| FR-011: Return >= departure | T012 |
| FR-012: Navigate to search | T013 |
| FR-013: Mobile responsive | T020 |
