# Feature Specification: Flight Search Form

**Feature Branch**: `002-search-form`
**Created**: 2025-01-30
**Status**: Draft
**Input**: User description: "Flight search form component for landing page with origin, destination, dates, and passenger selection"

## Clarifications

### Session 2025-01-30

- Q: Should passenger types include infants (lap) separate from children? → A: No, only Adults + Children categories (no infant distinction)
- Q: When should autocomplete suggestions appear for airport/city fields? → A: After 2 characters typed

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Search for Round-Trip Flights (Priority: P1)

As a traveler, I want to enter my travel details (origin, destination, dates, passengers) so I can search for available flights.

**Why this priority**: This is the core functionality of the application. Without a search form, users cannot find or book flights.

**Independent Test**: Can be fully tested by loading the landing page, filling out the form fields, and clicking search to verify form submission.

**Acceptance Scenarios**:

1. **Given** I am on the landing page, **When** the page loads, **Then** I see a flight search form with fields for origin, destination, departure date, return date, and passengers
2. **Given** I am viewing the search form, **When** I click on the origin field, **Then** I can type or select an airport/city
3. **Given** I am viewing the search form, **When** I click on the destination field, **Then** I can type or select an airport/city
4. **Given** I have entered origin and destination, **When** I click on departure date, **Then** a date picker appears allowing me to select a future date
5. **Given** Round-trip is selected, **When** I view the form, **Then** I see both departure and return date fields
6. **Given** I have filled all required fields, **When** I click "Search", **Then** I am taken to the search results page with my search criteria

---

### User Story 2 - Search for One-Way Flights (Priority: P1)

As a traveler booking a one-way trip, I want to toggle between round-trip and one-way options so I can search without specifying a return date.

**Why this priority**: One-way flights are a common use case and essential for complete booking functionality.

**Independent Test**: Can be tested by selecting one-way option and verifying return date field disappears.

**Acceptance Scenarios**:

1. **Given** I am viewing the search form, **When** I select "One-way", **Then** the return date field is hidden
2. **Given** One-way is selected, **When** I fill origin, destination, departure date, and passengers, **Then** I can submit the search
3. **Given** I switch from one-way to round-trip, **When** the form updates, **Then** the return date field becomes visible again

---

### User Story 3 - Select Number of Passengers (Priority: P2)

As a traveler booking for a group, I want to specify the number of adult and child passengers so I can find flights with appropriate availability.

**Why this priority**: Passenger count affects pricing and availability but the form can work with a default of 1 adult.

**Independent Test**: Can be tested by clicking passenger selector and adjusting counts.

**Acceptance Scenarios**:

1. **Given** I am viewing the search form, **When** I click on the passengers field, **Then** I see options to select number of adults and children
2. **Given** the passenger selector is open, **When** I increase adults to 2, **Then** the display updates to show "2 Adults"
3. **Given** the passenger selector is open, **When** I add 1 child, **Then** the display updates to show "2 Adults, 1 Child"
4. **Given** I have selected passengers, **When** I click outside the selector, **Then** it closes and shows the summary (e.g., "3 passengers")

---

### User Story 4 - Swap Origin and Destination (Priority: P3)

As a traveler, I want to quickly swap my origin and destination so I can easily search for return flights or correct mistakes.

**Why this priority**: Nice-to-have feature that improves user experience but not essential for basic search.

**Independent Test**: Can be tested by entering origin/destination and clicking swap button.

**Acceptance Scenarios**:

1. **Given** I have entered "Istanbul" as origin and "London" as destination, **When** I click the swap button, **Then** origin becomes "London" and destination becomes "Istanbul"

---

### Edge Cases

- What happens when user selects a departure date in the past? → Date picker should only allow future dates
- What happens when return date is before departure date? → System prevents this selection or shows validation error
- What happens when user searches without filling required fields? → Validation messages appear for empty required fields
- What happens when origin and destination are the same? → System shows validation error
- How does system handle very long airport/city names? → Text is truncated with ellipsis

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a flight search form on the landing page
- **FR-002**: System MUST provide trip type selection (round-trip / one-way)
- **FR-003**: System MUST provide origin airport/city input with autocomplete (triggers after 2 characters)
- **FR-004**: System MUST provide destination airport/city input with autocomplete (triggers after 2 characters)
- **FR-005**: System MUST provide departure date picker that only allows future dates
- **FR-006**: System MUST provide return date picker when round-trip is selected
- **FR-007**: System MUST provide passenger selector for adults (default: 1, age 12+) and children (default: 0, age 2-11). No infant category.
- **FR-008**: System MUST provide a swap button to exchange origin and destination
- **FR-009**: System MUST validate that all required fields are filled before search
- **FR-010**: System MUST validate that origin and destination are different
- **FR-011**: System MUST validate that return date is on or after departure date
- **FR-012**: System MUST navigate to search results page with search parameters on form submission
- **FR-013**: Form MUST be responsive and usable on mobile devices

### Key Entities

- **SearchCriteria**: Contains trip type, origin, destination, departure date, return date (optional), adults count, children count
- **Airport/City**: Represents a selectable location with code, name, and country

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete a flight search in under 30 seconds
- **SC-002**: 95% of users successfully submit their first search without encountering validation errors
- **SC-003**: Form loads and is interactive within 2 seconds on standard connections
- **SC-004**: Mobile users can complete search with the same ease as desktop users (no horizontal scrolling required)

## Assumptions

- Airport/city data will be provided via a backend API or static dataset
- Date picker will use browser-native or a standard UI component
- Default trip type is round-trip
- Minimum 1 adult passenger required
- Maximum passenger count will follow airline industry standards (typically 9 total)
