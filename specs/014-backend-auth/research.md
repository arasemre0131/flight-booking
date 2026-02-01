# Research: Backend Authentication & User Management

**Feature**: 014-backend-auth (BE-001)
**Date**: 2026-02-01

---

## R1: JWT Token Strategy

### Decision
Use `jsonwebtoken` package with HS256 algorithm and 24-hour expiration.

### Rationale
- Already included in package.json dependencies
- HS256 is sufficient for single-server deployment
- 24-hour expiration balances security and user convenience
- Simple refresh strategy: issue new token before expiration

### Alternatives Considered
| Option | Rejected Because |
|--------|------------------|
| RS256 asymmetric | Overkill for single-server; no key distribution needed |
| Session cookies | Spec explicitly requires token-based auth |
| Passport.js | Adds complexity; direct JWT implementation is simpler |
| 1-hour expiration | Too aggressive for university project; 24h is reasonable |

### Implementation Notes
```typescript
// Token payload structure
interface TokenPayload {
  userId: string;
  email: string;
  role: 'passenger' | 'airline' | 'admin';
  iat: number;
  exp: number;
}

// Environment variable: JWT_SECRET (required)
// Default expiration: 24h (configurable via JWT_EXPIRES_IN)
```

---

## R2: Password Hashing Strategy

### Decision
Use `bcryptjs` with 10 salt rounds.

### Rationale
- Already included in package.json dependencies
- bcryptjs is pure JavaScript (no native compilation issues in Docker)
- 10 rounds provides good security/performance balance (~100ms hash time)
- Industry standard for password hashing

### Alternatives Considered
| Option | Rejected Because |
|--------|------------------|
| bcrypt (native) | Requires native compilation; Docker build issues |
| argon2 | Not in current dependencies; bcrypt is sufficient |
| scrypt | More complex configuration; bcrypt is simpler |
| 12+ rounds | Slower hashing; 10 rounds adequate for university project |

### Implementation Notes
```typescript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Hash password
const hash = await bcrypt.hash(password, SALT_ROUNDS);

// Verify password
const isValid = await bcrypt.compare(password, hash);
```

---

## R3: Role-Based Authorization Pattern

### Decision
Use middleware chain with `requireAuth` → `requireRole(roles)` pattern.

### Rationale
- Clean separation of authentication and authorization
- Composable middleware for different endpoint requirements
- Easy to test each middleware independently
- Express.js idiomatic pattern

### Alternatives Considered
| Option | Rejected Because |
|--------|------------------|
| Single combined middleware | Less flexible; harder to reuse |
| Decorator pattern | Not idiomatic for Express.js |
| CASL/ABAC | Overkill; simple RBAC is sufficient |

### Implementation Notes
```typescript
// Middleware chain example
router.get('/admin/users',
  requireAuth,           // Verify JWT token
  requireRole(['admin']), // Check role
  listUsers              // Handler
);

// Multiple roles allowed
router.get('/profile',
  requireAuth,
  requireRole(['passenger', 'airline', 'admin']),
  getProfile
);
```

---

## R4: Admin Seeding Strategy

### Decision
Check for admin on server startup; create if none exists.

### Rationale
- Meets exam requirement: admin available immediately after first start
- Simple implementation in server.ts startup sequence
- Idempotent: safe to run on every restart
- Logged for audit purposes

### Alternatives Considered
| Option | Rejected Because |
|--------|------------------|
| Migration script | Requires separate execution; not automatic |
| Docker entrypoint | Adds complexity; seed in app is simpler |
| Environment flag | Extra configuration; auto-detect is better |

### Implementation Notes
```typescript
// In server.ts startup
async function seedAdmin(): Promise<void> {
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    await User.create({
      email: 'admin@tripma.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      mustChangePassword: false,
      status: 'active'
    });
    console.log('Admin account created: admin@tripma.com');
  }
}
```

---

## R5: Airline Invitation Workflow

### Decision
Admin creates airline user with temporary password; return password in response.

### Rationale
- Meets exam requirement: airlines cannot self-register
- Temporary password communicated manually (per spec assumption)
- `mustChangePassword` flag enforces password change on first login
- Simple flow without email integration

### Alternatives Considered
| Option | Rejected Because |
|--------|------------------|
| Email invitation link | Out of scope; no email service required |
| Magic link / OTP | More complex; temporary password is sufficient |
| Pre-approved email list | Less flexible; invitation model is cleaner |

### Implementation Notes
```typescript
// POST /api/admin/invite-airline
interface InviteAirlineRequest {
  email: string;
  companyName: string;
  airlineCode: string;  // e.g., "HA" for Hawaiian Airlines
}

interface InviteAirlineResponse {
  userId: string;
  email: string;
  temporaryPassword: string;  // Admin communicates this manually
  airlineId: string;
}
```

---

## R6: Error Response Strategy

### Decision
Use consistent error response format with generic auth error messages.

### Rationale
- Security: no credential hints in error responses
- Consistency: same format across all endpoints
- Debugging: include error codes for support

### Implementation Notes
```typescript
// Generic auth errors (no hints)
{ "error": "Invalid credentials" }  // Wrong email OR password
{ "error": "Authentication required" }  // Missing/invalid token
{ "error": "Access denied" }  // Insufficient role

// Validation errors (specific for UX)
{ "error": "Email already registered" }  // Registration
{ "error": "Password must be at least 8 characters" }  // Validation
```

---

## R7: Mongoose Schema Design

### Decision
Use Mongoose schemas with TypeScript interfaces; timestamps enabled.

### Rationale
- Type safety with TypeScript
- Automatic `createdAt` and `updatedAt` fields
- Built-in validation for required fields
- Index on email for fast lookups

### Implementation Notes
```typescript
// User schema key points
- email: unique, lowercase, trimmed
- password: never selected by default (select: false)
- role: enum with allowed values
- mustChangePassword: default false
- status: enum (active, inactive)
- Compound index on email + status for login queries
```

---

## Summary

All technical decisions resolved. No NEEDS CLARIFICATION items remain.

| Research Item | Decision |
|---------------|----------|
| R1: JWT Strategy | HS256, 24h expiration, jsonwebtoken package |
| R2: Password Hashing | bcryptjs with 10 salt rounds |
| R3: Authorization | Middleware chain pattern |
| R4: Admin Seeding | Server startup check, auto-create if missing |
| R5: Airline Invitation | Admin creates with temp password |
| R6: Error Responses | Generic auth errors, specific validation errors |
| R7: Mongoose Schemas | TypeScript interfaces, timestamps, indexes |
