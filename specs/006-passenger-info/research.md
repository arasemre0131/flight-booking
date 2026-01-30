# Research: Passenger Information Form

**Feature**: 006-passenger-info | **Date**: 2025-01-31

## Research Tasks

### 1. Angular Reactive Forms Best Practices

**Decision**: Use Angular Reactive Forms with FormBuilder and Validators

**Rationale**:
- Built-in validation support (required, email, pattern)
- Programmatic control over form state
- Easy testing with form value access
- Standard Angular pattern already in project

**Alternatives Considered**:
- Template-driven forms: Less control, harder to test
- Third-party form libraries: Unnecessary complexity for this scope

### 2. Phone Number Validation Pattern

**Decision**: Accept common international formats with regex pattern

**Rationale**:
- Spec requires international phone number support (FR-008)
- Simple regex covers +1-XXX-XXX-XXXX and similar formats
- No need for country-specific validation in mock flow

**Pattern**: `^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}[-\s\.]?[0-9]{0,6}$`

**Alternatives Considered**:
- Google libphonenumber: Overkill for MVP, adds bundle size
- Strict E.164 only: Too restrictive for user experience

### 3. Date of Birth Input Pattern

**Decision**: Use native HTML5 date input with min/max constraints

**Rationale**:
- Spec specifies date picker or MM/DD/YYYY format (FR-009)
- Native date input works on all modern browsers
- Can set max date (today) and reasonable min date (120 years ago)
- Angular forms integrate cleanly with native inputs

**Alternatives Considered**:
- Angular Material datepicker: Adds dependency not in project
- Custom date component: Unnecessary complexity

### 4. Form State Persistence Pattern

**Decision**: BookingService with signals stores form data

**Rationale**:
- Edge case requires data retention on back navigation
- Angular signals align with existing codebase patterns
- Service is injectable across components
- Session storage backup for page refresh (optional enhancement)

**Implementation**:
```typescript
@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookingDraft = signal<BookingDraft | null>(null);

  readonly booking = this.bookingDraft.asReadonly();

  updatePassengers(passengers: Passenger[]) {
    this.bookingDraft.update(draft => ({
      ...draft,
      passengers
    }));
  }
}
```

### 5. Child Passenger Handling

**Decision**: Conditional form fields based on passenger type

**Rationale**:
- Spec states children don't require email (edge case)
- Parent/guardian contact info from primary passenger
- Pass passenger type as input to passenger-form component

**Implementation**:
- `passengerType: 'adult' | 'child'` input signal
- Email/phone fields only shown for primary adult
- Date of birth used for age display, not validation

### 6. Form Layout and Responsive Design

**Decision**: Follow existing search-results two-column grid pattern

**Rationale**:
- FR-013/FR-014 specify two-column desktop, single-column mobile
- Existing search-results.scss has proven grid implementation
- 768px breakpoint matches existing responsive design

**CSS Pattern**:
```scss
.passenger-page-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```

## Resolved Clarifications

No NEEDS CLARIFICATION items were present in the spec. All technical decisions made based on:
- Existing codebase patterns
- Angular best practices
- Spec requirements

## Technology Additions

No new technologies required. Using existing:
- Angular 17+ Reactive Forms (already available)
- Angular signals (already in use)
- SCSS (already in use)
