# Quickstart: Search Results - Flight List

**Branch**: `004-search-results` | **Date**: 2025-01-30

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+
- Features `001-header-footer`, `002-search-form`, and `003-landing-content` implemented

## Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npx ng serve
```

## Implementation Steps

### 1. Create Data Models

```bash
# Create flight model
touch src/app/models/flight.model.ts

# Create filter model
touch src/app/models/filter.model.ts
```

Add TypeScript interfaces from `data-model.md`.

### 2. Create Mock Data

```bash
# Create mock data files
touch src/app/mock-data/airlines.data.ts
touch src/app/mock-data/flights.data.ts
```

Add mock data arrays from `data-model.md`.

### 3. Update Search Criteria Model

Add `fromQueryParams` function to `src/app/models/search-criteria.model.ts` for parsing URL parameters.

### 4. Generate Components

```bash
# Generate flight card component
npx ng generate component components/flight-card --standalone

# Generate filter bar component
npx ng generate component components/filter-bar --standalone

# Generate search results page
npx ng generate component pages/search-results --standalone
```

### 5. Update Search Form for Compact Mode

**search-form.component.ts**:
- Add `compact` input signal
- Apply host class binding based on compact mode

**search-form.component.scss**:
- Add `:host.compact` styles for horizontal layout

### 6. Implement Flight Card

**flight-card.component.ts**:
- Inputs: `flight: Flight`, `selected: boolean`
- Output: `select: EventEmitter<string>` (flight id)

**flight-card.component.html**:
- Airline logo with fallback
- Duration and airline name
- Departure/arrival times and airports
- Stops info with layover details
- Price display

**flight-card.component.scss**:
- Card styling with hover and selected states

### 7. Implement Filter Bar

**filter-bar.component.ts**:
- Input: `filters: FilterState`
- Output: `filterChange: EventEmitter<FilterState>`
- Dropdown toggle state management

**filter-bar.component.html**:
- Filter dropdown buttons: Max price, Stops, Times, Airlines, Seat class, More

**filter-bar.component.scss**:
- Horizontal button layout
- Active dropdown styling (purple border)

### 8. Implement Search Results Page

**search-results.component.ts**:
- Read URL query params using ActivatedRoute
- Parse into SearchCriteria using fromQueryParams
- Manage filter state
- Computed signal for filtered flights
- Show all flights toggle

**search-results.component.html**:
- Compact search form with pre-filled criteria
- Filter bar
- "Choose a departing flight" title
- Flight card list with @for
- "Show all X flights" button
- Sidebar placeholder

**search-results.component.scss**:
- Two-column layout (flights + sidebar)
- Responsive single column on mobile

### 9. Add Route

Update `app.routes.ts`:
```typescript
{ path: 'search', component: SearchResultsComponent }
```

## File Checklist

| File | Action | Lines (est.) |
|------|--------|--------------|
| `src/app/models/flight.model.ts` | Create | ~35 |
| `src/app/models/filter.model.ts` | Create | ~40 |
| `src/app/mock-data/airlines.data.ts` | Create | ~20 |
| `src/app/mock-data/flights.data.ts` | Create | ~100 |
| `src/app/models/search-criteria.model.ts` | Update | +30 |
| `src/app/components/search-form/*.ts/scss` | Update | +30 |
| `src/app/components/flight-card/*.ts/html/scss` | Create | ~100 |
| `src/app/components/filter-bar/*.ts/html/scss` | Create | ~80 |
| `src/app/pages/search-results/*.ts/html/scss` | Create | ~150 |
| `src/app/app.routes.ts` | Update | +5 |

**Total Estimated Lines**: ~590 (exceeds 400 line limit - will split filter functionality if needed)

## Verification

1. Navigate to `http://localhost:4200`
2. Fill in search form and submit
3. Verify redirect to `/search` with query params
4. Verify compact search bar displays with pre-filled values
5. Verify filter bar displays with dropdown buttons
6. Verify "Choose a departing flight" title
7. Verify 6 flight cards display initially
8. Click "Show all flights" - verify all 10 display
9. Hover over flight card - verify light purple background
10. Click flight card - verify purple left border (selected state)
11. Apply filter - verify results update
12. Resize browser - verify single column on mobile

## Common Issues

**Search form not pre-filling**:
- Verify fromQueryParams function correctly parses URL params
- Check airport lookup uses correct IATA codes

**Flight cards not displaying**:
- Verify mock data imported correctly
- Check @for loop syntax

**Filters not working**:
- Verify computed signal dependencies include filter state
- Check filter logic handles null values

**Layout issues**:
- Verify grid-template-columns uses correct values
- Check media query breakpoint is 768px

**Airline logos not showing**:
- Verify logo path convention: `assets/images/airlines/{code}.svg`
- Check fallback mechanism works
