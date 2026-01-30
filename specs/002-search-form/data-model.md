# Data Model: Flight Search Form

**Branch**: `002-search-form` | **Date**: 2025-01-30

## Entities

### SearchCriteria

Represents the user's flight search parameters.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| tripType | `'round-trip' \| 'one-way'` | Yes | Must be valid enum | Type of trip |
| origin | `Airport` | Yes | Must be valid airport | Departure airport/city |
| destination | `Airport` | Yes | Must be valid airport, != origin | Arrival airport/city |
| departureDate | `Date` | Yes | Must be future date | Outbound flight date |
| returnDate | `Date \| null` | Conditional | Required if round-trip, >= departureDate | Return flight date |
| adults | `number` | Yes | 1-9, integer | Number of adult passengers (12+) |
| children | `number` | Yes | 0-8, integer | Number of child passengers (2-11) |

**Constraints**:
- `adults + children <= 9` (industry standard max)
- `adults >= 1` (minimum 1 adult required)

**State Transitions**: N/A (stateless search criteria)

### Airport

Represents a selectable airport or city for origin/destination.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | `string` | Yes | IATA airport code (e.g., "IST", "LHR") |
| name | `string` | Yes | Airport name (e.g., "Istanbul Airport") |
| city | `string` | Yes | City name (e.g., "Istanbul") |
| country | `string` | Yes | Country name (e.g., "Turkey") |

**Display Format**: `{city} ({code})` - e.g., "Istanbul (IST)"

### PassengerCount

Helper interface for passenger selector component.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| adults | `number` | Yes | Adult count (12+) |
| children | `number` | Yes | Child count (2-11) |
| total | `number` | Computed | adults + children |

## TypeScript Interfaces

```typescript
// search-criteria.model.ts
export type TripType = 'round-trip' | 'one-way';

export interface Airport {
  code: string;      // IATA code
  name: string;      // Airport name
  city: string;      // City name
  country: string;   // Country name
}

export interface PassengerCount {
  adults: number;    // Age 12+
  children: number;  // Age 2-11
}

export interface SearchCriteria {
  tripType: TripType;
  origin: Airport | null;
  destination: Airport | null;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: PassengerCount;
}

// Default values
export const DEFAULT_SEARCH_CRITERIA: SearchCriteria = {
  tripType: 'round-trip',
  origin: null,
  destination: null,
  departureDate: null,
  returnDate: null,
  passengers: { adults: 1, children: 0 }
};
```

## URL Query Parameters

When navigating to search results, criteria encoded as:

```
/search?
  tripType=round-trip|one-way
  &origin=IST
  &destination=LHR
  &departureDate=2025-02-15
  &returnDate=2025-02-22  (omitted for one-way)
  &adults=2
  &children=1
```

## Relationships

```
SearchCriteria
├── origin: Airport (1:1)
├── destination: Airport (1:1)
└── passengers: PassengerCount (embedded)
```
