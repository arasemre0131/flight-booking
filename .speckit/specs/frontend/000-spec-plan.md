# Frontend Spec Plan - Complete

## TAW 2025 Project Requirements Checklist

| Requirement | Status | Spec |
|-------------|--------|------|
| ✅ Flight search (anonymous) | Planned | 001C, 002A |
| ✅ Up to 1 intermediate stop | Planned | 002A |
| ✅ Sort by cost/duration/stops | Planned | 002A |
| ✅ Seat selection | Planned | 003B |
| ✅ Extras (baggage, legroom) | Planned | 003A |
| ✅ Real-time seat availability | Backend | WebSocket |
| ✅ User registration | Planned | 004A |
| ✅ Ticket purchase after login | Planned | 003C |
| ⬜ Airline dashboard | Phase 2 | TBD |
| ⬜ Admin panel | Phase 2 | TBD |

---

## Complete Page List

### Phase 1: Passenger Flow (Current Focus)

| # | Spec ID | Page | Description | Lines |
|---|---------|------|-------------|-------|
| 1 | 001A | Header + Footer | Shared components | ~100 |
| 2 | 001B | Search Form | Airport autocomplete, date picker, passengers | ~200 |
| 3 | 001C | Landing Page | Hero, deals, featured, testimonials | ~250 |
| 4 | 002A | Search Results - Flights | Flight list, filters, price grid | ~200 |
| 5 | 002B | Search Results - Bottom | Map, hotels, also searched | ~200 |
| 6 | 003A | Passenger Info | Form, emergency contact, bags | ~200 |
| 7 | 003B | Seat Selection | Aircraft map, economy/business toggle | ~250 |
| 8 | 003C | Payment Method | Card form, social login, summary | ~200 |
| 9 | 003D | Booking Confirmation | Success, itinerary, hotels, experiences | ~200 |
| 10 | 004A | Auth (Login/Register) | Login form, register form | ~150 |

**Phase 1 Total: ~1950 lines (10 specs)**

### Phase 2: Airline & Admin (Later)

| # | Spec ID | Page | Description |
|---|---------|------|-------------|
| 11 | 005A | Airline Dashboard | Overview, stats |
| 12 | 005B | Routes Management | CRUD routes |
| 13 | 005C | Flights Management | CRUD flights, pricing |
| 14 | 005D | Aircraft Management | CRUD aircraft |
| 15 | 005E | Statistics | Revenue, passengers, demand |
| 16 | 006A | Admin Panel | User management |
| 17 | 006B | Airline Invitation | Invite flow |

---

## Dependency Graph

```
Phase 1: Passenger Flow
========================

001A (Header/Footer)
    │
    ├──► 001B (Search Form)
    │        │
    │        ├──► 001C (Landing Page)
    │        │
    │        └──► 002A (Search Results - Flights)
    │                  │
    │                  └──► 002B (Search Results - Bottom)
    │
    └──► 004A (Auth Login/Register)
              │
              └──► 003A (Passenger Info)
                        │
                        └──► 003B (Seat Selection)
                                  │
                                  └──► 003C (Payment Method)
                                            │
                                            └──► 003D (Confirmation)
```

---

## Booking Flow (003A → 003D)

### User Journey
```
Search Results
     │
     ▼
┌─────────────────┐
│ Select Flight   │ ← Click on flight card
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 003A: Passenger │ ← Enter passenger details
│ Information     │   Emergency contact
│                 │   Bag selection (+/-)
└────────┬────────┘
         │ [Select seats]
         ▼
┌─────────────────┐
│ 003B: Seat      │ ← View aircraft map
│ Selection       │   Choose Economy/Business
│                 │   Click seat (e.g., 9F)
│                 │   Upgrade modal ($199)
└────────┬────────┘
         │ [Payment method]
         ▼
┌─────────────────┐
│ 003C: Payment   │ ← Credit card / Google Pay / Apple Pay
│ Method          │   Create account option
│                 │   Price summary (subtotal, taxes, total)
└────────┬────────┘
         │ [Confirm and pay]
         ▼
┌─────────────────┐
│ 003D: Booking   │ ← Success message
│ Confirmation    │   Flight summary
│                 │   Price breakdown
│                 │   Shop hotels
│                 │   Find experiences
└─────────────────┘
```

---

## File Structure

```
frontend/src/app/
├── pages/
│   ├── landing/                    # 001C
│   ├── search-results/             # 002A, 002B
│   ├── booking/
│   │   ├── passenger-info/         # 003A
│   │   ├── seat-selection/         # 003B
│   │   ├── payment/                # 003C
│   │   └── confirmation/           # 003D
│   └── auth/
│       ├── login/                  # 004A
│       └── register/               # 004A
│
├── shared/
│   ├── header/                     # 001A
│   ├── footer/                     # 001A
│   ├── search-form/                # 001B
│   ├── airport-autocomplete/       # 001B
│   ├── date-picker/                # 001B
│   └── passenger-selector/         # 001B
│
├── components/
│   ├── destination-card/           # 001C
│   ├── testimonial-card/           # 001C
│   ├── flight-card/                # 002A
│   ├── filter-bar/                 # 002A
│   ├── price-grid/                 # 002B
│   ├── route-map/                  # 002B
│   ├── hotel-card/                 # 002B
│   ├── seat-map/                   # 003B
│   ├── seat-class-selector/        # 003B
│   ├── flight-summary-card/        # 003A, 003C
│   └── experience-card/            # 003D
│
├── mock-data/
│   ├── airports.ts
│   ├── flights.ts
│   ├── airlines.ts
│   ├── destinations.ts
│   ├── hotels.ts
│   └── experiences.ts
│
└── models/
    ├── airport.model.ts
    ├── flight.model.ts
    ├── passenger.model.ts
    ├── booking.model.ts
    └── seat.model.ts
```

---

## Image Assets Required

### Booking Flow (`images/booking-flow/`)
| Image | Used In | Description |
|-------|---------|-------------|
| `economy-seats.png` | 003B | 4 blue seats (economy) |
| `business-seats.png` | 003B | 4 teal seats (business) |
| `luggage.png` | 003A | Backpack + suitcase illustration |

### Confirmation (`images/confirmation/`)
| Image | Used In | Description |
|-------|---------|-------------|
| `ryokan-japan.png` | 003D | Hotel card |
| `bessho-sasa.png` | 003D | Hotel card |
| `hotel-the-flag.png` | 003D | Hotel card |
| `9-hours-shinjuku.png` | 003D | Hotel card |
| `nihon-kimono.png` | 003D | Experience card |
| `teamlab-borderless.png` | 003D | Experience card |

---

## Implementation Order

```
Week 1: Core Layout
├── SPEC-001A: Header + Footer
├── SPEC-001B: Search Form Components
└── SPEC-001C: Landing Page Content

Week 2: Search Results
├── SPEC-002A: Search Results - Flight List
└── SPEC-002B: Search Results - Sidebar/Bottom

Week 3: Booking Flow
├── SPEC-003A: Passenger Information
├── SPEC-003B: Seat Selection
├── SPEC-003C: Payment Method
└── SPEC-003D: Booking Confirmation

Week 4: Auth + Polish
├── SPEC-004A: Login/Register
└── Integration + Testing
```
