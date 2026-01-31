# Data Model: User Authentication

**Feature**: 010-auth | **Date**: 2025-01-31

## Entities

### User

Represents a registered user account.

```typescript
interface User {
  id: string;              // UUID
  email: string;           // Unique, lowercase
  password: string;        // Plain text for mock (backend would hash)
  firstName: string;
  lastName: string;
  createdAt: string;       // ISO date
}
```

**Validation Rules**:
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters
- `firstName`: Required, minimum 1 character
- `lastName`: Required, minimum 1 character

**Storage**: `localStorage` key: `tripma_users` (array of User objects)

### Session

Represents an active login session.

```typescript
interface Session {
  userId: string;          // References User.id
  token: string;           // UUID token
  expiresAt: string;       // ISO date
  rememberMe: boolean;     // Determines storage type
}
```

**Storage**:
- If `rememberMe = true`: `localStorage` key: `tripma_session`
- If `rememberMe = false`: `sessionStorage` key: `tripma_session`

### AuthState

Reactive state exposed by AuthService.

```typescript
interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
}
```

## Mock Data

### Pre-seeded Test Users

```typescript
const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-002',
    email: 'john@example.com',
    password: 'john1234',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: '2025-01-15T00:00:00Z'
  }
];
```

## AuthService API

### Methods

```typescript
class AuthService {
  // Signals (readonly)
  readonly isAuthenticated: Signal<boolean>;
  readonly currentUser: Signal<User | null>;
  readonly isLoading: Signal<boolean>;

  // Auth operations
  login(email: string, password: string, rememberMe: boolean): Promise<AuthResult>;
  register(data: RegisterData): Promise<AuthResult>;
  logout(): void;

  // Session management
  checkSession(): void;  // Called on app init

  // Helpers
  getUserDisplayName(): string;
  getUserInitials(): string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}
```

## Storage Keys

| Key | Storage | Description |
|-----|---------|-------------|
| `tripma_users` | localStorage | Array of registered users |
| `tripma_session` | localStorage OR sessionStorage | Current session (based on rememberMe) |

## Validation Utilities

```typescript
// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
const MIN_PASSWORD_LENGTH = 8;

// Validation functions
function isValidEmail(email: string): boolean;
function isValidPassword(password: string): boolean;
function doPasswordsMatch(password: string, confirm: string): boolean;
```
