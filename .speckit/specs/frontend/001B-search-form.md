# SPEC-001B: Search Form Components

> **Status:** ⬜ Pending | **Lines:** ~200 | **Priority:** P0

## Overview
Reusable search form with airport autocomplete, date picker, and passenger selector.
Used in Landing Page (full) and Search Results (compact).

## Dependencies
- **Requires:** SPEC-001A (Header/Footer)
- **Required by:** SPEC-001C, SPEC-002A

---

## Files to Create

| # | File Path | Purpose | Lines |
|---|-----------|---------|-------|
| 1 | `src/app/shared/search-form/search-form.component.ts` | Main form logic | ~40 |
| 2 | `src/app/shared/search-form/search-form.component.html` | Form template | ~35 |
| 3 | `src/app/shared/search-form/search-form.component.scss` | Form styles | ~30 |
| 4 | `src/app/shared/airport-autocomplete/airport-autocomplete.component.ts` | Autocomplete logic | ~35 |
| 5 | `src/app/shared/airport-autocomplete/airport-autocomplete.component.html` | Dropdown template | ~20 |
| 6 | `src/app/shared/airport-autocomplete/airport-autocomplete.component.scss` | Dropdown styles | ~15 |
| 7 | `src/app/shared/date-picker/date-picker.component.ts` | Calendar logic | ~45 |
| 8 | `src/app/shared/date-picker/date-picker.component.html` | Calendar template | ~40 |
| 9 | `src/app/shared/date-picker/date-picker.component.scss` | Calendar styles | ~25 |
| 10 | `src/app/shared/passenger-selector/passenger-selector.component.ts` | Counter logic | ~25 |
| 11 | `src/app/shared/passenger-selector/passenger-selector.component.html` | Counter template | ~15 |
| 12 | `src/app/shared/passenger-selector/passenger-selector.component.scss` | Counter styles | ~15 |
| 13 | `src/app/mock-data/airports.ts` | Airport data | ~30 |
| 14 | `src/app/models/airport.model.ts` | Airport interface | ~10 |

**Total: ~380 lines**

---

## Search Form Layout

### Visual Reference
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ○ Round trip  ○ One way                                                 │
├─────────────┬─────────────┬──────────────────┬─────────────┬───────────┤
│ ↗ From where│ ↘ Where to? │ 📅 Depart-Arrive │ 👤 1 Adult  │  Search   │
└─────────────┴─────────────┴──────────────────┴─────────────┴───────────┘
```

### Form Inputs
| Input | Icon | Placeholder | Component |
|-------|------|-------------|-----------|
| From | ↗ (takeoff) | "From where?" | AirportAutocomplete |
| To | ↘ (landing) | "Where to?" | AirportAutocomplete |
| Dates | 📅 | "Depart - Arrive" | DatePicker |
| Passengers | 👤 | "1 Adult" | PassengerSelector |

---

## Airport Autocomplete

### Behavior
1. User types in input
2. Filter airports by code OR city name
3. Show dropdown with matches (max 8)
4. Click to select
5. Display IATA code in input (e.g., "SFO")

### Dropdown Item
```
┌────────────────────────────┐
│ SFO                        │  ← Selected (purple bg)
├────────────────────────────┤
│ ATL                        │
│ LAX                        │
│ STL                        │
│ PVG                        │
│ MSP                        │
│ NRT                        │
│ JFK                        │
└────────────────────────────┘
```

### Mock Data (airports.ts)
```typescript
export interface Airport {
  code: string;      // IATA code
  name: string;      // Full name
  city: string;      // City name
  country: string;   // Country
}

export const AIRPORTS: Airport[] = [
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan' },
  { code: 'ATL', name: 'Hartsfield-Jackson', city: 'Atlanta', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
  { code: 'STL', name: 'St. Louis Lambert', city: 'St. Louis', country: 'USA' },
  { code: 'PVG', name: 'Shanghai Pudong', city: 'Shanghai', country: 'China' },
  { code: 'MSP', name: 'Minneapolis-Saint Paul', city: 'Minneapolis', country: 'USA' },
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'USA' },
  { code: 'HNL', name: 'Daniel K. Inouye', city: 'Honolulu', country: 'USA' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea' },
];
```

---

## Date Picker

### Behavior
1. Click input to open calendar
2. Show 2 months side by side
3. Select departure date (first click)
4. Select return date (second click)
5. Highlight range between dates
6. "Done" button closes picker

### Visual Reference
```
┌─────────────────────────────────────────────────────────────────┐
│ ○ Round trip  ○ One way      📅 Feb 25 - Mar 21      [ Done ]   │
├────────────────────────────────┬────────────────────────────────┤
│        February 2021           │          March 2021            │
│  S   M   T   W   T   F   S     │   S   M   T   W   T   F   S    │
│ 31   1   2   3   4   5   6     │  28   1   2   3   4   5   6    │
│  7   8   9  10  11  12  13     │   7   8   9  10  11  12  13    │
│ 14  15  16  17  18  19  20     │  14  15  16  17  18  19  20    │
│ 21  22  23  24 [25] 26  27     │ [21] 22  23  24  25  26  27    │
│ 28   1   2   3   4   5   6     │  28  29  30  31   1   2   3    │
└────────────────────────────────┴────────────────────────────────┘
  < (prev)                                              (next) >
```

### States
- Past dates: grayed out, not clickable
- Selected dates: purple circle
- Range: light purple background
- Today: purple border

---

## Passenger Selector

### Behavior
1. Click input to open dropdown
2. Show Adults and Minors counters
3. +/- buttons to adjust
4. Min: 1 Adult, 0 Minors
5. Max: 9 total passengers

### Visual Reference
```
┌───────────────────────┐
│  👤 1 Adult           │  ← Input display
├───────────────────────┤
│  Adults:   [ - ] 1 [ + ] │
│  Minors:   [ - ] 0 [ + ] │
└───────────────────────┘
```

### Display Format
- "1 Adult" (singular)
- "2 Adults" (plural)
- "2 Adults, 1 Minor"
- "2 Adults, 2 Minors"

---

## Component Inputs/Outputs

### SearchFormComponent
```typescript
@Input() mode: 'full' | 'compact' = 'full';
@Output() search = new EventEmitter<SearchParams>();

interface SearchParams {
  from: string;        // IATA code
  to: string;          // IATA code
  departDate: Date;
  returnDate?: Date;   // null for one-way
  adults: number;
  minors: number;
  tripType: 'roundtrip' | 'oneway';
}
```

### AirportAutocompleteComponent
```typescript
@Input() placeholder: string;
@Input() icon: 'takeoff' | 'landing';
@Output() airportSelected = new EventEmitter<Airport>();
```

---

## Styles

```scss
$primary: #605DEC;
$border: #A1B0CC;
$text: #7C8DB0;

.search-form {
  display: flex;
  background: white;
  border: 1px solid $border;
  border-radius: 4px;
  overflow: hidden;
}

.search-input {
  display: flex;
  align-items: center;
  padding: 16px;
  border-right: 1px solid $border;

  input {
    border: none;
    outline: none;
    font-size: 16px;
    color: $text;
  }
}

.search-btn {
  background: $primary;
  color: white;
  padding: 16px 24px;
  border: none;
  cursor: pointer;
}
```

---

## Acceptance Criteria

- [ ] Search form displays all 4 inputs + button
- [ ] Round trip / One way toggle works
- [ ] Airport autocomplete filters on typing
- [ ] Airport dropdown shows max 8 results
- [ ] Date picker shows 2 months
- [ ] Date range selection works
- [ ] Passenger counter +/- buttons work
- [ ] Min 1 adult enforced
- [ ] Search button emits SearchParams
- [ ] Compact mode for search results page
