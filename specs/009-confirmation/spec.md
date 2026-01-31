# Feature Specification: Booking Confirmation

**Feature Branch**: `009-confirmation`
**Created**: 2025-01-31
**Status**: Draft
**Input**: Booking Confirmation page displayed after successful payment (SPEC-003D)

## Dependencies

- **Requires**: 008-payment (Successful payment processing and confirmation number)
- **Required by**: None (Final step in booking flow)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Confirmation Details (Priority: P1)

As a traveler who has completed payment, I want to see my booking confirmation with all details so I know my reservation is confirmed.

**Why this priority**: Confirmation display is the core purpose of this page - users need immediate reassurance their booking succeeded.

**Independent Test**: Navigate to confirmation page after payment, verify confirmation number and all booking details are displayed.

**Acceptance Scenarios**:

1. **Given** I complete payment successfully, **When** I am redirected to confirmation page, **Then** I see a prominent confirmation number (e.g., "TRP-2025-ABC123")
2. **Given** I am on the confirmation page, **When** I view my booking, **Then** I see complete flight details (departure/arrival cities, dates, times, airline)
3. **Given** I booked for multiple passengers, **When** I view the confirmation, **Then** I see all passenger names with their seat assignments
4. **Given** I view the confirmation, **When** I look at pricing, **Then** I see the total amount charged with itemized breakdown

---

### User Story 2 - Receive Confirmation Notification (Priority: P1)

As a traveler, I want to see that a confirmation email has been sent so I have a record of my booking.

**Why this priority**: Email confirmation gives users confidence and provides a backup record of their booking.

**Independent Test**: View confirmation page, verify email sent notification is displayed.

**Acceptance Scenarios**:

1. **Given** I am on the confirmation page, **When** I look for email status, **Then** I see a message "Confirmation sent to [email]" (mock display)
2. **Given** no email is provided, **When** I view confirmation, **Then** the email notification section is hidden

---

### User Story 3 - Print or Save Confirmation (Priority: P2)

As a traveler, I want to be able to print or save my confirmation so I have a physical/digital copy for my records.

**Why this priority**: Print functionality is helpful but secondary to viewing the confirmation.

**Independent Test**: Click print button, verify browser print dialog opens with confirmation content.

**Acceptance Scenarios**:

1. **Given** I am on the confirmation page, **When** I click "Print Confirmation", **Then** the browser print dialog opens
2. **Given** I am viewing on mobile, **When** I want to save, **Then** I can use browser share/save functionality

---

### User Story 4 - Start New Booking (Priority: P1)

As a traveler who has completed a booking, I want to easily start a new flight search so I can book additional trips.

**Why this priority**: Clear call-to-action for next steps improves user experience and business value.

**Independent Test**: Click "Book Another Flight" button, verify navigation to home page with fresh search.

**Acceptance Scenarios**:

1. **Given** I am on the confirmation page, **When** I click "Book Another Flight", **Then** I am navigated to the home page
2. **Given** I start a new booking, **When** I arrive at home page, **Then** the search form is cleared and ready for new input

---

### Edge Cases

- What happens if user directly navigates to /confirmation without completing payment? → Redirect to home page
- What happens if user refreshes confirmation page? → Display same confirmation (data persisted)
- What happens if confirmation number is missing? → Show generic "Booking Confirmed" without number
- What happens on very long passenger lists? → Show scrollable list, all passengers visible
- What happens if user navigates back from confirmation? → Allow back navigation (booking is complete)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display confirmation number prominently at top of page
- **FR-002**: System MUST display success message indicating booking is confirmed
- **FR-003**: System MUST display complete flight details (origin, destination, dates, times, airline, flight number)
- **FR-004**: System MUST display outbound flight details
- **FR-005**: System MUST display return flight details (if round trip)
- **FR-006**: System MUST display all passenger names with their seat assignments
- **FR-007**: System MUST display payment summary (total charged, last 4 digits of card used)
- **FR-008**: System MUST display itemized price breakdown (base fare, seat fees, taxes, total)
- **FR-009**: System MUST display mock "Confirmation email sent to [email]" notification
- **FR-010**: System MUST provide "Print Confirmation" button that triggers browser print
- **FR-011**: System MUST provide "Book Another Flight" button linking to home page
- **FR-012**: System MUST redirect to home if accessed without valid confirmation data
- **FR-013**: System MUST persist confirmation data to allow page refresh
- **FR-014**: Page layout MUST match Figma design for confirmation page
- **FR-015**: Page MUST be responsive for mobile devices

### Key Entities

- **BookingConfirmation**: Confirmation number, booking date/time, status
- **FlightDetails**: Flight number, airline, departure/arrival cities, dates, times
- **PassengerSummary**: Name, seat assignment per flight
- **PaymentSummary**: Total charged, card type, last 4 digits, price breakdown

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Confirmation page loads within 1 second after payment completion
- **SC-002**: Confirmation number is visible without scrolling on desktop and mobile
- **SC-003**: All booking details from previous steps are accurately displayed
- **SC-004**: Print functionality generates readable output with all confirmation details
- **SC-005**: Users can start a new booking within 2 clicks from confirmation
- **SC-006**: Page renders correctly on both desktop (min 1024px) and mobile (320px) viewports

## Assumptions

- Confirmation number is generated by PaymentService upon successful payment
- Confirmation data is stored in session/local storage for page refresh persistence
- Email notification is mock display only (no actual email sent)
- Print uses browser's native print functionality
- Confirmation page is the final step - no navigation to previous booking steps allowed
- Booking data is cleared from session when starting a new booking
- Confirmation format: "TRP-YYYY-XXXXXX" where YYYY is year and X is alphanumeric
