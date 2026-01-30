# SPEC-003C: Payment Method

> **Status:** ⬜ Pending | **Lines:** ~200 | **Priority:** P0

## Overview
Payment form with multiple payment options, account creation, and order summary.

## Dependencies
- **Requires:** SPEC-003B (Seat Selection)
- **Required by:** SPEC-003D (Booking Confirmation)

---

## Files to Create

| # | File Path | Purpose | Lines |
|---|-----------|---------|-------|
| 1 | `src/app/pages/booking/payment/payment.component.ts` | Page logic | ~60 |
| 2 | `src/app/pages/booking/payment/payment.component.html` | Page template | ~80 |
| 3 | `src/app/pages/booking/payment/payment.component.scss` | Page styles | ~40 |
| 4 | `src/app/models/payment.model.ts` | Payment interface | ~25 |

**Total: ~205 lines**

---

## Page Layout

### Visual Reference
```
┌─────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                      │
├─────────────────────────────────────────┬───────────────────────────────┤
│                                         │                               │
│  Payment method                         │  ┌─────────────────────────┐  │
│  Select a payment method below. Tripma  │  │ 🔵 Hawaiian Airlines    │  │
│  processes your payment securely with   │  │ FIG4312    16h 45m (+1d)│  │
│  end-to-end encryption.                 │  │ 7:00 AM - 4:15 PM       │  │
│                                         │  │ 2h 45m in HNL           │  │
│  ┌────────────────────────────────────┐ │  ├─────────────────────────┤  │
│  │[Credit✓][G Pay][Apple][PayPal][₿] │ │  │ 🔵 Hawaiian Airlines    │  │
│  └────────────────────────────────────┘ │  │ FIG4312    16h 45m (+1d)│  │
│                                         │  │ 7:00 AM - 4:15 PM       │  │
│  Credit card details                    │  │ 2h 45m in HNL           │  │
│  ☑ Billing address is same as Pass. 1  │  └─────────────────────────┘  │
│                                         │                               │
│  ┌───────────────────────────────────┐  │  Seat upgrade       $199     │
│  │ Name on card                      │  │  Subtotal          $702     │
│  └───────────────────────────────────┘  │  Taxes and Fees     $66     │
│  ┌───────────────────────────────────┐  │  ─────────────────────────    │
│  │ Card number                       │  │  Total             $768     │
│  └───────────────────────────────────┘  │                               │
│  ┌─────────────────┐ ┌───────────────┐  │  [   Confirm and pay    ]    │
│  │ Expiration date │ │ CCV      ⓘ   │  │                               │
│  │ MM/YY           │ │               │  │                               │
│  └─────────────────┘ └───────────────┘  │                               │
│                                         │                               │
│  Create an account                      │                               │
│  Tripma is free to use as a guest...   │                               │
│  ☐ Save card and create account        │                               │
│                                         │                               │
│  ┌───────────────────────────────────┐  │                               │
│  │ Email address or phone number     │  │                               │
│  └───────────────────────────────────┘  │                               │
│  ┌───────────────────────────────────┐  │                               │
│  │ Password                      👁  │  │                               │
│  └───────────────────────────────────┘  │                               │
│  Strong password                        │                               │
│                                         │                               │
│  ──────────────── or ────────────────  │                               │
│                                         │                               │
│  [ G  Sign up with Google            ] │                               │
│  [ 🍎 Continue with Apple            ] │                               │
│  [ f  Continue with Facebook         ] │                               │
│                                         │                               │
│  Cancellation policy                    │                               │
│  This flight has a flexible...          │                               │
│                                         │                               │
│  [Back to seat select] [Confirm and pay]│                               │
│                                         │                               │
└─────────────────────────────────────────┴───────────────────────────────┘
```

---

## Payment Methods

### Tab Options
| Method | Icon | Active Style |
|--------|------|--------------|
| Credit card | 💳 | Purple bg, white text |
| Google Pay | G | Outline |
| Apple Pay | 🍎 | Outline |
| PayPal | P | Outline |
| Crypto | ₿ | Outline |

Default: Credit card selected

---

## Credit Card Form

### Fields
| Field | Type | Placeholder | Validation |
|-------|------|-------------|------------|
| Billing same as Passenger | checkbox | Checked | - |
| Name on card | text | "Sophia Knowles" | Required |
| Card number | text | "1234567890123456" | 16 digits, Luhn |
| Expiration date | text | "MM/YY" | Future date |
| CCV | text | "123" | 3-4 digits |

### Card Number Formatting
- Display: `1234 5678 9012 3456` (spaces every 4)
- Detect card type (Visa, Mastercard, Amex)

---

## Create Account Section

### Description
"Tripma is free to use as a guest, but if you create an account today, you can save and view flights, manage your trips, earn rewards, and more."

### Fields
| Field | Type | Validation |
|-------|------|------------|
| Save card checkbox | checkbox | - |
| Email or phone | text | Email or phone format |
| Password | password | Min 8 chars, strength indicator |

### Password Strength
- Weak: Red
- Medium: Yellow
- Strong: Green ("Strong password")

---

## Social Login Buttons

```
┌─────────────────────────────────────┐
│  G   Sign up with Google            │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  🍎  Continue with Apple             │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  f   Continue with Facebook          │
└─────────────────────────────────────┘
```

Style: White background, gray border, icon + text

---

## Order Summary (Right Sidebar)

### Flight Cards
Same as SPEC-003A (FlightSummaryCard component)

### Price Breakdown
| Item | Amount |
|------|--------|
| Seat upgrade | $199 |
| Subtotal | $702 |
| Taxes and Fees | $66 |
| **Total** | **$768** |

Note: Seat upgrade only shows if business selected

---

## Cancellation Policy

```
Cancellation policy

This flight has a flexible cancellation policy. If you cancel or
change your flight up to 30 days before the departure date, you
are eligible for a free refund. All flights booked on Tripma are
backed by our satisfaction guarantee, however cancellation
policies vary by airline. See the full cancellation policy for
this flight.
```

"full cancellation policy" = purple link

---

## Models (payment.model.ts)

```typescript
export type PaymentMethod = 'credit' | 'google' | 'apple' | 'paypal' | 'crypto';

export interface CreditCard {
  nameOnCard: string;
  cardNumber: string;
  expirationDate: string;  // MM/YY
  ccv: string;
  billingAddressSameAsPassenger: boolean;
}

export interface PaymentInfo {
  method: PaymentMethod;
  creditCard?: CreditCard;
  createAccount: boolean;
  email?: string;
  password?: string;
}

export interface OrderSummary {
  flights: FlightSummary[];
  seatUpgrade: number;
  subtotal: number;
  taxesAndFees: number;
  total: number;
}
```

---

## Buttons

| Button | Style | Action |
|--------|-------|--------|
| Back to seat select | Outline purple | Navigate back to SPEC-003B |
| Confirm and pay | Solid purple | Process payment → SPEC-003D |

---

## Acceptance Criteria

- [ ] 5 payment method tabs work
- [ ] Credit card form validates
- [ ] Card number formats with spaces
- [ ] Expiration date validates future
- [ ] CCV tooltip explains code
- [ ] Password strength indicator works
- [ ] Social login buttons display
- [ ] Order summary shows correct totals
- [ ] Seat upgrade shows if applicable
- [ ] Cancellation policy displays
- [ ] "Confirm and pay" processes payment
- [ ] Success navigates to SPEC-003D
