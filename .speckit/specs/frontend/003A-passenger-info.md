# SPEC-003A: Passenger Information

> **Status:** ⬜ Pending | **Lines:** ~200 | **Priority:** P0

## Overview
Passenger information form with personal details, emergency contact, and bag selection.

## Dependencies
- **Requires:** SPEC-002A (Search Results), SPEC-004A (Auth)
- **Required by:** SPEC-003B (Seat Selection)

---

## Files to Create

| # | File Path | Purpose | Lines |
|---|-----------|---------|-------|
| 1 | `src/app/pages/booking/passenger-info/passenger-info.component.ts` | Form logic | ~60 |
| 2 | `src/app/pages/booking/passenger-info/passenger-info.component.html` | Form template | ~80 |
| 3 | `src/app/pages/booking/passenger-info/passenger-info.component.scss` | Form styles | ~40 |
| 4 | `src/app/components/flight-summary-card/flight-summary-card.component.ts` | Summary logic | ~20 |
| 5 | `src/app/components/flight-summary-card/flight-summary-card.component.html` | Summary template | ~25 |
| 6 | `src/app/components/flight-summary-card/flight-summary-card.component.scss` | Summary styles | ~15 |
| 7 | `src/app/models/passenger.model.ts` | Passenger interface | ~20 |

**Total: ~260 lines**

---

## Page Layout

### Visual Reference
```
┌─────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                      │
├─────────────────────────────────────────┬───────────────────────────────┤
│                                         │                               │
│  Passenger information                  │  ┌─────────────────────────┐  │
│  Enter the required information...      │  │ 🔵 Hawaiian Airlines    │  │
│                                         │  │ FIG4312    16h 45m (+1d)│  │
│  Passenger 1 (Adult)                    │  │ 7:00 AM - 4:15 PM       │  │
│  ┌─────────┐┌────────┐┌─────────┐      │  │ 2h 45m in HNL           │  │
│  │First*   ││Middle  ││Last*    │      │  ├─────────────────────────┤  │
│  └─────────┘└────────┘└─────────┘      │  │ 🔵 Hawaiian Airlines    │  │
│  ┌─────────┐┌────────────────────┐      │  │ FIG4312    16h 45m (+1d)│  │
│  │Suffix   ││Date of birth*      │      │  │ 7:00 AM - 4:15 PM       │  │
│  └─────────┘└────────────────────┘      │  │ 2h 45m in HNL           │  │
│  ┌─────────────────┐┌────────────────┐  │  └─────────────────────────┘  │
│  │Email*           ││Phone*          │  │                               │
│  └─────────────────┘└────────────────┘  │  Subtotal         $503        │
│  ┌─────────────────┐┌────────────────┐  │  Taxes and Fees   $121        │
│  │Redress number   ││Known traveler* │  │  ─────────────────────────    │
│  └─────────────────┘└────────────────┘  │  Total            $624        │
│                                         │                               │
│  Emergency contact information          │  [    Select seats    ]       │
│  ☐ Same as Passenger 1                  │                               │
│  ┌─────────────────┐┌────────────────┐  │  ┌─────────────────────────┐  │
│  │First name*      ││Last name*      │  │  │                         │  │
│  └─────────────────┘└────────────────┘  │  │    🎒 🧳 (luggage)      │  │
│  ┌─────────────────┐┌────────────────┐  │  │                         │  │
│  │Email*           ││Phone*          │  │  │    14"    9"            │  │
│  └─────────────────┘└────────────────┘  │  │    36cm   23cm          │  │
│                                         │  │                         │  │
│  Bag information                        │  └─────────────────────────┘  │
│  Each passenger is allowed one free...  │                               │
│                                         │                               │
│  Passenger 1          Checked bags      │                               │
│  First Last           [ - ] 1 [ + ]     │                               │
│                                         │                               │
│  [Save and close]  [Select seats]       │                               │
│                                         │                               │
└─────────────────────────────────────────┴───────────────────────────────┘
```

---

## Form Fields

### Passenger 1 (Adult)
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| First name | text | Yes | Min 2 chars |
| Middle name | text | No | - |
| Last name | text | Yes | Min 2 chars |
| Suffix | text | No | - |
| Date of birth | date | Yes | MM/DD/YY format |
| Email address | email | Yes | Valid email |
| Phone number | tel | Yes | Valid phone |
| Redress number | text | No | - |
| Known traveler number | text | Yes | - |

### Emergency Contact
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Same as Passenger 1 | checkbox | No | Auto-fill if checked |
| First name | text | Yes | Min 2 chars |
| Last name | text | Yes | Min 2 chars |
| Email address | email | Yes | Valid email |
| Phone number | tel | Yes | Valid phone |

### Bag Information
| Field | Type | Default | Range |
|-------|------|---------|-------|
| Checked bags | counter | 1 | 0-3 |

---

## Flight Summary Card (Right Sidebar)

### Data Display
```typescript
interface FlightSummary {
  airline: string;
  logo: string;
  flightNumber: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  stopInfo: string;
}
```

### Price Breakdown
| Item | Amount |
|------|--------|
| Subtotal | $503 |
| Taxes and Fees | $121 |
| **Total** | **$624** |

---

## Luggage Illustration

- Image: `assets/images/booking-flow/luggage.png`
- Shows purple backpack + green suitcase
- Dimensions labeled: 22" x 14" x 9" (56cm x 36cm x 23cm)
- Caption: "*Dimensions include handles and wheels"

---

## Models (passenger.model.ts)

```typescript
export interface Passenger {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  dateOfBirth: Date;
  email: string;
  phone: string;
  redressNumber?: string;
  knownTravelerNumber?: string;
}

export interface EmergencyContact {
  sameAsPassenger: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PassengerInfo {
  passengers: Passenger[];
  emergencyContact: EmergencyContact;
  checkedBags: number;
}
```

---

## Buttons

| Button | Style | Action |
|--------|-------|--------|
| Save and close | Outline purple | Save & return to search |
| Select seats | Solid purple | Navigate to seat selection |

---

## Acceptance Criteria

- [ ] All required fields validate on blur
- [ ] Date of birth uses date picker
- [ ] "Same as Passenger 1" auto-fills emergency contact
- [ ] Checked bags counter works (+/-)
- [ ] Min 0, max 3 checked bags
- [ ] Flight summary shows both flights (outbound + return)
- [ ] Price breakdown displays correctly
- [ ] Luggage illustration displays
- [ ] Form state persists on navigation
- [ ] "Select seats" navigates to SPEC-003B
