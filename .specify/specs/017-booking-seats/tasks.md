# Tasks: BE-004 Booking & Seats API

## Summary
- **Total Tasks**: 12
- **Feature**: Ticket booking, seat selection, extras, payment (mock)

---

## Phase 1: Models

- [ ] T001 [P] Create Booking model with TTL index in `backend/src/models/booking.model.ts`
- [ ] T002 [P] Create Ticket model with unique seat index in `backend/src/models/ticket.model.ts`

---

## Phase 2: Services

- [ ] T003 Create seat service (generateSeatMap, isSeatAvailable) in `backend/src/services/seat.service.ts`
- [ ] T004 Create booking service (createBooking, calculatePrice) in `backend/src/services/booking.service.ts`
- [ ] T005 Add selectSeats function to `backend/src/services/booking.service.ts`
- [ ] T006 Add confirmBooking with ticket generation to `backend/src/services/booking.service.ts`
- [ ] T007 Add cancelBooking, getUserBookings, getBookingById to `backend/src/services/booking.service.ts`

---

## Phase 3: Routes

- [ ] T008 Create booking routes (POST /bookings, GET /bookings) in `backend/src/routes/booking.routes.ts`
- [ ] T009 Add seat routes (GET /flights/:id/seats, POST /bookings/:id/seats) to `backend/src/routes/booking.routes.ts`
- [ ] T010 Add confirm and cancel routes (POST /bookings/:id/confirm, DELETE /bookings/:id) to `backend/src/routes/booking.routes.ts`

---

## Phase 4: Integration

- [ ] T011 Register booking routes in `backend/src/app.ts`
- [ ] T012 Update search.service.ts to use Ticket model for real seat availability in `backend/src/services/search.service.ts`

---

## Task Details

### T001: Booking Model
```typescript
interface IBooking {
  userId: ObjectId;
  flightId: ObjectId;
  passengers: [{
    firstName, lastName, email, phone, dateOfBirth, passportNumber
  }];
  class: 'economy' | 'business';
  extras: { additionalBaggage: number, extraLegroom: boolean };
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt, updatedAt;
}
// TTL index: { createdAt: 1 }, { expireAfterSeconds: 900, partialFilterExpression: { status: 'pending' } }
```

### T002: Ticket Model
```typescript
interface ITicket {
  bookingId: ObjectId;
  flightId: ObjectId;
  passengerIndex: number;
  seatNumber: string;
  ticketNumber: string; // SKY-2025-000001
  status: 'active' | 'cancelled';
  createdAt;
}
// Unique index: { flightId: 1, seatNumber: 1 } where status = 'active'
```

### T003: Seat Service
```typescript
// generateSeatMap(aircraft) → returns array of seats with row/column/class/legroom
// isSeatAvailable(flightId, seatNumber) → check Ticket collection
// getAvailableSeats(flightId) → full seat map with availability
```

### T004-T007: Booking Service
```typescript
// createBooking(userId, data) → validate flight, calculate price, save pending
// selectSeats(bookingId, assignments) → validate availability, create tickets
// confirmBooking(bookingId, payment) → update status, finalize tickets
// cancelBooking(bookingId) → release seats, update status
// getUserBookings(userId) → list with flight details
// getBookingById(bookingId) → full details
```

### T012: Update Search Service
```typescript
// In getAvailableSeats():
// - Query Ticket collection for booked seats
// - Return aircraft.capacity - bookedSeats
```

---

## Verification

After all tasks complete:
```bash
# 1. Create booking
curl -X POST http://localhost:3000/api/bookings -H "Authorization: Bearer {token}" ...

# 2. Get seats
curl http://localhost:3000/api/flights/{id}/seats

# 3. Select seats
curl -X POST http://localhost:3000/api/bookings/{id}/seats ...

# 4. Confirm
curl -X POST http://localhost:3000/api/bookings/{id}/confirm ...

# 5. Verify seat now unavailable
curl http://localhost:3000/api/flights/{id}/seats
```
