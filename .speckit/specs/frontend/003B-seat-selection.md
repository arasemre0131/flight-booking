# SPEC-003B: Seat Selection

> **Status:** ⬜ Pending | **Lines:** ~250 | **Priority:** P0

## Overview
Aircraft seat map with Economy/Business class toggle, interactive seat selection, and upgrade modal.

## Dependencies
- **Requires:** SPEC-003A (Passenger Info)
- **Required by:** SPEC-003C (Payment Method)

---

## Files to Create

| # | File Path | Purpose | Lines |
|---|-----------|---------|-------|
| 1 | `src/app/pages/booking/seat-selection/seat-selection.component.ts` | Page logic | ~70 |
| 2 | `src/app/pages/booking/seat-selection/seat-selection.component.html` | Page template | ~60 |
| 3 | `src/app/pages/booking/seat-selection/seat-selection.component.scss` | Page styles | ~40 |
| 4 | `src/app/components/seat-map/seat-map.component.ts` | Seat map logic | ~80 |
| 5 | `src/app/components/seat-map/seat-map.component.html` | Seat map template | ~50 |
| 6 | `src/app/components/seat-map/seat-map.component.scss` | Seat map styles | ~40 |
| 7 | `src/app/components/seat-class-selector/seat-class-selector.component.ts` | Class selector | ~30 |
| 8 | `src/app/components/seat-class-selector/seat-class-selector.component.html` | Selector template | ~25 |
| 9 | `src/app/components/seat-class-selector/seat-class-selector.component.scss` | Selector styles | ~20 |
| 10 | `src/app/models/seat.model.ts` | Seat interface | ~25 |

**Total: ~440 lines** (split into components)

---

## Page Layout

### Visual Reference
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ≡  SkyRoute              SFO → NRT    Feb 25|7:00AM    Mar 21|12:15PM   │
│                         California    Tokyo    Departing     Arriving   │
├─────────────────────────────────────────────────────────────────────────┤
│                         │                                               │
│  ┌─────────────────┐   │  ┌───────────────────┐  ┌───────────────────┐ │
│  │   AIRCRAFT      │   │  │  💺💺💺💺         │  │  💺💺💺💺         │ │
│  │   SEAT MAP      │   │  │  Economy          │  │  Business class   │ │
│  │                 │   │  │  [Selected]       │  │                   │ │
│  │  ┌─┐ ┌─┐ 1 ┌─┐ ┌─┐ │  │                   │  │                   │ │
│  │  │░│ │░│   │▓│ │▓│ │  │  Rest and recharge│  │  Rest and recharge│ │
│  │  └─┘ └─┘   └─┘ └─┘ │  │  during your...   │  │  during your...   │ │
│  │  ┌─┐ ┌─┐ 2 ┌─┐ ┌─┐ │  │                   │  │                   │ │
│  │  │▓│ │▓│   │▓│ │▓│ │  │  • Built-in       │  │  ✓ Extended leg   │ │
│  │  └─┘ └─┘   └─┘ └─┘ │  │    entertainment  │  │  ✓ First two bags │ │
│  │  ┌─┐ ┌─┐ 3 ┌─┐ ┌─┐ │  │  • Complimentary  │  │  ✓ Priority       │ │
│  │  │░│ │▓│   │▓│ │▓│ │  │    snacks         │  │  ✓ Personalized   │ │
│  │  └─┘ └─┘   └─┘ └─┘ │  │  • One free       │  │  ✓ Enhanced food  │ │
│  │       ...          │  │    carry-on       │  │  ✓ Seats recline  │ │
│  │  ⓘ Exit row        │  │                   │  │    40% more       │ │
│  │  ┌─┐ ┌─┐ 6 ┌─┐ ┌─┐ │  └───────────────────┘  └───────────────────┘ │
│  │  │█│ │█│   │░│ │█│ │                                               │
│  │  └─┘ └─┘   └─┘ └─┘ │  ──────────────────────────────────────────── │
│  │       ...          │                                               │
│  └─────────────────┘   │  Passenger 1        Seat number              │
│                         │  Sofia Knowles      9F                       │
│                         │                                               │
│                         │  [Save and close]      [Payment method]      │
└─────────────────────────┴───────────────────────────────────────────────┘
```

---

## Header Bar

```
┌─────────────────────────────────────────────────────────────────────┐
│  SFO          →          NRT     │  Feb 25 | 7:00AM  │ Mar 21|12:15PM│
│  California, US      Tokyo, Japan│    Departing      │   Arriving    │
└─────────────────────────────────────────────────────────────────────┘
```

- Purple background
- White text
- Arrow between airports

---

## Seat Map Component

### Aircraft Layout
- **Rows 1-5:** Business class (2-2 configuration, teal/green seats)
- **Exit row indicator** after row 5
- **Rows 6-24+:** Economy class (3-3 configuration, blue seats)
- **Exit row indicator** at rows 14 and 18

### Seat States
| State | Color | Description |
|-------|-------|-------------|
| Available (Economy) | Blue (#605DEC) | Can be selected |
| Available (Business) | Teal (#38B2AC) | Can be selected |
| Occupied | Light gray | Cannot be selected |
| Selected | Purple with ✓ | Current selection |

### Seat Naming
- Columns: A, B, C (aisle) D, E, F
- Example: 9F = Row 9, Column F (window right)

---

## Seat Class Selector

### Economy (Default Selected)
```
┌─────────────────────────────────┐
│  💺💺💺💺 (4 blue seats)        │
│                                 │
│  Economy  [Selected]            │
│                                 │
│  Rest and recharge during your  │
│  flight with extended leg room, │
│  personalized service, and a    │
│  multi-course meal service      │
│  ─────────                      │
│  • Built-in entertainment       │
│  • Complimentary snacks/drinks  │
│  • One free carry-on + personal │
└─────────────────────────────────┘
```

### Business Class
```
┌─────────────────────────────────┐
│  💺💺💺💺 (4 teal seats)        │
│                                 │
│  Business class  [Selected]     │
│                                 │
│  Rest and recharge during your  │
│  flight with extended leg room, │
│  personalized service, and a    │
│  multi-course meal service      │
│  ─────────                      │
│  ✓ Extended leg room            │
│  ✓ First two checked bags free  │
│  ✓ Priority boarding            │
│  ✓ Personalized service         │
│  ✓ Enhanced food and drink      │
│  ✓ Seats recline 40% more       │
└─────────────────────────────────┘
```

### Images
- Economy: `assets/images/booking-flow/economy-seats.png`
- Business: `assets/images/booking-flow/business-seats.png`

---

## Upgrade Modal

When selecting business seat while in economy:

```
┌─────────────────────────────────────────┐
│                                         │
│  Upgrade seat                           │
│                                         │
│  Upgrade your seat for only $199, and   │
│  enjoy 45 percent more leg room, and    │
│  seats that recline 40 percent more     │
│  than economy.                          │
│                                         │
│  [Cancel]        [Upgrade for $199]     │
│                                         │
└─────────────────────────────────────────┘
```

---

## Models (seat.model.ts)

```typescript
export type SeatClass = 'economy' | 'business';
export type SeatStatus = 'available' | 'occupied' | 'selected';

export interface Seat {
  id: string;          // e.g., "9F"
  row: number;
  column: string;      // A-F
  class: SeatClass;
  status: SeatStatus;
  price: number;       // Additional cost
  isExitRow: boolean;
  isWindow: boolean;
  isAisle: boolean;
}

export interface SeatSelection {
  passengerId: number;
  passengerName: string;
  seatId: string | null;
  seatClass: SeatClass;
  upgradePrice?: number;
}

export interface AircraftLayout {
  rows: number;
  businessRows: number;    // 1-5
  economyRows: number;     // 6-24
  exitRows: number[];      // [5, 14, 18]
  columns: string[];       // ['A', 'B', 'C', 'D', 'E', 'F']
  seats: Seat[];
}
```

---

## Footer Bar

```
┌─────────────────────────────────────────────────────────────────────┐
│  Passenger 1          Seat number     [Save and close] [Payment → ] │
│  Sofia Knowles        9F                                            │
└─────────────────────────────────────────────────────────────────────┘
```

- Purple dashed border around selected passenger info
- "Next flight" button if round trip (shows after first flight selection)

---

## Acceptance Criteria

- [ ] Aircraft seat map renders correctly
- [ ] Business (rows 1-5) and Economy (rows 6+) sections
- [ ] Exit row indicators display
- [ ] Clicking available seat selects it
- [ ] Clicking occupied seat does nothing
- [ ] Selected seat shows checkmark
- [ ] Economy/Business toggle switches class
- [ ] Seat class selector shows features list
- [ ] Upgrade modal appears when selecting business in economy mode
- [ ] Passenger name and seat number display in footer
- [ ] "Payment method" navigates to SPEC-003C
- [ ] For round trip: "Next flight" button after first selection
