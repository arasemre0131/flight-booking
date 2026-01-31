# Quickstart: Seat Selection Implementation

**Feature**: 007-seat-selection | **Date**: 2025-01-31

## Overview

Implement the seat selection page allowing travelers to choose seats from an aircraft seat map before proceeding to payment.

## Prerequisites

- ✅ 006-passenger-info complete (BookingService, Passenger data)
- ✅ flight-summary component exists (reuse in sidebar)
- ✅ BookingDraft model exists

## Files to Create

| File | Purpose |
|------|---------|
| `models/seat.model.ts` | Seat, SeatRow, SeatMap, SeatAssignment interfaces |
| `mock-data/seat-map.data.ts` | Mock aircraft configuration and occupied seats |
| `components/seat-map/` | Main seat map visualization component |
| `components/seat-legend/` | Legend showing seat types and colors |
| `components/passenger-seat-list/` | List of passengers with seat assignments |
| `pages/seat-selection/` | Main page composing all components |

## Files to Modify

| File | Changes |
|------|---------|
| `models/booking.model.ts` | Add seatAssignments, seatFees fields |
| `services/booking.service.ts` | Add seat assignment methods |
| `app.routes.ts` | Add `/seat-selection` route |

## Implementation Order

### Phase 1: Models & Data
1. Create seat.model.ts with all interfaces
2. Create seat-map.data.ts with mock aircraft layout
3. Extend booking.model.ts with seat fields

### Phase 2: Service Extension
4. Add seat assignment methods to BookingService

### Phase 3: Components
5. Create seat-legend component (simple, no state)
6. Create seat-map component (main visual, click handlers)
7. Create passenger-seat-list component (shows assignments)

### Phase 4: Page Integration
8. Create seat-selection page
9. Add route and navigation

### Phase 5: Polish
10. Add responsive styles for mobile
11. Add skip functionality

## Key Implementation Notes

### Seat Map Rendering

Use CSS Grid for seat layout:

```scss
.seat-row {
  display: grid;
  grid-template-columns: repeat(7, 40px); // A B C aisle D E F
  gap: 4px;

  &.business {
    grid-template-columns: repeat(5, 50px); // A B aisle C D (wider)
  }
}

.seat {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px 6px 0 0; // Seat-like shape

  &.available { background: #E8F5E9; }
  &.occupied { background: #ECEFF1; }
  &.selected { background: #605DEC; color: white; }
  &.business { background: #FFF8E1; }
  &.exit { background: #E3F2FD; }
}

.aisle {
  background: transparent;
  pointer-events: none;
}
```

### Seat Selection Logic

```typescript
onSeatClick(seat: Seat): void {
  if (seat.status === 'occupied') return;

  if (seat.status === 'selected') {
    // Deselect: find assignment and clear it
    this.deselectSeat(seat.id);
  } else {
    // Select: find first unassigned passenger
    const unassigned = this.findFirstUnassignedPassenger();
    if (unassigned) {
      this.assignSeat(unassigned.passengerId, seat);
    }
  }
}
```

### Price Calculation

```typescript
calculateSeatFees(): number {
  return this.seatAssignments()
    .filter(a => a.seat)
    .reduce((total, a) => total + (a.seat?.upgradePrice ?? 0), 0);
}

totalPrice = computed(() => {
  const base = this.bookingDraft()?.totalPrice ?? 0;
  return base + this.calculateSeatFees();
});
```

### Session Persistence

Already handled by BookingService - just update seatAssignments via the service method.

## Design Reference

- Two-column layout: Seat map (left), Summary sidebar (right)
- Mobile: Stack vertically, seat map scrollable horizontally
- Colors from spec: #605DEC (primary/selected), #E8F5E9 (available), #ECEFF1 (occupied)

## Testing Checklist

- [ ] Seat map displays correctly with all seat types
- [ ] Click available seat → assigns to first unassigned passenger
- [ ] Click selected seat → deselects and unassigns
- [ ] Occupied seats are not clickable
- [ ] Passenger list shows current assignments
- [ ] Premium seat fees update total price
- [ ] "Skip" allows proceeding without seats
- [ ] "Continue" navigates to payment
- [ ] Back navigation preserves selections
- [ ] Page refresh restores state
