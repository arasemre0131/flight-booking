# Feature Specification: Airline Management API

**Feature ID**: 015-airline-api (BE-002)
**Created**: 2026-02-01
**Status**: Draft

---

## Overview

Backend API for airlines to manage their routes, aircraft, and flights. Only authenticated airline users can access these endpoints.

---

## PDF Requirements (Section 2: Routes Management)

1. Creation of new routes
2. Creation of new aircraft
3. Creation of flights (aircraft flying a specific route at a specific time)
4. Setting costs for each type of tickets
5. View statistics (BE-005, separate spec)

---

## User Stories

### US1: Route Management
**As an** airline
**I want to** create and manage routes
**So that** I can define which airports I serve

**Acceptance Criteria**:
- Create route with origin airport, destination airport, flight number
- List my airline's routes
- Update route (activate/deactivate)
- Delete route (if no active flights)

### US2: Aircraft Management
**As an** airline
**I want to** register my aircraft
**So that** I can assign them to flights

**Acceptance Criteria**:
- Create aircraft with model, registration number, seat configuration
- Seat configuration: economy rows/seats, business rows/seats
- List my airline's aircraft
- Update aircraft details
- Delete aircraft (if no active flights)

### US3: Flight Management
**As an** airline
**I want to** create flights
**So that** passengers can search and book them

**Acceptance Criteria**:
- Create flight by assigning aircraft to route with date/time
- Set departure and arrival times
- Flight status: scheduled, departed, arrived, cancelled
- List my airline's flights
- Update flight details
- Cancel flight

### US4: Pricing
**As an** airline
**I want to** set ticket prices
**So that** passengers know how much to pay

**Acceptance Criteria**:
- Set price for economy class
- Set price for business class
- Update prices anytime

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/airlines/routes | Airline | List routes |
| POST | /api/airlines/routes | Airline | Create route |
| PUT | /api/airlines/routes/:id | Airline | Update route |
| DELETE | /api/airlines/routes/:id | Airline | Delete route |
| GET | /api/airlines/aircraft | Airline | List aircraft |
| POST | /api/airlines/aircraft | Airline | Create aircraft |
| PUT | /api/airlines/aircraft/:id | Airline | Update aircraft |
| DELETE | /api/airlines/aircraft/:id | Airline | Delete aircraft |
| GET | /api/airlines/flights | Airline | List flights |
| POST | /api/airlines/flights | Airline | Create flight |
| PUT | /api/airlines/flights/:id | Airline | Update flight |
| DELETE | /api/airlines/flights/:id | Airline | Cancel flight |
| PUT | /api/airlines/flights/:id/pricing | Airline | Set pricing |

---

## Data Model

### Route
```
{
  _id: ObjectId,
  airlineId: ObjectId,
  originAirport: string (IATA code, e.g. "SFO"),
  destinationAirport: string (IATA code, e.g. "NRT"),
  flightNumber: string (e.g. "HA101"),
  isActive: boolean,
  createdAt: Date
}
```

### Aircraft
```
{
  _id: ObjectId,
  airlineId: ObjectId,
  model: string (e.g. "Boeing 737-800"),
  registration: string (e.g. "N12345"),
  seatConfiguration: {
    economy: { rows: number, seatsPerRow: number },
    business: { rows: number, seatsPerRow: number }
  },
  totalSeats: number,
  createdAt: Date
}
```

### Flight
```
{
  _id: ObjectId,
  airlineId: ObjectId,
  routeId: ObjectId,
  aircraftId: ObjectId,
  departureTime: Date,
  arrivalTime: Date,
  pricing: {
    economy: number,
    business: number
  },
  status: 'scheduled' | 'departed' | 'arrived' | 'cancelled',
  createdAt: Date
}
```

---

## Out of Scope

- Route optimization
- Bulk import
- Schedule templates
- Crew management
- Overbooking logic

---

## Assumptions

1. Airlines can only manage their own resources (routes, aircraft, flights)
2. IATA airport codes are used (3-letter codes like SFO, NRT)
3. All prices are in USD
4. Flight times are stored in UTC
5. Seat configuration is per aircraft, not per flight
