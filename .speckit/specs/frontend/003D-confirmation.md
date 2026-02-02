# SPEC-003D: Booking Confirmation

> **Status:** ⬜ Pending | **Lines:** ~200 | **Priority:** P0

## Overview
Booking confirmation page with success message, flight summary, price breakdown, hotel recommendations, and experiences.

## Dependencies
- **Requires:** SPEC-003C (Payment Method)
- **Required by:** None (End of booking flow)

---

## Files to Create

| # | File Path | Purpose | Lines |
|---|-----------|---------|-------|
| 1 | `src/app/pages/booking/confirmation/confirmation.component.ts` | Page logic | ~50 |
| 2 | `src/app/pages/booking/confirmation/confirmation.component.html` | Page template | ~90 |
| 3 | `src/app/pages/booking/confirmation/confirmation.component.scss` | Page styles | ~50 |
| 4 | `src/app/components/experience-card/experience-card.component.ts` | Experience card | ~20 |
| 5 | `src/app/components/experience-card/experience-card.component.html` | Card template | ~15 |
| 6 | `src/app/components/experience-card/experience-card.component.scss` | Card styles | ~15 |
| 7 | `src/app/mock-data/experiences.ts` | Experience data | ~25 |

**Total: ~265 lines**

---

## Page Layout

### Visual Reference
```
┌─────────────────────────────────────────────────────────────────────────┐
│  SkyRoute        Flights  Hotels  Packages        My trips  👤           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ✓ Your flight has been booked successfully!                     │   │
│  │   Your confirmation number is #381029404387                  ✕  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├───────────────────────────────────────┬─────────────────────────────────┤
│                                       │                                 │
│  Bon voyage, Sophia!                  │  Shop hotels                    │
│  Confirmation number: #381029404387   │  SkyRoute partners with thousands │
│                                       │  of hotels to get you the best  │
│  Thank you for booking your travel    │  deal. Save up to 30% when you  │
│  with SkyRoute! Below is a summary of   │  add a hotel to your trip.      │
│  your trip to Narita airport in       │                                 │
│  Tokyo, Japan. We've sent a copy of   │  ┌─────────────────────────┐   │
│  your booking confirmation to your    │  │ [Ryokan Japan image]    │   │
│  email address. You can also find     │  │ Ryokan Japan      $439  │   │
│  this page again in My trips.         │  │ Enjoy views of the      │   │
│                                       │  │ garden from your room   │   │
│  Flight summary                       │  └─────────────────────────┘   │
│  ─────────────────────                │  ┌─────────────────────────┐   │
│  Departing February 25th, 2021        │  │ [Bessho SASA image]     │   │
│  ┌────────────────────────────────┐   │  │ Bessho SASA       $529  │   │
│  │ 🔵 16h 45m   7:00AM-4:15PM     │   │  │ Japanese ryokan with    │   │
│  │    Hawaiian  1 stop   $624     │   │  │ private onsen bath      │   │
│  │    value    2h 45m in HNL      │   │  └─────────────────────────┘   │
│  └────────────────────────────────┘   │  ┌─────────────────────────┐   │
│  Seat 9F (economy, window), 1 bag     │  │ [Hotel The Flag image]  │   │
│                                       │  │ HOTEL THE FLAG    $139  │   │
│  Arriving March 21st, 2021            │  │ Modern hotel in the     │   │
│  ┌────────────────────────────────┐   │  │ heart of Osaka          │   │
│  │ 🔵 16h 45m   7:00AM-4:15PM     │   │  └─────────────────────────┘   │
│  │    Hawaiian  1 stop   $624     │   │  ┌─────────────────────────┐   │
│  │    value    2h 45m in HNL      │   │  │ [9 Hours image]         │   │
│  └────────────────────────────────┘   │  │ 9 Hours Shinjuku  $59   │   │
│  Seat 4F (business, window), 1 bag    │  │ Capsule hotel at        │   │
│                                       │  │ Shinjuku station        │   │
│  Price breakdown                      │  └─────────────────────────┘   │
│  ─────────────────                    │                                 │
│  Departing Flight      $251.50        │  [    Shop all hotels    ]      │
│  Arriving Flight       $251.50        │                                 │
│  Baggage fees          $0             │  ─────────────────────────────  │
│  Seat upgrade (bus.)   $199           │                                 │
│  Subtotal              $702           │  Find unique experiences        │
│  Taxes (9.4%)          $66            │  Find events and authentic      │
│  ─────────────────────────────────    │  cultural experiences available │
│  Amount paid           $768           │  exclusively to SkyRoute users.   │
│                                       │                                 │
│  Payment method                       │  ┌─────────────────────────┐   │
│  ┌────────────────────────────────┐   │  │ [Nihon Kimono image]    │   │
│  │  VISA                          │   │  │ Nihon Kimono      $89   │   │
│  │  Sophia Knowles                │   │  │ Wear the national dress │   │
│  │  ************3456    10/23     │   │  │ of Japan around the city│   │
│  └────────────────────────────────┘   │  └─────────────────────────┘   │
│                                       │  ┌─────────────────────────┐   │
│  Share your travel itinerary          │  │ [teamLab image]         │   │
│  You can email your itinerary to      │  │ teamLab Borderless $39  │   │
│  anyone by entering their email...    │  │ A modern sensory        │   │
│  ┌───────────────────────────────┐    │  │ experience of light     │   │
│  │ Email address                 │    │  └─────────────────────────┘   │
│  ├───────────────────────────────┤    │                                 │
│  │ Email address                 │    │  [  View all experiences  ]     │
│  ├───────────────────────────────┤    │                                 │
│  │ Email address                 │    │                                 │
│  └───────────────────────────────┘    │                                 │
│  [Email itinerary]  + Add another     │                                 │
│                                       │                                 │
│  Flight Route                         │                                 │
│  ┌────────────────────────────────┐   │                                 │
│  │     [Map NRT → SFO]            │   │                                 │
│  └────────────────────────────────┘   │                                 │
│                                       │                                 │
└───────────────────────────────────────┴─────────────────────────────────┘
│                              FOOTER                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Success Banner

```
┌─────────────────────────────────────────────────────────────────────┐
│ ✓ Your flight has been booked successfully! Your confirmation      │
│   number is #381029404387                                       ✕  │
└─────────────────────────────────────────────────────────────────────┘
```

- Green checkmark
- Dismissable (✕)
- Purple/blue background with light tint

---

## Flight Summary Section

### Header Info
- "Bon voyage, Sophia!"
- Confirmation number: #381029404387
- Thank you message with destination details

### Flight Cards
| Section | Content |
|---------|---------|
| Departing | Date, flight card, seat info |
| Arriving | Date, flight card, seat info |

Seat info format: "Seat 9F (economy, window), 1 checked bag"

---

## Price Breakdown

| Item | Amount |
|------|--------|
| Departing Flight | $251.50 |
| Arriving Flight | $251.50 |
| Baggage fees | $0 |
| Seat upgrade (business) | $199 |
| Subtotal | $702 |
| Taxes (9.4%) | $66 |
| **Amount paid** | **$768** |

---

## Payment Method Card

```
┌────────────────────────────────┐
│  VISA (purple gradient bg)     │
│  Sophia Knowles                │
│  ************3456    10/23     │
└────────────────────────────────┘
```

- Purple/blue gradient background
- White text
- Masked card number (last 4 visible)

---

## Share Itinerary Section

- 3 email input fields
- "Email itinerary" button
- "+ Add another" link

---

## Shop Hotels Section (Right Sidebar)

### Hotels (4 cards)
| Image | Name | Price |
|-------|------|-------|
| `ryokan-japan.png` | Ryokan Japan | $439 |
| `bessho-sasa.png` | Bessho SASA | $529 |
| `hotel-the-flag.png` | HOTEL THE FLAG 大阪市 | $139 |
| `9-hours-shinjuku.png` | 9 Hours Shinjuku | $59 |

### Mock Data
```typescript
export const CONFIRMATION_HOTELS = [
  {
    image: 'assets/images/confirmation/ryokan-japan.png',
    name: 'Ryokan Japan',
    description: 'Enjoy views of the garden from your room',
    price: 439
  },
  // ...
];
```

---

## Find Experiences Section

### Experiences (2 cards)
| Image | Name | Price |
|-------|------|-------|
| `nihon-kimono.png` | Nihon Kimono | $89 |
| `teamlab-borderless.png` | teamLab Borderless | $39 |

### Mock Data (experiences.ts)
```typescript
export interface Experience {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
}

export const EXPERIENCES: Experience[] = [
  {
    id: '1',
    image: 'assets/images/confirmation/nihon-kimono.png',
    name: 'Nihon Kimono',
    description: 'Wear the national dress of Japan around the city',
    price: 89
  },
  {
    id: '2',
    image: 'assets/images/confirmation/teamlab-borderless.png',
    name: 'teamLab Borderless',
    description: 'A modern sensory experience of light and sound',
    price: 39
  }
];
```

---

## Route Map

Same component as SPEC-002B (RouteMapComponent)
- Shows NRT ↔ SFO route

---

## Acceptance Criteria

- [ ] Success banner displays with confirmation number
- [ ] Banner is dismissable
- [ ] Flight summary shows both flights
- [ ] Seat info displays correctly (class, position, bags)
- [ ] Price breakdown shows all items
- [ ] Payment card shows masked number
- [ ] Share itinerary with email inputs
- [ ] 4 hotel cards display
- [ ] 2 experience cards display
- [ ] "Shop all hotels" button works
- [ ] "View all experiences" button works
- [ ] Route map displays
- [ ] Header shows "My trips" link (logged in)
