# Data Model: Passenger Information Form

**Feature**: 006-passenger-info | **Date**: 2025-01-31

## Entities

### Passenger

Represents a single traveler in the booking.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| id | string | Yes | UUID format | Generated on form creation |
| firstName | string | Yes | Min 1 char, letters/hyphens/spaces | |
| middleName | string | No | Letters/hyphens/spaces if provided | Optional per FR-002 |
| lastName | string | Yes | Min 1 char, letters/hyphens/spaces | |
| suffix | string | No | Jr, Sr, III, etc. | Optional per FR-002 |
| dateOfBirth | Date | Yes | Not future, not > 120 years ago | FR-009 |
| email | string | Conditional | Valid email format | Required for primary adult only (FR-003, FR-007) |
| phone | string | Conditional | International format | Required for primary adult only (FR-003, FR-008) |
| type | 'adult' \| 'child' | Yes | Enum | Derived from DOB or search criteria |
| isPrimary | boolean | Yes | true/false | First adult passenger |

**TypeScript Interface**:
```typescript
export interface Passenger {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  dateOfBirth: Date;
  email?: string;
  phone?: string;
  type: 'adult' | 'child';
  isPrimary: boolean;
}
```

### EmergencyContact

Emergency contact information for the booking (optional section per FR-012).

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| name | string | Yes* | Min 1 char if section is used | |
| phone | string | Yes* | International format | |

*Required only if emergency contact section is filled

**TypeScript Interface**:
```typescript
export interface EmergencyContact {
  name: string;
  phone: string;
}
```

### BookingDraft

Aggregate entity tracking the booking flow state.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | Yes | UUID for draft identification |
| selectedFlight | Flight | Yes | From 004-search-results selection |
| returnFlight | Flight | No | For round-trip bookings |
| passengers | Passenger[] | Yes | Array matching search criteria count |
| emergencyContact | EmergencyContact | No | Optional section |
| totalPrice | number | Yes | Calculated from flight(s) × passengers |
| searchCriteria | SearchCriteria | Yes | Original search parameters |

**TypeScript Interface**:
```typescript
export interface BookingDraft {
  id: string;
  selectedFlight: Flight;
  returnFlight?: Flight;
  passengers: Passenger[];
  emergencyContact?: EmergencyContact;
  totalPrice: number;
  searchCriteria: SearchCriteria;
}
```

## Relationships

```
SearchCriteria (from search)
    │
    └──► BookingDraft
            │
            ├──► Flight (selectedFlight, 1:1)
            ├──► Flight (returnFlight, 0..1)
            ├──► Passenger[] (1:N, count from searchCriteria.adults + searchCriteria.children)
            └──► EmergencyContact (0..1)
```

## Validation Rules

### Passenger Form Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| firstName | Required, min 1 char | "First name is required" |
| lastName | Required, min 1 char | "Last name is required" |
| dateOfBirth | Required, valid date, not future | "Date of birth is required" / "Date cannot be in the future" |
| email | Required for primary, valid format | "Email is required" / "Please enter a valid email address" |
| phone | Required for primary, valid format | "Phone number is required" / "Please enter a valid phone number" |

### Email Validation Pattern
```typescript
Validators.email // Angular built-in
// or pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### Phone Validation Pattern
```typescript
Validators.pattern(/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}[-\s\.]?[0-9]{0,6}$/)
```

## State Transitions

### Booking Flow State

```
[Search Results] ──select flight──► [Passenger Info] ──submit──► [Seat Selection]
                                           │
                                           ▼
                                    BookingDraft created
                                    passengers[] populated
                                    form validated
```

### Form State

```
Empty ──► Partial (some fields filled) ──► Complete (all required valid) ──► Submitted
  │              │                                    │
  │              │◄────────────back navigation────────│
  │              │         (data preserved)
  └──────────────┴────────────page refresh────────────►
                           (restore from service)
```

## Sample Data

### Passenger (Adult Primary)
```typescript
{
  id: 'pax-001',
  firstName: 'John',
  middleName: 'Robert',
  lastName: 'Doe',
  suffix: 'Jr',
  dateOfBirth: new Date('1985-03-15'),
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567',
  type: 'adult',
  isPrimary: true
}
```

### Passenger (Child)
```typescript
{
  id: 'pax-002',
  firstName: 'Emma',
  lastName: 'Doe',
  dateOfBirth: new Date('2018-07-22'),
  type: 'child',
  isPrimary: false
}
```

### BookingDraft
```typescript
{
  id: 'draft-001',
  selectedFlight: { /* Flight object */ },
  passengers: [ /* Passenger array */ ],
  emergencyContact: {
    name: 'Jane Doe',
    phone: '+1-555-987-6543'
  },
  totalPrice: 624,
  searchCriteria: { /* SearchCriteria object */ }
}
```
