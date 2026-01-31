# Tasks: 012-admin-panel

**Feature**: Admin Panel
**Branch**: `012-admin-panel`
**Generated**: 2025-01-31

---

## Overview

| Metric | Value |
|--------|-------|
| Total Tasks | 42 |
| User Stories | 4 |
| Phases | 7 |

### Task Distribution by User Story

| Story | Description | Tasks |
|-------|-------------|-------|
| Setup | Project initialization | 6 |
| Foundational | Blocking prerequisites | 6 |
| US1 | User Management | 9 |
| US2 | Airline Management | 6 |
| US3 | Booking Overview | 6 |
| US4 | Platform Statistics | 6 |
| Polish | Cross-cutting concerns | 3 |

---

## Phase 1: Setup

**Goal**: Initialize project structure and foundational files

- [x] T001 Create admin model types in `frontend/src/app/models/admin.model.ts`
- [x] T002 [P] Create admin guard in `frontend/src/app/guards/admin.guard.ts`
- [x] T003 [P] Create mock data for admin panel in `frontend/src/app/mock-data/admin.data.ts`
- [x] T004 Extend User model with status field in `frontend/src/app/models/auth.model.ts`
- [x] T005 Update mock users with status field in `frontend/src/app/mock-data/users.data.ts`
- [x] T006 Create admin routes configuration in `frontend/src/app/pages/admin/admin.routes.ts`

---

## Phase 2: Foundational

**Goal**: Create shared components and services used across all user stories

- [x] T007 Create AdminService with signal-based state in `frontend/src/app/services/admin.service.ts`
- [x] T008 [P] Create admin sidebar component in `frontend/src/app/components/admin/admin-sidebar/`
- [x] T009 [P] Create admin header component in `frontend/src/app/components/admin/admin-header/`
- [x] T010 [P] Create reusable data table component in `frontend/src/app/components/admin/data-table/`
- [x] T011 [P] Create confirmation modal component in `frontend/src/app/components/admin/confirmation-modal/`
- [x] T012 Create admin container component in `frontend/src/app/pages/admin/admin.ts`

---

## Phase 3: User Story 1 - User Management

**Story Goal**: Admin can view, filter, search, edit, and manage all users on the platform

**Independent Test Criteria**:
- Admin can view paginated list of users (25 per page)
- Admin can filter users by role
- Admin can search users by name/email
- Admin can edit user details
- Admin can change user role with confirmation
- Admin can deactivate/reactivate users
- Admin can create new admin/airline users

### Tasks

- [x] T013 [US1] Create users list page component in `frontend/src/app/pages/admin/users/users-list/users-list.ts`
- [x] T014 [P] [US1] Create users list template with table and filters in `frontend/src/app/pages/admin/users/users-list/users-list.html`
- [x] T015 [P] [US1] Create users list styles in `frontend/src/app/pages/admin/users/users-list/users-list.scss`
- [x] T016 [US1] Implement user filtering and search in AdminService `getUsers()` method
- [x] T017 [US1] Create edit user modal component in `frontend/src/app/pages/admin/users/user-form/user-form.ts`
- [x] T018 [US1] Implement role change with confirmation dialog in users-list component
- [x] T019 [US1] Implement deactivate/reactivate toggle with session termination in AdminService
- [x] T020 [US1] Create new user form for admin/airline creation in `frontend/src/app/pages/admin/users/user-form/`
- [x] T021 [US1] Add pagination controls to users list with 25 items per page

---

## Phase 4: User Story 2 - Airline Management

**Story Goal**: Admin can view and manage all airlines, suspend operations, and assign operators

**Independent Test Criteria**:
- Admin can view paginated list of airlines with stats
- Suspended airlines show visual indicator (badge)
- Admin can view airline detail with associated users
- Admin can suspend/resume airline with confirmation
- Admin can assign users to airline operator role

### Tasks

- [x] T022 [US2] Create airlines list page component in `frontend/src/app/pages/admin/airlines/airlines-list/airlines-list.ts`
- [x] T023 [P] [US2] Create airlines list template and styles in `frontend/src/app/pages/admin/airlines/airlines-list/`
- [x] T024 [US2] Implement airline data aggregation in AdminService `getAirlines()` method
- [x] T025 [US2] Create airline detail page in `frontend/src/app/pages/admin/airlines/airline-detail/airline-detail.ts`
- [x] T026 [US2] Implement suspend/resume airline with confirmation in AdminService
- [x] T027 [US2] Implement assign user to airline dropdown in airline-detail component

---

## Phase 5: User Story 3 - Booking Overview

**Story Goal**: Admin can view, filter, and search all bookings across the platform

**Independent Test Criteria**:
- Admin can view paginated list of bookings
- Admin can filter by date range (today, week, month, custom)
- Admin can filter by airline and status
- Admin can search by confirmation code or email
- Admin can view booking detail modal with passenger/seat info

### Tasks

- [x] T028 [US3] Create bookings list page component in `frontend/src/app/pages/admin/bookings/bookings-list/bookings-list.ts`
- [x] T029 [P] [US3] Create bookings list template with filters in `frontend/src/app/pages/admin/bookings/bookings-list/bookings-list.html`
- [x] T030 [P] [US3] Create bookings list styles in `frontend/src/app/pages/admin/bookings/bookings-list/bookings-list.scss`
- [x] T031 [US3] Implement booking filtering (date range, airline, status) in AdminService
- [x] T032 [US3] Create booking detail modal in `frontend/src/app/pages/admin/bookings/booking-detail/booking-detail.ts`
- [x] T033 [US3] Implement booking search by confirmation code or email

---

## Phase 6: User Story 4 - Platform Statistics

**Story Goal**: Admin can view platform-wide statistics with charts and export to CSV

**Independent Test Criteria**:
- Admin can view dashboard with key metrics (users, airlines, bookings, revenue)
- Admin can view user growth chart (line chart by role)
- Admin can view booking volume chart (bar chart)
- Admin can view revenue chart (line chart)
- Admin can view top airlines table
- Admin can filter all stats by date range
- Admin can export statistics to CSV

### Tasks

- [x] T034 [US4] Create statistics page component in `frontend/src/app/pages/admin/statistics/statistics.ts`
- [x] T035 [P] [US4] Create stats card component in `frontend/src/app/components/admin/stats-card/stats-card.ts`
- [x] T036 [US4] Implement statistics aggregation in AdminService `getStats()` method
- [x] T037 [US4] Create chart components (user growth, booking volume, revenue) - simple CSS-based charts
- [x] T038 [US4] Create top airlines ranking table in statistics page
- [x] T039 [US4] Implement CSV export in AdminService `exportStatsCsv()` method

---

## Phase 7: Polish & Cross-Cutting

**Goal**: Final integration, empty states, sorting, and responsive design

- [x] T040 Add empty state messages with suggestions to all list components
- [x] T041 Implement column sorting (date, name, status, amount) in data-table component
- [x] T042 Register admin routes in main app routing and verify guard protection

---

## Dependencies

```
Phase 1 (Setup)
    │
    ▼
Phase 2 (Foundational)
    │
    ├──► Phase 3 (US1: User Management)
    │
    ├──► Phase 4 (US2: Airline Management)
    │
    ├──► Phase 5 (US3: Booking Overview)
    │
    └──► Phase 6 (US4: Platform Statistics)
              │
              ▼
         Phase 7 (Polish)
```

**Notes**:
- US1-US4 can be implemented in parallel after Foundational phase
- Each user story is independently testable
- Polish phase requires all user stories complete

---

## Parallel Execution Opportunities

### Within Setup Phase
```
T002 (admin guard) ║ T003 (mock data)
```

### Within Foundational Phase
```
T008 (sidebar) ║ T009 (header) ║ T010 (data-table) ║ T011 (confirmation-modal)
```

### Across User Stories (after Foundational)
```
US1 (User Mgmt) ║ US2 (Airline Mgmt) ║ US3 (Booking Overview) ║ US4 (Statistics)
```

### Within User Stories
```
US1: T014 (template) ║ T015 (styles)
US2: T023 (template+styles)
US3: T029 (template) ║ T030 (styles)
US4: T035 (stats-card) can run parallel to T034
```

---

## Implementation Strategy

### MVP Scope (Recommended)
Start with **User Story 1 (User Management)** as MVP:
- Core admin functionality
- Demonstrates all shared components working
- Foundation for other stories

### Incremental Delivery
1. **Sprint 1**: Setup + Foundational + US1 (User Management)
2. **Sprint 2**: US2 (Airline Management) + US3 (Booking Overview)
3. **Sprint 3**: US4 (Platform Statistics) + Polish

### Verification Checkpoints
- After Setup: Admin route protected, models defined
- After Foundational: Admin container renders with sidebar/header
- After US1: Full user CRUD working with pagination
- After US2: Airline list and suspend/resume working
- After US3: Booking search and filters working
- After US4: Charts rendering, CSV export working
- After Polish: All empty states, sorting, responsive design complete
