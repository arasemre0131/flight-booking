# API Contracts: 011-airline-dashboard

**Note**: These contracts define the interface that mock services will implement.
When backend is built, these become the actual API endpoints.

---

## Routes API

### GET /api/airline/routes
List all routes for current airline.

**Response 200**:
```json
{
  "routes": [
    {
      "id": "route-001",
      "airlineId": "airline-001",
      "originAirport": "VCE",
      "destinationAirport": "LHR",
      "flightNumberPrefix": "AZ100",
      "isActive": true,
      "createdAt": "2025-01-31T10:00:00Z",
      "updatedAt": "2025-01-31T10:00:00Z"
    }
  ]
}
```

### POST /api/airline/routes
Create new route.

**Request**:
```json
{
  "originAirport": "VCE",
  "destinationAirport": "LHR",
  "flightNumberPrefix": "AZ100"
}
```

**Response 201**: Created route object

**Response 400**: `{ "error": "Route already exists" }`

### PUT /api/airline/routes/:id
Update route.

### DELETE /api/airline/routes/:id
Soft delete (set isActive = false).

---

## Aircraft API

### GET /api/airline/aircraft
List all aircraft.

### POST /api/airline/aircraft
Register new aircraft.

**Request**:
```json
{
  "model": "Airbus A320",
  "registration": "I-ABCD",
  "economyConfig": { "rows": 25, "seatsPerRow": 6 },
  "businessConfig": { "rows": 5, "seatsPerRow": 4 },
  "firstClassConfig": null
}
```

### PUT /api/airline/aircraft/:id
Update aircraft (with seat validation).

### DELETE /api/airline/aircraft/:id
Soft delete.

---

## Flights API

### GET /api/airline/flights
List flights with filters.

**Query params**:
- `startDate`: ISO date
- `endDate`: ISO date
- `routeId`: string
- `aircraftId`: string
- `status`: FlightStatus

### POST /api/airline/flights
Schedule new flight.

**Request**:
```json
{
  "routeId": "route-001",
  "aircraftId": "aircraft-001",
  "departureTime": "2025-02-15T08:00:00Z",
  "arrivalTime": "2025-02-15T10:30:00Z",
  "pricing": {
    "economy": 9900,
    "business": 24900,
    "firstClass": null
  },
  "seatFees": {
    "aisle": 500,
    "window": 500,
    "extraLegroom": 1500
  }
}
```

**Response 400**: `{ "error": "Aircraft conflict", "conflictingFlight": {...} }`

### PUT /api/airline/flights/:id
Update flight (only if status = scheduled).

### PUT /api/airline/flights/:id/status
Update flight status.

**Request**:
```json
{
  "status": "boarding"
}
```

### PUT /api/airline/flights/:id/pricing
Update flight pricing (bulk update supported).

---

## Statistics API

### GET /api/airline/statistics
Get airline statistics.

**Query params**:
- `startDate`: ISO date (required)
- `endDate`: ISO date (required)

**Response 200**:
```json
{
  "dateRange": {
    "start": "2025-01-01",
    "end": "2025-01-31"
  },
  "summary": {
    "totalFlights": 45,
    "totalPassengers": 5200,
    "totalRevenue": 520000,
    "averageLoadFactor": 78
  },
  "topRoutes": [
    {
      "routeId": "route-001",
      "origin": "VCE",
      "destination": "LHR",
      "passengerCount": 1200,
      "revenue": 120000
    }
  ],
  "revenueByDay": [
    { "date": "2025-01-01", "revenue": 15000 },
    { "date": "2025-01-02", "revenue": 18000 }
  ],
  "flightsByStatus": {
    "scheduled": 10,
    "completed": 32,
    "cancelled": 3
  }
}
```

### GET /api/airline/statistics/export
Export statistics as CSV.

**Response**: CSV file download
