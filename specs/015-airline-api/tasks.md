# Tasks: 015-airline-api

**Feature**: Airline Management API (BE-002)
**Created**: 2026-02-01
**Total Tasks**: 16

---

## Phase 1: Setup (Models)

- [x] T001 Create Route model in /backend/src/models/route.model.ts
- [x] T002 [P] Create Aircraft model in /backend/src/models/aircraft.model.ts
- [x] T003 [P] Create Flight model in /backend/src/models/flight.model.ts

---

## Phase 2: US1 - Route Management

> Goal: Airlines can create and manage routes

- [x] T004 [US1] Create route service in /backend/src/services/route.service.ts
- [x] T005 [US1] Create airline routes in /backend/src/routes/airline.routes.ts
- [x] T006 [US1] Register airline routes in /backend/src/app.ts

**Test**:
```bash
# Create route
curl -X POST localhost:3000/api/airlines/routes \
  -H "Authorization: Bearer <airline-token>" \
  -H "Content-Type: application/json" \
  -d '{"originAirport":"SFO","destinationAirport":"NRT","flightNumber":"HA101"}'
```

---

## Phase 3: US2 - Aircraft Management

> Goal: Airlines can register aircraft

- [x] T007 [US2] Create aircraft service in /backend/src/services/aircraft.service.ts
- [x] T008 [US2] Add aircraft endpoints to /backend/src/routes/airline.routes.ts

**Test**: ✅ Passed

---

## Phase 4: US3 - Flight Management

> Goal: Airlines can create flights

- [x] T009 [US3] Create flight service in /backend/src/services/flight.service.ts
- [x] T010 [US3] Add flight endpoints to /backend/src/routes/airline.routes.ts

**Test**: ✅ Passed

---

## Phase 5: US4 - Pricing

> Goal: Airlines can set ticket prices

- [x] T011 [US4] Add pricing method to flight service in /backend/src/services/flight.service.ts
- [x] T012 [US4] Add pricing endpoint to /backend/src/routes/airline.routes.ts

**Test**: ✅ Passed

---

## Phase 6: Seed Data

> Goal: Test data for exam (deferred to BE-006)

- [ ] T013 Create airline seed data in /backend/src/seed/airline.seed.ts
- [ ] T014 Create routes seed data in /backend/src/seed/routes.seed.ts
- [ ] T015 Create flights seed data in /backend/src/seed/flights.seed.ts
- [ ] T016 Call all seeds on startup in /backend/src/server.ts

**Test**: Start server, verify airlines/routes/flights exist in database

---

## Dependencies

```
T001-T003 (Models - parallel)
    └── T004-T006 (US1: Routes)
          └── T007-T008 (US2: Aircraft)
                └── T009-T010 (US3: Flights)
                      └── T011-T012 (US4: Pricing)
                            └── T013-T016 (Seed Data)
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | T001-T003 | Models |
| 2 | T004-T006 | US1: Route Management |
| 3 | T007-T008 | US2: Aircraft Management |
| 4 | T009-T010 | US3: Flight Management |
| 5 | T011-T012 | US4: Pricing |
| 6 | T013-T016 | Seed Data |

**Total**: 16 tasks
**MVP**: T001-T006 (Models + Routes)
