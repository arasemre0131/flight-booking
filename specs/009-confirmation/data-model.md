# Data Model: Booking Confirmation

**Feature**: 009-confirmation | **Date**: 2025-01-31

## Overview

The confirmation page displays data from existing models. No new entities are required.
This document references existing models and describes how they're used on the confirmation page.

## Existing Models (from 008-payment and earlier)

### BookingDraft (extended in 008-payment)

```typescript
interface BookingDraft {
  searchCriteria: SearchCriteria;       // Trip details
  outboundFlight: Flight | null;        // Selected outbound flight
  returnFlight: Flight | null;          // Selected return flight (if round trip)
  passengers: Passenger[];              // Passenger information
  seatAssignments: SeatAssignment[];    // Seat selections per passenger/flight
  paymentDetails?: PaymentDetails;      // Card info (masked for display)
  billingAddress?: BillingAddress;      // Billing info
  confirmationNumber?: string;          // Generated after payment (e.g., "TRP-2025-ABC123")
}
```

### Flight

```typescript
interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;        // Airport code (e.g., "JFK")
  destination: string;   // Airport code (e.g., "LAX")
  departureTime: string; // ISO date-time
  arrivalTime: string;   // ISO date-time
  duration: string;      // e.g., "5h 30m"
  price: number;
  class: 'economy' | 'business' | 'first';
}
```

### Passenger

```typescript
interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}
```

### SeatAssignment

```typescript
interface SeatAssignment {
  passengerId: string;
  flightId: string;
  seatNumber: string;    // e.g., "12A"
  seatType: 'standard' | 'extra-legroom' | 'exit-row';
  price: number;         // Seat upgrade fee
}
```

### PriceSummary

```typescript
interface PriceSummary {
  baseFare: number;      // Flight price × passenger count
  seatFees: number;      // Total seat upgrade fees
  taxesAndFees: number;  // 10% of base fare (mock)
  total: number;         // Grand total
}
```

### PaymentDetails (for masked display)

```typescript
interface PaymentDetails {
  cardNumber: string;    // Full number stored, display masked
  cardType: 'visa' | 'mastercard' | 'amex';
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}
```

## Confirmation Page Data Usage

### Confirmation Header
- `confirmationNumber` - Prominently displayed
- Booking date/time - Current timestamp at display

### Flight Details Section
- `outboundFlight` - Origin, destination, date, time, airline, flight number
- `returnFlight` - Same fields (if round trip)

### Passenger & Seat Section
- `passengers[]` - Full name display
- `seatAssignments[]` - Seat number per flight per passenger

### Payment Summary Section
- `paymentDetails.cardType` - Card brand icon
- `paymentDetails.cardNumber` - Last 4 digits only (masked)
- `priceSummary` - Itemized breakdown

### Email Notification
- `passengers[0].email` - First passenger email (mock notification)

## Utility Functions

### maskCardNumber (existing in card-validation.ts)
```typescript
function maskCardNumber(cardNumber: string): string {
  const last4 = cardNumber.slice(-4);
  return `•••• •••• •••• ${last4}`;
}
```

### getPassengerSeatForFlight (new helper)
```typescript
function getPassengerSeatForFlight(
  passengerId: string,
  flightId: string,
  assignments: SeatAssignment[]
): string | null {
  const assignment = assignments.find(
    a => a.passengerId === passengerId && a.flightId === flightId
  );
  return assignment?.seatNumber ?? null;
}
```

## Notes

- No new interfaces required for confirmation page
- All data comes from existing BookingDraft structure
- PaymentDetails displayed with masking for security
- Email notification uses first passenger's email if provided
