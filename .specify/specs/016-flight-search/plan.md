# Implementation Plan: BE-003 Flight Search API

## Technical Context

| Aspect | Value |
|--------|-------|
| Tech Stack | Node.js + Express.js + TypeScript |
| Database | MongoDB with Mongoose |
| Auth Required | No (public endpoint) |
| Dependencies | BE-002 models (Route, Aircraft, Flight) |

## Phase 0: Research

No unknowns - spec is fully clarified:
- Connecting flights: Any airline combination ✓
- Layover time: 2-8 hours ✓
- Price format: Per person ✓

## Phase 1: Implementation

### Files to Create

1. **search.service.ts** - Core search logic
   - `searchFlights(params)` - Main search function
   - `findDirectFlights(origin, dest, date)` - Direct flight query
   - `findConnectingFlights(origin, dest, date)` - 1-stop connections
   - `calculateAvailableSeats(flight, class)` - Seat availability
   - `sortResults(results, sortBy, sortOrder)` - Result sorting

2. **search.routes.ts** - Express router
   - `GET /api/flights/search` - Public endpoint
   - Query validation with express-validator

3. **app.ts** - Add route import

### Algorithm: Connecting Flights

```
1. Find all flights departing from ORIGIN on DATE
2. For each flight A (origin → X):
   - Find flights B where:
     - B.origin === A.destination
     - B.destination === DESTINATION
     - B.departure >= A.arrival + 2 hours
     - B.departure <= A.arrival + 8 hours
3. Combine as connecting flight result
```

## Validation Rules

- origin: 3 uppercase letters
- destination: 3 uppercase letters
- date: YYYY-MM-DD format, not in past
- passengers: 1-9 integer
- class: "economy" | "business"
- sortBy: "price" | "duration" | "stops"
- sortOrder: "asc" | "desc"
