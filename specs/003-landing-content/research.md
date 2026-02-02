# Research: Landing Page Content

**Branch**: `003-landing-content` | **Date**: 2025-01-30

## Research Tasks

### 1. Angular Image Optimization

**Decision**: Use native `loading="lazy"` attribute for image lazy loading

**Rationale**:
- Angular 17+ supports native lazy loading without additional libraries
- Simple implementation with `<img loading="lazy">`
- Browser-native solution with good support (all modern browsers)
- No bundle size impact

**Alternatives Considered**:
- `@angular/core` Deferrable views (`@defer`) - Overkill for simple images
- Third-party libraries (ngx-lazy-load) - Unnecessary dependency
- Intersection Observer manual implementation - More code, same result

### 2. Responsive Grid Pattern

**Decision**: CSS Grid with `repeat(3, 1fr)` and media query at 768px

**Rationale**:
- Matches existing project breakpoint ($mobile: 768px)
- CSS Grid provides equal-width columns without flexbox calculations
- Simple single breakpoint aligns with Constitution (mobile-first)
- No JavaScript required for layout

**Alternatives Considered**:
- Flexbox with `flex-wrap` - More complex for equal-width columns
- CSS Container Queries - Not needed for simple 3→1 column transition
- Multiple breakpoints (tablet) - Over-engineering for MVP

### 3. Card Component Reusability

**Decision**: Single `destination-card` component with optional `price` and `tripType` inputs

**Rationale**:
- Flight Deals and Places to Stay cards have identical structure
- Optional inputs allow same component for both use cases
- Reduces code duplication
- Follows Constitution Principle II (component reusability)

**Alternatives Considered**:
- Separate `flight-deal-card` and `place-card` components - Duplication
- Generic `card` component - Too abstract for specific Figma design

### 4. Star Rating Display

**Decision**: Static SVG stars, always 5 filled (no rating variation)

**Rationale**:
- All testimonials have 5-star ratings per spec
- No need for dynamic rating logic
- SVG provides crisp rendering at any size
- Inline SVG for styling flexibility

**Alternatives Considered**:
- Unicode characters (★) - Inconsistent rendering across browsers
- Icon library (Font Awesome) - Unnecessary dependency
- Dynamic star component - Over-engineering for static 5-star display

### 5. Mock Data Location

**Decision**: Create `frontend/src/app/mock-data/landing.data.ts`

**Rationale**:
- Follows Angular convention for data files
- Separate from component logic
- Easy to replace with API calls later
- Matches project structure in CLAUDE.md

**Alternatives Considered**:
- JSON file in assets - Requires HTTP call
- Inline in component - Harder to maintain
- Environment file - Not appropriate for content data

## No Outstanding Research Items

All technical decisions resolved. Ready for Phase 1 design artifacts.
