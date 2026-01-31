# Quickstart: Payment Method

**Feature**: 008-payment | **Date**: 2025-01-31

## Overview

This guide covers implementation of the payment page with:
- Credit card form with validation
- Billing address form
- Booking summary sidebar
- Mock payment processing

## Prerequisites

- 007-seat-selection completed
- BookingService with seat assignments
- flight-summary component available

## File Structure

```
frontend/src/app/
├── models/
│   └── payment.model.ts          # New: PaymentDetails, BillingAddress, etc.
├── mock-data/
│   └── countries.data.ts         # New: Country/state mock data
├── utils/
│   └── card-validation.ts        # New: Luhn, card type detection
├── services/
│   └── booking.service.ts        # Extend: payment methods
│   └── payment.service.ts        # New: mock payment processing
├── components/
│   ├── payment-form/             # New: credit card form
│   ├── billing-form/             # New: billing address form
│   └── booking-summary/          # New: extended price breakdown
├── pages/
│   └── payment/                  # New: payment page
└── app.routes.ts                 # Update: add /payment route
```

## Implementation Steps

### Step 1: Create Models

**payment.model.ts**
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

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PriceSummary {
  baseFare: number;
  seatFees: number;
  taxesAndFees: number;
  total: number;
}

export interface PaymentResult {
  success: boolean;
  error?: string;
  confirmationNumber?: string;
}
```

### Step 2: Create Validation Utilities

**card-validation.ts**
```typescript
export function isValidLuhn(cardNumber: string): boolean {
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

export function detectCardType(cardNumber: string): CardType | null {
  const digits = cardNumber.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  return null;
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export function getCvvLength(cardType: CardType | null): number {
  return cardType === 'amex' ? 4 : 3;
}
```

### Step 3: Create Mock Data

**countries.data.ts**
```typescript
export interface Country {
  code: string;
  name: string;
  hasStates: boolean;
}

export interface State {
  code: string;
  name: string;
}

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', hasStates: true },
  { code: 'CA', name: 'Canada', hasStates: true },
  { code: 'GB', name: 'United Kingdom', hasStates: false },
  { code: 'DE', name: 'Germany', hasStates: false },
  { code: 'FR', name: 'France', hasStates: false },
  { code: 'IT', name: 'Italy', hasStates: false },
  { code: 'ES', name: 'Spain', hasStates: false },
  { code: 'AU', name: 'Australia', hasStates: true },
];

export const STATES_BY_COUNTRY: Record<string, State[]> = {
  US: [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'WA', name: 'Washington' },
    // ... more states
  ],
  CA: [
    { code: 'ON', name: 'Ontario' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'QC', name: 'Quebec' },
    { code: 'AB', name: 'Alberta' },
    // ... more provinces
  ],
  AU: [
    { code: 'NSW', name: 'New South Wales' },
    { code: 'VIC', name: 'Victoria' },
    { code: 'QLD', name: 'Queensland' },
    // ... more states
  ],
};
```

### Step 4: Create Payment Service

**payment.service.ts**
```typescript
@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly FAILURE_CARD = '4000000000000002';
  private readonly PROCESSING_DELAY = 1500;

  async processPayment(cardNumber: string): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, this.PROCESSING_DELAY));

    const digits = cardNumber.replace(/\D/g, '');

    if (digits === this.FAILURE_CARD) {
      return {
        success: false,
        error: 'Card declined. Please try another card.'
      };
    }

    return {
      success: true,
      confirmationNumber: this.generateConfirmationNumber()
    };
  }

  private generateConfirmationNumber(): string {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TRP-${new Date().getFullYear()}-${random}`;
  }
}
```

### Step 5: Extend BookingService

Add to booking.service.ts:
```typescript
readonly paymentDetails = computed(() => this._bookingDraft()?.paymentDetails ?? null);
readonly billingAddress = computed(() => this._bookingDraft()?.billingAddress ?? null);
readonly confirmationNumber = computed(() => this._bookingDraft()?.confirmationNumber ?? null);

updatePaymentDetails(paymentDetails: PaymentDetails): void {
  this._bookingDraft.update(draft => {
    if (!draft) return null;
    return { ...draft, paymentDetails };
  });
  // Note: Don't persist card details to storage for security
}

updateBillingAddress(billingAddress: BillingAddress): void {
  this._bookingDraft.update(draft => {
    if (!draft) return null;
    return { ...draft, billingAddress };
  });
  this.saveToStorage();
}

setConfirmationNumber(confirmationNumber: string): void {
  this._bookingDraft.update(draft => {
    if (!draft) return null;
    return { ...draft, confirmationNumber };
  });
  this.saveToStorage();
}

calculatePriceSummary(): PriceSummary {
  const draft = this._bookingDraft();
  if (!draft) return { baseFare: 0, seatFees: 0, taxesAndFees: 0, total: 0 };

  const passengerCount = draft.passengers.length;
  const outbound = draft.selectedFlight.price * passengerCount;
  const returnPrice = draft.returnFlight ? draft.returnFlight.price * passengerCount : 0;
  const baseFare = outbound + returnPrice;
  const seatFees = draft.seatFees ?? 0;
  const taxesAndFees = Math.round(baseFare * 0.10);

  return {
    baseFare,
    seatFees,
    taxesAndFees,
    total: baseFare + seatFees + taxesAndFees
  };
}
```

### Step 6: Create Payment Form Component

**payment-form.ts**
```typescript
@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.scss'
})
export class PaymentForm {
  paymentDetailsChange = output<PaymentDetails>();

  form: FormGroup;
  cardType = signal<CardType | null>(null);
  isMasked = signal(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      cardNumber: ['', [Validators.required, this.luhnValidator.bind(this)]],
      expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear: ['', [Validators.required, Validators.pattern(/^\d{2}$/), this.futureYearValidator.bind(this)]],
      cvv: ['', [Validators.required, this.cvvValidator.bind(this)]],
      cardholderName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = formatCardNumber(input.value);
    input.value = formatted;
    this.form.get('cardNumber')?.setValue(formatted.replace(/\s/g, ''), { emitEvent: false });
    this.cardType.set(detectCardType(formatted));
  }

  // Custom validators...
}
```

### Step 7: Create Payment Page

**payment.ts**
```typescript
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    PaymentForm,
    BillingForm,
    BookingSummary
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class PaymentPage {
  private bookingService = inject(BookingService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  isProcessing = signal(false);
  error = signal<string | null>(null);
  isFormValid = signal(false);

  priceSummary = computed(() => this.bookingService.calculatePriceSummary());

  async onPayNow(): Promise<void> {
    if (!this.isFormValid()) return;

    this.isProcessing.set(true);
    this.error.set(null);

    const paymentDetails = this.bookingService.paymentDetails();
    if (!paymentDetails) return;

    const result = await this.paymentService.processPayment(paymentDetails.cardNumber);

    this.isProcessing.set(false);

    if (result.success && result.confirmationNumber) {
      this.bookingService.setConfirmationNumber(result.confirmationNumber);
      this.router.navigate(['/confirmation']);
    } else {
      this.error.set(result.error ?? 'Payment failed. Please try again.');
    }
  }
}
```

### Step 8: Add Route

**app.routes.ts**
```typescript
{
  path: 'payment',
  loadComponent: () => import('./pages/payment/payment').then(m => m.PaymentPage)
}
```

## Page Layout

```
┌────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
├─────────────────────────────────┬──────────────────────────┤
│                                 │                          │
│  PAYMENT FORM                   │  BOOKING SUMMARY         │
│  ┌───────────────────────────┐  │  ┌────────────────────┐  │
│  │ Card Number     [VISA]    │  │  │ Flight Details     │  │
│  │ 4111 1111 1111 1111      │  │  │ SFO → LAX          │  │
│  ├───────────────────────────┤  │  │ Jan 15, 7:00 AM    │  │
│  │ Expiry    CVV             │  │  ├────────────────────┤  │
│  │ [MM/YY]   [___]           │  │  │ Passengers (2)     │  │
│  ├───────────────────────────┤  │  │ John Doe - 12A     │  │
│  │ Cardholder Name           │  │  │ Jane Doe - 12B     │  │
│  │ [________________]        │  │  ├────────────────────┤  │
│  └───────────────────────────┘  │  │ Base fare: $498    │  │
│                                 │  │ Seat fees: $60     │  │
│  BILLING ADDRESS                │  │ Taxes:     $50     │  │
│  ┌───────────────────────────┐  │  ├────────────────────┤  │
│  │ Street Address            │  │  │ TOTAL: $608        │  │
│  │ [________________]        │  │  └────────────────────┘  │
│  ├───────────────────────────┤  │                          │
│  │ City         State        │  │                          │
│  │ [________]   [____]       │  │                          │
│  ├───────────────────────────┤  │                          │
│  │ Postal Code  Country      │  │                          │
│  │ [______]     [US ▼]       │  │                          │
│  └───────────────────────────┘  │                          │
│                                 │                          │
│  [← Back to Seat Selection]     │  [PAY NOW - $608]        │
│                                 │                          │
├─────────────────────────────────┴──────────────────────────┤
│  FOOTER                                                     │
└────────────────────────────────────────────────────────────┘
```

## Testing Checklist

- [ ] Card number validation (Luhn algorithm)
- [ ] Card type detection (Visa, MC, Amex icons)
- [ ] Expiry date validation (not in past)
- [ ] CVV length validation (3 or 4 digits)
- [ ] Card number masking after blur
- [ ] Billing address country/state dropdown
- [ ] Price summary calculation
- [ ] Pay Now button disabled when form invalid
- [ ] Processing state (spinner, disabled button)
- [ ] Success navigation to confirmation
- [ ] Error display for declined card (4000000000000002)
- [ ] Back navigation to seat selection
- [ ] Responsive layout at 768px
- [ ] Mobile numeric keyboard for card input
