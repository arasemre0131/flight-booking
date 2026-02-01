# Quickstart: Passenger Information Form

**Feature**: 006-passenger-info | **Date**: 2025-01-31

## Prerequisites

- Node.js 18+
- Angular CLI 17+
- Completed: 004-search-results, 005-search-sidebar

## Getting Started

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Verify dependencies
```bash
npm install
```

### 3. Start development server
```bash
ng serve
```

### 4. Access the page
Navigate to search results, select a flight, then access `/passenger-info` (or via booking flow button).

## Key Files to Create

### Models
```
src/app/models/
├── passenger.model.ts    # Passenger interface
└── booking.model.ts      # BookingDraft, EmergencyContact
```

### Services
```
src/app/services/
└── booking.service.ts    # Booking state management
```

### Components
```
src/app/components/
├── passenger-form/       # Individual passenger form
├── emergency-contact-form/   # Emergency contact section
└── flight-summary/       # Selected flight sidebar
```

### Page
```
src/app/pages/
└── passenger-info/       # Main page component
```

## Angular CLI Commands

### Generate service
```bash
ng generate service services/booking --skip-tests
```

### Generate components
```bash
ng generate component components/passenger-form --standalone --skip-tests
ng generate component components/emergency-contact-form --standalone --skip-tests
ng generate component components/flight-summary --standalone --skip-tests
ng generate component pages/passenger-info --standalone --skip-tests
```

## Key Implementation Patterns

### Reactive Form Setup
```typescript
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  // ...
})
export class PassengerForm {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]]
  });
}
```

### Signal-based Service
```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _booking = signal<BookingDraft | null>(null);

  readonly booking = this._booking.asReadonly();

  setSelectedFlight(flight: Flight) {
    this._booking.update(b => ({ ...b, selectedFlight: flight }));
  }
}
```

### Two-Column Layout
```scss
.page-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```

## Testing the Feature

### Manual Testing Checklist
1. [ ] Navigate to passenger info from flight selection
2. [ ] Verify passenger form count matches search criteria
3. [ ] Submit with empty fields → see validation errors
4. [ ] Submit with invalid email → see error message
5. [ ] Submit with invalid phone → see error message
6. [ ] Fill all required fields → "Save and continue" enabled
7. [ ] Submit valid form → navigate to seat selection
8. [ ] Navigate back → form data preserved
9. [ ] Verify responsive layout at 768px breakpoint

### URL for Testing
```
http://localhost:4200/passenger-info
```

## Design Reference

Figma: SkyRoute Flight Booking - Passenger Information page
- Two-column layout: form (left), flight summary (right)
- Required field indicators with asterisks
- Error messages in red below fields
- "Save and continue" primary button
