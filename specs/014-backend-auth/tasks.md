# Tasks: 014-backend-auth

**Feature**: Backend Authentication
**Created**: 2026-02-01
**Total Tasks**: 18

---

## Phase 1: Setup (Models & Utils)

- [x] T001 Create User model in /backend/src/models/user.model.ts
- [x] T002 [P] Create Airline model in /backend/src/models/airline.model.ts
- [x] T003 [P] Create JWT utility in /backend/src/utils/jwt.util.ts
- [x] T004 [P] Create password utility in /backend/src/utils/password.util.ts

---

## Phase 2: Middleware

- [x] T005 Create auth middleware (JWT verify) in /backend/src/middleware/auth.middleware.ts
- [x] T006 [P] Create role middleware in /backend/src/middleware/role.middleware.ts

---

## Phase 3: US1+US2 - Registration & Login

- [x] T007 [US1] Create auth service in /backend/src/services/auth.service.ts
- [x] T008 [US1] Create auth routes in /backend/src/routes/auth.routes.ts
- [x] T009 [US1] Register routes in /backend/src/app.ts

**Test**:
```bash
# Register
curl -X POST localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

---

## Phase 4: US3 - Admin Seed

- [x] T010 [US3] Create admin seed in /backend/src/seed/admin.seed.ts
- [x] T011 [US3] Call seed on startup in /backend/src/server.ts

**Test**: Start server, login as admin@tripma.com / admin123 ✅

---

## Phase 5: US4 - Airline Invitation

- [x] T012 [US4] Add invite-airline to user service in /backend/src/services/user.service.ts
- [x] T013 [US4] Create admin routes in /backend/src/routes/admin.routes.ts
- [x] T014 [US4] Register admin routes in /backend/src/app.ts

**Test**: Login as admin, invite airline, check temp password returned ✅

---

## Phase 6: US5 - Password Change

- [x] T015 [US5] Add change-password to auth service in /backend/src/services/auth.service.ts
- [x] T016 [US5] Add PUT /api/auth/change-password route in /backend/src/routes/auth.routes.ts

**Test**: Login as invited airline, change password ✅

---

## Phase 7: US6 - User Management

- [x] T017 [US6] Add list/delete users to user service in /backend/src/services/user.service.ts
- [x] T018 [US6] Add GET/DELETE /api/admin/users routes in /backend/src/routes/admin.routes.ts

**Test**: Login as admin, list users, delete a user ✅

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | T001-T004 | Models & Utils |
| 2 | T005-T006 | Middleware |
| 3 | T007-T009 | Register & Login |
| 4 | T010-T011 | Admin Seed |
| 5 | T012-T014 | Airline Invite |
| 6 | T015-T016 | Password Change |
| 7 | T017-T018 | User Management |

**Total**: 18 tasks (was 26)
**MVP**: T001-T011 (Register, Login, Admin Seed)
