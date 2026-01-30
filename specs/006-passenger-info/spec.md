# Feature Specification: Passenger Information Form

**Feature Branch**: `006-passenger-info`
**Created**: 2025-01-31
**Status**: Draft
**Input**: Passenger information form for collecting traveler details during the booking flow

## Dependencies

- **Requires**: 004-search-results (Selected flight data), 005-search-sidebar (Booking flow entry)
- **Required by**: 007-seat-selection (Seat Selection page), 008-payment (Payment page)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter Passenger Details (Priority: P1)

As a traveler booking a flight, I want to enter my personal information so the airline has the required details for my reservation.

**Why this priority**: Passenger information is legally required for flight bookings and is the first step in the booking flow after flight selection.

**Independent Test**: Navigate to passenger info page with selected flight, fill in passenger details form, verify data is captured correctly.

**Acceptance Scenarios**:

1. **Given** I have selected a flight, **When** I proceed to booking, **Then** I see a passenger information form with fields for each traveler
2. **Given** I am on the passenger info page, **When** I view the form, **Then** I see fields for: first name, middle name (optional), last name, date of birth, email, and phone number
3. **Given** I am filling in my details, **When** I enter valid information in all required fields, **Then** the form shows no validation errors
4. **Given** I have multiple passengers, **When** I view the form, **Then** I see separate sections for each passenger based on the booking (e.g., 2 adults, 1 child)

---

### User Story 2 - View Selected Flight Summary (Priority: P1)

As a traveler, I want to see a summary of my selected flight on the passenger info page so I can confirm I'm booking the correct trip.

**Why this priority**: Users need to verify they're booking the right flight before entering personal information.

**Independent Test**: Navigate to passenger info page, verify flight summary displays with correct departure/arrival cities, times, dates, and price.

**Acceptance Scenarios**:

1. **Given** I am on the passenger info page, **When** I look at the sidebar/summary, **Then** I see the selected flight details (route, times, airline)
2. **Given** I view the flight summary, **When** I examine the details, **Then** I see the total price for all passengers
3. **Given** I have round-trip flights, **When** I view the summary, **Then** I see both outbound and return flight information

---

### User Story 3 - Validate and Submit Passenger Information (Priority: P1)

As a traveler, I want the form to validate my input so I don't make mistakes that could cause booking issues.

**Why this priority**: Validation prevents booking errors and ensures data quality for airline systems.

**Independent Test**: Submit form with invalid data, verify appropriate error messages display. Submit with valid data, verify navigation to next step.

**Acceptance Scenarios**:

1. **Given** I submit the form with empty required fields, **When** validation runs, **Then** I see error messages indicating which fields need to be filled
2. **Given** I enter an invalid email format, **When** I move to the next field or submit, **Then** I see an error message for invalid email
3. **Given** I enter an invalid phone number, **When** validation runs, **Then** I see an error message for invalid phone format
4. **Given** all fields are valid, **When** I click "Save and continue" or similar, **Then** I proceed to the seat selection page

---

### User Story 4 - Emergency Contact Information (Priority: P2)

As a traveler, I want to provide emergency contact information for safety purposes.

**Why this priority**: Emergency contact is standard for flight bookings but secondary to primary passenger data.

**Independent Test**: Fill in emergency contact section, verify data is captured and optional fields work correctly.

**Acceptance Scenarios**:

1. **Given** I am on the passenger info page, **When** I scroll to the emergency contact section, **Then** I see fields for emergency contact name and phone number
2. **Given** I fill in emergency contact details, **When** I submit the form, **Then** the emergency contact information is saved with the booking

---

### Edge Cases

- What happens if the user navigates back from seat selection? → Passenger info form should retain previously entered data
- What happens if a passenger is a minor (child)? → Form adjusts to not require email for children, parent/guardian info used
- What happens if phone number format varies by country? → Accept international formats with country code
- What happens if the user refreshes the page? → Data should be retained in session/local storage
- What happens if the user is logged in? → Pre-fill form with saved profile information

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a passenger information form with sections for each traveler in the booking
- **FR-002**: Each passenger section MUST collect: first name, middle name (optional), last name, suffix (optional), date of birth
- **FR-003**: Primary passenger section MUST collect: email address and phone number
- **FR-004**: System MUST display a flight summary sidebar showing selected flight details and total price
- **FR-005**: Form MUST validate required fields before allowing submission
- **FR-006**: System MUST display clear error messages for invalid or missing required fields
- **FR-007**: Email field MUST validate proper email format
- **FR-008**: Phone field MUST accept international phone number formats
- **FR-009**: Date of birth MUST use a date picker or formatted input (MM/DD/YYYY)
- **FR-010**: System MUST provide a "Save and continue" button to proceed to seat selection
- **FR-011**: Form MUST label required fields clearly (asterisk or "Required" indicator)
- **FR-012**: Emergency contact section MUST collect: contact name, contact phone number (optional section)
- **FR-013**: Page layout MUST be two columns: form (left) and flight summary (right) on desktop
- **FR-014**: Page layout MUST stack to single column on mobile (form above summary)
- **FR-015**: System SHOULD pre-fill logged-in user's information if available

### Key Entities

- **Passenger**: Contains firstName, middleName, lastName, suffix, dateOfBirth, email (primary only), phone (primary only)
- **EmergencyContact**: Contains name, phoneNumber
- **BookingDraft**: Contains passengers array, selectedFlight, emergencyContact, totalPrice

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the passenger information form in under 3 minutes per passenger
- **SC-002**: Form validation catches 100% of invalid email and phone formats before submission
- **SC-003**: All required passenger fields are clearly marked and validated
- **SC-004**: Flight summary displays accurate pricing matching selected flight
- **SC-005**: Page is fully functional on both desktop and mobile viewports
- **SC-006**: Form data persists if user navigates back and forth in the booking flow

## Assumptions

- Passenger information is collected for frontend display only (no real airline API integration yet)
- Form submission navigates to seat selection page (mock flow)
- Number of passenger forms matches the search criteria (adults + children from search)
- Phone numbers can include country codes in various formats
- Date of birth is used for age verification (adult vs child fare) in display only
- TSA/Known Traveler Number fields are out of scope for MVP
- Passport information is out of scope for MVP (domestic flights focus)
- Bags/luggage selection is out of scope for this spec (could be added later)
- Payment information is collected on a separate page (003-C)
