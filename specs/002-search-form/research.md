# Research: Flight Search Form

**Branch**: `002-search-form` | **Date**: 2025-01-30

## Research Tasks & Findings

### 1. Angular 17+ Form Patterns

**Decision**: Use Reactive Forms with standalone components

**Rationale**:
- Angular 17+ supports standalone components which simplify module management
- Reactive forms provide better control over validation and form state
- Easier to test than template-driven forms

**Alternatives Considered**:
- Template-driven forms: Rejected due to less control over validation timing
- NgModel two-way binding: Rejected for complex forms with multiple validations

### 2. Date Picker Implementation

**Decision**: Use native HTML5 date input with custom styling

**Rationale**:
- No external dependency required
- Works well on mobile devices with native date pickers
- Can be progressively enhanced with custom component later

**Alternatives Considered**:
- Angular Material Datepicker: Adds significant bundle size
- ng-bootstrap Datepicker: Additional dependency
- Custom calendar component: Over-engineering for MVP

### 3. Autocomplete Pattern for Airport Search

**Decision**: Custom autocomplete using Angular signals and debounced input

**Rationale**:
- Angular 17+ signals provide reactive state management
- Debounce prevents excessive API calls (300ms delay)
- Minimum 2 characters before triggering (per spec clarification)

**Alternatives Considered**:
- Angular Material Autocomplete: Heavy dependency
- Third-party autocomplete libraries: Unnecessary for this use case

### 4. Airport Data Source

**Decision**: Static JSON file for MVP, backend API for production

**Rationale**:
- University project scope - static data sufficient for demonstration
- JSON file in assets folder for easy testing
- Service interface allows easy switch to API later

**Alternatives Considered**:
- Direct API integration: Backend not yet available
- External flight API (Amadeus, Skyscanner): Requires API keys, adds complexity

### 5. Form Validation Strategy

**Decision**: Angular Validators with custom validators for business rules

**Rationale**:
- Built-in validators for required fields
- Custom validators for: origin != destination, return date >= departure date
- Immediate feedback on field blur

**Alternatives Considered**:
- Form-level validation only: Poor UX, user must submit to see errors
- Real-time validation: Too aggressive, interrupts user flow

### 6. Mobile Responsiveness Approach

**Decision**: CSS Flexbox/Grid with mobile-first breakpoints

**Rationale**:
- Form fields stack vertically on mobile (<768px)
- Horizontal layout on desktop
- Touch-friendly tap targets (min 44px)

**Alternatives Considered**:
- Separate mobile component: Code duplication
- CSS-only responsive: Chosen approach

### 7. State Management for Search Criteria

**Decision**: Pass search criteria via Angular Router query params

**Rationale**:
- Allows deep-linking to search results
- No additional state management library needed
- URL can be bookmarked/shared

**Alternatives Considered**:
- NgRx/Akita: Over-engineering for this use case
- Service with BehaviorSubject: Loses state on refresh
- SessionStorage: Not as clean as URL params

## Resolved NEEDS CLARIFICATION

All technical decisions resolved. No outstanding unknowns.
