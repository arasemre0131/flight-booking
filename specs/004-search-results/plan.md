# Implementation Plan: Search Results - Flight List

**Branch**: `004-search-results` | **Date**: 2025-01-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-search-results/spec.md`

## Summary

Implement the search results page displaying flight options with a compact search bar (pre-filled criteria), filter bar, and flight cards. The page has a two-column layout (flight list left, sidebar placeholder right on desktop). Flight cards show airline logo, duration, departure/arrival times, stops info, and price. Cards have hover and selected states. All data is static mock data.

## Technical Context

**Language/Version**: TypeScript 5.x with Angular 17+
**Primary Dependencies**: Angular 17+ (standalone components), RxJS, Angular Router
**Storage**: N/A (static mock data, URL query params for search criteria)
**Testing**: Jasmine + Karma (Angular default)
**Target Platform**: Web (Desktop + Mobile responsive)
**Project Type**: Web application (frontend page)
**Performance Goals**: Results load within 2 seconds, filter updates within 500ms
**Constraints**: Mobile-first responsive design, Figma design compliance
**Scale/Scope**: Search results page with flight list, compact search form, and filter bar

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Design-First Development | PASS | Flight cards and layout match Figma reference |
| II. Component-Based Architecture | PASS | Reusable flight-card, filter-bar components |
| III. Type Safety | PASS | TypeScript interfaces for Flight, Airline, Filter entities |
| IV. Responsive Design | PASS | Two-column desktop → single column mobile (768px breakpoint) |
| V. Simplicity (YAGNI) | PASS | Mock data, client-side filtering only, sidebar placeholder |

## Project Structure

### Documentation (this feature)

```text
specs/004-search-results/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── flight-card/
│   │   │   │   ├── flight-card.component.ts
│   │   │   │   ├── flight-card.component.html
│   │   │   │   └── flight-card.component.scss
│   │   │   ├── filter-bar/
│   │   │   │   ├── filter-bar.component.ts
│   │   │   │   ├── filter-bar.component.html
│   │   │   │   └── filter-bar.component.scss
│   │   │   └── search-form/ (update - add compact mode input)
│   │   ├── models/
│   │   │   ├── flight.model.ts (create)
│   │   │   └── filter.model.ts (create)
│   │   ├── mock-data/
│   │   │   ├── flights.data.ts (create)
│   │   │   └── airlines.data.ts (create)
│   │   └── pages/
│   │       └── search-results/
│   │           ├── search-results.component.ts (create)
│   │           ├── search-results.component.html (create)
│   │           └── search-results.component.scss (create)
│   └── assets/
│       └── images/
│           └── airlines/ (create - SVG logos)
```

**Structure Decision**: Web application frontend structure. Reusable flight-card and filter-bar components. Mock data for flights and airlines. Search results page composes compact search form, filter bar, and flight list.

## Complexity Tracking

No violations. Feature follows standard Angular component patterns with static mock data and URL-based search criteria.

## Component Breakdown

| Component | Purpose | Inputs | Reusable |
|-----------|---------|--------|----------|
| `flight-card` | Display single flight option | `flight`, `selected` | Yes |
| `filter-bar` | Display filter dropdowns | `filters`, filter change events | Yes |
| `search-form` | Search criteria (update) | `compact`, pre-filled criteria from URL | Yes |
| `search-results` (page) | Compose search bar, filters, flight list | N/A | No |

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                              HEADER                                   │
├─────────────────────────────────────────────────────────────────────┤
│  COMPACT SEARCH BAR                                                   │
│    [SFO] → [NRT]   [Dates]   [Passengers]   [Search]                │
├─────────────────────────────────────────────────────────────────────┤
│  FILTER BAR                                                           │
│    [Max price ▼] [Stops ▼] [Times ▼] [Airlines ▼] [Seat class ▼] [More ▼] │
├─────────────────────────────────────────────────────────────────────┤
│  CONTENT AREA (Two columns on desktop)                               │
│  ┌─────────────────────────────┬───────────────────────────────────┐ │
│  │  FLIGHT LIST                 │  SIDEBAR (placeholder)           │ │
│  │                              │                                   │ │
│  │  "Choose a departing flight"│  Reserved for SPEC-002B           │ │
│  │                              │                                   │ │
│  │  ┌──────────────────────┐   │                                   │ │
│  │  │  Flight Card 1       │   │                                   │ │
│  │  │  [Logo] 16h 45m      │   │                                   │ │
│  │  │  Hawaiian Airlines   │   │                                   │ │
│  │  │  7:00AM → 4:15PM     │   │                                   │ │
│  │  │  1 stop  $624        │   │                                   │ │
│  │  │  2h 45m in HNL       │   │                                   │ │
│  │  └──────────────────────┘   │                                   │ │
│  │                              │                                   │ │
│  │  ┌──────────────────────┐   │                                   │ │
│  │  │  Flight Card 2       │   │                                   │ │
│  │  │  ...                 │   │                                   │ │
│  │  └──────────────────────┘   │                                   │ │
│  │                              │                                   │ │
│  │  [Show all 249 flights]     │                                   │ │
│  └─────────────────────────────┴───────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                              FOOTER                                   │
└─────────────────────────────────────────────────────────────────────┘
```

## Styling Guidelines

**Brand Colors** (consistent with landing page):
- Primary: `#605DEC` (purple - hover background, selected border, active filter)
- Text Dark: `#27273F`
- Text Gray: `#6E7491`
- Background Light: `#F6F6FE`
- White: `#FFFFFF`

**Flight Card States**:
```scss
.flight-card {
  border: 1px solid #E9E8FC;
  border-radius: 8px;
  background: $bg-white;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #F6F4FF; // Light purple
  }

  &.selected {
    border-left: 4px solid $primary;
  }
}
```

**Filter Dropdown Pattern**:
```scss
.filter-dropdown {
  border: 1px solid #CBD4E6;
  border-radius: 4px;

  &.active {
    border-color: $primary;
  }
}
```

**Two-Column Layout**:
```scss
.results-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```

## Dependencies

### Required (must be implemented first)
- ✅ 001-header-footer: Header and Footer components
- ✅ 002-search-form: Search form component (needs compact mode update)
- ✅ 003-landing-content: Landing page content sections

### Deferred (separate spec)
- SPEC-002B: Sidebar content (hotels, destinations) - placeholder in this spec
