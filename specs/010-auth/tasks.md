# Implementation Tasks: User Authentication

**Feature**: 010-auth | **Date**: 2025-01-31

## Task Overview

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | T001-T002 | Setup: Models & Mock Data |
| 2 | T003 | Foundational: Auth Service |
| 3 | T004-T006 | US1: User Registration |
| 4 | T007-T009 | US2: User Login |
| 5 | T010-T011 | US3: User Logout |
| 6 | T012-T013 | US4: Persistent Session |
| 7 | T014-T015 | Polish: Routes & Header Integration |

## User Story to Task Mapping

| User Story | Tasks | FR Coverage |
|------------|-------|-------------|
| US1 - Registration | T001-T006 | FR-001 to FR-005, FR-013, FR-014, FR-016, FR-017 |
| US2 - Login | T001-T003, T007-T009 | FR-006 to FR-008, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017 |
| US3 - Logout | T003, T010-T011 | FR-009, FR-010, FR-011 |
| US4 - Persistent Session | T003, T012-T013 | FR-012 |

---

## Phase 1: Setup

### T001: Create Auth Models

**Priority**: P0 (Blocker)
**Estimate**: S
**Dependencies**: None

**Description**: Create TypeScript interfaces for User, Session, AuthState, RegisterData, and AuthResult.

**Acceptance Criteria**:
- [ ] User interface with id, email, password, firstName, lastName, createdAt
- [ ] Session interface with userId, token, expiresAt, rememberMe
- [ ] AuthState interface with isAuthenticated, currentUser, isLoading
- [ ] RegisterData interface with email, password, firstName, lastName
- [ ] AuthResult interface with success, error?, user?

**Files**:
- `frontend/src/app/models/auth.model.ts` (create)

**FR Coverage**: Supports all FR

---

### T002: Create Mock Users Data

**Priority**: P0 (Blocker)
**Estimate**: S
**Dependencies**: T001

**Description**: Create pre-seeded test users for mock authentication.

**Acceptance Criteria**:
- [ ] MOCK_USERS array with at least 2 test users
- [ ] test@example.com / password123 for primary testing
- [ ] john@example.com / john1234 for secondary testing
- [ ] All users have complete data (id, email, password, firstName, lastName, createdAt)

**Files**:
- `frontend/src/app/mock-data/users.data.ts` (create)

**FR Coverage**: Supports FR-007

---

## Phase 2: Foundational

### T003: Create AuthService

**Priority**: P0 (Blocker)
**Estimate**: L
**Dependencies**: T001, T002

**Description**: Create the central authentication service with signals for reactive state.

**Acceptance Criteria**:
- [ ] Injectable service with providedIn: 'root'
- [ ] Signal-based state: isAuthenticated, currentUser, isLoading (readonly)
- [ ] USERS_KEY and SESSION_KEY constants for localStorage keys
- [ ] initializeUsers() method to seed mock users on first load
- [ ] checkSession() method called in constructor
- [ ] login(email, password, rememberMe) returns Promise<AuthResult>
- [ ] register(data: RegisterData) returns Promise<AuthResult>
- [ ] logout() clears session and updates state
- [ ] getUserDisplayName() returns full name
- [ ] getUserInitials() returns first letters
- [ ] Private helpers: getUsers(), saveUsers(), getSession(), saveSession(), clearSession()
- [ ] Session storage based on rememberMe flag (localStorage vs sessionStorage)
- [ ] Token generation using crypto.randomUUID()

**Files**:
- `frontend/src/app/services/auth.service.ts` (create)

**FR Coverage**: FR-005, FR-007, FR-008, FR-011, FR-012

---

## Phase 3: User Registration (US1)

### T004: Create Register Page Component

**Priority**: P1
**Estimate**: M
**Dependencies**: T003

**Description**: Create the registration page with reactive form.

**Acceptance Criteria**:
- [ ] Standalone component with ReactiveFormsModule, RouterLink
- [ ] FormGroup with firstName, lastName, email, password, confirmPassword
- [ ] Validators: required on all, email format, minLength(8) on password
- [ ] Custom group validator for password match
- [ ] error signal for API errors
- [ ] isLoading signal for submit state
- [ ] showPassword signal for visibility toggle
- [ ] onSubmit() calls authService.register() and handles result
- [ ] togglePassword() method
- [ ] Navigation to home on success

**Files**:
- `frontend/src/app/pages/register/register.ts` (create)

**FR Coverage**: FR-001, FR-002, FR-003, FR-004, FR-005

---

### T005: Create Register Page Template

**Priority**: P1
**Estimate**: M
**Dependencies**: T004

**Description**: Create the registration form template matching Figma design.

**Acceptance Criteria**:
- [ ] Form with all fields (firstName, lastName, email, password, confirmPassword)
- [ ] Inline validation errors shown when fields invalid and touched
- [ ] Password visibility toggle button
- [ ] Submit button disabled when form invalid or loading
- [ ] Loading spinner on submit button during submission
- [ ] API error message display
- [ ] Link to login page ("Already have an account? Sign in")
- [ ] Tripma logo/branding

**Files**:
- `frontend/src/app/pages/register/register.html` (create)

**FR Coverage**: FR-001, FR-013, FR-014, FR-016

---

### T006: Create Register Page Styles

**Priority**: P1
**Estimate**: S
**Dependencies**: T005

**Description**: Style the registration page for desktop and mobile.

**Acceptance Criteria**:
- [ ] Centered card layout with max-width
- [ ] Consistent input styling with existing forms
- [ ] Error message styling (red text)
- [ ] Password toggle button styling
- [ ] Responsive breakpoints for mobile
- [ ] Match Figma design tokens (colors, spacing, typography)

**Files**:
- `frontend/src/app/pages/register/register.scss` (create)

**FR Coverage**: FR-016, FR-017

---

## Phase 4: User Login (US2)

### T007: Create Login Page Component

**Priority**: P1
**Estimate**: M
**Dependencies**: T003

**Description**: Create the login page with reactive form.

**Acceptance Criteria**:
- [ ] Standalone component with ReactiveFormsModule, RouterLink
- [ ] FormGroup with email, password, rememberMe fields
- [ ] Validators: required on email/password, email format
- [ ] error signal for API errors
- [ ] isLoading signal for submit state
- [ ] showPassword signal for visibility toggle
- [ ] onSubmit() calls authService.login() and handles result
- [ ] togglePassword() method
- [ ] Navigation to home (or returnUrl) on success

**Files**:
- `frontend/src/app/pages/login/login.ts` (create)

**FR Coverage**: FR-006, FR-007, FR-008, FR-012, FR-015

---

### T008: Create Login Page Template

**Priority**: P1
**Estimate**: M
**Dependencies**: T007

**Description**: Create the login form template matching Figma design.

**Acceptance Criteria**:
- [ ] Form with email, password fields
- [ ] Remember me checkbox
- [ ] Inline validation errors shown when fields invalid and touched
- [ ] Password visibility toggle button
- [ ] Submit button disabled when form invalid or loading
- [ ] Loading spinner on submit button during submission
- [ ] API error message display
- [ ] Link to register page ("Don't have an account? Sign up")
- [ ] Tripma logo/branding

**Files**:
- `frontend/src/app/pages/login/login.html` (create)

**FR Coverage**: FR-006, FR-012, FR-013, FR-014, FR-016

---

### T009: Create Login Page Styles

**Priority**: P1
**Estimate**: S
**Dependencies**: T008

**Description**: Style the login page for desktop and mobile.

**Acceptance Criteria**:
- [ ] Centered card layout with max-width
- [ ] Consistent styling with register page
- [ ] Remember me checkbox styling
- [ ] Error message styling (red text)
- [ ] Password toggle button styling
- [ ] Responsive breakpoints for mobile
- [ ] Match Figma design tokens

**Files**:
- `frontend/src/app/pages/login/login.scss` (create)

**FR Coverage**: FR-016, FR-017

---

## Phase 5: User Logout (US3)

### T010: Create User Menu Component

**Priority**: P1
**Estimate**: M
**Dependencies**: T003

**Description**: Create dropdown menu component for logged-in users.

**Acceptance Criteria**:
- [ ] Standalone component
- [ ] Inject AuthService
- [ ] isOpen signal for dropdown state
- [ ] Display user initials in avatar circle
- [ ] Display user name
- [ ] toggle() method for dropdown
- [ ] logout() calls authService.logout() and closes dropdown
- [ ] Click outside closes dropdown

**Files**:
- `frontend/src/app/components/user-menu/user-menu.ts` (create)
- `frontend/src/app/components/user-menu/user-menu.html` (create)
- `frontend/src/app/components/user-menu/user-menu.scss` (create)

**FR Coverage**: FR-009, FR-010

---

### T011: Integrate User Menu with Header

**Priority**: P1
**Estimate**: S
**Dependencies**: T010

**Description**: Update header to show UserMenu when logged in, Sign In button when not.

**Acceptance Criteria**:
- [ ] Inject AuthService in HeaderComponent
- [ ] Conditionally show UserMenu when isAuthenticated() is true
- [ ] Show "Sign In" RouterLink when not authenticated
- [ ] Sign In links to /login

**Files**:
- `frontend/src/app/shared/header/header.component.ts` (modify)
- `frontend/src/app/shared/header/header.component.html` (modify)

**FR Coverage**: FR-009, FR-010, FR-011

---

## Phase 6: Persistent Session (US4)

### T012: Implement Remember Me Logic

**Priority**: P2
**Estimate**: S
**Dependencies**: T003

**Description**: Ensure session storage respects Remember Me selection (already in AuthService, verify works).

**Acceptance Criteria**:
- [ ] rememberMe=true stores session in localStorage
- [ ] rememberMe=false stores session in sessionStorage
- [ ] Session expiry: 30 days (remember) vs 1 day (no remember)
- [ ] checkSession() checks both storage locations

**Files**:
- `frontend/src/app/services/auth.service.ts` (verify/modify)

**FR Coverage**: FR-012

---

### T013: Add Session Expiry Check

**Priority**: P2
**Estimate**: S
**Dependencies**: T012

**Description**: Validate session expiry on app load.

**Acceptance Criteria**:
- [ ] checkSession() validates expiresAt timestamp
- [ ] Expired sessions are cleared automatically
- [ ] User is logged out if session expired

**Files**:
- `frontend/src/app/services/auth.service.ts` (modify)

**FR Coverage**: FR-012

---

## Phase 7: Polish

### T014: Add Auth Routes

**Priority**: P1
**Estimate**: S
**Dependencies**: T004, T007

**Description**: Add lazy-loaded routes for login and register pages.

**Acceptance Criteria**:
- [ ] /login route loads LoginPage
- [ ] /register route loads RegisterPage
- [ ] Routes use lazy loading with loadComponent

**Files**:
- `frontend/src/app/app.routes.ts` (modify)

**FR Coverage**: FR-014, FR-015

---

### T015: Final Integration Testing

**Priority**: P1
**Estimate**: S
**Dependencies**: T001-T014

**Description**: Verify complete auth flow works end-to-end.

**Acceptance Criteria**:
- [ ] Register new user → auto login → header shows name
- [ ] Logout → header shows Sign In
- [ ] Login with test@example.com / password123
- [ ] Invalid credentials show error
- [ ] Remember me persists session
- [ ] No remember me clears on browser close (verify sessionStorage)
- [ ] Password visibility toggle works on both pages
- [ ] Responsive layout on mobile

**Files**: None (testing only)

**FR Coverage**: All FR verified

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 15 |
| P0 (Blockers) | 3 |
| P1 (Core) | 10 |
| P2 (Enhancement) | 2 |
| Estimated Effort | S:7, M:5, L:1 |

## Execution Order

```
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015
```

All tasks are sequential due to dependencies. T004-T006 (Register) and T007-T009 (Login) could theoretically run in parallel after T003, but for implementation clarity, execute sequentially.
