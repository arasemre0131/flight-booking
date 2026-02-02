# Data Model: 012-admin-panel

**Date**: 2025-01-31
**Feature**: Admin Panel

## Entity Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      User       │     │     Airline     │     │     Booking     │
│  (auth.model)   │◄────│  (extended)     │     │  (booking.model)│
│                 │     │                 │     │                 │
│ + status field  │     │ + status field  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        └───────────────┬───────┴───────────────────────┘
                        ▼
              ┌─────────────────┐
              │  PlatformStats  │
              │  (aggregated)   │
              └─────────────────┘
```

---

## Extended Models

### User (Extended from auth.model.ts)

```typescript
// Existing in auth.model.ts - needs status field added
export type UserRole = 'passenger' | 'airline' | 'admin';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;        // NEW: for deactivation feature
  createdAt: string;
  airlineId?: string;        // NEW: optional, for airline operators
}
```

**Validation Rules**:
- `email`: Required, unique, valid email format
- `firstName`, `lastName`: Required, 1-50 characters
- `role`: Required, one of defined roles
- `status`: Required, defaults to 'active'
- `password`: Required for new users (temp password for admin-created)

**State Transitions**:
```
active ←→ inactive (via admin toggle)
```

---

### AirlineSummary (Admin View)

```typescript
// New model for admin.model.ts
export interface AirlineSummary {
  id: string;
  name: string;
  code: string;
  operatorCount: number;      // Count of users with this airlineId
  routeCount: number;         // Count of routes
  aircraftCount: number;      // Count of aircraft
  flightCount: number;        // Count of scheduled flights
  totalRevenue: number;       // Sum of booking amounts (cents)
  status: 'active' | 'suspended';
}
```

**Computed Fields**:
- `operatorCount`: Derived from users where `airlineId === airline.id`
- `routeCount`, `aircraftCount`, `flightCount`: From airline data
- `totalRevenue`: Aggregated from bookings for this airline

---

### BookingSummary (Admin View)

```typescript
// New model for admin.model.ts
export interface BookingSummary {
  id: string;
  confirmationCode: string;
  passengerName: string;
  passengerEmail: string;
  flightNumber: string;
  airlineId: string;
  airlineName: string;
  departureDate: string;
  route: string;              // e.g., "JFK → LAX"
  amount: number;             // In cents
  status: BookingStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
```

---

### PlatformStats (Aggregated)

```typescript
// New model for admin.model.ts
export interface PlatformStats {
  // Summary metrics
  totalUsers: UsersByRole;
  totalAirlines: number;
  totalBookings: number;
  totalRevenue: number;       // In cents

  // Time-series data for charts
  userGrowth: GrowthDataPoint[];
  bookingVolume: BookingDataPoint[];
  revenueOverTime: RevenueDataPoint[];

  // Rankings
  topAirlines: AirlineRanking[];
}

export interface UsersByRole {
  passengers: number;
  airlines: number;
  admins: number;
  total: number;
}

export interface GrowthDataPoint {
  date: string;               // ISO date
  passengers: number;         // Cumulative or new
  airlines: number;
  admins: number;
}

export interface BookingDataPoint {
  date: string;
  count: number;
  revenue: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface AirlineRanking {
  airlineId: string;
  name: string;
  bookingCount: number;
  revenue: number;
}
```

---

### Pagination & Filtering

```typescript
// Reusable pagination types for admin.model.ts
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User filters
export interface UserFilters {
  search?: string;            // Name or email
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
}

// Booking filters
export interface BookingFilters {
  search?: string;            // Confirmation code or email
  airlineId?: string | 'all';
  status?: BookingStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
}

// Date range presets
export type DateRangePreset = 'today' | 'week' | 'month' | 'year' | 'custom';
```

---

## Relationships

| From | To | Type | Description |
|------|-----|------|-------------|
| User | Airline | Many-to-One | Airline operators linked via `airlineId` |
| Booking | User | Many-to-One | Passenger reference |
| Booking | Airline | Many-to-One | Via flight's airline |
| PlatformStats | All | Aggregation | Computed from all entities |

---

## Mock Data Requirements

### admin.data.ts

```typescript
// Extended users with status and airlineId
export const ADMIN_MOCK_USERS: User[] = [
  // Include existing users + additional for testing pagination
  // At least 30 users to test pagination (25 per page)
];

// Extended bookings for admin view
export const ADMIN_MOCK_BOOKINGS: BookingSummary[] = [
  // At least 50 bookings across different airlines
  // Various statuses for filtering tests
];

// Pre-computed statistics (or compute on demand)
export function generatePlatformStats(
  dateFrom: string,
  dateTo: string
): PlatformStats;
```

---

## Index Strategy (for future backend)

| Entity | Index | Purpose |
|--------|-------|---------|
| User | email | Login lookup, search |
| User | role | Filter by role |
| User | createdAt | Growth charts |
| Booking | confirmationCode | Search |
| Booking | passengerEmail | Search |
| Booking | airlineId | Filter by airline |
| Booking | departureDate | Date range filter |
| Booking | status | Filter by status |
