# Tasks: Booking Confirmation

**Feature**: 009-confirmation | **Generated**: 2025-01-31

## Overview

| Metric | Value |
|--------|-------|
| Total Tasks | 15 |
| Phases | 5 |
| User Stories | 4 |
| Parallel Opportunities | 5 |

## User Story Mapping

| Story | Priority | Tasks | Description |
|-------|----------|-------|-------------|
| US1 | P1 | T002-T007 | View Confirmation Details |
| US2 | P1 | T008-T009 | Receive Confirmation Notification |
| US3 | P2 | T010-T011 | Print or Save Confirmation |
| US4 | P1 | T012-T013 | Start New Booking |

---

## Phase 1: Setup

**Goal**: Extend BookingService with clearBooking method required by US4.

- [x] T001 Add clearBooking() method to BookingService in `frontend/src/app/services/booking.service.ts`

---

## Phase 2: User Story 1 - View Confirmation Details (P1)

**Goal**: Display booking confirmation with all details (confirmation number, flights, passengers, seats, pricing).

**Independent Test**: Navigate to confirmation page after payment, verify confirmation number and all booking details are displayed.

**Acceptance Criteria**:
- Confirmation number displayed prominently at top
- Flight details shown (outbound and return if applicable)
- All passenger names listed with seat assignments
- Itemized price breakdown displayed
- Card payment summary shown (masked)

### Tasks

- [x] T002 [P] [US1] Create ConfirmationPage component scaffold (standalone) in `frontend/src/app/pages/confirmation/confirmation.ts`
- [x] T003 [P] [US1] Create ConfirmationPage template with confirmation header, flight details, passengers, payment summary in `frontend/src/app/pages/confirmation/confirmation.html`
- [x] T004 [P] [US1] Create ConfirmationPage styles matching Figma design in `frontend/src/app/pages/confirmation/confirmation.scss`
- [x] T005 [US1] Implement ConfirmationPage logic (computed signals, helper methods, redirect guard) in `frontend/src/app/pages/confirmation/confirmation.ts`
- [x] T006 [US1] Implement flight details section showing outbound and return flights in `frontend/src/app/pages/confirmation/confirmation.html`
- [x] T007 [US1] Implement passenger list with seat assignments per flight in `frontend/src/app/pages/confirmation/confirmation.html`

---

## Phase 3: User Story 2 - Receive Confirmation Notification (P1)

**Goal**: Display mock email confirmation notification.

**Independent Test**: View confirmation page, verify email sent notification is displayed when email exists.

**Acceptance Criteria**:
- "Confirmation sent to [email]" message displayed
- Email notification hidden if no email provided

### Tasks

- [x] T008 [US2] Implement email notification section (show if email exists) in `frontend/src/app/pages/confirmation/confirmation.html`
- [x] T009 [US2] Add getPrimaryEmail() helper method in `frontend/src/app/pages/confirmation/confirmation.ts`

---

## Phase 4: User Story 3 - Print or Save Confirmation (P2)

**Goal**: Enable users to print their confirmation using browser print.

**Independent Test**: Click print button, verify browser print dialog opens with confirmation content.

**Acceptance Criteria**:
- "Print Confirmation" button visible
- Browser print dialog opens on click
- Print output hides buttons and navigation

### Tasks

- [x] T010 [US3] Implement printConfirmation() method using window.print() in `frontend/src/app/pages/confirmation/confirmation.ts`
- [x] T011 [US3] Add @media print styles to hide buttons and optimize layout in `frontend/src/app/pages/confirmation/confirmation.scss`

---

## Phase 5: User Story 4 - Start New Booking (P1)

**Goal**: Allow users to start a fresh booking from confirmation page.

**Independent Test**: Click "Book Another Flight" button, verify navigation to home page with cleared data.

**Acceptance Criteria**:
- "Book Another Flight" button visible
- Clicking clears booking data and navigates to home
- Home page shows fresh search form

### Tasks

- [x] T012 [US4] Implement bookAnotherFlight() method (clear booking, navigate home) in `frontend/src/app/pages/confirmation/confirmation.ts`
- [x] T013 [US4] Add "Book Another Flight" button with styling in `frontend/src/app/pages/confirmation/confirmation.html`

---

## Phase 6: Polish & Integration

**Goal**: Add route, handle edge cases, finalize responsive design.

- [x] T014 Add /confirmation route with lazy loading in `frontend/src/app/app.routes.ts`
- [x] T015 Implement no-booking state (redirect or fallback UI) in `frontend/src/app/pages/confirmation/confirmation.html`

---

## Dependencies

```
T001 (Setup: clearBooking method)
  │
  └──► T002-T004 (parallel scaffolding)
         │
         └──► T005-T007 (US1 implementation)
                │
                ├──► T008-T009 (US2: Email notification)
                │
                ├──► T010-T011 (US3: Print functionality)
                │
                └──► T012-T013 (US4: New booking)
                       │
                       └──► T014-T015 (Polish)
```

## Parallel Execution Opportunities

### Phase 2 (US1) - Scaffold
```
T002 ─┬─ T003 ─┬─ T004
      │        │
      └────────┴──► T005-T007
```

### After US1 Completion
```
US2 (T008-T009) ─┬─ US3 (T010-T011) ─┬─ US4 (T012-T013)
                 │                   │
                 └───────────────────┴──► T014-T015
```

## Implementation Strategy

### MVP (Minimum Viable)
Complete US1 only:
- Confirmation number display
- Flight details
- Passenger list with seats
- Payment summary

### Incremental Delivery
1. **Increment 1**: US1 (Core confirmation display)
2. **Increment 2**: US4 (New booking flow - important for UX)
3. **Increment 3**: US2 (Email notification - simple addition)
4. **Increment 4**: US3 (Print functionality - nice to have)

## Files Created/Modified

| File | Action | Phase |
|------|--------|-------|
| `services/booking.service.ts` | Modify | 1 |
| `pages/confirmation/confirmation.ts` | Create | 2 |
| `pages/confirmation/confirmation.html` | Create | 2 |
| `pages/confirmation/confirmation.scss` | Create | 2 |
| `app.routes.ts` | Modify | 6 |
