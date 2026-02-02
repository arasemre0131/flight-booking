# SkyRoute - Flight Booking Web Application

**Course:** Tecnologie e Applicazioni Web 2024/2025
**University:** Ca' Foscari University of Venice
**Project:** Flight Booking System

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Data Model](#2-data-model)
3. [REST API Documentation](#3-rest-api-documentation)
4. [Authentication System](#4-authentication-system)
5. [Angular Frontend](#5-angular-frontend)
6. [Application Workflows](#6-application-workflows)
7. [Real-time Features](#7-real-time-features)
8. [Docker Configuration](#8-docker-configuration)

---

## 1. System Architecture

### Overview

SkyRoute is a full-stack flight booking application built with a modern three-tier architecture, running in separate Docker containers.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND CONTAINER                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Angular 17+ SPA                        │  │
│  │  • Standalone Components                                  │  │
│  │  • Signals for State Management                          │  │
│  │  • Lazy-loaded Routes                                    │  │
│  │  • Socket.io Client (Real-time)                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                         Nginx (Port 80)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                    HTTP REST API / WebSocket
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND CONTAINER                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                 Node.js + Express.js                      │  │
│  │  • TypeScript                                            │  │
│  │  • JWT Authentication                                    │  │
│  │  • REST API Routes                                       │  │
│  │  • Socket.io Server (Real-time)                          │  │
│  │  • Mongoose ODM                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                        Express (Port 3000)                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                          MongoDB Driver
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE CONTAINER                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      MongoDB 7.0                          │  │
│  │  • Document-based Storage                                │  │
│  │  • Collections: Users, Airlines, Routes, Aircraft,       │  │
│  │                 Flights, Bookings, Tickets               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                         MongoDB (Port 27017)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Angular 17+ | Single Page Application |
| Frontend | TypeScript | Type-safe JavaScript |
| Frontend | SCSS | Styling with variables |
| Frontend | Socket.io-client | Real-time updates |
| Backend | Node.js 20 | JavaScript runtime |
| Backend | Express.js | HTTP routing framework |
| Backend | TypeScript | Type-safe backend code |
| Backend | Socket.io | WebSocket server |
| Backend | Mongoose | MongoDB ODM |
| Database | MongoDB 7.0 | NoSQL document database |
| Auth | JWT | Stateless authentication |
| Container | Docker | Containerization |
| Container | Docker Compose | Multi-container orchestration |

### Component Interaction

1. **User Request Flow:**
   - User interacts with Angular SPA in browser
   - Angular makes HTTP requests to Express REST API
   - Express validates request and queries MongoDB via Mongoose
   - Response flows back through the same path

2. **Real-time Flow:**
   - Angular connects to Socket.io server on backend
   - When booking is confirmed, backend emits `seatsBooked` event
   - All connected clients receive update and refresh seat map

---

## 2. Data Model

### MongoDB Collections

#### 2.1 Users Collection

Stores all user accounts (passengers, airlines, admins).

```javascript
{
  _id: ObjectId,
  email: String,           // Unique, lowercase
  password: String,        // bcrypt hashed, select: false
  firstName: String,
  lastName: String,
  role: "passenger" | "airline" | "admin",
  airlineId: ObjectId,     // Reference to Airlines (for airline users)
  mustChangePassword: Boolean,  // Force password change on first login
  status: "active" | "inactive",
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `{ email: 1, status: 1 }`

#### 2.2 Airlines Collection

Stores airline company information.

```javascript
{
  _id: ObjectId,
  name: String,            // "Hawaiian Airlines"
  code: String,            // "HA" (2-letter IATA code)
  contactEmail: String,
  contactPhone: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2.3 Aircraft Collection

Stores aircraft information with seat configuration.

```javascript
{
  _id: ObjectId,
  airlineId: ObjectId,     // Reference to Airlines
  aircraftModel: String,   // "Boeing 737-800"
  registration: String,    // "N3730B"
  seatConfiguration: {
    firstClass: { rows: Number, seatsPerRow: Number },
    business: { rows: Number, seatsPerRow: Number },
    economy: { rows: Number, seatsPerRow: Number }
  },
  totalSeats: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2.4 Routes Collection

Stores flight routes between airports.

```javascript
{
  _id: ObjectId,
  airlineId: ObjectId,     // Reference to Airlines
  originAirport: String,   // "JFK" (3-letter IATA code)
  destinationAirport: String,
  flightNumber: String,    // "DL100"
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2.5 Flights Collection

Stores scheduled flights (aircraft flying a route at a specific time).

```javascript
{
  _id: ObjectId,
  airlineId: ObjectId,     // Reference to Airlines
  routeId: ObjectId,       // Reference to Routes
  aircraftId: ObjectId,    // Reference to Aircraft
  departureTime: Date,
  arrivalTime: Date,
  pricing: {
    economy: Number,       // Price in USD
    business: Number,
    firstClass: Number
  },
  status: "scheduled" | "boarding" | "departed" | "arrived" | "cancelled",
  createdAt: Date,
  updatedAt: Date
}
```

#### 2.6 Bookings Collection

Stores booking records with passenger and payment information.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // Reference to Users (who made booking)
  flightId: ObjectId,      // Reference to Flights
  passengers: [{
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dateOfBirth: Date,
    passportNumber: String
  }],
  ticketClass: "economy" | "business" | "firstClass",
  extras: {
    additionalBaggage: Number,  // 0-5 extra bags
    extraLegroom: Boolean
  },
  totalPrice: Number,
  status: "pending" | "confirmed" | "cancelled",
  paymentDetails: {
    paymentMethod: "card",
    last4: String,         // Last 4 digits of card
    paidAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 2.7 Tickets Collection

Stores individual tickets with seat assignments.

```javascript
{
  _id: ObjectId,
  bookingId: ObjectId,     // Reference to Bookings
  flightId: ObjectId,      // Reference to Flights
  passengerIndex: Number,  // Index in booking.passengers array
  seatNumber: String,      // "12A"
  ticketClass: "economy" | "business" | "firstClass",
  ticketNumber: String,    // "TKT-ABC123"
  status: "active" | "used" | "cancelled",
  createdAt: Date,
  updatedAt: Date
}
```

### Entity Relationships Diagram

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│  Users   │       │ Airlines │       │ Aircraft │
└────┬─────┘       └────┬─────┘       └────┬─────┘
     │                  │                   │
     │ airlineId        │                   │ airlineId
     └──────────────────┼───────────────────┘
                        │
                        ▼
                  ┌──────────┐
                  │  Routes  │
                  └────┬─────┘
                       │
                       │ routeId, aircraftId, airlineId
                       ▼
                  ┌──────────┐
                  │ Flights  │
                  └────┬─────┘
                       │
                       │ flightId
                       ▼
                  ┌──────────┐
                  │ Bookings │◄──── userId (Users)
                  └────┬─────┘
                       │
                       │ bookingId, flightId
                       ▼
                  ┌──────────┐
                  │ Tickets  │
                  └──────────┘
```

---

## 3. REST API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Header

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

### 3.1 Authentication Endpoints

#### POST /api/auth/register

Register a new passenger account.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "passenger",
    "status": "active",
    "mustChangePassword": false
  }
}
```

#### POST /api/auth/login

Login with email and password.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "passenger",
    "status": "active",
    "airlineId": null,
    "mustChangePassword": false
  }
}
```

#### PUT /api/auth/change-password

Change user password. For airline first login, `currentPassword` can be empty.

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

### 3.2 Flight Search Endpoints

#### GET /api/flights/search

Search for available flights. **No authentication required.**

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| origin | string | Yes | 3-letter airport code (e.g., "JFK") |
| destination | string | Yes | 3-letter airport code |
| date | string | Yes | Date in YYYY-MM-DD format |
| passengers | number | No | Number of passengers (1-9, default: 1) |
| class | string | No | "economy" or "business" (default: "economy") |
| sortBy | string | No | "price", "duration", or "stops" |
| sortOrder | string | No | "asc" or "desc" |

**Example Request:**
```
GET /api/flights/search?origin=JFK&destination=LAX&date=2025-06-15&passengers=2&class=economy&sortBy=price&sortOrder=asc
```

**Response (200):**
```json
{
  "results": [
    {
      "type": "direct",
      "pricePerPerson": 249,
      "totalDuration": 345,
      "stops": 0,
      "flights": [
        {
          "flightId": "507f1f77bcf86cd799439011",
          "flightNumber": "DL100",
          "airline": {
            "id": "507f1f77bcf86cd799439012",
            "name": "Delta Air Lines",
            "code": "DL"
          },
          "origin": { "code": "JFK", "city": "New York" },
          "destination": { "code": "LAX", "city": "Los Angeles" },
          "departureTime": "2025-06-15T10:30:00.000Z",
          "arrivalTime": "2025-06-15T16:15:00.000Z",
          "duration": 345,
          "price": 249,
          "aircraft": { "model": "Boeing 737-800", "seatConfig": "4-6" },
          "availableSeats": { "economy": 142, "business": 10 }
        }
      ]
    },
    {
      "type": "connecting",
      "pricePerPerson": 199,
      "totalDuration": 480,
      "stops": 1,
      "layover": {
        "airport": "ORD",
        "city": "Chicago",
        "duration": 135
      },
      "flights": [
        {
          "flightId": "507f1f77bcf86cd799439013",
          "flightNumber": "UA400",
          "airline": { "id": "...", "name": "United Airlines", "code": "UA" },
          "origin": { "code": "JFK", "city": "New York" },
          "destination": { "code": "ORD", "city": "Chicago" },
          "departureTime": "2025-06-15T07:00:00.000Z",
          "arrivalTime": "2025-06-15T09:00:00.000Z",
          "duration": 120,
          "price": 99,
          "aircraft": { "model": "Boeing 777-300ER", "seatConfig": "4-6" },
          "availableSeats": { "economy": 180, "business": 20 }
        },
        {
          "flightId": "507f1f77bcf86cd799439014",
          "flightNumber": "UA500",
          "airline": { "id": "...", "name": "United Airlines", "code": "UA" },
          "origin": { "code": "ORD", "city": "Chicago" },
          "destination": { "code": "LAX", "city": "Los Angeles" },
          "departureTime": "2025-06-15T11:15:00.000Z",
          "arrivalTime": "2025-06-15T15:00:00.000Z",
          "duration": 225,
          "price": 100,
          "aircraft": { "model": "Airbus A321neo", "seatConfig": "4-6" },
          "availableSeats": { "economy": 156, "business": 14 }
        }
      ]
    }
  ],
  "searchParams": {
    "origin": "JFK",
    "destination": "LAX",
    "date": "2025-06-15",
    "passengers": 2,
    "class": "economy",
    "sortBy": "price",
    "sortOrder": "asc"
  }
}
```

#### GET /api/flights/:id/seats

Get seat map for a specific flight.

**Response (200):**
```json
{
  "flightId": "507f1f77bcf86cd799439011",
  "aircraft": {
    "model": "Boeing 737-800",
    "seatConfig": "4-6"
  },
  "seats": [
    {
      "seatNumber": "1A",
      "row": 1,
      "column": "A",
      "class": "business",
      "isAvailable": true,
      "hasExtraLegroom": true,
      "price": 99
    },
    {
      "seatNumber": "12A",
      "row": 12,
      "column": "A",
      "class": "economy",
      "isAvailable": false,
      "hasExtraLegroom": true,
      "price": 50
    }
  ]
}
```

---

### 3.3 Booking Endpoints

#### POST /api/bookings

Create a new booking. **Requires authentication.**

**Request:**
```json
{
  "flightId": "507f1f77bcf86cd799439011",
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1-555-123-4567",
      "dateOfBirth": "1990-05-15",
      "passportNumber": "AB1234567"
    }
  ],
  "ticketClass": "economy",
  "extras": {
    "additionalBaggage": 1,
    "extraLegroom": false
  }
}
```

**Response (201):**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "507f1f77bcf86cd799439015",
    "status": "pending",
    "totalPrice": 284,
    "passengers": 1,
    "expiresIn": "15 minutes"
  }
}
```

#### POST /api/bookings/:id/seats

Select seats for a booking.

**Request:**
```json
{
  "assignments": [
    { "passengerIndex": 0, "seatNumber": "12A" }
  ]
}
```

**Response (200):**
```json
{
  "message": "Seats selected successfully",
  "booking": {
    "id": "507f1f77bcf86cd799439015",
    "status": "pending",
    "totalPrice": 334
  }
}
```

#### POST /api/bookings/:id/confirm

Confirm booking with payment.

**Request:**
```json
{
  "paymentMethod": "card",
  "cardDetails": {
    "number": "4111111111111111",
    "expiry": "12/25",
    "cvv": "123",
    "name": "John Doe"
  }
}
```

**Response (200):**
```json
{
  "message": "Booking confirmed successfully",
  "booking": {
    "id": "507f1f77bcf86cd799439015",
    "status": "confirmed",
    "totalPrice": 334
  },
  "tickets": [
    "TKT-ABC123"
  ]
}
```

#### GET /api/bookings

Get user's bookings.

**Response (200):**
```json
{
  "bookings": [
    {
      "id": "507f1f77bcf86cd799439015",
      "flightNumber": "DL100",
      "origin": "JFK",
      "destination": "LAX",
      "departureTime": "2025-06-15T10:30:00.000Z",
      "passengers": 1,
      "status": "confirmed",
      "totalPrice": 334
    }
  ]
}
```

#### DELETE /api/bookings/:id

Cancel a booking.

**Response (200):**
```json
{
  "message": "Booking cancelled successfully",
  "booking": {
    "id": "507f1f77bcf86cd799439015",
    "status": "cancelled"
  }
}
```

---

### 3.4 Admin Endpoints

#### GET /api/admin/users

Get all users. **Admin only.**

**Response (200):**
```json
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "passenger",
      "status": "active",
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/admin/airlines

Create a new airline with operator account. **Admin only.**

**Request:**
```json
{
  "airline": {
    "name": "Turkish Airlines",
    "code": "TK",
    "contactEmail": "contact@turkishairlines.com",
    "contactPhone": "+90-212-444-0849"
  },
  "operator": {
    "email": "operator@turkishairlines.com",
    "firstName": "Operator",
    "lastName": "TK",
    "temporaryPassword": "temp123456"
  }
}
```

**Response (201):**
```json
{
  "message": "Airline created successfully",
  "airline": {
    "id": "507f1f77bcf86cd799439020",
    "name": "Turkish Airlines",
    "code": "TK"
  },
  "operator": {
    "id": "507f1f77bcf86cd799439021",
    "email": "operator@turkishairlines.com",
    "mustChangePassword": true
  }
}
```

#### DELETE /api/admin/users/:id

Delete a user. **Admin only.**

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

### 3.5 Airline Endpoints

All airline endpoints require authentication with `role: "airline"`.

#### GET /api/airline/routes

Get airline's routes.

#### POST /api/airline/routes

Create a new route.

**Request:**
```json
{
  "originAirport": "IST",
  "destinationAirport": "JFK",
  "flightNumber": "TK1"
}
```

#### GET /api/airline/aircraft

Get airline's aircraft.

#### POST /api/airline/aircraft

Create a new aircraft.

**Request:**
```json
{
  "aircraftModel": "Boeing 787-9",
  "registration": "TC-LLA",
  "seatConfiguration": {
    "firstClass": { "rows": 2, "seatsPerRow": 2 },
    "business": { "rows": 5, "seatsPerRow": 4 },
    "economy": { "rows": 30, "seatsPerRow": 6 }
  }
}
```

#### GET /api/airline/flights

Get airline's flights.

#### POST /api/airline/flights

Create a new flight.

**Request:**
```json
{
  "routeId": "507f1f77bcf86cd799439030",
  "aircraftId": "507f1f77bcf86cd799439031",
  "departureTime": "2025-06-15T08:00:00.000Z",
  "arrivalTime": "2025-06-15T14:00:00.000Z",
  "pricing": {
    "economy": 450,
    "business": 1200,
    "firstClass": 2500
  }
}
```

#### PUT /api/airline/flights/:id/pricing

Update flight pricing.

**Request:**
```json
{
  "economy": 399,
  "business": 999,
  "firstClass": 2199
}
```

#### GET /api/airline/statistics

Get airline statistics.

**Response (200):**
```json
{
  "totalPassengers": 1542,
  "totalRevenue": 385000,
  "flightCount": 28,
  "averageLoadFactor": 0.78,
  "topRoutes": [
    {
      "origin": "IST",
      "destination": "JFK",
      "passengers": 456,
      "revenue": 125000
    }
  ],
  "revenueByClass": {
    "economy": 180000,
    "business": 145000,
    "firstClass": 60000
  }
}
```

---

## 4. Authentication System

### JWT Authentication Flow

```
┌─────────┐                    ┌─────────┐                    ┌─────────┐
│ Client  │                    │ Backend │                    │ MongoDB │
└────┬────┘                    └────┬────┘                    └────┬────┘
     │                              │                              │
     │  POST /api/auth/login        │                              │
     │  {email, password}           │                              │
     │─────────────────────────────>│                              │
     │                              │                              │
     │                              │  Find user by email          │
     │                              │─────────────────────────────>│
     │                              │                              │
     │                              │  User document               │
     │                              │<─────────────────────────────│
     │                              │                              │
     │                              │  Compare password (bcrypt)   │
     │                              │                              │
     │                              │  Generate JWT token          │
     │                              │                              │
     │  {token, user}               │                              │
     │<─────────────────────────────│                              │
     │                              │                              │
     │  Store token (localStorage)  │                              │
     │                              │                              │
     │  GET /api/bookings           │                              │
     │  Authorization: Bearer <jwt> │                              │
     │─────────────────────────────>│                              │
     │                              │                              │
     │                              │  Verify JWT signature        │
     │                              │  Extract userId from payload │
     │                              │                              │
     │                              │  Query with userId           │
     │                              │─────────────────────────────>│
     │                              │                              │
     │  {bookings: [...]}           │                              │
     │<─────────────────────────────│                              │
```

### JWT Token Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "role": "passenger",
  "iat": 1704067200,
  "exp": 1704153600
}
```

**Signature:** HMACSHA256 with secret key

### Password Security

- Passwords are hashed using **bcrypt** with salt rounds = 10
- Original password is never stored
- Password comparison uses constant-time comparison to prevent timing attacks

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| `passenger` | Search flights, create bookings, view own bookings |
| `airline` | Manage own routes, aircraft, flights, view statistics |
| `admin` | Manage all users, create airlines, full system access |

### Middleware Implementation

```typescript
// auth.middleware.ts
export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// role.middleware.ts
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### Airline First Login Flow

When admin creates an airline, the operator account has `mustChangePassword: true`:

1. Airline operator logs in with temporary password
2. Backend returns `mustChangePassword: true` in response
3. Frontend redirects to `/change-password` page
4. User enters new password (no current password required)
5. Backend updates password and sets `mustChangePassword: false`
6. User is redirected to airline dashboard

---

## 5. Angular Frontend

### Project Structure

```
frontend/src/app/
├── components/              # Reusable UI components
│   ├── booking-summary/
│   ├── filter-bar/
│   ├── flight-card/
│   ├── flight-summary/
│   ├── header/
│   ├── footer/
│   ├── passenger-seat-list/
│   ├── search-form/
│   ├── seat-legend/
│   ├── seat-map/
│   └── sidebar-content/
├── guards/                  # Route guards
│   ├── admin.guard.ts
│   └── airline.guard.ts
├── models/                  # TypeScript interfaces
│   ├── airport.model.ts
│   ├── auth.model.ts
│   ├── booking.model.ts
│   ├── flight.model.ts
│   ├── passenger.model.ts
│   ├── payment.model.ts
│   ├── search-criteria.model.ts
│   └── seat.model.ts
├── pages/                   # Page components
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── airlines/
│   │   ├── users-list/
│   │   └── statistics/
│   ├── airline/
│   │   ├── dashboard/
│   │   ├── aircraft/
│   │   ├── flights/
│   │   ├── routes/
│   │   └── statistics/
│   ├── change-password/
│   ├── confirmation/
│   ├── landing/
│   ├── login/
│   ├── passenger-info/
│   ├── payment/
│   ├── register/
│   ├── search-results/
│   └── seat-selection/
├── services/                # Angular services
│   ├── admin.service.ts
│   ├── airline.service.ts
│   ├── airport.service.ts
│   ├── auth.service.ts
│   ├── booking.service.ts
│   ├── payment.service.ts
│   └── socket.service.ts
└── mock-data/               # Mock data for development
    ├── airports.data.ts
    ├── flights.data.ts
    └── seat-map.data.ts
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `HeaderComponent` | Navigation bar with auth state |
| `SearchFormComponent` | Flight search form with autocomplete |
| `FlightCard` | Display flight option in search results |
| `SeatMapComponent` | Interactive aircraft seat map |
| `SeatLegend` | Seat type legend with pricing |
| `BookingSummary` | Order summary with pricing breakdown |

### Key Services

| Service | Purpose |
|---------|---------|
| `AuthService` | Login, register, JWT management |
| `BookingService` | Booking flow, flight search, price calculation |
| `SocketService` | WebSocket connection for real-time updates |
| `AirportService` | Airport data and autocomplete |
| `AirlineService` | Airline dashboard operations |
| `AdminService` | Admin panel operations |

### Routes Configuration

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing.component') },
  { path: 'search', loadComponent: () => import('./pages/search-results/search-results') },
  { path: 'login', loadComponent: () => import('./pages/login/login') },
  { path: 'register', loadComponent: () => import('./pages/register/register') },
  { path: 'change-password', loadComponent: () => import('./pages/change-password/change-password') },
  { path: 'passenger-info', loadComponent: () => import('./pages/passenger-info/passenger-info') },
  { path: 'seat-selection', loadComponent: () => import('./pages/seat-selection/seat-selection') },
  { path: 'payment', loadComponent: () => import('./pages/payment/payment') },
  { path: 'confirmation', loadComponent: () => import('./pages/confirmation/confirmation') },
  {
    path: 'airline',
    loadChildren: () => import('./pages/airline/airline.routes'),
    canActivate: [airlineGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.routes'),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '' }
];
```

### State Management with Signals

Angular 17+ Signals are used for reactive state management:

```typescript
// booking.service.ts
@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookingDraft = signal<BookingDraft | null>(null);

  // Public readonly signals
  readonly bookingDraft = this._bookingDraft.asReadonly();
  readonly selectedFlight = computed(() => this._bookingDraft()?.selectedFlight ?? null);
  readonly totalPrice = computed(() => this._bookingDraft()?.totalPrice ?? 0);

  // Update methods
  initializeBooking(flight: Flight, criteria: SearchCriteria): void {
    this._bookingDraft.set({
      id: generateBookingId(),
      selectedFlight: flight,
      searchCriteria: criteria,
      passengers: [],
      totalPrice: calculateTotalPrice(flight, criteria.passengers)
    });
  }
}
```

---

## 6. Application Workflows

### 6.1 Passenger Booking Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Landing   │───>│   Search    │───>│  Passenger  │───>│    Seat     │───>│   Payment   │───>│Confirmation │
│    Page     │    │   Results   │    │    Info     │    │  Selection  │    │    Page     │    │    Page     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                  │                  │                  │                  │                  │
      │ Enter search     │ Select flight   │ Enter details   │ Choose seats    │ Enter payment    │ View ticket
      │ criteria         │                 │ for passengers  │ + extras        │ information      │ confirmation
      ▼                  ▼                  ▼                  ▼                  ▼                  ▼
  - Origin           - View direct      - First name       - Interactive     - Card number      - Confirmation #
  - Destination        and connecting   - Last name          seat map       - Expiry date      - Ticket details
  - Date               flights          - Email            - Extra baggage   - CVV              - E-ticket
  - Passengers       - Filter by        - Phone            - Price summary   - Billing address  - Trip summary
  - Trip type          price, stops,    - Passport                           - Price breakdown
                       airlines         - Date of birth
```

### 6.2 Airline Management Flow

```
┌─────────────┐    ┌─────────────┐
│    Login    │───>│  Dashboard  │
│   (Airline) │    │  Overview   │
└─────────────┘    └──────┬──────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
   ┌───────────┐    ┌───────────┐    ┌───────────┐
   │  Manage   │    │  Manage   │    │  Manage   │
   │  Routes   │    │ Aircraft  │    │  Flights  │
   └───────────┘    └───────────┘    └───────────┘
         │                │                │
         │                │                │
         ▼                ▼                ▼
   - Create route    - Register new   - Schedule flights
   - View routes       aircraft       - Set pricing
   - Deactivate      - Configure      - View bookings
                       seats          - Cancel flights
                          │
                          ▼
                    ┌───────────┐
                    │Statistics │
                    └───────────┘
                          │
                          ▼
                    - Total passengers
                    - Revenue reports
                    - Popular routes
                    - Load factors
```

### 6.3 Admin Management Flow

```
┌─────────────┐    ┌─────────────┐
│    Login    │───>│  Dashboard  │
│   (Admin)   │    │  Overview   │
└─────────────┘    └──────┬──────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
        ┌───────────┐ ┌───────────┐ ┌───────────┐
        │  Manage   │ │  Manage   │ │  System   │
        │   Users   │ │ Airlines  │ │   Stats   │
        └───────────┘ └───────────┘ └───────────┘
              │           │           │
              ▼           ▼           ▼
        - View all    - Create new  - Total users
          users         airline     - Total bookings
        - Delete      - Assign      - Revenue
          users         operator    - Growth metrics
        - View        - View all
          details       airlines
```

---

## 7. Real-time Features

### WebSocket Implementation

The application uses Socket.io for real-time seat availability updates.

### Backend Setup

```typescript
// server.ts
import { Server as SocketServer } from 'socket.io';

const httpServer = createServer(app);
export const io = new SocketServer(httpServer, {
  cors: {
    origin: ['http://localhost:4200', 'http://localhost:80'],
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  // Join flight room for real-time updates
  socket.on('joinFlight', (flightId: string) => {
    socket.join(`flight:${flightId}`);
  });

  socket.on('leaveFlight', (flightId: string) => {
    socket.leave(`flight:${flightId}`);
  });
});
```

### Emitting Seat Updates

```typescript
// booking.routes.ts (when booking is confirmed)
const { booking, tickets } = await confirmBooking(bookingId, userId, payment);

// Emit real-time update
const bookedSeats = tickets.map(t => t.seatNumber);
io.to(`flight:${booking.flightId}`).emit('seatsBooked', {
  flightId: booking.flightId,
  seats: bookedSeats
});
```

### Frontend Socket Service

```typescript
// socket.service.ts
@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;
  readonly seatUpdates = signal<SeatUpdate | null>(null);

  connect(): void {
    this.socket = io(WS_URL);

    this.socket.on('seatsBooked', (data: SeatUpdate) => {
      this.seatUpdates.set(data);
    });
  }

  joinFlight(flightId: string): void {
    this.socket?.emit('joinFlight', flightId);
  }
}
```

### Seat Selection Component

```typescript
// seat-selection.ts
export class SeatSelection implements OnInit, OnDestroy {
  private socketService = inject(SocketService);

  constructor() {
    // Listen for real-time updates
    effect(() => {
      const update = this.socketService.seatUpdates();
      if (update) {
        this.markSeatsAsOccupied(update.seats);
      }
    });
  }

  ngOnInit(): void {
    this.socketService.connect();
    this.socketService.joinFlight(this.selectedFlight().id);
  }

  ngOnDestroy(): void {
    this.socketService.leaveFlight(this.selectedFlight().id);
  }

  private markSeatsAsOccupied(seatIds: string[]): void {
    // Update seat map to show newly booked seats as occupied
    const updatedMap = /* ... */;
    this.seatMap.set(updatedMap);
  }
}
```

---

## 8. Docker Configuration

### docker-compose.yml

```yaml
services:
  # Frontend - Angular with Nginx
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "4200:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - skyroute-network

  # Backend - Node.js with Express
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/skyroute
      - JWT_SECRET=${JWT_SECRET}
      - SEED_TEST_DATA=true
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - skyroute-network

  # Database - MongoDB
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - skyroute-network

networks:
  skyroute-network:
    driver: bridge

volumes:
  mongodb_data:
    name: skyroute_mongodb_data
```

### Frontend Dockerfile

```dockerfile
# Stage 1: Build Angular app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/skyroute/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile

```dockerfile
FROM node:20-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm install typescript && npm run build && npm prune --production
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Running the Application

```bash
# Start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

### Test Accounts (Seeded on First Run)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skyroute.com | admin123 |
| Passenger | passenger@test.com | passenger123 |
| Airline (Hawaiian) | operator@hawaiianairlines.com | hawaiian123 |
| Airline (Delta) | operator@delta.com | delta123 |

---

## Appendix: Screenshots

*Note: Screenshots should be added showing:*

1. **Landing Page** - Search form with airport autocomplete
2. **Search Results** - Flight list with filters
3. **Seat Selection** - Interactive seat map
4. **Payment Page** - Payment form with booking summary
5. **Confirmation** - Booking confirmation with ticket details
6. **Admin Dashboard** - User management, airline creation
7. **Airline Dashboard** - Routes, aircraft, flights management
8. **Statistics** - Revenue charts, passenger counts

---

*Report prepared for TAW 2024/2025 Project*
