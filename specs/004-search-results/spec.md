# Feature Specification: Search Results - Flight List

**Feature Branch**: `004-search-results`
**Created**: 2025-01-30
**Status**: Draft
**Input**: Search results page displaying flight options with filters, allowing users to browse and select flights

## Dependencies

- **Requires**: 001-header-footer (Header/Footer), 002-search-form (Search Form - compact mode), 003-landing-content (Landing page integration)
- **Required by**: Seat selection and booking flow (future features)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Search Results (Priority: P1)

As a traveler who has searched for flights, I want to see a list of available flight options so I can compare and choose the best one for my trip.

**Why this priority**: This is the core functionality of the search results page - displaying flight options is essential for users to make booking decisions.

**Independent Test**: Navigate to search results page with valid search parameters, verify flight cards display with correct information.

**Acceptance Scenarios**:

1. **Given** I have submitted a flight search, **When** the results page loads, **Then** I see a list of available flights matching my search criteria
2. **Given** I am viewing search results, **When** I look at a flight card, **Then** I see the airline logo, flight duration, departure/arrival times, number of stops, and price
3. **Given** there are more flights than initially shown, **When** I click "Show all flights", **Then** I see the complete list of available flights
4. **Given** a flight has a layover, **When** I view the flight card, **Then** I see the layover duration and airport code (e.g., "2h 45m in HNL")

---

### User Story 2 - Modify Search from Results Page (Priority: P1)

As a traveler viewing results, I want to modify my search criteria without going back to the landing page so I can quickly adjust my travel plans.

**Why this priority**: Users frequently need to adjust dates or destinations after seeing initial results.

**Independent Test**: On results page, modify search criteria and verify new results load.

**Acceptance Scenarios**:

1. **Given** I am on the search results page, **When** I view the top of the page, **Then** I see a compact search bar with my current search criteria pre-filled
2. **Given** I want to change my search, **When** I modify the origin, destination, dates, or passengers, **Then** the search form updates accordingly
3. **Given** I have modified search criteria, **When** I click search, **Then** the results refresh with flights matching the new criteria

---

### User Story 3 - Filter Flight Results (Priority: P2)

As a traveler with specific preferences, I want to filter flight results by price, stops, times, airlines, and seat class so I can find flights that match my needs.

**Why this priority**: Filters significantly improve the user experience but results can be browsed without them.

**Independent Test**: Apply filters and verify the displayed flights match the filter criteria.

**Acceptance Scenarios**:

1. **Given** I am viewing search results, **When** I look at the filter bar, **Then** I see filter options for: Max price, Stops, Times, Airlines, Seat class, and More
2. **Given** I select a filter (e.g., "Nonstop only"), **When** the filter is applied, **Then** only flights matching the criteria are displayed
3. **Given** I have applied multiple filters, **When** I view the results, **Then** only flights matching ALL selected filters are shown
4. **Given** I want to clear filters, **When** I deselect or reset a filter, **Then** the full results list is restored

---

### User Story 4 - Select a Flight (Priority: P1)

As a traveler ready to book, I want to select a flight from the results so I can proceed with the booking process.

**Why this priority**: Flight selection is the primary action on this page leading to conversion.

**Independent Test**: Click on a flight card and verify selection state changes visually.

**Acceptance Scenarios**:

1. **Given** I am viewing flight results, **When** I hover over a flight card, **Then** the card shows a hover effect (background color change)
2. **Given** I want to select a flight, **When** I click on a flight card, **Then** the card shows a selected state (visual indicator like border)
3. **Given** I have selected a flight, **When** I proceed to the next step, **Then** the selected flight information is retained

---

### Edge Cases

- What happens when no flights match the search criteria? → Display "No flights found" message with suggestion to modify search
- What happens when filters exclude all results? → Display "No flights match your filters" with option to clear filters
- What happens when the user searches for a past date? → Validation prevents past date selection (handled by search form)
- How are flights with multiple legs displayed? → Show total duration with layover details for each stop
- What happens when airline logo is unavailable? → Display placeholder with airline code

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a compact search bar at the top of the results page with current search criteria
- **FR-002**: System MUST display a filter bar with dropdown options for: Max price, Stops, Times, Airlines, Seat class, More
- **FR-003**: System MUST display a title "Choose a departing flight" above the flight list
- **FR-004**: System MUST display flight results as cards showing: airline logo, duration, departure/arrival times, stops info, and price
- **FR-005**: Each flight card MUST show airline name beneath the duration
- **FR-006**: Flight cards with stops MUST display layover information (duration and airport code)
- **FR-007**: Flight cards without stops MUST display "Nonstop"
- **FR-008**: System MUST display a "Show all flights" button when more flights are available
- **FR-009**: Flight cards MUST have a hover effect (light purple background)
- **FR-010**: Selected flight cards MUST have a visual indicator (purple left border)
- **FR-011**: Page layout MUST be two columns: flight list (left) and sidebar area (right) on desktop
- **FR-012**: Page layout MUST stack to single column on mobile (flights above sidebar)
- **FR-013**: Filter dropdowns MUST have purple border when active/expanded

### Key Entities

- **Flight**: Contains id, airline info, departure time/airport, arrival time/airport, duration, stops count, stop details, price
- **Airline**: Contains code, name, logo path, brand color
- **SearchCriteria**: Contains origin, destination, dates, passengers (from search form)
- **Filter**: Contains filter type, selected values, and active state

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Search results page loads with flight cards within 2 seconds of navigation
- **SC-002**: Users can view and understand flight options (duration, price, stops) at a glance
- **SC-003**: Filter interactions update the visible results within 500ms
- **SC-004**: 90% of users can successfully select a flight without confusion
- **SC-005**: Page is fully functional on both desktop and mobile viewports
- **SC-006**: All flight cards display consistently with correct information alignment

## Assumptions

- Search results are displayed from mock data initially (no backend integration yet)
- Default display shows 6 flights; "Show all" reveals the complete list
- Price displayed is total round-trip price in USD
- Time format uses 12-hour clock with AM/PM
- Airline logos are available as SVG files in assets
- Filter functionality filters client-side mock data (no server-side filtering)
- Two-column layout breakpoint is 768px (mobile transition)
- Sidebar content (SPEC-002B) will be implemented separately
