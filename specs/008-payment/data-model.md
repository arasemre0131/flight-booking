# Data Model: Payment Method

**Feature**: 008-payment | **Date**: 2025-01-31

## Entities

### PaymentDetails

Credit card payment information.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| cardNumber | string | Yes | 13-19 digits, stored without spaces |
| cardType | CardType | Yes | Detected from BIN prefix |
| expiryMonth | string | Yes | 2 digits (01-12) |
| expiryYear | string | Yes | 2 digits (e.g., "26") |
| cvv | string | Yes | 3-4 digits |
| cardholderName | string | Yes | Name as on card |

**TypeScript Interface**:
```typescript
export type CardType = 'visa' | 'mastercard' | 'amex';

export interface PaymentDetails {
  cardNumber: string;
  cardType: CardType;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}
```

### BillingAddress

Billing address for payment verification.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| street | string | Yes | Street address |
| city | string | Yes | City name |
| state | string | Yes | State/Province (code or name) |
| postalCode | string | Yes | ZIP/Postal code |
| country | string | Yes | Country code (ISO 3166-1 alpha-2) |

**TypeScript Interface**:
```typescript
export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
```

### PriceSummary

Itemized pricing breakdown.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| baseFare | number | Yes | Flight price × passengers |
| seatFees | number | Yes | Total seat upgrade fees |
| taxesAndFees | number | Yes | 10% of base fare (mock) |
| total | number | Yes | Sum of all |

**TypeScript Interface**:
```typescript
export interface PriceSummary {
  baseFare: number;
  seatFees: number;
  taxesAndFees: number;
  total: number;
}
```

### PaymentResult

Result of payment processing.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| success | boolean | Yes | Whether payment succeeded |
| error | string | No | Error message if failed |
| confirmationNumber | string | No | Booking confirmation if success |

**TypeScript Interface**:
```typescript
export interface PaymentResult {
  success: boolean;
  error?: string;
  confirmationNumber?: string;
}
```

### BookingDraft Extension

Add to existing BookingDraft interface:

```typescript
export interface BookingDraft {
  // ... existing fields ...
  paymentDetails?: PaymentDetails;
  billingAddress?: BillingAddress;
  confirmationNumber?: string;
}
```

## Supporting Entities

### Country (Mock Data)

| Field | Type | Notes |
|-------|------|-------|
| code | string | ISO 3166-1 alpha-2 |
| name | string | Display name |
| hasStates | boolean | Whether to show state dropdown |

**Mock Data**:
```typescript
export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', hasStates: true },
  { code: 'CA', name: 'Canada', hasStates: true },
  { code: 'GB', name: 'United Kingdom', hasStates: false },
  { code: 'DE', name: 'Germany', hasStates: false },
  { code: 'FR', name: 'France', hasStates: false },
  // ... more countries
];
```

### State (Mock Data)

| Field | Type | Notes |
|-------|------|-------|
| code | string | State/Province code |
| name | string | Display name |
| countryCode | string | Parent country |

**Mock Data** (subset):
```typescript
export const US_STATES: State[] = [
  { code: 'CA', name: 'California', countryCode: 'US' },
  { code: 'NY', name: 'New York', countryCode: 'US' },
  { code: 'TX', name: 'Texas', countryCode: 'US' },
  // ... more states
];

export const CA_PROVINCES: State[] = [
  { code: 'ON', name: 'Ontario', countryCode: 'CA' },
  { code: 'BC', name: 'British Columbia', countryCode: 'CA' },
  { code: 'QC', name: 'Quebec', countryCode: 'CA' },
  // ... more provinces
];
```

## Relationships

```
BookingDraft
    │
    ├──► Flight (selectedFlight)
    ├──► Flight? (returnFlight)
    ├──► Passenger[]
    ├──► SeatAssignment[] (from 007)
    │
    ├──► PaymentDetails (new)
    ├──► BillingAddress (new)
    └──► confirmationNumber (new)

PriceSummary ──derived from──► BookingDraft
    │
    ├── baseFare ← flights × passengers
    ├── seatFees ← SeatAssignment[]
    ├── taxesAndFees ← 10% of baseFare
    └── total ← sum
```

## Validation Rules

### Card Number
- Must pass Luhn algorithm
- Length: 13-19 digits
- Must match known card type prefix

### Expiry Date
- Month: 01-12
- Year: Current year or future (2 digits)
- Combined: Not in the past

### CVV
- Visa/Mastercard: 3 digits
- Amex: 4 digits

### Cardholder Name
- Minimum 2 characters
- Alphanumeric and spaces only

### Billing Address
- All fields required
- Postal code format varies by country (not enforced in mock)

## State Transitions

### Payment Flow

```
[Form Invalid] ─────────────────────────────────────┐
       │                                             │
       │ all valid                                   │
       ▼                                             │
[Form Valid] ──click Pay Now──► [Processing]        │
                                     │              │
                 ┌───────────────────┼──────────────┘
                 │                   │
           payment fails      payment succeeds
                 │                   │
                 ▼                   ▼
          [Error State]    [Navigate to Confirmation]
                 │
                 │ retry
                 ▼
          [Form Valid]
```

## Sample Data

### PaymentDetails
```typescript
{
  cardNumber: '4111111111111111',
  cardType: 'visa',
  expiryMonth: '12',
  expiryYear: '26',
  cvv: '123',
  cardholderName: 'John Doe'
}
```

### BillingAddress
```typescript
{
  street: '123 Main Street',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '94102',
  country: 'US'
}
```

### PriceSummary
```typescript
{
  baseFare: 498,      // $249 × 2 passengers
  seatFees: 60,       // 2 × $30 exit row
  taxesAndFees: 50,   // 10% of $498
  total: 608          // $498 + $60 + $50
}
```

### PaymentResult (Success)
```typescript
{
  success: true,
  confirmationNumber: 'TRP-2025-ABC123'
}
```

### PaymentResult (Failure)
```typescript
{
  success: false,
  error: 'Card declined. Please try another card.'
}
```
