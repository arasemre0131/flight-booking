# Implementation Plan: Passenger Information Form

**Branch**: `006-passenger-info` | **Date**: 2025-01-31
**Spec**: [spec.md](./spec.md) | **Tasks**: [tasks.md](./tasks.md)

## Summary

Implement a passenger information form that collects traveler details (name, DOB, contact info) during the flight booking flow. The page features a two-column layout with the form on the left and a flight summary sidebar on the right. Form validates required fields and navigates to seat selection on successful submission.

## Technical Context

### Stack
- **Frontend**: TypeScript 5.x with Angular 17+ (standalone components), RxJS, Angular Router
- **Styling**: SCSS with component-scoped styles
- **Data**: Mock data (no backend integration), form state management via signals
- **Forms**: Angular Reactive Forms for validation

### Relevant Existing Code
- `frontend/src/app/pages/search-results/` - Pattern for two-column layout
- `frontend/src/app/models/` - TypeScript interfaces
- `frontend/src/app/mock-data/` - Mock data files
- `frontend/src/app/components/sidebar-content/` - Reusable sidebar pattern

### Dependencies
- 004-search-results and 005-search-sidebar must be complete (provides flight selection and sidebar patterns)
- Selected flight data passed via router state or service

### Technical Decisions
- Use Angular Reactive Forms for validation (standard Angular pattern)
- Store form data in a booking service for persistence across navigation
- Reuse flight summary display from sidebar patterns

## Constitution Check

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Design-First | ✅ Pass | Follows Figma design with form + sidebar layout |
| II. Component-Based | ✅ Pass | Separate passenger-form, flight-summary, emergency-contact components |
| III. Type Safety | ✅ Pass | Define Passenger, EmergencyContact, BookingDraft interfaces |
| IV. Responsive Design | ✅ Pass | Two-column desktop, stacked mobile at 768px |
| V. Simplicity (YAGNI) | ✅ Pass | Basic form validation, mock data flow, no real API |

**Gate Evaluation**: All principles satisfied. Proceeding with implementation.

## Project Structure

### Documentation (this feature)

```text
specs/006-passenger-info/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - frontend only)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code

```text
frontend/src/app/
├── pages/
│   └── passenger-info/
│       ├── passenger-info.ts
│       ├── passenger-info.html
│       └── passenger-info.scss
├── components/
│   ├── passenger-form/
│   │   ├── passenger-form.ts
│   │   ├── passenger-form.html
│   │   └── passenger-form.scss
│   ├── emergency-contact-form/
│   │   ├── emergency-contact-form.ts
│   │   ├── emergency-contact-form.html
│   │   └── emergency-contact-form.scss
│   └── flight-summary/
│       ├── flight-summary.ts
│       ├── flight-summary.html
│       └── flight-summary.scss
├── models/
│   ├── passenger.model.ts
│   └── booking.model.ts
└── services/
    └── booking.service.ts
```

**Structure Decision**: Web application (frontend-only). Follows existing pattern from search-results page with components split by responsibility.

## Implementation Approach

### Phase 1: Data Models & Services
1. Create `Passenger` interface with name fields, DOB, email, phone
2. Create `EmergencyContact` interface
3. Create `BookingDraft` interface combining passengers, selected flight, total price
4. Create `BookingService` for state management across booking flow

### Phase 2: Form Components
1. Create `passenger-form` component with reactive form
   - Input for passenger index (adult 1, adult 2, child 1, etc.)
   - Required field validation
   - Email/phone format validation
2. Create `emergency-contact-form` component (optional section)
3. Create `flight-summary` component showing selected flight details

### Phase 3: Page Integration
1. Create `passenger-info` page with two-column layout
2. Generate passenger forms based on search criteria (adults + children count)
3. Implement form submission and navigation to seat selection
4. Add responsive styles (stack on mobile)

### Phase 4: Validation & Polish
1. Add field-level error messages
2. Implement data persistence in BookingService
3. Handle edge cases (child passenger without email, back navigation)

### File Changes

| File | Action | Description |
|------|--------|-------------|
| `models/passenger.model.ts` | Create | Passenger interface |
| `models/booking.model.ts` | Create | BookingDraft, EmergencyContact interfaces |
| `services/booking.service.ts` | Create | State management for booking flow |
| `components/passenger-form/` | Create | Passenger form component (3 files) |
| `components/emergency-contact-form/` | Create | Emergency contact component (3 files) |
| `components/flight-summary/` | Create | Flight summary sidebar (3 files) |
| `pages/passenger-info/` | Create | Page component (3 files) |
| `app.routes.ts` | Modify | Add route for /passenger-info |

### Estimated Scope
- **New files**: 14 (models, service, 3 components × 3 files, page × 3 files)
- **Modified files**: 1 (app.routes.ts)
- **Lines**: ~400-450

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Form validation complexity | Use Angular built-in validators, keep custom validators simple |
| State persistence on navigation | BookingService with signals maintains state |
| Child passenger handling | Conditional form fields based on passenger type |
| Responsive layout | Follow existing search-results two-column pattern |

## Artifacts to Generate

- [x] plan.md (this file)
- [x] research.md
- [x] data-model.md
- [x] quickstart.md
