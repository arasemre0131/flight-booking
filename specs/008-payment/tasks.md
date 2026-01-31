# Tasks: Payment Method

**Feature**: 008-payment | **Generated**: 2025-01-31

## Overview

| Metric | Value |
|--------|-------|
| Total Tasks | 32 |
| Phases | 7 |
| User Stories | 4 |
| Parallel Opportunities | 12 |

## User Story Mapping

| Story | Priority | Tasks | Description |
|-------|----------|-------|-------------|
| US1 | P1 | T008-T014 | Enter Payment Information |
| US2 | P1 | T015-T019 | Review Booking Summary |
| US3 | P2 | T020-T024 | Enter Billing Address |
| US4 | P1 | T025-T029 | Complete Payment |

---

## Phase 1: Setup

**Goal**: Initialize models, utilities, and mock data required by all user stories.

- [x] T001 [P] Create PaymentDetails, BillingAddress, PriceSummary, PaymentResult interfaces in `frontend/src/app/models/payment.model.ts`
- [x] T002 [P] Create card validation utilities (Luhn, detectCardType, formatCardNumber, maskCardNumber, getCvvLength) in `frontend/src/app/utils/card-validation.ts`
- [x] T003 [P] Create Country and State interfaces with mock data (COUNTRIES, STATES_BY_COUNTRY) in `frontend/src/app/mock-data/countries.data.ts`
- [x] T004 Extend BookingDraft interface with paymentDetails, billingAddress, confirmationNumber fields in `frontend/src/app/models/booking.model.ts`

---

## Phase 2: Foundational Services

**Goal**: Extend BookingService and create PaymentService before UI components.

- [x] T005 Extend BookingService with paymentDetails, billingAddress, confirmationNumber signals in `frontend/src/app/services/booking.service.ts`
- [x] T006 Add updatePaymentDetails, updateBillingAddress, setConfirmationNumber methods to BookingService in `frontend/src/app/services/booking.service.ts`
- [x] T007 Add calculatePriceSummary method to BookingService (baseFare, seatFees, taxesAndFees, total) in `frontend/src/app/services/booking.service.ts`

---

## Phase 3: User Story 1 - Enter Payment Information (P1)

**Goal**: Implement credit card form with validation, card type detection, and masking.

**Independent Test**: Navigate to payment page, fill in credit card details, verify form accepts valid input and shows validation errors for invalid input.

**Acceptance Criteria**:
- Card number, expiration date (MM/YY), CVV, cardholder name fields displayed
- Card type (Visa, MC, Amex) detected and icon displayed based on BIN prefix
- Invalid card shows clear error message (Luhn validation)
- Expired date shows error
- Card number masked (•••• •••• •••• 1234) after blur

### Tasks

- [x] T008 [P] [US1] Create PaymentForm component scaffold (standalone, ReactiveFormsModule) in `frontend/src/app/components/payment-form/payment-form.ts`
- [x] T009 [P] [US1] Create PaymentForm template with card number, expiry (month/year), CVV, cardholder name fields in `frontend/src/app/components/payment-form/payment-form.html`
- [x] T010 [P] [US1] Create PaymentForm styles matching Figma design in `frontend/src/app/components/payment-form/payment-form.scss`
- [x] T011 [US1] Implement Luhn validator and card type detection in PaymentForm in `frontend/src/app/components/payment-form/payment-form.ts`
- [x] T012 [US1] Implement expiry date validation (not in past) in PaymentForm in `frontend/src/app/components/payment-form/payment-form.ts`
- [x] T013 [US1] Implement CVV validation (3 digits, 4 for Amex) based on detected card type in `frontend/src/app/components/payment-form/payment-form.ts`
- [x] T014 [US1] Implement card number masking on blur (show •••• •••• •••• 1234) in `frontend/src/app/components/payment-form/payment-form.ts`

---

## Phase 4: User Story 2 - Review Booking Summary (P1)

**Goal**: Display complete booking summary with flight details, passengers, seats, and itemized pricing.

**Independent Test**: View payment page, verify all booking details are displayed including flight info, passenger names, seat assignments, and itemized pricing.

**Acceptance Criteria**:
- Flight details (route, times, airline) displayed
- All passenger names listed
- Seat assignments shown for each passenger
- Itemized pricing: base fare, seat fees, taxes/fees, total
- Edit links navigate back to modify booking sections

### Tasks

- [x] T015 [P] [US2] Create BookingSummary component scaffold (standalone) in `frontend/src/app/components/booking-summary/booking-summary.ts`
- [x] T016 [P] [US2] Create BookingSummary template with flight details, passengers, seats, pricing sections in `frontend/src/app/components/booking-summary/booking-summary.html`
- [x] T017 [P] [US2] Create BookingSummary styles matching Figma design in `frontend/src/app/components/booking-summary/booking-summary.scss`
- [x] T018 [US2] Implement BookingSummary logic with BookingService integration (flights, passengers, seatAssignments, priceSummary) in `frontend/src/app/components/booking-summary/booking-summary.ts`
- [x] T019 [US2] Add Edit links to navigate back to passenger-info and seat-selection in `frontend/src/app/components/booking-summary/booking-summary.ts`

---

## Phase 5: User Story 3 - Enter Billing Address (P2)

**Goal**: Implement billing address form with country/state dropdown and validation.

**Independent Test**: Fill in billing address fields, verify form validation for required fields.

**Acceptance Criteria**:
- Street, city, state/province, postal code, country fields displayed
- Country dropdown with state/province options based on selection
- Free text state field for countries without states
- Required field validation errors on submit

### Tasks

- [x] T020 [P] [US3] Create BillingForm component scaffold (standalone, ReactiveFormsModule) in `frontend/src/app/components/billing-form/billing-form.ts`
- [x] T021 [P] [US3] Create BillingForm template with street, city, state, postalCode, country fields in `frontend/src/app/components/billing-form/billing-form.html`
- [x] T022 [P] [US3] Create BillingForm styles matching Figma design in `frontend/src/app/components/billing-form/billing-form.scss`
- [x] T023 [US3] Implement country dropdown with COUNTRIES data and state dropdown toggle in `frontend/src/app/components/billing-form/billing-form.ts`
- [x] T024 [US3] Implement required field validation and error display in `frontend/src/app/components/billing-form/billing-form.ts`

---

## Phase 6: User Story 4 - Complete Payment (P1)

**Goal**: Implement payment submission with processing state, success/error handling, and navigation.

**Independent Test**: With valid payment and billing info, click "Pay Now", verify processing state and navigation to confirmation.

**Acceptance Criteria**:
- Pay Now button enabled only when all forms valid
- Processing indicator shown during payment
- Button disabled to prevent duplicate submissions
- Success navigates to confirmation page
- Failure shows error message with retry option

### Tasks

- [x] T025 Create PaymentService with processPayment method (1.5s delay, test card failure) in `frontend/src/app/services/payment.service.ts`
- [x] T026 [P] [US4] Create PaymentPage scaffold (standalone) in `frontend/src/app/pages/payment/payment.ts`
- [x] T027 [P] [US4] Create PaymentPage template with two-column layout (forms left, summary right) in `frontend/src/app/pages/payment/payment.html`
- [x] T028 [P] [US4] Create PaymentPage styles with responsive breakpoint at 768px in `frontend/src/app/pages/payment/payment.scss`
- [x] T029 [US4] Implement PaymentPage logic (form validation, processing state, payment submission, navigation) in `frontend/src/app/pages/payment/payment.ts`

---

## Phase 7: Polish & Integration

**Goal**: Add route, back navigation, edge case handling, and final integration.

- [x] T030 Add /payment route with lazy loading in `frontend/src/app/app.routes.ts`
- [x] T031 Add back navigation button to seat-selection page in `frontend/src/app/pages/payment/payment.html`
- [x] T032 Add mobile input types (numeric keyboard for card number, CVV) in `frontend/src/app/components/payment-form/payment-form.html`

---

## Dependencies

```
T001-T003 (parallel) → T004 → T005-T007 (sequential)
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
              US1 (T008-T014)  US2 (T015-T019)  US3 (T020-T024)
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                                    ▼
                              US4 (T025-T029)
                                    │
                                    ▼
                              Polish (T030-T032)
```

## Parallel Execution Opportunities

### Phase 1 (Setup)
```
T001 ─┬─ T002 ─┬─ T003
      │        │
      └────────┴──► T004
```

### Phase 3 (US1) + Phase 4 (US2) + Phase 5 (US3)
```
After T007 completes:

T008 ─┬─ T009 ─┬─ T010    T015 ─┬─ T016 ─┬─ T017    T020 ─┬─ T021 ─┬─ T022
      │        │                │        │                │        │
      └────────┴──► T011...     └────────┴──► T018...     └────────┴──► T023...
```

### Phase 6 (US4)
```
T025 ──► T026 ─┬─ T027 ─┬─ T028
               │        │
               └────────┴──► T029
```

## Implementation Strategy

### MVP (Minimum Viable)
Complete US1 + US4 for basic payment flow:
- Payment form with validation
- Pay Now with processing state
- Navigation to confirmation

### Incremental Delivery
1. **Increment 1**: US1 (Payment Form) - Core card entry
2. **Increment 2**: US4 (Complete Payment) - End-to-end flow
3. **Increment 3**: US2 (Booking Summary) - User confirmation
4. **Increment 4**: US3 (Billing Address) - Full form completion

## Files Created/Modified

| File | Action | Phase |
|------|--------|-------|
| `models/payment.model.ts` | Create | 1 |
| `utils/card-validation.ts` | Create | 1 |
| `mock-data/countries.data.ts` | Create | 1 |
| `models/booking.model.ts` | Modify | 1 |
| `services/booking.service.ts` | Modify | 2 |
| `services/payment.service.ts` | Create | 6 |
| `components/payment-form/*` | Create | 3 |
| `components/booking-summary/*` | Create | 4 |
| `components/billing-form/*` | Create | 5 |
| `pages/payment/*` | Create | 6 |
| `app.routes.ts` | Modify | 7 |
