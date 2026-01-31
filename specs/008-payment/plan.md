# Implementation Plan: Payment Method

**Feature**: 008-payment | **Date**: 2025-01-31

## Technical Context

| Aspect | Decision |
|--------|----------|
| Framework | Angular 17+ (standalone components) |
| State Management | Signals + BookingService (extend existing) |
| Styling | SCSS with existing design tokens |
| Data Source | Mock data (simulated payment processing) |
| Navigation | Angular Router |
| Validation | Reactive Forms + custom validators |

### Dependencies

- **007-seat-selection**: Provides BookingService with seat assignments, seatFees
- **Existing Components**: flight-summary (reuse for booking summary sidebar)
- **Models**: BookingDraft, Passenger, Flight, SearchCriteria, SeatAssignment

### Integration Points

1. **BookingService** - Extend to track payment details and billing address
2. **flight-summary** - Reuse/extend to show complete price breakdown
3. **Router** - `/payment` route after seat-selection

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Design-First | ✅ | Following Figma payment page design |
| II. Component-Based | ✅ | Standalone components: payment-form, billing-form, booking-summary |
| III. Type Safety | ✅ | New interfaces: PaymentDetails, BillingAddress, PriceSummary |
| IV. Responsive Design | ✅ | Two-column → single column at 768px |
| V. Simplicity (YAGNI) | ✅ | Mock payment, client-side validation only |

**Gate Evaluation**: All principles satisfied. No violations.

## Phase 0: Research Summary

### R1: Credit Card Validation Approach

**Decision**: Client-side Luhn algorithm validation with format detection

**Rationale**:
- Industry-standard algorithm for card number validation
- Card type detection based on BIN prefixes (Visa: 4xxx, MC: 5[1-5]xx, Amex: 34xx/37xx)
- Pure client-side validation per mock data approach
- No PCI compliance concerns with mock data

**Alternatives Considered**:
- Third-party validation library: Overkill for mock implementation
- Server-side validation: Not applicable (mock data approach)

### R2: Form Structure Approach

**Decision**: Angular Reactive Forms with custom validators

**Rationale**:
- Consistent with existing forms in passenger-info
- Fine-grained validation control (Luhn, expiry, CVV length)
- Easy to implement inline error display on blur
- FormGroup enables cross-field validation if needed

**Alternatives Considered**:
- Template-driven forms: Less control over validation timing
- Third-party form library: Adds dependency, overkill for scope

### R3: Card Number Masking

**Decision**: Display masked format (•••• •••• •••• 1234) after blur

**Rationale**:
- Standard security practice for payment forms
- Show full number while editing for correction
- Display last 4 digits for user confirmation
- Maintain actual value in form control for submission

**Alternatives Considered**:
- Always masked: Makes editing difficult
- Never masked: Security concern (even for mock)

### R4: Payment Processing Simulation

**Decision**: 1.5-second delay with configurable success/failure

**Rationale**:
- Realistic UX for testing loading states
- Test failure scenario with card 4000000000000002
- All other valid cards succeed
- Simple Promise/setTimeout implementation

## Phase 1: Design Artifacts

### Generated Artifacts

- [x] `data-model.md` - Entity definitions
- [x] `quickstart.md` - Implementation guide
- [ ] `contracts/` - N/A (frontend-only, no new API)

## Post-Design Constitution Re-check

| Principle | Status |
|-----------|--------|
| I. Design-First | ✅ |
| II. Component-Based | ✅ |
| III. Type Safety | ✅ |
| IV. Responsive Design | ✅ |
| V. Simplicity (YAGNI) | ✅ |

**All gates pass. Ready for task generation.**
