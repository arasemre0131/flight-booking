# Research: BE-003 Flight Search API

## Decision Log

### D1: Connecting Flight Algorithm
- **Decision**: Two-phase query (find first legs, then matching second legs)
- **Rationale**: More efficient than cartesian product of all flights
- **Alternatives**:
  - Graph-based pathfinding (overkill for max 1 stop)
  - Pre-computed connections table (unnecessary complexity)

### D2: Layover Time Validation
- **Decision**: 2-8 hour window in application layer
- **Rationale**: PDF requires min 2 hours, max 8 hours from clarification
- **Alternatives**: Database-level constraint (less flexible)

### D3: Seat Availability
- **Decision**: Calculate on-the-fly from tickets collection
- **Rationale**: Real-time accuracy, no stale cache issues
- **Alternatives**:
  - Cached seat counts (stale data risk)
  - Denormalized count on flight document (sync complexity)

### D4: Price Sorting for Connections
- **Decision**: Sort by sum of both flight prices
- **Rationale**: Total trip cost is what matters to users
- **Alternatives**: Sort by first leg only (misleading)

## No Further Research Needed
Spec fully clarified, existing models sufficient.
