# Implementation Tasks: 011-airline-dashboard

**Feature**: Airline Dashboard
**Date**: 2025-01-31
**Branch**: `011-airline-dashboard`

---

## Task Overview

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | T001-T004 | Setup: Dependencies & Models |
| 2 | T005-T010 | Foundational: Service, Guard, Container |
| 3 | T011-T016 | US1: Route Management |
| 4 | T017-T023 | US2: Aircraft Management |
| 5 | T024-T031 | US3: Flight Scheduling |
| 6 | T032-T035 | US4: Ticket Pricing |
| 7 | T036-T042 | US5: Statistics Dashboard |
| 8 | T043-T045 | Polish: Loading States & Final Testing |

**Total Tasks**: 45
**Parallelizable Tasks**: 18

---

## Phase 1: Setup

### Goal
Install dependencies and create data models for airline dashboard entities.

---

### T001: Install Chart.js Dependencies

**Priority**: P0 (Blocker)
**Dependencies**: None

**Acceptance Criteria**:
- [x] ng2-charts package installed
- [x] chart.js package installed
- [x] date-fns package installed
- [x] Build succeeds without errors

**Files**:
- `frontend/package.json` (updated)

**Command**:
```bash
cd frontend && npm install ng2-charts chart.js date-fns
```

---

### T002: Create Airline Route Model

**Priority**: P0 (Blocker)
**Dependencies**: None

**Acceptance Criteria**:
- [x] AirlineRoute interface with all fields from data-model.md
- [x] CreateRouteDto and UpdateRouteDto types
- [x] Export all types

**Files**:
- `frontend/src/app/models/airline-route.model.ts` (create)

---

### T003: Create Aircraft Model

**Priority**: P0 (Blocker)
**Dependencies**: None

**Acceptance Criteria**:
- [x] SeatClassConfig interface
- [x] Aircraft interface with all fields
- [x] CreateAircraftDto and UpdateAircraftDto types
- [x] Helper function to calculate total seats

**Files**:
- `frontend/src/app/models/aircraft.model.ts` (create)

---

### T004: Create Airline Stats Model

**Priority**: P0 (Blocker)
**Dependencies**: None

**Acceptance Criteria**:
- [x] AirlineStats interface with summary, topRoutes, revenueByDay, flightsByStatus
- [x] DateRange interface
- [x] FlightStatus type (reuse or extend from existing)

**Files**:
- `frontend/src/app/models/airline-stats.model.ts` (create)

---

## Phase 2: Foundational

### Goal
Create core service, route guard, and dashboard container that all user stories depend on.

---

### T005: Create Mock Airline Routes Data

**Priority**: P0 (Blocker)
**Dependencies**: T002

**Acceptance Criteria**:
- [x] MOCK_AIRLINE_ROUTES array with 5+ sample routes
- [x] Mix of active and inactive routes
- [x] Valid IATA codes (VCE, LHR, FCO, CDG, JFK)

**Files**:
- `frontend/src/app/mock-data/airline-routes.data.ts` (create)

---

### T006: Create Mock Aircraft Data

**Priority**: P0 (Blocker)
**Dependencies**: T003

**Acceptance Criteria**:
- [x] MOCK_AIRCRAFT array with 3+ aircraft
- [x] Different seat configurations (economy-only, economy+business, all three classes)
- [x] Realistic aircraft models (A320, B737, A380)

**Files**:
- `frontend/src/app/mock-data/aircraft.data.ts` (create)

---

### T007: Create Mock Airline Stats Data

**Priority**: P0 (Blocker)
**Dependencies**: T004

**Acceptance Criteria**:
- [x] MOCK_AIRLINE_STATS object with sample data
- [x] getStatsByDateRange helper function
- [x] Realistic revenue and passenger numbers

**Files**:
- `frontend/src/app/mock-data/airline-stats.data.ts` (create)

---

### T008: Create AirlineService

**Priority**: P0 (Blocker)
**Dependencies**: T005, T006, T007

**Acceptance Criteria**:
- [x] Injectable service with providedIn: 'root'
- [x] Signal-based state: routes, aircraft, flights
- [x] Computed signals: activeRoutes, activeAircraft
- [x] Initialize with mock data in constructor
- [x] Placeholder CRUD methods (implement in user story phases)

**Files**:
- `frontend/src/app/services/airline.service.ts` (create)

---

### T009: Create Airline Role Guard

**Priority**: P0 (Blocker)
**Dependencies**: T008

**Acceptance Criteria**:
- [x] Functional guard using inject()
- [x] Check AuthService.currentUser().role === 'airline'
- [x] Redirect to /login if not authenticated
- [x] Redirect to / if wrong role

**Files**:
- `frontend/src/app/guards/airline.guard.ts` (create)

---

### T010: Create Airline Dashboard Container

**Priority**: P0 (Blocker)
**Dependencies**: T009

**Acceptance Criteria**:
- [x] Standalone component with router-outlet
- [x] Sidebar placeholder (implement in T011)
- [x] Main content area with child routes
- [x] Basic layout (sidebar left, content right)
- [x] Add route to app.routes.ts with guard

**Files**:
- `frontend/src/app/pages/airline/airline.ts` (create)
- `frontend/src/app/pages/airline/airline.html` (create)
- `frontend/src/app/pages/airline/airline.scss` (create)
- `frontend/src/app/pages/airline/airline.routes.ts` (create)
- `frontend/src/app/app.routes.ts` (update)

---

## Phase 3: US1 - Route Management

### Goal
Airline operators can create and manage flight routes.

### Independent Test Criteria
- Can navigate to /airline/routes
- Can create a new route with origin, destination, flight number prefix
- Route appears in list with Active status
- Cannot create duplicate route (shows error)
- Can edit existing route
- Can deactivate route

---

### T011: Create Sidebar Navigation Component

**Priority**: P1
**Dependencies**: T010

**Acceptance Criteria**:
- [x] Standalone component
- [x] Navigation links: Overview, Routes, Aircraft, Flights, Pricing, Statistics
- [x] RouterLink with routerLinkActive styling
- [x] Icons for each section (use simple text or unicode for now)
- [x] Highlight active route

**Files**:
- `frontend/src/app/components/airline/sidebar/sidebar.ts` (create)
- `frontend/src/app/components/airline/sidebar/sidebar.html` (create)
- `frontend/src/app/components/airline/sidebar/sidebar.scss` (create)

---

### T012: Create Overview Page

**Priority**: P1
**Dependencies**: T011

**Acceptance Criteria**:
- [x] Standalone component
- [x] Welcome message with airline name
- [x] Quick stats summary (route count, aircraft count, upcoming flights)
- [x] Quick links to main sections

**Files**:
- `frontend/src/app/pages/airline/overview/overview.ts` (create)
- `frontend/src/app/pages/airline/overview/overview.html` (create)
- `frontend/src/app/pages/airline/overview/overview.scss` (create)

---

### T013: [US1] Implement Route CRUD in AirlineService

**Priority**: P1
**Dependencies**: T008

**Acceptance Criteria**:
- [x] createRoute(dto): Promise<AirlineRoute> - validates uniqueness
- [x] updateRoute(id, dto): Promise<AirlineRoute>
- [x] toggleRouteStatus(id): Promise<void> - soft delete
- [x] getRouteById(id): AirlineRoute | undefined
- [x] Duplicate check: same origin + destination + prefix = error

**Files**:
- `frontend/src/app/services/airline.service.ts` (update)

---

### T014: [US1] Create Routes List Page

**Priority**: P1
**Dependencies**: T013

**Acceptance Criteria**:
- [x] Standalone component
- [x] Table with columns: Flight #, Origin, Destination, Status, Actions
- [x] Search/filter by flight number or airport
- [x] Status badge (Active/Inactive)
- [x] Action buttons: Edit, Toggle Status
- [x] "Add Route" button linking to form

**Files**:
- `frontend/src/app/pages/airline/routes/routes-list/routes-list.ts` (create)
- `frontend/src/app/pages/airline/routes/routes-list/routes-list.html` (create)
- `frontend/src/app/pages/airline/routes/routes-list/routes-list.scss` (create)

---

### T015: [US1] Create Confirmation Dialog Component

**Priority**: P1
**Dependencies**: None

**Acceptance Criteria**:
- [x] Standalone component with @Input() message, title
- [x] @Output() confirm, cancel events
- [x] Modal overlay with centered dialog
- [x] Confirm/Cancel buttons

**Files**:
- `frontend/src/app/components/airline/confirmation-dialog/confirmation-dialog.ts` (create)
- `frontend/src/app/components/airline/confirmation-dialog/confirmation-dialog.html` (create)
- `frontend/src/app/components/airline/confirmation-dialog/confirmation-dialog.scss` (create)

---

### T016: [US1] Create Route Form Page

**Priority**: P1
**Dependencies**: T014, T015

**Acceptance Criteria**:
- [x] Standalone component with ReactiveFormsModule
- [x] Form fields: origin airport (autocomplete), destination airport (autocomplete), flight number prefix
- [x] Reuse LocationInput component from search-form for autocomplete
- [x] Create mode vs Edit mode based on route param :id
- [x] Validation: all required, origin != destination
- [x] Error display for duplicate route
- [x] Save navigates back to list

**Files**:
- `frontend/src/app/pages/airline/routes/route-form/route-form.ts` (create)
- `frontend/src/app/pages/airline/routes/route-form/route-form.html` (create)
- `frontend/src/app/pages/airline/routes/route-form/route-form.scss` (create)

---

## Phase 4: US2 - Aircraft Management

### Goal
Airline operators can register aircraft with seat configurations.

### Independent Test Criteria
- Can navigate to /airline/aircraft
- Can register new aircraft with model, registration, seat config
- Total seats auto-calculated and displayed
- Aircraft appears in list
- Can edit aircraft details
- Cannot deactivate aircraft with scheduled flights

---

### T017: [US2] Implement Aircraft CRUD in AirlineService

**Priority**: P1
**Dependencies**: T008

**Acceptance Criteria**:
- [x] createAircraft(dto): Promise<Aircraft> - validates registration uniqueness
- [x] updateAircraft(id, dto): Promise<Aircraft> - warns if reducing seats with scheduled flights
- [x] toggleAircraftStatus(id): Promise<void>
- [x] getAircraftById(id): Aircraft | undefined
- [x] hasScheduledFlights(aircraftId): boolean

**Files**:
- `frontend/src/app/services/airline.service.ts` (update)

---

### T018: [US2] Create Aircraft List Page

**Priority**: P1
**Dependencies**: T017

**Acceptance Criteria**:
- [x] Standalone component
- [x] Table: Registration, Model, Total Seats, Economy/Business/First breakdown, Status, Actions
- [x] Search by registration or model
- [x] Status badge
- [x] Actions: Edit, Toggle Status
- [x] "Add Aircraft" button

**Files**:
- `frontend/src/app/pages/airline/aircraft/aircraft-list/aircraft-list.ts` (create)
- `frontend/src/app/pages/airline/aircraft/aircraft-list/aircraft-list.html` (create)
- `frontend/src/app/pages/airline/aircraft/aircraft-list/aircraft-list.scss` (create)

---

### T019: [P] [US2] Create Seat Configuration Builder Component

**Priority**: P1
**Dependencies**: T003

**Acceptance Criteria**:
- [x] Standalone component with @Input() classType, @Output() configChange
- [x] Inputs: rows (number), seats per row (number)
- [x] Real-time total calculation display
- [x] Optional toggle for business and first class
- [x] Validation: rows 1-50, seats 1-10

**Files**:
- `frontend/src/app/components/airline/seat-config-builder/seat-config-builder.ts` (create)
- `frontend/src/app/components/airline/seat-config-builder/seat-config-builder.html` (create)
- `frontend/src/app/components/airline/seat-config-builder/seat-config-builder.scss` (create)

---

### T020: [US2] Create Aircraft Form Page

**Priority**: P1
**Dependencies**: T018, T019

**Acceptance Criteria**:
- [x] Standalone component with ReactiveFormsModule
- [x] Fields: model (text), registration (text)
- [x] Embed SeatConfigBuilder for economy (required), business (optional), first (optional)
- [x] Total seats display updated in real-time
- [x] Create vs Edit mode
- [x] Validation feedback

**Files**:
- `frontend/src/app/pages/airline/aircraft/aircraft-form/aircraft-form.ts` (create)
- `frontend/src/app/pages/airline/aircraft/aircraft-form/aircraft-form.html` (create)
- `frontend/src/app/pages/airline/aircraft/aircraft-form/aircraft-form.scss` (create)

---

### T021: [P] [US2] Add Mock Flights Data

**Priority**: P1
**Dependencies**: T002, T003

**Acceptance Criteria**:
- [x] MOCK_AIRLINE_FLIGHTS array with 10+ flights
- [x] Reference existing routes and aircraft
- [x] Mix of statuses (scheduled, departed, arrived, cancelled)
- [x] Pricing data included

**Files**:
- `frontend/src/app/mock-data/airline-flights.data.ts` (create)

---

### T022: [US2] Add Flights State to AirlineService

**Priority**: P1
**Dependencies**: T021

**Acceptance Criteria**:
- [x] flights signal initialized with mock data
- [x] Computed: getFlightsByAircraft(aircraftId)
- [x] Used by aircraft form to check if aircraft has scheduled flights

**Files**:
- `frontend/src/app/services/airline.service.ts` (update)

---

### T023: [US2] Aircraft Form Scheduled Flights Warning

**Priority**: P1
**Dependencies**: T020, T022

**Acceptance Criteria**:
- [x] When editing aircraft, check if has scheduled flights
- [x] If reducing seat count and has flights: show warning
- [x] Block save if new capacity < booked seats on any flight

**Files**:
- `frontend/src/app/pages/airline/aircraft/aircraft-form/aircraft-form.ts` (update)

---

## Phase 5: US3 - Flight Scheduling

### Goal
Airline operators can schedule flights by assigning aircraft to routes.

### Independent Test Criteria
- Can navigate to /airline/flights
- Can create flight with route, aircraft, times
- Duration auto-calculated
- Conflict detection warns about overlapping aircraft
- Can view flights filtered by date, route, status
- Can cancel a flight
- Seat availability shown

---

### T024: [US3] Implement Flight CRUD in AirlineService

**Priority**: P1
**Dependencies**: T022

**Acceptance Criteria**:
- [x] createFlight(dto): Promise<Flight> - checks for conflicts
- [x] updateFlight(id, dto): Promise<Flight> - only if status=scheduled
- [x] updateFlightStatus(id, status): Promise<void>
- [x] cancelFlight(id): Promise<void>
- [x] checkAircraftConflict(aircraftId, departure, arrival, excludeFlightId?): Flight | null

**Files**:
- `frontend/src/app/services/airline.service.ts` (update)

---

### T025: [US3] Create Flights List Page

**Priority**: P1
**Dependencies**: T024

**Acceptance Criteria**:
- [x] Standalone component
- [x] Table: Flight #, Route (origin→dest), Aircraft, Departure, Duration, Status, Seats, Actions
- [x] Filters: date range picker, route dropdown, aircraft dropdown, status dropdown
- [x] Seat badge: "X/Y available"
- [x] Actions: Edit (if scheduled), Cancel (if scheduled), View details

**Files**:
- `frontend/src/app/pages/airline/flights/flights-list/flights-list.ts` (create)
- `frontend/src/app/pages/airline/flights/flights-list/flights-list.html` (create)
- `frontend/src/app/pages/airline/flights/flights-list/flights-list.scss` (create)

---

### T026: [US3] Create Flight Form Page

**Priority**: P1
**Dependencies**: T025

**Acceptance Criteria**:
- [x] Standalone component with ReactiveFormsModule
- [x] Fields: route (dropdown of active routes), aircraft (dropdown of active aircraft), departure datetime, arrival datetime
- [x] Auto-calculate and display duration
- [x] Arrival must be after departure validation
- [x] Conflict detection on aircraft selection + time change
- [x] Warning message if conflict detected
- [x] Default pricing from previous flight on same route (if exists)

**Files**:
- `frontend/src/app/pages/airline/flights/flight-form/flight-form.ts` (create)
- `frontend/src/app/pages/airline/flights/flight-form/flight-form.html` (create)
- `frontend/src/app/pages/airline/flights/flight-form/flight-form.scss` (create)

---

### T027: [P] [US3] Create Simple Calendar View Component

**Priority**: P2
**Dependencies**: T024

**Acceptance Criteria**:
- [x] Standalone component
- [x] Monthly calendar grid using CSS Grid
- [x] Days with flights show indicator dot
- [x] Click day to filter flights list
- [x] Navigation: previous/next month
- [x] No external calendar library

**Files**:
- `frontend/src/app/pages/airline/flights/flights-calendar/flights-calendar.ts` (create)
- `frontend/src/app/pages/airline/flights/flights-calendar/flights-calendar.html` (create)
- `frontend/src/app/pages/airline/flights/flights-calendar/flights-calendar.scss` (create)

---

### T028: [US3] Integrate Calendar with Flights List

**Priority**: P2
**Dependencies**: T025, T027

**Acceptance Criteria**:
- [x] Toggle between List and Calendar view
- [x] Calendar click updates date filter
- [x] Flights list shows filtered results

**Files**:
- `frontend/src/app/pages/airline/flights/flights-list/flights-list.ts` (update)
- `frontend/src/app/pages/airline/flights/flights-list/flights-list.html` (update)

---

### T029: [US3] Flight Status Management

**Priority**: P1
**Dependencies**: T025

**Acceptance Criteria**:
- [x] Status dropdown in list (only for scheduled → boarding → departed → arrived)
- [x] Cancel button (confirmation required)
- [x] Status colors: scheduled=blue, boarding=orange, departed=purple, arrived=green, cancelled=red

**Files**:
- `frontend/src/app/pages/airline/flights/flights-list/flights-list.ts` (update)
- `frontend/src/app/pages/airline/flights/flights-list/flights-list.scss` (update)

---

### T030: [US3] Pricing Fields in Flight Form

**Priority**: P1
**Dependencies**: T026

**Acceptance Criteria**:
- [x] Pricing section in flight form
- [x] Fields: economy price, business price (if aircraft has business), first class price (if aircraft has first)
- [x] Seat fees: aisle, window, extra legroom
- [x] Price validation: positive, business > economy, first > business
- [x] Currency display (€)

**Files**:
- `frontend/src/app/pages/airline/flights/flight-form/flight-form.ts` (update)
- `frontend/src/app/pages/airline/flights/flight-form/flight-form.html` (update)

---

### T031: [US3] Flight Conflict Modal

**Priority**: P1
**Dependencies**: T026, T015

**Acceptance Criteria**:
- [x] When conflict detected, show modal with conflicting flight details
- [x] Allow user to proceed anyway (warning only) or cancel
- [x] Modal shows: conflicting flight number, times, route

**Files**:
- `frontend/src/app/pages/airline/flights/flight-form/flight-form.ts` (update)

---

## Phase 6: US4 - Ticket Pricing

### Goal
Airline operators can set and manage ticket prices for flights.

### Independent Test Criteria
- Can navigate to /airline/pricing
- Can see all flights with current prices
- Can inline edit prices
- Can bulk update prices for same route
- Validation prevents business < economy

---

### T032: [US4] Create Pricing List Page

**Priority**: P1
**Dependencies**: T024

**Acceptance Criteria**:
- [x] Standalone component
- [x] Table: Flight #, Route, Date, Economy, Business, First, Seat Fees, Actions
- [x] Filter by route
- [x] Sort by date, route, price
- [x] Inline edit mode for quick price changes

**Files**:
- `frontend/src/app/pages/airline/pricing/pricing-list/pricing-list.ts` (create)
- `frontend/src/app/pages/airline/pricing/pricing-list/pricing-list.html` (create)
- `frontend/src/app/pages/airline/pricing/pricing-list/pricing-list.scss` (create)

---

### T033: [US4] Implement Inline Price Editing

**Priority**: P1
**Dependencies**: T032

**Acceptance Criteria**:
- [x] Click on price cell to edit
- [x] Input field appears with current value
- [x] Enter or blur saves, Escape cancels
- [x] Validation: positive number, business > economy
- [x] Visual feedback on save (green flash)

**Files**:
- `frontend/src/app/pages/airline/pricing/pricing-list/pricing-list.ts` (update)
- `frontend/src/app/pages/airline/pricing/pricing-list/pricing-list.scss` (update)

---

### T034: [US4] Implement Bulk Pricing

**Priority**: P1
**Dependencies**: T033

**Acceptance Criteria**:
- [x] Checkbox selection for multiple flights
- [x] "Apply to Selected" button
- [x] Modal to enter prices for all selected
- [x] Only apply to flights on same route (validation)
- [x] Confirm before applying

**Files**:
- `frontend/src/app/pages/airline/pricing/pricing-list/pricing-list.ts` (update)
- `frontend/src/app/pages/airline/pricing/pricing-list/pricing-list.html` (update)

---

### T035: [US4] Update Pricing in AirlineService

**Priority**: P1
**Dependencies**: T024

**Acceptance Criteria**:
- [x] updateFlightPricing(id, pricing): Promise<void>
- [x] bulkUpdatePricing(ids, pricing): Promise<void>
- [x] Validation at service level

**Files**:
- `frontend/src/app/services/airline.service.ts` (update)

---

## Phase 7: US5 - Statistics Dashboard

### Goal
Airline operators can view business statistics with charts.

### Independent Test Criteria
- Can navigate to /airline/statistics
- Dashboard shows summary cards (flights, passengers, revenue, load factor)
- Charts render: bar chart (top routes), line chart (revenue trend), pie chart (flight status)
- Can filter by date range
- Can export to CSV

---

### T036: [P] [US5] Create Stat Card Component

**Priority**: P1
**Dependencies**: None

**Acceptance Criteria**:
- [x] Standalone component
- [x] @Input() title, value, icon, trend (optional)
- [x] Clean card design with large number
- [x] Trend indicator (up/down arrow with color)

**Files**:
- `frontend/src/app/components/airline/stat-card/stat-card.ts` (create)
- `frontend/src/app/components/airline/stat-card/stat-card.html` (create)
- `frontend/src/app/components/airline/stat-card/stat-card.scss` (create)

---

### T037: [US5] Implement getStatistics in AirlineService

**Priority**: P1
**Dependencies**: T007

**Acceptance Criteria**:
- [x] getStatistics(dateRange): Promise<AirlineStats>
- [x] Calculate from mock flight and booking data
- [x] Return all required fields: summary, topRoutes, revenueByDay, flightsByStatus

**Files**:
- `frontend/src/app/services/airline.service.ts` (update)

---

### T038: [US5] Create Statistics Page

**Priority**: P1
**Dependencies**: T036, T037

**Acceptance Criteria**:
- [x] Standalone component
- [x] Date range picker (today, this week, this month, custom)
- [x] 4 stat cards: Total Flights, Passengers, Revenue, Load Factor
- [x] Placeholder for charts (implement in T039-T041)

**Files**:
- `frontend/src/app/pages/airline/statistics/statistics.ts` (create)
- `frontend/src/app/pages/airline/statistics/statistics.html` (create)
- `frontend/src/app/pages/airline/statistics/statistics.scss` (create)

---

### T039: [P] [US5] Implement Popular Routes Bar Chart

**Priority**: P1
**Dependencies**: T038

**Acceptance Criteria**:
- [x] Import BaseChartDirective from ng2-charts
- [x] Bar chart showing top 5 routes by passenger count
- [x] X-axis: route names (VCE→LHR)
- [x] Y-axis: passenger count
- [x] Responsive sizing

**Files**:
- `frontend/src/app/pages/airline/statistics/statistics.ts` (update)
- `frontend/src/app/pages/airline/statistics/statistics.html` (update)

---

### T040: [P] [US5] Implement Revenue Trend Line Chart

**Priority**: P1
**Dependencies**: T038

**Acceptance Criteria**:
- [x] Line chart showing revenue over time
- [x] X-axis: dates
- [x] Y-axis: revenue in currency
- [x] Smooth line with data points
- [x] Tooltip on hover

**Files**:
- `frontend/src/app/pages/airline/statistics/statistics.ts` (update)
- `frontend/src/app/pages/airline/statistics/statistics.html` (update)

---

### T041: [P] [US5] Implement Flight Status Pie Chart

**Priority**: P1
**Dependencies**: T038

**Acceptance Criteria**:
- [x] Pie chart showing flight status breakdown
- [x] Segments: Scheduled (blue), Completed (green), Cancelled (red)
- [x] Legend with counts
- [x] Hover to see percentage

**Files**:
- `frontend/src/app/pages/airline/statistics/statistics.ts` (update)
- `frontend/src/app/pages/airline/statistics/statistics.html` (update)

---

### T042: [US5] Implement CSV Export

**Priority**: P2
**Dependencies**: T038

**Acceptance Criteria**:
- [x] "Export CSV" button on statistics page
- [x] Generate CSV with: summary stats, top routes, revenue by day
- [x] Trigger browser download
- [x] Filename: airline-stats-{start}-{end}.csv

**Files**:
- `frontend/src/app/pages/airline/statistics/statistics.ts` (update)

---

## Phase 8: Polish

### Goal
Add loading states, error handling, and verify complete build.

---

### T043: Add Loading States to All Pages

**Priority**: P2
**Dependencies**: All US phases complete

**Acceptance Criteria**:
- [x] Loading spinner while fetching data
- [x] Consistent loading component across pages
- [x] Skeleton loaders for lists (optional)

**Files**:
- All page components (update)

---

### T044: Add Error Handling

**Priority**: P2
**Dependencies**: T043

**Acceptance Criteria**:
- [x] Error messages displayed for failed operations
- [x] Retry option where appropriate
- [x] Console errors logged for debugging

**Files**:
- All page components (update)
- `frontend/src/app/services/airline.service.ts` (update)

---

### T045: Final Build Verification

**Priority**: P1
**Dependencies**: All tasks

**Acceptance Criteria**:
- [x] `npm run build` succeeds without errors
- [x] No TypeScript errors
- [x] All routes accessible
- [x] All user scenarios from spec.md work correctly

**Files**: None (testing only)

---

## Dependencies Graph

```
T001 ──┬──> T002 ──┬──> T005 ──┐
       │          │           │
       ├──> T003 ──┼──> T006 ──┼──> T008 ──> T009 ──> T010 ──┬──> T011 ──> T012
       │          │           │                              │
       └──> T004 ──┴──> T007 ──┘                              │
                                                              │
┌─────────────────────────────────────────────────────────────┘
│
├──> US1: T013 ──> T014 ──> T015 ──> T016
│
├──> US2: T017 ──> T018 ──> T019 ──> T020 ──> T021 ──> T022 ──> T023
│
├──> US3: T024 ──> T025 ──> T026 ──> T027 ──> T028 ──> T029 ──> T030 ──> T031
│
├──> US4: T032 ──> T033 ──> T034 ──> T035
│
└──> US5: T036 ──> T037 ──> T038 ──> T039 ──> T040 ──> T041 ──> T042

All ──> T043 ──> T044 ──> T045
```

---

## Parallel Execution Opportunities

### Phase 1 (Setup)
```
T002, T003, T004 can run in parallel (no dependencies on each other)
```

### Phase 2 (Foundational)
```
T005, T006, T007 can run in parallel (after their model dependencies)
```

### Phase 3+ (User Stories)
```
After T010-T012 complete:
- US1 (T013-T016)
- US2 (T017-T023)  } Can potentially run in parallel
- US3 (T024-T031)    with careful coordination
- US4 (T032-T035)
- US5 (T036-T042)

Within US5:
- T036, T039, T040, T041 are parallelizable (different components)
```

---

## Checklist Summary

### Phase 1: Setup
- [x] T001 Install ng2-charts, chart.js, date-fns dependencies
- [x] T002 [P] Create AirlineRoute model in frontend/src/app/models/airline-route.model.ts
- [x] T003 [P] Create Aircraft model in frontend/src/app/models/aircraft.model.ts
- [x] T004 [P] Create AirlineStats model in frontend/src/app/models/airline-stats.model.ts

### Phase 2: Foundational
- [x] T005 Create mock airline routes data in frontend/src/app/mock-data/airline-routes.data.ts
- [x] T006 [P] Create mock aircraft data in frontend/src/app/mock-data/aircraft.data.ts
- [x] T007 [P] Create mock airline stats data in frontend/src/app/mock-data/airline-stats.data.ts
- [x] T008 Create AirlineService in frontend/src/app/services/airline.service.ts
- [x] T009 Create airline role guard in frontend/src/app/guards/airline.guard.ts
- [x] T010 Create airline dashboard container in frontend/src/app/pages/airline/

### Phase 3: US1 - Route Management
- [x] T011 Create sidebar navigation in frontend/src/app/components/airline/sidebar/
- [x] T012 Create overview page in frontend/src/app/pages/airline/overview/
- [x] T013 [US1] Implement route CRUD methods in frontend/src/app/services/airline.service.ts
- [x] T014 [US1] Create routes list page in frontend/src/app/pages/airline/routes/routes-list/
- [x] T015 [P] [US1] Create confirmation dialog in frontend/src/app/components/airline/confirmation-dialog/
- [x] T016 [US1] Create route form page in frontend/src/app/pages/airline/routes/route-form/

### Phase 4: US2 - Aircraft Management
- [x] T017 [US2] Implement aircraft CRUD methods in frontend/src/app/services/airline.service.ts
- [x] T018 [US2] Create aircraft list page in frontend/src/app/pages/airline/aircraft/aircraft-list/
- [x] T019 [P] [US2] Create seat config builder in frontend/src/app/components/airline/seat-config-builder/
- [x] T020 [US2] Create aircraft form page in frontend/src/app/pages/airline/aircraft/aircraft-form/
- [x] T021 [P] [US2] Create mock flights data in frontend/src/app/mock-data/airline-flights.data.ts
- [x] T022 [US2] Add flights state to AirlineService
- [x] T023 [US2] Add scheduled flights warning to aircraft form

### Phase 5: US3 - Flight Scheduling
- [x] T024 [US3] Implement flight CRUD in frontend/src/app/services/airline.service.ts
- [x] T025 [US3] Create flights list page in frontend/src/app/pages/airline/flights/flights-list/
- [x] T026 [US3] Create flight form page in frontend/src/app/pages/airline/flights/flight-form/
- [x] T027 [P] [US3] Create calendar view in frontend/src/app/pages/airline/flights/flights-calendar/
- [x] T028 [US3] Integrate calendar with flights list
- [x] T029 [US3] Implement flight status management
- [x] T030 [US3] Add pricing fields to flight form
- [x] T031 [US3] Add conflict detection modal

### Phase 6: US4 - Ticket Pricing
- [x] T032 [US4] Create pricing list page in frontend/src/app/pages/airline/pricing/pricing-list/
- [x] T033 [US4] Implement inline price editing
- [x] T034 [US4] Implement bulk pricing functionality
- [x] T035 [US4] Add pricing update methods to AirlineService

### Phase 7: US5 - Statistics Dashboard
- [x] T036 [P] [US5] Create stat card component in frontend/src/app/components/airline/stat-card/
- [x] T037 [US5] Implement getStatistics in AirlineService
- [x] T038 [US5] Create statistics page in frontend/src/app/pages/airline/statistics/
- [x] T039 [P] [US5] Implement popular routes bar chart
- [x] T040 [P] [US5] Implement revenue trend line chart
- [x] T041 [P] [US5] Implement flight status pie chart
- [x] T042 [US5] Implement CSV export functionality

### Phase 8: Polish
- [x] T043 Add loading states to all pages
- [x] T044 Add error handling throughout
- [x] T045 Final build verification and testing

---

## MVP Scope

**Recommended MVP**: Complete through US1 (Route Management)
- Tasks: T001-T016 (16 tasks)
- Delivers: Working dashboard with sidebar, overview, and route CRUD
- Can be demoed and tested independently

**Full Implementation**: All 45 tasks
