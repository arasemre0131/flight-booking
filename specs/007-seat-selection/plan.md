# Implementation Plan: Seat Selection

**Feature**: 007-seat-selection | **Date**: 2025-01-31

## Technical Context

| Aspect | Decision |
|--------|----------|
| Framework | Angular 17+ (standalone components) |
| State Management | Signals + BookingService (existing) |
| Styling | SCSS with existing design tokens |
| Data Source | Mock data (static seat map) |
| Navigation | Angular Router |

### Dependencies

- **006-passenger-info**: Provides BookingService, Passenger data, flight-summary component
- **Existing Components**: flight-summary (reuse for sidebar)
- **Models**: Passenger, BookingDraft, Flight, SearchCriteria

### Integration Points

1. **BookingService** - Extend to track seat assignments
2. **flight-summary** - Reuse in sidebar with seat fee additions
3. **Router** - `/seat-selection` route after passenger-info

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Design-First | ✅ | Following Figma seat selection design |
| II. Component-Based | ✅ | Standalone components: seat-map, seat-legend, seat-info |
| III. Type Safety | ✅ | New interfaces: Seat, SeatAssignment, SeatMap |
| IV. Responsive Design | ✅ | Two-column → single column at 768px |
| V. Simplicity (YAGNI) | ✅ | Mock data, no real-time inventory |

**Gate Evaluation**: All principles satisfied. No violations.

## Phase 0: Research Summary

### R1: Seat Map Rendering Approach

**Decision**: CSS Grid-based seat map with row/column positioning

**Rationale**:
- CSS Grid provides natural row/column layout for aircraft seating
- Easy to handle variable seat widths (business vs economy)
- Responsive with minimal code
- Angular template can iterate over rows and seats

**Alternatives Considered**:
- SVG-based rendering: More complex, overkill for mock data
- Canvas rendering: Not accessible, harder to implement interactions
- Table-based: Less flexible for gaps (aisles, exits)

### R2: Seat Selection State Management

**Decision**: Extend BookingService with seatAssignments array

**Rationale**:
- Consistent with existing booking flow state management
- Session storage persistence already implemented
- Signals provide reactive updates

**Alternatives Considered**:
- Separate SeatService: Adds complexity, booking data is coupled
- Component-local state: Loses persistence on navigation

### R3: Aircraft Configuration

**Decision**: Static JSON configuration for seat layout

**Rationale**:
- Mock data approach per project constitution
- Easy to modify for different aircraft types
- Separates data from rendering logic

**Configuration Structure**:
```typescript
{
  rows: [
    { number: 1, class: 'business', seats: ['A', 'B', 'aisle', 'C', 'D'] },
    { number: 2, class: 'business', seats: ['A', 'B', 'aisle', 'C', 'D'] },
    // ... economy rows with 6 seats
    { number: 10, class: 'economy', seats: ['A', 'B', 'C', 'aisle', 'D', 'E', 'F'] },
    { number: 15, class: 'exit', seats: ['A', 'B', 'C', 'aisle', 'D', 'E', 'F'] },
  ],
  occupiedSeats: ['1A', '3B', '10C', '12F', ...] // Pre-defined occupied
}
```

## Phase 1: Design Artifacts

### Generated Artifacts

- [x] `data-model.md` - Entity definitions
- [x] `quickstart.md` - Implementation guide
- [ ] `contracts/` - N/A (frontend-only, no new API)

## Post-Design Constitution Re-check

| Principle | Status |
|-----------|--------|
| I. Design-First | ✅ |
| II. Component-Based | ✅ |
| III. Type Safety | ✅ |
| IV. Responsive Design | ✅ |
| V. Simplicity (YAGNI) | ✅ |

**All gates pass. Ready for task generation.**
