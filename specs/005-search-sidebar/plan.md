# Implementation Plan: Search Results - Sidebar Content

**Branch**: `005-search-sidebar` | **Date**: 2025-01-31
**Spec**: [spec.md](./spec.md) | **Tasks**: [tasks.md](./tasks.md)

## Technical Context

### Stack
- **Frontend**: TypeScript 5.x with Angular 17+ (standalone components), RxJS, Angular Router
- **Styling**: SCSS with component-scoped styles
- **Data**: Mock data (no backend integration)

### Relevant Existing Code
- `frontend/src/app/pages/search-results/` - Existing search results page with sidebar placeholder
- `frontend/src/app/models/` - TypeScript interfaces
- `frontend/src/app/mock-data/` - Mock data files (airlines.data.ts, flights.data.ts)
- `frontend/design/images/search-results/` - 6 images (3 hotels, 3 destinations)

### Dependencies
- 004-search-results must be complete (provides page structure and sidebar placeholder)
- Existing search criteria parsing (fromQueryParams) for destination city extraction

### Technical Decisions Needed
- None - all requirements are clear

## Constitution Check

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Design-First | ✅ Pass | Follows Figma design with hotel cards and destination cards |
| II. Component-Based | ✅ Pass | Will create hotel-card and destination-card standalone components |
| III. Type Safety | ✅ Pass | Will define Hotel and RelatedDestination interfaces |
| IV. Responsive Design | ✅ Pass | Sidebar moves below flight list at 768px breakpoint |
| V. Simplicity (YAGNI) | ✅ Pass | Display-only cards, static mock data, no navigation |

**Gate Evaluation**: All principles satisfied. Proceeding with implementation.

## Implementation Approach

### Phase 1: Data Models & Mock Data
1. Create `Hotel` interface in `models/hotel.model.ts`
2. Create `RelatedDestination` interface in `models/destination.model.ts`
3. Create mock data files with 3 hotels and 3 destinations

### Phase 2: Reusable Components
1. Generate `hotel-card` standalone component
2. Generate `destination-card` standalone component
3. Implement templates with hover effects

### Phase 3: Sidebar Integration
1. Create `sidebar-content` component to organize hotels and destinations
2. Replace sidebar placeholder in search-results page
3. Extract destination city from search criteria for dynamic header

### File Changes

| File | Action | Description |
|------|--------|-------------|
| `models/hotel.model.ts` | Create | Hotel interface |
| `models/destination.model.ts` | Create | RelatedDestination interface |
| `mock-data/hotels.data.ts` | Create | 3 hotel mock data items |
| `mock-data/destinations.data.ts` | Create | 3 destination mock data items |
| `components/hotel-card/` | Create | Hotel card component (3 files) |
| `components/destination-card/` | Create | Destination card component (3 files) |
| `components/sidebar-content/` | Create | Sidebar container component (3 files) |
| `pages/search-results/search-results.html` | Modify | Replace placeholder with sidebar-content |
| `pages/search-results/search-results.ts` | Modify | Import sidebar-content, pass destination city |

### Estimated Scope
- **New files**: 11 (models, mock-data, 3 components × 3 files each + 2)
- **Modified files**: 2 (search-results page)
- **Lines**: ~300-350

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Image paths incorrect | Verify paths match IMAGE-MAPPING.md |
| Responsive layout issues | Test at 768px breakpoint |
| Destination city extraction | Use existing airport service lookup |

## Artifacts to Generate

- [x] plan.md (this file)
- [x] research.md
- [x] data-model.md
- [x] quickstart.md
