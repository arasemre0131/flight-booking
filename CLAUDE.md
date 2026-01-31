# Flight Booking Web Application

## Project Overview
A flight booking web application for the "Tecnologie e Applicazioni Web" course (2024/2025) at Ca' Foscari University Venice.

**Exam Compliance Document**: [specs/EXAM-COMPLIANCE.md](specs/EXAM-COMPLIANCE.md)

## Tech Stack
- **Backend:** Node.js + Express.js + TypeScript
- **Database:** MongoDB
- **Frontend:** Angular 17+ (SPA)
- **Containerization:** Docker (3 separate containers)

## Design Reference
- **Figma:** Tripma Flight Booking Web App
- https://www.figma.com/community/file/911320742349428744
- Assets: `frontend/design/images/`
- Mapping: `frontend/design/IMAGE-MAPPING.md`

---

## 🔴 EXAM REQUIREMENTS (MUST READ)

### User Types (Sınav Zorunlu)

| Tip | Açıklama | Frontend | Backend |
|-----|----------|----------|---------|
| **Anonymous** | Uçuş arayabilir | ✅ | ❌ |
| **Passenger** | Kayıt, giriş, bilet al | ✅ 010-auth | ❌ BE-001 |
| **Airline** | Route/aircraft/flight yönet, stats gör | ❌ 011 | ❌ BE-002 |
| **Admin** | Airline davet, kullanıcı sil | ❌ 012 | ❌ BE-001 |

### Critical Exam Features

1. **Airline by Invitation**: Airlines cannot register themselves, admin invites with temp password
2. **Admin First Run**: Admin created programmatically on first backend start
3. **Real-time Seats**: WebSocket ile anlık koltuk durumu güncellemesi
4. **2-Hour Transfer**: Aktarmalı uçuşlarda minimum 2 saat bekleme
5. **Statistics**: Airline'lar için yolcu, gelir, popüler rota istatistikleri
6. **Docker**: 3 ayrı container zorunlu

---

## 🔴 SPECKIT WORKFLOW (MUST READ FIRST)

### When `/speckit.specify` is called:

1. **ALWAYS** read the spec file from `specs/` first
2. **LOOK** at the "Files to Create" table - these are EXACT files to generate
3. **CHECK** dependencies - implement required specs first
4. **USE** mock data from `src/app/mock-data/` (not real API) for frontend Phase 1
5. **FOLLOW** the Figma design exactly
6. **MAX 400 lines** total per spec

### When `/speckit.clarify` is called:

1. Read the current spec file
2. Ask questions about unclear parts
3. Update spec file with answers

### When `/speckit.implement` is called:

1. Read the spec file completely
2. Create ALL files listed in "Files to Create" table
3. Use Angular CLI conventions
4. Import mock data, not real API calls (Phase 1)
5. Match Figma design pixel-perfect

---

## All Specs - Complete List

### Phase 1: Frontend - Passenger Flow (Mock Data)

| # | Spec ID | Name | Status |
|---|---------|------|--------|
| 1 | 001-header-footer | Header + Footer | ✅ Done |
| 2 | 002-search-form | Search Form Components | ✅ Done |
| 3 | 003-landing-content | Landing Page Content | ✅ Done |
| 4 | 004-search-results | Search Results - Flights | ✅ Done |
| 5 | 005-search-sidebar | Search Results - Sidebar | ✅ Done |
| 6 | 006-passenger-info | Passenger Information | ✅ Done |
| 7 | 007-seat-selection | Seat Selection | ✅ Done |
| 8 | 008-payment | Payment Method | ✅ Done |
| 9 | 009-confirmation | Booking Confirmation | ✅ Done |
| 10 | 010-auth | Auth (Login/Register) | 📋 Tasks Ready |

### Phase 2: Infrastructure & Backend Core

| # | Spec ID | Name | Status | Priority |
|---|---------|------|--------|----------|
| 11 | INFRA-001 | Docker Setup | ❌ Not Started | P0 |
| 12 | BE-001 | Auth & User Management | ❌ Not Started | P0 |
| 13 | BE-002 | Airline Management API | ❌ Not Started | P1 |
| 14 | BE-003 | Flight Search API | ❌ Not Started | P1 |
| 15 | BE-004 | Booking & Seats API | ❌ Not Started | P1 |
| 16 | BE-005 | Statistics API | ❌ Not Started | P2 |

### Phase 3: Frontend - Airline & Admin

| # | Spec ID | Name | Status | Priority |
|---|---------|------|--------|----------|
| 17 | 011-airline-dashboard | Airline Dashboard | ❌ Not Started | P1 |
| 18 | 012-admin-panel | Admin Panel | ❌ Not Started | P1 |
| 19 | 013-realtime-seats | Real-time Seat Updates | ❌ Not Started | P2 |

---

## Backend API Endpoints (Exam Required)

### BE-001: Auth & User Management

```
POST   /api/auth/register          # Passenger registration
POST   /api/auth/login             # Login (JWT token)
GET    /api/auth/me                # Current user
PUT    /api/auth/change-password   # Change password (airline first login)
POST   /api/admin/invite-airline   # Admin invites airline
GET    /api/admin/users            # List all users
DELETE /api/admin/users/:id        # Delete user (admin only)
```

### BE-002: Airline Management

```
GET    /api/airlines/routes        # List airline's routes
POST   /api/airlines/routes        # Create route
PUT    /api/airlines/routes/:id    # Update route
DELETE /api/airlines/routes/:id    # Delete route
GET    /api/airlines/aircraft      # List aircraft
POST   /api/airlines/aircraft      # Create aircraft
GET    /api/airlines/flights       # List flights
POST   /api/airlines/flights       # Create flight
PUT    /api/airlines/flights/:id/pricing  # Set ticket prices
```

### BE-003: Flight Search

```
GET    /api/flights/search         # Search (public, with stops support)
GET    /api/flights/:id            # Flight details
```

### BE-004: Booking & Seats

```
POST   /api/bookings               # Create booking (auth required)
GET    /api/bookings/:id           # Get booking
GET    /api/flights/:id/seats      # Seat availability
POST   /api/bookings/:id/seats     # Select seats
POST   /api/bookings/:id/payment   # Process payment
WS     /ws/seats/:flightId         # Real-time seat updates
```

### BE-005: Statistics

```
GET    /api/airlines/stats/passengers  # Passenger counts
GET    /api/airlines/stats/revenue     # Revenue by period
GET    /api/airlines/stats/routes      # Popular routes
```

---

## Data Models (MongoDB)

### User
```typescript
{
  email: string;           // unique
  password: string;        // bcrypt hashed
  role: 'passenger' | 'airline' | 'admin';
  firstName: string;
  lastName: string;
  mustChangePassword: boolean;  // airline first login
  airlineId?: ObjectId;    // if role is airline
}
```

### Route
```typescript
{
  airlineId: ObjectId;
  originAirport: string;   // IATA code
  destinationAirport: string;
  flightNumber: string;    // e.g., "AA123"
  isActive: boolean;
}
```

### Aircraft
```typescript
{
  airlineId: ObjectId;
  model: string;           // e.g., "Boeing 737-800"
  registration: string;    // e.g., "N12345"
  seatConfiguration: {
    economy: { rows: number; seatsPerRow: number };
    business: { rows: number; seatsPerRow: number };
  };
  totalSeats: number;
}
```

### Flight
```typescript
{
  airlineId: ObjectId;
  routeId: ObjectId;
  aircraftId: ObjectId;
  departureTime: Date;
  arrivalTime: Date;
  pricing: {
    economy: number;
    business: number;
  };
  status: 'scheduled' | 'departed' | 'arrived' | 'cancelled';
}
```

### Booking
```typescript
{
  passengerId: ObjectId;
  flights: Array<{
    flightId: ObjectId;
    passengers: Array<{
      firstName: string;
      lastName: string;
      seatNumber?: string;
      ticketClass: 'economy' | 'business';
      extras: { extraBaggage: boolean; extraLegroom: boolean };
    }>;
  }>;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmationNumber: string;
}
```

---

## Full Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular 17+)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PHASE 1: Passenger Flow (Mock Data) ✅                              │
│  ═══════════════════════════════════                                 │
│  001-header-footer ✅                                                │
│      │                                                               │
│      ├──► 002-search-form ✅ ─────────────────┐                      │
│      │        │                               │                      │
│      │        ├──► 003-landing-content ✅     │                      │
│      │        │                               │                      │
│      │        └──► 004-search-results ✅      │                      │
│      │                  │                     │                      │
│      │                  └──► 005-sidebar ✅   │                      │
│      │                                        │                      │
│      └──► 010-auth 📋                         │                      │
│                  │                            │                      │
│                  └──► 006-passenger-info ✅   │                      │
│                              │                │                      │
│                              └──► 007-seat ✅ │                      │
│                                      │        │                      │
│                                      └──► 008-payment ✅             │
│                                               │                      │
│                                               └──► 009-confirm ✅    │
│                                                                      │
│  PHASE 3: Airline & Admin ❌                                         │
│  ═══════════════════════════                                         │
│  011-airline-dashboard ❌ ──► Routes, Aircraft, Flights, Stats       │
│  012-admin-panel ❌ ──► User Management, Airline Invitation          │
│  013-realtime-seats ❌ ──► WebSocket Integration                     │
│                                                                      │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP API + WebSocket
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PHASE 2: Infrastructure & Core ❌                                   │
│  ═══════════════════════════════                                     │
│                                                                      │
│  INFRA-001 Docker ❌                                                 │
│      │                                                               │
│      └──► BE-001 Auth ❌                                             │
│               │                                                      │
│               ├──► BE-002 Airline Mgmt ❌                            │
│               │                                                      │
│               ├──► BE-003 Flight Search ❌ ──► 2h transfer logic     │
│               │                                                      │
│               ├──► BE-004 Booking ❌ ──► WebSocket seats             │
│               │                                                      │
│               └──► BE-005 Statistics ❌                              │
│                                                                      │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         MONGODB                                      │
├─────────────────────────────────────────────────────────────────────┤
│  Collections: users, airlines, routes, aircraft, flights,           │
│               bookings, seatAvailability                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
flight-booking/
├── frontend/                    # Angular 17+ SPA
│   ├── design/
│   │   ├── images/
│   │   └── IMAGE-MAPPING.md
│   ├── Dockerfile               # Frontend container
│   └── src/app/
│       ├── pages/
│       │   ├── landing/
│       │   ├── search-results/
│       │   ├── passenger-info/
│       │   ├── seat-selection/
│       │   ├── payment/
│       │   ├── confirmation/
│       │   ├── login/
│       │   ├── register/
│       │   ├── airline/         # 011 - Airline Dashboard
│       │   │   ├── dashboard/
│       │   │   ├── routes/
│       │   │   ├── aircraft/
│       │   │   ├── flights/
│       │   │   └── statistics/
│       │   └── admin/           # 012 - Admin Panel
│       │       ├── users/
│       │       └── invite/
│       ├── components/
│       ├── services/
│       ├── models/
│       ├── guards/              # auth, airline, admin guards
│       └── mock-data/
│
├── backend/                     # Node.js + Express API
│   ├── Dockerfile               # Backend container
│   └── src/
│       ├── config/
│       │   ├── database.ts
│       │   └── env.ts
│       ├── middleware/
│       │   ├── auth.ts
│       │   ├── roleGuard.ts
│       │   └── errorHandler.ts
│       ├── models/
│       │   ├── User.ts
│       │   ├── Airline.ts
│       │   ├── Route.ts
│       │   ├── Aircraft.ts
│       │   ├── Flight.ts
│       │   ├── Booking.ts
│       │   └── SeatAvailability.ts
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── admin.ts
│       │   ├── airlines.ts
│       │   ├── flights.ts
│       │   └── bookings.ts
│       ├── services/
│       ├── websocket/
│       │   └── seatUpdates.ts
│       ├── seed/
│       │   └── seedData.ts      # Test data on first run
│       └── server.ts
│
├── specs/                       # Feature specifications
│   ├── EXAM-COMPLIANCE.md       # Master exam requirements doc
│   ├── 001-header-footer/
│   ├── ...
│   ├── 010-auth/
│   ├── 011-airline-dashboard/   # NEW
│   ├── 012-admin-panel/         # NEW
│   ├── 013-realtime-seats/      # NEW
│   ├── BE-001-auth/             # Backend specs
│   ├── BE-002-airline/
│   ├── BE-003-flight-search/
│   ├── BE-004-booking/
│   ├── BE-005-statistics/
│   └── INFRA-001-docker/
│
├── docker-compose.yml           # 3 containers
├── .env.example                 # Environment template
└── README.txt                   # Exam submission instructions
```

---

## Test Data (Seed on Backend Start)

```javascript
// Otomatik oluşturulacak veriler
{
  admin: {
    email: 'admin@tripma.com',
    password: 'admin123',  // hashed
    role: 'admin'
  },
  testPassenger: {
    email: 'test@example.com',
    password: 'password123',
    role: 'passenger'
  },
  airlines: [
    { name: 'Hawaiian Airlines', code: 'HA' },
    { name: 'Japan Airlines', code: 'JL' }
  ],
  routes: [
    { origin: 'SFO', destination: 'NRT' },
    { origin: 'SFO', destination: 'HNL' }
  ],
  flights: [/* 10+ sample flights */]
}
```

---

## Docker Setup (Exam Required)

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "4200:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/tripma
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

---

## Important Rules

### Frontend Rules
1. **Phase 1: Mock data** - No real API calls until backend ready
2. **Each spec < 400 lines** - split if larger
3. **Follow Figma exactly** - check `frontend/design/`
4. **Standalone components** - Angular 17+ style
5. **SCSS for styles** - not CSS
6. **Role-based guards** - Protect airline/admin routes

### Backend Rules
1. **TypeScript strict mode** - No `any` types
2. **Environment variables** - API keys in `.env`, never commit
3. **Error handling** - Consistent error responses
4. **Validation** - Validate all inputs (express-validator)
5. **Auth middleware** - Protect routes with JWT
6. **Role guards** - Check user role for airline/admin endpoints
7. **Seed data** - Auto-create test data on first run

### General Rules
1. **English only** - all code and comments
2. **Docker** - All services containerized
3. **Specs first** - Always create spec before implementation

---

## Recent Changes
- 012-admin-panel: Added TypeScript 5.x with Angular 17+ + Angular 17+ (standalone components), RxJS, Angular Router, ng2-charts (Chart.js)

- 010-auth: Tasks generated, ready for implementation
- 009-confirmation: Implemented

## Next Steps

1. `/speckit.implement` for 010-auth (son frontend spec)
2. Backend specs oluşturma (INFRA-001, BE-001, etc.)
3. 011-airline-dashboard ve 012-admin-panel specleri

## Active Technologies
- TypeScript 5.x with Angular 17+ + Angular 17+ (standalone components), RxJS, Angular Router, ng2-charts (Chart.js) (012-admin-panel)
- localStorage (mock data persistence, consistent with existing auth/airline patterns) (012-admin-panel)
