# Research: 012-admin-panel

**Date**: 2025-01-31
**Feature**: Admin Panel

## Research Summary

This document consolidates research findings for implementing the admin panel feature.

---

## 1. Existing Patterns Analysis

### Decision: Follow 011-airline-dashboard Architecture
**Rationale**: The airline dashboard already implements a role-based dashboard with sidebar navigation, data tables, statistics charts, and form modals. Reusing these patterns ensures consistency and reduces development time.

**Alternatives Considered**:
- New architecture from scratch: Rejected (violates YAGNI, inconsistent UX)
- Third-party admin template: Rejected (adds dependency, may not match Figma)

### Key Patterns to Reuse:
1. **Sidebar Navigation** - `components/airline/sidebar/` pattern
2. **Data Tables** - Table layouts from pricing-list, flights-list
3. **Statistics Charts** - ng2-charts integration from statistics page
4. **Modal Forms** - Form patterns from route-form, aircraft-form
5. **Signal-based State** - Service pattern from airline.service.ts

---

## 2. User Management Implementation

### Decision: Extend Existing User Model
**Rationale**: The `auth.model.ts` already defines `User` with role field. Admin panel needs additional fields for display (status, actions) but core model is sufficient.

**Implementation Approach**:
- Use existing `User` interface from `models/auth.model.ts`
- Add `status: 'active' | 'inactive'` field to User model
- Session termination on deactivation via clearing localStorage/sessionStorage

**Alternatives Considered**:
- Separate AdminUser model: Rejected (duplication, sync issues)
- Permissions system: Rejected (out of scope, single admin role for MVP)

---

## 3. Pagination Strategy

### Decision: Client-side Pagination with Mock Data
**Rationale**: Since we're using mock data stored in localStorage, true server-side pagination isn't applicable. However, we'll implement the pagination UI and logic that would work with a real backend.

**Implementation Approach**:
- Page size: 25 items (per clarification)
- Pagination component with page numbers and prev/next
- Filter and search applied before pagination
- Sorting applied before pagination

**Alternatives Considered**:
- Infinite scroll: Rejected (less control for admin workflows)
- Load all at once: Rejected (doesn't scale, poor UX with 100+ items)

---

## 4. Airline Suspension Behavior

### Decision: Soft Status Flag
**Rationale**: Airline suspension should be reversible and not delete data. Use status field to control visibility.

**Implementation Approach**:
- Add `status: 'active' | 'suspended'` to airline data model
- Suspended airlines remain in admin lists with visual indicator (badge)
- Suspended airlines hidden from public flight search (handled in flight service)
- Existing bookings preserved and visible

**Alternatives Considered**:
- Hard delete: Rejected (data loss, booking orphans)
- Archive table: Rejected (over-engineering for MVP)

---

## 5. Statistics Aggregation

### Decision: Real-time Aggregation from Mock Data
**Rationale**: Statistics should reflect current mock data state. Compute aggregations on demand.

**Implementation Approach**:
- Aggregate users from localStorage user list
- Aggregate bookings from mock booking data
- Calculate revenue from booking amounts
- Generate growth data based on createdAt timestamps

**Alternatives Considered**:
- Pre-computed statistics: Rejected (stale data, sync issues)
- Background worker: Rejected (over-engineering for mock data)

---

## 6. Route Guard Implementation

### Decision: Functional Guard with AuthService
**Rationale**: Angular 17+ prefers functional guards. Check role from AuthService.

**Implementation Approach**:
```typescript
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (user?.role === 'admin') {
    return true;
  }
  return router.createUrlTree(['/']);
};
```

**Alternatives Considered**:
- Class-based guard: Rejected (deprecated pattern in Angular 17+)
- Directive-based: Rejected (doesn't protect routes)

---

## 7. CSV Export Implementation

### Decision: Client-side CSV Generation
**Rationale**: Simple, no server dependency, works with mock data.

**Implementation Approach**:
- Generate CSV string from statistics data
- Create Blob and trigger download
- Include date range in filename

**Alternatives Considered**:
- Server-generated: Rejected (no backend for MVP)
- Excel format: Rejected (adds library dependency)

---

## 8. Confirmation Dialogs

### Decision: Reusable Modal Component
**Rationale**: Multiple actions require confirmation (role change, deactivate, suspend). Create single reusable component.

**Implementation Approach**:
- `ConfirmationModal` component with configurable title, message, actions
- Signal-based visibility control
- Support for warning/danger styling

**Alternatives Considered**:
- Browser confirm(): Rejected (poor UX, not customizable)
- Inline confirmation: Rejected (clutters UI)

---

## Dependencies Verified

| Dependency | Status | Notes |
|------------|--------|-------|
| 010-auth | ✅ Verified | User model, AuthService, role field exist |
| 011-airline-dashboard | ✅ Verified | AirlineService, patterns available |
| ng2-charts | ✅ Verified | Already integrated in airline statistics |

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Performance with large datasets | Pagination + efficient filtering |
| Session termination complexity | Clear both storage types on deactivate |
| Data consistency | Single source of truth (localStorage) |
| Chart library conflicts | Reuse existing ng2-charts setup |
