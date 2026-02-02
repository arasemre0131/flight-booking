# Feature Specification: Payment Method

**Feature Branch**: `008-payment`
**Created**: 2025-01-31
**Status**: Draft
**Input**: Payment Method page for completing flight booking (SPEC-003C)

## Dependencies

- **Requires**: 007-seat-selection (Seat assignments and final pricing)
- **Required by**: 009-confirmation (Booking confirmation page)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter Payment Information (Priority: P1)

As a traveler who has selected flights and seats, I want to enter my payment details so I can complete my booking.

**Why this priority**: Payment entry is the core functionality - without it, no booking can be completed.

**Independent Test**: Navigate to payment page, fill in credit card details, verify form accepts valid input and shows validation errors for invalid input.

**Acceptance Scenarios**:

1. **Given** I am on the payment page, **When** I view the form, **Then** I see fields for card number, expiration date, CVV, and cardholder name
2. **Given** I enter a valid card number, **When** I move to the next field, **Then** the card type (Visa, Mastercard, etc.) is detected and displayed
3. **Given** I enter an invalid card number, **When** I try to submit, **Then** I see a clear error message
4. **Given** I enter an expired date, **When** I try to submit, **Then** I see an error indicating the card is expired
5. **Given** all payment fields are valid, **When** I review my entry, **Then** the card number is masked except for last 4 digits

---

### User Story 2 - Review Booking Summary (Priority: P1)

As a traveler, I want to see a complete summary of my booking (flights, passengers, seats, total price) before paying so I can verify everything is correct.

**Why this priority**: Users need to confirm their booking details before committing to payment.

**Independent Test**: View payment page, verify all booking details are displayed including flight info, passenger names, seat assignments, and itemized pricing.

**Acceptance Scenarios**:

1. **Given** I am on the payment page, **When** I view the summary, **Then** I see my selected flight details (route, times, airline)
2. **Given** I have multiple passengers, **When** I view the summary, **Then** I see all passenger names listed
3. **Given** I selected seats, **When** I view the summary, **Then** I see seat assignments for each passenger
4. **Given** I have seat upgrade fees, **When** I view the pricing, **Then** I see base fare, seat fees, and total as separate line items
5. **Given** I want to make changes, **When** I click "Edit" on any section, **Then** I can navigate back to modify that part of my booking

---

### User Story 3 - Enter Billing Address (Priority: P2)

As a traveler, I want to enter my billing address for payment verification.

**Why this priority**: Billing address is required for card verification but is secondary to the card details themselves.

**Independent Test**: Fill in billing address fields, verify form validation for required fields.

**Acceptance Scenarios**:

1. **Given** I am entering billing details, **When** I view the form, **Then** I see fields for street address, city, state/province, postal code, and country
2. **Given** I select a country, **When** I view the state field, **Then** appropriate state/province options are shown (or free text for countries without states)
3. **Given** I leave required fields empty, **When** I try to submit, **Then** I see validation errors for missing fields

---

### User Story 4 - Complete Payment (Priority: P1)

As a traveler who has entered valid payment details, I want to submit my payment and complete my booking.

**Why this priority**: Payment submission is the final critical step to complete the booking flow.

**Independent Test**: With valid payment and billing info, click "Pay Now", verify processing state and navigation to confirmation.

**Acceptance Scenarios**:

1. **Given** all payment and billing fields are valid, **When** I click "Pay Now", **Then** I see a processing indicator
2. **Given** payment is processing, **When** I wait, **Then** the button is disabled to prevent duplicate submissions
3. **Given** payment succeeds (mock), **When** processing completes, **Then** I am navigated to the confirmation page
4. **Given** payment fails (mock scenario), **When** processing completes, **Then** I see an error message and can retry

---

### Edge Cases

- What happens if user refreshes the page? → Payment form data should be cleared for security, booking data preserved
- What happens if user navigates back? → Return to seat selection with data preserved
- What happens if user has no seats selected? → Show booking summary without seat fees
- What happens if session expires during payment? → Show session expired message with option to restart
- What happens on mobile? → Form should be responsive with appropriate input types (numeric keyboard for card)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a payment form with card number, expiration date (MM/YY), CVV, and cardholder name fields
- **FR-002**: System MUST detect and display card type (Visa, Mastercard, Amex) based on card number prefix
- **FR-003**: System MUST validate card number format using Luhn algorithm
- **FR-004**: System MUST validate expiration date is not in the past
- **FR-005**: System MUST validate CVV is 3 digits (4 for Amex)
- **FR-006**: System MUST mask card number display showing only last 4 digits after entry
- **FR-007**: System MUST display billing address form with street, city, state, postal code, country
- **FR-008**: System MUST display complete booking summary (flight, passengers, seats, price breakdown)
- **FR-009**: System MUST show itemized pricing: base fare, seat fees (if any), taxes/fees, total
- **FR-010**: System MUST provide "Pay Now" button that is enabled only when form is valid
- **FR-011**: System MUST show processing state during payment submission
- **FR-012**: System MUST prevent duplicate submissions while processing
- **FR-013**: System MUST navigate to confirmation page on successful payment (mock)
- **FR-014**: System MUST display error message if payment fails (mock scenario)
- **FR-015**: System MUST allow navigation back to seat selection
- **FR-016**: Page layout MUST be two columns: payment form (left) and booking summary (right) on desktop
- **FR-017**: Page layout MUST be responsive for mobile devices

### Key Entities

- **PaymentDetails**: Card number, expiration (month/year), CVV, cardholder name, card type
- **BillingAddress**: Street, city, state/province, postal code, country
- **PriceSummary**: Base fare, seat fees, taxes/fees, total amount

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete payment form entry in under 2 minutes
- **SC-002**: Card type detection displays within 1 second of entering card prefix
- **SC-003**: Form validation errors are displayed inline, immediately after field blur
- **SC-004**: Payment processing state is clearly visible during submission
- **SC-005**: Page is fully functional on both desktop and mobile viewports
- **SC-006**: All booking details from previous steps are accurately displayed in summary

## Assumptions

- Payment is simulated (no real payment gateway integration)
- Mock payment always succeeds after brief delay (1-2 seconds)
- Mock payment failure can be triggered with specific test card number (e.g., 4000000000000002)
- Card validation is client-side only (Luhn algorithm, format checks)
- No saved payment methods or remember card functionality
- Taxes/fees are calculated as flat percentage of base fare (mock: 10%)
- Billing address is required for all payments
- Supported card types: Visa, Mastercard, American Express
