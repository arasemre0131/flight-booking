# Research: Payment Method

**Feature**: 008-payment | **Date**: 2025-01-31

## R1: Credit Card Validation

### Luhn Algorithm Implementation

The Luhn algorithm (mod 10) validates credit card numbers:

```typescript
function isValidCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}
```

### Card Type Detection (BIN Prefixes)

| Card Type | Prefix Pattern | Length | CVV Length |
|-----------|---------------|--------|------------|
| Visa | 4 | 13, 16, 19 | 3 |
| Mastercard | 51-55, 2221-2720 | 16 | 3 |
| American Express | 34, 37 | 15 | 4 |

```typescript
function detectCardType(cardNumber: string): CardType | null {
  const digits = cardNumber.replace(/\D/g, '');

  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';

  return null;
}
```

## R2: Form Validation Strategy

### Angular Reactive Forms Approach

```typescript
this.paymentForm = this.fb.group({
  cardNumber: ['', [Validators.required, this.luhnValidator]],
  expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
  expiryYear: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
  cvv: ['', [Validators.required, this.cvvValidator]],
  cardholderName: ['', [Validators.required, Validators.minLength(2)]]
});
```

### Expiry Date Validation

```typescript
function isValidExpiry(month: string, year: string): boolean {
  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Get last 2 digits
  const currentMonth = now.getMonth() + 1;

  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);

  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;

  return true;
}
```

## R3: Card Number Formatting & Masking

### Display Format While Typing

```typescript
function formatCardNumber(value: string, cardType: CardType | null): string {
  const digits = value.replace(/\D/g, '');

  if (cardType === 'amex') {
    // Amex: 4-6-5 format (XXXX XXXXXX XXXXX)
    return digits.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
  }

  // Standard: 4-4-4-4 format (XXXX XXXX XXXX XXXX)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}
```

### Masked Display After Entry

```typescript
function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
}
```

## R4: Mock Payment Processing

### Test Card Numbers

| Card Number | Result | Description |
|-------------|--------|-------------|
| 4111111111111111 | Success | Valid Visa test card |
| 5500000000000004 | Success | Valid Mastercard test card |
| 378282246310005 | Success | Valid Amex test card |
| 4000000000000002 | Failure | Decline test card |

### Processing Simulation

```typescript
async function processPayment(cardNumber: string): Promise<PaymentResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const digits = cardNumber.replace(/\D/g, '');

  // Test failure card
  if (digits === '4000000000000002') {
    return { success: false, error: 'Card declined. Please try another card.' };
  }

  // All other valid cards succeed
  return {
    success: true,
    confirmationNumber: generateConfirmationNumber()
  };
}
```

## R5: Billing Address Patterns

### Country/State Data Structure

```typescript
interface Country {
  code: string;  // ISO 3166-1 alpha-2
  name: string;
  hasStates: boolean;
}

interface State {
  code: string;
  name: string;
  countryCode: string;
}
```

### Simplified Implementation (Mock)

For the mock implementation, support:
- United States (with state dropdown)
- Canada (with province dropdown)
- Other countries (free text for state/province)

## R6: Price Summary Breakdown

### Itemized Pricing Structure

```typescript
interface PriceSummary {
  baseFare: number;        // Flight price × passengers
  seatFees: number;        // Sum of seat upgrade fees
  taxesAndFees: number;    // 10% of base fare (mock)
  total: number;           // Sum of all
}
```

### Calculation

```typescript
function calculatePriceSummary(
  flightPrice: number,
  returnPrice: number | undefined,
  passengerCount: number,
  seatFees: number
): PriceSummary {
  const baseFare = (flightPrice + (returnPrice ?? 0)) * passengerCount;
  const taxesAndFees = Math.round(baseFare * 0.10); // 10% mock tax

  return {
    baseFare,
    seatFees,
    taxesAndFees,
    total: baseFare + seatFees + taxesAndFees
  };
}
```

## Decisions Summary

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Card Validation | Luhn + BIN detection | Industry standard, client-side only |
| Form Library | Angular Reactive Forms | Consistent with codebase |
| Masking | Show last 4 digits after blur | Security best practice |
| Payment Sim | 1.5s delay, test cards | Realistic UX testing |
| Billing | Country dropdown, conditional states | Common pattern |
| Taxes | 10% mock rate | Simplicity per spec |
