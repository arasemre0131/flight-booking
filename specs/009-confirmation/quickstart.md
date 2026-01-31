# Quickstart: Booking Confirmation

**Feature**: 009-confirmation | **Date**: 2025-01-31

## Overview

Single page component displaying booking confirmation after successful payment.
Uses existing BookingService data - no new services or models needed.

## File Structure

```
frontend/src/app/
├── pages/
│   └── confirmation/
│       ├── confirmation.ts          # Component logic
│       ├── confirmation.html        # Template
│       └── confirmation.scss        # Styles
└── services/
    └── booking.service.ts           # Add clearBooking() method
```

## Implementation Steps

### Step 1: Add clearBooking() to BookingService

```typescript
// In booking.service.ts
clearBooking(): void {
  this._bookingDraft.set(null);
  sessionStorage.removeItem('bookingDraft');
}
```

### Step 2: Create ConfirmationPage Component

```typescript
// confirmation.ts
@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss'
})
export class ConfirmationPage {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  // Computed signals
  confirmationNumber = computed(() => this.bookingService.confirmationNumber());
  booking = computed(() => this.bookingService.bookingDraft());
  priceSummary = computed(() => this.bookingService.calculatePriceSummary());

  constructor() {
    // Redirect if no confirmation
    if (!this.bookingService.confirmationNumber()) {
      this.router.navigate(['/']);
    }
  }

  // Get passenger's seat for a flight
  getSeatForPassenger(passengerId: string, flightId: string): string {
    const assignments = this.bookingService.seatAssignments();
    const assignment = assignments.find(
      a => a.passengerId === passengerId && a.flightId === flightId
    );
    return assignment?.seatNumber ?? 'Not assigned';
  }

  // Mask card number for display
  getMaskedCard(): string {
    const payment = this.bookingService.paymentDetails();
    if (!payment) return '';
    return `•••• •••• •••• ${payment.cardNumber.slice(-4)}`;
  }

  // Get primary email
  getPrimaryEmail(): string | null {
    const passengers = this.booking()?.passengers ?? [];
    return passengers[0]?.email ?? null;
  }

  // Print confirmation
  printConfirmation(): void {
    window.print();
  }

  // Start new booking
  bookAnotherFlight(): void {
    this.bookingService.clearBooking();
    this.router.navigate(['/']);
  }
}
```

### Step 3: Template Structure

```html
<!-- confirmation.html -->
<div class="confirmation-page">
  @if (booking()) {
    <!-- Success Header -->
    <div class="confirmation-header">
      <div class="success-icon">✓</div>
      <h1>Booking Confirmed!</h1>
      <p class="confirmation-number">{{ confirmationNumber() }}</p>
    </div>

    <!-- Email Notification -->
    @if (getPrimaryEmail()) {
      <div class="email-notice">
        Confirmation sent to {{ getPrimaryEmail() }}
      </div>
    }

    <!-- Flight Details -->
    <section class="section flight-details">
      <h2>Flight Details</h2>

      <!-- Outbound -->
      @if (booking()?.outboundFlight; as flight) {
        <div class="flight-card">
          <div class="flight-label">Outbound</div>
          <!-- Flight info here -->
        </div>
      }

      <!-- Return -->
      @if (booking()?.returnFlight; as flight) {
        <div class="flight-card">
          <div class="flight-label">Return</div>
          <!-- Flight info here -->
        </div>
      }
    </section>

    <!-- Passengers & Seats -->
    <section class="section passengers">
      <h2>Passengers</h2>
      @for (passenger of booking()?.passengers; track passenger.id) {
        <div class="passenger-row">
          <span class="name">{{ passenger.firstName }} {{ passenger.lastName }}</span>
          <!-- Seat assignments -->
        </div>
      }
    </section>

    <!-- Payment Summary -->
    <section class="section payment-summary">
      <h2>Payment Summary</h2>
      <div class="price-breakdown">
        <!-- Itemized prices -->
      </div>
      <div class="card-used">
        Paid with {{ getMaskedCard() }}
      </div>
    </section>

    <!-- Actions -->
    <div class="actions">
      <button class="btn btn--secondary" (click)="printConfirmation()">
        Print Confirmation
      </button>
      <button class="btn btn--primary" (click)="bookAnotherFlight()">
        Book Another Flight
      </button>
    </div>
  } @else {
    <!-- No booking state -->
    <div class="no-booking">
      <h2>No Booking Found</h2>
      <button class="btn btn--primary" routerLink="/">Search Flights</button>
    </div>
  }
</div>
```

### Step 4: Styling with Print Support

```scss
// confirmation.scss
$primary: #605DEC;
$text-dark: #27273F;

.confirmation-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px;
}

.confirmation-header {
  text-align: center;
  margin-bottom: 32px;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: #10B981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  margin: 0 auto 16px;
}

.confirmation-number {
  font-size: 24px;
  font-weight: 700;
  color: $primary;
}

// Print styles
@media print {
  .actions,
  .btn {
    display: none !important;
  }

  .confirmation-page {
    padding: 0;
  }
}

// Responsive
@media (max-width: 768px) {
  .confirmation-page {
    padding: 24px 16px;
  }
}
```

### Step 5: Add Route

```typescript
// app.routes.ts
{
  path: 'confirmation',
  loadComponent: () => import('./pages/confirmation/confirmation')
    .then(m => m.ConfirmationPage)
}
```

## Key Points

1. **No new models** - Uses existing BookingDraft structure
2. **No new services** - Only adds clearBooking() to BookingService
3. **Simple guard** - Constructor check, redirect if no confirmation
4. **Native print** - Uses window.print() with CSS @media print
5. **Data masking** - Card number shows last 4 digits only

## Testing Checklist

- [ ] Confirmation number displayed prominently
- [ ] Flight details accurate (outbound + return if applicable)
- [ ] All passengers listed with seat assignments
- [ ] Price breakdown matches payment page
- [ ] Email notification shown (if email provided)
- [ ] Print button opens browser print dialog
- [ ] "Book Another Flight" clears data and navigates home
- [ ] Direct URL access redirects to home
- [ ] Page refresh preserves data
- [ ] Responsive on mobile
