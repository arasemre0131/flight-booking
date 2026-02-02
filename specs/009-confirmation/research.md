# Research: Booking Confirmation

**Feature**: 009-confirmation | **Date**: 2025-01-31

## Research Questions

### R1: Print Functionality Approach

**Question**: How to implement print confirmation for web?

**Decision**: Browser native `window.print()` with CSS `@media print`

**Rationale**:
- Zero dependencies - built into every browser
- CSS print media allows hiding buttons/navigation
- User controls printer selection and settings
- Works on all platforms (desktop, mobile)

**Alternatives Considered**:
| Alternative | Pros | Cons | Decision |
|------------|------|------|----------|
| jsPDF library | Full PDF control | 100KB+ bundle, complex setup | Rejected - overkill |
| html2canvas + PDF | Screenshot-based | Quality loss, slow | Rejected |
| Server-side PDF | Professional output | Requires backend | Rejected - mock approach |
| Print-specific page | Clean output | Duplicate code | Rejected |

**Implementation**:
```typescript
printConfirmation(): void {
  window.print();
}
```

```scss
@media print {
  .actions, .btn, header, footer {
    display: none !important;
  }
}
```

---

### R2: Data Persistence Strategy

**Question**: How to persist confirmation data for page refresh?

**Decision**: Use existing BookingService session storage mechanism

**Rationale**:
- BookingService already stores booking data in sessionStorage
- confirmationNumber is part of BookingDraft (added in 008-payment)
- No additional implementation needed
- Data automatically cleared when tab closes

**Implementation**: Already in place from 008-payment:
```typescript
// BookingService already has:
private saveToStorage(): void {
  // Saves entire bookingDraft except paymentDetails
  sessionStorage.setItem('bookingDraft', JSON.stringify(/* ... */));
}

// confirmationNumber is persisted:
setConfirmationNumber(confirmationNumber: string): void {
  this.updateDraft({ confirmationNumber });
}
```

---

### R3: Route Guard Approach

**Question**: How to prevent direct access to /confirmation without valid booking?

**Decision**: Component-level check in constructor with immediate redirect

**Rationale**:
- Consistent with existing pattern in PaymentPage
- Simple, no additional guard class needed
- Immediate redirect prevents flash of content
- Easy to test and debug

**Alternatives Considered**:
| Alternative | Pros | Cons | Decision |
|------------|------|------|----------|
| CanActivate guard | Angular standard | More boilerplate | Rejected - overkill |
| Resolver | Pre-fetch data | Complex for simple check | Rejected |
| Template @if | Less code | Shows empty state briefly | Rejected |

**Implementation**:
```typescript
constructor() {
  if (!this.bookingService.confirmationNumber()) {
    this.router.navigate(['/']);
  }
}
```

---

### R4: Clear Booking Flow

**Question**: How to start fresh booking from confirmation page?

**Decision**: Add `clearBooking()` method to BookingService

**Rationale**:
- Single responsibility - service manages its own cleanup
- Clears both signal state and session storage
- Ensures completely fresh state for new booking
- Called before navigation to home

**Implementation**:
```typescript
// Add to BookingService
clearBooking(): void {
  this._bookingDraft.set(null);
  sessionStorage.removeItem('bookingDraft');
}

// In ConfirmationPage
bookAnotherFlight(): void {
  this.bookingService.clearBooking();
  this.router.navigate(['/']);
}
```

---

## Summary

| Research Item | Decision | Dependencies |
|--------------|----------|--------------|
| Print | window.print() + CSS @media | None |
| Data Persistence | Existing sessionStorage | BookingService |
| Route Guard | Constructor check | Router |
| Clear Booking | New clearBooking() method | BookingService |

**All research complete. No NEEDS CLARIFICATION items remaining.**
