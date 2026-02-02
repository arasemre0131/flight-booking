# 012-admin-panel

**Status**: SPECIFIED
**Created**: 2025-01-31
**Branch**: `012-admin-panel`

---

## Summary

System administration panel that enables platform administrators to manage users across all roles (passengers, airline operators, admins), view and manage all airlines on the platform, monitor all bookings system-wide, and access comprehensive platform statistics. This dashboard is accessible only to users with the "admin" role.

---

## User Stories

### US1: User Management
**As a** system administrator,
**I want to** view and manage all users on the platform,
**So that** I can maintain user accounts and handle support requests.

**Acceptance Criteria**:
- AC1: I can view a list of all users with their role, email, registration date, and status
- AC2: I can filter users by role (passenger, airline, admin)
- AC3: I can search users by name or email
- AC4: I can edit user details (name, email)
- AC5: I can change a user's role (promote/demote)
- AC6: I can deactivate/reactivate user accounts
- AC7: I can create new admin or airline users directly

### US2: Airline Management
**As a** system administrator,
**I want to** view and manage all airlines on the platform,
**So that** I can oversee airline operations and onboard new airlines.

**Acceptance Criteria**:
- AC1: I can view a list of all airlines with their operator count and flight count
- AC2: I can see summary stats for each airline (routes, aircraft, flights, revenue)
- AC3: I can view which users are associated with each airline
- AC4: I can suspend an airline's operations temporarily
- AC5: I can assign users to airline operator role

### US3: Booking Overview
**As a** system administrator,
**I want to** view all bookings across the platform,
**So that** I can monitor transactions and handle disputes.

**Acceptance Criteria**:
- AC1: I can view a list of all bookings with passenger, flight, status, and amount
- AC2: I can filter bookings by date range, airline, status
- AC3: I can search bookings by confirmation code or passenger email
- AC4: I can view booking details including passenger info and seat assignments
- AC5: I can see payment status for each booking

### US4: Platform Statistics
**As a** system administrator,
**I want to** view platform-wide statistics,
**So that** I can monitor platform health and growth.

**Acceptance Criteria**:
- AC1: I can see total users by role over time
- AC2: I can see total bookings and revenue across all airlines
- AC3: I can see platform growth trends (new users, new bookings)
- AC4: I can see most active airlines by bookings
- AC5: I can filter all statistics by date range
- AC6: Statistics are displayed with charts and summary cards

---

## Functional Requirements

### Navigation & Layout
- FR-001: Admin panel accessible via `/admin` route (protected by admin role)
- FR-002: Sidebar navigation with sections: Dashboard, Users, Airlines, Bookings, Statistics
- FR-003: Header displays "Admin Panel" and admin user info with logout option
- FR-004: Responsive layout supporting desktop (primary) and tablet views
- FR-004a: Empty states display contextual messages with actionable suggestions (e.g., "No bookings found. Try adjusting filters.")
- FR-004b: List tables support sorting by date, name, status, and amount columns (clickable headers with sort indicator)

### User Management
- FR-005: Users list page with table showing: name, email, role, status, created date, actions (server-side pagination, 25 per page)
- FR-006: Role filter dropdown (All, Passenger, Airline, Admin)
- FR-007: Search input for name/email filtering
- FR-008: Edit user modal with editable fields: first name, last name, email
- FR-009: Role change confirmation dialog with warning about permission changes
- FR-010: Deactivate/Reactivate toggle with confirmation; deactivation immediately terminates user session and blocks all actions
- FR-011: Create user form for admin/airline users with fields: email, name, role, temp password

### Airline Management
- FR-012: Airlines list page showing: airline name, operator count, routes, aircraft, flights, status (server-side pagination, 25 per page); suspended airlines displayed with visual indicator (badge/row highlight)
- FR-013: Airline detail view showing associated users and summary statistics
- FR-014: Suspend/Resume airline toggle with confirmation
- FR-015: Assign user to airline dropdown selection

### Booking Overview
- FR-016: Bookings list page with table: confirmation code, passenger, flight, airline, date, amount, status (server-side pagination, 25 per page)
- FR-017: Date range filter with preset options (today, week, month, custom)
- FR-018: Airline filter dropdown
- FR-019: Status filter (pending, confirmed, cancelled, completed)
- FR-020: Search by confirmation code or passenger email
- FR-021: Booking detail modal showing full passenger info and seat assignments

### Platform Statistics
- FR-022: Dashboard overview with key metrics: total users, total airlines, total bookings, total revenue
- FR-023: User growth chart (line chart showing new users over time by role)
- FR-024: Booking volume chart (bar chart showing bookings per day/week/month)
- FR-025: Revenue chart (line chart showing revenue over time)
- FR-026: Top airlines table (ranked by bookings or revenue)
- FR-027: Date range filter for all statistics
- FR-028: Export statistics to CSV

---

## Success Criteria

1. Admin can manage 100+ users without performance degradation
2. User searches return results within 1 second
3. Statistics load within 2 seconds for date ranges up to 1 year
4. All user management actions have confirmation dialogs for destructive operations
5. Role changes take effect immediately after confirmation
6. Admin can view any booking details within 3 clicks from dashboard

---

## Key Entities

### AdminUser (extends User)
- All User fields
- Permissions: manage_users, manage_airlines, view_bookings, view_statistics

### AirlineSummary
- airlineId: string
- name: string
- operatorCount: number
- routeCount: number
- aircraftCount: number
- flightCount: number
- totalRevenue: number
- status: 'active' | 'suspended'

### BookingSummary
- id: string
- confirmationCode: string
- passengerName: string
- passengerEmail: string
- flightNumber: string
- airlineName: string
- departureDate: string
- amount: number
- status: 'pending' | 'confirmed' | 'cancelled' | 'completed'

### PlatformStats
- totalUsers: { passengers: number, airlines: number, admins: number }
- totalBookings: number
- totalRevenue: number
- userGrowth: { date: string, passengers: number, airlines: number }[]
- bookingsByDay: { date: string, count: number, revenue: number }[]
- topAirlines: { name: string, bookings: number, revenue: number }[]

---

## Assumptions

1. Admin users are created manually or through a seed script (no self-registration)
2. Only one admin role exists (no granular admin permissions for MVP)
3. Airline suspension hides flights from search but preserves existing bookings
4. Revenue is calculated from mock booking data (no real payments)
5. Statistics use mock data aggregated from existing mock bookings and users

---

## Out of Scope

1. Real-time notifications for admin actions
2. Audit log of admin activities
3. Multi-tenant admin hierarchy
4. Refund processing
5. Email notifications for user changes

---

## Dependencies

- 010-auth: User authentication and role system
- 011-airline-dashboard: Airline data models and service

---

## Clarifications

### Session 2025-01-31
- Q: When an admin deactivates a user account, what should happen to that user's active session? → A: User is immediately logged out and all actions blocked
- Q: How should large lists (users, bookings, airlines) be paginated? → A: Server-side pagination with 25 items per page
- Q: When an airline is suspended, how should it appear in the admin panel? → A: Suspended airlines shown with visual indicator (badge/row highlight)
- Q: What should be displayed when a section has no data? → A: Contextual message with suggestion (e.g., "No bookings found. Try adjusting filters.")
- Q: Which columns should be sortable in admin list views? → A: Date, name, status, and amount columns sortable

---

## Testing Scenarios

### TS1: User Management Flow
1. Navigate to /admin (logged in as admin)
2. Go to Users section
3. Filter by "Airline" role
4. Search for a user by email
5. Edit user's name
6. Change user's role from "passenger" to "airline"
7. Verify role change takes effect

### TS2: Booking Search Flow
1. Navigate to Bookings section
2. Set date range to "Last 30 days"
3. Filter by specific airline
4. Search by confirmation code
5. View booking details
6. Verify passenger and seat information displayed

### TS3: Statistics Dashboard Flow
1. Navigate to Statistics section
2. View default dashboard with all-time stats
3. Change date range to "Last 7 days"
4. Verify charts update
5. Export statistics to CSV
6. Verify CSV contains expected data
