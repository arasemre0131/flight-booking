# SPEC-004A: Authentication (Login/Register Modal)

> **Status:** ⬜ Pending | **Lines:** ~200 | **Priority:** P0

## Overview
Login and registration modals for passengers. Triggered from header buttons. Any login works (mock auth).

## Dependencies
- **Requires:** SPEC-001A (Header)
- **Required by:** SPEC-003A (Passenger Info - requires login)

---

## Files to Create

| # | File Path | Purpose | Lines |
|---|-----------|---------|-------|
| 1 | `src/app/shared/auth-modal/auth-modal.component.ts` | Modal logic | ~60 |
| 2 | `src/app/shared/auth-modal/auth-modal.component.html` | Modal template | ~70 |
| 3 | `src/app/shared/auth-modal/auth-modal.component.scss` | Modal styles | ~40 |
| 4 | `src/app/services/auth.service.ts` | Auth service | ~50 |
| 5 | `src/app/models/user.model.ts` | User interface | ~20 |

**Total: ~240 lines**

---

## Design Reference

- Image: `assets/images/auth/signup-modal.png`
- Style: Centered modal with backdrop

---

## Sign Up Modal

### Visual Reference (from Figma)
```
┌─────────────────────────────────────────────────────┐
│                                                   ✕ │
│  Sign up for SkyRoute                                 │
│                                                     │
│  SkyRoute is totally free to use. Sign up using your  │
│  email address or phone number below to get started.│
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │ Email or phone number                         │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │ Password                                      │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ☐ I agree to the terms and conditions              │
│  ☐ Send me the latest deal alerts                   │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │            Create account                     │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ────────────────── or ──────────────────           │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  G    Continue with Google                    │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  🍎   Continue with Apple                     │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  f    Continue with Facebook                  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Sign In Modal

### Visual Reference
```
┌─────────────────────────────────────────────────────┐
│                                                   ✕ │
│  Sign in to SkyRoute                                  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │ Email or phone number                         │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │ Password                                      │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │              Sign in                          │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ────────────────── or ──────────────────           │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  G    Continue with Google                    │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  🍎   Continue with Apple                     │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  f    Continue with Facebook                  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  Don't have an account? Sign up                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Login Behavior (IMPORTANT)

### Mock Authentication Rules:

1. **Email/Phone Login:**
   - Any email/password works (no real validation)
   - Display name = email/phone (before @)
   - Example: `john@email.com` → Display name: "john"

2. **Social Login (Google/Apple/Facebook):**
   - Click immediately logs in
   - Display name = "User"
   - No additional input needed

3. **After Login:**
   - Header changes: "Sign in | Sign up" → "My trips | 👤 [Name]"
   - User can access booking flow

---

## Form Fields

### Sign Up
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Email or phone | text | Yes | Becomes display name |
| Password | password | Yes | Any value works |
| Terms agreement | checkbox | Yes | Must check |
| Deal alerts | checkbox | No | Optional |

### Sign In
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Email or phone | text | Yes | Becomes display name |
| Password | password | Yes | Any value works |

---

## Models (user.model.ts)

```typescript
export interface User {
  id: string;
  displayName: string;
  email?: string;
  loginMethod: 'email' | 'google' | 'apple' | 'facebook';
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}
```

---

## Auth Service (auth.service.ts)

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState = new BehaviorSubject<AuthState>({
    isLoggedIn: false,
    user: null
  });

  // Login with email/phone
  loginWithEmail(email: string, password: string): void {
    const displayName = email.split('@')[0] || email;
    this.setUser({
      id: Date.now().toString(),
      displayName,
      email,
      loginMethod: 'email'
    });
  }

  // Social login - instant, name = "User"
  loginWithGoogle(): void {
    this.setUser({
      id: Date.now().toString(),
      displayName: 'User',
      loginMethod: 'google'
    });
  }

  loginWithApple(): void {
    this.setUser({
      id: Date.now().toString(),
      displayName: 'User',
      loginMethod: 'apple'
    });
  }

  loginWithFacebook(): void {
    this.setUser({
      id: Date.now().toString(),
      displayName: 'User',
      loginMethod: 'facebook'
    });
  }

  logout(): void {
    this.authState.next({ isLoggedIn: false, user: null });
  }

  isLoggedIn(): Observable<boolean> {
    return this.authState.pipe(map(state => state.isLoggedIn));
  }

  getCurrentUser(): Observable<User | null> {
    return this.authState.pipe(map(state => state.user));
  }

  private setUser(user: User): void {
    this.authState.next({ isLoggedIn: true, user });
  }
}
```

---

## Modal Component

### Inputs/Outputs
```typescript
@Input() mode: 'signin' | 'signup' = 'signup';
@Output() close = new EventEmitter<void>();
@Output() loginSuccess = new EventEmitter<User>();
```

### Toggle between modes
- "Don't have an account? Sign up" → switches to signup
- "Already have an account? Sign in" → switches to signin

---

## Header Integration

### Before Login
```html
<a class="sign-in" (click)="openAuthModal('signin')">Sign in</a>
<button class="sign-up-btn" (click)="openAuthModal('signup')">Sign up</button>
```

### After Login
```html
<a routerLink="/my-trips">My trips</a>
<span class="user-avatar">👤 {{ user.displayName }}</span>
```

---

## Styles

```scss
.auth-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.auth-modal {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 400px;
  max-width: 90vw;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
}

.social-btn {
  width: 100%;
  padding: 12px;
  border: 1px solid #CBD4E6;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #605DEC;
  cursor: pointer;
  margin-bottom: 12px;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: #605DEC;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

---

## Acceptance Criteria

- [ ] Sign in modal opens when clicking "Sign in"
- [ ] Sign up modal opens when clicking "Sign up"
- [ ] Modal closes with ✕ button or backdrop click
- [ ] Any email/password logs in successfully
- [ ] Display name = email prefix (before @)
- [ ] Google/Apple/Facebook instant login with name "User"
- [ ] Header updates after login (shows user name)
- [ ] Terms checkbox required for signup
- [ ] Toggle between signin/signup modes
- [ ] Login state persists (service)
- [ ] Logged in users can access booking flow
