# Implementation Plan: User Authentication

**Feature**: 010-auth | **Date**: 2025-01-31

## Technical Context

| Aspect | Decision |
|--------|----------|
| Framework | Angular 17+ (standalone components) |
| State Management | Signals + AuthService (new service) |
| Styling | SCSS with existing design tokens |
| Data Source | LocalStorage for mock user persistence |
| Navigation | Angular Router with guards |
| Forms | Reactive Forms with custom validators |

### Dependencies

- **Existing Components**: Header (needs user state integration)
- **Existing Services**: None (AuthService is new)
- **Models**: User, Session (new)

### Integration Points

1. **AuthService** - Central service for login, register, logout, session management
2. **Header** - Update to show user name/avatar when logged in
3. **Router Guards** - Protect authenticated routes (future use)
4. **LocalStorage** - Persist users and session data

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Design-First | ✅ | Following Figma auth page designs |
| II. Component-Based | ✅ | Standalone components: LoginPage, RegisterPage, UserMenu |
| III. Type Safety | ✅ | New interfaces: User, Session, AuthState |
| IV. Responsive Design | ✅ | Single column centered layout, responsive |
| V. Simplicity (YAGNI) | ✅ | Mock auth, no real backend, minimal scope |

**Gate Evaluation**: All principles satisfied. No violations.

## Phase 0: Research Summary

### R1: Mock Authentication Approach

**Decision**: LocalStorage-based user and session persistence

**Rationale**:
- No real backend required for frontend demo
- Users persist across browser sessions
- Easy to seed test users
- Can be replaced with real API later without changing component code
- AuthService abstracts storage mechanism

**Alternatives Considered**:
- SessionStorage only: Doesn't persist users, bad for demo
- In-memory only: Lost on refresh
- Mock API server: Adds complexity, overkill for demo

### R2: Session Management

**Decision**: Token-based session with localStorage and sessionStorage combination

**Rationale**:
- "Remember me" checked: Store session in localStorage (persists)
- "Remember me" unchecked: Store session in sessionStorage (clears on close)
- Token is simple UUID for mock purposes
- Expiry tracked but not enforced in frontend-only mode

**Implementation**:
```typescript
interface Session {
  userId: string;
  token: string;
  expiresAt: string;
  rememberMe: boolean;
}
```

### R3: Password Handling

**Decision**: Store password as-is for mock (no real hashing in frontend)

**Rationale**:
- Real hashing requires backend (bcrypt, argon2)
- Frontend hashing provides no security benefit
- Mock authentication compares plain text
- Document clearly that real implementation needs backend hashing

### R4: Header Integration

**Decision**: AuthService exposes reactive signals consumed by Header

**Rationale**:
- Header already exists, needs minimal changes
- Signals provide reactive updates without subscriptions
- User dropdown component can be separate or inline

## Phase 1: Design Artifacts

### Generated Artifacts

- [x] `data-model.md` - Entity definitions
- [x] `quickstart.md` - Implementation guide
- [ ] `contracts/` - N/A (frontend-only, no new API)

## Post-Design Constitution Re-check

| Principle | Status |
|-----------|--------|
| I. Design-First | ✅ |
| II. Component-Based | ✅ |
| III. Type Safety | ✅ |
| IV. Responsive Design | ✅ |
| V. Simplicity (YAGNI) | ✅ |

**All gates pass. Ready for task generation.**
