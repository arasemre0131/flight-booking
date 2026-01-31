# Quickstart: User Authentication

**Feature**: 010-auth | **Date**: 2025-01-31

## Overview

Mock authentication system with login, registration, logout, and persistent sessions.
All data stored in browser storage - no backend required.

## File Structure

```
frontend/src/app/
├── models/
│   └── auth.model.ts           # User, Session, AuthState interfaces
├── services/
│   └── auth.service.ts         # Authentication service
├── mock-data/
│   └── users.data.ts           # Pre-seeded test users
├── pages/
│   ├── login/
│   │   ├── login.ts            # Login page component
│   │   ├── login.html          # Login template
│   │   └── login.scss          # Login styles
│   └── register/
│       ├── register.ts         # Register page component
│       ├── register.html       # Register template
│       └── register.scss       # Register styles
├── components/
│   └── user-menu/
│       ├── user-menu.ts        # User dropdown component
│       ├── user-menu.html      # User menu template
│       └── user-menu.scss      # User menu styles
└── shared/
    └── header/
        └── header.component.ts # Update for auth integration
```

## Implementation Steps

### Step 1: Create Auth Models

```typescript
// models/auth.model.ts
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  token: string;
  expiresAt: string;
  rememberMe: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}
```

### Step 2: Create Mock Users Data

```typescript
// mock-data/users.data.ts
import { User } from '../models/auth.model';

export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2025-01-01T00:00:00Z'
  }
];
```

### Step 3: Create AuthService

```typescript
// services/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'tripma_users';
  private readonly SESSION_KEY = 'tripma_session';

  private _isAuthenticated = signal(false);
  private _currentUser = signal<User | null>(null);
  private _isLoading = signal(false);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.initializeUsers();
    this.checkSession();
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<AuthResult> {
    // Find user, validate password, create session
  }

  async register(data: RegisterData): Promise<AuthResult> {
    // Check email exists, create user, auto-login
  }

  logout(): void {
    // Clear session, update state
  }

  getUserDisplayName(): string {
    const user = this._currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  getUserInitials(): string {
    const user = this._currentUser();
    return user ? `${user.firstName[0]}${user.lastName[0]}` : '';
  }
}
```

### Step 4: Create Login Page

```typescript
// pages/login/login.ts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginPage {
  form: FormGroup;
  error = signal<string | null>(null);
  isLoading = signal(false);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;
    // Call authService.login, handle result
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }
}
```

### Step 5: Create Register Page

```typescript
// pages/register/register.ts
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterPage {
  form: FormGroup;
  error = signal<string | null>(null);
  isLoading = signal(false);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.form.invalid) return;
    // Call authService.register, handle result
  }
}
```

### Step 6: Create User Menu Component

```typescript
// components/user-menu/user-menu.ts
@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.scss'
})
export class UserMenu {
  authService = inject(AuthService);
  isOpen = signal(false);

  toggle() {
    this.isOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.isOpen.set(false);
  }
}
```

### Step 7: Update Header

```typescript
// In header.component.ts
// Add AuthService injection and use isAuthenticated signal
// Show UserMenu when logged in, "Sign In" button when not
```

### Step 8: Add Routes

```typescript
// app.routes.ts
{
  path: 'login',
  loadComponent: () => import('./pages/login/login').then(m => m.LoginPage)
},
{
  path: 'register',
  loadComponent: () => import('./pages/register/register').then(m => m.RegisterPage)
}
```

## Key Points

1. **Mock auth** - No real backend, localStorage/sessionStorage
2. **Pre-seeded users** - test@example.com / password123
3. **Remember me** - localStorage vs sessionStorage
4. **Signals** - Reactive auth state
5. **Password visibility** - Toggle on password fields

## Testing Checklist

- [ ] Register new user successfully
- [ ] Duplicate email shows error
- [ ] Password mismatch shows error
- [ ] Login with valid credentials
- [ ] Invalid credentials show error
- [ ] Header shows user name when logged in
- [ ] Logout clears session
- [ ] Remember me persists session
- [ ] No remember me clears on browser close
- [ ] Password visibility toggle works
