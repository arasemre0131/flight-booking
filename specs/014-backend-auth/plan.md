# Implementation Plan: Backend Authentication & User Management

**Branch**: `014-backend-auth` | **Date**: 2026-02-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-backend-auth/spec.md`

## Summary

Implement JWT-based authentication and user management for the flight booking backend. The system supports three user roles (passenger, airline, admin) with distinct registration flows: self-registration for passengers, admin invitation for airlines, and auto-seeding for the first admin account. All protected endpoints require valid JWT tokens with role-based authorization.

## Technical Context

**Language/Version**: TypeScript 5.x with Node.js 20+
**Primary Dependencies**: Express.js 4.18, Mongoose 8.x, bcryptjs, jsonwebtoken
**Storage**: MongoDB (via Mongoose ODM)
**Testing**: Jest with supertest for integration tests
**Target Platform**: Docker container (Linux)
**Project Type**: Web application (backend API)
**Performance Goals**: Authentication operations < 500ms, user listing < 1s for 10k users
**Constraints**: Passwords hashed with bcrypt (10+ rounds), tokens expire in 24h
**Scale/Scope**: Single admin, multiple airlines, thousands of passengers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is using template placeholders. Applying standard best practices:

| Gate | Status | Notes |
|------|--------|-------|
| RESTful API design | ✅ PASS | Standard REST patterns for auth endpoints |
| Security best practices | ✅ PASS | bcrypt hashing, JWT tokens, no credential hints |
| Separation of concerns | ✅ PASS | Models, services, routes, middleware layers |
| Error handling | ✅ PASS | Generic error messages, no credential leakage |
| Testing strategy | ✅ PASS | Integration tests for auth flows |

## Project Structure

### Documentation (this feature)

```text
specs/014-backend-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI specs)
└── tasks.md             # Phase 2 output (from /speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── config/
│   │   └── database.ts      # MongoDB connection (exists)
│   ├── models/
│   │   ├── user.model.ts    # User schema with roles
│   │   └── airline.model.ts # Airline schema
│   ├── services/
│   │   ├── auth.service.ts  # Registration, login, token management
│   │   └── user.service.ts  # User CRUD, admin operations
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification
│   │   └── role.middleware.ts    # Role-based authorization
│   ├── routes/
│   │   ├── auth.routes.ts   # /api/auth/* endpoints
│   │   └── admin.routes.ts  # /api/admin/* endpoints
│   ├── utils/
│   │   ├── jwt.util.ts      # Token generation/verification
│   │   └── password.util.ts # Hashing utilities
│   ├── seed/
│   │   └── admin.seed.ts    # Admin auto-creation on startup
│   ├── app.ts               # Express app (exists)
│   └── server.ts            # Entry point (exists)
└── tests/
    ├── auth.test.ts         # Auth endpoint tests
    └── admin.test.ts        # Admin endpoint tests
```

**Structure Decision**: Extending existing backend structure with authentication-specific modules. The skeleton from 013-docker-setup provides the foundation (app.ts, server.ts, database config).

## Complexity Tracking

No constitution violations requiring justification. The implementation follows standard Express.js patterns.
