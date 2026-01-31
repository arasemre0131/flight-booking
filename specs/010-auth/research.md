# Research: User Authentication

**Feature**: 010-auth | **Date**: 2025-01-31

## Research Questions

### R1: Mock Authentication Storage

**Question**: How to store user data and sessions without a backend?

**Decision**: LocalStorage for users, localStorage/sessionStorage for sessions based on "Remember me"

**Rationale**:
- LocalStorage persists across sessions - users stay registered
- SessionStorage clears on browser close - perfect for non-remember sessions
- No backend dependencies
- Easy to seed test data
- Can be swapped for real API later

**Alternatives Considered**:
| Alternative | Pros | Cons | Decision |
|------------|------|------|----------|
| IndexedDB | More storage, async | Overkill, complex API | Rejected |
| Cookies | Backend-friendly | Needs server, size limits | Rejected |
| In-memory only | Simple | Lost on refresh | Rejected |

**Implementation**:
```typescript
// Users always in localStorage
localStorage.setItem('tripma_users', JSON.stringify(users));

// Session based on rememberMe
if (rememberMe) {
  localStorage.setItem('tripma_session', JSON.stringify(session));
} else {
  sessionStorage.setItem('tripma_session', JSON.stringify(session));
}
```

---

### R2: Password Security in Mock System

**Question**: How to handle passwords without a backend?

**Decision**: Store passwords as plain text in localStorage (mock only)

**Rationale**:
- Frontend hashing provides no security benefit
- bcrypt/argon2 require server-side computation
- Document clearly this is for demo purposes
- Real implementation MUST use backend hashing

**Security Note**: This is acceptable ONLY because:
1. It's a demo/university project
2. No real user data
3. Will be replaced with backend auth

---

### R3: Session Token Strategy

**Question**: How to generate and validate session tokens?

**Decision**: Simple UUID tokens with expiry timestamp

**Rationale**:
- UUID provides uniqueness
- No cryptographic security needed for mock
- Expiry timestamp for session management
- Simple to implement and debug

**Implementation**:
```typescript
function generateToken(): string {
  return crypto.randomUUID();
}

function createSession(userId: string, rememberMe: boolean): Session {
  const expiryDays = rememberMe ? 30 : 1;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  return {
    userId,
    token: generateToken(),
    expiresAt: expiresAt.toISOString(),
    rememberMe
  };
}
```

---

### R4: Header Integration Pattern

**Question**: How to integrate auth state with existing Header component?

**Decision**: AuthService exposes signals, Header consumes directly

**Rationale**:
- Signals provide reactive updates
- No manual subscription management
- Clean separation of concerns
- Header doesn't need to know storage details

**Implementation**:
```typescript
// In Header
authService = inject(AuthService);

// In template
@if (authService.isAuthenticated()) {
  <app-user-menu />
} @else {
  <a routerLink="/login">Sign In</a>
}
```

---

### R5: Form Validation Strategy

**Question**: Client-side vs server-side validation patterns?

**Decision**: Client-side only with Angular Reactive Forms

**Rationale**:
- No backend to validate against
- Immediate inline feedback
- Consistent with other forms in app (payment, passenger)
- Custom validators for password match and strength

**Validators**:
1. Email: Built-in Validators.email
2. Password: Validators.minLength(8)
3. Password match: Custom group validator
4. Required fields: Validators.required

---

## Summary

| Research Item | Decision | Dependencies |
|--------------|----------|--------------|
| Storage | localStorage + sessionStorage | None |
| Passwords | Plain text (mock) | None |
| Tokens | UUID with expiry | crypto.randomUUID() |
| Header | Signal-based integration | AuthService |
| Validation | Client-side only | Reactive Forms |

**All research complete. No NEEDS CLARIFICATION items remaining.**
