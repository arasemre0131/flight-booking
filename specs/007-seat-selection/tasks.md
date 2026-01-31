# Tasks: Seat Selection

**Feature**: 007-seat-selection | **Generated**: 2025-01-31

## Overview

| Metric | Value |
|--------|-------|
| Total Tasks | 41 |
| User Stories | 4 |
| Phases | 7 |
| Parallel Opportunities | 12 |

## User Story Mapping

| Story | Priority | Tasks | Independent Test |
|-------|----------|-------|------------------|
| US1: View Seat Map | P1 | T010-T016 | Navigate to page, verify seat map displays with rows and availability |
| US2: Select Seats | P1 | T017-T023 | Click seats, verify assignment to passengers |
| US3: Pricing | P2 | T024-T027 | Select premium seats, verify total updates |
| US4: Proceed to Payment | P1 | T028-T035 | Select seats, click continue, verify navigation |

---

## Phase 1: Setup

**Goal**: Project initialization and model definitions

- [x] T001 [P] Create Seat, SeatStatus, SeatType interfaces in `frontend/src/app/models/seat.model.ts`
- [x] T002 [P] Create SeatRow interface in `frontend/src/app/models/seat.model.ts`
- [x] T003 [P] Create SeatMap interface in `frontend/src/app/models/seat.model.ts`
- [x] T004 [P] Create SeatAssignment interface in `frontend/src/app/models/seat.model.ts`
- [x] T005 Extend BookingDraft with seatAssignments and seatFees in `frontend/src/app/models/booking.model.ts`

---

## Phase 2: Foundational

**Goal**: Mock data and service layer for seat management

- [x] T006 Create mock seat map data with aircraft layout in `frontend/src/app/mock-data/seat-map.data.ts`
- [x] T007 Add updateSeatAssignments method to BookingService in `frontend/src/app/services/booking.service.ts`
- [x] T008 Add initializeSeatAssignments method to BookingService in `frontend/src/app/services/booking.service.ts`
- [x] T009 Add seatAssignments and seatFees computed signals to BookingService in `frontend/src/app/services/booking.service.ts`

---

## Phase 3: User Story 1 - View Aircraft Seat Map (P1)

**Goal**: Display visual seat map with rows, columns, and seat availability

**Independent Test**: Navigate to seat selection page, verify aircraft seat map displays with rows, columns, and seat availability indicated.

- [x] T010 [P] [US1] Create seat-legend component files in `frontend/src/app/components/seat-legend/`
- [x] T011 [US1] Implement seat-legend with seat type indicators in `frontend/src/app/components/seat-legend/seat-legend.ts`
- [x] T012 [US1] Style seat-legend with color coding in `frontend/src/app/components/seat-legend/seat-legend.scss`
- [x] T013 [P] [US1] Create seat-map component files in `frontend/src/app/components/seat-map/`
- [x] T014 [US1] Implement seat-map with CSS Grid layout in `frontend/src/app/components/seat-map/seat-map.ts`
- [x] T015 [US1] Implement seat rendering with row numbers and letters in `frontend/src/app/components/seat-map/seat-map.html`
- [x] T016 [US1] Style seat-map with status colors (available/occupied/selected) in `frontend/src/app/components/seat-map/seat-map.scss`

---

## Phase 4: User Story 2 - Select Seats for Passengers (P1)

**Goal**: Enable seat selection and passenger assignment

**Independent Test**: Click on available seats to assign them to passengers, verify seats are marked as selected and passenger assignments are tracked.

- [x] T017 [P] [US2] Create passenger-seat-list component files in `frontend/src/app/components/passenger-seat-list/`
- [x] T018 [US2] Implement passenger-seat-list showing assignments in `frontend/src/app/components/passenger-seat-list/passenger-seat-list.ts`
- [x] T019 [US2] Style passenger-seat-list in `frontend/src/app/components/passenger-seat-list/passenger-seat-list.scss`
- [x] T020 [US2] Add seat click handler to seat-map component in `frontend/src/app/components/seat-map/seat-map.ts`
- [x] T021 [US2] Implement seat selection logic (assign to first unassigned passenger) in `frontend/src/app/components/seat-map/seat-map.ts`
- [x] T022 [US2] Implement seat deselection on re-click in `frontend/src/app/components/seat-map/seat-map.ts`
- [x] T023 [US2] Add seatSelect output event to seat-map component in `frontend/src/app/components/seat-map/seat-map.ts`

---

## Phase 5: User Story 3 - View Seat Pricing and Upgrades (P2)

**Goal**: Display seat pricing and update booking total with upgrade fees

**Independent Test**: View seats with different prices, verify price indicators are visible and total updates when selecting premium seats.

- [x] T024 [US3] Add price indicator to premium seats in seat-map template in `frontend/src/app/components/seat-map/seat-map.html`
- [x] T025 [US3] Add seat fee calculation helper function in `frontend/src/app/models/seat.model.ts`
- [x] T026 [US3] Update flight-summary to display seat fees line item in `frontend/src/app/components/flight-summary/flight-summary.html`
- [x] T027 [US3] Update flight-summary to compute total with seat fees in `frontend/src/app/components/flight-summary/flight-summary.ts`

---

## Phase 6: User Story 4 - Proceed to Payment (P1)

**Goal**: Navigation flow with continue/skip/back functionality

**Independent Test**: After selecting seats for all passengers, click continue button and verify navigation to payment page.

**Note**: FR-014 (flight-summary sidebar) is satisfied by reusing the existing flight-summary component from 006-passenger-info in T029-T030.

- [x] T028 [P] [US4] Create seat-selection page files in `frontend/src/app/pages/seat-selection/`
- [x] T029 [US4] Implement seat-selection page with two-column layout in `frontend/src/app/pages/seat-selection/seat-selection.ts`
- [x] T030 [US4] Create seat-selection page template with all components in `frontend/src/app/pages/seat-selection/seat-selection.html`
- [x] T031 [US4] Style seat-selection page with responsive layout in `frontend/src/app/pages/seat-selection/seat-selection.scss`
- [x] T032 [US4] Add Continue button with validation (all seats assigned or skip) in `frontend/src/app/pages/seat-selection/seat-selection.html`
- [x] T033 [US4] Add Skip seat selection option in `frontend/src/app/pages/seat-selection/seat-selection.html`
- [x] T034 [US4] Add /seat-selection route in `frontend/src/app/app.routes.ts`
- [x] T035 [US4] Add navigation from passenger-info to seat-selection in `frontend/src/app/pages/passenger-info/passenger-info.ts`

---

## Phase 7: Polish & Cross-Cutting

**Goal**: Mobile responsiveness, edge cases, and final integration

- [x] T036 Add horizontal scroll for seat map on mobile in `frontend/src/app/components/seat-map/seat-map.scss`
- [x] T037 Add touch-action CSS for mobile interaction in `frontend/src/app/components/seat-map/seat-map.scss`
- [x] T038 Add back navigation to passenger-info in `frontend/src/app/pages/seat-selection/seat-selection.ts`
- [x] T039 Verify session storage persistence for seat assignments in `frontend/src/app/services/booking.service.ts`
- [x] T040 Add occupied seat tooltip/cursor in `frontend/src/app/components/seat-map/seat-map.scss`
- [x] T041 Run ng serve and verify build in terminal

---

## Dependencies

```
T001-T004 (Models) ─────► T005 (BookingDraft extension)
                              │
T006 (Mock data) ─────────────┤
                              ▼
                         T007-T009 (Service layer)
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              T010-T016 (US1)     T017-T023 (US2)
              Seat Map Display    Seat Selection
                    │                   │
                    └─────────┬─────────┘
                              ▼
                         T024-T027 (US3)
                         Pricing
                              │
                              ▼
                         T028-T035 (US4)
                         Page & Navigation
                              │
                              ▼
                         T036-T041 (Polish)
```

## Parallel Execution Opportunities

### Phase 1 (All parallel)
```
T001 ─┬─ T002 ─┬─ T003 ─┬─ T004
      └────────┴────────┴────────► T005
```

### Phase 3 (Components parallel)
```
T010-T012 (seat-legend) ─┬─ T013-T016 (seat-map)
                         └────────────────────────►
```

### Phase 4 (passenger-seat-list parallel with seat-map updates)
```
T017-T019 (passenger-seat-list) ─┬─ T020-T023 (seat selection logic)
                                 └────────────────────────────────►
```

---

## Implementation Strategy

### MVP Scope (User Stories 1 + 2)
- Minimum viable: Seat map display + basic seat selection
- Tasks: T001-T023
- Deliverable: Working seat map with passenger assignment

### Full Feature
- All 4 user stories including pricing and navigation
- Tasks: T001-T041
- Deliverable: Complete seat selection flow

### Edge Case Notes
- **Seat unavailability during selection**: N/A for mock data approach. Real-time inventory conflicts would require backend integration (out of scope per spec assumptions).

### Incremental Delivery
1. **Increment 1**: Models + Mock Data (T001-T006)
2. **Increment 2**: Service Layer (T007-T009)
3. **Increment 3**: Seat Map Display (T010-T016) → US1 testable
4. **Increment 4**: Seat Selection (T017-T023) → US2 testable
5. **Increment 5**: Pricing (T024-T027) → US3 testable
6. **Increment 6**: Page Integration (T028-T035) → US4 testable
7. **Increment 7**: Polish (T036-T041) → Full feature complete
