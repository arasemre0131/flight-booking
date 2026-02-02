# Research: 011-airline-dashboard

**Date**: 2025-01-31
**Feature**: Airline Dashboard

---

## R1: Angular Dashboard Layout Patterns

**Decision**: Use Angular Material sidebar with responsive layout

**Rationale**:
- Project already uses Angular 17+ with standalone components
- Material Design provides consistent UI with existing pages
- Sidebar navigation is standard for admin dashboards
- Responsive breakpoints handle tablet views

**Alternatives Considered**:
- PrimeNG: Heavier library, not used elsewhere in project
- Custom CSS Grid: More work, less polished
- TailwindCSS dashboard: Would require new dependency

---

## R2: Chart Library for Statistics

**Decision**: Use Chart.js with ng2-charts wrapper

**Rationale**:
- Lightweight (60kb gzipped)
- Easy Angular integration via ng2-charts
- Supports bar, line, and pie charts needed
- Good documentation and community support
- MIT license

**Alternatives Considered**:
- D3.js: Too complex for simple charts, steep learning curve
- ApexCharts: Larger bundle size
- ECharts: Overkill for our needs
- Highcharts: Commercial license issues

---

## R3: Date/Time Handling

**Decision**: Use native JavaScript Date with date-fns for formatting

**Rationale**:
- Project already uses native Date objects
- date-fns is tree-shakeable (smaller bundle)
- Good timezone support with date-fns-tz if needed
- Consistent with existing codebase patterns

**Alternatives Considered**:
- Moment.js: Deprecated, large bundle
- Luxon: Additional dependency
- Day.js: Good option but date-fns already common in Angular

---

## R4: Form Validation Approach

**Decision**: Angular Reactive Forms with custom validators

**Rationale**:
- Already used throughout the project (login, register, passenger forms)
- Type-safe with TypeScript
- Easy to create custom validators (e.g., business price > economy)
- Good error message display patterns already established

**Alternatives Considered**:
- Template-driven forms: Less testable, harder for complex validation
- Third-party validation libraries: Unnecessary overhead

---

## R5: Mock Data Strategy

**Decision**: Create airline-specific mock data service with in-memory state

**Rationale**:
- Matches existing pattern (MOCK_FLIGHTS, MOCK_AIRPORTS)
- Allows full CRUD simulation before backend
- Easy to swap for real API later via service abstraction
- Signal-based state for reactivity

**Alternatives Considered**:
- json-server: External dependency, extra setup
- localStorage persistence: Adds complexity, not needed for demo
- No mock data: Would block frontend development

---

## R6: Calendar View Implementation

**Decision**: Simple custom calendar grid (no external library)

**Rationale**:
- Only need monthly view with flight indicators
- External calendar libraries are heavy
- Can build simple grid with CSS Grid
- Click to filter flights by date is straightforward

**Alternatives Considered**:
- FullCalendar: Very heavy (100kb+), overkill
- Angular Calendar: Good but adds dependency
- PrimeNG Calendar: Would require full PrimeNG

---

## R7: Export to CSV Implementation

**Decision**: Client-side CSV generation with Blob download

**Rationale**:
- No backend needed for simple exports
- Statistics data already in memory
- Standard browser download API
- Simple implementation (~20 lines)

**Alternatives Considered**:
- Server-side generation: Requires backend, more complex
- Excel export: Would need xlsx library
- PDF export: More complex, not requested

---

## R8: State Management

**Decision**: Signal-based services (Angular 17+ pattern)

**Rationale**:
- Already used in auth.service.ts and booking.service.ts
- Simpler than NgRx for this scope
- Built into Angular, no dependencies
- Good for component-level reactivity

**Alternatives Considered**:
- NgRx: Overkill for this feature, steep learning curve
- BehaviorSubject: Works but signals are more ergonomic
- Component state only: Would complicate cross-component updates

---

## Summary

| Area | Decision | Key Reason |
|------|----------|------------|
| Layout | Angular Material sidebar | Consistent with project |
| Charts | Chart.js + ng2-charts | Lightweight, easy integration |
| Dates | date-fns | Tree-shakeable, good API |
| Forms | Reactive Forms | Already used in project |
| Mock Data | In-memory signal service | Matches existing patterns |
| Calendar | Custom CSS Grid | Avoid heavy dependencies |
| CSV Export | Client-side Blob | Simple, no backend needed |
| State | Angular Signals | Modern Angular pattern |
