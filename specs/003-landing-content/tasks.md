# Tasks: Landing Page Content

**Branch**: `003-landing-content` | **Date**: 2025-01-30
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

| Metric | Value |
|--------|-------|
| Total Tasks | 15 |
| User Stories | 4 |
| Parallel Opportunities | 6 tasks |
| Estimated Lines | ~385 |

## User Story Mapping

| Story | Priority | Tasks | Independent Test |
|-------|----------|-------|------------------|
| US1 - Flight Deals | P1 | T005-T007 | Load page, verify 3 flight deal cards with images/prices |
| US2 - Featured Destination | P2 | T008-T009 | Scroll to featured section, verify Kenya card |
| US3 - Places to Stay | P2 | T010-T011 | Scroll to places section, verify 3 cards |
| US4 - Testimonials | P3 | T012-T014 | Scroll to testimonials, verify 3 review cards with ratings |

---

## Phase 1: Setup

> Foundation: Create data models and mock data shared by all user stories.

- [ ] T001 [P] Create TypeScript interfaces in `frontend/src/app/models/landing.model.ts`
- [ ] T002 [P] Create mock data arrays in `frontend/src/app/mock-data/landing.data.ts`

---

## Phase 2: Foundational Components

> Blocking: Reusable card components needed by multiple user stories.

- [ ] T003 [P] Generate and implement destination-card component in `frontend/src/app/components/destination-card/`
- [ ] T004 [P] Generate and implement testimonial-card component in `frontend/src/app/components/testimonial-card/`

---

## Phase 3: User Story 1 - Flight Deals (P1)

> **Goal**: Display 3 flight deal cards (Shanghai, Sydney, Kyoto) with images, landmark names, cities, and prices.
>
> **Independent Test**: Navigate to http://localhost:4200, scroll below hero, verify 3 destination cards display with correct content and hover effects.

- [ ] T005 [US1] Import mock data and destination-card component in `frontend/src/app/pages/landing/landing.component.ts`
- [ ] T006 [US1] Add Flight Deals section HTML with 3 destination-cards in `frontend/src/app/pages/landing/landing.component.html`
- [ ] T007 [US1] Add Flight Deals section styles (title, card grid) in `frontend/src/app/pages/landing/landing.component.scss`

---

## Phase 4: User Story 2 - Featured Destination (P2)

> **Goal**: Display full-width Kenya/Nairobi card with large image, description, and price.
>
> **Independent Test**: Scroll past Flight Deals, verify full-width Kenya card displays with image, "Nairobi, Kenya", description, and $1,248 price.

- [ ] T008 [US2] Add Featured Destination section HTML in `frontend/src/app/pages/landing/landing.component.html`
- [ ] T009 [US2] Add Featured Destination styles (full-width layout, text overlay) in `frontend/src/app/pages/landing/landing.component.scss`

---

## Phase 5: User Story 3 - Places to Stay (P2)

> **Goal**: Display 3 accommodation cards (Maldives, Morocco, Mongolia) with images and location names.
>
> **Independent Test**: Scroll to Places section, verify 3 cards display with images and titles, hover effects work.

- [ ] T010 [US3] Add Places to Stay section HTML with 3 destination-cards in `frontend/src/app/pages/landing/landing.component.html`
- [ ] T011 [US3] Add Places to Stay section styles in `frontend/src/app/pages/landing/landing.component.scss`

---

## Phase 6: User Story 4 - Testimonials (P3)

> **Goal**: Display 3 user review cards with avatars, names, locations, 5-star ratings, and review text.
>
> **Independent Test**: Scroll to Testimonials section, verify 3 cards display with avatars, names, 5 filled stars, and review text.

- [ ] T012 [US4] Add Testimonials section HTML with 3 testimonial-cards in `frontend/src/app/pages/landing/landing.component.html`
- [ ] T013 [US4] Add Testimonials section styles in `frontend/src/app/pages/landing/landing.component.scss`

---

## Phase 7: Polish & Cross-Cutting

> Final verification and responsive testing.

- [ ] T014 Add section title highlight styles (.highlight class for purple text) in `frontend/src/app/pages/landing/landing.component.scss`
- [ ] T015 Verify responsive layout (3-column → 1-column at 768px) across all sections

---

## Dependencies

```
T001, T002 (Setup - parallel)
    │
    └──► T003, T004 (Foundational - parallel)
              │
              ├──► T005 → T006 → T007 (US1: Flight Deals)
              │
              ├──► T008 → T009 (US2: Featured Destination)
              │
              ├──► T010 → T011 (US3: Places to Stay)
              │
              └──► T012 → T013 (US4: Testimonials)
                        │
                        └──► T014, T015 (Polish)
```

## Parallel Execution Examples

**Phase 1 (Setup)**:
```bash
# Can run in parallel - different files
T001: Create landing.model.ts
T002: Create landing.data.ts
```

**Phase 2 (Foundational)**:
```bash
# Can run in parallel - different components
T003: Implement destination-card component
T004: Implement testimonial-card component
```

**Phase 3-6 (User Stories)**:
```bash
# US1, US2, US3 can start in parallel after Phase 2
# US4 depends on T004 (testimonial-card)
```

---

## Implementation Strategy

### MVP Scope (Recommended)

For fastest time-to-demo, implement in this order:

1. **Phase 1-2**: Setup + Foundational (T001-T004)
2. **Phase 3**: US1 - Flight Deals (T005-T007) ← MVP Complete

This delivers a working landing page with the highest-priority content.

### Full Implementation

Continue with:
3. **Phase 4**: US2 - Featured Destination (T008-T009)
4. **Phase 5**: US3 - Places to Stay (T010-T011)
5. **Phase 6**: US4 - Testimonials (T012-T013)
6. **Phase 7**: Polish (T014-T015)

---

## Task Details

### T001: Create TypeScript Interfaces

**File**: `frontend/src/app/models/landing.model.ts`

```typescript
export interface FlightDeal {
  id: number;
  image: string;
  landmark: string;
  city: string;
  price: number;
  tripType: 'Round trip';
}

export interface FeaturedDestination {
  image: string;
  city: string;
  country: string;
  description: string;
  price: number;
}

export interface PlaceToStay {
  id: number;
  image: string;
  title: string;
}

export interface Testimonial {
  id: number;
  avatar: string;
  name: string;
  location: string;
  rating: number;
  review: string;
}
```

### T002: Create Mock Data

**File**: `frontend/src/app/mock-data/landing.data.ts`

See `data-model.md` for complete mock data arrays:
- `FLIGHT_DEALS` (3 items)
- `FEATURED_DESTINATION` (1 item)
- `PLACES_TO_STAY` (3 items)
- `TESTIMONIALS` (3 items)

### T003: Destination Card Component

**Files**: `frontend/src/app/components/destination-card/`

**Inputs**:
- `image: string` (required)
- `title: string` (required)
- `subtitle: string` (required)
- `price?: number` (optional)
- `tripType?: string` (optional)

**Template**: Image with lazy loading, title, subtitle, optional price line

**Styles**: Card with rounded corners, hover effect (translateY + shadow)

### T004: Testimonial Card Component

**Files**: `frontend/src/app/components/testimonial-card/`

**Inputs**:
- `avatar: string` (required)
- `name: string` (required)
- `location: string` (required)
- `rating: number` (required)
- `review: string` (required)

**Template**: Quote text, 5 star SVGs, avatar with name/location

**Styles**: Card with quote styling, avatar alignment at bottom

---

## Verification Checklist

After all tasks complete:

- [ ] Flight Deals section shows 3 cards with images loading
- [ ] Featured Destination shows full-width Kenya card
- [ ] Places to Stay shows 3 cards without prices
- [ ] Testimonials shows 3 cards with 5-star ratings
- [ ] Section titles have purple highlighted keywords
- [ ] All cards have hover effects
- [ ] Layout is responsive (3-col → 1-col at 768px)
- [ ] No console errors
- [ ] All 10 images load successfully
