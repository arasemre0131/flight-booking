# Research: Search Results - Flight List

**Branch**: `004-search-results` | **Date**: 2025-01-30

## Research Tasks

### 1. Compact Search Form Mode

**Decision**: Add `compact` input to existing SearchFormComponent with conditional styling

**Rationale**:
- Reuses existing search form component
- Single input controls layout mode (hero vs. results page)
- Minimal code changes - CSS-only modifications
- Follows Constitution Principle II (component reusability)

**Alternatives Considered**:
- Separate `compact-search-form` component - Code duplication
- CSS-only approach without input - Less explicit, harder to maintain
- Completely different search bar design - Inconsistent UX

**Implementation**:
```typescript
// search-form.component.ts
compact = input<boolean>(false);
```
```scss
// search-form.component.scss
:host(.compact) {
  .search-form { /* compact styles */ }
}
```

### 2. Filter Bar Architecture

**Decision**: Stateless filter-bar component with event emission, parent manages filter state

**Rationale**:
- Filter-bar is presentational, search-results manages state
- Clear separation of concerns
- Easier to test filter logic in isolation
- Follows Angular best practices for smart/dumb component pattern

**Alternatives Considered**:
- Filter-bar manages its own state - Harder to synchronize with flight list
- Service-based state management - Over-engineering for MVP scope
- NgRx store - Unnecessary complexity for client-side filtering

**Implementation**:
```typescript
// filter-bar.component.ts
@Output() filterChange = new EventEmitter<FilterState>();
```

### 3. Flight Card Selection

**Decision**: Single selection with `selectedFlightId` signal in parent, flight-card receives `selected` input

**Rationale**:
- Parent controls selection state
- Flight card is purely presentational
- Easy to implement multi-selection later if needed
- Follows unidirectional data flow

**Alternatives Considered**:
- Flight card manages own selection - Multiple sources of truth
- Selection service - Over-engineering for single-page state
- Event-based with no visual state - Poor UX feedback

### 4. Airline Logo Strategy

**Decision**: Use airline code as filename, inline SVG fallback for missing logos

**Rationale**:
- Simple naming convention: `assets/images/airlines/{code}.svg`
- Fallback displays airline code in styled circle
- No external dependencies (no logo CDN)
- Consistent with project's asset organization

**Alternatives Considered**:
- External airline logo API - Adds dependency, network latency
- All logos inline - Large bundle size
- No fallback - Poor UX when logo unavailable

**Implementation**:
```html
<img [src]="'assets/images/airlines/' + flight.airline.code + '.svg'"
     (error)="showFallback = true"
     *ngIf="!showFallback" />
<div class="airline-fallback" *ngIf="showFallback">{{ flight.airline.code }}</div>
```

### 5. URL Query Parameters for Search Criteria

**Decision**: Read search criteria from URL query params on page load, pre-fill search form

**Rationale**:
- Enables shareable search URLs
- Browser back/forward navigation works naturally
- Already implemented in search-criteria.model.ts (toQueryParams)
- Need to implement fromQueryParams for reverse

**Alternatives Considered**:
- Session storage - Not shareable
- State transfer via router - More complex, same result
- Local storage - Persistence issues

**Implementation**:
```typescript
// search-criteria.model.ts (add)
export function fromQueryParams(params: Record<string, string>, airports: Airport[]): SearchCriteria
```

### 6. Mock Flight Data Structure

**Decision**: 10 mock flights with variety of stops (0, 1, 2), airlines, times, and prices

**Rationale**:
- Enough data to test filters meaningfully
- Covers all display variations (nonstop, 1 stop with layover, 2 stops)
- Default shows 6, "Show all" reveals all 10
- Realistic price range ($400-$800)

**Alternatives Considered**:
- Fewer flights - Not enough to demonstrate filters
- JSON file - Requires HTTP call
- Random generation - Inconsistent testing

### 7. Show All Flights Pattern

**Decision**: Simple boolean flag `showAllFlights`, slice array to 6 when false

**Rationale**:
- Simplest implementation
- No pagination complexity
- Matches spec requirement (default 6, show all on click)

**Alternatives Considered**:
- Infinite scroll - Over-engineering for 10 items
- Pagination - More complex, not in spec
- Load more button - Similar but more complex

### 8. Filter Implementation (Client-Side)

**Decision**: Computed signal that filters mock data based on filter state

**Rationale**:
- Reactive updates using Angular signals
- No debouncing needed for small dataset
- Performance adequate for 10 items
- Matches spec: "filter updates within 500ms"

**Alternatives Considered**:
- RxJS operators with debounce - Unnecessary for small data
- Server-side filtering - No backend yet
- Manual subscription management - More error-prone

**Implementation**:
```typescript
filteredFlights = computed(() => {
  return this.flights().filter(flight => {
    if (this.filters().maxPrice && flight.price > this.filters().maxPrice) return false;
    if (this.filters().stops !== null && flight.stops !== this.filters().stops) return false;
    // ... more filters
    return true;
  });
});
```

## No Outstanding Research Items

All technical decisions resolved. Ready for Phase 1 design artifacts.
