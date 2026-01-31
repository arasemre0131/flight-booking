# Research: Seat Selection

**Feature**: 007-seat-selection | **Date**: 2025-01-31

## Research Tasks Completed

### RT-01: Seat Map Rendering Strategy

**Question**: How to render an aircraft seat map in Angular?

**Findings**:
1. CSS Grid is the most suitable approach for seat layouts
2. Each row can be a grid container with columns for seats and aisle
3. Seat cells can be buttons for accessibility (keyboard navigation)
4. Color coding via CSS classes for seat states

**Decision**: CSS Grid with semantic HTML buttons

**Rationale**:
- Native accessibility (focus management, keyboard nav)
- Simple styling with CSS classes
- No external dependencies
- Easy responsive adaptation

### RT-02: State Management for Seat Assignments

**Question**: How to track seat assignments across the booking flow?

**Findings**:
1. BookingService already uses signals for booking state
2. Session storage persistence is implemented
3. Need to extend BookingDraft with seatAssignments

**Decision**: Extend existing BookingService and BookingDraft model

**Changes Required**:
```typescript
// Add to BookingDraft interface
seatAssignments?: SeatAssignment[];

// Add to BookingService
updateSeatAssignments(assignments: SeatAssignment[]): void;
```

### RT-03: Seat Pricing Calculation

**Question**: How to calculate total price with seat upgrades?

**Findings**:
1. Spec defines: standard $0, exit row +$30, business +$100
2. Price should aggregate from all passenger seat selections
3. Display should show breakdown (base + upgrades)

**Decision**: Calculate seat fees separately, display as line item

**Implementation**:
```typescript
function calculateSeatFees(assignments: SeatAssignment[]): number {
  return assignments.reduce((total, a) => total + (a.seat?.upgradePrice ?? 0), 0);
}
```

### RT-04: Mobile Responsiveness

**Question**: How to handle seat map on small screens?

**Findings**:
1. Spec mentions scrollable/zoomable
2. CSS overflow-x: auto for horizontal scroll
3. Pinch zoom via CSS touch-action
4. Optional: transform scale for zoom controls

**Decision**: Horizontal scroll with touch support, no custom zoom

**Rationale**:
- Simplest implementation (YAGNI principle)
- Native mobile scrolling feels natural
- Avoids complex gesture handling

## Research Summary

| Topic | Decision | Confidence |
|-------|----------|------------|
| Rendering | CSS Grid + buttons | High |
| State | Extend BookingService | High |
| Pricing | Separate fee calculation | High |
| Mobile | Horizontal scroll | High |

**All unknowns resolved. Ready for data-model.md generation.**
