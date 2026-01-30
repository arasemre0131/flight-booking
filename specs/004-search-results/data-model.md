# Data Model: Search Results - Flight List

**Branch**: `004-search-results` | **Date**: 2025-01-30

## Entities

### Airline

Represents an airline carrier.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | `string` | Yes | IATA airline code (e.g., "HA", "UA") |
| name | `string` | Yes | Airline full name (e.g., "Hawaiian Airlines") |
| logo | `string` | No | Path to logo SVG, defaults to code-based path |

### Layover

Represents a layover during a flight.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| airport | `string` | Yes | IATA airport code (e.g., "HNL") |
| duration | `string` | Yes | Layover duration (e.g., "2h 45m") |

### Flight

Represents a flight option in search results.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | `string` | Yes | Unique flight identifier |
| airline | `Airline` | Yes | Airline information |
| departureTime | `string` | Yes | Departure time (e.g., "7:00 AM") |
| arrivalTime | `string` | Yes | Arrival time (e.g., "4:15 PM") |
| departureAirport | `string` | Yes | Departure airport code |
| arrivalAirport | `string` | Yes | Arrival airport code |
| duration | `string` | Yes | Total flight duration (e.g., "16h 45m") |
| stops | `number` | Yes | Number of stops (0 = nonstop) |
| layovers | `Layover[]` | No | Layover details (required if stops > 0) |
| price | `number` | Yes | Price in USD |

### FilterState

Represents the current filter selections.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| maxPrice | `number \| null` | No | Maximum price filter |
| stops | `number \| null` | No | Exact number of stops (null = any) |
| departureTimeRange | `TimeRange \| null` | No | Departure time range |
| arrivalTimeRange | `TimeRange \| null` | No | Arrival time range |
| airlines | `string[]` | No | Selected airline codes |
| seatClass | `SeatClass \| null` | No | Seat class filter |

### TimeRange

Represents a time range for filtering.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| start | `string` | Yes | Start time (e.g., "06:00") |
| end | `string` | Yes | End time (e.g., "12:00") |
| label | `string` | Yes | Display label (e.g., "Morning") |

### SeatClass

Enumeration of seat classes.

| Value | Description |
|-------|-------------|
| `economy` | Economy class |
| `business` | Business class |
| `first` | First class |

## TypeScript Interfaces

```typescript
// flight.model.ts

export interface Airline {
  code: string;
  name: string;
  logo?: string;
}

export interface Layover {
  airport: string;
  duration: string;
}

export interface Flight {
  id: string;
  airline: Airline;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  duration: string;
  stops: number;
  layovers?: Layover[];
  price: number;
}

// Helper function
export function getStopsDisplay(flight: Flight): string {
  if (flight.stops === 0) return 'Nonstop';
  if (flight.stops === 1) return '1 stop';
  return `${flight.stops} stops`;
}

export function getLayoverDisplay(layover: Layover): string {
  return `${layover.duration} in ${layover.airport}`;
}
```

```typescript
// filter.model.ts

export type SeatClass = 'economy' | 'business' | 'first';

export interface TimeRange {
  start: string;
  end: string;
  label: string;
}

export interface FilterState {
  maxPrice: number | null;
  stops: number | null;
  departureTimeRange: TimeRange | null;
  arrivalTimeRange: TimeRange | null;
  airlines: string[];
  seatClass: SeatClass | null;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  maxPrice: null,
  stops: null,
  departureTimeRange: null,
  arrivalTimeRange: null,
  airlines: [],
  seatClass: null
};

export const TIME_RANGES: TimeRange[] = [
  { start: '00:00', end: '06:00', label: 'Early morning (12am-6am)' },
  { start: '06:00', end: '12:00', label: 'Morning (6am-12pm)' },
  { start: '12:00', end: '18:00', label: 'Afternoon (12pm-6pm)' },
  { start: '18:00', end: '24:00', label: 'Evening (6pm-12am)' }
];

export const STOPS_OPTIONS = [
  { value: null, label: 'Any number of stops' },
  { value: 0, label: 'Nonstop only' },
  { value: 1, label: '1 stop or fewer' },
  { value: 2, label: '2 stops or fewer' }
];
```

## Mock Data Structure

```typescript
// airlines.data.ts

import { Airline } from '../models/flight.model';

export const AIRLINES: Airline[] = [
  { code: 'HA', name: 'Hawaiian Airlines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'AA', name: 'American Airlines' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'JL', name: 'Japan Airlines' },
  { code: 'NH', name: 'All Nippon Airways' }
];

export function getAirlineByCode(code: string): Airline | undefined {
  return AIRLINES.find(a => a.code === code);
}
```

```typescript
// flights.data.ts

import { Flight } from '../models/flight.model';
import { AIRLINES } from './airlines.data';

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'FL001',
    airline: AIRLINES[0], // Hawaiian Airlines
    departureTime: '7:00 AM',
    arrivalTime: '4:15 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '16h 45m',
    stops: 1,
    layovers: [{ airport: 'HNL', duration: '2h 45m' }],
    price: 624
  },
  {
    id: 'FL002',
    airline: AIRLINES[0], // Hawaiian Airlines
    departureTime: '7:00 AM',
    arrivalTime: '4:15 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '16h 45m',
    stops: 1,
    layovers: [{ airport: 'HNL', duration: '2h 45m' }],
    price: 624
  },
  {
    id: 'FL003',
    airline: AIRLINES[4], // Japan Airlines
    departureTime: '10:35 AM',
    arrivalTime: '3:45 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '11h 10m',
    stops: 0,
    price: 663
  },
  {
    id: 'FL004',
    airline: AIRLINES[1], // United Airlines
    departureTime: '9:20 AM',
    arrivalTime: '2:30 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '11h 10m',
    stops: 0,
    price: 756
  },
  {
    id: 'FL005',
    airline: AIRLINES[5], // All Nippon Airways
    departureTime: '11:00 AM',
    arrivalTime: '4:10 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '11h 10m',
    stops: 0,
    price: 789
  },
  {
    id: 'FL006',
    airline: AIRLINES[2], // American Airlines
    departureTime: '6:30 AM',
    arrivalTime: '7:45 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '19h 15m',
    stops: 2,
    layovers: [
      { airport: 'LAX', duration: '1h 30m' },
      { airport: 'HND', duration: '2h 15m' }
    ],
    price: 498
  },
  {
    id: 'FL007',
    airline: AIRLINES[3], // Delta Air Lines
    departureTime: '8:15 AM',
    arrivalTime: '1:25 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '11h 10m',
    stops: 0,
    price: 712
  },
  {
    id: 'FL008',
    airline: AIRLINES[1], // United Airlines
    departureTime: '2:45 PM',
    arrivalTime: '10:55 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '14h 10m',
    stops: 1,
    layovers: [{ airport: 'LAX', duration: '1h 45m' }],
    price: 582
  },
  {
    id: 'FL009',
    airline: AIRLINES[4], // Japan Airlines
    departureTime: '5:00 PM',
    arrivalTime: '10:10 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '11h 10m',
    stops: 0,
    price: 695
  },
  {
    id: 'FL010',
    airline: AIRLINES[0], // Hawaiian Airlines
    departureTime: '11:30 AM',
    arrivalTime: '11:45 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '18h 15m',
    stops: 1,
    layovers: [{ airport: 'HNL', duration: '3h 30m' }],
    price: 545
  }
];
```

## Relationships

```
Search Results Page
├── SearchCriteria (from URL params)
│   ├── origin: Airport
│   ├── destination: Airport
│   ├── departureDate: Date
│   ├── returnDate?: Date
│   └── passengers: PassengerCount
│
├── FilterState
│   ├── maxPrice?: number
│   ├── stops?: number
│   ├── airlines?: Airline[]
│   └── seatClass?: SeatClass
│
└── Flight[] (10 mock items)
    └── Airline
    └── Layover[]
```

## Filter Logic

```typescript
function filterFlights(flights: Flight[], filters: FilterState): Flight[] {
  return flights.filter(flight => {
    // Max price filter
    if (filters.maxPrice !== null && flight.price > filters.maxPrice) {
      return false;
    }

    // Stops filter (X or fewer)
    if (filters.stops !== null && flight.stops > filters.stops) {
      return false;
    }

    // Airlines filter (if any selected)
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline.code)) {
      return false;
    }

    // Time range filter would parse flight.departureTime and compare
    // (deferred - more complex string parsing)

    return true;
  });
}
```

## URL Query Parameter Parsing

```typescript
// Add to search-criteria.model.ts

export function fromQueryParams(
  params: Record<string, string>,
  airports: Airport[]
): Partial<SearchCriteria> {
  const criteria: Partial<SearchCriteria> = {};

  if (params['tripType']) {
    criteria.tripType = params['tripType'] as TripType;
  }

  if (params['origin']) {
    criteria.origin = airports.find(a => a.code === params['origin']) || null;
  }

  if (params['destination']) {
    criteria.destination = airports.find(a => a.code === params['destination']) || null;
  }

  if (params['departureDate']) {
    criteria.departureDate = new Date(params['departureDate']);
  }

  if (params['returnDate']) {
    criteria.returnDate = new Date(params['returnDate']);
  }

  if (params['adults'] || params['children']) {
    criteria.passengers = {
      adults: parseInt(params['adults'] || '1', 10),
      children: parseInt(params['children'] || '0', 10)
    };
  }

  return criteria;
}
```
