# Data Model: Seat Selection

**Feature**: 007-seat-selection | **Date**: 2025-01-31

## Entities

### Seat

Represents a single seat on the aircraft.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | Yes | Format: "{row}{letter}" e.g., "12A" |
| row | number | Yes | Row number (1-30 typical) |
| letter | string | Yes | Seat letter (A-F for economy) |
| status | SeatStatus | Yes | 'available' \| 'occupied' \| 'selected' |
| type | SeatType | Yes | 'economy' \| 'business' \| 'exit' |
| upgradePrice | number | Yes | Additional fee ($0, $30, $100) |

**TypeScript Interface**:
```typescript
export type SeatStatus = 'available' | 'occupied' | 'selected';
export type SeatType = 'economy' | 'business' | 'exit';

export interface Seat {
  id: string;
  row: number;
  letter: string;
  status: SeatStatus;
  type: SeatType;
  upgradePrice: number;
}
```

### SeatRow

Represents a row in the aircraft with its seats and configuration.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| number | number | Yes | Row number |
| type | SeatType | Yes | Row class (business/economy/exit) |
| seats | (Seat \| 'aisle')[] | Yes | Seats with aisle markers |

**TypeScript Interface**:
```typescript
export interface SeatRow {
  number: number;
  type: SeatType;
  seats: (Seat | 'aisle')[];
}
```

### SeatMap

Aircraft configuration containing all rows.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| aircraftType | string | Yes | e.g., "Boeing 737" |
| rows | SeatRow[] | Yes | All seat rows |

**TypeScript Interface**:
```typescript
export interface SeatMap {
  aircraftType: string;
  rows: SeatRow[];
}
```

### SeatAssignment

Links a passenger to their selected seat.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| passengerId | string | Yes | Reference to Passenger.id |
| passengerName | string | Yes | Display name for UI |
| seatId | string \| null | Yes | Reference to Seat.id, null if unassigned |
| seat | Seat \| null | No | Denormalized seat data for display |

**TypeScript Interface**:
```typescript
export interface SeatAssignment {
  passengerId: string;
  passengerName: string;
  seatId: string | null;
  seat?: Seat | null;
}
```

### BookingDraft Extension

Add to existing BookingDraft interface:

```typescript
export interface BookingDraft {
  // ... existing fields ...
  seatAssignments?: SeatAssignment[];
  seatFees?: number; // Total upgrade fees
}
```

## Relationships

```
BookingDraft
    │
    ├──► Passenger[] (from 006-passenger-info)
    │
    └──► SeatAssignment[] (1:1 with passengers)
            │
            └──► Seat (0..1, null if skipped)

SeatMap
    │
    └──► SeatRow[]
            │
            └──► Seat[] (with aisle markers)
```

## Seat Type Pricing

| Type | Base Price | Upgrade Fee | Description |
|------|------------|-------------|-------------|
| economy | $0 | $0 | Standard economy seat |
| exit | $0 | +$30 | Exit row with extra legroom |
| business | $0 | +$100 | Business/First class seat |

## Seat Configuration (Mock Data)

### Standard Aircraft Layout

```
Business Class (Rows 1-3): 4 seats per row (A-B | C-D)
Economy Class (Rows 4-25): 6 seats per row (A-B-C | D-E-F)
Exit Row (Rows 10, 20): 6 seats per row with +$30 fee

Legend:
[A][B] | [C][D]     = Business (wider seats)
[A][B][C] | [D][E][F] = Economy (standard)
```

### Mock Occupied Seats

Pre-defined occupied seats for realistic appearance:
- Business: 1A, 2D, 3B
- Exit: 10A, 10F, 20C
- Economy: 5C, 7A, 8E, 12B, 15F, 18D, 22A, 24C

## State Transitions

### Seat Selection Flow

```
[Available] ──click──► [Selected] (assign to next unassigned passenger)
                           │
                           │ click again
                           ▼
                      [Available] (unassign passenger)

[Occupied] ──click──► (no action, show tooltip)
```

### Passenger Assignment Flow

```
[Unassigned Passenger] ──click seat──► [Assigned to Seat]
                                            │
                                            │ click same seat
                                            ▼
                                    [Unassigned Passenger]

[All Assigned] ──click new seat──► Replace last assigned OR prompt
```

## Sample Data

### Seat
```typescript
{
  id: '12A',
  row: 12,
  letter: 'A',
  status: 'available',
  type: 'economy',
  upgradePrice: 0
}
```

### SeatRow (Economy)
```typescript
{
  number: 12,
  type: 'economy',
  seats: [
    { id: '12A', row: 12, letter: 'A', status: 'available', type: 'economy', upgradePrice: 0 },
    { id: '12B', row: 12, letter: 'B', status: 'available', type: 'economy', upgradePrice: 0 },
    { id: '12C', row: 12, letter: 'C', status: 'occupied', type: 'economy', upgradePrice: 0 },
    'aisle',
    { id: '12D', row: 12, letter: 'D', status: 'available', type: 'economy', upgradePrice: 0 },
    { id: '12E', row: 12, letter: 'E', status: 'available', type: 'economy', upgradePrice: 0 },
    { id: '12F', row: 12, letter: 'F', status: 'selected', type: 'economy', upgradePrice: 0 }
  ]
}
```

### SeatAssignment
```typescript
{
  passengerId: 'pax-001',
  passengerName: 'John Doe',
  seatId: '12F',
  seat: { id: '12F', row: 12, letter: 'F', status: 'selected', type: 'economy', upgradePrice: 0 }
}
```
