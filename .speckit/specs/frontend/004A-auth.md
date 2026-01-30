# SPEC-004A: Authentication (Login/Register)

> **Status:** ⬜ Pending | **Lines:** ~150 | **Priority:** P0

## Overview
Login and registration forms for passengers. Required before booking flow.

## Dependencies
- **Requires:** SPEC-001A (Header/Footer)
- **Required by:** SPEC-003A (Passenger Info)

---

## Files to Create

| # | File Path | Purpose | Lines |
|---|-----------|---------|-------|
| 1 | `src/app/pages/auth/login/login.component.ts` | Login logic | ~40 |
| 2 | `src/app/pages/auth/login/login.component.html` | Login template | ~35 |
| 3 | `src/app/pages/auth/login/login.component.scss` | Login styles | ~25 |
| 4 | `src/app/pages/auth/register/register.component.ts` | Register logic | ~45 |
| 5 | `src/app/pages/auth/register/register.component.html` | Register template | ~40 |
| 6 | `src/app/pages/auth/register/register.component.scss` | Register styles | ~25 |
| 7 | `src/app/services/auth.service.ts` | Auth service | ~50 |
| 8 | `src/app/models/user.model.ts` | User interface | ~20 |

**Total: ~280 lines**

---

## Login Page

### Visual Reference
```
┌─────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                         Sign in to Tripma                               │
│                                                                         │
│                  ┌─────────────────────────────────┐                    │
│                  │ Email address                   │                    │
│                  └─────────────────────────────────┘                    │
│                  ┌─────────────────────────────────┐                    │
│                  │ Password                    👁  │                    │
│                  └─────────────────────────────────┘                    │
│                                                                         │
│                  ☐ Remember me                                          │
│                                                                         │
│                  ┌─────────────────────────────────┐                    │
│                  │          Sign in               │                    │
│                  └─────────────────────────────────┘                    │
│                                                                         │
│                  Forgot password?                                       │
│                                                                         │
│                  ──────────── or ────────────                          │
│                                                                         │
│                  [ G  Sign in with Google        ]                      │
│                  [ 🍎 Sign in with Apple         ]                      │
│                  [ f  Sign in with Facebook      ]                      │
│                                                                         │
│                  Don't have an account? Sign up                         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                              FOOTER                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Form Fields
| Field | Type | Validation |
|-------|------|------------|
| Email | email | Required, valid email |
| Password | password | Required, min 8 chars |
| Remember me | checkbox | - |

### Links
- "Forgot password?" → Password reset (future)
- "Sign up" → Register page

---

## Register Page

### Visual Reference
```
┌─────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                      Create your Tripma account                         │
│                                                                         │
│                  ┌─────────────────────────────────┐                    │
│                  │ First name                      │                    │
│                  └─────────────────────────────────┘                    │
│                  ┌─────────────────────────────────┐                    │
│                  │ Last name                       │                    │
│                  └─────────────────────────────────┘                    │
│                  ┌─────────────────────────────────┐                    │
│                  │ Email address                   │                    │
│                  └─────────────────────────────────┘                    │
│                  ┌─────────────────────────────────┐                    │
│                  │ Password                    👁  │                    │
│                  └─────────────────────────────────┘                    │
│                  Password strength: Strong                              │
│                  ┌─────────────────────────────────┐                    │
│                  │ Confirm password            👁  │                    │
│                  └─────────────────────────────────┘                    │
│                                                                         │
│                  ☐ I agree to the Terms and Privacy Policy             │
│                                                                         │
│                  ┌─────────────────────────────────┐                    │
│                  │        Create account          │                    │
│                  └─────────────────────────────────┘                    │
│                                                                         │
│                  ──────────── or ────────────                          │
│                                                                         │
│                  [ G  Sign up with Google        ]                      │
│                  [ 🍎 Sign up with Apple         ]                      │
│                  [ f  Sign up with Facebook      ]                      │
│                                                                         │
│                  Already have an account? Sign in                       │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                              FOOTER                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Form Fields
| Field | Type | Validation |
|-------|------|------------|
| First name | text | Required, min 2 chars |
| Last name | text | Required, min 2 chars |
| Email | email | Required, valid email |
| Password | password | Required, min 8 chars, strength |
| Confirm password | password | Must match password |
| Terms agreement | checkbox | Required |

---

## Models (user.model.ts)

```typescript
export type UserRole = 'passenger' | 'airline' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
```

---

## Auth Service (auth.service.ts)

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);

  // Mock login
  login(request: LoginRequest): Observable<AuthResponse> { }

  // Mock register
  register(request: RegisterRequest): Observable<AuthResponse> { }

  // Logout
  logout(): void { }

  // Check if logged in
  isLoggedIn(): boolean { }

  // Get current user
  getCurrentUser(): Observable<User | null> { }
}
```

---

## Social Login Buttons

Same style as SPEC-003C:
- Google
- Apple
- Facebook

---

## Password Strength Indicator

| Strength | Color | Criteria |
|----------|-------|----------|
| Weak | Red | < 8 chars |
| Medium | Yellow | 8+ chars, no variety |
| Strong | Green | 8+ chars, mixed case, numbers |

---

## Error Messages

| Error | Message |
|-------|---------|
| Invalid email | "Please enter a valid email address" |
| Wrong password | "Incorrect email or password" |
| Email exists | "An account with this email already exists" |
| Passwords don't match | "Passwords do not match" |
| Terms not accepted | "You must accept the Terms and Privacy Policy" |

---

## Navigation

| From | To | Trigger |
|------|-----|---------|
| Login | Register | "Sign up" link |
| Register | Login | "Sign in" link |
| Login | Home | Successful login |
| Login | Booking | Login after flight selection |

---

## Acceptance Criteria

- [ ] Login form validates email and password
- [ ] Password visibility toggle works
- [ ] "Remember me" checkbox saves session
- [ ] Login error shows for wrong credentials
- [ ] Register form validates all fields
- [ ] Password strength indicator works
- [ ] Confirm password must match
- [ ] Terms checkbox required
- [ ] Social login buttons display
- [ ] Navigation between login/register works
- [ ] Successful login redirects appropriately
- [ ] Auth state persists in service
