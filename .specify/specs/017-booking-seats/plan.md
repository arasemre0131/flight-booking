# Implementation Plan: BE-004 Booking & Seats API

## Technical Context

| Aspect | Value |
|--------|-------|
| Tech Stack | Node.js + Express.js + TypeScript |
| Database | MongoDB with Mongoose |
| Auth Required | Yes (Passenger role) |
| Dependencies | BE-001 (Auth), BE-002 (Flight/Aircraft), BE-003 (Search) |

## Phase 0: Research

No unknowns - spec fully clarified:
- Pending booking timeout: 15 minutes ✓
- Seat locking: Database transaction ✓
- Payment: Mock implementation ✓

## Phase 1: Implementation

### Files to Create

1. **booking.model.ts** - Booking schema
   - passengerId, flightId, passengers[], class, extras, status, totalPrice
   - Status enum: pending | confirmed | cancelled
   - TTL index for pending bookings (15 min expiry)

2. **ticket.model.ts** - Ticket schema
   - bookingId, flightId, passengerIndex, seatNumber, ticketNumber, status
   - Unique index on (flightId, seatNumber) for seat locking

3. **booking.service.ts** - Business logic
   - createBooking() - Create pending booking
   - getAvailableSeats() - Query available seats
   - selectSeats() - Assign seats to booking
   - confirmBooking() - Process payment, create tickets
   - cancelBooking() - Release seats, update status
   - getUserBookings() - List user's bookings
   - cleanupExpiredBookings() - Cron job for expired pending

4. **seat.service.ts** - Seat management
   - generateSeatMap() - Create seat grid from aircraft config
   - isSeatAvailable() - Check seat availability
   - lockSeat() - Reserve seat for booking
   - releaseSeat() - Free seat on cancel/expiry

5. **booking.routes.ts** - Express router
   - POST /api/bookings
   - GET /api/flights/:flightId/seats
   - POST /api/bookings/:bookingId/seats
   - POST /api/bookings/:bookingId/confirm
   - GET /api/bookings
   - GET /api/bookings/:bookingId
   - DELETE /api/bookings/:bookingId

### Seat Availability Logic

```
Available = NOT EXISTS ticket WHERE:
  - flightId = requested flight
  - seatNumber = requested seat
  - status = 'active'
  - (booking.status = 'confirmed' OR
     (booking.status = 'pending' AND booking.createdAt > now - 15min))
```

### Pricing Calculation

```
basePrice = flight.pricing[class] * passengerCount
baggageFee = extras.additionalBaggage * 30
legroomFee = (extraLegroomSeats count) * 50
totalPrice = basePrice + baggageFee + legroomFee
```

### Ticket Number Format

`SKY-YYYY-NNNNNN` where:
- YYYY = year
- NNNNNN = sequential 6-digit number
