# SPEC-002A: Search Results - Flight List

> **Status:** ⬜ Pending | **Lines:** ~200 | **Priority:** P0

## Overview
Search results page with compact search bar, filter bar, and flight list.

## Dependencies
- **Requires:** SPEC-001A (Header/Footer), SPEC-001B (Search Form)
- **Required by:** SPEC-002B

---

## Files to Create

| # | File Path | Purpose | Lines |
|---|-----------|---------|-------|
| 1 | `src/app/pages/search-results/search-results.component.ts` | Page logic | ~50 |
| 2 | `src/app/pages/search-results/search-results.component.html` | Page template | ~60 |
| 3 | `src/app/pages/search-results/search-results.component.scss` | Page styles | ~40 |
| 4 | `src/app/components/filter-bar/filter-bar.component.ts` | Filter logic | ~30 |
| 5 | `src/app/components/filter-bar/filter-bar.component.html` | Filter template | ~20 |
| 6 | `src/app/components/filter-bar/filter-bar.component.scss` | Filter styles | ~15 |
| 7 | `src/app/components/flight-card/flight-card.component.ts` | Flight card logic | ~25 |
| 8 | `src/app/components/flight-card/flight-card.component.html` | Flight card template | ~25 |
| 9 | `src/app/components/flight-card/flight-card.component.scss` | Flight card styles | ~20 |
| 10 | `src/app/mock-data/flights.ts` | Flight data | ~60 |
| 11 | `src/app/mock-data/airlines.ts` | Airline logos | ~25 |
| 12 | `src/app/models/flight.model.ts` | Flight interface | ~20 |

**Total: ~390 lines**

---

## Page Layout

### Visual Reference
```
┌────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                     │
├────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ ↗ SFO  │  ↘ NRT  │  📅 Depart - Return  │  👤 1 adult  │ [Search] │ │
│ └────────────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ [Max price ▼] [Shops ▼] [Times ▼] [Airlines ▼] [Seat class ▼] [More ▼]│
├─────────────────────────────────────────┬──────────────────────────────┤
│                                         │                              │
│  Choose a departing flight              │     (SPEC-002B Sidebar)      │
│                                         │                              │
│  ┌─────────────────────────────────┐   │                              │
│  │ 🔵 16h 45m   7:00AM-4:15PM      │   │                              │
│  │    Hawaiian   1 stop  $624      │   │                              │
│  └─────────────────────────────────┘   │                              │
│                                         │                              │
│  ┌─────────────────────────────────┐   │                              │
│  │ 🔴 18h 22m   7:35AM-12:15PM     │   │                              │
│  │    Japan Air  1 stop  $663      │   │                              │
│  └─────────────────────────────────┘   │                              │
│                                         │                              │
│  (more flights...)                      │                              │
│                                         │                              │
│  [Show all flights]                     │                              │
│                                         │                              │
└─────────────────────────────────────────┴──────────────────────────────┘
```

---

## Section 1: Compact Search Bar

Search form in `compact` mode (horizontal, smaller).

```html
<app-search-form mode="compact" (search)="onSearch($event)"></app-search-form>
```

---

## Section 2: Filter Bar

### Filters
| Filter | Options |
|--------|---------|
| Max price | Slider or dropdown |
| Shops | Number of stops (0, 1, 2+) |
| Times | Morning, Afternoon, Evening |
| Airlines | Checkboxes for each airline |
| Seat class | Economy, Business, First |
| More | Additional filters |

### Visual
```
┌──────────────────────────────────────────────────────────────────────┐
│ [Max price ▼] [Shops ▼] [Times ▼] [Airlines ▼] [Seat class ▼] [More ▼]│
└──────────────────────────────────────────────────────────────────────┘
```

Each filter is a dropdown button with purple border when active.

---

## Section 3: Flight List

### Title
"Choose a **departing** flight"

### Flight Card Layout
```
┌────────────────────────────────────────────────────────────────────┐
│  🔵   16h 45m      7:00AM - 4:15PM       1 stop         $624      │
│       Hawaiian Airlines                2h 45m in HNL    round trip │
└────────────────────────────────────────────────────────────────────┘

Columns:
- Airline logo (small circle)
- Duration
- Airline name
- Times (departure - arrival)
- Stops info
- Price
- Trip type
```

### Flight Card Details
| Column | Content | Alignment |
|--------|---------|-----------|
| Logo | Airline logo (32px circle) | Left |
| Duration | "16h 45m" (bold) | Left |
| Airline | "Hawaiian Airlines" (gray) | Left |
| Times | "7:00AM - 4:15PM" | Center |
| Stops | "1 stop" or "Nonstop" | Center |
| Stop detail | "2h 45m in HNL" (gray) | Center |
| Price | "$624" (bold) | Right |
| Trip type | "round trip" (gray) | Right |

---

## Mock Data (flights.ts)

```typescript
export interface Flight {
  id: string;
  airline: {
    code: string;
    name: string;
    logo: string;
  };
  departure: {
    time: string;
    airport: string;
  };
  arrival: {
    time: string;
    airport: string;
  };
  duration: string;
  stops: number;
  stopInfo?: string;  // "2h 45m in HNL"
  price: number;
}

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: '1',
    airline: { code: 'HA', name: 'Hawaiian Airlines', logo: 'hawaiian.svg' },
    departure: { time: '7:00AM', airport: 'SFO' },
    arrival: { time: '4:15PM', airport: 'NRT' },
    duration: '16h 45m',
    stops: 1,
    stopInfo: '2h 45m in HNL',
    price: 624
  },
  {
    id: '2',
    airline: { code: 'JL', name: 'Japan Airlines', logo: 'jal.svg' },
    departure: { time: '7:35 AM', airport: 'SFO' },
    arrival: { time: '12:15 PM', airport: 'NRT' },
    duration: '18h 22m',
    stops: 1,
    stopInfo: '50m in HKG',
    price: 663
  },
  {
    id: '3',
    airline: { code: 'HA', name: 'Hawaiian Airlines', logo: 'hawaiian.svg' },
    departure: { time: '8:20 AM', airport: 'SFO' },
    arrival: { time: '2:15 PM', airport: 'NRT' },
    duration: '18h 04m',
    stops: 1,
    stopInfo: '1h 50m in PVG',
    price: 690
  },
  {
    id: '4',
    airline: { code: 'DL', name: 'Delta', logo: 'delta.svg' },
    departure: { time: '9:47 AM', airport: 'SFO' },
    arrival: { time: '4:15 PM', airport: 'NRT' },
    duration: '18h 52m',
    stops: 1,
    stopInfo: '4h 05m in ICN',
    price: 756
  },
  {
    id: '5',
    airline: { code: 'HA', name: 'Hawaiian Airlines', logo: 'hawaiian.svg' },
    departure: { time: '11:15 AM', airport: 'SFO' },
    arrival: { time: '7:45 PM', airport: 'NRT' },
    duration: '16h 05m',
    stops: 0,
    price: 837
  },
  {
    id: '6',
    airline: { code: 'UA', name: 'United Airlines', logo: 'united.svg' },
    departure: { time: '10:55 AM', airport: 'SFO' },
    arrival: { time: '8:15 PM', airport: 'NRT' },
    duration: '15h 45m',
    stops: 0,
    price: 839
  }
];
```

---

## Mock Data (airlines.ts)

```typescript
export interface Airline {
  code: string;
  name: string;
  logo: string;
  color: string;  // Logo background color
}

export const AIRLINES: Airline[] = [
  { code: 'HA', name: 'Hawaiian Airlines', logo: 'hawaiian.svg', color: '#4B0082' },
  { code: 'JL', name: 'Japan Airlines', logo: 'jal.svg', color: '#C8102E' },
  { code: 'DL', name: 'Delta', logo: 'delta.svg', color: '#C8102E' },
  { code: 'UA', name: 'United Airlines', logo: 'united.svg', color: '#002244' },
  { code: 'AA', name: 'American Airlines', logo: 'american.svg', color: '#0078D2' },
];
```

---

## Show All Flights Button

```html
<button class="show-all-btn">Show all flights</button>
```

Style: White background, purple border, purple text.

---

## Acceptance Criteria

- [ ] Compact search bar displays at top
- [ ] Filter bar with 6 dropdown buttons
- [ ] Flight list shows 6 flights
- [ ] Each flight card shows: logo, duration, times, stops, price
- [ ] "Nonstop" or "X stop" displays correctly
- [ ] Stop detail shows layover info
- [ ] "Show all flights" button at bottom
- [ ] Flight cards have hover effect (light purple bg)
- [ ] Selected flight has purple left border
- [ ] Page layout: 2 columns (flights left, sidebar right)
