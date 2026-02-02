# Flight Booking Application - Master Specification

> **Course:** Tecnologie e Applicazioni Web (CT0142) - 2024/2025
> **University:** Ca' Foscari University Venice
> **Design:** [SkyRoute Figma](https://www.figma.com/community/file/911320742349428744)

## Project Summary

A flight booking SPA with REST API backend. Users can search flights, book tickets, select seats, and add extras. Airlines manage routes and view statistics. Admins manage users.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 17+ (SPA) |
| Backend | Node.js + Express.js + TypeScript |
| Database | MongoDB |
| Real-time | WebSocket (Socket.io) |
| Container | Docker (3 containers) |

## User Roles

| Role | Registration | Capabilities |
|------|--------------|--------------|
| Anonymous | - | Search flights only |
| Passenger | Self-register | Book flights, select seats, manage bookings |
| Airline | Admin invitation | Manage routes, flights, view statistics |
| Admin | Programmatic (first run) | Invite airlines, delete users |

---

## Frontend Specs (001-099)

### Public Pages
| Spec ID | Page | Description | Priority |
|---------|------|-------------|----------|
| 001 | Landing Page | Hero, search form, featured destinations | P0 |
| 002 | Flight Search | Search form with date pickers, passengers | P0 |
| 003 | Search Results | Flight list, filters, sorting | P0 |
| 004 | Flight Details | Flight info, price breakdown | P0 |
| 005 | Seat Selection | Seat map, real-time availability | P0 |
| 006 | Passenger Info | Passenger details form | P0 |
| 007 | Payment | Payment form, order summary | P0 |
| 008 | Booking Confirmation | Confirmation, ticket details | P0 |

### Authentication
| Spec ID | Page | Description | Priority |
|---------|------|-------------|----------|
| 009 | Login | Email/password login | P0 |
| 010 | Register | Passenger registration | P0 |
| 011 | Password Change | First login for airlines | P1 |

### Passenger Dashboard
| Spec ID | Page | Description | Priority |
|---------|------|-------------|----------|
| 020 | My Bookings | List of bookings | P1 |
| 021 | Booking Details | Single booking view | P1 |
| 022 | Profile | Edit profile | P2 |

### Airline Dashboard
| Spec ID | Page | Description | Priority |
|---------|------|-------------|----------|
| 030 | Airline Dashboard | Overview, stats summary | P1 |
| 031 | Routes Management | CRUD routes | P1 |
| 032 | Aircraft Management | CRUD aircrafts | P1 |
| 033 | Flights Management | CRUD flights, set prices | P1 |
| 034 | Statistics | Revenue, passengers, popular routes | P1 |

### Admin Panel
| Spec ID | Page | Description | Priority |
|---------|------|-------------|----------|
| 040 | Admin Dashboard | User management | P1 |
| 041 | Invite Airline | Send invitation | P1 |

### Shared Components
| Spec ID | Component | Description | Priority |
|---------|-----------|-------------|----------|
| 050 | Header/Nav | Navigation, user menu | P0 |
| 051 | Footer | Links, info | P2 |
| 052 | Flight Card | Reusable flight display | P0 |
| 053 | Seat Map | Interactive seat grid | P0 |

---

## Backend Specs (101-199)

### Authentication API
| Spec ID | Endpoints | Description | Priority |
|---------|-----------|-------------|----------|
| 101 | Auth API | Login, register, JWT, password change | P0 |

### Flight API
| Spec ID | Endpoints | Description | Priority |
|---------|-----------|-------------|----------|
| 102 | Flights Search | Search with stops, filters | P0 |
| 103 | Flights CRUD | Create, update, delete flights | P1 |

### Booking API
| Spec ID | Endpoints | Description | Priority |
|---------|-----------|-------------|----------|
| 104 | Bookings | Create booking, seat selection | P0 |
| 105 | Payments | Process payment | P0 |

### Airline API
| Spec ID | Endpoints | Description | Priority |
|---------|-----------|-------------|----------|
| 106 | Routes | CRUD routes | P1 |
| 107 | Aircraft | CRUD aircraft | P1 |
| 108 | Statistics | Revenue, passengers, routes | P1 |

### Admin API
| Spec ID | Endpoints | Description | Priority |
|---------|-----------|-------------|----------|
| 109 | Users | List, delete users | P1 |
| 110 | Invitations | Invite airlines | P1 |

### Real-time
| Spec ID | Feature | Description | Priority |
|---------|---------|-------------|----------|
| 120 | WebSocket | Seat availability updates | P0 |

---

## Data Models

### User
```typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string; // hashed
  role: 'admin' | 'airline' | 'passenger';
  firstName: string;
  lastName: string;
  mustChangePassword: boolean; // for airlines
  createdAt: Date;
}
```

### Flight
```typescript
interface Flight {
  _id: ObjectId;
  airlineId: ObjectId;
  routeId: ObjectId;
  aircraftId: ObjectId;
  departureTime: Date;
  arrivalTime: Date;
  prices: {
    economy: number;
    business: number;
    firstClass: number;
  };
  status: 'scheduled' | 'cancelled';
}
```

### Route
```typescript
interface Route {
  _id: ObjectId;
  airlineId: ObjectId;
  departureCity: string;
  departureAirport: string; // IATA code
  arrivalCity: string;
  arrivalAirport: string;
}
```

### Booking
```typescript
interface Booking {
  _id: ObjectId;
  userId: ObjectId;
  flights: BookedFlight[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

interface BookedFlight {
  flightId: ObjectId;
  passengers: BookedPassenger[];
}

interface BookedPassenger {
  firstName: string;
  lastName: string;
  seatNumber: string;
  ticketClass: 'economy' | 'business' | 'firstClass';
  extras: string[]; // 'extraBaggage', 'extraLegroom'
}
```

---

## Implementation Order

### Phase 1: Core Booking Flow (P0)
1. SPEC-050: Header/Nav
2. SPEC-001: Landing Page
3. SPEC-002: Flight Search
4. SPEC-003: Search Results
5. SPEC-052: Flight Card
6. SPEC-004: Flight Details
7. SPEC-053: Seat Map
8. SPEC-005: Seat Selection
9. SPEC-006: Passenger Info
10. SPEC-007: Payment
11. SPEC-008: Booking Confirmation
12. SPEC-009: Login
13. SPEC-010: Register

### Phase 2: Backend APIs (P0)
14. SPEC-101: Auth API
15. SPEC-102: Flights Search API
16. SPEC-104: Bookings API
17. SPEC-105: Payments API
18. SPEC-120: WebSocket

### Phase 3: Dashboards (P1)
19. SPEC-020-022: Passenger Dashboard
20. SPEC-030-034: Airline Dashboard
21. SPEC-040-041: Admin Panel
22. SPEC-103, 106-110: Remaining APIs

---

## Constraints

- Each spec: **max 400 lines of code**
- Frontend implements with **mock data** first
- Backend API connects after frontend is ready
- All UI must match **Figma design**
- **Real-time** seat updates via WebSocket
- **Docker** required for deployment
