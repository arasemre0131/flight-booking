# Tasks: Search Results - Sidebar Content

**Branch**: `005-search-sidebar` | **Date**: 2025-01-31
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

| Metric | Value |
|--------|-------|
| Total Tasks | 17 |
| User Stories | 2 |
| Parallel Opportunities | 6 tasks |
| Estimated Lines | ~300-350 |

## User Story Mapping

| Story | Priority | Tasks | Independent Test |
|-------|----------|-------|------------------|
| US1 - View Hotel Recommendations | P2 | T005-T011 | Navigate to `/search?origin=SFO&destination=NRT`, verify "Find places to stay in Tokyo" header and 3 hotel cards display |
| US2 - Discover Related Destinations | P3 | T012-T015 | On results page, verify "People also search for" section shows 3 destination cards horizontally |

---

## Phase 1: Setup

> Foundation: Create data models and mock data files.

- [x] T001 [P] Create Hotel TypeScript interface in `frontend/src/app/models/hotel.model.ts`
- [x] T002 [P] Create RelatedDestination TypeScript interface in `frontend/src/app/models/destination.model.ts`
- [x] T003 [P] Create hotels mock data array (3 hotels) in `frontend/src/app/mock-data/hotels.data.ts`
- [x] T004 [P] Create destinations mock data array (3 destinations) in `frontend/src/app/mock-data/destinations.data.ts`

---

## Phase 2: User Story 1 - View Hotel Recommendations (P2)

> **Goal**: Display hotel recommendations in sidebar with "Find places to stay in [City]" header and 3 hotel cards.
>
> **Independent Test**: Navigate to `http://localhost:4200/search?origin=SFO&destination=NRT&departureDate=2025-03-15&adults=1`, verify sidebar shows "Find places to stay in Tokyo" header and 3 hotel cards with images, names, descriptions, and prices.

- [x] T005 [US1] Generate hotel-card component with `npx ng generate component components/hotel-card --standalone`
- [x] T006 [P] [US1] Implement hotel-card component template in `frontend/src/app/components/hotel-card/hotel-card.component.html`
- [x] T007 [P] [US1] Implement hotel-card component styles (image, hover effect) in `frontend/src/app/components/hotel-card/hotel-card.component.scss`
- [x] T008 [US1] Implement hotel-card component logic (input: Hotel) in `frontend/src/app/components/hotel-card/hotel-card.component.ts`
- [x] T009 [US1] Generate sidebar-content component with `npx ng generate component components/sidebar-content --standalone`
- [x] T010 [US1] Implement sidebar-content component with hotels section in `frontend/src/app/components/sidebar-content/sidebar-content.component.html`
- [x] T011 [US1] Add destination city input and hotel rendering to `frontend/src/app/components/sidebar-content/sidebar-content.component.ts`

---

## Phase 3: User Story 2 - Discover Related Destinations (P3)

> **Goal**: Display "People also search for" section with 3 destination cards in a horizontal row.
>
> **Independent Test**: On search results page, verify "People also search for" section displays below hotels with 3 destination cards showing city names and flight prices.

- [x] T012 [US2] Generate destination-card component with `npx ng generate component components/destination-card --standalone`
- [x] T013 [P] [US2] Implement destination-card component template in `frontend/src/app/components/destination-card/destination-card.component.html`
- [x] T014 [P] [US2] Implement destination-card component styles (image background, overlay, hover) in `frontend/src/app/components/destination-card/destination-card.component.scss`
- [x] T015 [US2] Implement destination-card component logic and add destinations section to sidebar-content in `frontend/src/app/components/sidebar-content/sidebar-content.component.ts`

---

## Phase 4: Integration & Polish

> Final integration: Connect sidebar-content to search-results page, verify responsive behavior.

- [x] T016 Integrate sidebar-content into search-results page, replace placeholder in `frontend/src/app/pages/search-results/search-results.html`
- [x] T017 Add SidebarContentComponent import and destination city extraction to `frontend/src/app/pages/search-results/search-results.ts`

---

## Dependencies

```
T001, T002, T003, T004 (Setup - all parallel)
    │
    └──► T005 → T006, T007 (parallel) → T008 (Hotel Card)
              │
              └──► T009 → T010 → T011 (US1 Complete)
                            │
                            └──► T012 → T013, T014 (parallel) → T015 (US2 Complete)
                                          │
                                          └──► T016 → T017 (Integration)
```

## Parallel Execution Examples

**Phase 1 (Setup)**:
```bash
# All 4 tasks can run in parallel - different files
T001: Create hotel.model.ts
T002: Create destination.model.ts
T003: Create hotels.data.ts
T004: Create destinations.data.ts
```

**Phase 2 (US1 - Hotel Cards)**:
```bash
# After T005 generates component, template and styles can be parallel
T006: Implement hotel-card template
T007: Implement hotel-card styles
```

**Phase 3 (US2 - Destination Cards)**:
```bash
# After T012 generates component, template and styles can be parallel
T013: Implement destination-card template
T014: Implement destination-card styles
```

---

## Implementation Strategy

### MVP Scope (Recommended)

For fastest time-to-demo, implement in this order:

1. **Phase 1**: Setup (T001-T004)
2. **Phase 2**: US1 - Hotel Recommendations (T005-T011) ← MVP Complete

This delivers a working sidebar with hotel cards that validates the integration pattern.

### Full Implementation

Continue with:
3. **Phase 3**: US2 - Related Destinations (T012-T015)
4. **Phase 4**: Integration & Polish (T016-T017)

---

## Task Details

### T001: Create Hotel Interface

**File**: `frontend/src/app/models/hotel.model.ts`

```typescript
export interface Hotel {
  id: string;
  name: string;
  description: string;
  image: string;
  pricePerNight: number;
}
```

### T002: Create RelatedDestination Interface

**File**: `frontend/src/app/models/destination.model.ts`

```typescript
export interface RelatedDestination {
  city: string;
  image: string;
  flightPrice: number;
}
```

### T003: Create Hotels Mock Data

**File**: `frontend/src/app/mock-data/hotels.data.ts`

```typescript
import { Hotel } from '../models/hotel.model';

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'HTL001',
    name: 'Hotel Kaneyamaen',
    description: 'Traditional ryokan experience',
    image: 'assets/images/search-results/hotel-kaneyamaen.png',
    pricePerNight: 439
  },
  {
    id: 'HTL002',
    name: 'HOTEL THE FLAG',
    description: 'Modern city hotel in Osaka',
    image: 'assets/images/search-results/hotel-osaka.png',
    pricePerNight: 139
  },
  {
    id: 'HTL003',
    name: '9 Hours Shinjuku',
    description: 'Capsule hotel experience',
    image: 'assets/images/search-results/hotel-shinjuku.png',
    pricePerNight: 59
  }
];
```

### T004: Create Destinations Mock Data

**File**: `frontend/src/app/mock-data/destinations.data.ts`

```typescript
import { RelatedDestination } from '../models/destination.model';

export const MOCK_DESTINATIONS: RelatedDestination[] = [
  {
    city: 'Shanghai',
    image: 'assets/images/search-results/shanghai-night.png',
    flightPrice: 598
  },
  {
    city: 'Nairobi',
    image: 'assets/images/search-results/nairobi.png',
    flightPrice: 1248
  },
  {
    city: 'Seoul',
    image: 'assets/images/search-results/seoul.png',
    flightPrice: 589
  }
];
```

### T008: Hotel Card Component Logic

**File**: `frontend/src/app/components/hotel-card/hotel-card.component.ts`

**Inputs**:
- `hotel: Hotel` (required)

**Template**: Display hotel image, name, description, "from $X/night" price format

### T011: Sidebar Content Component

**File**: `frontend/src/app/components/sidebar-content/sidebar-content.component.ts`

**Inputs**:
- `destinationCity: string` (optional, defaults to "your destination")

**Features**:
- "Find places to stay in [City]" header with dynamic city name
- Load and display MOCK_HOTELS array
- Render hotel-card for each hotel

### T015: Destination Card & Sidebar Update

**File**: `frontend/src/app/components/destination-card/destination-card.component.ts`

**Inputs**:
- `destination: RelatedDestination` (required)

**Template**: Image background with city name and price overlay

**Sidebar Update**: Add "People also search for" section with 3 destination cards in horizontal row

### T017: Search Results Integration

**File**: `frontend/src/app/pages/search-results/search-results.ts`

**Features**:
- Import SidebarContentComponent
- Extract destination city from search criteria (use airport.city)
- Pass destinationCity to sidebar-content component

---

## Verification Checklist

After all tasks complete:

- [ ] Navigate to `/search` with query params, sidebar content loads
- [ ] "Find places to stay in Tokyo" header displays (dynamic city)
- [ ] 3 hotel cards display vertically with images, names, descriptions
- [ ] Hotel prices show "from $X/night" format
- [ ] Hover over hotel card shows visual effect
- [ ] "People also search for" header displays
- [ ] 3 destination cards display horizontally
- [ ] Destination cards show city name and price overlay on image
- [ ] Hover over destination card shows visual effect
- [ ] At 768px breakpoint, sidebar moves below flight list
- [ ] No console errors
- [ ] Build succeeds with `npx ng build`
