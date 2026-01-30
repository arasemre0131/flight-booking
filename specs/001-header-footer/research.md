# Research: Header & Footer Components

**Feature**: 001-header-footer
**Date**: 2025-01-30

## Research Tasks

### 1. Angular 17+ Standalone Components

**Decision**: Use Angular standalone components (no NgModule)

**Rationale**: 
- Angular 17+ defaults to standalone components
- Simpler imports, better tree-shaking
- Project already initialized with standalone structure

**Alternatives considered**:
- NgModule-based components: Rejected (legacy pattern, more boilerplate)

### 2. Responsive Navigation Pattern

**Decision**: CSS-only mobile menu with checkbox hack or minimal JS toggle

**Rationale**:
- Hamburger menu on mobile (< 768px)
- Simple state toggle, no external dependencies
- Angular's built-in mechanisms sufficient

**Alternatives considered**:
- Third-party hamburger library: Rejected (overkill for simple toggle)
- CSS-only checkbox hack: Viable but less accessible
- Angular signal for menu state: Selected (modern, reactive)

### 3. Sticky Header Implementation

**Decision**: CSS `position: sticky` with `top: 0`

**Rationale**:
- Native browser support (97%+ coverage)
- No JavaScript required
- Better performance than scroll listeners

**Alternatives considered**:
- JavaScript scroll listener: Rejected (unnecessary complexity)
- `position: fixed`: Requires body padding adjustment

### 4. Auth State Management

**Decision**: Simple BehaviorSubject in AuthService (stub)

**Rationale**:
- Header needs to react to login/logout
- BehaviorSubject provides current value + updates
- Will be replaced with real auth in SPEC-004A

**Alternatives considered**:
- NgRx/Signal Store: Overkill for MVP
- Local component state: Cannot share across components

### 5. CSS Architecture

**Decision**: Component-scoped SCSS with shared variables

**Rationale**:
- Angular's ViewEncapsulation handles scoping
- Shared color variables in `styles.scss`
- BEM-like class naming for clarity

**Alternatives considered**:
- Tailwind CSS: Not in project setup
- CSS Modules: Angular SCSS is equivalent

## Resolved Clarifications

All technical decisions made. No NEEDS CLARIFICATION items remaining.

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| @angular/core | 17.x | Component framework |
| @angular/router | 17.x | Navigation (routerLink) |
| @angular/common | 17.x | NgIf, NgFor, AsyncPipe |

## Next Steps

Proceed to Phase 1: data-model.md and quickstart.md
