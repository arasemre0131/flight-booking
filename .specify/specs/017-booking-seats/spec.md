# BE-004: Booking & Seats API

## Overview
API endpoints for ticket booking, seat selection, and extras management. Requires passenger authentication.

## PDF Requirements Reference
- "Passengers can buy tickets for different flights. During the purchase, some extras can be selected such as additional baggage or extra legroom"
- "Passengers can select their seat during the purchase"
- "The system must provide users with real-time seat availability for each flight. The number of available seats must be updated automatically as soon as a ticket is purchased"

## Functional Requirements

### FR-001: Create Booking
- **Endpoint**: `POST /api/bookings`
- **Auth**: Passenger only
- **Timeout**: Pending bookings expire after 15 minutes (seats released automatically)
- **Body**:
  ```json
  {
    "flightId": "...",
    "passengers": [
      {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "dateOfBirth": "1990-01-15",
        "passportNumber": "AB123456"
      }
    ],
    "class": "economy",
    "extras": {
      "additionalBaggage": 1,
      "extraLegroom": false
    }
  }
  ```
- Creates booking with status "pending"
- Returns bookingId for seat selection

### FR-002: Get Available Seats
- **Endpoint**: `GET /api/flights/:flightId/seats`
- **Auth**: None (public for display), Passenger (for booking)
- **Response**:
  ```json
  {
    "flightId": "...",
    "aircraft": { "model": "Boeing 737", "seatConfig": "3-3" },
    "seats": [
      { "seatNumber": "1A", "class": "business", "isAvailable": true, "hasExtraLegroom": true, "price": 50 },
      { "seatNumber": "1B", "class": "business", "isAvailable": false, "hasExtraLegroom": true, "price": 50 },
      ...
    ]
  }
  ```

### FR-003: Select Seats
- **Endpoint**: `POST /api/bookings/:bookingId/seats`
- **Auth**: Passenger (booking owner)
- **Body**:
  ```json
  {
    "seatAssignments": [
      { "passengerIndex": 0, "seatNumber": "12A" },
      { "passengerIndex": 1, "seatNumber": "12B" }
    ]
  }
  ```
- Validates seats are available
- Locks seats for this booking
- Returns updated booking

### FR-004: Confirm Booking (Payment)
- **Endpoint**: `POST /api/bookings/:bookingId/confirm`
- **Auth**: Passenger (booking owner)
- **Body**:
  ```json
  {
    "paymentMethod": "card",
    "cardDetails": {
      "number": "4111111111111111",
      "expiry": "12/26",
      "cvv": "123",
      "name": "John Doe"
    }
  }
  ```
- Validates all passengers have seats
- Processes payment (mock)
- Updates booking status to "confirmed"
- Updates seat availability (real-time)
- Returns confirmation with ticket numbers

### FR-005: Get User Bookings
- **Endpoint**: `GET /api/bookings`
- **Auth**: Passenger
- Returns all bookings for authenticated user

### FR-006: Get Booking Details
- **Endpoint**: `GET /api/bookings/:bookingId`
- **Auth**: Passenger (owner) or Admin
- Returns full booking details with seats and payment status

### FR-007: Cancel Booking
- **Endpoint**: `DELETE /api/bookings/:bookingId`
- **Auth**: Passenger (owner)
- Only allowed if status is "pending" or within 24h of "confirmed"
- Releases seats back to available
- Updates booking status to "cancelled"

## Data Models

### Booking
```
- _id
- passengerId (ref: User)
- flightId (ref: Flight)
- passengers: [{ firstName, lastName, email, phone, dateOfBirth, passportNumber }]
- class: "economy" | "business"
- extras: { additionalBaggage: number, extraLegroom: boolean }
- status: "pending" | "confirmed" | "cancelled"
- totalPrice: number
- createdAt, updatedAt
```

### Ticket
```
- _id
- bookingId (ref: Booking)
- flightId (ref: Flight)
- passengerIndex: number
- seatNumber: string
- ticketNumber: string (unique, e.g., "SKY-2025-001234")
- status: "active" | "cancelled"
- createdAt
```

## Pricing Logic
- Base price from Flight.pricing[class]
- Additional baggage: $30 per bag
- Extra legroom seat: +$50 per seat
- Total = (basePrice * passengers) + (baggage * $30) + (legroom seats * $50)

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `backend/src/models/booking.model.ts` | Create | Booking schema |
| `backend/src/models/ticket.model.ts` | Create | Ticket schema |
| `backend/src/services/booking.service.ts` | Create | Booking logic |
| `backend/src/services/seat.service.ts` | Create | Seat availability |
| `backend/src/routes/booking.routes.ts` | Create | Booking endpoints |
| `backend/src/app.ts` | Modify | Add booking routes |

## Clarifications

### Session 2026-02-01
- Q: Pending booking timeout? → A: 15 minutes (seats auto-released)

## Dependencies
- Requires: BE-001 (User auth), BE-002 (Flight model), BE-003 (Search - for flight lookup)

## Test Scenarios
1. Create booking with 2 passengers
2. Get available seats for flight
3. Select seats for booking
4. Confirm booking with payment
5. View user's bookings
6. Cancel pending booking
7. Attempt to book already-taken seat → 400 error
8. Attempt to confirm without seats → 400 error
