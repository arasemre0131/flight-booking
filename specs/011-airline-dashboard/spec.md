# 011-airline-dashboard

**Status**: SPECIFIED
**Created**: 2025-01-31
**Branch**: `011-airline-dashboard`

---

## Summary

Airline dashboard that enables airline operators to manage their flight operations, including creating and managing routes, registering aircraft with seat configurations, scheduling flights, setting ticket prices, and viewing business statistics. This dashboard is accessible only to users with the "airline" role after being invited by an admin.

---

## User Stories

### US1: Route Management
**As an** airline operator,
**I want to** create and manage flight routes,
**So that** I can define the origin and destination pairs my airline serves.

**Acceptance Criteria**:
- AC1: I can create a new route by specifying origin airport, destination airport, and flight number prefix
- AC2: I can view a list of all my airline's routes with search and filter
- AC3: I can edit an existing route's details
- AC4: I can deactivate a route (soft delete to preserve flight history)
- AC5: I cannot create duplicate routes (same origin-destination-flight number combination)

### US2: Aircraft Management
**As an** airline operator,
**I want to** register my aircraft with seat configurations,
**So that** I can assign them to flights and define available seats.

**Acceptance Criteria**:
- AC1: I can register a new aircraft with model, registration number, and seat layout
- AC2: I can define seat configuration per class (economy, business, first class)
- AC3: I can specify seats per row and number of rows for each class
- AC4: I can view all registered aircraft in a list
- AC5: I can edit aircraft details (but not reduce seats if flights are scheduled)
- AC6: I can deactivate an aircraft no longer in service

### US3: Flight Scheduling
**As an** airline operator,
**I want to** schedule flights by assigning aircraft to routes with specific times,
**So that** passengers can search and book these flights.

**Acceptance Criteria**:
- AC1: I can create a flight by selecting a route, aircraft, departure datetime, and arrival datetime
- AC2: System prevents scheduling conflicts (same aircraft at overlapping times)
- AC3: I can view all scheduled flights with filters (date range, route, status)
- AC4: I can edit flight details until boarding begins
- AC5: I can cancel a flight (triggers passenger notifications in future)
- AC6: I can see seat availability summary for each flight

### US4: Ticket Pricing
**As an** airline operator,
**I want to** set ticket prices for each flight and class,
**So that** passengers see accurate pricing when booking.

**Acceptance Criteria**:
- AC1: I can set base price per seat class (economy, business, first class)
- AC2: I can set additional fees for seat selection (aisle, window, extra legroom)
- AC3: Prices are in a consistent currency (EUR or USD based on airline preference)
- AC4: I can update prices anytime before departure
- AC5: Price changes do not affect already purchased tickets

### US5: Statistics Dashboard
**As an** airline operator,
**I want to** view statistics about my airline's performance,
**So that** I can make informed business decisions.

**Acceptance Criteria**:
- AC1: I can see total passengers booked in a time period
- AC2: I can see total revenue generated in a time period
- AC3: I can see most popular routes by passenger count
- AC4: I can see flight load factor (percentage of seats sold)
- AC5: I can filter statistics by date range
- AC6: Statistics are displayed with charts and summary cards

---

## Functional Requirements

### Navigation & Layout
- FR-001: Dashboard accessible via `/airline` route (protected by airline role)
- FR-002: Sidebar navigation with sections: Overview, Routes, Aircraft, Flights, Pricing, Statistics
- FR-003: Header displays airline name and user info with logout option
- FR-004: Responsive layout supporting desktop (primary) and tablet views

### Route Management
- FR-005: Routes list page with table showing: flight number, origin, destination, status, actions
- FR-006: Create/Edit route form with fields: origin airport (autocomplete), destination airport (autocomplete), flight number prefix
- FR-007: Route status toggle (active/inactive)
- FR-008: Confirmation dialog before deactivating routes with scheduled flights

### Aircraft Management
- FR-009: Aircraft list page showing: registration, model, total seats, class breakdown, status
- FR-010: Create/Edit aircraft form with visual seat configuration builder
- FR-011: Seat configuration inputs per class: number of rows, seats per row
- FR-012: Automatic total seat calculation displayed in real-time
- FR-013: Aircraft cannot be deleted if assigned to future flights (show warning)

### Flight Scheduling
- FR-014: Flight list page with filters: date range, route, aircraft, status
- FR-015: Calendar view option for flight visualization
- FR-016: Create flight form: select route (dropdown), select aircraft (dropdown), departure datetime, arrival datetime
- FR-017: Auto-calculate flight duration and display
- FR-018: Conflict detection: warn if aircraft is already scheduled at selected time
- FR-019: Flight status management: scheduled → boarding → departed → arrived, or cancelled
- FR-020: Seat availability badge showing "X/Y seats available"

### Pricing Management
- FR-021: Pricing page shows all flights with current prices
- FR-022: Inline editing for quick price updates
- FR-023: Bulk pricing option: apply same prices to multiple flights on same route
- FR-024: Price validation: must be positive numbers, business > economy, first > business

### Statistics Dashboard
- FR-025: Overview cards: total flights, total passengers, total revenue, average load factor
- FR-026: Time period selector: today, this week, this month, custom range
- FR-027: Popular routes chart (bar chart showing top 5 routes by passengers)
- FR-028: Revenue trend chart (line chart showing revenue over time)
- FR-029: Flight status breakdown (pie chart: completed, cancelled, scheduled)
- FR-030: Export statistics to CSV option

---

## User Scenarios & Testing

### Scenario 1: Airline Creates a New Route
**Preconditions**: Airline user is logged in
**Steps**:
1. Navigate to Routes section
2. Click "Add Route" button
3. Select origin airport (e.g., "Venice VCE")
4. Select destination airport (e.g., "London LHR")
5. Enter flight number prefix (e.g., "AZ")
6. Click "Create Route"
**Expected**: Route appears in list with "Active" status

### Scenario 2: Airline Registers an Aircraft
**Preconditions**: Airline user is logged in
**Steps**:
1. Navigate to Aircraft section
2. Click "Add Aircraft"
3. Enter model: "Airbus A320"
4. Enter registration: "I-ABCD"
5. Configure economy: 25 rows, 6 seats per row (150 seats)
6. Configure business: 5 rows, 4 seats per row (20 seats)
7. Click "Register Aircraft"
**Expected**: Aircraft appears in list showing "170 total seats (150 economy, 20 business)"

### Scenario 3: Airline Schedules a Flight
**Preconditions**: Route and aircraft exist
**Steps**:
1. Navigate to Flights section
2. Click "Schedule Flight"
3. Select route: "VCE → LHR (AZ)"
4. Select aircraft: "I-ABCD (A320)"
5. Set departure: 2025-02-15 08:00
6. Set arrival: 2025-02-15 10:30
7. Click "Create Flight"
**Expected**: Flight appears with status "Scheduled", duration "2h 30m", "170/170 seats available"

### Scenario 4: Airline Sets Pricing
**Preconditions**: Flight exists
**Steps**:
1. Navigate to Pricing section
2. Find the VCE → LHR flight on Feb 15
3. Set economy price: €99
4. Set business price: €249
5. Save changes
**Expected**: Prices saved and visible in flight list

### Scenario 5: Airline Views Statistics
**Preconditions**: Airline has some completed flights with bookings
**Steps**:
1. Navigate to Statistics section
2. Select time period: "This Month"
**Expected**: Dashboard shows passenger count, revenue, popular routes chart, load factor

---

## Edge Cases

### EC-001: Duplicate Route Prevention
- **Trigger**: Create route with same origin, destination, flight number as existing
- **Expected**: Error message "Route already exists", form stays open

### EC-002: Aircraft Conflict on Scheduling
- **Trigger**: Schedule flight with aircraft that's already assigned at overlapping time
- **Expected**: Warning "Aircraft I-ABCD is scheduled for Flight AZ101 at this time"

### EC-003: Deactivate Route with Scheduled Flights
- **Trigger**: Deactivate route that has future flights scheduled
- **Expected**: Confirmation dialog listing affected flights, require explicit confirmation

### EC-004: Edit Aircraft with Scheduled Flights
- **Trigger**: Reduce seat count on aircraft with upcoming flights
- **Expected**: Warning if new capacity < booked seats count, block if oversold

### EC-005: Price Validation Failure
- **Trigger**: Set business price lower than economy
- **Expected**: Error "Business class price must be higher than economy"

---

## Key Entities

### Route
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| originAirport | string | IATA code (e.g., "VCE") |
| destinationAirport | string | IATA code (e.g., "LHR") |
| flightNumberPrefix | string | Airline code + number (e.g., "AZ100") |
| isActive | boolean | Whether route is currently operational |

### Aircraft
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| model | string | Aircraft model name |
| registration | string | Unique registration code |
| economyConfig | object | {rows: number, seatsPerRow: number} |
| businessConfig | object | {rows: number, seatsPerRow: number} |
| firstClassConfig | object | Optional {rows: number, seatsPerRow: number} |
| totalSeats | number | Calculated total |
| isActive | boolean | Whether aircraft is in service |

### Flight
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| routeId | string | Reference to Route |
| aircraftId | string | Reference to Aircraft |
| departureTime | datetime | Scheduled departure |
| arrivalTime | datetime | Scheduled arrival |
| status | enum | scheduled, boarding, departed, arrived, cancelled |
| pricing | object | {economy: number, business: number, firstClass?: number} |

### Statistics (Aggregated)
| Metric | Description |
|--------|-------------|
| totalPassengers | Count of tickets sold in period |
| totalRevenue | Sum of ticket prices in period |
| loadFactor | Average (booked seats / total seats) % |
| topRoutes | Routes ranked by passenger count |

---

## Dependencies

- **010-auth**: Airline authentication and role-based access
- **BE-001**: Backend auth API for airline login
- **BE-002**: Backend airline management API for routes, aircraft, flights
- **BE-005**: Backend statistics API for dashboard data
- **002-search-form**: Reuse airport autocomplete component

---

## Assumptions

1. Airline users are invited by admin and have pre-created accounts
2. Each airline user belongs to exactly one airline company
3. Currency is fixed per airline (configurable in admin settings, default EUR)
4. Statistics are calculated server-side to ensure consistency
5. Time zones are handled consistently (all times stored in UTC, displayed in local)
6. Mock data will be used until backend API is implemented
7. First class is optional - airlines can have only economy and business

---

## Out of Scope

- Real-time flight status updates (separate spec: 013-realtime-seats)
- Multi-user management within an airline (single operator per airline for MVP)
- Revenue forecasting or advanced analytics
- Flight crew management
- Maintenance scheduling
- Code-share agreements between airlines

---

## Success Criteria

1. Airline operators can create routes in under 2 minutes
2. Aircraft registration with seat configuration completes in under 3 minutes
3. Flight scheduling completes in under 2 minutes
4. All management lists support search/filter with results in under 1 second
5. Statistics dashboard loads with visualizations in under 3 seconds
6. Zero data loss when editing or deactivating entities with dependencies
7. All forms provide clear validation feedback before submission
