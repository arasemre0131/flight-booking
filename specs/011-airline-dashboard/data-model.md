# Data Model: 011-airline-dashboard

**Date**: 2025-01-31
**Feature**: Airline Dashboard

---

## Entities

### AirlineRoute

```typescript
interface AirlineRoute {
  id: string;                    // UUID
  airlineId: string;             // Reference to airline company
  originAirport: string;         // IATA code (e.g., "VCE")
  destinationAirport: string;    // IATA code (e.g., "LHR")
  flightNumberPrefix: string;    // e.g., "AZ100"
  isActive: boolean;             // Soft delete flag
  createdAt: string;             // ISO datetime
  updatedAt: string;             // ISO datetime
}

// Validation Rules:
// - originAirport: 3 uppercase letters (IATA code)
// - destinationAirport: 3 uppercase letters, != originAirport
// - flightNumberPrefix: 2 letters + 1-4 digits (e.g., "AZ123")
// - Unique constraint: (airlineId, originAirport, destinationAirport, flightNumberPrefix)
```

### Aircraft

```typescript
interface SeatClassConfig {
  rows: number;                  // 1-50
  seatsPerRow: number;           // 1-10
  totalSeats: number;            // Calculated: rows * seatsPerRow
}

interface Aircraft {
  id: string;                    // UUID
  airlineId: string;             // Reference to airline company
  model: string;                 // e.g., "Airbus A320"
  registration: string;          // e.g., "I-ABCD" (unique per airline)
  economyConfig: SeatClassConfig;
  businessConfig: SeatClassConfig | null;    // Optional
  firstClassConfig: SeatClassConfig | null;  // Optional
  totalSeats: number;            // Sum of all class seats
  isActive: boolean;             // Soft delete flag
  createdAt: string;
  updatedAt: string;
}

// Validation Rules:
// - model: 2-50 characters
// - registration: unique per airline, typically 5-7 alphanumeric
// - At least economyConfig must be provided
// - rows: 1-50, seatsPerRow: 1-10
```

### Flight (Extended)

```typescript
interface FlightPricing {
  economy: number;               // Price in cents (e.g., 9900 = €99.00)
  business: number | null;       // null if no business class
  firstClass: number | null;     // null if no first class
}

interface SeatFees {
  aisle: number;                 // Additional fee for aisle seat
  window: number;                // Additional fee for window seat
  extraLegroom: number;          // Additional fee for extra legroom
}

interface Flight {
  id: string;                    // UUID
  airlineId: string;
  routeId: string;               // Reference to AirlineRoute
  aircraftId: string;            // Reference to Aircraft
  flightNumber: string;          // e.g., "AZ100" (from route prefix + sequence)
  departureTime: string;         // ISO datetime
  arrivalTime: string;           // ISO datetime
  durationMinutes: number;       // Calculated: arrivalTime - departureTime
  status: FlightStatus;
  pricing: FlightPricing;
  seatFees: SeatFees;
  bookedSeats: number;           // Current bookings count
  createdAt: string;
  updatedAt: string;
}

type FlightStatus = 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';

// Validation Rules:
// - arrivalTime > departureTime
// - departureTime > now (for new flights)
// - pricing.business > pricing.economy (if business exists)
// - pricing.firstClass > pricing.business (if firstClass exists)
// - No aircraft scheduling conflicts (same aircraft, overlapping times)
```

### AirlineStats

```typescript
interface AirlineStats {
  dateRange: {
    start: string;               // ISO date
    end: string;                 // ISO date
  };
  summary: {
    totalFlights: number;
    totalPassengers: number;
    totalRevenue: number;        // In cents
    averageLoadFactor: number;   // Percentage (0-100)
  };
  topRoutes: Array<{
    routeId: string;
    origin: string;
    destination: string;
    passengerCount: number;
    revenue: number;
  }>;
  revenueByDay: Array<{
    date: string;                // ISO date
    revenue: number;
  }>;
  flightsByStatus: {
    scheduled: number;
    completed: number;           // departed + arrived
    cancelled: number;
  };
}
```

---

## State Transitions

### Flight Status

```
[scheduled] ──boarding──> [boarding] ──departed──> [departed] ──arrived──> [arrived]
     │
     └──cancelled──> [cancelled]

Rules:
- Only scheduled flights can be cancelled
- Status changes are one-way (no reverting)
- Edit allowed only in 'scheduled' status
```

### Route/Aircraft Status

```
[active] <──toggle──> [inactive]

Rules:
- Routes with scheduled flights require confirmation to deactivate
- Inactive routes cannot be used for new flights
- Aircraft with scheduled flights cannot be deactivated
```

---

## Relationships

```
┌─────────────────┐
│    Airline      │
│  (from auth)    │
└────────┬────────┘
         │ 1
         │
    ┌────┴────┬──────────────┐
    │         │              │
    ▼ *       ▼ *            ▼ *
┌───────┐  ┌────────┐  ┌──────────┐
│ Route │  │Aircraft│  │  Flight  │
└───┬───┘  └────┬───┘  └──────────┘
    │           │            ▲
    │           │            │
    └───────────┴────────────┘
         * flights reference
         both route and aircraft
```

---

## Mock Data IDs

For consistent testing, use these ID prefixes:

| Entity | ID Pattern | Example |
|--------|------------|---------|
| Route | `route-{001-999}` | `route-001` |
| Aircraft | `aircraft-{001-999}` | `aircraft-001` |
| Flight | `flight-{001-999}` | `flight-001` |

---

## Currency Handling

- All prices stored in **cents** (integer) to avoid floating-point issues
- Display conversion: `cents / 100` with 2 decimal places
- Currency symbol from airline settings (default: €)
- Example: `9900` cents → `€99.00`
