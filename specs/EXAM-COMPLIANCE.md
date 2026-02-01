# TAW 2024/2025 Exam Compliance Master Document

**Last Updated**: 2025-01-31
**Project**: Flight Booking Web Application
**Course**: Tecnologie e Applicazioni Web, Ca' Foscari University Venice

---

## Executive Summary

| Category | Required | Implemented | Status |
|----------|----------|-------------|--------|
| **Frontend - Passenger Flow** | 10 specs | 10 specs | ✅ 100% |
| **Frontend - Airline/Admin** | 7 specs | 0 specs | ❌ 0% |
| **Backend - Core** | 5 specs | 0 specs | ❌ 0% |
| **Docker** | 1 spec | 0 specs | ❌ 0% |
| **TOTAL** | 23 specs | 10 specs | ⚠️ 43% |

---

## Part 1: Exam Requirements Mapping

### 1.1 User Types (Sınav Zorunlu)

| User Type | Exam Requirement | Frontend Spec | Backend Spec | Status |
|-----------|------------------|---------------|--------------|--------|
| **Anonymous** | Can search flights | 004-search-results | BE-003 | ⚠️ FE only |
| **Passenger** | Register, login, book tickets | 010-auth | BE-001 | ⚠️ FE only |
| **Airline** | Add routes, aircraft, flights, view stats | 011-airline-dashboard | BE-002 | ❌ Missing |
| **Admin** | Invite airlines, delete users | 012-admin-panel | BE-001 | ❌ Missing |

### 1.2 Core Features (Sınav Zorunlu)

| Feature | Exam Quote | Spec | Status |
|---------|------------|------|--------|
| User Registration | "Registration of new users" | 010-auth | ✅ Spec done |
| Airline by Invitation | "Airlines cannot register themselves but must be added by admin" | 012-admin-panel | ❌ Missing |
| Admin First Run | "Admin account created programmatically first time backend executed" | BE-001 | ❌ Missing |
| User Deletion | "Deletion of existing users (admin only)" | 012-admin-panel | ❌ Missing |
| Route Creation | "Creation of new routes" | 011-airline-dashboard | ❌ Missing |
| Aircraft Creation | "Creation of new aircrafts" | 011-airline-dashboard | ❌ Missing |
| Flight Creation | "Creation of flights (aircraft + route + time)" | 011-airline-dashboard | ❌ Missing |
| Ticket Pricing | "Setting costs for each type of tickets" | 011-airline-dashboard | ❌ Missing |
| Statistics | "View statistics about passengers, revenue, routes" | 011-airline-dashboard | ❌ Missing |
| Flight Search | "Any user can search for flight trips" | 004-search-results | ✅ Done |
| Intermediate Stops | "Up to 1 intermediate stop, at least 2 hours transfer" | 004-search-results | ⚠️ FE only |
| Sort Results | "Sorting by cost, duration, stops" | 004-search-results | ✅ Done |
| Seat Selection | "Passengers can select their seat during purchase" | 007-seat-selection | ✅ Done |
| Extras | "Additional baggage or extra legroom" | 006-passenger-info | ✅ Done |
| Ticket Purchase | "Passengers can buy tickets" | 008-payment | ✅ Done |
| Real-time Seats | "Real-time seat availability, auto-update when purchased" | BE-004 | ❌ Missing |

### 1.3 Architecture (Sınav Zorunlu)

| Component | Requirement | Status |
|-----------|-------------|--------|
| Backend | Node.js + Express.js + TypeScript | ❌ Empty |
| Database | MongoDB or Relational | ❌ Not configured |
| Frontend | Angular SPA | ✅ Angular 17+ |
| Docker | 3 separate containers | ❌ Missing |

---

## Part 2: Existing Specs Compliance Check

### Frontend Specs (001-010)

| Spec | Exam Compliance | Issues |
|------|-----------------|--------|
| 001-header-footer | ✅ Compliant | None |
| 002-search-form | ✅ Compliant | None |
| 003-landing-content | ✅ Compliant | None |
| 004-search-results | ⚠️ Partial | Missing: 2-hour transfer validation for stops |
| 005-search-sidebar | ✅ Compliant | None |
| 006-passenger-info | ✅ Compliant | Has extras (baggage) |
| 007-seat-selection | ✅ Compliant | None |
| 008-payment | ✅ Compliant | None |
| 009-confirmation | ✅ Compliant | None |
| 010-auth | ⚠️ Partial | Missing: Airline login flow, role distinction |

### Issues to Fix in Existing Specs

#### 004-search-results
- **Issue**: No mention of 2-hour minimum transfer time for connecting flights
- **Fix**: Add FR for transfer time validation in flight search

#### 010-auth
- **Issue**: Spec only covers passenger auth, not airline/admin
- **Fix**: Spec should clarify it's passenger-only, airline auth in separate spec

---

## Part 3: New Specs Required

### Frontend Specs (011-013)

| Spec ID | Name | Priority | Description |
|---------|------|----------|-------------|
| 011-airline-dashboard | Airline Dashboard | P1 | Route, aircraft, flight management + statistics |
| 012-admin-panel | Admin Panel | P1 | User management, airline invitation |
| 013-realtime-seats | Real-time Seat Updates | P2 | WebSocket integration for seat availability |

### Backend Specs (BE-001 to BE-005)

| Spec ID | Name | Priority | Description |
|---------|------|----------|-------------|
| BE-001 | Auth & User Management | P0 | JWT auth, user roles, admin seed, airline invitation |
| BE-002 | Airline Management API | P1 | Routes, aircraft, flights CRUD |
| BE-003 | Flight Search API | P1 | Search with stops, sorting, filtering |
| BE-004 | Booking & Seats API | P1 | Ticket purchase, seat selection, real-time availability |
| BE-005 | Statistics API | P2 | Revenue, passengers, popular routes |

### Infrastructure Specs

| Spec ID | Name | Priority | Description |
|---------|------|----------|-------------|
| INFRA-001 | Docker Setup | P0 | 3 containers: frontend, backend, mongodb |

---

## Part 4: Complete Spec List (Ordered)

### Implementation Order

```
Phase 1: Frontend Completion (Current)
├── 010-auth [IMPLEMENT] - Passenger authentication
│
Phase 2: Backend Foundation
├── INFRA-001 [NEW] - Docker setup
├── BE-001 [NEW] - Auth & User Management
│
Phase 3: Backend Core
├── BE-002 [NEW] - Airline Management API
├── BE-003 [NEW] - Flight Search API
├── BE-004 [NEW] - Booking & Seats API
│
Phase 4: Frontend Admin/Airline
├── 011-airline-dashboard [NEW] - Airline dashboard
├── 012-admin-panel [NEW] - Admin panel
│
Phase 5: Real-time & Polish
├── BE-005 [NEW] - Statistics API
├── 013-realtime-seats [NEW] - WebSocket seats
│
Phase 6: Integration & Test Data
└── Seed data, integration testing
```

---

## Part 5: Detailed New Spec Outlines

### INFRA-001: Docker Setup

**User Stories**:
1. Developer can start entire app with `docker-compose up`
2. Each component runs in isolated container
3. Environment variables configure connections

**Requirements**:
- FR-001: Frontend container serves Angular build on port 4200
- FR-002: Backend container runs Express on port 3000
- FR-003: MongoDB container runs on port 27017
- FR-004: docker-compose.yml orchestrates all 3 containers
- FR-005: Volumes persist MongoDB data
- FR-006: Environment variables configure DB connection

**Files**:
- `docker-compose.yml`
- `frontend/Dockerfile`
- `backend/Dockerfile`
- `.env.example`

---

### BE-001: Auth & User Management

**User Stories**:
1. Passenger registers with email/password
2. Airline logs in after receiving invitation
3. Admin is created on first backend start
4. Admin can invite airlines with temp password
5. Airline changes password on first login

**Requirements**:
- FR-001: POST /api/auth/register - Passenger registration
- FR-002: POST /api/auth/login - JWT token generation
- FR-003: POST /api/auth/logout - Token invalidation
- FR-004: GET /api/auth/me - Current user info
- FR-005: Admin created programmatically if not exists
- FR-006: POST /api/admin/invite-airline - Admin invites airline
- FR-007: PUT /api/auth/change-password - First login password change
- FR-008: DELETE /api/admin/users/:id - Admin deletes user
- FR-009: User roles: passenger, airline, admin
- FR-010: JWT includes role for authorization
- FR-011: Passwords hashed with bcrypt

**Entities**:
```typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string; // bcrypt hashed
  role: 'passenger' | 'airline' | 'admin';
  firstName: string;
  lastName: string;
  mustChangePassword: boolean; // for airline first login
  airlineId?: ObjectId; // if role is airline
  createdAt: Date;
  updatedAt: Date;
}
```

---

### BE-002: Airline Management API

**User Stories**:
1. Airline creates routes (origin → destination)
2. Airline adds aircraft with seat configuration
3. Airline schedules flights (aircraft + route + datetime)
4. Airline sets ticket prices per class

**Requirements**:
- FR-001: POST /api/airlines/routes - Create route
- FR-002: GET /api/airlines/routes - List airline's routes
- FR-003: PUT /api/airlines/routes/:id - Update route
- FR-004: DELETE /api/airlines/routes/:id - Delete route
- FR-005: POST /api/airlines/aircraft - Create aircraft
- FR-006: GET /api/airlines/aircraft - List aircraft
- FR-007: POST /api/airlines/flights - Create flight
- FR-008: GET /api/airlines/flights - List flights
- FR-009: PUT /api/airlines/flights/:id/pricing - Set ticket prices
- FR-010: All endpoints require airline role

**Entities**:
```typescript
interface Route {
  _id: ObjectId;
  airlineId: ObjectId;
  originAirport: string; // IATA code
  destinationAirport: string;
  flightNumber: string; // e.g., "AA123"
  isActive: boolean;
}

interface Aircraft {
  _id: ObjectId;
  airlineId: ObjectId;
  model: string; // e.g., "Boeing 737-800"
  registration: string; // e.g., "N12345"
  seatConfiguration: {
    economy: { rows: number; seatsPerRow: number };
    business: { rows: number; seatsPerRow: number };
    firstClass?: { rows: number; seatsPerRow: number };
  };
  totalSeats: number;
}

interface Flight {
  _id: ObjectId;
  airlineId: ObjectId;
  routeId: ObjectId;
  aircraftId: ObjectId;
  departureTime: Date;
  arrivalTime: Date;
  pricing: {
    economy: number;
    business: number;
    firstClass?: number;
  };
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
}
```

---

### BE-003: Flight Search API

**User Stories**:
1. User searches flights by origin, destination, date
2. System returns direct and 1-stop flights
3. User sorts results by price, duration, stops
4. User filters by airline, time, stops

**Requirements**:
- FR-001: GET /api/flights/search - Search flights (public)
- FR-002: Support round-trip and one-way searches
- FR-003: Return connecting flights with 1 stop
- FR-004: Minimum 2-hour transfer time for connections
- FR-005: Sort by price, duration, departure time, stops
- FR-006: Filter by airline, stops (0, 1), time range
- FR-007: Include seat availability count in response
- FR-008: Pagination with limit/offset

**Search Logic**:
```
1. Find direct flights (origin → destination)
2. Find connecting flights:
   a. Find flights from origin to any hub
   b. Find flights from hub to destination
   c. Filter: arrival + 2 hours <= departure of second flight
   d. Same day connections only
3. Combine and sort results
```

---

### BE-004: Booking & Seats API

**User Stories**:
1. Passenger creates booking for flight(s)
2. Passenger selects seats during booking
3. System locks selected seats temporarily
4. Payment completes booking and confirms seats
5. Other users see real-time seat availability

**Requirements**:
- FR-001: POST /api/bookings - Create booking (auth required)
- FR-002: GET /api/bookings/:id - Get booking details
- FR-003: GET /api/flights/:id/seats - Get seat availability
- FR-004: POST /api/bookings/:id/seats - Select seats
- FR-005: POST /api/bookings/:id/payment - Process payment
- FR-006: WebSocket endpoint for real-time seat updates
- FR-007: Seat lock expires after 10 minutes without payment
- FR-008: Confirmation email sent after successful booking

**Entities**:
```typescript
interface Booking {
  _id: ObjectId;
  passengerId: ObjectId;
  flights: Array<{
    flightId: ObjectId;
    passengers: Array<{
      firstName: string;
      lastName: string;
      dateOfBirth: Date;
      seatNumber?: string;
      ticketClass: 'economy' | 'business' | 'firstClass';
      extras: {
        extraBaggage: boolean;
        extraLegroom: boolean;
      };
    }>;
  }>;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentId?: string;
  confirmationNumber: string;
  createdAt: Date;
}

interface SeatAvailability {
  flightId: ObjectId;
  seatNumber: string; // e.g., "12A"
  status: 'available' | 'locked' | 'booked';
  lockedBy?: ObjectId; // booking ID
  lockedUntil?: Date;
  class: 'economy' | 'business' | 'firstClass';
  price: number;
}
```

---

### BE-005: Statistics API

**User Stories**:
1. Airline views passenger count per flight
2. Airline views total revenue by period
3. Airline views most in-demand routes

**Requirements**:
- FR-001: GET /api/airlines/stats/passengers - Passenger counts
- FR-002: GET /api/airlines/stats/revenue - Revenue by period
- FR-003: GET /api/airlines/stats/routes - Popular routes ranking
- FR-004: Date range filtering for all stats
- FR-005: Only airline's own data visible

---

### 011-airline-dashboard (Frontend)

**User Stories**:
1. Airline user sees overview dashboard
2. Airline manages routes (CRUD)
3. Airline manages aircraft (CRUD)
4. Airline manages flights (CRUD with pricing)
5. Airline views statistics

**Pages**:
- `/airline/dashboard` - Overview with stats summary
- `/airline/routes` - Route management
- `/airline/aircraft` - Aircraft management
- `/airline/flights` - Flight scheduling
- `/airline/statistics` - Detailed statistics

**Requirements**:
- FR-001: Protected routes (airline role only)
- FR-002: Dashboard shows quick stats (flights today, revenue this month)
- FR-003: Route list with create/edit/delete actions
- FR-004: Aircraft list with seat configuration editor
- FR-005: Flight calendar/list view with pricing editor
- FR-006: Statistics charts (revenue over time, popular routes)

---

### 012-admin-panel (Frontend)

**User Stories**:
1. Admin views all users
2. Admin invites new airline
3. Admin deletes users
4. First admin created on app init

**Pages**:
- `/admin/users` - User management
- `/admin/invite` - Airline invitation form

**Requirements**:
- FR-001: Protected routes (admin role only)
- FR-002: User list with role filter
- FR-003: Delete user button with confirmation
- FR-004: Invite airline form (email, company name)
- FR-005: Show airline invitation status (pending, accepted)

---

### 013-realtime-seats (Frontend)

**User Stories**:
1. User sees seat availability update in real-time
2. When another user books a seat, it becomes unavailable immediately

**Requirements**:
- FR-001: WebSocket connection to backend
- FR-002: Subscribe to seat updates for viewed flight
- FR-003: Update seat map UI when seat status changes
- FR-004: Show notification when selected seat becomes unavailable
- FR-005: Graceful fallback to polling if WebSocket fails

---

## Part 6: Test Data Requirements

**Sınav diyor:**
> "When the backend starts, it must preload some test data (users, airlines, flights, etc.)"

### Seed Data Spec

```javascript
// Seed on first run
const seedData = {
  admin: {
    email: 'admin@skyroute.com',
    password: 'admin123', // hashed
    role: 'admin'
  },
  airlines: [
    { name: 'Hawaiian Airlines', code: 'HA' },
    { name: 'Japan Airlines', code: 'JL' },
    { name: 'Delta Air Lines', code: 'DL' }
  ],
  routes: [
    { origin: 'SFO', destination: 'NRT', airline: 'JL' },
    { origin: 'SFO', destination: 'HNL', airline: 'HA' },
    { origin: 'HNL', destination: 'NRT', airline: 'HA' }
  ],
  flights: [
    // 10+ flights with various times and prices
  ],
  testPassenger: {
    email: 'test@example.com',
    password: 'password123',
    role: 'passenger'
  }
};
```

---

## Part 7: File Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── roleGuard.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Airline.ts
│   │   ├── Route.ts
│   │   ├── Aircraft.ts
│   │   ├── Flight.ts
│   │   ├── Booking.ts
│   │   └── SeatAvailability.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── admin.ts
│   │   ├── airlines.ts
│   │   ├── flights.ts
│   │   └── bookings.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── flightSearchService.ts
│   │   ├── bookingService.ts
│   │   └── statsService.ts
│   ├── websocket/
│   │   └── seatUpdates.ts
│   ├── seed/
│   │   └── seedData.ts
│   ├── app.ts
│   └── server.ts
├── Dockerfile
├── package.json
└── tsconfig.json
```

### New Frontend Structure (additions)
```
frontend/src/app/
├── pages/
│   ├── airline/
│   │   ├── dashboard/
│   │   ├── routes/
│   │   ├── aircraft/
│   │   ├── flights/
│   │   └── statistics/
│   └── admin/
│       ├── users/
│       └── invite/
├── guards/
│   ├── auth.guard.ts
│   ├── airline.guard.ts
│   └── admin.guard.ts
└── services/
    ├── api.service.ts (HTTP client)
    └── websocket.service.ts
```

---

## Part 8: API Endpoints Summary

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /api/auth/register | No | - | Passenger registration |
| POST | /api/auth/login | No | - | Login (all users) |
| GET | /api/auth/me | Yes | Any | Current user |
| PUT | /api/auth/change-password | Yes | Any | Change password |
| POST | /api/admin/invite-airline | Yes | Admin | Invite airline |
| GET | /api/admin/users | Yes | Admin | List users |
| DELETE | /api/admin/users/:id | Yes | Admin | Delete user |
| GET | /api/flights/search | No | - | Search flights |
| GET | /api/flights/:id/seats | No | - | Seat availability |
| POST | /api/bookings | Yes | Passenger | Create booking |
| POST | /api/bookings/:id/seats | Yes | Passenger | Select seats |
| POST | /api/bookings/:id/payment | Yes | Passenger | Pay |
| GET | /api/airlines/routes | Yes | Airline | List routes |
| POST | /api/airlines/routes | Yes | Airline | Create route |
| GET | /api/airlines/aircraft | Yes | Airline | List aircraft |
| POST | /api/airlines/aircraft | Yes | Airline | Create aircraft |
| GET | /api/airlines/flights | Yes | Airline | List flights |
| POST | /api/airlines/flights | Yes | Airline | Create flight |
| GET | /api/airlines/stats/* | Yes | Airline | Statistics |

---

## Part 9: Checklist for Submission

### Required Files (Exam)

- [ ] README.txt with run instructions
- [ ] Individual reports (PDF per student)
- [ ] All source code (no node_modules)

### README.txt Content

```
# Flight Booking Application
# TAW 2024/2025

## Prerequisites
- Docker & Docker Compose installed

## Running the Application

1. Clone the repository
2. Run: docker-compose up --build
3. Access:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

## Test Accounts

Admin:
- Email: admin@skyroute.com
- Password: admin123

Passenger:
- Email: test@example.com
- Password: password123

Airline (Hawaiian Airlines):
- Email: hawaiian@airline.com
- Password: [set after first login invitation]

## Stopping
docker-compose down
```

---

## Part 10: Timeline Recommendation

| Week | Focus | Specs |
|------|-------|-------|
| 1 | Backend Setup | INFRA-001, BE-001 |
| 2 | Backend Core | BE-002, BE-003 |
| 3 | Backend Booking | BE-004 |
| 4 | Frontend Airline | 011-airline-dashboard |
| 5 | Frontend Admin | 012-admin-panel |
| 6 | Real-time & Polish | BE-005, 013-realtime-seats |
| 7 | Integration Testing | Seed data, full flow test |
| 8 | Documentation | Reports, README |
