# Tasks: Header & Footer Components

**Feature**: 001-header-footer
**Branch**: `001-header-footer`
**Generated**: 2025-01-30
**Total Tasks**: 18

## Summary

| Phase | Description | Task Count |
|-------|-------------|------------|
| Phase 1 | Setup | 2 |
| Phase 2 | Foundational | 3 |
| Phase 3 | US1+US2: Header Navigation & Auth | 4 |
| Phase 4 | US3: Footer | 3 |
| Phase 5 | US4: Mobile Responsiveness | 3 |
| Phase 6 | Polish & Integration | 3 |

## Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational: Models, AuthService)
    ↓
Phase 3 (US1+US2: Header) ←──┐
    ↓                        │ Can run in parallel after Phase 2
Phase 4 (US3: Footer) ←──────┘
    ↓
Phase 5 (US4: Mobile) - Requires Header + Footer
    ↓
Phase 6 (Polish)
```

## MVP Scope

**Minimum Viable Product**: Phase 1 + Phase 2 + Phase 3
- Users can see header with navigation and auth buttons
- Can be tested independently

---

## Phase 1: Setup

**Goal**: Prepare project structure and global styles

- [ ] T001 Create shared directory structure at `frontend/src/app/shared/`
- [ ] T002 Add global SCSS variables (colors, breakpoints) in `frontend/src/styles.scss`

---

## Phase 2: Foundational

**Goal**: Create shared interfaces and services needed by all components

- [ ] T003 Create NavigationLink and FooterColumn interfaces in `frontend/src/app/models/navigation.model.ts`
- [ ] T004 Create User and AuthState interfaces in `frontend/src/app/models/user.model.ts`
- [ ] T005 Create AuthService stub with BehaviorSubject in `frontend/src/app/services/auth.service.ts`

---

## Phase 3: US1+US2 - Header Navigation & Authentication

**User Stories**: 
- US1: Navigate to Main Sections (P1)
- US2: Access Authentication (P1)

**Independent Test**: Load page → Header visible with logo, nav links, and auth buttons

### Tasks

- [ ] T006 [P] [US1] Create HeaderComponent class in `frontend/src/app/shared/header/header.component.ts`
- [ ] T007 [P] [US1] Create header template with logo and nav links in `frontend/src/app/shared/header/header.component.html`
- [ ] T008 [US2] Add auth buttons (Sign in/Sign up) and logged-in state (My trips/Avatar) to header template
- [ ] T009 [US1] Add header styles with sticky positioning in `frontend/src/app/shared/header/header.component.scss`

---

## Phase 4: US3 - Footer Information

**User Story**: US3: Access Footer Information (P2)

**Independent Test**: Scroll to bottom → Footer visible with 4 columns of links

### Tasks

- [ ] T010 [P] [US3] Create FooterComponent class in `frontend/src/app/shared/footer/footer.component.ts`
- [ ] T011 [P] [US3] Create footer template with 4-column layout in `frontend/src/app/shared/footer/footer.component.html`
- [ ] T012 [US3] Add footer styles with column layout in `frontend/src/app/shared/footer/footer.component.scss`

---

## Phase 5: US4 - Mobile Responsiveness

**User Story**: US4: Mobile Navigation (P3)

**Independent Test**: Resize to < 768px → Hamburger menu appears, footer stacks vertically

### Tasks

- [ ] T013 [US4] Add hamburger menu icon and mobile menu toggle to header template
- [ ] T014 [US4] Add mobile menu state (open/closed signal) to HeaderComponent
- [ ] T015 [US4] Add responsive styles for header (hamburger, mobile menu) and footer (stacked columns) in respective SCSS files

---

## Phase 6: Polish & Integration

**Goal**: Integrate components into app and verify consistency

- [ ] T016 Import HeaderComponent and FooterComponent in `frontend/src/app/app.ts`
- [ ] T017 Add header and footer to app template in `frontend/src/app/app.html`
- [ ] T018 Verify header/footer display on all routes, test hover states and mobile menu

---

## Parallel Execution Guide

### After Phase 2 completes:

```
┌─────────────────────────┐     ┌─────────────────────────┐
│ T006 HeaderComponent.ts │     │ T010 FooterComponent.ts │
│ T007 Header template    │ [P] │ T011 Footer template    │
└─────────────────────────┘     └─────────────────────────┘
```

### Within Phase 3:

```
┌─────────────────────────┐
│ T006 + T007 (parallel)  │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│ T008 (depends on T007)  │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│ T009 (depends on T007)  │
└─────────────────────────┘
```

---

## File Checklist

| File | Created In | Purpose |
|------|------------|---------|
| `frontend/src/styles.scss` | T002 | Global variables |
| `frontend/src/app/models/navigation.model.ts` | T003 | NavigationLink, FooterColumn |
| `frontend/src/app/models/user.model.ts` | T004 | User, AuthState |
| `frontend/src/app/services/auth.service.ts` | T005 | Auth state management |
| `frontend/src/app/shared/header/header.component.ts` | T006 | Header logic |
| `frontend/src/app/shared/header/header.component.html` | T007 | Header template |
| `frontend/src/app/shared/header/header.component.scss` | T009 | Header styles |
| `frontend/src/app/shared/footer/footer.component.ts` | T010 | Footer logic |
| `frontend/src/app/shared/footer/footer.component.html` | T011 | Footer template |
| `frontend/src/app/shared/footer/footer.component.scss` | T012 | Footer styles |
| `frontend/src/app/app.ts` | T016 | Import components |
| `frontend/src/app/app.html` | T017 | Use components |

---

## Acceptance Criteria Mapping

| Requirement | Task(s) |
|-------------|---------|
| FR-001: Logo links to home | T007 |
| FR-002: Nav links (Flights, Hotels, Packages) | T007 |
| FR-003: Sign in/Sign up for guests | T008 |
| FR-009: My trips/Avatar for logged-in | T008 |
| FR-010: Sticky header | T009 |
| FR-004: Footer 4 columns | T011 |
| FR-005: Hover states purple | T009, T012 |
| FR-006: Sign up button style | T009 |
| FR-007: Consistent on all pages | T016, T017, T018 |
| FR-008: Mobile menu | T013, T014, T015 |
| FR-011: Footer stacks on mobile | T015 |
