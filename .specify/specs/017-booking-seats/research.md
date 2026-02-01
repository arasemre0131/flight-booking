# Research: BE-004 Booking & Seats API

## Decision Log

### D1: Seat Locking Strategy
- **Decision**: Optimistic locking with unique index on (flightId, seatNumber)
- **Rationale**: Simple, database-enforced, handles race conditions automatically
- **Alternatives**:
  - Pessimistic locking (complex, overkill for this scale)
  - Redis distributed lock (unnecessary infrastructure)

### D2: Pending Booking Expiry
- **Decision**: MongoDB TTL index + cleanup cron job
- **Rationale**: TTL handles automatic cleanup, cron as backup
- **Alternatives**:
  - Manual cleanup only (risk of orphaned bookings)
  - Event-driven expiry (complex for simple use case)

### D3: Payment Processing
- **Decision**: Mock implementation (always succeeds)
- **Rationale**: Real payment not in PDF requirements, focus on booking flow
- **Alternatives**:
  - Stripe integration (out of scope)
  - PayPal (out of scope)

### D4: Seat Map Generation
- **Decision**: Generate dynamically from Aircraft.seatConfiguration
- **Rationale**: No need to store individual seats, derived from config
- **Alternatives**:
  - Pre-populated seats collection (unnecessary storage)

### D5: Ticket Number Generation
- **Decision**: Sequential counter with year prefix (SKY-2025-000001)
- **Rationale**: Simple, readable, unique
- **Alternatives**:
  - UUID (not user-friendly)
  - Random alphanumeric (collision risk)

## No Further Research Needed
All decisions made, ready for implementation.
