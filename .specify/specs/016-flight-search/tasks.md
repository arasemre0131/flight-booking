# Tasks: BE-003 Flight Search API

## Summary
- **Total Tasks**: 6
- **Feature**: Public flight search endpoint (no auth)

---

## Phase 1: Setup

_No setup tasks - models already exist from BE-002_

---

## Phase 2: Implementation

### Goal: Implement flight search API with direct and connecting flight support

- [ ] T001 Create search service with direct flight query in `backend/src/services/search.service.ts`
- [ ] T002 Add connecting flight algorithm (2-8h layover) to `backend/src/services/search.service.ts`
- [ ] T003 Implement seat availability (return aircraft capacity for now) in `backend/src/services/search.service.ts`
- [ ] T004 Add result sorting (price, duration, stops) to `backend/src/services/search.service.ts`
- [ ] T005 Create search routes with validation in `backend/src/routes/search.routes.ts`
- [ ] T006 Register search routes in `backend/src/app.ts`

---

## Task Details

### T001: Direct Flight Query
```typescript
// searchFlights(params) → find flights where:
// - route.origin === params.origin
// - route.destination === params.destination
// - flight.departureTime is on params.date
// - flight.status === 'scheduled'
// - availableSeats >= params.passengers

// Include airport city mapping:
const AIRPORT_CITIES: Record<string, string> = {
  'JFK': 'New York', 'LAX': 'Los Angeles', 'ORD': 'Chicago',
  'MIA': 'Miami', 'SFO': 'San Francisco', 'ATL': 'Atlanta', ...
};
```

### T002: Connecting Flights
```typescript
// Algorithm:
// 1. Find flights A: origin → ANY on date
// 2. For each A, find flights B: A.destination → destination
// 3. Filter: B.departure >= A.arrival + 2h AND <= A.arrival + 8h
// 4. Combine as { type: 'connecting', flights: [A, B], layover: {...} }
```

### T003: Seat Availability
```typescript
// For each flight:
// - Get aircraft seat config (economy, business counts)
// - Return full capacity as availableSeats (no Ticket model yet)
// - When BE-004 is done: availableSeats = capacity - soldTickets
```

### T004: Sorting
```typescript
// sortBy: 'price' | 'duration' | 'stops'
// sortOrder: 'asc' | 'desc'
// For connections: price = sum of both flights
```

### T005: Route Validation
```typescript
// Query params:
// - origin: required, 3 letters uppercase
// - destination: required, 3 letters uppercase
// - date: required, YYYY-MM-DD
// - passengers: optional, default 1, max 9
// - class: optional, default 'economy'
// - sortBy: optional, default 'price'
// - sortOrder: optional, default 'asc'
```

### T006: App Integration
```typescript
// In app.ts:
import searchRoutes from './routes/search.routes';
app.use('/api/flights', searchRoutes);
```

---

## Verification

After all tasks complete:
1. `curl "http://localhost:3000/api/flights/search?origin=JFK&destination=LAX&date=2025-03-15"` → returns results
2. Invalid params → 400 error
3. No matching flights → empty results array
