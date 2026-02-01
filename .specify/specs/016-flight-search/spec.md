# BE-003: Flight Search API

## Overview
Public API endpoint that allows any user (including anonymous) to search for flights between two locations.

## PDF Requirements Reference
- "Any (unregistered) user can search for flight trips from two locations"
- "A trip may include up to 1 intermediate stop, provided there is enough time for the transfer (at least 2 hours)"
- "The application should allow sorting the available alternatives by various parameters, such as cost, duration, and number of stops"

## Functional Requirements

### FR-001: Search Flights
- **Endpoint**: `GET /api/flights/search`
- **Auth**: None (public)
- **Query Parameters**:
  - `origin` (required): Origin airport code (3 letters, e.g., "JFK")
  - `destination` (required): Destination airport code (3 letters, e.g., "LAX")
  - `date` (required): Departure date (YYYY-MM-DD)
  - `passengers` (optional, default: 1): Number of passengers
  - `class` (optional, default: "economy"): Ticket class ("economy" or "business")
  - `sortBy` (optional, default: "price"): Sort field ("price", "duration", "stops")
  - `sortOrder` (optional, default: "asc"): Sort order ("asc" or "desc")

### FR-002: Direct Flights
- Return flights where route.originAirport === origin AND route.destinationAirport === destination
- Flight status must be "scheduled"
- Departure date must match the search date

### FR-003: Connecting Flights (1 Stop)
- Find flight pairs: Flight A (origin → X) + Flight B (X → destination)
- Transfer time (Flight B departure - Flight A arrival) must be >= 2 hours and <= 8 hours
- Both flights must be on the same search date or next day (for overnight connections)
- Both flights must have status "scheduled"
- Flights can be from different airlines (no same-airline restriction)

### FR-004: Response Format
```json
{
  "results": [
    {
      "type": "direct",
      "pricePerPerson": 250,
      "totalDuration": 180,
      "stops": 0,
      "flights": [
        {
          "flightId": "...",
          "flightNumber": "AA123",
          "airline": { "id": "...", "name": "American Airlines", "code": "AA" },
          "origin": { "code": "JFK", "city": "New York" },
          "destination": { "code": "LAX", "city": "Los Angeles" },
          "departureTime": "2025-03-15T08:00:00Z",
          "arrivalTime": "2025-03-15T11:00:00Z",
          "duration": 180,
          "price": 250,
          "aircraft": { "model": "Boeing 737", "seatConfig": "3-3" },
          "availableSeats": { "economy": 120, "business": 12 }
        }
      ]
    },
    {
      "type": "connecting",
      "pricePerPerson": 320,
      "totalDuration": 420,
      "stops": 1,
      "layover": { "airport": "ORD", "city": "Chicago", "duration": 150 },
      "flights": [
        { ... },
        { ... }
      ]
    }
  ],
  "searchParams": {
    "origin": "JFK",
    "destination": "LAX",
    "date": "2025-03-15",
    "passengers": 1,
    "class": "economy"
  }
}
```

### FR-005: Available Seats Calculation
- For each flight, calculate available seats by class
- availableSeats = aircraft.totalSeats[class] - soldTickets[class]
- Only return flights with availableSeats >= passengers count

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `backend/src/services/search.service.ts` | Create | Flight search logic |
| `backend/src/routes/search.routes.ts` | Create | Public search endpoint |
| `backend/src/app.ts` | Modify | Add search routes |

## Clarifications

### Session 2026-02-01
- Q: Connecting flights same airline or any? → A: Any airline combination allowed
- Q: Maximum layover time for connections? → A: Max 8 hours
- Q: Price display per person or total? → A: Per person (pricePerPerson)

## Dependencies
- Requires: BE-002 (Route, Aircraft, Flight models exist)

## Test Scenarios
1. Search direct flight: JFK → LAX returns direct flights
2. Search with connection: JFK → MIA with ORD stop
3. No flights found: returns empty results array
4. Invalid airport code: returns 400 error
5. Sort by price ascending
6. Sort by duration descending
