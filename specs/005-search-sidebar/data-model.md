# Data Model: Search Results - Sidebar Content

**Branch**: `005-search-sidebar` | **Date**: 2025-01-31

## Entities

### Hotel

Represents a hotel recommendation displayed in the sidebar.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | `string` | Yes | Unique hotel identifier |
| name | `string` | Yes | Hotel name (e.g., "Hotel Kaneyamaen") |
| description | `string` | Yes | Brief hotel description (single line) |
| image | `string` | Yes | Path to hotel image |
| pricePerNight | `number` | Yes | Price in USD per night |

### RelatedDestination

Represents a destination in the "People also search for" section.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| city | `string` | Yes | City name (e.g., "Shanghai") |
| image | `string` | Yes | Path to destination image |
| flightPrice | `number` | Yes | Round-trip flight price in USD |

## TypeScript Interfaces

```typescript
// hotel.model.ts

export interface Hotel {
  id: string;
  name: string;
  description: string;
  image: string;
  pricePerNight: number;
}
```

```typescript
// destination.model.ts

export interface RelatedDestination {
  city: string;
  image: string;
  flightPrice: number;
}
```

## Mock Data Structure

```typescript
// hotels.data.ts

import { Hotel } from '../models/hotel.model';

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'HTL001',
    name: 'Hotel Kaneyamaen',
    description: 'Traditional ryokan experience',
    image: 'assets/images/search-results/hotel-kaneyamaen.png',
    pricePerNight: 439
  },
  {
    id: 'HTL002',
    name: 'HOTEL THE FLAG',
    description: 'Modern city hotel in Osaka',
    image: 'assets/images/search-results/hotel-osaka.png',
    pricePerNight: 139
  },
  {
    id: 'HTL003',
    name: '9 Hours Shinjuku',
    description: 'Capsule hotel experience',
    image: 'assets/images/search-results/hotel-shinjuku.png',
    pricePerNight: 59
  }
];
```

```typescript
// destinations.data.ts

import { RelatedDestination } from '../models/destination.model';

export const MOCK_DESTINATIONS: RelatedDestination[] = [
  {
    city: 'Shanghai',
    image: 'assets/images/search-results/shanghai-night.png',
    flightPrice: 598
  },
  {
    city: 'Nairobi',
    image: 'assets/images/search-results/nairobi.png',
    flightPrice: 1248
  },
  {
    city: 'Seoul',
    image: 'assets/images/search-results/seoul.png',
    flightPrice: 589
  }
];
```

## Relationships

```
Search Results Page
├── SearchCriteria (from URL params)
│   └── destination: Airport
│       └── city: string  (used for "Find places to stay in [City]")
│
├── Sidebar Content
│   ├── Hotel[] (3 mock items)
│   │   ├── name
│   │   ├── description
│   │   ├── image
│   │   └── pricePerNight
│   │
│   └── RelatedDestination[] (3 mock items)
│       ├── city
│       ├── image
│       └── flightPrice
│
└── Flight[] (existing from 004-search-results)
```

## Component Data Flow

```
search-results.component.ts
│
├── reads URL params → searchCriteria.destination
│
└── passes destinationCity to ↓

sidebar-content.component.ts
│
├── @Input() destinationCity: string
│
├── loads MOCK_HOTELS array
│   └── passes each hotel to ↓
│       hotel-card.component.ts
│       └── @Input() hotel: Hotel
│
└── loads MOCK_DESTINATIONS array
    └── passes each destination to ↓
        destination-card.component.ts
        └── @Input() destination: RelatedDestination
```

## Display Formatting

### Hotel Price
```typescript
// Format: "from $X/night"
formatHotelPrice(price: number): string {
  return `from $${price}/night`;
}
```

### Destination Price
```typescript
// Format: "$X" (round-trip implied)
formatFlightPrice(price: number): string {
  return `$${price}`;
}
```

## Image Paths

Per IMAGE-MAPPING.md:

| Entity | Image File | Path |
|--------|-----------|------|
| Hotel Kaneyamaen | hotel-kaneyamaen.png | assets/images/search-results/hotel-kaneyamaen.png |
| HOTEL THE FLAG | hotel-osaka.png | assets/images/search-results/hotel-osaka.png |
| 9 Hours Shinjuku | hotel-shinjuku.png | assets/images/search-results/hotel-shinjuku.png |
| Shanghai | shanghai-night.png | assets/images/search-results/shanghai-night.png |
| Nairobi | nairobi.png | assets/images/search-results/nairobi.png |
| Seoul | seoul.png | assets/images/search-results/seoul.png |
